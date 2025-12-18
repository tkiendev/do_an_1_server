const groupModel = require('../../models/group.model.js');
const clubModel = require('../../models/club.model.js');
const userModel = require('../../models/user.model.js');

const sendEmailAutoHelper = require('../../helpers/send-auto-email.js');

// [GET] /admin/manage-club/index?status=?(confirm || inconfirm)
module.exports.index = async (req, res) => {
    try {
        const query = req.query;
        const find = {
            deleted: false,
            status: 'confirm'
        }

        if (query.status && (query.status === 'confirm' || query.status === 'unconfirm') || query.status === 'update-again') {
            find.status = query.status;
        }

        // call db
        const listClub = await clubModel.find(find);
        const clubs = await Promise.all(
            listClub.map(async (club) => {
                const users = await userModel.find({ clubId: club._id });
                return { club: club, users: users };
            })
        );


        if (clubs.length === 0) {
            return res.status(204).json({
                code: 204,
                message: 'không có dữ liệu nào trong hệ thống',
                data: null
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Lấy dữ liệu thành công',
            data: clubs
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

module.exports.confirmRegistration = async (req, res) => {
    try {
        const { clubId } = req.params;
        if (clubId) {
            await clubModel.updateOne({ _id: clubId }, { status: 'confirm' });
            await userModel.updateOne({ clubId: clubId }, { status: 'active' });

            const user = await userModel.findOne({ clubId: clubId, regency: 'club-leader' });
            const club = await clubModel.findById(clubId);

            if (!club || !user) {
                return res.status(404).json({ message: "Không tìm thấy dữ liệu phù hợp" });
            }

            const group = {
                name: 'Nhóm trưởng',
                description: 'nhóm dành cho những người quản lý(trưởng - phó câu lạc bộ)',
                permissions: [
                    'post-create', 'post_detail', 'task_create', 'task_update', 'task_detail',
                    'event_create', 'event_update', 'event_detail', 'account_create', 'account_update',
                    'account_detail', 'group_create', 'group_update', 'group_detail', 'group_delete', 'role_update'
                ],
                clubId: club._id, // dùng _id thay vì id
            };

            const newGroup = new groupModel(group);
            await newGroup.save();

            await userModel.updateOne({ clubId: clubId }, { groupId: newGroup._id });

            // gửi email tự động
            let text = `
        Câu lạc bộ ${club.name} với trưởng câu lạc bộ ${user.fullname}
        Tài khoản và mật khẩu của bạn (vui lòng không tiết lộ cho ai)

        Tài khoản: ${user.account}
        Mật khẩu: *********

        Câu lạc bộ của bạn sẽ bắt đầu từ hôm nay
      `;
            let subject = `Xác nhận đăng ký câu lạc bộ`;
            await sendEmailAutoHelper.sendAutoEmail(subject, text, user.email);

            return res.status(200).json({
                code: 200,
                message: `Xác nhận thành công`,
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

// [GET] /admin/manage-club/detail/:clubId?status=?(confirm || inconfirm)
module.exports.detail = async (req, res) => {
    try {
        const query = req.query;
        const find = {
            deleted: false,
        }
        const { clubId } = req.params;
        if (clubId) {
            find._id = clubId;
        }
        if (query.status && (query.status === 'confirm' || query.status === 'unconfirm')) {
            find.status = query.status;
        }
        // call db
        const club = await clubModel.findOne(find);
        if (!club) {
            return res.status(404).json({
                code: 404,
                message: 'không có dữ liệu nào trong hệ thống',
                data: null
            });
        }
        const users = await userModel.find({ clubId: club._id });

        return res.status(200).json({
            code: 200,
            message: 'Lấy dữ liệu thành công',
            data: { club: club, users: users }
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}