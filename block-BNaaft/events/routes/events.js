var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

/* GET users listing. */

router.post('/search/city', (req, res, next) => {
  console.log(req.body.search, 'search **********');
  let city = req.body.search;
  Event.find({ location: city }).exec((err, events) => {
    if (err) next(err);
    res.render('event', { events: events });
  });
});
// search locations

// filters events

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

router.get('/', (req, res) => {
  Event.find({}, (err, events, next) => {
    if (err) return next(err);
    res.render('event', { events: events });
  });
});
router.get('/create', (req, res) => {
  res.render('createEvent');
});

router.post('/', (req, res, next) => {
  console.log(req.body, '*********');
  Event.create(req.body, (err, event) => {
    if (err) next(err);
    res.redirect('/events');
  });
});

// router.get('/:id', (req, res, next) => {
//   let id = req.params.id;
//   Event.findById(id, (err, event) => {
//     if (err) next(err);
//     console.log(event);
//     res.render('singleEvent', { event: event });
//   });
// });
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id)
    .populate('remarks')
    .exec((err, event) => {
      if (err) next(err);
      res.render('singleEvent', { event: event });
    });
});

// router.get('/:id', (req, res, next) => {
//   let id = req.params.id;
//   Event.findById(id)
//     .populate('remarks')
//     .exec((err, event) => {
//       if (err) next(err);
//       console.log(
//         err,
//         event,
//         '************************************************'
//       );
//       res.render('singleEvent', { event: event });
//     });
// });
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id, (err, event) => {
    if (err) next(err);
    res.render('updateEvent', { event: event });
  });
});

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;

  console.log(req.body);
  Event.findByIdAndUpdate(id, req.body, { new: true }, (err, updatedevent) => {
    if (err) next(err);

    res.redirect('/events/' + id);
  });
});

// likes and dislikes in events
router.get('/:id/likes', (req, res, next) => {
  let id = req.params.id;
  console.log(req);
  Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, updatedevent) => {
    // if (err) next(err);
    res.redirect('/events/' + id);
  });
});
router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, updatedevent) => {
    if (err) next(err);
    res.redirect('/events/' + id);
  });
});

// delete event
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndDelete(id, (err, deletedEvent) => {
    if (err) next(err);
    res.redirect('/events');
  });
});

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndDelete(id, (err) => {
    if (err) next(err);
    Remark.deleteMany({ events: id }, (err, info) => {
      if (err) next(err);
      res.redirect('/events');
    });
  });
});

// Add remarks
router.post('/:id/remarks', (req, res, next) => {
  let eventId = req.params.id;
  req.body.events = eventId;
  Remark.create(req.body, (err, remark) => {
    if (err) next(err);

    Event.findByIdAndUpdate(
      eventId,
      { $push: { remarks: remark._id } },
      (err, event) => {
        if (err) next(err);
        res.redirect('/events/' + eventId);
      }
    );
  });
});

module.exports = router;
