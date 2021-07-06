
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

                //Appends pet name and age    
                petName.textContent = `${response.data.animals[0].name}`;
                petAge.textContent = `Age: ${response.data.animals[0].age}`;
                nameAndAge.append(petName);
                nameAndAge.append(petAge);
                
                //Appends secondary pet characteristics
                petType.textContent = `Species: ${response.data.animals[0].type}`;
                petGender.textContent = `Gender: ${response.data.animals[0].gender}`;
                petBreed.textContent = `Breed: ${response.data.animals[0].breed}`;
                petSize.textContent = `Size: ${response.data.animals[0].size}`;
                petDescription.textContent = `Description: ${response.data.animals[0].description}`;
                petCharacteristics.append(petType);
                petCharacteristics.append(petGender);
                petCharacteristics.append(petBreed);
                petCharacteristics.append(petSize);
                petCharacteristics.append(petDescription);
            }
        })
        .catch(function (error) {
            // Handle the error
            console.log(error);
        });
}

petfinderCall()

//Swipe animation

function slideShow(n) {
    var slides = document.getElementById("hero-image");
    var swipeLeft = document.getElementById("x");
    var swipeRight = document.getElementById("heart");
    if (n > slides.length)
}