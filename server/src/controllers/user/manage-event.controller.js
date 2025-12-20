const moment = require('moment');

const eventModel = require('../../models/event.model');
const userModel = require('../../models/user.model');
const notificationModel = require('../../models/notifications.model');
const clubMode = require('../../models/club.model');
const adminModel = require('../../models/admin.model');

// [GET] /user/manage-event/list/:clubId
module.exports.index = async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const find = {
            clubPresident: clubId, deleted: false
        };

        const query = req.query;
        if (query.status && query.status === 'confirm' || query.status === 'unconfirm' || query.status === 'update-again') {
            find.status = query.status;
        }

        if (!clubId) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu id câu lạc bộ',
                data: null
            });
        }

        // call db
        const events = await eventModel.find(find);

        if (events.length > 0) {
            return res.status(200).json({
                code: 200,
                message: 'Lấy danh sách sự kiện thành công',
                data: events
            });
        } else {
            return res.status(200).json({
                code: 200,
                message: 'Không có dữ liệu trong hệ thống',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
            data: null
        });
    }
}

// [POST] /user/manage-event/create/:clubId
module.exports.create = async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const event = req.body;
        const tokenUser = req.headers.tokenuser;

        if (!tokenUser) {
            return res.status(400).json({ code: 400, message: 'Thiếu token', data: null });
        }
        if (!clubId) {
            return res.status(400).json({ code: 400, message: 'Thiếu id câu lạc bộ', data: null });
        }
        if (!event) {
            return res.status(400).json({ code: 400, message: 'Thiếu thông tin sự kiện', data: null });
        }

        const userCreate = await userModel.findOne({ tokenUser });
        if (!userCreate) {
            return res.status(404).json({ code: 404, message: 'Không tìm thấy user', data: null });
        }

        const newEvent = new eventModel({
            ...event,
            clubPresident: clubId,
            createBy: {
                userId: userCreate._id.toString(),
                createTime: moment().add(7, 'hours').toDate() // giờ VN
            }
        });

        const savedEvent = await newEvent.save();
        if (!savedEvent) {
            return res.status(400).json({ code: 400, message: 'Tạo sự kiện thất bại', data: null });
        }

        const club = await clubModel.findOne({ _id: clubId });
        if (!club) {
            return res.status(404).json({ code: 404, message: 'Không tìm thấy câu lạc bộ', data: null });
        }

        const adminDocs = await adminModel.find({ deleted: false }).select('_id');
        const adminIds = adminDocs.map(admin => admin._id.toString());

        const content = `
      Sự kiện ${savedEvent.name} vừa được tạo thành công và đang trong trạng thái chờ duyệt
      Chi tiết sự kiện: ${savedEvent.description}
      Thời gian: ${savedEvent.StartTime} - ${savedEvent.EndTime}
      Địa điểm: ${savedEvent.location}
    `.trim();

        const newNotification = new notificationModel({
            name: `${savedEvent.createBy.createTime} - Câu lạc bộ ${club.name}: ${userCreate.fullname} đã tạo 1 sự kiện và đang chờ duyệt`,
            content,
            sentFrom: userCreate._id.toString(),
            sentTo: adminIds
        });

        const savedNotification = await newNotification.save();

        if (savedNotification) {
            await adminModel.updateMany(
                { deleted: false },
                { $push: { notificationsId: savedNotification._id.toString() } }
            );
        }

        return res.status(200).json({
            code: 200,
            message: 'Tạo sự kiện thành công',
            event: savedEvent
        });

    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message, data: null });
    }
};

// [GET] /user/manage-event/detail/:eventId
module.exports.detail = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (!eventId) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu id sự kiện',
                data: null
            });
        }
        const event = await eventModel.findOne({ _id: eventId, deleted: false });
        if (!event) {
            return res.status(404).json({
                code: 404,
                message: 'Không tìm thấy sự kiện',
                data: null
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Lấy thông tin sự kiện thành công',
            data: event
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
            data: null
        });
    }
}

// [PUT] /user/manage-event/update/:eventId
module.exports.update = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const updatedEvent = req.body;
        const clubId = req.headers.clubid;
        const tokenUser = req.headers.tokenuser;

        updatedEvent.status = 'update-again';
        if (!eventId) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu id sự kiện',
                data: null
            });
        }
        if (!updatedEvent) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu thông tin sự kiện cập nhật',
                data: null
            });
        }
        const event = await eventModel.findOneAndUpdate(
            { _id: eventId, deleted: false },
            { $set: updatedEvent },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({
                code: 404,
                message: 'Cập nhật sự kiện thất bại',
                data: null
            });
        } else {
            const adminIds = (await adminModel.find({}).select('_id')).map(admin => admin._id.toString());
            const user = await userModel.findOne({ tokenUser: tokenUser });
            const club = await clubMode.findOne({ _id: clubId });
            const content = (`
                   Câu lạc bộ đã nhận được phản hồi của phía nhà trường và đã sửa lại sự kiện cho phù hợp với tình hình của trường
                   Sự kiện đã chỉnh sửa lại như sau: 

                   Tên sự kiện: ${event.name}
                   Thời gian: ${event.StartTime} - ${event.EndTime}
                   Nội dung sự kiện: ${event.description}
                   Địa điểm tổ chức sự kiện: ${event.location}
                `).trim();

            const newNotification = new notificationModel({
                name: `${user.fullname} - ${club.name} gửi thông báo xin duyệt lại sự kiện`,
                content,
                sentFrom: user._id,
                sentTo: adminIds
            });
            newNotification.save();
            if (newNotification) {
                await adminModel.updateMany({}, { $push: { notificationsId: newNotification.id } });
                return res.status(200).json({
                    code: 200,
                    message: 'Cập nhật sự kiện thành công và đã gửi phê duyệt lại',
                    data: event
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            code: 500,
            message: error.message,
            data: null
        });
    }
}

// [DELETE] /user/manage-event/delete/:eventId
module.exports.delete = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (!eventId) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu id sự kiện',
                data: null
            });
        }
        const event = await eventModel.findOneAndUpdate(
            { _id: eventId, deleted: false },
            { $set: { deleted: true } },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({
                code: 404,
                message: 'Xóa sự kiện thất bại',
                data: null
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Xóa sự kiện thành công',
            data: event
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
            data: null
        });
    }
}