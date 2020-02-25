//////////////////////////////////////////////////////////////////////////////////
// Copyright Institute of Translational Genomics, University of Southern California
//////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const morgan = require('morgan');
const dotenv = require('dotenv');
const debug = require('debug')('ripple:server');
const app = express();
const fs = require('fs');
var compress = require('./routes/compress.js')
require('dotenv').config();
var secret = process.env.SECRET;
var version = process.env.VERSION;
var port = normalizePort(process.env.API_PORT || '3000');
var status = 'dev';



// ALLOW CORS (Modify as appropriate)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Start server
app.set('port', port);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(process.env.API_PATH + '/public', express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); // log every request to the console
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());


//////////////////////////////////////////////////////////////////////////////////
// Server Listeners
//////////////////////////////////////////////////////////////////////////////////
function onError(error) {
    if (error.syscall !== 'listen') { throw error; }
    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
    return false;
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
/** Create  server.*/
var server = http.createServer(app);
server.listen(process.env.PORT);
server.on('error', onError);
server.on('listening', onListening);
//////////////////////////////////////////////////////////////////////////////////
// END Server Listeners
//////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////
// API
//////////////////////////////////////////////////////////////////////////////////
var Mongo_Connection = mongoose.createConnection('mongodb://localhost:' + process.env.MPORT + '/' + process.env.DB);
var GeneSample_Schema = mongoose.Schema({}, { collection: process.env.COLLECTION });
var GeneSample = Mongo_Connection.model("viz", GeneSample_Schema);

function find_GeneSample(req, res) {
    console.log("search_genepos");
    var gene = req.params.gene;
    var sample = req.params.sample;
    GeneSample.find({ "sample": parseInt(sample), "gene": gene }, function(err, result) {
        if (err) {
            console.log("error");
            res.json({})
        }
        if (result) {
            res.json(result);
        }
    });
};
app.get(process.env.API_PATH + '/sample/:sample/gene/:gene/file.json', find_GeneSample);
app.get(process.env.API_PATH + '/gene/:gene/sample/:sample/file.json', find_GeneSample);
//////////////////////////////////////////////////////////////////////////////////
// END API  Server
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// Webpage From Node
//////////////////////////////////////////////////////////////////////////////////
var app_components = {
    global_api: process.env.HREF,
    port: port,
    spatial: compress.file("views/spatial.ejs"),
    spatial_graph: compress.file("views/json/spatial_graph." + status + ".json"),
    css: compress.file("views/src/styles.common.css"),
    jqueryui: compress.file("views/src/jquery-ui.css"),
    spatial_css: compress.file("views/src/styles.spatial.css")
};
app.get(process.env.API_PATH, function(req, res) {
    res.render('body.ejs', app_components);
});

//////////////////////////////////////////////////////////////////////////////////
// Create Javascript Package
//////////////////////////////////////////////////////////////////////////////////
app.get(process.env.API_PATH + '/compile', function(req, res) {
    res.render('wrapper.ejs', app_components, function(err, script) {
        fs.writeFile('spatial_bio.js', script, function(err) {
            if (err)
                console.error(err);
            fs.close(script, function() {
                console.log('wrote the file successfully');
            });
        });
        res.send(script);
    });
});
//////////////////////////////////////////////////////////////////////////////////
// END Create Javascript Package
//////////////////////////////////////////////////////////////////////////////////








// Start server