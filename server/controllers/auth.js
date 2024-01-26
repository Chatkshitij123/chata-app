// const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
// const mailService = require("../services/mailer");
const nodemailer = require("nodemailer");
const resetPassword = require("../Mail/resetPassword");
const otp = require("../Mail/otp");

//modal import here
const User = require("../models/user");
const filterObj = require("../utils/filterObj");
const { promisify } = require("util");

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

//video 17 //Register New User
//THese functions is created  is used as middlewares
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password, verified } = req.body;
  //case- when the user has altered or changed the req.
  //so we will create a function here which takes req body and the list of all the bodies that we want to access and if the user
  //entry any value other than that it will be filtered out.if  a user makes a changes into the req body from the client side
  //and this send verified is true and we are not checking the values inside the req body and verified field is also updated due
  //to spread operator so prevent that we created filter object

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "password",
    "email"
  );

  //check if a verified user with  given email exists
  //Whenever user register on our site he has toprovide the above fields and we entered it in our database
  //we create new user and we have to verify this email belongs to this user so we send the otp

  const existing_user = await User.findOne({ email: email });
  //if  the existing user not exist this database query didnot return any user
  if (existing_user && existing_user.verified) {
    res.status(400).json({
      status: "error",
      message: "Email is already in use, Please login.",
    });
  } //there is a existing user but the email is not verified
  //validateModifiedOnly: it is going to say to the mongodb driver  to execute these validations rules only on those field that are getting updated
  //
  else if (existing_user) {
    await User.findOneAndUpdate({ email: email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });
    //
    req.userId = existing_user._id; //we use it in our next middleware
    next();
  } else {
    //if user record is not available in db
    //we create new user record
    const new_user = await User.create(filteredBody);
    //generate OTP and send email to the user
    req.userId = new_user._id;

    next();
  }
};
exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; //10 minutes after the otp is send
  //we have to define store this expiry time into the user data and in user Schema

  const user = await User.findByIdAndUpdate(userId, {
    // otp: new_otp,
    // otp_expiry_time,
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  console.log(new_otp);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kshitijchaturvedi265@gmail.com",
      pass: "qwpc pvwz ttah ayne",
    },
  });

  //TODO Send mail

  const mailOptions = {
    from: "ksitizchaturvedi@gmail.com",
    to: user.email, // Assuming user.email contains the recipient's email
    subject: "Verification OTP",
    html: otp(user.firstName, new_otp),
    // text: `Your OTP is: ${new_otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      // Handle the error appropriately
    } else {
      console.log("Email sent: " + info.response);
      // Handle success if needed
    }
  });

  res.status(200).json({
    status: "success",
    message: "OTP Sent Successfully!",
  });
};

exports.verifyOTP = async (req, res, next) => {
  //verify OTP and update the record accordingly
  const { email, otp } = req.body; //from the user

  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() }, //it is greater than the current time//when the user has submitted the otp
    //and when we are processing it in the backend at that time whatever the time is it has to be ahead of expiry time
    //expiry time is not yet reached
  });
  //if the expiry time has already reached we are not getting any user
  if (!user) {
    res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
    return;
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
    return;
  }

  //OTP is incorrect

  user.verified = true;
  user.otp = undefined;

  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
    token,
    user_id: user._id,
  });
};

exports.login = async (req, res, next) => {
  //
  const { email, password } = req.body;
  //check email and password provided by the user
  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Both  email and password are required",
    });
    return;
  }
  //if the user has provided us with its email and password we are going to find it in the database
  const userDoc = await User.findOne({ email: email }).select("+password");
  //we are seraching for the user and no user will be found
  if (!userDoc || !userDoc.password) {
    res.status(400).json({
      status: "error",
      message: "Incorrect password",
    });

    return;
  }
  if (
    !userDoc ||
    !(await userDoc.correctPassword(password, userDoc.password))
  ) {
    res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
    return;
  }
  //user exists in our database and password is correct
  const token = signToken(userDoc._id);

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token,
    userDoc_id: userDoc._id,
  });
};

//video 18
exports.protect = async (req, res, next) => {
  //signup =>  register - sendotp - verifyotp
  //https://api.snappy.com/auth/register
  //1. Getting token(JWT) and check if it's there

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    res.status(400).json({
      status: "error",
      message: "You are not logged In! Please log in to get access",
    });

    return;
  }

  //2. verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. check if user is still exists

  const this_user = await User.findById(decoded.userId);

  if (!this_user) {
    res.status(400).json({
      status: "error",
      message: "The user doesn't exist",
    });
  }

  //4. check if the user changed their password after token was issued

  if (this_user.changedPasswordAfter(decoded.iat)) {
    res.status(400).json({
      status: "error",
      message: "User recently updated password! Please log in again",
    });
  }

  //we are setting up the property user on request and provide next() it is used by next middleware
  req.user = this_user;
  next();
};

//types of routes:-> protected(only logged in users can access these) & unprotected

exports.forgotPassword = async (req, res, next) => {
  //get user email
  //when the user fill the email in the form then we are sending the api request that is going to contain the email in the body
  //user check in the database

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({
        status: "error",
        message: "There is no user with given email address",
      });
      return;
    }
    //this is basically maps to the user's document we are going to email to the user ; that user will get something link

    //like this that is going to pointing the application to our frontend application and there is something random string will be there  to submit their
    //new password along with confirm password then we are getting this code i.e. token back
    //we are going into the user's model and match the token that is given in our database with the token and it matched then we updated
    //generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //we are going to create a method in user schema which is basically going to enable us to create a new reset password token
    const resetURL = `${process.env.FRONTEND_URL}/new-password/?token=${resetToken}`;
    console.log(resetToken);
    console.log(resetURL);
    // Update the user's document with the reset token and expiry time
    // user.passwordResetToken = undefined;
    //     user.passwordResetExpires = undefined;
    // Save the user document
    await user.save({ validateBeforeSave: false });
    //TODO => send email  with reset url
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kshitijchaturvedi265@gmail.com",
        pass: "qwpc pvwz ttah ayne",
      },
    });
    const mailOptions = {
      from: "ksitizchaturvedi@gmail.com",
      to: user.email, // Assuming user.email contains the recipient's email
      subject: "Password Reset",
      html: resetPassword(user.firstName, resetURL),
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        // Handle the error appropriately
      } else {
        console.log("Email sent: " + info.response);
        // Handle success if needed
      }
    });

    res.status(200).json({
      status: "success",
      message: "Reset Password link is send to Email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "There was an error sending the email, Please try again later.",
    });
  }
  // req.user = this_user;
  next();
};

exports.resetPassword = async (req, res, next) => {
  //1. get the user based on token
  //when we are resend Url token and getting back that token in the req
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");
    console.log("Hashed Token:", hashedToken);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    console.log("User Object:", user);
    if (!user) {
      res.status(400).json({
        status: "error",
        message: "Token is invalid or expired",
      });
      // return;
    }

    //there can be a case when the user value will be null or not defined. It can be because the user manipulates it with client side. the hashed token not match
    //with that is present in our database. and 2 thing the use is out of 10 min timelapse
    //2. if token  has expired or submission is out of time window.
    //update users password and set resetToken & expiry to undefined
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //4. login in the user and send new  JWT

    //TOD-> send an email to user informing about password reset

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Password  reseted successfully",
      token,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
};
