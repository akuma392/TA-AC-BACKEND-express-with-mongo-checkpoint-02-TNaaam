var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');
var moment = require('moment');

/* GET users listing. */

// filter category

router.get('/category/:type', (req, res, next) => {
  // console.log(req.params, 'category***********');
  let type = req.params.type;
  let category = [];
  Event.find({ category: type }).exec((err, events) => {
    if (err) next(err);
    res.render('event', { events: events, category: category });
  });
});

// search events on locations
router.post('/search/city', (req, res, next) => {
  let category = [];
  let city = req.body.search;
  // Event.find({ location: city }).exec((err, events) => {
  Event.find({ location: { $regex: new RegExp(city, 'i') } }).exec(
    (err, events) => {
      if (err) next(err);
      res.render('event', { events: events, category: category });
    }
  );
});

// filters events

// using location
router.get('/location', (req, res, next) => {
  let category = [];
  Event.find({})
    .sort({ location: 1 })
    .exec((err, events) => {
      if (err) next(err);
      res.render('event', { events: events, category: category });
    });
});

// filter using start date of events
router.get('/date', (req, res, next) => {
  let category = [];
  Event.find({})
    .sort({ start_date: 1 })
    .exec((err, events) => {
      if (err) next(err);
      res.render('event', { events: events, category: category });
    });
});

// sort events using category
router.get('/category', (req, res, next) => {
  let category = [];
  Event.find({})
    .sort({ category: 1 })
    .exec((err, events) => {
      if (err) next(err);
      res.render('event', { events: events, category: category });
    });
});

// show events lists
router.get('/', (req, res) => {
  Event.find({}, (err, events, next) => {
    if (err) return next(err);

    Event.distinct('category', (err, category) => {
      if (err) return next(err);
      res.render('event', {
        events: events,
        category: category,
        moment: moment,
      });
    });
  });
});
// create new events in list
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

// check individual event
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id)
    .populate('remarks')
    .exec((err, event) => {
      if (err) next(err);
      res.render('singleEvent', { event: event, moment: moment });
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

// edit events
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
// router.get('/:id/delete', (req, res, next) => {
//   let id = req.params.id;
//   Event.findByIdAndDelete(id, (err, deletedEvent) => {
//     if (err) next(err);
//     res.redirect('/events');
//   });
// });

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndDelete(id, (err) => {
    if (err) next(err);
    Remark.deleteMany({ events: id }, (err, info) => {
      // console.log(err, info, '****');
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
