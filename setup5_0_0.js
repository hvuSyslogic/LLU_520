
//*
//* Setup file for the base application (5.0.0)
//* Creates .env file, which should then be edited at install
//* Also creates the appropriate navbar for the version
//*
'use strict';
var fs = require('fs');
fs.createReadStream('.sample-env')
  .pipe(fs.createWriteStream('.env'));

fs.createReadStream('./views/navbar_base.jade')
  .pipe(fs.createWriteStream('./views/navbar.jade'));