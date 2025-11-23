const authRegistration = require('./manage-club.route.js');

module.exports = (app) => {
    app.use('/admin/manage-club', authRegistration);

    return app;
}