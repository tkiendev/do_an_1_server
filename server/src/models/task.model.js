const mongoose = require('mongoose');
const { Schema } = mongoose;

const moment = require('moment');

const taskShema = new Schema({
    name: String,
    description: String,
    location: String,
    StartTime: { type: Date, set: val => moment(val).toDate() },
    EndTime: { type: Date, set: val => moment(val).toDate() },
    workParticipantsId: {
        type: Array,
        default: [],
    },
    status: {
        type: String,
        enum: ['confirm', 'unconfirm', 'action', 'inaction', 'update-again', 'completed'],
        default: 'unconfirm'
    },
});

const taskModel = mongoose.model('Tasks', taskShema);
module.exports = taskModel;