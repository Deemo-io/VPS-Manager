const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const VultrClient = require('./apis/vultr');
const CloudflareClient = require('./apis/cloudflare.js');
const fs = require('fs');
const path = require('path');
const Tar = require('tar-async');
const tar = require('tar-stream');
const Busboy = require('busboy');

if (!process.env.VULTR_API_KEY) console.log("VULTR_API_KEY NOT FOUND, CHECK ENV.SH");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const vultr = new VultrClient({apiKey: process.env.VULTR_API_KEY});
const cloudflare = new CloudflareClient({apiKey: process.env.CLOUDFLARE_API_KEY, email: process.env.CLOUDFLARE_EMAIL})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//get a list of all servers. Comes back as an object
app.get('/servers', function(req, res) {
  vultr.getServerList((err, servers) => {
    if (err) return res.json(err);

    res.json(servers);
  });
});

//get vc2 plan list
app.get('/server/plans', function(req, res) {
  vultr.getVc2PlanList((err, result) => {
    if (err) return res.json(err);

    res.json(result);
  });
});

//get possible os list
app.get('/server/oses', function(req, res) {
  vultr.getOsList((err, result) => {
    if (err) return res.json(err);

    res.json(result);
  });
});

//get region list
app.get('/server/regions', function(req, res) {
  vultr.getRegionList((err, result) => {
    if (err) return res.json(err);

    res.json(result);
  });
});

//create a new server
app.post('/server/create', function(req, res) {
  vultr.createServer({
    DCID: req.body.DCID,
    OSID: req.body.OSID,
    VPSPLANID: req.body.VPSPLANID,
    label: req.body.label
  }, (err, result) => {
    if (err) return res.json(err);

    res.json(result);
  })
});

//destroy a server
app.post('/server/destroy', function(req, res) {
  vultr.destroyServer(req.body.SUBID, (err, result) => {
    if (err) return res.json(err);

    res.json(result);
  })
});

app.post('/server/:subid/ssh', function(req, res) {
  vultr.getServer(req.params.subid, (err, result) => {
    if (err) return res.json(err);

    vultr.exec(req.body.command, result[req.params.subid], (err, result) => {
      if (err) return res.json(err);

      res.json({output: result});
    });
  });
});

app.post('/server/:subid/restart', function(req, res) {
    vultr.restartServer(req.params.subid, (err, result) => {});
    //there's no response to this route on Vultr
    res.json({success: true});
});

app.post('/server/:subid/uploadApp', function(req, res) {
  let busboy = new Busboy({ headers: req.headers, preservePath: true });
  let filesMap = {};//the key is the filename, value is file contents
  let ignoreFiles = [];//the files/directories that we are supposed to ignore
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }
  // tape = new Tar({output: fs.createWriteStream('./uploads/out.tar')});
  let tape = new tar.pack();

  //we write the head here so we can send a stream as a result
  res.writeHead(200, {
    'Content-Type': 'plain/text'
  });
  res.write("bundling files...\n");

  //ever time we get a file, add it to the tar file
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //here we are assuming that ignoreFiles has already arrived
    //I think it's safe because someone on stackoverflow said order is garunteed
    //for multipart/form-data
    let filenameParts = filename.split('/');
    file.on('data', (data) => {
      //early termination if filename matches an ignore file
      for (let i = 0; i < ignoreFiles.length; i++) {
        for (let j = 0; j < filenameParts.length; j++) {
          if (filenameParts[j] === ignoreFiles[i]) {
            return;
          }
        }
      }
      //add files to map
      const newFilename = filename.slice(filename.indexOf('/')+1);
      if (filesMap[newFilename]) {
        filesMap[newFilename] += data;
      }
      else {
        filesMap[newFilename] = data;
      }
    });
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    // console.log('got '+fieldname+' with value: '+val);
    if (fieldname === "uploadignore") {
      ignoreFiles = val.split('\n');
    }
  });

  //when we're done getting files, close the tar file
  busboy.on('finish', () => {
    //write all the files to the tape
    const filenames = Object.keys(filesMap);
    //loop through every file name (key) in filesMap
    for (let i = 0; i < filenames.length; i++) {
      //write the data from that filename to the tape
      tape.entry({ name: filenames[i] }, filesMap[filenames[i]]);
      //TODO send client something here for adding a file
    }

    //finalize the tape
    tape.finalize();
    res.write("finished bundling files\n");

    //we have to get our server before we do anything
    vultr.getServer(req.params.subid, (err, result) => {
      if (err) return res.json(err);

      //deploy the files on the tape to the server
      vultr.deployApp(tape,
        result[req.params.subid],
        (data) => {
          res.write(data);
          if (data === 'process starting...\n') {
            res.end();
          }
        });
    });
  });

  const vultrApp = fs.readFileSync('./apis/vultrApp.service');
  tape.entry({ name: 'vultrApp.service' }, vultrApp);
  //maybe send the client something here

  //pipe our request over to busboy
  req.pipe(busboy);
});

//get a list of cloudflare zones
app.get('/zones', function(req, res) {
  cloudflare.getZoneList((err, zones) => {
    if (err) return res.json(err);

    res.json(zones);
  });
});

//get dns info for a zone
app.get('/zone/:zoneid/getDns', function(req, res) {
  cloudflare.getDnsRecordList(req.params.zoneid, (err, records) => {
    if (err) return res.json(err);

    res.json(records);
  })
});

//post a new zone, only takes domain name right now
app.post('/createZone', function(req, res) {
  cloudflare.createZone(req.body.domain, (err, zone) => {
    if (err) return res.json(err);

    res.json(zone);
  });
});

//delete a zone via it's zone id
app.post('/zone/:zoneid/deleteZone', function(req, res) {
  cloudflare.deleteZone(req.params.zoneid, (err, result) => {
    if (err) return result.json(err);

    res.json(result);
  });
});

//remove a dns record from a zone
app.post('/zone/:zoneid/removedns/:recordid', function(req, res) {
  cloudflare.deleteDnsRecord(req.params.zoneid, req.params.recordid, (err, result) => {
    if (err) return res.json(err);

    res.json(result);
  });
});

//add dns record to zone
app.post('/zone/:zoneid/adddns', function(req, res) {
  cloudflare.addDnsRecord(req.params.zoneid, {
    type: req.body.type,
    name: req.body.name,
    content: req.body.content
  }, (err, result) => {
    if (err) return res.json(err);

    res.json(result);
  });
});

//socket.io stuff
io.on('connection', function(socket) {
  socket.on('ssh', (data) => {
    // console.log(JSON.parse(data));
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    vultr.getServer(parsedData.server, (err, result) => {
      // if (err) return res.json(err);
      if (err) return socket.emit('sshResp', JSON.stringify({error: true, message: err}));

      vultr.exec(parsedData.command, result[parsedData.server], (data) => {
        // if (err) return res.json(err);
        // if (err) return socket.emit('sshResp', JSON.stringify({error: true, message: err}));
        //TODO do error checking

        // res.json({output: result});
        socket.emit('sshResp', JSON.stringify({message: data}));
      }, () => socket.emit('sshResp', JSON.stringify({finished: true})));
    });
  });
});

//have our app listen, default port is 3000
server.listen(process.env.PORT || 3000, function(err) {
  if (err) return console.log(err);

  console.log('app listening on port', process.env.PORT || 3000);
});
