const clubModel = require('../../models/club.model.js');
const eventModel = require('../../models/event.model.js');
const userModel = require('../../models/user.model.js');
const taskModel = require('../../models/task.model.js');

// [GET] /admin/manage-event-club/index?status=?(confirm || unconfirm)
module.exports.index = async (req, res) => {
    try {
        const query = req.query;
        const find = {
            deleted: false,
            status: 'confirm'
        }
        if (query.status && (query.status === 'confirm' || query.status === 'unconfirm')) {
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
                    const user = await userModel.find({ clubId: club._id }).select('-tokenUser -password -accout');
                    return {
                        event,
                        club,
                        user
                    };
                })
            );

            console.log(listEvent); // lúc này mới là dữ liệu thật
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
        const envenId = req.params.envenId;
        if (envenId) {
            const result = await eventModel.updateOne({ _id: envenId }, { status: 'confirm' });

            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                return res.status(200).json({
                    code: 200,
                    message: 'Chấp nhận sự kiện thành công',
                    data: null
                });
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

// [GET] /admin/manage-event-club/task/:envenId
module.exports.taskEvent = async (req, res) => {
    try {
        const envenId = req.params.envenId;
        if (envenId) {
            const event = await eventModel.findOne({ _id: envenId });
            if (event) {
                const listTask = event.tasksId.map(async id => {
                    const task = await taskModel.findOne({ _id: id });
                    return task;
                });
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