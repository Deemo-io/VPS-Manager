const request = require('request-promise');

function CloudflareClient(options) {
  this.endpoint = "https://api.cloudflare.com/client/v4/";
  this.apiKey = options.apiKey;
  this.email = options.email;
  this.userId = "";

  //this is all the requests we have to wait for before getting our userid
  this.queue = [];
  //send userid request and run everything from the queue
  this.getUser((err, data) => {
    this.userId = data.result.id;
    for (let i = 0; i < this.queue.length; i++) {
      this.makeApiRequest(this.queue[i].uri, this.queue[i].methodOrOptions, this.queue[i].callback);
    }
  });
}

CloudflareClient.prototype.makeApiRequest = function(uri, methodOrOptions='GET', callback) {
  if (!this.userId && uri !== 'user') return this.queue.unshift({ uri, methodOrOptions, callback });

  //start our options as just the uri
  let options = {uri: this.endpoint+uri};
  //if methodOrOptions is string, use as method, else, append to options object
  if (typeof methodOrOptions === 'string') {
    options.method = methodOrOptions;
  }
  else {
    options['Content-Type'] = 'application/json';
    options = Object.assign(options, methodOrOptions);
    if (options.body) options.body = JSON.stringify(options.body);
  }
  //cloudflare requires a lot of info, so give it to them
  options.headers = {
    'X-Auth-Key': this.apiKey,
    'X-Auth-Email': this.email
  };

  //send our request with the specified options
  request(options).then(res => {
    callback(null, JSON.parse(res));
  })
  .catch(err => {
    callback(JSON.parse(err.error));
    console.log(JSON.parse(err.error));
  });
}

CloudflareClient.prototype.getUser = function(callback) {
  this.makeApiRequest('user', 'GET', callback);
}

CloudflareClient.prototype.getZoneList = function(callback) {
  this.makeApiRequest('zones', 'GET', callback);
}

CloudflareClient.prototype.createZone = function(domain, callback) {
  this.makeApiRequest('zones', {method: 'POST', body: {name: domain}}, callback);
}

CloudflareClient.prototype.deleteZone = function(zoneid, callback) {
  this.makeApiRequest('zones/'+zoneid, {method: 'DELETE'}, callback);
}

CloudflareClient.prototype.getDnsRecordList = function(zone, callback) {
  this.makeApiRequest(`zones/${zone}/dns_records`, 'GET', callback);
}

CloudflareClient.prototype.addDnsRecord = function(zone, options, callback) {
  this.makeApiRequest(`zones/${zone}/dns_records`, {method: 'POST', body: options}, callback);
}

CloudflareClient.prototype.deleteDnsRecord = function(zone, record, callback) {
  this.makeApiRequest(`zones/${zone}/dns_records/${record}`, {method: 'DELETE'}, callback);
}

module.exports = CloudflareClient;
