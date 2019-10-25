

const TwitterStream = require('twitter-stream-api');
const fs = require('fs');

// test comment

const Twitter = new TwitterStream(keys, null, null);
Twitter.stream('statuses/filter', {
    track: 'javascript'
});

Twitter.on('connection rate limit', function (httpStatusCode) {
    console.log('connection rate limit', httpStatusCode);
});

Twitter.on('connection success', function (uri) {
    console.log('connection success', uri);
});

Twitter.on('data', function (obj) {
    console.log('>>', obj.text,' ||| ',obj.user.name,'\n');
});
// Twitter.pipe(fs.createWriteStream('tweets.json'));