const eventModel = require('../../models/event.model');

// [GET] /user/manage-event/list/:clubId
module.exports.index = async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const find = {
            clubPresident: clubId, deleted: false
        };

        const query = req.query;
        if (query.status) {
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

// [POST] /user/manage-event/create/:cubId
module.exports.create = (req, res) => {
    try {
        const clubId = req.params.clubId;

        const event = req.body;
        if (!clubId) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu id câu lạc bộ',
                data: null
            });
        }
        if (!event) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu thông tin sự kiện',
                data: null
            });
        }

        event.eventParticipantsId = event.eventParticipantsId.split(',')
        const newEvent = new eventModel({
            ...event,
            clubPresident: clubId
        });
        newEvent.save();
        if (!newEvent) {
            return res.status(400).json({
                code: 400,
                message: 'Tạo sự kiện thất bại',
                data: null
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Tạo sự kiện thành công',
            event: newEvent
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
            data: null
        });
    }
}

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
        }
        return res.status(200).json({
            code: 200,
            message: 'Cập nhật sự kiện thành công',
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