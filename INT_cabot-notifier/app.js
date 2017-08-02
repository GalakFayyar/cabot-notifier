const notifier = require('node-notifier');
const request = require('request');
const path = require('path');
const config = require('./config/config');
var CronJob = require('cron').CronJob;

new CronJob({
    cronTime: '0 */5 * * * *',
    onTick: function () {
        const instances = [];
        const notification = [];
        var nbPassing = 0;
        var nbWarning = 0;
        var nbError = 0;
        var nbCritical = 0;
        callAPI(config.url + '/instances/').then(function (result) {
            result.forEach(function (instance) {
                instances.push(callAPI(config.url + '/instances/' + instance.id));
            });

            return Promise.all(instances);
        }, function (error) {
            console.error(error);
        }).then(function (results) {
            results.forEach(function (result) {
                switch (result.overall_status) {
                    case 'PASSING':
                        nbPassing++;
                        break;
                    case 'WARNING':
                        nbWarning++;
                        notification.push(result.name + ": " + result.overall_status + "\n");
                        break;
                    case 'ERROR':
                        nbError++;
                        notification.push(result.name + ": " + result.overall_status + "\n");
                        break;
                    case 'CRITICAL':
                        nbCritical++;
                        notification.push(result.name + ": " + result.overall_status + "\n");
                        break;
                    default:
                        break;
                }
            });
            notification.push("\nResults :\nPassing: " + nbPassing + " Warning: " + nbWarning + " Error: " + nbError + " Critical: " + nbCritical + "\n");
            sendNotification(notification.join(""));
        });
    },
    start: true
});


function callAPI(url) {
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: 'GET', //Specify the method
            json: true

        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    })
}

function sendNotification(message) {
    return notifier.notify({
        'title': config.notif.title,
        'message': message,
        icon: path.join(__dirname + "/img", 'cabot.png')
    });
}