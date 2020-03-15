/*
Le module 'config' récupère le fichier config.json et exporte l'objet correspondant 'config'.
Il est exactement identique dans "balance" et "produits".
Le fichier config.json est dans le directory de travail :
- soit dans le home directory sous le nom balance : ~/balance
- soit passé sur la ligne de commande en option : balance dir=/home/machin/mabalance1
En cas d'erreur une boîte de dialogue module informe l'utilisateur et sort de l'application.
La propriété config.version donne la version de l'application en production (en développement c'est celle de Quasar, on s'en fiche).
La méthode quit() de config sort de l'application.
*/

const path = require('path')
const fs = require('fs')

class Config {
}
const config = new Config()

exports.config = config

try {
    let dir
    const argv = process.argv
    for (let i = 0; i < argv.length; i++) {
        const x = argv[i]
        if (x && x.startsWith('dir=')) {
            dir = x.substring(4)
            break
        }
    }
    if (!dir) { dir = require('os').homedir() + '/balance' }
    config.dir = path.normalize(dir)
    const rawdata = fs.readFileSync(path.join(config.dir, 'config.json'))
    if (rawdata) {
        const obj = JSON.parse(rawdata)
        for (let f in obj) { config[f] = obj[f] }
    }
} catch (e) {
    console.error('Configuration config.json incorrecte ou non trouvée dans ' + config.dir)
}
