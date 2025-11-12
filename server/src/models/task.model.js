const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskShema = new Schema({
    // name: String,
    // description: String,
    // location: String,
    // activityDetails: String,
    // memberIds: {
    //     type: Array,
    //     default: [],
    // },
    // status: {
    //     type: String,
    //     default: 'inactive'
    // },
});

const taskModel = mongoose.model('Tasks', taskShema);
module.exports = taskModel;