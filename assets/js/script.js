
//global variables
const secret = `5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS`
const apiKey = `8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF`
const url = `https://api.petfinder.com/v2/types`

//string must either be `city, state` or `zipcode`
var userLocation = `austin, texas`

function petfinderCall() {
    var pf = new petfinder.Client({ apiKey: apiKey, secret: secret });
    pf.animal.search({
        location: userLocation,
        distance: 15
    })
        .then(function (response) {
            //response object from api
            for (let index = 0; index < response.data.animals.length; index++) {
                console.log(response.data.animals[index]);
            }
        })
        .catch(function (error) {
            // Handle the error
            console.log(error);
        });
}

petfinderCall()