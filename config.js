const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    API_KEY : process.env.API_KEY,
    START_DATE : process.env.START_DATE,
    END_DATE : process.env.END_DATE
}