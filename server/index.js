const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');

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

const path = require('path');

// This tells Express: "If someone asks for /.well-known, give them the files in that folder"
app.use('/.well-known', express.static(path.join(__dirname, '.well-known'), { dotfiles: 'allow' }));
// ✅ CORRECT ORDER
async function bootstrapAGP() {
    const { agpGateway } = await import('agp-system');
    
    // The Gateway must be registered BEFORE any 404 handlers
    app.use('/api/gateway', agpGateway({
        secret: process.env.AGP_SECRET
    }));
    
    console.log("🛡️ AGP Gateway Active");
}

bootstrapAGP();

// Your 404 handler MUST be the very last thing in the file
app.use((req, res) => {
    res.status(404).json({ message: "Not Found: " + req.url });
});

app.use(upload());
app.use('/uploads', express.static(`${__dirname}/uploads`));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const mongoDB = process.env.MONGO_URI;

connect(mongoDB)
  .then(app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch((err) => console.log(err));
