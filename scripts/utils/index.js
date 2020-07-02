const childProcess = require('child_process');

module.exports = {
  exec: function(command) {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  }
}