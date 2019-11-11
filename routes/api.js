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
  

  app.route('/api/issues/:project')

  .get(function (req, res){
    var project = req.params.project;
    console.log('GET project ', project);
    console.log('GET body ', req.body);
  })

  .post(function (req, res){
    var project = req.params.project;
    db.collection('projects').findAndModify(
      {name: req.params.project},
      {
        $setOnInsert: {
          project,
          issues: []
        },
        $push: {
          issues: {
            _id: new ObjectId(),
            crteated_on: new Date(),
            updated_on: new Date(),
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            open: true
          }
        }
      },
      {upsert: true, new: true},
      (err, doc) => err || doc.value
    )
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

};

