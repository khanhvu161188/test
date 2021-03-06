const usbDetect = require('usb-detection');
const copydir = require('copy-dir');
const rimraf = require('rimraf');
const fs = require('fs');
const fse = require('fs-extra');
const drivelist = require('drivelist');

const dir = 'Pictures';
const TIMEOUT_TO_RECEIVE_DEVICE = 5000;
class PhotoController {
  constructor() {}

  loadDevices(datetime) {
    return new Promise((resolve, reject) => {
      console.log('Loading devices ...');
      const destPath = __dirname + '/../../' + dir;
      drivelist.list((error, drives) => {
        if (error) {
          reject(error);
        }
        drives.forEach(element => {
          if (element.isUSB) {
            rimraf(destPath, (_error) => {
              if (!_error) {
                const listPromisePoints = [];
                element.mountpoints.forEach((point) => {
                  const promise = new Promise((_resolve, _reject) => {
                    var path = point.path;
                    this.copyFiles(datetime, path, destPath)
                      .then(_resolve)
                      .catch(_reject);
                  });
                  listPromisePoints.push(promise);
                })
                Promise.all(listPromisePoints)
                  .then(resolve)
                  .catch(reject);
              } else {
                reject(_error)
              }
            })
          }
        });
      });
    })
  }

  copyFiles(datetime, path, dest) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (error, items) => {
        if (!error) {
          const listPromises = [];
          items.forEach((item) => {
            const promise = new Promise((_resolve, _reject) => {
              const filePath = `${path}/${item}`;
              const destPath = `${dest}/${item}`;
              fs.stat(filePath, (err, stats) => {
                if (err) {
                  _reject(err)
                } else if (!stats.isDirectory()) {
                  if (datetime) {
                    const timestampDatetime = Math.floor((new Date(datetime)) / 1000);
                    const lastModified = Math.floor((new Date(stats.mtime.toString())) / 1000);
                    if (lastModified > timestampDatetime) {
                      fse.copy(filePath, destPath)
                        .then(_resolve)
                        .catch(_reject);
                    }
                  } else {
                    fse.copy(filePath, destPath)
                      .then(_resolve)
                      .catch(_reject);
                  }
                } else {
                  _resolve();
                }
              })
            });
            listPromises.push(promise);
          })
          Promise.all(listPromises)
            .then(resolve)
            .catch(reject)
        } else {
          reject(error);
        }
      })
    });
  }

  detectSD(id, password) {
    this.loadDevices().then(() => {
        console.log('copied files successfully!')
      })
      .catch((err) => {
        console.log(err);
      })
    usbDetect.startMonitoring();
    usbDetect.on('add', () => {
      setTimeout(() => {
        this.loadDevices().then(() => {
            console.log('copied files successfully!')
          })
          .catch((err) => {
            console.log(err);
          })
      }, TIMEOUT_TO_RECEIVE_DEVICE);
    });
  }
}

module.exports = PhotoController;