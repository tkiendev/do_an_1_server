const mongoose = require('mongoose');
const { Schema } = mongoose;

const moment = require('moment');

const eventShema = new Schema({
    name: String,
    description: String,
    StartTime: { type: Date, set: val => moment(val).toDate() },
    EndTime: { type: Date, set: val => moment(val).toDate() },
    location: String,
    eventManagerId: String,
    eventParticipantsId: {
        type: Array,
        default: []
    },
    clubPresident: String,
    tasksId: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        enum: ['confirm', 'unconfirm', 'update-again'],
        default: 'unconfirm'
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const eventModel = mongoose.model('Events', eventShema);
module.exports = eventModel;