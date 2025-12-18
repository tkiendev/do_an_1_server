const taskModel = require('../../models/task.model.js');
const userModel = require('../../models/user.model.js');

// [GET] /admin/manage-task/index
module.exports.index = async (req, res) => {
    try {
        const listTask = await taskModel.find({ deleted: false });
        if (listTask.length === 0) {
            return res.status(200).json({
                code: 200,
                message: 'không có dữ liệu nào trong hệ thống',
                data: []
            });
        }
        else {
            return res.status(200).json({
                code: 200,
                message: 'lấy dữ liệu thành công',
                data: listTask
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}

// [GET] /admin/manage-task/user/:userId
module.exports.userTask = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu id người dùng',
                data: null
            });
        }
        const users = await userModel.findOne({ _id: userId, deleted: false });
        if (!users) {
            return res.status(200).json({
                code: 200,
                message: 'không có dữ liệu nào trong hệ thống',
                data: []
            });
        }
        else {
            return res.status(200).json({
                code: 200,
                message: 'lấy dữ liệu thành công',
                data: users
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}