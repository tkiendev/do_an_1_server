const mongoose = require('mongoose');

module.exports = () => {

    main().catch(err => console.log(err));

    async function main() {
        await mongoose.connect(process.env.MONGO_URL);
    }
}

