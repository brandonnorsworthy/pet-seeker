
//global variables
const secret = `5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS`
const apiKey = `8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF`
const url = `https://api.petfinder.com/v2/types`
const dogapiKey = 'c8cd1d33-b825-4d0b-aeca-b35206aec201';

//string must either be `city, state` or `zipcode`
var userLocation = `austin, texas`

//Button variables
var swipeLeft = document.getElementById("dislikeBtn");
var swipeRight = document.getElementById("likeBtn");
var petCard = 0;
var arrayOfCurrentPets = [];
var currentPet = {};
var likedPets = [];

//Name and Characteristic variables

function petFinderCall() {
    var pf = new petfinder.Client({ apiKey: apiKey, secret: secret });
    pf.animal.search({
        location: userLocation,
        distance: 15
    })
        .then(function (response) {
            //response object from api
            // for (let index = 0; index < response.data.animals.length; index++) {
                // console.log(response.data.animals[0]);
                arrayOfCurrentPets = response.data.animals;
                console.log("perfinderCall: ", arrayOfCurrentPets)
                //Appends pet name and age;

                displayAnimalData(response.data.animals[petCard])
        })
        .catch(function (error) {
            // Handle the error
            console.log("PetFinderAPI Error: ", error);
        });
}

function displayAnimalData (animalData) {
    //sets elements in the card to current pet
    console.log("displayAnimalData: ", arrayOfCurrentPets)

    document.getElementById("petName").textContent = `${animalData.name}`;
    document.getElementById("petAge").textContent = `Age: ${animalData.age}`;
    document.getElementById("petPhoto").setAttribute("src",animalData.photos[0].large)
    document.getElementById("petType").textContent = `Species: ${animalData.type}`;
    document.getElementById("petGender").textContent = `Gender: ${animalData.gender}`;
    document.getElementById("petBreed").textContent = `Breed: ${animalData.breeds.primary}`;
    document.getElementById("petSize").textContent = `Size: ${animalData.size}`;
    document.getElementById("petDescription").textContent = `Description: ${animalData.description}`;

    dogApiCall(animalData.breeds);
}

//Button functionality
swipeLeft.addEventListener("click", function() {
    petCard ++;
    arrayOfCurrentPets.shift();
    displayAnimalData(arrayOfCurrentPets[petCard]);
});

//Saves pet to local storage
swipeRight.addEventListener("click", function() {
    likedPets.push(currentPet);
    localStorage.setItem("likedPets",JSON.stringify(likedPets));
    petCard ++;
    arrayOfCurrentPets.shift();
    displayAnimalData(arrayOfCurrentPets[petCard]);
});

//Calls Dog API and provides info on the breed
function dogApiCall(petBreed) {

    var dogApiUrl = `https://api.thedogapi.com/v1/breeds/search?q=${petBreed.primary}`;
    fetch(dogApiUrl,{
    headers: {
        'X-Api-Key': 'c8cd1d33-b825-4d0b-aeca-b35206aec201'
    }
    })
    .then(response => response.json())
    .then(result => {
    // console.log("dogCallApi: ", 'Success:', result);
    // console.log("dogCallApi: ", result[0].life_span);
    // console.log("dogCallApi: ", result[0].temperament);
    // console.log("dogCallApi: ", result[0].weight.metric);
    var weightStr = result[0].weight.metric;
    weighArr = weightStr.split(" - ");
    console.log("dogCallApi: ", weighArr);
    var usWeightArr = weighArr.map(Number);
    for(var i = 0;i < usWeightArr.length;i++){
        usWeightArr[i] *= 2.2046;
    }
    // console.log("dogCallApi: ", Math.round(usWeightArr[0]) + '-' + Math.round(usWeightArr[1]));
    usWeightStr = Math.round(usWeightArr[0]) + '-' + Math.round(usWeightArr[1]);
    // var tempStr = 
    // if (result[0].life_span != null || result[0].life_span != undefined)

    // [address, city, state, zip].filter(Boolean).join(', ');

    document.getElementById("petBreed").setAttribute("data-tooltip","Life Span: " + result[0].life_span + "\n" + "Weight (pounds): " + usWeightStr + "\n" + "Temperament: " + result[0].temperament);    
    })
    

    .catch (function (error) {
        alert('Unable to connect to the Dog API' + error);
    })
}

// petFinderCall()
//sets up js file when page loads put events and calls in here
function init() {
    petFinderCall()
}


//Swipe animation
function slideShow(n) {
    var slides = document.getElementById("hero-image");
    var swipeLeft = document.getElementById("dislike");
    var swipeRight = document.getElementById("heart");
    // if (n > slides.length)
}
//test
init() //calls when page starts up leave at bottom
