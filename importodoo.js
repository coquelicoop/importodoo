/*
Module d'interrogation de Odoo pour récupérer les produits selon les valeurs min et max des code-barres
Typiquement ceux commençant par 2.
L'API employé est JSON et le module trouvé est saidimi/odoo : il a l'air de marcher.
Toutefois la récupération des erreurs de connexion est mauvaise et le timeout non paramétrable.
Ceci a été corrigé dans oddo.js : lignes 17 34 71En configuration :
    "host": "coquelicoop.druidoo.io", // host hébergeant le serveur
    "port": 443, // port du serveur recevant les requêtes d'API
    "https": true,
    "database": "coquelicoop", // nom de la base
    "username": "monlogin@sportes.fr",
    "password": "xxxxx",
    "timeout": 5000, // temps d'attente maximal d'une connection 5s
    "map": {"id":"id", "name_template":"nom", "barcode":"code-barre", ... } // Pour chaque propriétés de product.product, nom de colonne dans le fichier CSV d'échange

    Une recherche = une connexion (pas de réutilisation de la connexion
*/
// https://github.com/saidimu/odoo

// import { remote } from 'electron'

// const Odoo = remote.require('odoo')
const Odoo = require('./odoo')
const config = require('./config').config

const map = config.map || { 'id': 'id', 'image': 'image', 'name': 'nom', 'barcode': 'code-barre', 'list_price': 'prix', 'categ_id': 'categorie', 'uom_id': 'unite' }

/*
Categories d'articles acceptées. Remplacées par celle indiquée dans la map. Si non trouvée:
- ignorées si 'défaut':''
- remplacée si 'défaut': 'autre catégorie'
*/
const categories = config.categories || { 'défaut': 'A' }
function transcodeCategorie (c) {
    let i = c.lastIndexOf('/ ')
    let x = i === -1 ? c : c.substring(i + 2)
    return categories[x] || categories['défaut']
}

/* Liste des propriétés de product.product à récupérer */
const fields = []
for (let f in map) { fields.push(f) }

/* Curieux nom : c'est la condition de filtre des produits pour l'API */
// const domain = [['barcode', '>=', minCB], ['barcode', '<=', maxCB], ['sale_ok', '=', true]]
const domain = config.selection

const odoo = new Odoo({
    https: config.https || false,
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    timeout: config.timeoutodoo || 5000
})

function codeDeId(x) {
    let i = x.indexOf(',')
    return i === -1 ? x : x.substring(i + 1)
}

function getArticles () {
    return new Promise((resolve, reject) => {
        odoo.connect(err => {
            if (err) {
                reject(err)
            } else {
                const params = { // paramètres requis pour le search_read
                    ids: [],
                    domain: domain,
                    fields: fields, // omettre cette ligne pour avoir TOUS les champs
                    order: '',
                    limit: 9999,
                    offset: 0
                }
                odoo.search_read('product.product', params, (err, products) => {
                    if (err) {
                        reject(err)
                    } else {
                        const res = []
                        for (let i = 0, r = null; (r = products[i]); i++) {
                            // console.log(JSON.stringify(r))
                            const a = {}
                            // mapping entre les champs reçus et les noms des colonnes (propriété de l'article)
                            for (let f in map) { if (r[f])  a[map[f]] = '' + r[f] }
                            /*
                            Les champs uom_id (unite) et categ_id (categorie) sont à traiter : le code figure après la virgule
                            */
                            a.unite = codeDeId(a.unite)
                            let c = transcodeCategorie(a.categorie)
                            if (c) {
                                 a.categorie = c
                                 // console.log(JSON.stringify(a))
                                 res.push(a)
                             }
                         }
                        resolve(res)
                    }
                })
            }
        })
    })
}
exports.getArticles = getArticles
