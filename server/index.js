const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  credentials: true, 
  origin: ['https://mern-blog-frontend-yq8t.onrender.com', 'http://localhost:3000'] 
}));

app.use(upload());
app.use('/uploads', express.static(`${__dirname}/uploads`));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Fallback route to serve index.html for client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const mongoDB = process.env.MONGO_URI;

connect(mongoDB)
  .then(app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch((err) => console.log(err));
