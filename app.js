const express = require('express')
const connect = require('./schemas')
const Movie = require('./schemas/movie')
const dotenv = require('dotenv')
const axios = require('axios')
const app = express()

app.use(express.json())
app.use('/', express.urlencoded({ extended: false }))

dotenv.config()
connect()

const genres = {
	28: '액션',
	12: '모험',
	16: '애니메이션',
	35: '코미디',
	80: '범죄',
	99: '다큐멘터리',
	18: '드라마',
	10751: '가족',
	14: '판타지',
	36: '역사',
	27: '공포',
	10402: '음악',
	9648: '미스터리',
	10749: '로맨스',
	878: 'SF',
	10770: 'TV 영화',
	53: '스릴러',
	10752: '전쟁',
	37: '서부',
}

// Now Playing 목록
const fetchNowPlayingMovies = async (page) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR&page=${page}`
	)

	const movies = response.data.results
	const list = []
	for (const movie of movies) {
		const movieId = movie.id
		const title = movie.title
		const posterUrl =
			'https://image.tmdb.org/t/p/original' + movie.poster_path
		const year = movie.release_date.substring(0, 4)
		const genre = movie.genre_ids.map((x) => genres[x]).join(', ')
		const originalTitle = movie.original_title
		const description = movie.overview
		const category = ['now_playing']

		list.push({
			movieId,
			title,
			posterUrl,
			year,
			genre,
			originalTitle,
			description,
			category,
		})
	}
	return list
}

// popular 목록
const fetchPopularMovies = async (page) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR&page=${page}`
	)

	const movies = response.data.results
	const list = []
	for (const movie of movies) {
		const movieId = movie.id
		const title = movie.title
		const posterUrl =
			'https://image.tmdb.org/t/p/original' + movie.poster_path
		const year = movie.release_date.substring(0, 4)
		const genre = movie.genre_ids.map((x) => genres[x]).join(', ')
		const originalTitle = movie.original_title
		const description = movie.overview
		const category = ['popular']

		list.push({
			movieId,
			title,
			posterUrl,
			year,
			genre,
			originalTitle,
			description,
			category,
		})
	}
	return list
}

// top_rated 목록
const fetchTopRatedMovies = async (page) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR&page=${page}`
	)

	const movies = response.data.results
	const list = []
	for (const movie of movies) {
		const movieId = movie.id
		const title = movie.title
		const posterUrl =
			'https://image.tmdb.org/t/p/original' + movie.poster_path
		const year = movie.release_date.substring(0, 4)
		const genre = movie.genre_ids.map((x) => genres[x]).join(', ')
		const originalTitle = movie.original_title
		const description = movie.overview
		const category = ['top_rated']

		list.push({
			movieId,
			title,
			posterUrl,
			year,
			genre,
			originalTitle,
			description,
			category,
		})
	}
	return list
}

// upcoming 목록
const fetchUpcomingMovies = async (page) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR&page=${page}`
	)

	const movies = response.data.results
	const list = []
	for (const movie of movies) {
		const movieId = movie.id
		const title = movie.title
		const posterUrl =
			'https://image.tmdb.org/t/p/original' + movie.poster_path
		const year = movie.release_date.substring(0, 4)
		const genre = movie.genre_ids.map((x) => genres[x]).join(', ')
		const originalTitle = movie.original_title
		const description = movie.overview
		const category = ['upcoming']

		list.push({
			movieId,
			title,
			posterUrl,
			year,
			genre,
			originalTitle,
			description,
			category,
		})
	}
	return list
}

const getAllData = async (page) => {
	const list = []
	for (let i = 1; i <= page; i++) {
		list.push(fetchNowPlayingMovies(i))
		list.push(fetchPopularMovies(i))
		list.push(fetchTopRatedMovies(i))
		list.push(fetchUpcomingMovies(i))
	}
	const data = await Promise.all(list)
	count = 1
	for (const d of data) {
		console.log(`${count++}번째 영화 목록 가져오는 중`)
		for (const json of d) {
			const existMovie = await Movie.findOne({ movieId: json.movieId })
			if (existMovie) {
				existMovie.category = existMovie.category.concat(json.category)
				await existMovie.save()
			} else {
				await Movie.create(json)
			}
		}
	}

}

getAllData(5)
