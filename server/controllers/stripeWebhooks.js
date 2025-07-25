import stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (req,res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    return res.status(400).send(`Webhook Error : ${error.message}`)
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded' : 
        {
          const paymentIntent = event.data.object;
          const sessionList = await stripeInstance.checkout.sessions.list({
            payment_intent : paymentIntent.id
          })
          console.log(sessionList);

          const session = sessionList.data[0];
          const {bookingId} = session.metadata;
          console.log(bookingId);

          await Booking.findByIdAndUpdate(bookingId,{
            isPaid : true,
            paymentLink : ""
          })
          // Send confirmation mail
          await inngest.send({
            name : "app/show.booked",
            data : {
              bookingId
            }
          })
          break;
        }

      default:
        console.log("Unhandled event type : ",event.type);
    }
    res.json({
      received : true
    })
  } catch (error) {
    console.log("Webhook processing error : ",error);
    res.status(500).send("Internal Server Error");
  }
}