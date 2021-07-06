
//global variables
const secret = `5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS`
const apiKey = `8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF`
const url = `https://api.petfinder.com/v2/types`

//string must either be `city, state` or `zipcode`
var userLocation = `austin, texas`

//Name and Characteristic variables
var nameAndAge = document.getElementById("media-content");
var petCharacteristics = document.getElementById("content");

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

                //Appends pet name and age to document
                var petName = document.getElementById("petName");
                var petAge = document.getElementById("petAge");
                petName = response.data.animals[0].name;
                petAge = response.data.animals[0].age;
                nameAndAge.append(`${petName}`);
                nameAndAge.append(`Age: ${petAge}`);
                
                //Appends secondary characteristics to document
                var petType = document.createElement("p");
                var petGender = document.createElement("p");
                var petBreed = document.createElement("p");
                var petSize = document.createElement("p");
                var petDescription = document.getElementById("p");
                petType = response.data.animals[0].type;
                petGender = response.data.animals[0].gender;
                petBreed = response.data.animals[0].breeds;
                petSize = response.data.animals[0].size;
                petDescription = response.data.animals[0].description;
                petCharacteristics.append(`Type: ${petType}`);
                petCharacteristics.append(`Gender: ${petGender}`);
                petCharacteristics.append(`Breed: ${petBreed}`);
                petCharacteristics.append(`Size: ${petSize}`);
                petCharacteristics.append(`${petDescription}`);
            }
        })
        .catch(function (error) {
            // Handle the error
            console.log(error);
        });
}

petfinderCall()

