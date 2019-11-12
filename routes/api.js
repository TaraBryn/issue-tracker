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
    console.log(project);
    db.collection('projects').findAndModify(
      {project}, 
      {/*this would be the sort options*/},
      {
        $setOnInsert: {
          project,
          issues: [
            {_id: new ObjectId(),
            created_on: new Date(),
            updated_on: new Date(),
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            open: true}
          ]
        },
        $push: {
          issues: {
            _id: new ObjectId(),
            created_on: new Date(),
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
      (err, doc) => console.log(err ? err : doc)
    )
  })

  .put(function (req, res){
    var project = req.params.project;
    console.log('PUT project ', project);
    console.log('PUT body', req.body);
    db.collection('projects').find(
      {$elemMatch: {issues: {id: req.body._id}}},
      (err, doc)=>console.log(doc)
    )
  })

  .delete(function (req, res){
    var project = req.params.project;
    console.log('DELETE project', project);
    console.log('DELETE body', req.body);
  });

};

