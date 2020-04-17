#!/bin/sh
if [ $NODE_ENV = "production" ]; then
node serve.js;
else
nodemon serve.js;
fi