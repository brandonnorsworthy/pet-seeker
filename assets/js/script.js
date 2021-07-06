
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

                //Appends pet name and age    
                petName.textContent = `${response.data.animals[0].name}`;
                petAge.textContent = `Age: ${response.data.animals[0].age}`;
                nameAndAge.append(petName);
                nameAndAge.append(petAge);
                
                //Appends secondary pet characteristics
                petType.textContent = `Species: ${response.data.animals[0].type}`;
                petGender.textContent = `Gender: ${response.data.animals[0].gender}`;
                petBreed.textContent = `Breed: ${response.data.animals[0].breeds}`;
                petSize.textContent = `Size: ${response.data.animals[0].size}`;
                petDescription.textContent = `Description: ${response.data.animals[0].description}`;
                petCharacteristics.append(petType);
                petCharacteristics.append(petGender);
                petCharacteristics.append(petBreed);
                petCharacteristics.append(petSize);
                petCharacteristics.append(petDescription);
                console.log(response.data.animals[0].breeds)
                dogApiCall(response.data.animals[0].breeds);
                
        })
        .catch(function (error) {
            // Handle the error
            console.log(error);
        });
}


//Swipe animation

function slideShow(n) {
    var slides = document.getElementById("hero-image");
    var swipeLeft = document.getElementById("x");
    var swipeRight = document.getElementById("heart");
    if (n > slides.length) {
                
    }
};


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
