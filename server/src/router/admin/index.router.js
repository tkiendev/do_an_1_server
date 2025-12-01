const authRegistration = require('./manage-club.route.js');
const manageAccoutRoute = require('./manage-accout.route.js');
const manageEventClub = require('./manage-event-club.route.js');

module.exports = (app) => {
    app.use('/admin/manage-club', authRegistration);
    app.use('/admin/manage-accout', manageAccoutRoute);
    app.use('/admin/manage-event-club', manageEventClub);

    return app;
}