const cloudinary = require('cloudinary').v2;

module.exports = async (req, res, next) => {
    if (req.files.length > 0) {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME || 'my_cloud',
            api_key: process.env.CLOUDINARY_API_KEY || 'my_key',
            api_secret: process.env.CLOUDINARY_API_SECRET || 'my_secret',
        });

        const postLinks = []
        for (let file of req.files) {
            console.log(file)
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }).end(file.buffer);
            });
            if (!uploadResult) {
                return res.status(500).json({
                    code: 500,
                    message: 'upload file failed',
                    data: null
                });
            }
            postLinks.push(uploadResult.secure_url);
        }

        req.urlFile = postLinks;
        next();
    } else {
        next();
    }

}
