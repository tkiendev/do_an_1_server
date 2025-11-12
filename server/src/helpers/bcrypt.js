const bcrypt = require('bcrypt');

module.exports.hashPassword = async (password) => {
    let newPassword
    if (password) {
        newPassword = await bcrypt.hash(password, 10);
    } else {
        newPassword = await bcrypt.hash('1111', 10);
    }
    return newPassword
}

module.exports.verifyPassword = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    return match;
}