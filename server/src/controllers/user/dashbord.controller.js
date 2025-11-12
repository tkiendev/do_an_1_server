const userModel = require('../../models/user.model.js');
const clubModel = require('../../models/club.model.js');

// [GET] /user/dashbord/detail-user
module.exports.userDetail = async (req, res) => {
    try {
        const token = req.headers['tokenuser'];
        if (token) {
            const user = await userModel.findOne({
                tokenUser: token
            }).select('-tokenUser -password -account');

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