import express, { json } from 'express';
import dotenv from 'dotenv';
import { adminRoute } from './Routes/adminroutes.js';

dotenv.config();

const app = express();
app.use(json())

app.use('/', adminRoute);

app.get('/', function (req, res) {

    res.send("hello everyone")
});
app.listen(process.env.PORT, function () {
    console.log(`server is listening at ${process.env.PORT}`);
    //which api method is use here,specify the name of the api here we use call back function(one function inside other functionuse is called call back)

});         //here we use anonymous function     // listen used for listening the data
// one funtion use another function inside this is called call back function
