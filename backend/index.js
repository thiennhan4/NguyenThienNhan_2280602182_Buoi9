const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const messageRoute = require('./routes/messageRoute');
const authRoute = require('./routes/authRoute');

const app = express();

// Middleware
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/message', messageRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

})
.catch(err => {
  console.error('MongoDB connection error:', err);
});