const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],  
    },
    avatar: {
        type: String,
    },
    email:{
        type: String,
        required: [true, "Email is required"], 
        // validate: {
        //     validator: function (email){
        //         return String(email).toLowerCase().match([/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        //          ]
        //          );
        //     },
        validate: {
            validator: function (email) {
                // Use the test method directly on the regular expression
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: (props) => `Email (${props.value}) is invalid`,
        },
    },
    password:{
        type: String,
    },
    passwordConfirm: {
        type: String,
    },
    passwordChangeAt: {
        type: Date,
    },

    passwordResetToken: {
        type: String,
    },

    passwordResetExpires: {
        type: Date,
    },

    createAt: {
        type: Date,
    },
    updatedAt:{
        type: Date,
    },
    verified:{
        type: Boolean,
        default: false, //whenever we created a new records this field is marked as false
    },//video 17
    otp: {
        type: String,
    },
    otp_expiry_time: {
        type: Date,
    },
    socket_id: {//video 25
        type: String,
    },
    friends: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],
    status: {
        type: String,
        enum: ["Online", "Offline"]//video28
    }
});
//video 17
userSchema.pre("save", async function(next) {
    //Only run this function if  OTP is actually modified

    if(!this.isModified("password") || !this.password) 
    return next();

    //Hash the otp with the cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.pre("save", async function(next) {//video 18
    //Only run this function if  OTP is actually modified

    if(!this.isModified("otp") || !this.otp) return next();

    //Hash the otp with the cost of 12
    this.otp = await bcrypt.hash(this.otp.toString(), 12);

    console.log(this.otp.toString(), "FROM PRE SAVE HOOK");
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew || !this.password)
      return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

//we create the method to check the otp is correct or not


userSchema.methods.correctPassword = async function (
    canditatePassword,//which are supplied by user to us
    userPassword//that we stored in our database//stored as a random string we are using decrypt library

) {
    return await bcrypt.compare(canditatePassword, userPassword);
}
//methods are basically functions which can access property from this schema
//video 17
userSchema.methods.correctOTP = async function (
    canditateOTP,//which are supplied by user to us
    userOTP//that we stored in our database//stored as a random string we are using decrypt library

) {
    return await bcrypt.compare(canditateOTP, userOTP);
};
//video 18
//we are not making it arrow function we want to make use of this keyword. arrow function doesnot have it.
userSchema.methods.createPasswordResetToken = function () {

    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest('hex');

    this.passwordResetExpires = Date.now() + 10*60*1000;

    return resetToken;
}

userSchema.methods.changedPasswordAfter = function (timestamp) {
    return  timestamp < this.passwordChangeAt;
}
//created modal

const User = new mongoose.model("User", userSchema);
module.exports = User;