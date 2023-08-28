
import express from "express";
import { router } from './routes/routes.js';
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});



const app = express();

app.set('port', process.env.PORT);

app.use(express.json());
app.use('/', router);



app.listen(app.get('port'), ()=>{
    console.log(`Servidor corriendo en puerto: ${app.get('port')}`)
});