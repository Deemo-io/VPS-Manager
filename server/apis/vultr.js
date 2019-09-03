const request = require('request-promise');
const Client = require('ssh2').Client;
const fs = require('fs');

function VultrClient(options) {
  this.apiKey = options.apiKey;
  this.endpoint = 'https://api.vultr.com/v1/';
}

VultrClient.prototype.makeApiRequest = function(uri, methodOrOptions='GET', callback, keyNeeded=true) {
  //start our options as just the uri
  let options = {uri: this.endpoint+uri};
  //if methodOrOptions is string, use as method, else, append to options object
  if (typeof methodOrOptions === 'string') {
    options.method = methodOrOptions;
  }
  else {
    options['Content-Type'] = 'application/json';
    options = Object.assign(options, methodOrOptions);
  }
  //if the api key is necessary, append it to the headers
  if (keyNeeded) {
    options.headers = {
      'API-Key': this.apiKey
    };
  }

  //send our request with the specified options
  request(options).then(res => {
    callback(null, JSON.parse(res));
  })
  .catch(err => {
    callback(err);
  })
}

VultrClient.prototype.getAccountInfo = function(callback) {
  this.makeApiRequest('account/info', 'GET', callback);
}

VultrClient.prototype.getOsList = function(callback) {
  this.makeApiRequest('os/list', 'GET', callback, false);
}

VultrClient.prototype.getVc2PlanList = function(callback) {
  this.makeApiRequest('plans/list_vc2', 'GET', callback);
}

VultrClient.prototype.getRegionList = function(callback) {
  this.makeApiRequest('regions/list', 'GET', callback);
}

VultrClient.prototype.getServerList = function(callback) {
  this.makeApiRequest('server/list', 'GET', callback);
}

VultrClient.prototype.getServer = function(subid, callback) {
  this.makeApiRequest('server/list', {method: 'GET', form: {SUBID: subid}}, callback);
}

//the options are necessary. They are:
//DCID the region id to create this virtual machine in
//VPSPLANID Plan to use when creating this virtual machine
//OSID integer Operating system to use
//other parameters are optional and can be found at https://www.vultr.com/api/#server_create
VultrClient.prototype.createServer = function(options, callback) {
  this.makeApiRequest('server/create', {method: 'POST', form: options}, callback);
}

VultrClient.prototype.restartServer = function(subid, callback) {
  //server/start restarts if the server is already running
  this.makeApiRequest('server/start', {method: 'POST', form: {SUBID: subid}}, callback);
}

//should be called with the SUBID of the server you're trying to desroy
VultrClient.prototype.destroyServer = function(subid, callback) {
  this.makeApiRequest('server/destroy', {method: 'POST', form: {SUBID: subid}}, callback);
}

// VultrClient.prototype.deplooyApp = function(path, server) {
//   //create ssh2 connection to server
//   let conn = new Client();
//   conn.on('ready', () => {
//     console.log('client ready');
//     //connect using sftp
//     conn.sftp((err, sftp) => {
//       if (err) return console.log(err);
//
//       //create write stream i guess?
//       let writeStream = sftp.createWriteStream('/root/app.tar.gz');
//
//       console.log('uploading app...');
//
//       Ignore({ path: path, ignoreFiles: ['.deployignore'] })
//       .pipe(tar.Pack())
//       .pipe(zlib.Gzip())
//       .pipe(writeStream)
//       .on('close', (err) => {
//         if (err) return console.log(err);
//
//         console.log('decompressing app...');
//
//         //unzip the file and put it in a file, deleting the old one if it existed
//         conn.exec(
//           'cd /root;' +
//           '[ -e app ] && rm -r app;' +
//           'mkdir app;' +
//           'tar -xvzf app.tar.gz -C app --strip-components=1;' +
//           'rm app.tar.gz;', (err, stream) => {
//             if (err) return console.log(err);
//
//             stream.on('error', (err) => {
//               console.log('error:', err);
//             });
//             stream.on('data', (chunk) => {
//               // console.log('data:', chunk.toString());
//               // console.log('.');
//               process.stdout.write('.');
//             });
//
//             // console.log('app decompressed');
//             // console.log('installing node.js...');
//             stream.on('end', () => {
//               console.log('app decompressed...');
//               console.log('installing node.js...');
//
//               //for installing nodejs and updating npm
//               conn.exec(
//                 'apt-get update -y;' +
//                 'apt-get upgrade -y;' +
//                 'apt-get dist-upgrade -y;' +
//                 'dpkg -s nodejs || apt install nodejs -y;' +
//                 //if npm isn't installed, install it and apparently update npm
//                 'dpkg -s npm || (apt install npm -y && curl -L https://www.npmjs.com/install.sh | sh);',
//                 (err, stream) => {
//                   if (err) return console.log(err);
//
//                   stream.on('error', (err) => {
//                     console.log('error:', err);
//                   });
//
//                   stream.on('data', (chunk) => {
//                     // console.log('data: ', chunk.toString());
//                     process.stdout.write('.');
//                   });
//
//                   stream.on('end', () => {
//                     console.log('done');
//                     //start the app
//
//                     conn.exec(
//                       'cd /root/app;' +
//                       'npm i --only=prod;' +
//                       '[ -e env.sh ] && source env.sh;' + //run env.sh if it exists
//                       'killall node;' + //kill any instances of node running
//                       'mv /root/app/vultrApp.service /etc/systemd/system/vultrApp.service;' +
//                        //stop a service if it exists
//                       'systemctl is-active --quiet vultrApp.service && systemctl stop vultrApp.service' +
//                       'systemctl enable vultrApp.service;' + //start systemctl
//                       'systemctl start vultrApp.service;',
//                       (err, stream) => {
//                         if (err) return console.log(err);
//
//                         stream.on('error', (err) => {
//                           console.log('error:', err);
//                         });
//                         stream.on('data', (chunk) => {
//                           process.stdout.write('.');
//                         });
//                         stream.on('end', () => {
//                           console.log('process should be starting...');
//                           conn.end();
//                         });
//                       });
//                   });
//                 });
//             });
//           });
//       });
//     });
//   }).connect({
//     host: server['main_ip'],
//     username: 'root',
//     password: server['default_password']
//   });
// }

