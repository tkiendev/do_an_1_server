const taskModel = require('../../models/task.model.js');
const eventModel = require('../../models/event.model.js');
const userModel = require('../../models/user.model.js');

// [GET] /user/manage-task/:clubId
module.exports.index = async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const find = {
            ...req.querys
        };
        if (clubId) {
            const events = await eventModel.find({ clubPresident: clubId, status: 'confirm' });
            const tasks = [];
            if (events.length === 0) {
                return res.status(200).json({
                    code: 200,
                    message: 'Không có sự kiện nào cho câu lạc bộ',
                    data: []
                });
            }
            for (let event of events) {
                if (event.tasksId.length > 0) {
                    for (let taskId of event.tasksId) {
                        const task = await taskModel.findOne({ _id: taskId, ...find });
                        if (task) {
                            tasks.push(task);
                        }
                    }
                }
            }
            if (tasks.length === 0) {
                return res.status(200).json({
                    code: 200,
                    message: 'Không có công việc nào',
                    data: []
                });
            } else {
                return res.status(200).json({
                    code: 200,
                    message: 'Lấy danh sách công việc thành công',
                    data: tasks
                });
            }
        }

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [GET] /user/manage-task/list-event/:clubId
module.exports.listByEvent = async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const events = await eventModel.find({ clubPresident: clubId, status: 'confirm' });
        if (events.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'không có sự kiện nào cho câu lạc bộ',
                data: []
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Lấy danh sách công việc theo sự kiện thành công',
            data: events
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [GET] /user/manage-task/list-user/:eventId
module.exports.listByUser = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await eventModel.findOne({ _id: eventId });
        const users = [];

        for (const userId of event.eventParticipantsId) {
            const user = await userModel.findOne({ _id: userId, status: 'active' }).select('-password -account  -tokenUser');
            users.push(user);
        }

        if (users.length === 0) {
            return res.status(404).json({
                code: 404,
                message: 'không có người dùng nào tham gia sự kiện',
                data: []
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Lấy danh sách người dùng theo sự kiện thành công',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [POST] /user/manage-task/create/:eventId
module.exports.create = async (req, res) => {
    try {
        const task = req.body;
        const eventId = req.params.eventId;
        if (!task) {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu thông tin công việc',
                data: null
            });
        } else {
            const newTask = new taskModel({ ...task });
            await newTask.save();
            if (!newTask) {
                return res.status(400).json({
                    code: 400,
                    message: 'Tạo công việc thất bại',
                    data: null
                });

            } else {
                await eventModel.findByIdAndUpdate(eventId, { $push: { tasksId: newTask.id } });
                return res.status(201).json({
                    code: 201,
                    message: 'Tạo công việc thành công',
                    data: newTask
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [GET] /user/manage-task/calendar/:tokenUser
module.exports.calendar = async (req, res) => {
    // phần này hiển thị các đầu việc theo lịch
    try {
        // const tokenUser = req.headers.tokenUser;
        const tokenUser = req.params.tokenUser;
        if (tokenUser) {
            const userId = (await userModel.findOne({ tokenUser: tokenUser })).id;
            console.log(userId);
            const task = await taskModel.find({ "workParticipantsId": userId, status: 'confirm' });

            return res.status(200).json({
                code: 200,
                message: `Lấy công việc thành công`,
                data: task
            });

        } else {
            return res.status(400).json({
                code: 400,
                message: `Vui lòng truyền lên dữ liệu`,
                data: null
            });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [PUT] /user/manage-task/update/:taskId
module.exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await taskModel.findById(taskId);
        if (task.status === 'action' || task.status === 'inaction') {
            return res.status(400).json({
                code: 400,
                message: 'Công việc đang được thực hiện, không thể cập nhật',
                data: null
            });
        }
        const updateData = req.body;
        const updatedTask = await taskModel.findByIdAndUpdate(taskId, { ...updateData, status: 'update-again' }, { new: true });
        if (!updatedTask) {
            return res.status(400).json({
                code: 400,
                message: 'Cập nhật công việc thất bại',
                data: null
            });
        }
        return res.status(200).json({
            code: 200,
            message: 'Cập nhật công việc thành công',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [GET] /user/manage-task/detail/:taskId
module.exports.detailTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        if (taskId) {
            console.log(taskId);
            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({
                    code: 404,
                    message: 'Công việc không tồn tại',
                    data: null
                });
            }
            return res.status(200).json({
                code: 200,
                message: 'Lấy chi tiết công việc thành công',
                data: task
            });
        } else {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu thông tin truyển lên',
                data: null
            });
        }

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}