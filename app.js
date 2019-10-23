const TwitterStream = require('twitter-stream-api');
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
const producer = new Producer(client);
const uuidv4 = require('uuid/v4');

const keys = {
    consumer_key : "ShEvIpUEuIqtK3IzvZkgPTzIq",
    consumer_secret : "m3Fk84NSZmYcvMmlF7QICbDU23FvEfz4tQudhxyRU0S96Jxl4s",
    token : "71194647-tVivkE02FYVg53D06qsmQ5rDnyUyKs62KrRfV3h9r",
    token_secret : "mCDwyckCDwiPWtSTQ9ZAG4iIxvgc1l74cpBx2yXaa6ckD"
};
const Twitter = new TwitterStream(keys, null, null);
const trackPhrase = 'trump';

Twitter.stream('statuses/filter', {
    track: trackPhrase
});

Twitter.on('connection rate limit', function (httpStatusCode) {
    console.log('connection rate limit reached.', httpStatusCode);
});

Twitter.on('connection success', function (uri) {
    console.log('connection success.', uri);
});

let payloads = [];
producer.on('ready', function () {
    Twitter.on('data', function (obj) {
        console.log('connection success', obj.user.name);
        let jsonVal = {"id":uuidv4(), "properties": {"name": obj.user.name, "tweet_text": obj.text, "from": obj.user.location}};
        payloads.push(
            { topic: 'topic-name', 
            messages: JSON.stringify(jsonVal),
            partition: 0 
        });

        if(payloads.length > 0) {
            producer.send(payloads, function (err, data) {
                if(err) console.log('ERR is send')
                else console.log('Send OK', data);  payloads = [];
            });    
            }
    });
});
producer.on('error', function (err) {
    console.log('ERROR>>>>', err)
})
