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
    var project = req.params.project;
    
    var _id = req.body._id;
    
    var issue_title = req.body.issue_title == '';
    var issue_text = req.body.issue_text;
    var created_by = req.body.created_by;
    var assigned_to = req.body.assigned_to;
    var status_text = req.body.status_text;
    
    if (!(issue_title || issue_text || created_by || assigned_to || status_text))
      return 'no updated field sent';
    
    /*db.collection('projects').findAndModify({
      query: {'issues._id': new ObjectId(req.body._id)},
      update: {
        $set: {
          
        }
      }
    })*/
    
    db.collection('projects').find(
    {'issues._id': new ObjectId(_id)},
    (err, doc) => {
      if (err) return 'could not update' + _id;
      try{
        //doc.forEach(e=>console.log(e));
        var project_id = doc[0]._id;
        var issue = doc[0].issues.filter(e=>e._id==_id)[0];
        
        issue_title = issue_title || issue.issue_title;
        issue_text = issue_text || issue.issue_text;
        created_by = created_by || issue.created_by;
        assigned_to = assigned_to || issue.assigned_to;
        status_text = status_text || issue.status_text;
        
        db.findAndModify({
          query: {
            _id: ObjectId(project_id),
            'issues': {$elemMatch: {_id: ObjectId(_id)}}
          },
          update: {
            $set: {
              'issues.$': 
              {
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
                updated_on: new Date()
              }
            }
          }
        })
        
      }
      catch(e){return 'could not update' + _id}
    })
    return 'successfully updated';
  })

  .delete(function (req, res){
    var project = req.params.project;
    console.log('DELETE project', project);
    console.log('DELETE body', req.body);
  });

};

