/*
 * Created by Egbewatt Kokou <ksupro1@gmail.com>
 * Created on Fri Apr 17 2020
 *
 * Copyright © 2020.
 * 
 *  EntryPoint to LIBRA_SCHOOL_ERP
 * 
 */

 const nodemon =  require('nodemon')
require = require('esm')(module)
 Console.log("hola")
/**

nodemon({
     script: require('./src/server/Infrastructure/appServer'),
     stdout: false // output to console
 }).on('readable', function() { 
     this.stdout.pipe(fs.createWriteStream('./logs/output.txt'));
     this.stderr.pipe(fs.createWriteStream('./logs/err.txt')); 
 });

 */


module.exports = require('./src/server/Infrastructure/appServer')
