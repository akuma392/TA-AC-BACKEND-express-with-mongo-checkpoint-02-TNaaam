var express = require('express');
var router = express.Router();
var Event = require('../models/event');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/location', (req, res, next) => {
  Event.find({})
    .sort({ location: 1 })
    .exec((err, events) => {
      if (err) next(err);
      res.render('event', { events: events });
    });
});
router.get('/date', (req, res, next) => {
  Event.find({})
    .sort({ start_date: 1 })
    .exec((err, events) => {
      if (err) next(err);
      res.render('event', { events: events });
    });
});
router.get('/category', (req, res, next) => {
  Event.find({})
    .sort({ category: 1 })
    .exec((err, events) => {
      if (err) next(err);
      res.render('event', { events: events });
    });
});
module.exports = router;
