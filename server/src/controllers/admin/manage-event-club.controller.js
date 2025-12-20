const clubModel = require('../../models/club.model.js');
const eventModel = require('../../models/event.model.js');
const userModel = require('../../models/user.model.js');
const taskModel = require('../../models/task.model.js');
const adminModel = require('../../models/admin.model.js');
const notificationModel = require('../../models/notifications.model.js');

// [GET] /admin/manage-event-club/index?status=?(confirm || unconfirm)
module.exports.index = async (req, res) => {
    try {
        const query = req.query;
        const find = {
            deleted: false,
        }
        if (query.status && (query.status === 'confirm' || query.status === 'unconfirm' || query.status === 'update-again')) {
            find.status = query.status;
        }

        const events = await eventModel.find(find);
        if (events.length === 0) {
            return res.status(200).json({
                code: 200,
                message: 'không có dữ liệu nào trong hệ thống',
                data: []
            });
        } else {
            const listEvent = await Promise.all(
                events.map(async event => {
                    const club = await clubModel.findOne({ _id: event.clubPresident });
                    let userParticipants = [];
                    const userManager = await userModel.findOne({ _id: event.eventManagerId });
                    for (let i = 0; i < event.eventParticipantsId.length; i++) {
                        const user = await userModel.findOne({ _id: event.eventParticipantsId[i] });
                        if (user) {
                            userParticipants.push(user);
                        }
                    }
                    return {
                        event,
                        club,
                        userParticipants,
                        userManager
                    };
                })
            );

            return res.status(200).json({
                code: 200,
                message: 'lấy dữ liệu thành công',
                data: listEvent
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}

// [PUT] /admin/manage-event-club/confirm/:envenId
module.exports.confirmEvent = async (req, res) => {
    try {
        const token = req.headers.token;
        const envenId = req.params.envenId;
        if (envenId) {
            const event = await eventModel.findOne({ _id: envenId });
            if (!event) {
                return res.status(400).json({
                    code: 400,
                    message: 'Sự kiện không tồn tại hoặc đã bị xóa',
                    data: null
                });
            }
            const result = await eventModel.updateOne({ _id: envenId }, { status: 'inactive' });


            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                const club = await clubModel.findOne({ _id: event.clubPresident });
                const userId = (await userModel.find({ clubId: club._id }).select('_id')).map(user => user._id.toString());
                const adminId = (await adminModel.findOne({ token: token }).select('_id'))._id.toString();
                const content = (`
                    Sự kiện của câu lạc bộ đã được chấp nhận hoạt động với thời gian: ${event.StartTime} - ${event.EndTime}
                    trong thời gian diễn ra sự kiện câu lạc bộ phải tuân thủ các quy định của trường
                    nếu có dấu hiệu vi phạm chúng tôi sẽ cưỡng chế dừng sự kiện
                    xin cảm ơn
                `).trim();

                const newNotification = new notificationModel({
                    name: `Sự kiện: ${event.name} đã được duyệt`,
                    content,
                    sentFrom: adminId,
                    sentTo: userId
                });
                newNotification.save();
                if (newNotification) {
                    await userModel.updateMany({ clubId: club._id }, { $push: { notificationsId: newNotification.id } });
                    return res.status(200).json({
                        code: 200,
                        message: 'Chấp nhận sự kiện thành công',
                        data: null
                    });
                }

            } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                return res.status(500).json({
                    code: 500,
                    message: 'Chấp nhận sự kiện thất bại',
                    data: null
                });
            } else {
                return res.status(404).json({
                    code: 404,
                    message: 'Không tìn thấy sự kiện vui lòng kiểm tra lại!',
                    data: null
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}

// [PUT] /admin/manage-event-club/unconfirm/:envenId
module.exports.unconfirmEvent = async (req, res) => {
    try {
        const token = req.headers.token;
        const envenId = req.params.envenId;
        const { content } = req.body;
        console.log(content);
        if (envenId) {
            const event = await eventModel.findOne({ _id: envenId });
            if (!event) {
                return res.status(400).json({
                    code: 400,
                    message: 'Sự kiện không tồn tại hoặc đã bị xóa',
                    data: null
                });
            }
            const result = await eventModel.updateOne({ _id: envenId }, { status: 'not-approved' });


            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                const leaderId = (await clubModel.findOne({ _id: event.clubPresident }).select('nameOfTheOwner')).nameOfTheOwner.toString();
                const adminId = (await adminModel.findOne({ token: token }).select('_id'))._id.toString();
                const newNotification = new notificationModel({
                    name: `Sự kiện: ${event.name} đã bị từ chối`,
                    content,
                    sentFrom: adminId,
                    sentTo: leaderId
                });

                newNotification.save();
                if (newNotification) {
                    await userModel.updateOne({ _id: leaderId }, { $push: { notificationsId: newNotification.id } });
                    return res.status(200).json({
                        code: 200,
                        message: 'Từ chối sự kiện thành công',
                        data: null
                    });
                }

            } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                return res.status(500).json({
                    code: 500,
                    message: 'Từ chối sự kiện thất bại',
                    data: null
                });
            } else {
                return res.status(404).json({
                    code: 404,
                    message: 'Không tìn thấy sự kiện vui lòng kiểm tra lại!',
                    data: null
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}

// [GET] /admin/manage-event-club/detail/:envenId
module.exports.detailEvent = async (req, res) => {
    try {
        const envenId = req.params.envenId;
        if (envenId) {
            const event = await eventModel.findOne({ _id: envenId });
            if (event) {
                const club = await clubModel.findOne({ _id: event.clubPresident });
                const detail = {
                    event: event,
                    club: club
                }
                return res.status(200).json({
                    code: 200,
                    message: 'Lấy dữ liệu thành công',
                    data: detail
                });
            } else {
                return res.status(404).json({
                    code: 404,
                    message: 'Không tìm thấy dữ liệu',
                    data: null
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}

// [GET] /admin/manage-event-club/task/:evenId
module.exports.taskEvent = async (req, res) => {
    try {
        const envenId = req.params.evenId;
        if (envenId) {
            const event = await eventModel.findOne({ _id: envenId });
            if (event) {
                const listTask = await Promise.all(
                    event.tasksId.map(async id => {
                        const task = await taskModel.findOne({ _id: id });
                        return task;
                    })
                );
                return res.status(200).json({
                    code: 200,
                    message: 'Lấy dữ liệu thành công',
                    data: listTask
                });
            } else {
                return res.status(404).json({
                    code: 404,
                    message: 'Không tìm thấy dữ liệu',
                    data: null
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}

// [PUT] /admin/manage-event-club/task/:taskId/:accept(confirm || unconfirm || inaction)
module.exports.confirmtaskEvent = async (req, res) => {
    try {
        const { taskId, accept } = req.params;
        const test = req.params
        console.log(taskId, accept, test)
        if (taskId && accept) {
            const result = await taskModel.updateOne({ _id: taskId }, { status: accept });
            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                return res.status(201).json({
                    code: 201,
                    message: 'Cập nhật công việc thành công',
                    data: null
                });
            } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                return res.status(500).json({
                    code: 500,
                    message: 'Cập nhật công việc thất bại',
                    data: null
                });
            } else {
                return res.status(404).json({
                    code: 404,
                    message: 'Không tìn thấy công việc cần cập nhật vui lòng kiểm tra lại!',
                    data: null
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`
        });
    }
}