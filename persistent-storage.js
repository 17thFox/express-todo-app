

const fs = require('fs');

const storageFileName = './storage.json';

function loadFromDisk() {
  return new Promise((resolve, reject) => {
    fs.readFile(storageFileName, 'utf-8', (err, data) => {
      if (!data || data.length === 0) {
        return reject('There\'s nothing to see here');
      } else if (err) {
        return reject(err);
      }
      const content = JSON.parse(data);
      return resolve(content);
    });
  });
}

let savingPromise = Promise.resolve();

function saveToDisk(content) {
  savingPromise = savingPromise.then(() => new Promise((resolve, reject) => {
    fs.writeFile(storageFileName, JSON.stringify(content), (err) => {
      if (err) { reject(err); } else {
        resolve();
      }
    });
  }));

  return savingPromise;
}

module.exports = {
  saveToDisk,
  loadFromDisk,
};
