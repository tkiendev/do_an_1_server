const manageClubroute = require('./manage-club.route.js');
const manageAccoutRoute = require('./manage-accout.route.js');
const manageEventClubRoute = require('./manage-event-club.route.js');
const authAdminRoute = require('./auth.rote.js');

module.exports = (app) => {
    app.use('/admin/manage-club', manageClubroute);
    app.use('/admin/manage-accout', manageAccoutRoute);
    app.use('/admin/manage-event-club', manageEventClubRoute);
    app.use('/admin/auth', authAdminRoute);

    return app;
}