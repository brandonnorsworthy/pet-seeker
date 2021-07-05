
secret = `5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS`
apiKey = `8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF`
zip = 77388
url = `https://api.petfinder.com/v2/types`

var pf = new petfinder.Client({apiKey: "8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF", secret: "5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS"});

pf.animal.search()
    .then(function (response) {
        // Do something with `response.data.animals`
        console.log(response)
    })
    .catch(function (error) {
        // Handle the error
    });