
const clubModel = require('../../models/club.model.js');
const userModel = require('../../models/user.model.js');

const { sendEmailAutoHelper } = require('../../helpers/send-auto-email.js');

// [GET] /admin/manage-club/index?status=?(confirm || inconfirm)
module.exports.index = async (req, res) => {
    try {
        const query = req.query;
        const find = {
            deleted: false,
            status: 'confirm'
        }

        if (query.status && (query.status === 'confirm' || query.status === 'inconfirm')) {
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

// [PUT] /admin/manage-club/confirm-registration/:clubId/:userId
module.exports.confirmRegistration = async (req, res) => {
    try {
        const { clubId, userId } = req.params;
        if (clubId && userId) {
            await clubModel.updateOne({ _id: clubId }, { status: 'confirm' });
            await userModel.updateOne({ _id: userId }, { status: 'active' });

            const user = await userModel.findOne({ _id: userId });
            const club = await clubModel.findOne({ _id: clubId });

            // gửi email tự động
            let text = `
            Câu lạc bộ ${club.name} với trưởng cậu lạc bộ ${user.fullname}
            Tài khoản và mật khẩu của bạn (vui lòng ko tiết lộ tài khảon mật khẩu cho bất kỳ ai)
            
            Tài khoản: ${user.account}
            Mật khẩu: *********
            
            Câu lạc bộ của bạn sẽ bắt đầu từ hôm nay 
            `;
            let subject = `Xác nhận đăng ký câu lạc bộ`;
            await sendEmailAutoHelper(subject, text, user.emailUNETI);

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

