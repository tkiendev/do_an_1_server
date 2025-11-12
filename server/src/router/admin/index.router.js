module.exports = (app) => {
    app.get('/admin', (req, res) => {
        res.send('admin');
    });

    return app;
}