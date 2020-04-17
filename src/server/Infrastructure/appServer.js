/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created on Fri Apr 17 2020
 *
 * Copyright © 2020
 * 
 *LIBRA_SCHOOL_ERP_SERVER
 *
 *    load services and create endpoints
 *  
 */

 
// Import configurations
import config from './utils/config';
import fs from 'fs';
import path from 'path';
import https from 'https';
import throng from 'throng';
import winstonLogger from './utils/winstonLogger'

const cpus = require('os').cpus().length;


// Log
winstonLogger.info('SERPS SERVER')


// permission certificate paths
const certsPath = path.join(`${__dirname}`, 'certs', 'server');

// SSL certificates
const options = {
    key: fs.readFileSync(path.join(`${certsPath}`, 'my-server.key.pem')),
    // This certificate should be a bundle containing your server certificate and any intermediates
    // cat certs/cert.pem certs/chain.pem > certs/server-bundle.pem
    cert: fs.readFileSync(path.join(`${certsPath}`, 'my-server.crt.pem')),
    // ca only needs to be specified for peer-certificates
  //, ca: [ fs.readFileSync(path.join(caCertsPath, 'my-root-ca.crt.pem')) ]
    requestCert: false,
    rejectUnauthorized: true
};
 
const startServer = async function() {
    
    const server = https.createServer(options).setMaxListeners(Infinity);
    const app = require('./plugins/app');

    server.on('request', app);
    server.listen(config.serverPort);
    server.on('listening', function() {
        winstonLogger.info('Listening on :' + server.address().port);
    });

};

throng(
    {
        workers: cpus,
        lifetime: Infinity
    },
    startServer
);
