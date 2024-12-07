const nodemailer = require("nodemailer");
const passport = require('passport')

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: `Sameerrajyt@gmail.com`, // gmail
    pass: process.env.EMAIL_PASSWORD, // pass
  },
});


exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};


exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
    console.log(token, "working");
  }
  return token;
};

exports.sanitizeUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    Batch_No: user.Batch_No,
  };
};

exports.sendMail = async function ({  subject, html }) {

  console.log('Send Mail Function Called');
  
  let info = await transporter.sendMail({
    from: '"Bhokal Trader" <Sameerrajyt@gmail.com>', // sender address
    to :`sameerrajyt@gmail.com`,
    subject,
    text:'Conformation Mail',
    html:html
  });
  return info;
};

exports.ConfirmTemplate = function (data) {
  return (`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm to Delete</title>
  <style>
    /* General Styles */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      background-color: #007bff;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 20px;
      font-weight: bold;
    }

    .content {
      padding: 20px;
      text-align: center;
      font-size: 16px;
      line-height: 1.5;
    }

    .content p {
      margin: 0 0 20px;
    }

    .btn {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #ff4d4d;
      border: none;
      border-radius: 5px;
      text-decoration: none;
      cursor: pointer;
      margin-top: 20px;
    }

    .btn:hover {
      background-color: #e63939;
    }

    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777;
    }

    /* Mobile Responsive */
    @media (max-width: 600px) {
      .header {
        font-size: 18px;
        padding: 15px;
      }

      .content {
        font-size: 14px;
        padding: 15px;
      }

      .btn {
        padding: 10px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      Mail from Bhokal Trader
    </div>

    <!-- Main Content -->
    <div class="content">
      <p><strong>Confirm To Delete ${data.Name}:</strong></p>
      <p>Confirm to delete the ${data.value1} with  Id: <strong>#${data._id}</strong>.</p>
      <a href="${process.env.SERVER_PORT}/confirm-delete?key1=${data.value1}&key2=${data._id}" class="btn">Confirm</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2024 Bhokal Trader. All rights reserved.
    </div>
  </div>
</body>
</html>
`);
};



exports.ConformationMessage = function (courseId){
  console.log(courseId);
  
  return (
   ` <html>
      <head>
        <title>Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            text-decoration: none;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>Confirmation Message</h1>
        <p> Deleted with ID: <strong>${courseId.courseId}</strong>?</p>
       
      </body>
    </html>`
  )
}


exports.rejectionMessage = function (){
  return (
    `<html>
    <body>
      <h2>Rejection Notice</h2>
      <p>Dear,</p>
      <p>We regret to inform you that your application has been rejected.</p>
      <p>Reason: <strong>Inadequate qualifications</strong></p>
      <p>Thank you for your time and effort in applying.</p>
      <p>Best Regards,</p>
      <p>The Team</p>
    </body>
  </html>`
  )
}

exports.sendOTPtemplate = function(otp){
  return (
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Email</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #e3e3e3;
    }
    .email-header {
      background: #4caf50;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      text-align: center;
      color: #333333;
    }
    .email-body p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.5;
    }
    .otp-code {
      display: inline-block;
      background: #e8f5e9;
      padding: 15px 30px;
      border-radius: 5px;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #4caf50;
      margin: 20px 0;
    }
    .email-footer {
      background: #f9f9f9;
      padding: 10px 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
    .email-footer a {
      color: #4caf50;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Your OTP Code</h1>
    </div>
    <div class="email-body">
      <p>Hi there,</p>
      <p>Thank you for verifying your account. Use the OTP code below to complete your process:</p>
      <div class="otp-code">${otp}</div>
      <p>This code is valid for the next 10 minutes. Please do not share this code with anyone.</p>
    </div>
    <div class="email-footer">
      <p>If you did not request this OTP, please <a href="#">contact support</a>.</p>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
  )

}


exports.CreateAdminConformationtemplate = function(data){
  return (`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Account Confirmation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #e3e3e3;
    }
    .email-header {
      background: #2196f3;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
    }
    .email-body p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.5;
    }
    .admin-details {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .admin-details p {
      margin: 8px 0;
      font-size: 15px;
    }
    .confirm-button {
      display: inline-block;
      background: #4caf50;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      transition: background 0.3s ease;
    }
    .confirm-button:hover {
      background: #388e3c;
    }
    .email-footer {
      background: #f1f1f1;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Bhokal Trader - Admin Account</h1>
    </div>
    <div class="email-body">
      <p>Hi there,</p>
      <p>Your admin account for <strong>Bhokal Trader</strong> has been successfully created. Please confirm the details below:</p>
      <div class="admin-details">
        <p><strong>Name:</strong> ${data.Name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Password:</strong>${data.password}</p>
      </div>
      <p>If all the information is correct, click the button below to confirm your account:</p>
      <a href="http://localhost:8000/confirm-admin?key1=Name&value1=${data.Name}&key2=email&value2=${data.email}&key3=password&value3=${data.password}" class="confirm-button">Confirm Account</a>
    </div>
    <div class="email-footer">
      <p>If you did not request this, please <a href="#" style="color: #2196f3; text-decoration: none;">contact support</a>.</p>
      <p>&copy; 2024 Bhokal Trader. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`)
}

exports.AdminCreatedSuccesfully = function (data){
  return (`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Account Created</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #e3e3e3;
    }
    .email-header {
      background: #4caf50;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
      text-align: center;
    }
    .email-body p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.5;
    }
    .admin-details {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
    .admin-details p {
      margin: 8px 0;
      font-size: 15px;
    }
    .success-message {
      font-size: 18px;
      font-weight: bold;
      color: #4caf50;
      margin-bottom: 20px;
    }
    .email-footer {
      background: #f1f1f1;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
    .email-footer a {
      color: #4caf50;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Admin Account Created</h1>
    </div>
    <div class="email-body">
      <p class="success-message">Congratulations! Your admin account has been created successfully.</p>
      <p>Here are your account details:</p>
      <div class="admin-details">
       <p><strong>Name:</strong> ${data.Name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Password:</strong> ${data.password}</p>
      </div>
      <p>Please keep this information secure and do not share it with anyone.</p>
    </div>
    <div class="email-footer">
      <p>If you have any questions or issues, please <a href="#">contact support</a>.</p>
      <p>&copy; 2024 Bhokal Trader. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`)
}


exports.AdminCreationrejection = function (data){
  return (`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Account Creation Failed</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #e3e3e3;
    }
    .email-header {
      background: #f44336;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
      text-align: center;
    }
    .email-body p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.5;
    }
    .admin-details {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
    .admin-details p {
      margin: 8px 0;
      font-size: 15px;
    }
    .error-message {
      font-size: 18px;
      font-weight: bold;
      color: #f44336;
      margin-bottom: 20px;
    }
    .email-footer {
      background: #f1f1f1;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
    .email-footer a {
      color: #f44336;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Admin Account Creation Failed</h1>
    </div>
    <div class="email-body">
      <p class="error-message">We regret to inform you that your admin account creation attempt was unsuccessful.</p>
      <p>Here are the details you provided:</p>
      <div class="admin-details">
        <p><strong>Email:</strong> ${data.email}</p>
      </div>
      <p>Please ensure that the information provided meets the required criteria or contact support for assistance.</p>
    </div>
    <div class="email-footer">
      <p>If you have any questions, please <a href="#">contact support</a>.</p>
      <p>&copy; 2024 Bhokal Trader. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`)
}