const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

if (!fs.existsSync(SSL_KEY_PATH)) {
    console.error(`SSL key required!\nPlease provide the ssl key in the .env file in SSL_KEY_PATH.`);
    process.exit();
}

if (!fs.existsSync(SSL_CERT_PATH)) {
    console.error(`SSL certificate required!\nPlease provide the ssl certificate in the .env file in SSL_CERT_PATH.`);
    process.exit();
}

const privateKey  = fs.readFileSync(SSL_KEY_PATH, 'utf8');
const  certificate = fs.readFileSync(SSL_CERT_PATH, 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};

const app = express();

app.use(express.static(__dirname + '/dist'));

// Redirect HTTP to HTTPS
app.enable('trust proxy');
app.use(function (req, res, next) {
    if (req.secure) {
        next(); // request was via https, so do no special handling
    } else {
        // request was via http, so redirect to https
        const host = req.headers.host || '';
        if (host.includes(':')) {
            res.writeHead(301, {Location: `https://${host.replace(/:\d+/, ':'.concat(port_https))}${req.url}`});
        } else {
            res.writeHead(301, {Location: `https://${host}${':'.concat(port_https)}${req.url}`});
        }
        res.end();
    }
});

app.get('/*', function(req,res) {
    res.sendFile(__dirname + '/dist/index.html');
});

const port_http = process.env.PORT_HTTP;
const port_https = process.env.PORT_HTTPS;

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(port_http,()=>{
    console.log('Dashboard with HTTP runing in PORT ' + port_http);
});

httpsServer.listen(port_https, ()=>{
    console.log('Dashboard with HTTPS runing in PORT ' + port_https);
});

