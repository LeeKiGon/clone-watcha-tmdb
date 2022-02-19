const express = require('express');
const connect = require('./schemas');
const Movi = require('./schemas/movi');
const dotenv = require('dotenv');
const axios = require('axios');

// const mongoose = require('mongoose');

dotenv.config();

// mongoose.connect("mongodb://localhost:27017/gon", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,//현재 서버 검색 및 엔진 모니터링 방식을 더 이상 사용하지 않으므로 새로운 서버 및 엔진 모니터링 방식을 사용
// });

// const db = mongoose.connection; //성공적으로 연결했거나 연결 오류가 발생하면 알림을 받아야한다.
// db.on("error", console.error.bind(console, "connection error:"));

const app = express();
app.use(express.json());
app.use('/', express.urlencoded({extended: false}));

connect();

// /**
//  * Fetch popular movies from TMDB
//  *  @returns {Array} movies
//  */
 const fetchMovies = async (page) => {
    try {
      let result;
      await axios
        .get(
            // `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.MOVIE_DB_API_KEY}&page=${page}&language=ko-KR`
            `https://api.themoviedb.org/3/movie/634649?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR`
        )
        .then((response) => {          
          result = response.data
          // console.log(response)
          // title = result.map((item) =>
          //   item.title)
            // console.log(title)          
          // console.log(title)          
        })
        .catch((error) => {
          console.log(error);
        });
      return result;
    } catch (error) {
      console.error(error);
    }
  };

app.get('/movies', async (req, res) => {
  try {
    const {page} = req.query;
    // console.log(page)
    const data = await fetchMovies();
    console.log(data)
    // console.log(`${data.length}`)

    return res.status(200).json({
      status:200,
      // message: `${data.length} movies found`, 
      data
    })
    
  } catch (err) {
    return next();
  }
})


app.post('/movies', async (req, res, next)=>{
    try {
        const {page} = req.query;
        // console.log(page)
        const data = await fetchMovies();
        // console.log(`${data.length}`)
        // console.log(data)

        nam = data.map(item => item.name)
        console.log(nam)
        movieids = data.map((item) => item.id)
        // console.log(movieids)
        titles = data.map((item => item.title))
        // console.log(titles)
        postUrls = data.map((item => item.poster_path))
        years = data.map((item => item.release_date))
        countrys = data.map(item => item.original_language)
        category = "popular"


        // for(let i = 0; i < data.length; i++){
        // movieId = movieids[i]
        // title = titles[i]
        // postUrl = 'https://image.tmdb.org/t/p/w1280' + postUrls[i]
        // year = years[i]
        // country = countrys[i]
        // await Movi.create({ movieId, title, postUrl, year, country, category })
        // }

        return res.status(200).json({
          status:200,
          // message: `${data.length} movies found`, 
          data
        })
        
      } catch (err) {
        return next(err);
      }
})


const server = app.listen(4000, () => {
  console.log(`Server listening on port ${server.address().port}`);
});

app.get('/', (_, res)=>{
    res.send('hi')
})