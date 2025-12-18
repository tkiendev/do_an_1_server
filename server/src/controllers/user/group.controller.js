const groupModel = require('../../models/group.model.js');

// [GET] /user/groups/index/:clubId
module.exports.index = async (req, res) => {
    try {
        const groups = await groupModel.find({ clubId: req.params.clubId, deleted: false });

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
                data: null
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

// [POST] /user/groups/index/create/:clubId
module.exports.create = async (req, res) => {
    try {
        const group = req.body;
        const clubId = req.params.clubId;
        if (!clubId) {
            return res.status(400).json({
                code: 400,
                message: `Vui lòng truyền lên đầy đủ tham số`,
                data: null
            });
        }

        const newGroup = new groupModel(group);
        newGroup.clubId = clubId;
        await newGroup.save()
        if (newGroup) {
            return res.status(201).json({
                code: 201,
                message: `Tạo thành công`,
                data: newGroup
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

// [PUT] /user/groups/update/:groupId
module.exports.update = async (req, res) => {
    try {
        const group = req.body;
        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({
                code: 400,
                message: `Vui lòng truyền lên đầy đủ tham số`,
                data: null
            });
        }
        const result = await groupModel.updateOne({ _id: groupId }, group);
        if (result.matchedCount > 0 && result.modifiedCount > 0) {
            return res.status(201).json({
                code: 201,
                message: 'Cập nhật nhóm thành công',
                data: group
            });
        } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
            return res.status(200).json({
                code: 200,
                message: 'Cập nhật nhóm thất bại',
                data: null
            });
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Không tìn thấy nhóm cần cập nhật vui lòng kiểm tra lại!',
                data: null
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

// [delete] /user/groups/delete/:groupId
module.exports.delated = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({
                code: 400,
                message: `Vui lòng truyền lên đầy đủ tham số`,
                data: null
            });
        }
        const result = await groupModel.updateOne({ _id: groupId }, { deleted: true });
        if (result.matchedCount > 0 && result.modifiedCount > 0) {
            return res.status(201).json({
                code: 201,
                message: 'xóa nhóm thành công',
                data: null
            });
        } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
            return res.status(200).json({
                code: 200,
                message: 'xóa nhóm thất bại',
                data: null
            });
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Không tìn thấy nhóm cần xóa vui lòng kiểm tra lại!',
                data: null
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

// [GET] /user/groups/index/detail/:groupId
module.exports.detail = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({
                code: 400,
                message: `Vui lòng truyền lên đầy đủ tham số`,
                data: null
            });
        }
        const group = await groupModel.findOne({ _id: groupId, deleted: false });
        if (group) {
            return res.status(200).json({
                code: 200,
                message: 'Lấy dữ liệu thành công',
                data: group
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