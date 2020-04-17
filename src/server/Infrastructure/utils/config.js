/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created on Fri Apr 17 2020
 *
 * Copyright © 2020
 * 
 * config:
 *      load from .env with dotenv
 * 
 */
const path = require('path');
const fs = require('fs')

require('dotenv').config({path: path.join(__dirname, '../../../../.env')});

const config = {

  serverPort: process.env.serverPORT,
  serverID: process.env.serverID
};

export default config;