const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// const { requireAuth, checkUser } = require('./middleware/authMiddleware');
// commented

const port = 4488 || process.env.PORT;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

app.use(authRoutes);
