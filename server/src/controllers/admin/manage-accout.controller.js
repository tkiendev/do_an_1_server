const userModel = require('../../models/user.model.js');
const clubModel = require('../../models/club.model.js')

// [GET] admin/manage-accout/index
module.exports.index = async (req, res) => {
    try {
        const find = {
            delete: false
        }

        const users = await userModel.find(find).select('-tokenUser');

        const listUser = []
        for (user of users) {
            const club = await clubModel.findOne({ _id: clubId });
            user.club = club;
            listUser.push(user);
        }

        if (listUser.length === 0) {
            return res.status(204).json({
                code: 204,
                message: `Không có dữ liệu nào trong hệ thống`,
                data: []
            });
        }
        return res.status(200).json({
            code: 200,
            message: `Lấy dữ liệu thành công`,
            data: listUser
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}