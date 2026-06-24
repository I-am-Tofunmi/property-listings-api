const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const enquiryRoutes = require('./routes/enquiries');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/enquiries', enquiryRoutes);
app.use('/users', userRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;