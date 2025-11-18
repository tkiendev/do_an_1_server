
// [GET] /user/manage-post/list
module.exports.index = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `error: ${error}`,
            data: null
        });
    }
}