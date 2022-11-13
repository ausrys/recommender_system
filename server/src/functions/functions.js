const transformation = require('transform-coordinates')
export function getcoords(placecoords) {
const transform = transformation('EPSG:3346', 'EPSG:4326')
const coords = transform.forward(placecoords)
return coords;
}

const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
 export async function paieska (placestitles) {
    let as = [];
    const error = "Image not found";
      for (let title of placestitles) {
        const response = await customSearch.cse.list({
        auth: '-3w',
        cx: '',
        q: title,
        num: 1,
        searchType: 'image',
        imgSize: 'medium'
      })
        if(response.data.items) {
          as.push(response.data.items.map( item => item.link));
        }
        else {
          as.push(error);
        }
    }
    
      return as;
  }