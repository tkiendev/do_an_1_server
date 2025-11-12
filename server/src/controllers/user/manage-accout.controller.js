const accountModel = require('../../models/user.model.js');
const clubModel = require('../../models/club.model.js');

const bcryptHelper = require('../../helpers/bcrypt.js');

// [GET] /user/manage-account/
module.exports.index = async (req, res) => {
    try {
        const query = { ...req.querys };
        const find = {
            clubId: req.headers.clubid,
            deleted: false,
        };
        const sort = {
            fullname: 1
        };

        // /user/manage - account ? keySort = String & valueSort=(1 || -1)
        if (query.keySort && query.valueSort) {
            sort[keySort] = query.valueSort
        }

        // /user/manage - account ? keySeach = String
        if (query.keySeach) {
            const regex = new regex(keySeach, '/i');
            find.fullname = regex;
        }

        const account = await accountModel.find(find).sort(sort);
        if (account.length > 0) {
            res.json({
                code: 200,
                message: `Lấy dữ liệu thành công`,
                data: account
            });
        } else {
            res.json({
                code: 200,
                message: `Không có tài khoản nào trong hệ thống`,
                data: []
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    };

}

// [DELETE] /user/manage-account/delete/:id
module.exports.deleteAccout = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId) {
            const result = await accountModel.findByIdAndUpdate(userId, { deleted: true }, { new: true });
            if (result.deleted) {
                res.json({
                    code: 200,
                    message: `Xóa tài khoảng thành công`,
                    data: null
                });
                return;
            }
        } else {
            res.json({
                code: 200,
                message: `Không tìm thấy id được gửi lên`,
                data: null
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    };
}

// [PATCH] /user/manage-account/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const userId = req.params.id;
        const newAccount = req.body;

        if (newAccount.cccd) {
            newAccount.cccd = parseInt(newAccount.cccd);
        }
        if (newAccount.phone) {
            newAccount.phone = parseInt(newAccount.phone);
        }
        if (newAccount.msv) {
            newAccount.msv = parseInt(newAccount.msv);
        }

        if (newAccount) {
            const result = await accountModel.updateOne({ _id: userId }, newAccount);
            if (result.acknowledged && !result.matchedCount) {
                res.json({
                    code: 200,
                    message: `Không tìm thấy tài khoản trong cớ sở dữ liệu`,
                    data: null
                });
                return;
            }
            else {
                if (result.upsertedCount) {
                    res.json({
                        code: 200,
                        message: `Sửa tài khoản thành công`,
                        data: null
                    });
                    return;
                } else {
                    res.json({
                        code: 200,
                        message: `Các trường dữ liệu giống với các trường dữ liệu đã có trước đó`,
                        data: null
                    });
                }
            }
        } else {
            res.json({
                code: 400,
                message: `Vui lòng truyền lên dữ liệu`,
                data: null
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    };
}

// [POST] /user/manage-account/create/:clubId
module.exports.create = async (req, res) => {
    try {
        const accout = req.body;
        if (accout) {
            accout.clubId = (await clubModel.findOne({ _id: req.params.clubId })).id;
            if (!accout.clubId) {
                return res.json({
                    code: 400,
                    message: `Câu lạc bộ không tồn tại trong hệ thống`,
                    data: null
                });
            }

            accout.password = await bcryptHelper.hashPassword(accout.password);
            const newAccout = new accountModel(accout);
            await newAccout.save();

            if (newAccout) {
                res.json({
                    code: 200,
                    message: `Tạo tài khoản thành công`,
                    data: newAccout
                });
                return;
            } else {
                res.json({
                    code: 200,
                    message: `Tạo tài thất bại`,
                    data: null
                });
            }
        } else {
            res.json({
                code: 400,
                message: `Vui lòng truyền lên dữ liệu`,
                data: null
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    };
}

// [GET] /user/manage-account/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId) {
            const user = await accountModel.findOne({ _id: userId, deleted: false }).selected('-tokenUser -password');
            if (user) {
                res.json({
                    code: 200,
                    message: `Tải lên thông tin thành công`,
                    data: user
                });
            } else {
                res.json({
                    code: 200,
                    message: `Không tìm thấy thông tin trong hệ thống`,
                    data: null
                });
            }
        }
    } catch (error) {
        res.json({
            code: 400,
            message: `error: ${error}`,
            data: null
        });
    };
}
