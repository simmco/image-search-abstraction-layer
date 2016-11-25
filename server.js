const express = require('express');
const request = require('request');
const http = require('http');
const path = require('path');


var {mongoose} = require('./db/mongoose');
var {API} = require('./models/api-res');
var {APICount} = require('./models/api-req');
var {getParameterByName} = require('./ref/para.js');

var app = express();
const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
  res.status(200).send();
});


app.get('/api/latest/imagesearch', (req, res) => {
  APICount.find({}, {_id: 0, __v: 0}).sort('-when').limit(10).exec(function(err, posts) {
    res.send(posts);
  });
});

app.get('/api/imagesearch/:search', (req, res, next) =>  {
  let search = req.params.search;
  let count = req.query.offset;
  let apiKey = 'd143efc3aa714752b0319f88a60273f6';

  var callApi = new APICount ({
    term: search,
    when: Date.now()
  });

  callApi.save();
  request.get({
    url: `https://api.cognitive.microsoft.com/bing/v5.0/images/search`,
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey
    },
    json: true,
    qs: {
      q : search,
      count: count,
      offset: 0,
      mkt: 'en-us',
      safeSearch: 'Moderate'
    }
  }, function (err, res, body) {
      let content = body.value;
      for(i=0; i < content.length; i++) {
      //get orignalUrl out of bingUrl
        let conUrl = content[i].contentUrl;
        let url = getParameterByName('r', conUrl);
          var val = new API ({
            url: url,
            snippet: content[i].name,
            thumbnail: content[i].thumbnailUrl,
            context: content[i].hostPageDisplayUrl
          });

          if(i === content.length -1) {
              val.save((err, product, numAffected) => {
                if(numAffected) next();
              });
          } else {
            val.save();
          }
      }
  });
});


app.use('/api/imagesearch/:search', (req, res, next) => {
    API.find({},{_id: 0, __v: 0}).then((doc) => {
      res.send(doc);
      API.remove({}, (err, res) => {});
    });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
