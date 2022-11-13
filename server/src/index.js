import predictWithContentBased from './strategies/contentBased';
import prepareRatings from './preparation/ratings';
import {sliceAndDice, addUserRating} from './functions/utility';
import preparePlaces from './preparation/movies';
import {aprasymaiPromise, placesKeywordsPromise, placesMetaDataPromise, ratingsPromise} from './functions/fileFunctions';
import predictWithLinearRegression from './strategies/linearRegression';
import { predictWithCfUserBased, predictWithCfItemBased } from './strategies/collaborativeFiltering';
import {getcoords} from './functions/functions';
const cors = require('cors')
const {checkUser} = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
let app = express();
app.use(cors())
const path = require('path');
app.use(express.json());
const db = require('./models');

let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true })
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.get('*', checkUser);
app.use(authRoutes);

db.sequelize.sync().then(()=> {
  app.listen(process.env.PORT || 5000);
})




// let ME_USER_ID = 0;
// Promise.all([
//   placesMetaDataPromise,
//   placesKeywordsPromise,
//   ratingsPromise,
//   aprasymaiPromise,
//   ])
//   .then(init).catch(err => console.log(err));
function init([ placesMetaData, placesKeywords, ratings, aprasymai ]) {
  /* ------------ */
  //  Parengimas  //
  /* -------------*/

  let {
      PLACES_BY_ID,
      PLACES_IN_LIST,
      X,
    } = preparePlaces(placesMetaData, placesKeywords);
    let test3 = [];
    PLACES_IN_LIST.forEach(element => {
      element.keywords.forEach(keyword => {
        if(!test3.includes(keyword.name)) {
          test3.push(keyword.name);
        }
      })
    }); 
    app.get('/forma', urlencodedParser, (req, res) => {
        res.render('index', {test3});
    });

    app.get('/', urlencodedParser,  (req, res) => {
      let bbz = [];
      let  title1 = (req.query.mygtukas);
        PLACES_IN_LIST.forEach(place => {
          place.keywords.forEach(element => {
            if((element.name === title1 && place.Score > 3 ) && bbz.length <6 ) {
              bbz.push(place.title);
            };
          });
        });
        // paieska(bbz).then(data => {

        //   res.render('index2',  {places : bbz, title1: title1, data} );
        // });
        res.render('index2',  {places : bbz, title1: title1} );
    });
    app.get('/rekomendavimas', urlencodedParser, async (req, res) => {
      const vietos = await User.find({email: res.locals.user.email});
      const [placeinfo] = vietos;
      let places = [];
      const vietosk = placeinfo.placeInfoRated;
      let ME_USER_RATINGS = [];
      let i = 0;
      if(vietosk.length > 0)
      {
        vietosk.forEach(vieta =>{
          console.log(vieta.title)
          if (vieta.score != 0){
            ME_USER_RATINGS.push(addUserRating(ME_USER_ID, vieta.title, vieta.score, PLACES_IN_LIST))
          }
          
        });
        const {
      ratingsGroupedByUser,
      ratingsGroupedByPlace,
    } = prepareRatings([ ...ME_USER_RATINGS, ...ratings ]);

      const meUserRatings = ratingsGroupedByUser[ME_USER_ID];
      const linearRegressionBasedRecommendation = predictWithLinearRegression(X, PLACES_IN_LIST, meUserRatings);
      let linear = sliceAndDice(linearRegressionBasedRecommendation, PLACES_BY_ID, 6, true);
      linear.forEach(place => {
        places.push(place.title)
      });
      
      }
      // paieska(places).then(data => {
        // res.render('rekomendacijos', {rplaces : places, data } );
      // })
      res.render('rekomendacijos', {rplaces : places } );
    });
    app.get('/recommendation', urlencodedParser, async (req, res) => {
    let title2 = '';
    let aprasymas = [];
    let places = [];
    let coords = {};
    title2 = (req.query.place);
    if (res.locals.user) {
      //console.log(res.locals.user)
      const placeExist = await User.findOne({email: res.locals.user.email, 'placeinfo.title' : title2});
      if (placeExist) {
        console.log("Place already exists")
      }
      else {
        let place = {title: title2, score: 0};
        User.findOneAndUpdate(
        { email: res.locals.user.email }, 
        { $push: { placeinfo: place} },
        function (error, success) {
         if (error) {
             console.log(error);
         } else {
             //console.log(success);
         }
     });
      }

    }
    for (let i=0; i <=aprasymai.length; i++) {
       if (aprasymai[i].id ===title2) {
        coords = {x : parseFloat(aprasymai[i].xcord), y: parseFloat(aprasymai[i].ycord)};
        aprasymas = aprasymai[i].overview;
        break;
       }
      }
    const gswcords = getcoords(coords);
    //console.log('(B) Content-Based Prediction ... \n');
    const contentBasedRecommendation = predictWithContentBased(X, PLACES_IN_LIST, title2);
    console.log(` Content-Based Prediction based on "${title2}" \n`);
    let contentPlaces = sliceAndDice(contentBasedRecommendation, PLACES_BY_ID, 7, true);
    contentPlaces.forEach(place => {
      places.push(place.title)
    });
        // paieska(places).then(data => {
        //   res.render('places', {rplaces : contentPlaces, title2: title2, aprasymas, data, gswcords} );
        // })
        res.render('places', {rplaces : contentPlaces, title2: title2, aprasymas, gswcords} );
    });
  }