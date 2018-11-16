const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const mongoose = require('mongoose');


const addUserRoutes = require('./routes/UserRoute')
const addTenantsRoutes = require('./routes/TenantsRoute')

const app = express()
app.use(bodyParser.json())
app.use(cors())

addUserRoutes(app)
addTenantsRoutes(app)

const URL = 'mongodb://oxs_db:saga234f@ds213053.mlab.com:13053/oxs_db'
mongoose.connect(`${URL}`,
    {
        useNewUrlParser: true
    });

    




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))