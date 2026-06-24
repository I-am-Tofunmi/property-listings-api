require('dotenv').config();
const app = require('./server');
const config = require('./config');

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});