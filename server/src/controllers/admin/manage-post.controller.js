const postModel = require('../../models/post.model.js');
const eventModel = require('../../models/event.model.js');

// [GET] /admin/manage-post/index?status=?('confirm', 'unconfirm', 'update-again')
module.exports.index = async (req, res) => {
    try {
        const query = req.query;
        const find = {
            deleted: false,
            status: 'confirm'
        }
        if (query.status && (query.status === 'confirm' || query.status === 'unconfirm' || query.status === 'update-again')) {
            find.status = query.status;
        }
        // call db
        const listPost = await postModel.find(find);
        if (listPost.length === 0) {
            return res.status(204).json({
                code: 204,
                message: 'không có dữ liệu nào trong hệ thống',
                data: null
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Lấy dữ liệu thành công',
            data: listPost
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [POST] /admin/manage-post/confirm/:postId
module.exports.confirmPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postModel.findOne({ _id: postId });
        const eventId = post.eventId;
        if (postId) {
            await postModel.updateOne({ _id: postId }, { status: 'confirm' });
            res.status(200).json({
                code: 200,
                message: 'Xác nhận bài viết thành công',
                data: null
            });

            // gửi email thông báo
            const event = await eventModel.findOne({ _id: eventId });
            const users = await userModel.find({ eventId: eventId, deleted: false });
            const sendEmailAutoHelper = require('../../helpers/send-auto-email.js');
            for (const user of users) {
                const subject = `Đã duyệt bài viết ${post.name} cho sự kiện ${event.name}`;
                const text = `Chào ${user.fullName},\n\nBài viết "${post.name}" cho sự kiện "${event.name}" đã được duyệt thành công.\n\nTrân trọng,\nBan Quản Trị`;
                const toEmail = user.email;
                await sendEmailAutoHelper.sendEmailEventConfirmed(subject, text, toEmail);
            }
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}