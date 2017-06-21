
//*
//* Setup file for the base + mustering application (5.0.1)
//* Creates .env file, which should then be edited at install
//* Also creates the appropriate navbar for the version
//*
'use strict';
var fs = require('fs');
fs.createReadStream('.sample501-env')
  .pipe(fs.createWriteStream('.env'));

fs.createReadStream('./views/navbar_base_muster.jade')
  .pipe(fs.createWriteStream('./views/navbar.jade'));