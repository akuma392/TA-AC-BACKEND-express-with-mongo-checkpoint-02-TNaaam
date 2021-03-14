var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: String,
    host: String,
    start_date: Date,
    end_date: Date,

    category: [String],
    likes: { type: Number, default: 0 },
    location: String,
    remarks: [{ type: Schema.Types.ObjectId, ref: 'Remark' }],
  },
  { timestamps: true }
);

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;

// - title
// - summary(brief explanation of events)
// - host(could be a person or an organization)
// - start_date
// - end_date
// - event_category like programming, sports, trekking
// - there can be multiple categories for a single event
// - location
// - likes(default to 0)
// - timestamps
// - multiple remarks made on that event (ONE - MANY assocs)
