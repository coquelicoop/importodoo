#!/bin/bash
node /home/coquelicoop/importOdoo/main.js &>> /home/coquelicoop/balance/import.log
read -n1 -r -p "Lire le log sur ~/balance/import.log - Appuyer sur une touche ..."
