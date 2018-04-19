const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const app = express();

const PORT = process.env.PORT || 3000;

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  //create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
          user: 'krnassazn@gmail.com',
          clientId: '44269745761-1k1k5hlbtfokhel7hf8r209pir4t782k.apps.googleusercontent.com',
          clientSecret: 'e-Wc892pYuCiDpoNp2OCgF4b',
          refreshToken: '1/KUReeaZdA0avOHtKUyRpBmLxc6UGA9EoBGd6yAA6h6U'
        }),
        user: 'krnassazn@gmail.com', // generated ethereal user
        pass: 'SGDX8NPO6'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });     




  // setup email data with unicode symbols
  let mailOptions = {
      from: 'New Mail <krnassazn@gmail.com>', // sender address
      to: 'sanglee.dev@gmail.com', // list of receivers
      subject: 'www.sangyeoplee.com', // Subject line
      text: 'New Messange!', // plain text body
      html: output // html body
  };

  //   // send mail with defined transport object
  //   transporter.sendMail(mailOptions, function(error, info){
  //     if(error){
  //         return console.log(error);
  //     }
  //     console.log('Message sent: ' + info.response);
  // });



  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('contact', {msg:'Email has been sent!'});
  });
  });

  app.listen(PORT, function() {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });