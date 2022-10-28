const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const connectDB = require('./src/migrations/index.js');

//log requests in console
app.use(morgan('tiny'));

//db connect
connectDB();

//body-parser dem dem
app.use(bodyparser.urlencoded({extended:true}));

const port = process.env.ACCESS_PORT || 5900;

const mainRoute = require('./src/routes/main.route')
const { reverse } = require('dns')
app.use('/', mainRoute)


// app.get('/', function (req,res){
//     res.send("Attendance App");
// })

app.listen(port, function(){
    console.log("Server running on port 5900");
});
