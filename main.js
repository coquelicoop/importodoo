const config = require('./config').config
const getArticles = require('./importodoo').getArticles
const { Readable } = require('stream')
const fs = require('fs')
const path = require('path')
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier

// constante nécessaire pour l'écriture de fichiers CSV depuis une liste d'objets
const header = [
    { id: 'id', title: 'id' },
    { id: 'nom', title: 'nom' },
    { id: 'code-barre', title: 'code-barre' },
    { id: 'prix', title: 'prix' },
    { id: 'categorie', title: 'categorie' },
    { id: 'unite', title: 'unite' },
    { id: 'image', title: 'image' }
]

// directory racine
const dir = config.dir

// directory contenant les archives des derniers fichiers mis à disposition des balances
const archivesPath = path.join(dir, 'archives')

// nom du fichier de référence articles.csv mis à disposition des balances
const articlesPath = path.join(dir, 'articles.csv')
// const articlesPath2 = path.join(dir, 'articles2.csv')

/* Edition d'un nombre à 2 chiffres avec 0 devant s'il est inférieur à 10 */
function e2(n) { return e2 === 0 ? '00' : (n < 10 ? '0' + n : '' + n) }

/* Date et heure courante en secpndes sous la forme : 2020-03-21_152135 */
function dateHeure () {
    const d = new Date()
    return d.getFullYear() + '-' + e2(d.getMonth() + 1) + '-' + e2(d.getDate()) + '_' + e2(d.getHours()) + e2(d.getMinutes()) + e2(d.getSeconds())
}

// lecture du fichier articles.csv actuel pour détection d'un changement de contenu éventuel
let actuel = ''
try {
    actuel = fs.readFileSync(articlesPath, 'utf8')
} catch (err) { 
    console.log('Pas de fichiers articles.csv existant')
}

getArticles()
.then(articles => {
    const csvStringifier = createCsvStringifier({ header: header, fieldDelimiter: ';' })
    const s = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(articles)
    if (s != actuel) {
        fs.writeFileSync(articlesPath, s, (err) => { ko(err) })
        fs.writeFileSync(path.join(archivesPath, dateHeure() + '.csv'), s, (err) => { ko(err) })
    } else {
        console.log('Fichier articles.csv inchangé par rapport à l\'existant : n\'est pas réécrit')
    }
    process.exit()
}).catch(err => {
    ko(err)
})

function ko(err) {
    console.log(err)
    process.exit()
}
