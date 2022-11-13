import natural from 'natural';

natural.PorterStemmer.attach();

function preparePlaces(placesMetaData, placesKeywords) {
  console.log('Preparing Places ... \n');
  // Pre-processing movies for unified data structure
  // E.g. get overview property into same shape as studio property
  console.log('(1) Zipping Places');
  let PLACES_IN_LIST = zip(placesMetaData, placesKeywords);
  //Paimam is PLACES_IN_LIST overview key
  
  PLACES_IN_LIST = withTokenizedAndStemmed(PLACES_IN_LIST, 'overview');
  // Cia mes aprasymo kiekvienam zodziui priskyrem id ir name
  //console.log(PLACES_BY_ID);
  PLACES_IN_LIST = fromArrayToMap(PLACES_IN_LIST, 'overview');
  //console.log(PLACES_IN_LIST);
  // Keep a map of places for later reference
  let PLACES_BY_ID = PLACES_IN_LIST.reduce(byId, {});
  //console.log('(2) Creating Dictionaries');
  // Preparing dictionaries for feature extraction
  let DICTIONARIES = prepareDictionaries(PLACES_IN_LIST);
  // Feature Extraction:
  // Map different types to numerical values (e.g. adult to 0 or 1)
  // Map dictionaries to partial feature vectors
  console.log('(3) Extracting Features');
  let X = PLACES_IN_LIST.map(toFeaturizedPlaces(DICTIONARIES));

  // Extract a couple of valuable coefficients
  // Can be used in a later stage (e.g. feature scaling)
  console.log('(4) Calculating Coefficients');
  let { means, ranges } = getCoefficients(X);
  // Synthesize Features:
  // Missing features (such as budget, release, revenue)
  // can be synthesized with the mean of the features
  console.log('(5) Synthesizing Features');
  X = synthesizeFeatures(X, means, [0, 1, 2, 3, 4, 5, 6]);
  
  
  // Feature Scaling:
  // Normalize features based on mean and range vectors
  console.log('(6) Scaling Features \n');
  X = scaleFeatures(X, means, ranges);
  //console.log(X)
  return {
    PLACES_BY_ID,
    PLACES_IN_LIST,
    X,
  };
}

export function byId(placesById, place) {
  placesById[place.id] = place;
  return placesById;
}

export function prepareDictionaries(places) {
  // let genresDictionary = toDictionary(movies, 'genres');
  let studioDictionary = toDictionary(places, 'Organization');
  let keywordsDictionary = toDictionary(places, 'keywords');
  let overviewDictionary = toDictionary(places, 'overview');
  // Customize the threshold to your own needs
  // Depending on threshold you get a different size of a feature vector for a movie
  // The following case attempts to keep feature vector small for computational efficiency
  studioDictionary = filterByThreshold(studioDictionary, 1);
  
  keywordsDictionary = filterByThreshold(keywordsDictionary, 1);
  
  overviewDictionary = filterByThreshold(overviewDictionary, 10);
  //console.log(overviewDictionary);
  return {
    // genresDictionary,
    studioDictionary,
    keywordsDictionary,
    overviewDictionary,
  };
}

export function scaleFeatures(X, means, ranges) {
  return X.map((row) => {
    return row.map((feature, key) => {
      return (feature - means[key]) / ranges[key];
    });
  });
};

export function synthesizeFeatures(X, means, featureIndexes) {
  return X.map((row) => {
    return row.map((feature, key) => {
      if (featureIndexes.includes(key) && feature === 'undefined') {
        return means[key];
      } else {
        return feature;
      }
    });
  });
}

