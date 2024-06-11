const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./configuration/db');
const authRoutes = require('./routes/auth.routes');

dotenv.config();

const app = express();

app.use(bodyParser.json());

connectDB();

app.use('/v1/api/auth', authRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
