const userModel = require('../../models/user.model.js');
const clubModel = require('../../models/club.model.js');

// [GET] /user/dashbord/detail-user
module.exports.userDetail = async (req, res) => {
    try {
        const token = req.headers['tokenuser'];
        if (token) {
            const user = await userModel.findOne({ tokenUser: token })
                .select('-tokenUser -password -account -_id -__v');

            if (user) {
                res.json({
                    code: 200,
                    message: 'Tải lên người dùng thành công',
                    data: user
                });
                return;
            } else {
                res.json({
                    code: 200,
                    message: 'Không tim thấy người dùng trong hệ thống',
                    data: null
                });
            }
        } else {
            res.json({
                code: 200,
                message: 'Vui lòng thêm token',
                data: null
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [GET] /user/dashbord/detail-club
module.exports.clubDetail = async (req, res) => {
    try {
        const token = req.headers['tokenuser'];
        if (token) {
            const user = await userModel.findOne({
                tokenUser: token
            }).select('clubId');

            const club = await clubModel.findById(user.clubId);
            user.club = club;

            if (user) {
                res.json({
                    code: 200,
                    message: 'Tải lên câu lạc bộ thành công',
                    data: club
                });
                return;
            } else {
                res.json({
                    code: 200,
                    message: 'Không tim thấy câu lạc bộ trong hệ thống',
                    data: null
                });
            }
        } else {
            res.json({
                code: 200,
                message: 'Vui lòng thêm token',
                data: null
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [PUT] /user/dashbord/update-user
module.exports.updateUser = async (req, res) => {
    try {
        const token = req.headers['tokenuser'];
        const newUser = req.body;
        if (!token) {
            return res.json({
                code: 200,
                message: 'Vui lòng thêm token',
                data: null
            });
        }

        const user = await userModel.findOneAndUpdate(
            { tokenUser: token },
            newUser,
            { new: true }
        ).select('-tokenUser -password -account -_id -__v');

        if (user) {
            return res.json({
                code: 200,
                message: 'Cập nhật người dùng thành công',
                data: user
            });
        } else {
            return res.json({
                code: 200,
                message: 'Không tìm thấy người dùng trong hệ thống',
                data: null
            });
        }

    } catch (error) {
        return res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    }
};