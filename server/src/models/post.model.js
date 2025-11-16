const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    name: String,
    description: String,
    postDate: { type: Date, default: Date.now },
    content: String,
    img: {
        type: Array,
        default: [],
    },
    status: {
        type: String,
        default: 'inactive'
    },
    eventId: String,
    foundation: {
        type: Array,
        emit: ['facebook', 'instagram', 'twitter', 'website'],
        default: [],
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const postModel = mongoose.model('post', postSchema);
module.exports = postModel;