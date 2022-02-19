const mongoose = require('mongoose');

const moviSchema = mongoose.Schema({
    "movieId" : {
        type: Number,
    },    
    "title" : {
        type : String,
    },
    "postUrl" : {
        type : String,
    },
    "year" : {
        type : String
    },
    "country" : {
        type : String
    },
    "category" : {
        type : String
    }
});

module.exports = mongoose.model('Movi', moviSchema);