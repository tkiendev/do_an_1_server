const userModel = require('../models/user.model.js');

module.exports = (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;
    if (tokenUser) {
        const user = userModel.findOne({ tokenUser: tokenUser }).select('-password');
        if (user) {
            if (user.active === 'inactive') {
                return res.status(200).json({
                    code: 200,
                    message: 'Tài khoản của bạn chưa được kích hoạt',
                    data: null
                });
            } else {
                next();
            }
        } else {
            return res.status(204).json({
                code: 204,
                message: 'Không tìm thấy tài khoản',
                data: null
            });
        }
    } else {
        return res.status(200).json({
            code: 200,
            message: 'Vui lòng đăng nhập',
            data: null
        });
    }
}