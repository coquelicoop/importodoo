# Importation de produits depuis Odoo en ligne de commande

La configuration est la même que pour l'application **Produits**.  
Le fichier de `config.json` a le même format et la même signification.

L'application permet :
- de récupérer les produits de Odoo selon le filtre de leur code-barre,
- de créer le fichier partagé `articles.csv` mis à disposition des balances.

Si le contenu du fichier est le même que le précédent, un message à la console le dit et le fichier antérieur n'est pas réécrit.  
Sinon le fichiers `articles.csv` est écrasé et sa nouvelle image est mise dans le répertoire ./archives avec sa date et heure comme nom.

### Installation
S'assurer que **Node.js** est bien installé sur le poste : voir le site https://nodejs.org/

Décompresser l'archive importodoo.zip / importodoo.tar.gz dans le répertoire de *balance*.  

### Lancement
Depuis le répertoire d'installation :  

    cd importodoo  
    node main.js  

Si le directory de la balance n'est pas **~/balance** on peut l'indiquer sur la ligne de commande :  

    node main.js dir=/truc/mabalance  
