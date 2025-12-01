const userModel = require('../../models/user.model.js');
const clubModel = require('../../models/club.model.js');

const bcryptHelper = require('../../helpers/bcrypt.js');


// [POST] /user/author/login
module.exports.login = async (req, res) => {
    try {
        if (req.body) {
            const { account, password } = req.body;
            const user = await userModel.findOne({
                account: account,
                deleted: false,
                status: 'active'
            });
            if (user) {
                const checkLogin = (await bcryptHelper.verifyPassword(password, user.password));
                if (checkLogin) {
                    res.json({
                        code: 200,
                        message: `Đăng nhập thành công`,
                        data: {
                            tokenUser: user.tokenUser,
                            clubId: user.clubId,
                        }
                    });
                } else {
                    res.json({
                        code: 200,
                        message: `Sai mật khẩu vui lòng kiểm tra lại`,
                        data: null
                    });
                }

            } else {
                res.json({
                    code: 200,
                    message: `Tài khoản không tồn tại hoặc đã bị xóa`,
                    data: null
                });
            }
        }
        else {
            res.json({
                code: 200,
                message: `Vui lòng truyền lên thông tin tài khoản và mật khẩu`,
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

// [POST] /user/author/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('tokenUser', { path: '/user' });
        res.clearCookie('clubId', { path: '/user' });
        res.json({
            code: 200,
            message: `Đăng xuất thành công`,
            data: null
        });
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [POST] /user/author/register-club
module.exports.register = async (req, res) => {
    try {
        if (req.body) {
            const [club, accoutClubPresident] = req.body;
            if (club) {
                const newClub = new clubModel(club);
                await newClub.save();

                const newAccoutClubPresident = new userModel(accoutClubPresident);
                newAccoutClubPresident.password = await bcryptHelper.hashPassword(newAccoutClubPresident.password);
                newAccoutClubPresident.clubId = newClub._id;
                newAccoutClubPresident.regency = 'club-leader';
                await newAccoutClubPresident.save();

                await clubModel.updateOne({ _id: newClub._id }, { clubAbbraviation: newAccoutClubPresident_id });

                if (newClub && newAccoutClubPresident) {
                    res.json({
                        code: 200,
                        message: `Đăng ký câu lạc bộ thành công vui lòng chờ xét duyệt, thông tin xét duyệt sẽ được gửi đến gmail của bạn`,
                        data: null
                    });
                }
            }
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    }
}