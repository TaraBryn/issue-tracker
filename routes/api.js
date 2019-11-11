/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; 

module.exports = function (app, db) {
  
  //MongoClient.connect(CONNECTION_STRING, function(err, db) {
    
    //if (err) return console.log(err);

    app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      console.log('GET project ', project);
      console.log('GET body ', req.body);
    })

    .post(function (req, res){
      var project = req.params.project;
      console.log('POST project ', project);
      console.log('POST body ', req.body);

    })

    .put(function (req, res){
      var project = req.params.project;
      console.log('PUT project ', project);
      console.log('PUT body', req.body);
    })

    .delete(function (req, res){
      var project = req.params.project;
      console.log('DELETE project', project);
      console.log('DELETE body', req.body);
    });
    
  //});

};

