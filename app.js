

const TwitterStream = require('twitter-stream-api');
const fs = require('fs');

const keys = {
    consumer_key : "",
    consumer_secret : "",
    token : "",
    token_secret : ""
};

const Twitter = new TwitterStream(keys, null, null);
Twitter.stream('statuses/filter', {
    track: 'serverless'
});

Twitter.on('connection rate limit', function (httpStatusCode) {
    console.log('connection rate limit', httpStatusCode);
});

Twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
});

Twitter.on('data', function (obj) {
    console.log('connection success', obj);
});
// Twitter.pipe(fs.createWriteStream('tweets.json'));