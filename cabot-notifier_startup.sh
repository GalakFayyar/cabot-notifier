#!/bin/bash

nvm use lts/boron
pm2 delete INT_cabot-notifier PROD_cabot-notifier
CABOTNOTIFIER_ENV=int pm2 start /home/mdrouian/Integration/Projects/cabot-notifier/app.js --name INT_cabot-notifier
CABOTNOTIFIER_ENV=prod pm2 start /home/mdrouian/Integration/Projects/cabot-notifier/app.js --name PROD_cabot-notifier

