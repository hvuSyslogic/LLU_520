
var execsql = require('execsql'),
    dbConfig = {
        host: 'localhost',
        user: 'mobss',
        password: 'ms_root_XS12'
    },
    sql = 'use mobss;',
    sqlFile = __dirname + '/createDB.sql';
execsql.config(dbConfig)
    .exec(sql)
    .execFile(sqlFile, function(err, results){
        console.log(results);
    }).end();