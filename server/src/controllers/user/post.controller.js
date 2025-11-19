const postModel = require('../../models/post.model.js');
const eventModel = require('../../models/event.model.js');

// [GET] /user/manage-post/list/:clubId
module.exports.index = async (req, res) => {
    try {
        const clubId = req.params.clubId;
        if (clubId) {
            const posts = [];
            const events = await eventModel.find({ clubPresident: clubId, status: 'confirm' });
            for (const event of events) {
                const post = await postModel.find({ eventId: event._id });
                post.eventName = event.name;
                posts.push(...post);
            }
            return res.status(200).json({
                code: 200,
                message: 'Lấy danh sách bài viết thành công',
                data: posts
            });
        }
        else {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu clubId',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [POST] /user/manage-post/create/:eventId
module.exports.createPost = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (eventId) {
            const post = req.body;
            post.img = req.urlFile;
            post.eventId = eventId;
            post.foundation = JSON.parse(post.foundation);

            const newPost = new postModel(post);
            await newPost.save();

            if (newPost) {
                return res.status(201).json({
                    code: 201,
                    message: 'Tạo bài viết thành công',
                    data: newPost
                });
            }
            else {
                return res.status(400).json({
                    code: 400,
                    message: 'Tạo bài viết thất bại',
                    data: null
                });
            }
        } else {
            return res.status(400).json({
                code: 400,
                message: 'Thiếu eventId',
                data: null
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [PUT] /user/manage-post/update/:postId
module.exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (postId) {
            const newPost = req.body;
            if (req.urlFile.length > 0) {
                newPost.img = req.urlFile;
            }
            const result = await postModel.updateOne(postId, { ...newPost, status: 'update-again' });
            if (result.matchedCount > 0 && result.modifiedCount > 0) {
                return res.status(201).json({
                    code: 201,
                    message: 'Cập nhật bài viết thành công',
                    data: null
                });
            } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
                return res.status(200).json({
                    code: 200,
                    message: 'Cập nhật bài viết thất bại',
                    data: null
                });
            } else {
                return res.status(404).json({
                    code: 404,
                    message: 'Không tìn thấy bài viết cần cập nhật vui lòng kiểm tra lại!',
                    data: null
                });
            }

        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}

// [GET] /user/manage-post/detail/:postId
module.exports.detailPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (postId) {
            const post = await postModel.findById(postId);
            if (post) {
                return res.status(200).json({
                    code: 200,
                    message: 'Tải lên dữ liệu thành công',
                    data: post
                });
            } else {
                return res.status(204).json({
                    code: 204,
                    message: 'Vui lòng truyển lên postId',
                    data: null
                });
            }
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Vui lòng truyển lên postId',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}