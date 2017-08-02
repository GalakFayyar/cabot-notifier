#!/bin/bash

nvm use lts/boron
#pm2 delete INT_cabot-notifier PROD_cabot-notifier

# Install nodes_modules
cd INT_cabot-notifier/
npm install
cd ..
cd PROD_cabot-notifier/
npm install

# Lancement des instances
CABOTNOTIFIER_ENV=int pm2 start /home/tfalcher/devs/tools/cabot-notifier/INT_cabot-notifier/app.js --name INT_cabot-notifier
CABOTNOTIFIER_ENV=prod pm2 start /home/tfalcher/devs/tools/cabot-notifier/PROD_cabot-notifier/app.js --name PROD_cabot-notifier

