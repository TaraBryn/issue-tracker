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
            status_text: req.body.status_text,
            open: true
          }
        }
      },
      {upsert: true, new: true},
      (err, doc) => err ? {error: true, err} : {error: false, document: doc.value}
    )
  })

  .put(function (req, res){
    console.log('test')
    var project = req.params.project;
    var {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body;
    if(!(issue_title || issue_text || created_by || assigned_to || status_text || open))
      return 'no updated field sent';
    db.collection('projects').findAndModify(
      {
        query: {'issues._id': ObjectId(_id)},
        update: {'issues.date_updated': new Date()}
      },
      (err, doc) => err || doc
    )
    .toArray()
    .then(function(data){
      console.log(data);
      try{
        console.log(data)
      }
      catch(err) {return 'could not update ' + _id;}
    });
  })

  .delete(function (req, res){
    var project = req.params.project;
    console.log('DELETE project', project);
    console.log('DELETE body', req.body);
  });

};

