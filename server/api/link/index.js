'use strict';

var express = require('express');
var controller = require('./link.controller');

var app = express();

var router = express.Router();

router.get("/getByUser/:id", controller.getByUser);
router.get("/getByTags/:tags", controller.getByTags);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;