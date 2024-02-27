const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');
const doubtroomRoutes = require('./routes/doubtroomRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { requireAuth } = require('./middleware/authMiddleware');

const port = 4488 || process.env.PORT;
const dbURI = process.env.DB_URI;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MentorBridge API',
      version: '1.0.0',
    },
  },
  // Path to the API routes
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(port);
    console.log(`App is running on http://localhost:${port}`);
  })
  .catch((err) => console.log(err));

const apiRouter = express.Router();
apiRouter.use('/doubtroom', doubtroomRoutes);
apiRouter.use('/mentor', mentorRoutes);
apiRouter.use('/student', studentRoutes);

app.use('/api/auth', authRoutes);
app.use('/api', requireAuth, apiRouter);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
