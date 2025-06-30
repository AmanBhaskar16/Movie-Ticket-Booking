// To check availability of selected seats 

import Booking from "../models/Booking.js";
import Show from "../models/Show.js"

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
    const {showId, selectedSeats} = req.body;
    const {origin} = req.headers;
    const isAvailable = await checkSeatsAvailability(showId,selectedSeats);

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
        amount : showData.showPrice * selectedSeats.lenght,
        bookedSeats : selectedSeats
      })

      // Reserving the  booked seats
      selectedSeats.map((seat)=>{
        showData.occupiedSeats[seat] = userId;
      })

      showData.markModified('occupiedSeats');
      // Saving to the database
      await showData.save();

      // Stripe Payment Gateway
      res.json({
        success: true,
        message : 'Booked Successfully'
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