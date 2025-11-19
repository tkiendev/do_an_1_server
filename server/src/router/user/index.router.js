const dashbordRouter = require('./dashbord.route.js');
const manageAccoutRoute = require('./manage-accout.route.js');
const authorRoute = require('./author.route.js');
const manageEventRoute = require('./manage-event.route.js');
const taskRoute = require('./manage-task.route.js');
const postRoute = require('./post.route.js');

module.exports = (app) => {
    app.use('/user/dashbord', dashbordRouter);
    app.use('/user/manage-account', manageAccoutRoute);
    app.use('/user/manage-event', manageEventRoute);
    app.use('/user/author', authorRoute);
    app.use('/user/manage-task', taskRoute);
    app.use('/user/manage-post', postRoute);

    return app;
}