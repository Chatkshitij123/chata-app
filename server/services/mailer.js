//all the notifications regarding the sending otp in it by using sendgrid api
//npm i @sendgrid/mail
//video 19//mailer & routing
const sgMail = require("@sendgrid/mail");

const dotenv = require("dotenv");

dotenv.config({path: "../config.env"});

sgMail.setApiKey(process.env.SG_KEY);//it is basically set the bearer token

const sendSGMail = async ({
recipient,
sender,
subject,
html,
text,
attachments
}) => {
    try {
       
        // const from = sender || "contact@codingmonk.in"
        const from = "kshitijchaturvedi265@gmail.com"

        const msg = {
            to: recipient, //email of recipient
            from: from,//this will be our verfied sender
            subject,
            html: html,
            text: text,
            attachments,
        };

        return sgMail.send(msg);//basically returns the promise
    } catch (error) {
       console.log(error) ;
    }
}

exports.sendEmail = async(args) => {
if (process.env.NODE_ENV === "development") {
    return new Promise.resolve();
    }else{
        return sendSGMail(args);
    }
}
