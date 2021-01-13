const express = require("express");
const planRouter = require("./Router/planRouter");
const userRouter = require("./Router/userRouter");
const viewRouter = require("./Router/viewRouter");
const bookingRouter = require("./Router/bookingRouter");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser"); 
const bodyParser = require("body-parser");
// it tracks incoming request and see if there is data in the request => the data will be fed in req.body
app.use( express.json());
app.use(cookieParser());


const stripe = require("stripe");
const stripeObj = stripe(
  "sk_test_51I56IeA6p9e5BZD1XAbAnR51ehJPjMFOl0s06pUSfdCUoNWW9nMURKFOqyKamlIVNBgqAg3uZjTWvR3k6RoNlmz100x7EaYnPE"
);



app.use(express.static(__dirname+"/public"));
// app.httpMethod( appRoute , cb function( request , response))

// view engine set
app.set("view engine" , "pug");

// view path set
app.set("views" , path.join(__dirname,"View"));



app.post("/api/booking/checkoutComplete" , bodyParser.raw({type: 'application/json'})   , function(req, res) {
  const END_POINT_KEY = process.env.END_POINT_KEY;
  // console.log("Checkout complete ran !!");
  // console.log("Request object");
  // console.log(req);
  const stripeSignature = req.headers["stripe-signature"];

  console.log("endpoint key = " , END_POINT_KEY);
  console.log("stripeSign = " , stripeSignature);
  console.log("Req.bdoy =>" , req.body);
  let event = stripeObj.webhooks.constructEvent(req.body, stripeSignature, END_POINT_KEY);
  // let event;
  // try 
  console.log("Event = " , event);
  // } catch (err) {
    // res.status(400).send(`Webhook Error: ${err.message}`);
  // }
  console.log("event object !!!");
  console.log(event);
  if(event.type == "checkout.session.completed"){
    console.log(event.data.object);
  }
  else{
    console.log("event not created !!");
  }
})


app.use("/api/booking" , bookingRouter);
app.use("/api/plans" , planRouter);
app.use("/api/user" , userRouter);
app.use("" , viewRouter);

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("server started at port 3000");
});
