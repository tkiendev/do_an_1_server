const mongoose = require('mongoose');
const { Schema } = mongoose;

const moment = require('moment');

const eventShema = new Schema({
    name: String,
    description: String,
    StartTime: { type: Date, set: val => moment(val, "DD-MM-YYYY").toDate() },
    EndTime: { type: Date, set: val => moment(val, "DD-MM-YYYY").toDate() },
    location: String,
    clubPresident: String,
    tasksId: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        enum: ['confirm', 'unconfirm', 'update-again', 'active', 'inactive', 'not-approved'],
        default: 'unconfirm'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createBy: {
        type: Object,
        default: {
            userId: String,
            createTime: Date
        }
    }
});

const eventModel = mongoose.model('Events', eventShema);
module.exports = eventModel;