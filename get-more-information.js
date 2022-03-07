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

// 연령 등급 정보 (없는 경우 있음)
const getAge = async (movieId) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${process.env.MOVIE_DB_API_KEY}`
	)
	if (response.data.results.filter((x) => x.iso_3166_1 === 'KR')[0]) {
		const age = response.data.results.filter(
			(x) => x.iso_3166_1 === 'KR'
		)[0].release_dates[0].certification
		return age
	} else return ''

	// const movie = await Movie.findOne({ movieId })
	// movie.age = age
	// return await movie.save()
}

// 제작 국가, 상영 길이 정보
const getDetails = async (movieId) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR`
	)

	let country
	let duration
	if (response.data.production_countries[0]) {
		country = response.data.production_countries[0].name
	} else {
		country = ''
	}
	if (response.data.runtime) {
		duration = response.data.runtime + '분'
	} else {
		duration = ''
	}
	// const movie = await Movie.findOne({ movieId })
	// movie.country = country
	// movie.duration = duration
	// return await movie.save()
	return [country, duration]
}

// 이미지 정보 최대 10개
const getImages = async (movieId) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${process.env.MOVIE_DB_API_KEY}`
	)

	const galleryUrls = response.data.backdrops
		.slice(0, 10)
		.map((x) => 'https://image.tmdb.org/t/p/original' + x.file_path)
	// const movie = await Movie.findOne({ movieId })
	// movie.galleryUrls = galleryUrls
	// return await movie.save()
	return galleryUrls
}

// 비디오 정보
const getVideos = async (movieId) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR`
	)

	const videoUrls = response.data.results.map((x) => {
		return {
			title: x.name,
			url: 'https://www.youtube.com/watch?v=' + x.key,
		}
	})
	// const movie = await Movie.findOne({ movieId })
	// movie.videoUrls = videoUrls
	// return await movie.save()
	return videoUrls
}

// credits 정보 -> 배우 10명 + 감독
const getCredits = async (movieId) => {
	const response = await axios.get(
		`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.MOVIE_DB_API_KEY}&language=ko-KR`
	)
	const actors = response.data.cast.slice(0, 10).map((x) => {
		return {
			image: 'https://image.tmdb.org/t/p/original' + x.profile_path,
			name: x.original_name,
			role: x.character,
		}
	})
	const directors = response.data.crew
		.filter((x) => x.job === 'Director')
		.map((x) => {
			return {
				image: 'https://image.tmdb.org/t/p/original' + x.profile_path,
				name: x.original_name,
				role: x.job,
			}
		})
	const credits = directors.concat(actors)

	// const movie = await Movie.findOne({ movieId })
	// movie.credits = credits
	// return await movie.save()
	return credits
}

// const insertDataOneByOne = async () => {
// 	const movies = await Movie.find({}).select('movieId')
// 	for (const oneMovie of movies) {
// 		const movieId = oneMovie.movieId

// 		const age = await getAge(movieId)
// 		const [country, duration] = await getDetails(movieId)
// 		const galleryUrls = await getImages(movieId)
// 		const videoUrls = await getVideos(movieId)
// 		const credits = await getCredits(movieId)

// 		const movie = await Movie.findOne({ movieId })
// 		movie.age = age
// 		movie.country = country
// 		movie.duration = duration
// 		movie.galleryUrls = galleryUrls
// 		movie.videoUrls = videoUrls
// 		movie.credits = credits
// 		await movie.save()
// 	}
// }

// insertDataOneByOne()

const insertDataOneByOne = async () => {
	const movies = await Movie.find({}).select('movieId')
	let count = 1
	for (const oneMovie of movies) {
		console.log(`${count++} / ${movies.length} 영화 상세 정보 가져오는 중`)
		const movieId = oneMovie.movieId
		const [age, [country, duration], galleryUrls, videoUrls, credits] =
			await Promise.all([
				getAge(movieId),
				getDetails(movieId),
				getImages(movieId),
				getVideos(movieId),
				getCredits(movieId),
			])
		const movie = await Movie.findOne({ movieId })
		movie.age = age
		movie.country = country
		movie.duration = duration
		movie.galleryUrls = galleryUrls
		movie.videoUrls = videoUrls
		movie.credits = credits

		await movie.save()

		if (oneMovie === movies[movies.length - 1]) console.log('완료!')
	}
}

insertDataOneByOne()

// .then(async (res) => {
// 	const [age, [country, duration], galleryUrls, videoUrls, credits] =
// 		res
// 	const movie = await Movie.findOne({ movieId })
// 	movie.age = age
// 	movie.country = country
// 	movie.duration = duration
// 	movie.galleryUrls = galleryUrls
// 	movie.videoUrls = videoUrls
// 	movie.credits = credits

// 	await movie.save()
// })
// .catch(() => {})

// const age = getAge(movieId)
// const [country, duration] = getDetails(movieId)
// const galleryUrls = getImages(movieId)
// const videoUrls = getVideos(movieId)
// const credits = getCredits(movieId)

// const movie = Movie.find({ movieId })
// movie.age = age
// movie.country = country
// movie.duration = duration
// movie.galleryUrls = galleryUrls
// movie.videoUrls = videoUrls
// movie.credits = credits

// await movie.save()
// 		break
// 	}
// }

// 하나씩 실행해야 함... 어떻게 한번에 할 수 있을까?
// insertAgeOneByOne()
// insertDetailsOneByOne()
// insertImagesOneByOne()
// insertVideosOneByOne()
// insertCreditsOneByOne()

// insertDataOneByOne()
// getCredits(299536)
