const mongoose = require('mongoose');
const { Schema } = mongoose;

const clubShema = new Schema({
    name: String,
    clubAbbraviation: String,
    description: String,
    nameOfTheOwner: String,
    status: {
        type: String,
        emit: ['confirm', 'unconfirm', 'update-again'],
        default: 'unconfirm'
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const clubModel = mongoose.model('Clubs', clubShema);
module.exports = clubModel;