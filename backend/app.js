const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect("mongodb://atanu:atanu109@ds239703.mlab.com:39703/angular", { useNewUrlParser: true })
        .then(() => {
          console.log('Connected to mongodb database');
        })
        .catch((error) => {
          console.log('Failed to connect to mongodb :- '+error);
        });

const postRoutes = require('./routes/posts');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(postRoutes);

module.exports = app;
