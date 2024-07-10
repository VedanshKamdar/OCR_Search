const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./configuration/db');
const fileRoutes = require('./routes/file.routes');
const authRoutes = require('./routes/auth.routes');

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cors());

connectDB();

app.use(express.json({ extended: false }));

app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/files', fileRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
