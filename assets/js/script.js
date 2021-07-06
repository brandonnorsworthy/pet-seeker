
//global variables
const secret = `5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS`
const apiKey = `8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF`
const url = `https://api.petfinder.com/v2/types`
const dogapiKey = 'c8cd1d33-b825-4d0b-aeca-b35206aec201';

//string must either be `city, state` or `zipcode`
var userLocation = `austin, texas`

//Button variables
var swipeLeft = document.getElementById("x");
var swipeRight = document.getElementById("heart");
var petCard = 0;
var currentPet = {};
var likedPets = [];
console.log(swipeLeft);

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
                currentPet = response.data.animals[petCard];
                //Appends pet name and age
                petName.textContent = `${response.data.animals[petCard].name}`;
                petAge.textContent = `Age: ${response.data.animals[petCard].age}`;
                nameAndAge.append(petName);
                nameAndAge.append(petAge);

                //Appends secondary pet characteristics
                petType.textContent = `Species: ${response.data.animals[petCard].type}`;
                petGender.textContent = `Gender: ${response.data.animals[petCard].gender}`;
                petBreed.textContent = `Breed: ${response.data.animals[petCard].breeds}`;
                petSize.textContent = `Size: ${response.data.animals[petCard].size}`;
                petDescription.textContent = `Description: ${response.data.animals[petCard].description}`;
                petCharacteristics.append(petType);
                petCharacteristics.append(petGender);
                petCharacteristics.append(petBreed);
                petCharacteristics.append(petSize);
                petCharacteristics.append(petDescription);
                console.log(response.data.animals[petCard].breeds)
                dogApiCall(response.data.animals[petCard].breeds);
        })
        .catch(function (error) {
            // Handle the error
            console.log(error);
        });
}

//Swipe animations
swipeLeft.onclick = function() {
    petCard ++;
    petfinderCall();
};

//Saves pet to local storage
swipeRight.onclick = function() {
    likedPets.push(currentPet);
    localStorage.setItem("likedPets",JSON.stringify(likedPets));
    petCard ++;
    petfinderCall();
};

//if petCard = 21,
//show that they are out of matches
//else
//display petCard

//Calls Dog API and provides info on the breed
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
    console.log(result[0].life_span);
    console.log(result[0].temperament);
    console.log(result[0].weight.metric);
    var weightStr = result[0].weight.metric;
    weighArr = weightStr.split(" - ");
    console.log(weighArr);
    var usWeightArr = weighArr.map(Number);
    for(var i = 0;i < usWeightArr.length;i++){
        usWeightArr[i] *= 2.2046;
    }
    console.log(Math.round(usWeightArr[0]) + '-' + Math.round(usWeightArr[1]));
    })
    

    .catch (function (error) {
        alert('Unable to connect to the Dog API' + error);
    })
}

// petfinderCall()
//sets up js file when page loads put events and calls in here
function init() {
    petfinderCall()
}

init() //calls when page starts up leave at bottom
