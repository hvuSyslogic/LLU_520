var npmInfo = require('./package.json');

module.exports = function(){
  console.log("Node Env Variable: " + process.env.NODE_ENV);

  // istanbul ignore next: don't look at the env variables
  switch(process.env.NODE_ENV){
    case null:
    case undefined:
    case "local":
      return {
        env: 'local', //should be env/prod
        //dbURI : "mongodb://localhost/" + npmInfo.name,
        dbURI : 'mobss-dev001.cgtzydaxfg7j.us-west-2.rds.amazonaws.com',
        expressPort: 3000,
        loggerLevel: 'debug'
      };
    case "dev":
    case "development":
      return {
        env: 'dev', //should be env/prod
        dbURI : process.env.MONGODB_URI,
        expressPort: process.env.PORT,
        loggerLevel: 'info'
      };
    case "test":
    case "testing":
      return {
        env: 'test', //should be env/prod, can be changed to prod when we are comfy with prod environ
        dbURI : process.env.MONGODB_URI,
        expressPort: process.env.PORT,
        loggerLevel: 'debug'

      };
    case "prod":
    case "production":
      return {
        env: 'prod', //should be env/prod, can be changed to prod when we are comfy with prod environ
        dbURI : process.env.MONGODB_URI,
        expressPort: process.env.PORT,
        loggerLevel: 'debug'

      };
    default:
      throw new Error("Environment Not Recognized");

  }
}();