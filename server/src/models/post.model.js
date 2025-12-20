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
        enum: ['confirm', 'unconfirm', 'update-again'],
        default: 'unconfirm'
    },
    eventId: String,
    foundation: {
        type: Array,
        emit: ['facebook', 'instagram', 'twitter', 'website'],
        default: ['facebook'],
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

const postModel = mongoose.model('post', postSchema);
module.exports = postModel;