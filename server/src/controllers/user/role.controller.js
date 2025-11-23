const groupModel = require('../../models/group.model.js');

// [GET] /user/roles/update-role
module.exports.updateRole = async (req, res) => {

    // dạng req 

    // [
    //     ['GroupId-1', 'GroupId-2'],
    //     [
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
                if (result.matchedCount > 0 && result.modifiedCount > 0) {
                    return res.status(201).json({
                        code: 201,
                        message: 'Cập nhật quyền thành công',
                        data: null
                    });
                } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                    return res.status(200).json({
                        code: 200,
                        message: 'Cập nhật quyền thất bại',
                        data: null
                    });
                } else {
                    return res.status(404).json({
                        code: 404,
                        message: 'Không tìn thấy nhóm quyền vui lòng kiểm tra lại!',
                        data: null
                    });
                }
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