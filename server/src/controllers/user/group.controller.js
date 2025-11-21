const groupModel = require('../../models/groups.model.js');

// [GET] /user/groups/index
module.exports.index = (req, res) => {
    try {
        const groups = groupModel.find({ deleted: false });
        if (groups.length > 0) {
            return res.status(200).json({
                code: 200,
                message: `Lấy dữ liệu thành công`,
                data: groups
            });
        } else {
            return res.status(404).json({
                code: 404,
                message: `Không có đữ liệu nào trong hệ thống`,
                data: []
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}