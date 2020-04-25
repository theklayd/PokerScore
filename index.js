const Combinatorics = require('js-combinatorics');
const PokerHand = require('poker-hand-evaluator');
const sortBy = require('sort-array');
// const cors = require('cors');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// use it before all route definitions
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,OPTIONS');
  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Headers', 'Content-Type', 'X-Auth-Token');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);

  next();
});


// app.options('*', cors());

 function PokerHandCompute(PlayerHand, TotalCards) {
    let ArrayHand = JSON.parse("[" + PlayerHand + "]"); // to array
    let cmb = Combinatorics.combination(ArrayHand, TotalCards); //5 for holdem 7 for omha
    let AllCombinations = [];
    let a;
    while (a = cmb.next()) {
        AllCombinations.push(a);
    }
    let EvaluatedHand = [];
    let length = AllCombinations.length;
    for (let i = 0; i < length; ++i) {
        EvaluatedHand.push(new PokerHand(AllCombinations[i].join().replace(/\,/ig, " "))); //join = tostring() // replacing "," to " " and i = ignore case sensitive, g = global
    }
    let scores = sortBy(EvaluatedHand, 'score');
   /* console.log("----------------");
    for(let i =0;i<scores.length;++i){
        console.log(scores[i]);
    }
    console.log("----------------");*/
    let bestScore = scores[0];//[0] will return the best score
    return bestScore;
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/Api/v1/Poker/:Hand0?/:Hand1?/:Hand2?/:Hand3?/:Hand4?/:Hand5?/:Hand6?/:Hand7?/:Hand8?/:Hand9?', (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    let BestPlayerScores=[];
    let TotalCards  = 5;
    for (var propName in req.params) {
      if (req.params.hasOwnProperty(propName)&&req.params[propName]!=undefined) {
         // console.log(propName, req.params[propName]);
            let bestScore = PokerHandCompute(req.params[propName], TotalCards);
            BestPlayerScores.push(bestScore);
      }
    }
    res.send(BestPlayerScores);
  });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
