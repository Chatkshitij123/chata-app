const express = require("express"); // web framework for Node.js

const routes = require("./routes/index");

const morgan = require("morgan"); //HTTP request logger middleware for node.js

const rateLimit = require("express-rate-limit");

const helmet = require("helmet"); //

const mongosanitize = require("express-mongo-sanitize");

const bodyParser = require("body-parser");

const xss = require("xss"); //cross-side-scripting //we can again send some scripts,malicious code in the req that is send to our
//server and to filter them out we use this package//sanitize the untrusted html

const cors = require("cors");
//it is going to allow crossorigin req//means if our frontend is hosted on talk.com and api on api.talk.com both are different
//to talk between both we use cors
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(mongosanitize());

//

//middleware
app.use(
  cors({
    origin: "*", //from where the req is going to be originated//every domain-*
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true, //there is a header name- accesscontrolallowcredentials that is set to false by default and we are change
    //it to true to tell the browsers to expose the response to our frontend javascript code
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json()); //it is just passing the json-data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
//this is going to set various headers in our response
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//dev is just basically an option that we are going to pass
//we are in the development mode and we need as much as info for each and every request

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000, //in one hour
  message: "Too many requests from this IP, please try again in an hour",
});
//max denotes how many req we received

app.use("/snappy", limiter);
//it is only going to pass urlencoded bodies
//video 19
app.use(routes);

module.exports = app;

//https://localhost:3000/v1/auth/login =>
