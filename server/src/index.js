const cors = require('cors')
const {checkUser} = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
let app = express();
app.use(cors())
const path = require('path');
app.use(express.json());
const db = require('./models');

let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true })
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.get('*', checkUser);
app.use(authRoutes);

db.sequelize.sync().then(()=> {
  app.listen(process.env.PORT || 5000);
})