import csv from 'fast-csv';
import fs from 'fs';
import {softEval, sliceAndDice} from '../functions/utility';
let PLACES_META_DATA = {};
let PLACES_KEYWORDS = {};
let RATINGS = [];
let aprasymai = [];
//We read data from files and write them in to variables
export  let aprasymaiPromise = new Promise((resolve) =>
  fs
    .createReadStream(__dirname + '/data/places.csv')
    .pipe(csv({ headers: true }))
    .on('data', fromMetaAprasymai)
    .on('end', () => resolve(aprasymai)));  
export  let placesMetaDataPromise = new Promise((resolve) =>
  fs
    .createReadStream(__dirname + '/data/places.csv')
    .pipe(csv({ headers: true }))
    .on('data', fromMetaDataFile)
    .on('end', () => resolve(PLACES_META_DATA)));
    
// export let placesKeywordsPromise = new Promise((resolve) =>
//   fs
//     .createReadStream(__dirname + '/data/test2.csv')
//     .pipe(csv({ headers: true }))
//     .on('data', fromKeywordsFile)
//     .on('end', () => resolve(PLACES_KEYWORDS)));

export let ratingsPromise = new Promise((resolve) =>
  fs
  .createReadStream(__dirname + '/data/reitingai.csv')
  .pipe(csv({ headers: true }))
  .on('data', fromRatingsFile)
  .on('end', () => resolve(RATINGS)));

  function fromMetaAprasymai(row) {
    aprasymai.push({
    id: row.title, 
    overview: row.overview,
    xcord: row.X,
    ycord: row.Y,
  });
  }
  function fromMetaDataFile(row) {
  //Paimam eilutes id ir tam id priskiriam objekta su visais eilutes keys, pvz id, adult, genres ir t. t.
  PLACES_META_DATA[row.id] = {
    id: row.id,
    title: row.title,
    titleEn: row.TitleEN,
    overview: row.overview,
    Score: row.Score,
    Organization: softEval(row.Organization,[]),
  };
}

function fromKeywordsFile(row) {
  PLACES_KEYWORDS[row.id] = {
    keywords: softEval(row.keywords, []),
  };
}

function fromRatingsFile(row) {
  RATINGS.push(row);
}
    