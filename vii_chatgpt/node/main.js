/* Start the project */

// ================Startup environment ( start_dev | start_test | start_pro )=============

start_test();

// =======================================================================================

// magicworld start Set
var node_info;
var host;
var port;

function start_test(){
    console.log("start_dev ing")
    global.secret = require("../../../privateinfo/.secret.json");
    node_info = global.secret.vii_chatgpt_NODE;
    host = node_info.host;
    port = node_info.port;
    // global.mysqlGlobal = global.secret.vii_chatgpt_SQL;
    global.zwjerror = false;
    global.name ="vii_chatgpt";
}

// // Arouse the swagger
// const swagger = require("./nodetool/swagger");
// swagger.swaggerConfig(app,host,port);

// Arouse the express
const express = require("express");
const app = express();

// Arouse the service
const service = require("./nodetool/service");
service.serviceConfig(app,host,port);

// Arouse rest api
const restApi = require("./api/restApi");
restApi.restApiConfig(app);