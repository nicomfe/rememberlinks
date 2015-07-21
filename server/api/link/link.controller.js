/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /links              ->  index
 * POST    /links              ->  create
 * GET     /links/:id          ->  show
 * PUT     /links/:id          ->  update
 * DELETE  /links/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var link = require('./link.model');

// Get list of links
exports.index = function(req, res) {
  link.find(function (err, links) {
    if(err) { return handleError(res, err); }
    return res.json(200, links);
  });
};

// Get a single link
exports.show = function(req, res) {
  link.findById(req.params.id, function (err, link) {
    if(err) { return handleError(res, err); }
    if(!link) { return res.send(404); }
    return res.json(link);
  });
};

// Creates a new link in the DB.
exports.create = function(req, res) {
  if(req.body){
    req.body.date = new Date();
    link.create(req.body, function(err, link) {
      if(err) { return handleError(res, err); }
      return res.json(201, link);
    });
  }else{
    return handleError(res, 'Body not found');
  }

};

// Updates an existing link in the DB.
exports.update = function(req, res) {
  if(req.body){
    req.body.date = new Date();
    link.findOneAndUpdate({_id: req.body._id}, req.body, function (err, link) {
      if (err) { return handleError(res, err); }
      return res.json(200, link);
    });
  }else{
    return handleError(res, 'Body not found');
  }
};

// Deletes a link from the DB.
exports.destroy = function(req, res) {
  link.findOneAndRemove({'_id':req.params.id}, function (err) {
    if(err) { return handleError(res, err); }
    return res.send(204);
  });
};

// Get list of links by user
exports.getByUser = function(req, res) {
  link.find({'userId':req.params.id},function (err, links) {
    if(err) { return handleError(res, err); }
    return res.json(200, links);
  });
};

exports.getByTags = function(req, res) {
  var filterTags = req.params.tags.split(',');
  //TODO need to improve this query currently searching with 'or'
  link.find({'tags':{ $in : filterTags }},function (err, links) {
    return res.json(200, links);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}