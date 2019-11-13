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
          project
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
      (err, doc) => err ? {error: true, err} : {error: false, document: doc.value}
    )
  })

  .put(function (req, res){
    var project = req.params.project;
    //console.log('PUT project ', project);
    //console.log('PUT body', req.body);
    db.collection('projects').find(
    {'issues': {$elemMatch: {_id: new ObjectId(req.body._id)}}},
    (err, doc) => {
      if (err) return console.log('find error ', err);
      try{
        doc.forEach(function(element){
          console.log(element);
        })
        console.log('complete');
      }
      catch(e){console.log('array error ', e)}
    })
  })

  .delete(function (req, res){
    var project = req.params.project;
    console.log('DELETE project', project);
    console.log('DELETE body', req.body);
  });

};

