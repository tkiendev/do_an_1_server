const taskModel = require('../models/task.model.js');
const cron = require('node-cron');

module.exports = () => {
    cron.schedule('0 12 * * *', async () => {
        try {
            const now = new Date();
            const tasks = await taskModel.find({});
            for (let task of tasks) {
                if (task.status === 'update-again' || task.status === 'unconfirm') {
                    continue;
                }
                if (task.StartTime < now && task.status === 'confirm') {
                    await taskModel.updateOne({ _id: task._id }, { status: 'action' });
                }
                if (task.EndTime < now && task.status === 'action') {
                    await taskModel.updateOne({ _id: task._id }, { status: 'inaction' });
                }
            }
        }
        catch (error) {
            console.error('Lỗi khi cập nhật trạng thái công việc:', error);
        }
    });
}

