const https = require('https');
const creds = require('./creds');

const express = require('express');
const app = express();

app.get('/runner_velocities', (req, res) => {
  const q = req.query;
  if (creds.k && q.sc && q.includes) {
    tpd_req(`https://www.tpd.zone/json-rpc/v2/vendors/runner_velocities/?sc=${q.sc}&includes=${q.includes}$source={q.source}&k=${creds.k}`, (response) => {
      res.send(response);
    });
  } else {
    res.json({"success": false});
  }
});

app.get('/streaming_request', (req, res) => {
  const q = req.query;
  if (creds.k && q.sc && q.mode) {
    tpd_req(`https://www.tpd.zone/json-rpc/v2/vendors/streaming_request/?sc=${q.sc}&mode=${q.mode}&ip=${$ip}&k=${creds.k}`, (response) => {
      res.send(response);
    });
  } else {
    res.json({"success": false});
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

function tpd_req(url, callback) {
  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      callback(data);
    });
  }).on("error", (err) => {
    callback(null);
  });
}