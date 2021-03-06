const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars');
const csrf = require('csurf');
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
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

app.get('/', csrfProtection, (req, res) => {
  res.render('contact', { csrfToken: req.csrfToken() });
});

app.post('/send', parseForm, csrfProtection, (req, res) => {
  const output = 
  `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `
  ;

  //create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
        xoauth2: xoauth2.createXOAuenerator({
          user: '',
          clientId: '',
          clientSecret: '',
          refreshToken: ''
        }),
        user: '', // generated ethereal user
        pass: ''  // generated ethereal password
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

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // HERE YOU REDIRECT to /#page6
      res.render('contact', {msg:'Email has been sent!'});
  });
});

  app.listen(PORT, function() {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
  });
