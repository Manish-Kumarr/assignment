const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoute = require('./router/auth');
dotenv.config();

const PORT = process.env.PORT || 3000;

//Connect DB
require('./DB/conn');

//Middleware
app.use(express.json());
app.use('/api', authRoute);

app.get('/', (req, res) => {
  res.send(
    'For checking endpoints use postman. Endpoints are: 1.https://restapiii.herokuapp.com/api/home  2.https://restapiii.herokuapp.com/api/signup  3.https://restapiii.herokuapp.com/api/login'
  );
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
