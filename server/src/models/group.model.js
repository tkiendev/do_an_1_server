const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    name: String,
    description: String,
    clubId: String,
    permissions: {
        type: Array,
        default: [],
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const groupModel = mongoose.model('group', groupSchema);
module.exports = groupModel;