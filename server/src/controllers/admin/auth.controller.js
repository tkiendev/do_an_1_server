const adminModel = require('../../models/admin.model.js');

// [POST] /admin/auth/login
module.exports.login = async (req, res) => {
    try {
        if (req.body) {
            const { adminUsername, adminPassword } = req.body;
            const admin = await adminModel.findOne({
                adminUsername: adminUsername,
                deleted: false,
            });
            if (admin) {
                // const checkLogin = (await bcryptHelper.verifyPassword(password, admin.password));
                const checkLogin = adminPassword === admin.adminPassword ? true : false;
                if (checkLogin) {
                    res.json({
                        code: 200,
                        message: `Đăng nhập thành công`,
                        data: {
                            token: admin.token,
                        }
                    });
                } else {
                    res.json({
                        code: 500,
                        message: `Sai mật khẩu vui lòng kiểm tra lại`,
                        data: null
                    });
                }

            } else {
                res.json({
                    code: 500,
                    message: `Tài khoản không tồn tại hoặc đã bị xóa`,
                    data: null
                });
            }
        }
        else {
            res.json({
                code: 500,
                message: `Vui lòng truyền lên thông tin tài khoản và mật khẩu`,
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

// [POST] /user/author/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', { path: '/admin' });
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