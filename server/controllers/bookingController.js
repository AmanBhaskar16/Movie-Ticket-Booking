import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from 'stripe'
import dotenv from 'dotenv';
import { inngest } from "../inngest/index.js";
dotenv.config();
// To check availability of selected seats 

const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if(!showData){
      return false;
    }
    const occupiedSeats = showData.occupiedSeats;

    const isSeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
    
    return !isSeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

// To create a booking

export const createBooking = async (req, res) =>{
  try {

    const {userId} = req.auth();
    const {showId, selectedSeat} = req.body;
    const {origin} = req.headers;
    const isAvailable = await checkSeatsAvailability(showId,selectedSeat);

    // If seat is not available
    if(!isAvailable){
      return res.json({
        success : false,
        message : "Selected Seats are not available."
      })
      }
      
      // Get the show details
      const showData = await Show.findById(showId).populate('movie');

      // Create a new Booking
      const booking = await Booking.create({
        user : userId,
        show : showId,
        amount : showData.showPrice * selectedSeat.length,
        bookedSeats : selectedSeat
      })

      // Reserving the  booked seats
      selectedSeat.map((seat)=>{
        showData.occupiedSeats[seat] = userId;
      })

      showData.markModified('occupiedSeats');
      // Saving to the database
      await showData.save();

      // Stripe Payment Gateway

      // initialization
      const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

      // Creating line items to the stripe
      const line_items =  [{
        price_data : {
          currency: 'usd',
          product_data:{
            name : showData.movie.title
          },
          unit_amount : Math.floor(booking.amount)*100
        },
        quantity: 1
      }]

      // Creating payment sessions
      const session = await stripeInstance.checkout.sessions.create({
        success_url : `${origin}/loading/my-bookings`,
        cancel_url: `${origin}/my-bookings`,
        line_items : line_items,
        mode : 'payment',
        metadata: {
          bookingId : booking._id.toString()
        },
        // Expires in 30 mins
        expires_at: Math.floor(Date.now()/1000) + 30*60,
      })

      booking.paymentLink = session.url;
      await booking.save();

      // Running inngest scheduling function to check payment status after 10 mins

      await inngest.send({
        name : "app/checkpayment",
        data : {
          bookingId : booking._id.toString(),
        }
      })

      res.json({
        success: true,
        url : session.url
      })
    
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message : error.message
    })
  }
}

export const getOccupiedSeats = async (req,res)=>{
  try {
    const {showId} = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({
      success : true,
      occupiedSeats 
    })
    
  } catch (error) {
    console.log(error.message);
    res.json({
      success : false,
      message : error.message
    });
  }
}