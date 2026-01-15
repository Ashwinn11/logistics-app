import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nandhukvp96@gmail.com',
    pass: 'N@ndhuPriy@1'
  }
});

transporter.sendMail({
  from: 'nandhukvp96@gmail.com',
  to: 'madhankumarsv000@gmail.com',
  subject: 'Local test',
  text: 'This email is sent from local machine'
})
.then(() => console.log('Mail sent'))
.catch(err => console.error(err));
