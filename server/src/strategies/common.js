import similarity from 'compute-cosine-similarity';

export function sortByScore(recommendation) {
  return recommendation.sort((a, b) => b.score - a.score);
}

// X x 1 row vector based on similarities of movies
// 1 equals similar, -1 equals not similar, 0 equals orthogonal
// Whole matrix is too computational expensive for 45.000 movies
// https://en.wikipedia.org/wiki/Cosine_similarity
export function getCosineSimilarityRowVector(matrix, index) {
  return matrix.map((rowRelative, i) => {
    return similarity(matrix[index], matrix[i]);
  });
}

export function getMovieIndexByTitle(PLACES_IN_LIST, query) {
  const index = PLACES_IN_LIST.map(place => place.title).indexOf(query);
  if (!index) {
    throw new Error('Place not found');
  }

  const { title, id } = PLACES_IN_LIST[index];
  return { index, title, id };
}