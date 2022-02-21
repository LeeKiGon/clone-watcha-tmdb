const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
	movieId: {
		type: Number,
	},
	title: {
		type: String,
	},
	posterUrl: {
		type: String,
	},
	year: {
		type: Number,
	},
	genre: {
		type: String,
	},
	country: {
		type: String,
	},
	originalTitle: {
		type: String,
	},
	duration: {
		type: String,
	},
	age: {
		type: String,
	},
	description: {
		type: String,
	},
	galleryUrls: {
		type: [String],
	},
	videoUrls: [
		{
			title: String,
			url: String,
		},
	],
	credits: [
		{
			image: String,
			name: String,
			role: String,
		},
	],
	category: {
		type: [String],
	},
})

module.exports = mongoose.model('Movie', movieSchema, 'movies')
