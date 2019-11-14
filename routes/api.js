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
    console.log(project)
    var {
      _id, 
      created_on, 
      updated_on, 
      issue_title, 
      issue_text, 
      created_by, 
      assigned_to, 
      status_text, 
      open
    } = req.query;
    var result;
    db.collection('projects').find(
      {'project': project}, {},
      (err, doc) => {
        if (err) return result = err;
        return doc || [];
      }
    )
    .toArray()
    .next(data => {
      if (result) return result;
      if (data.length == 0) return [];
      result = data[0].issues.filter(function(issue){
        return (!_id || issue._id == _id)
        && (!created_on || issue.created_on == created_on)
        && (!updated_on || issue.updated_on == updated_on)
        && (!issue_title || issue.issue_title == issue_title)
        && (!issue_text || issue.issue_text == issue_text)
        && (!created_by || issue.created_by == created_by)
        && (!assigned_to || issue.assigned_to == assigned_to)
        && (!status_text || issue.status_text == status_text)
        && (open === undefined || issue.open == open)
      })
    })
    return res.json(result);
  })

  .post(function (req, res){
    var project = req.params.project;
    var result;
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
      (err, doc) => result = err || doc.value
    )
    return result;
  })

  .put(function (req, res){
    var project = req.params.project;
    var {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body;
    if(!(issue_title || issue_text || created_by || assigned_to || status_text || open))
      return 'no updated field sent';
    var result;
    db.collection('projects').findAndModify(
      {project, 'issues._id': ObjectId(_id)}, {},
      {
        $set: {'issues.$.updated_on': new Date()}
      },
      {new: true},
      (err, doc) => {
        if (err) result = 'could not update ' + _id;
        var project_id = doc.value._id;
        var issue = doc.value.issues.filter(e=>e._id==_id)[0];
        issue_title = issue_title || issue.issue_title;
        issue_text = issue_text || issue.issue_text;
        created_by = created_by || issue.created_by;
        assigned_to = assigned_to || issue.assigned_to;
        status_text = status_text || issue.status_text;
        return db.collection('projects').update(
          {_id: ObjectId(project_id), 'issues._id': ObjectId(_id)},
          {
            $set: {
              'issues.$.issue_title': issue_title,
              'issues.$.issue_text': issue_text,
              'issues.$.created_by': created_by,
              'issues.$.assigned_to': assigned_to,
              'issues.$.status_text': status_text,
              'issues.$.open': !open
            }
          },
          e => result = e ? 'could not update ' + _id : 'successfully updated'
        )
      }
    )
    return result;
  })

  .delete(function (req, res){
    var project = req.params.project;
    var _id = req.body._id;
    var result;
    db.collection('projects').findAndModify(
      {project, 'issues._id': ObjectId(_id)}, {},
      {$pull: {'issues': {'_id': ObjectId(_id)}}},
      {new: true},
      (err, doc) => {
        if(err) result = 'could not delete ' + _id;
        result = doc.value ? '_id error' : 'deleted ' + _id;
      }
    )
    return result;
  });

};

