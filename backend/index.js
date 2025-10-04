const express = require('express');
const cors = require('cors');
require('dotenv').config();

const moviesRoutes = require('./routes/movies');
const consumersRoutes = require('./routes/consumers');
const adminRoutes = require('./routes/admin');
const adminMoviesRoutes = require('./routes/admin/movies');
const adminActorsRoutes = require('./routes/admin/actors');



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/movies', moviesRoutes);
app.use('/api/consumers', consumersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/movies', adminMoviesRoutes);
app.use('/api/admin/actors', adminActorsRoutes);


app.get('/', (req, res) => {
  res.send('Cinesphere Backend Running');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
