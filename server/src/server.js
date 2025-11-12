const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

const adminRouter = require('./router/admin/index.router.js');
const userRouter = require('./router/user/index.router.js');

app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongodbConnection = require('./config/connectionDb.js');
mongodbConnection();

adminRouter(app);
userRouter(app);

app.listen(port, () => {
    console.log(`===================== http://localhost:${port} =====================`);
});