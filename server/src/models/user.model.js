const mongoose = require('mongoose');
const { Schema } = mongoose;

const moment = require('moment');

const { generateRandomString } = require('../helpers/random-string.js');

const userSchema = new Schema({
    account: String,
    password: String,
    clubId: String,
    tokenUser: {
        type: String,
        default: generateRandomString(20),
    },
    avatar: {
        type: String,
        default: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'
    },
    notificationsId: {
        type: Array,
        default: []
    },
    regency: {
        type: String,
        enum: ['member', 'club leader', 'vice president of the club', 'secretary', 'prefect'],
    },
    groupId: String,
    fullname: String,
    sex: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        default: 'Nam'
    },
    msv: Number,
    class: String,
    department: String,
    Major: String,
    Facility: {
        type: String,
        default: 'Hà Nội'
    },
    sector: String,
    dateOfBirth: { type: Date, set: val => moment(val, "DD/MM/YYYY").toDate() },
    cccd: Number,
    phone: Number,
    emailUNETI: String,
    email: String,
    address: String,
    contactAddress: String,
    claceOfBirth: String,
    deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        emit: ['active', 'inactive'],
        default: 'inactive'
    }
});

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;