export function getCoefficients(X) {
  const M = X.length;
  const initC = {
    sums: [],
    mins: [],
    maxs: [],
  };

  const helperC = X.reduce((result, row) => {
    if (row.includes('undefined')) {
      return result;
    }

    return {
      sums: row.map((feature, key) => {
        if (result.sums[key]) {
          return result.sums[key] + feature;
        } else {
          return feature;
        }
      }),
      mins: row.map((feature, key) => {
        if (result.mins[key] === 'undefined') {
          return result.mins[key];
        }

        if (result.mins[key] <= feature) {
          return result.mins[key];
        } else {
          return feature;
        }
      }),
      maxs: row.map((feature, key) => {
        if (result.maxs[key] === 'undefined') {
          return result.maxs[key];
        }

        if (result.maxs[key] >= feature) {
          return result.maxs[key];
        } else {
          return feature;
        }
      }),
    };
  }, initC);

  const means = helperC.sums.map(value => value / M);
  const ranges =  helperC.mins.map((value, key) => helperC.maxs[key] - value);

  return { ranges, means };
}

export function toFeaturizedPlaces(dictionaries) {
  return function toFeatureVector(place) {
    const featureVector = [];
    featureVector.push(toFeaturizedNumber(place, 'Score'));
    featureVector.push(...toFeaturizedFromDictionary(place, dictionaries.overviewDictionary, 'overview'));
    //console.log(featureVector);
    featureVector.push(...toFeaturizedFromDictionary(place, dictionaries.studioDictionary, 'Organization'));
    featureVector.push(...toFeaturizedFromDictionary(place, dictionaries.keywordsDictionary, 'keywords'));
    //console.log(featureVector)
    return featureVector;
  }
}

export function toFeaturizedRelease(place) {
  return place.release ? Number((place.release).slice(0, 4)) : 'undefined';
}

export function toFeaturizedAdult(movie) {
  return movie.adult === 'False' ? 0 : 1;
}

export function toFeaturizedHomepage(movie) {
  return movie.homepage ? 0 : 1;
}

export function toFeaturizedLanguage(movie) {
  return movie.language === 'en' ? 1 : 0;
}

export function toFeaturizedFromDictionary(place, dictionary, property) {
  // Fallback, because not all movies have associated keywords
  const propertyIds = (place[property] || []).map(value => value.id);
  const isIncluded = (value) => propertyIds.includes(value.id) ? 1 : 0;
  return dictionary.map(isIncluded);
}

export function toFeaturizedNumber(movie, property) {
  const number = Number(movie[property]);

  // Fallback for NaN
  if (number > 0 || number === 0) {
    return number;
  } else {
    return 'undefined';
  }
}

export function fromArrayToMap(array, property) {
  return array.map((value) => {
    const transformed = value[property].map((value) => ({
      id: value,
      name: value,
    }));
    return { ...value, [property]: transformed };
  });
}

export function withTokenizedAndStemmed(array, property) {
  //Cia mes paimam zodzius is aprasymo ir juos isfiltruojame
  return array.map((value) => ({
    ...value,
    [property]: value[property].tokenizeAndStem(),
  }));
}

export function filterByThreshold(dictionary, threshold) {
  return Object.keys(dictionary)
    .filter(key => dictionary[key].count > threshold)
    .map(key => dictionary[key]);
}

export function toDictionary(array, property) {
  const dictionary = {};

  array.forEach((value) => {
    // Fallback for null value after refactoring
    (value[property] || []).forEach((innerValue) => {
      if (!dictionary[innerValue.id]) {
        dictionary[innerValue.id] = {
          ...innerValue,
          count: 1,
        };
      } else {
        dictionary[innerValue.id] = {
          ...dictionary[innerValue.id],
          count: dictionary[innerValue.id].count + 1,
        }
      }
    });
  });

  return dictionary;
}

export function zip(places, keywords) {
  //Object.keys grazina visus filmu id, nes yra sukuriamas tik vienas objektas, kuriame yra vienas key, kuris yra id, o kiekvienas id turi informacija apie save
  //Tada su map funkcija sukuriam nauja array su kiekvienam filmo id priskirtais keywords
  return Object.keys(places).map(mId => ({
    ...places[mId],
    ...keywords[mId],
  }));
}

export default preparePlaces;