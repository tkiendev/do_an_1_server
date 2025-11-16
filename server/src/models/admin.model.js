const mongoose = require('mongoose');
const { Schema } = mongoose;

const { generateRandomString } = require('../helpers/random-string.js');

const adminSchema = new Schema({
    adminPassword: {
        type: String, required: true
    },
    adminUsername: {
        type: String, required: true, unique: true
    },
    token: {
        type: String,
        required: true,
        default: generateRandomString(20)
    },
    avatar: {
        type: String,
        default: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'
    },
    fullname: String,
    sex: String,
    address: String,
    usersId: Array,
    clubsId: Array,
    notifocationsId: Array,
    postsId: Array,
    deleted: { type: Boolean, default: false }
});

const adminModel = mongoose.model('Admins', adminSchema);
module.exports = adminModel;