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
    db.collection('projects').find(
      {'issues._id': ObjectId(_id)},
      function(err, doc){
        if (err) console.log('error: ', err);
        console.log(doc.toArray()[0])
        //doc.forEach((e, i)=>console.log(i, e));
        try{
          var project_id = doc[0]._id;
          var issue = doc[0].issues.filter(e=>e._id==_id)[0];
          
          issue_title = issue_title || issue.issue_title;
          issue_text = issue_text || issue.issue_text;
          created_by = created_by || issue.created_by;
          assigned_to = assigned_to || issue.assigned_to;
          status_text = status_text || issue.status.text;
          console.log(issue_title, issue_text);
          db.findAndModify({
            query: {
              _id: ObjectId(project_id),
              'issues': {$elemMatch: {_id: ObjectId(_id)}}
            },
            update: {
              $set: {
                'issues.$.issue_title': issue_title,
                'issues.$.issue_text': issue_text,
                'issues.$.created_by': created_by,
                'issues.$.assigned_to': assigned_to,
                'issues.$.status_text': status_text,
                'issues.$.open': !open,
                'issues.$.date_updated': new Date()
                /*issues: {
                  issue_title,
                  issue_text,
                  created_by,
                  assigned_to,
                  status_text,
                  open: !open,
                  date_updated:new Date()
                }*/
              }
            }
          })
        }
        catch(e){
          console.log('try error: ', e)
          return 'could not update ' + _id
        }
      }
    )
  })

  .delete(function (req, res){
    var project = req.params.project;
    console.log('DELETE project', project);
    console.log('DELETE body', req.body);
  });

};

