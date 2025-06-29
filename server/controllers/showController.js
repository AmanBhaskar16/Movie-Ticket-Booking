import dotenv from "dotenv";
import Movie from "../models/Movie.js";
dotenv.config();
import axios from 'axios';
import Show from "../models/Show.js";

// Function to fetch data from tmdb database 
// export const getCurrentPlayingMovie = async (req, res) => {
//   const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
//   const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization: `Bearer ${process.env.TMDB_API_V4_TOKEN}`, 
//     },
//   };

//   fetch(url, options)
//     .then(response => response.json())
//     .then(json => {
//       console.log(json);       
//       res.status(200).json(json);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: "Failed to fetch now playing movies" });
//     });
// };

export const getCurrentPlayingMovie = async (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';

  try {
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_V4_TOKEN}`,
      },
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch now playing movies" });
  }
};


// API to add a new show to the database

export const addShow = async (req,res) =>{
  try {
    const {movieId,showsInput,showPrice} = req.body;
    let movie = await Movie.findById(movieId);
    if(!movie){
      // If not present in db then fetch it from tmdb API

      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{headers: {
        // accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_V4_TOKEN}`, 
        }}),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{headers: {
          // accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_V4_TOKEN}`, 
        }})
      ])

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      // Creating object of details of movie to store in db
      const movieDetails = {
        _id : movieId,
        title : movieApiData.title,
        overview : movieApiData.overview,
        poster_path : movieApiData.poster_path,
        backdrop_path : movieApiData.backdrop_path,
        genres : movieApiData.genres,
        casts : movieCreditsData.cast,
        release_date : movieApiData.release_date,
        original_language : movieApiData.original_language,
        tagline : movieApiData.tagline || "",
        vote_average : movieApiData.vote_average,
        runtime : movieApiData.runtime,
      }
      // Adding movie to the database
      movie = await Movie.create(movieDetails);

      const showsToCreate = [];
      showsInput.forEach(show => {
        const showDate = show.date;
        show.time.forEach((time)=>{
          const dateTimeString = `${showDate}T${time}`;
          showsToCreate.push({
            movie : movieId,
            showDateTime : new Date(dateTimeString),
            showPrice,
            occupiedSeats : {}
          })
        })
      });

      if(showsToCreate.length > 0){
        await Show.insertMany(showsToCreate);
      }

      res.json({
        success : true,
        message : 'Show added'
      })
    }
  } catch (error) {
    console.error(error);
      res.status(500).json({ error: "Failed to fetch now playing movies" });
  }
}
