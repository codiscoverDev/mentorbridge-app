const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const authRoutes = require('./src/routes/authRoutes');
const doubtroomRoutes = require('./src/routes/doubtroomRoutes');
const mentorRoutes = require('./src/routes/mentorRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { requireAuth } = require('./src/middleware/authMiddleware');
const Student = require('./src/models/Student');
const Mentor = require('./src/models/Mentor');
const { clearCache } = require('./src/utils/redis');

const port = 4488 || process.env.PORT;
const dbURI = process.env.DB_URI;

const app = express();

app.use(express.urlencoded({ extended: true }));
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
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
async function ensureIndexes() {
  await Student.ensureIndexes();
  await Mentor.ensureIndexes();
}
mongoose
  .connect(dbURI)
  .then(() => ensureIndexes())
  .then((result) => {
    app.listen(port);
    console.log(`Server is running on ${port}`);
  })
  .catch((err) => console.log(err));

const apiRouter = express.Router();
apiRouter.use('/doubtroom', doubtroomRoutes);
apiRouter.use('/mentor', mentorRoutes);
apiRouter.use('/student', studentRoutes);
apiRouter.use('/search', searchRoutes);

app.use('/api/auth', authRoutes);
app.use('/api', requireAuth, apiRouter);

app.get('/api/clear-cache', requireAuth, clearCache);

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
  <head>
    <title>MentorBridge</title>
  </head>
  <body>
      <h1>MentorBridge</h1>
      <p>Connecting students with mentors.</p>
      <p>Welcome to MentorBridge, where students find guidance and mentors make a difference!</p>
      <br><br><br><button><a href="/api-docs">Visit API DOCS</a></button>
  </body>
  </html>`);
});
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Pong' });
});
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
