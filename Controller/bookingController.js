const stripe = require("stripe");
const planModel = require("../Model/plansModel");
const userModel = require("../Model/usersModel");
const bookingModel = require("../Model/bookingModel");

const stripeObj = stripe(
  "sk_test_51I56IeA6p9e5BZD1XAbAnR51ehJPjMFOl0s06pUSfdCUoNWW9nMURKFOqyKamlIVNBgqAg3uZjTWvR3k6RoNlmz100x7EaYnPE"
);

async function createPaymentSession(req, res) {
  try {
    const userId = req.id;
    const { planId } = req.body;
    const plan = await planModel.findById(planId);
    const user = await userModel.findById(userId);
    // session object
    const session = await stripeObj.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://foodiessss.herokuapp.com/",
      cancel_url: "https://foodiessss.herokuapp.com/",
    });
    res.json({
      session,
    });
  } catch (error) {
    res.json({
      message: "Failed to create payment session",
      error,
    });
  }
}

async function checkoutComplete(req, res) {
  const END_POINT_KEY = process.env.END_POINT_KEY;
  // console.log("Checkout complete ran !!");
  // console.log("Request object");
  // console.log(req);
  const stripeSignature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeObj.webhooks.constructEvent(req.body, stripeSignature, END_POINT_KEY);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("event object !!!");
  console.log(event);
  // if(event.type == "checkout.session.completed"){
    
  // }
  // else{

  // }
}

async function createNewBooking(req, res) {
  // booking collection =>
  // if(user.bookedPlanId){
  // get booking id => go to booking document , push in bookedPlans
  // }
  // else
  // new booking document
  // id => user.bookedPlanId
  // booking document.bookedPlans.push(obj);
}

module.exports.createPaymentSession = createPaymentSession;
module.exports.checkoutComplete = checkoutComplete;
