const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    name: String,
    content: String,
    sentFrom: {
        type: Array,
        default: [],
    },
    sentTo: {
        type: Array,
        default: [],
    }
});

const notificationModel = mongoose.model('Notifications', notificationSchema);
module.exports = notificationModel;