VultrClient.prototype.exec = function(command, server, onData, onEnd) {
  let conn = new Client();
  conn.on('ready', () => {
    conn.exec(command, (err, stream) => {
      //I guess we assume no error uwu
      // if (err) return callback(err);

      stream.on('data', (data) => {
        console.log('data:', data.toString());
        onData(data.toString());
      });
      stream.on('end', () => {
        // callback(undefined, finalData);
        onEnd();
        conn.end();
      });
    });
  }).connect({
    host: server['main_ip'],
    username: 'root',
    password: server['default_password']
  });
}

VultrClient.prototype.deployApp = function(stream, server, onData) {
  //create ssh2 connection to server
  let conn = new Client();
  conn.on('ready', () => {
    console.log('client ready');
    onData('connected to server...\n');
    //connect using sftp
    conn.sftp((err, sftp) => {
      if (err) return console.log(err);

      //create write stream i guess?
      let writeStream = sftp.createWriteStream('/root/app.tar');

      console.log('uploading app...');
      onData('uploading app...\n')

      stream
      .pipe(writeStream)
      .on('close', (err) => {
        if (err) return onData(err);

        console.log('decompressing app...');
        onData('decompressing app...\n');

        //unzip the file and put it in a file, deleting the old one if it existed
        conn.exec(
          'cd /root;' +
          '[ -e app ] && rm -rf app;' +
          'mkdir app;' +
          'tar -xf app.tar -C app;' +
          'rm app.tar;', (err, stream) => {
            if (err) return onData(err);

            stream.on('error', (err) => {
              console.log('error:', err);
              onData(err);
            });
            stream.on('data', (chunk) => {
              process.stdout.write('.');
              onData(chunk.toString());
              // process.stdout.write(chunk.toString());
            });

            stream.on('end', () => {
              console.log('app decompressed...');
              console.log('installing node.js...');
              onData('installing node.js...\n');

              //for installing nodejs and updating npm
              conn.exec(
                'apt-get update -y;' +
                'apt-get upgrade -y;' +
                'apt-get dist-upgrade -y;' +
                'dpkg -s nodejs || apt install nodejs -y;' +
                //if npm isn't installed, install it and apparently update npm
                'dpkg -s npm || (apt install npm -y && curl -L https://www.npmjs.com/install.sh | sh);',
                (err, stream) => {
                  if (err) return onData(err);

                  stream.on('error', (err) => {
                    console.log('error:', err);
                    onData(err);
                  });

                  stream.on('data', (chunk) => {
                    // process.stdout.write(chunk.toString());
                    process.stdout.write('.');
                    onData(chunk.toString());
                  });

                  stream.on('end', () => {
                    console.log('done');
                    //start the app

                    conn.exec(
                      'cd /root/app;' +
                      'npm i --only=prod;' +
                      'killall node;' + //kill any instances of node running
                      'mv /root/app/vultrApp.service /etc/systemd/system/vultrApp.service;' +
                       //stop a service if it exists
                      'systemctl is-active --quiet vultrApp.service && systemctl stop vultrApp.service' +
                      'systemctl enable vultrApp.service;' + //start systemctl
                      'systemctl start vultrApp.service;',
                      (err, stream) => {
                        if (err) return onData(err);

                        stream.on('error', (err) => {
                          console.log('error:', err);
                          onData(err);
                        });
                        stream.on('data', (chunk) => {
                          process.stdout.write('.');
                          onData(chunk.toString());
                        });
                        stream.on('end', () => {
                          console.log('process should be starting...');
                          onData('process starting...\n');
                          conn.end();
                        });
                      });
                  });
                });
            });
          });
      });
    });
  }).connect({
    host: server['main_ip'],
    username: 'root',
    password: server['default_password']
  });
}

module.exports = VultrClient;
