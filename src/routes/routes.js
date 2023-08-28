import express from "express";
import { enviarMail, validarMail } from "../middlewares/authMail.js";


export const router = express.Router();


router.post('/enviarmail', enviarMail, (req, res)=>{
    console.log('mail enviado con exito!');
    res.status(200).send({mensaje:'te envie un mail'})
});

router.get('/validarmail/:token', validarMail, (req, res)=>{
    if(req.acceso){
        res.status(200).send({mensaje: 'todo saldra bien!'});
    }else{
        res.status(400).send({mensaje: 'token expiro o es invalido!'});
    }
});