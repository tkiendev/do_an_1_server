const authRegistration = require('./manage-club.route.js');
const manageAccoutRoute = require('./manage-accout.route.js');

module.exports = (app) => {
    app.use('/admin/manage-club', authRegistration);
    app.use('/admin/manage-accout', manageAccoutRoute);

    return app;
}