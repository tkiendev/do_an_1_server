const groupModel = require('../../models/group.model.js');
const userModel = require('../../models/user.model.js');

// [PUT] /user/roles/update-role
module.exports.updateRole = async (req, res) => {

    // dạng req 

    // [
    //     listGroupId: ['GroupId-1', 'GroupId-2'],
    //     roles: [
    //         ['các quuyền của nhóm GroupId-1'],
    //         ['các quyền của nhóm GroupId-2'],
    //     ]
    // ]

    // [quản lý bài viết]
    /**
     * tạo bài viết: post_create
     * cập nhật 1 bài viết: post_update
     * xem chi tiết 1 bài viết: post_detail
     */

    // [quản lý công việc]
    /**
     * tạo công việc: task_create
     * cập nhật 1 công việc: task_update
     * xem chi tiết 1 công việc: task_detail
     */

    // [quản lý sự kiện]
    /**
     * tạo sự kiện: event_create
     * cập nhật 1 sự kiện: event_update
     * xem chi tiết 1 sự kiện: event_detail
     */

    // [quản lý tài khoản]
    /**
     * tạo tài khoản: account_create
     * cập nhật 1 tài khoản: account_update
     * xem chi tiết 1 tài khoản: account_detail
     */

    // [quản lý nhóm quyền]
    /**
     * tạo nhóm quyền: group_create
     * cập nhật 1 nhóm quyền: group_update
     * xem chi tiết 1 nhóm quyền: group_detail
     * xóa nhóm quyền: group_delete 
     */

    // [quản lý phân quyền]
    /**
     * cập nhật phân quyền: role_update
     */


    try {
        const { listGroupId, roles } = req.body;
        if (listGroupId.length === roles.length) {
            for (let i = 0; i < listGroupId.length; i++) {
                const groupId = listGroupId[i];
                const role = roles[i];

                const result = await groupModel.updateOne({ _id: groupId }, { $set: { permissions: role } });
                if (result)
                    res.status(200).json({
                        code: 200,
                        message: 'Cập nhật quyền thành công',
                        data: null
                    });

            }
        } else {
            return res.status(200).json({
                code: 200,
                message: 'Vui lòng điền đầu đủ thông tin',
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

// [PUT] /user/roles/add-user/:userId/:groupId
module.exports.addUser = async (req, res) => {
    try {
        const { userId, groupId } = req.params;
        if (userId && groupId) {
            const user = await userModel.findOne({ _id: userId });
            if (user.groupId) {
                return res.status(500).json({
                    code: 500,
                    message: 'Người dùng đã có nhóm vui lòng chọn người dùng khác',
                });
            }
            const result = await userModel.updateOne({ _id: userId }, { groupId: groupId });
            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                return res.status(200).json({
                    code: 200,
                    message: 'Thêm vào nhóm quyền thành công',
                });
            } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                return res.status(500).json({
                    code: 500,
                    message: 'Thêm vào nhóm quyền thất bại',
                });
            } else {
                return res.status(204).json({
                    code: 204,
                    message: 'Không tìm thấy người dùng trong hệ thống',
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
        });
    }
}