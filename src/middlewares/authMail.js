import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';





//Mensaje enviado por mail.
function message(link, token){
return `
    <h1>Te damos la bienvenida a la web Analisis Clinicos Don Bosco!</h1>
    <br></br>
    <h2>Gracias por registrarte en nuestra web!</h2>
    <br></br>
    <p>Solo falta un paso mas para que seas parte de nuestra comunidad.
       El siguente link te rediccionara nuevamente a nuestra web para que puedas ingresar tu contraseña:</p>
    <br>
    <p>Haz click en el siguiente link para generar tu contraseña de acceso</p>
    <a href=${link}${token}>Suige este link para ingresar tu contraseña!</a>
    <br>
    <br>
    <p>Gracias por confiar en Nosotros!</p>   
`};


//*********************************** Middleware enviarMail *******************************//


//middleware
export const enviarMail = async(req, res, next)=>{

  const {mail, nombre} = req.body;

//Creo un objetos de nodemailer con la configuraccion recomendada.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",  //servidor usado para enviar mails
    port: 465,             //puerto adecuado para que sea seguro
    secure: true,
    auth: {
      //usuario y contraseña de la cuenta de mail utilisada por el emisor
      user: process.env.NODEMAILER_USER,      //direccion de mail del emisor
      pass: process.env.NODEMAILER_PASS       //contraseña de aplicaciones generada por el servidor de mails
    }
  });

  //*************************  genero token *****************************/
  const token = jwt.sign({mail: mail, nombre: nombre}, process.env.SECRET, {expiresIn: "1h"});

  let link = "http://localhost:3000/validarmail/";

  //envio un mail con el objeto de nodemailer creado
  try {
    const info = await transporter.sendMail({
      from: '"Analisis Clinicos Don Bosco 👻" <ssebass.ross@gmail.com>', // sender address
      to: "ssebass_ross@hotmail.com", // list of receivers
      subject: " Registro Don Bosco ✔", // Subject line
      text: "Usted se a registrado con exito en nuestra web 'Analisis Clinicos Don Bosco'", // plain text body
      html: message(link, token), //le paso el mensaje a enviar que cree mas arriba.
    });
    console.log("Mail enviado: ", JSON.stringify(info)); //muestro el resultado (opcional)

    
  } catch (error) {      //capturo cualquier error y se lo paso al objeto body para tratarlo posteriormente
    console.log(`Error al enviar mail: `, error);
    req.error = error
  }
  next();
}


/**************************** verificar link devuelto x el mail ******************************/


export const validarMail = async(req, res, next)=>{
    const token_link = req.params.token;
    console.log("/*****//***///*******/// "+token_link);
    const decode_token = jwt.decode(token_link, process.env.SECRET);
    console.log("/*****//***///*******/// "+decode_token.mail);
    if(decode_token.mail != 'superman@gmail.com'){
      req.acceso = false;
    }else{
      req.acceso = true;
    }
    next();
}