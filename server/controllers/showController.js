import dotenv from "dotenv";
dotenv.config();

export const getCurrentPlayingMovie = async (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_V4_TOKEN}`, 
    },
  };

  fetch(url, options)
    .then(response => response.json())
    .then(json => {
      console.log(json);       
      res.status(200).json(json);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch now playing movies" });
    });
};
