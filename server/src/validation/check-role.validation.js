const userModel = require('../models/user.model.js');
const groupModel = require('../models/group.model.js');

module.exports = async (req, res, next, role) => {
    const tokenUser = req.cookies.tokenUser
    if (tokenUser) {
        const groupId = await userModel.findOne({ tokenUser: tonkenUser }).select('groupId');
        const roleUser = await groupModel.findOne({ _id: groupId }).select('permissions');
        if (roleUser) {
            if (roleUser.includes[role]) {
                next();
            }
        } else {
            return res.status(500).json({
                code: 500,
                message: 'Bạn không có quyền truy cập'
            });
        }
    } else {
        return res.status(500).json({
            code: 500,
            message: 'Vui lòng đăng nhập'
        });
    }
}