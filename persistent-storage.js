'use strict';

const fs = require('fs');

const storageFileName = './storage.json';

function loadFromDisk() {
    return new Promise(function(resolve, reject) {
        fs.readFile(storageFileName,'utf-8', function read(err, data) {
            if (!data || data.length === 0) {
                return reject('There\'s nothing to see here');
            } else if (err) {
                return reject(err);
            }
            let content = JSON.parse(data);
            return resolve(content);
        });
    });
}

var savingPromise = Promise.resolve();;

function saveToDisk(content) {
    savingPromise = savingPromise.then(function () {
        return new Promise(function(resolve, reject) {
            fs.writeFile(storageFileName, JSON.stringify(content), function(err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    });

    return savingPromise;
}

module.exports = {
    saveToDisk: saveToDisk,
    loadFromDisk: loadFromDisk
};