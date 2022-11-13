//  Utility file
import { getMovieIndexByTitle } from '../strategies/common';

//  Manage result data ouput
 export function sliceAndDice(recommendations, MOVIES_BY_ID, count, onlyTitle) {
    recommendations = recommendations.filter(recommendation => MOVIES_BY_ID[recommendation.movieId]);
    recommendations = onlyTitle
      ? recommendations.map(mr => ({ title: MOVIES_BY_ID[mr.movieId].title, score: mr.score}))
      : recommendations.map(mr => ({ movie: MOVIES_BY_ID[mr.movieId], score: mr.score}));
      
  
    return recommendations
      .slice(0, count);
  }
// Data checking
   export function softEval(string, escape) {
      if (!string) {
        return escape;
      }
    
      try {
        return eval(string);
      } catch (e) {
        return escape;
      }
    }
// Add user ratings 
    export function addUserRating(userId, searchTitle, rating, PLACES_IN_LIST) {
        const { id, title } = getMovieIndexByTitle(PLACES_IN_LIST, searchTitle);
      
        return {
          userId,
          rating,
          movieId: id,
          title,
        };
    }
