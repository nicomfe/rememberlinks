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
var ogs = require('open-graph-scraper');
var request = require('request');
var Promise = require('promise');
var imageSize = require('image-size');
var url = require('url');
var http = require('http');

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
    var newLink = req.body;
    link.create(newLink, function(err, link) {
    if(err) { return handleError(res, err); }
      updateLinkWithMetadata(link).then(function(link){
        return res.json(201, link);
      });
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

function updateLinkWithMetadata(linkToUpdate){
  var deferred;
  deferred = new Promise(function(resolve,reject){
    getSiteMetadata(linkToUpdate.url).then(function(metadata){
      if(metadata.hybridGraph){
        linkToUpdate.title = metadata.hybridGraph.title;
      }
      getValidImage(metadata).then(function(result){
        if(result){
          linkToUpdate.image = result;
          link.findOneAndUpdate({_id: linkToUpdate._id}, linkToUpdate, function (err, linkUpdated) {
            resolve(linkUpdated);
          });
        }
      });

    });
  });
  return deferred;
}

function getValidImage(metadata){
  var images = [];

  if(metadata.openGraph && metadata.openGraph.image){
    images.push(metadata.openGraph.image);
  }
  if(metadata.htmlInferred){
    images = images.concat(metadata.htmlInferred.images);
  }

  var deferred = new Promise(function(resolve,reject){
    for(var i=0 ; i<images.length ; i++){
      var imgUrl = images[i];

      if (imgUrl.match(/\.(jpg|bmp|SVG|png|gif)$/)){
        isValidImage(imgUrl).then(function(data){
          if(data.result === true){
            resolve(data.image);
          }
        });
      }
    }
  });
  return deferred;
}

function isValidImage(imageUrl){

  var deferred = new Promise(function(resolve,reject){
    var options = url.parse(imageUrl);
    var chunks = [];
    http.get(options, function (response) {
      var chunks = [];
      response.on('data', function (chunk) {
        chunks.push(chunk);
      }).on('end', function() {
        var buffer = Buffer.concat(chunks);
        var dimensions = imageSize(buffer);
        if(dimensions && dimensions.height > 200 && dimensions.width > 200){
          resolve({result:true, image: imageUrl});
        }else{
          resolve({result:false, image: imageUrl});
        }
      });
    });
  });
  return deferred;
}

function getSiteMetadata (url) {
  var deferred;
  if(url){
    url = encodeURIComponent(url);
    deferred = new Promise(function(resolve,reject){
      request('http://opengraph.io/api/1.0/site/'+url, function(error, response, body) {
        var meta = JSON.parse(body);
        resolve(meta);
      });
    });
  }
  return deferred;
};

function handleError(res, err) {
  return res.send(500, err);
}