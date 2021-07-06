
//global variables
const secret = `5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS`
const apiKey = `8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF`
const url = `https://api.petfinder.com/v2/types`
const dogapiKey = 'c8cd1d33-b825-4d0b-aeca-b35206aec201';

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
            // for (let index = 0; index < response.data.animals.length; index++) {
                // console.log(response.data.animals[0]);

                //Appends pet name and age to document
                var petName = document.getElementById("petName");
                var petAge = document.getElementById("petAge");
                petName = response.data.animals[0].name;
                petAge = response.data.animals[0].age;
                nameAndAge.append(`${petName}`);
                nameAndAge.append(`Age: ${petAge}`);
                
                //Appends secondary characteristics to document
                var petType = document.getElementById("petType");
                var petGender = document.getElementById("petGender");
                var petBreed = document.getElementById("petBreed");
                var petSize = document.getElementById("petSize");
                var petDescription = document.getElementById("petDescription");
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
                dogApiCall(petBreed);
            // }
        })
        .catch(function (error) {
            // Handle the error
            console.log(error);
        });
}



function dogApiCall(petBreed) {
    console.log(petBreed)
    var dogApiUrl = `https://api.thedogapi.com/v1/breeds/search?q=${petBreed.primary}`;
    fetch(dogApiUrl,{
    headers: {
        'X-Api-Key': 'c8cd1d33-b825-4d0b-aeca-b35206aec201'
    }
    })
    .then(response => response.json())
    .then(result => {
    console.log('Success:', result);
    })

        // if (response.ok) {
            
        //     response.json().then(function(data) {
                
            //     var heatIndex = parseInt(data.current.feels_like);
            //     heatIndex = Math.round((heatIndex - 273.15) * 9/5 + 32);
            //     heatindexLabel.textContent = "Heat Index: " + heatIndex + "°F";
            //     if (heatIndex> 90) {
            //         heatindexLabel.style.backgroundColor = "red";
            //     } else if (heatIndex > 70) {
            //         heatindexLabel.style.backgroundColor = "orange";
            //     } else {
            //         heatindexLabel.style.backgroundColor = "green";
            //     }
            // });
        // } else {
        //     alert('Error: ' + response.statusText);
        // }
    // })
    .catch (function (error) {
        alert('Unable to connect to the Dog API' + error);
    })
}

petfinderCall()