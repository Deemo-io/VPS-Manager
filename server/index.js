const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const VultrClient = require('./apis/vultr');
const CloudflareClient = require('./apis/cloudflare.js');
const fs = require('fs');
const path = require('path');
const Tar = require('tar-async')
const Busboy = require('busboy');

if (!process.env.VULTR_API_KEY) console.log("VULTR_API_KEY NOT FOUND, CHECK ENV.SH");

const app = express();
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

app.post('/server/:subid/uploadApp', function(req, res) {
  let busboy = new Busboy({ headers: req.headers, preservePath: true });
  tape = new Tar({output: require('fs').createWriteStream('./uploads/out.tar')});

  // tape.append('vultrApp.service', fs.)
  fs.readFile('./apis/vultrApp.service', (err, data) => {
    if (err) return console.log(err);
    console.log(data);
    tape.append('vultrApp.service', data, () => {
      console.log('added vultrApp.service');
    });
  });

  //ever time we get a file, add it to the tar file
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    // console.log(file);
    file.on('data', (data) => {
      tape.append(filename.slice(filename.indexOf('/')+1), data, () => {
        console.log('added ' + filename)
      });
    });
  });

  //when we're done getting files, close the tar file
  busboy.on('finish', () => {
    tape.close();
    //we have to get our server before we do anything
    vultr.getServer(req.params.subid, (err, result) => {
      if (err) return res.json(err);
      vultr.deployApp(fs.createReadStream(path.join(process.cwd(),'uploads','out.tar')), result[req.params.subid]);
    });
  });

  //send a thing back to user
  res.json({message: 'wow'});

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

app.listen(process.env.PORT || 3000, function(err) {
  if (err) return console.log(err);

  console.log('app listening on port', process.env.PORT || 3000);
});