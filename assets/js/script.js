
//global variables
//const url = `https://api.petfinder.com/v2/types`
const dogapiKey = 'c8cd1d33-b825-4d0b-aeca-b35206aec201';

//string must either be `city, state` or `zipcode`
var userLocation = `houston, texas` //implement grabbing users location

//Button variables
var swipeLeft = document.getElementById("dislikeBtn");
var swipeRight = document.getElementById("likeBtn");
var arrayOfCurrentPets = [];
var currentPet = 0; //id of currently displayed pet INTEGER
var likedPets = [];

//Name and Characteristic variables

function petFinderCall() {
    //object that calls the petfiner api
    var pf = new petfinder.Client({
        apiKey: "8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF", //private api key (required)
        secret: "5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS" //private secret key (required)
    });

    pf.animal.search({ //
        location: userLocation, //city,state or zipcode
        distance: 50, //miles range 1-500
        status: "adoptable",
        type: "dog",
        age: "baby",
        size: "small",
        gender: "male",
    })
        .then(function (response) {
            //response object from api
            arrayOfCurrentPets = response.data.animals;
            //console.log("perfinderCall: ", arrayOfCurrentPets)
            displayAnimalData(response.data.animals[0]) //
        })
        .catch(function (error) {
            // Handle the error
            console.log("PetFinderAPI Error: ", error);
        });
}

function animalHasImage (animalData) {
    var animalHasImage = true;
    if (animalData.photos.length === 0 || animalData.photos.length === null){
        animalHasImage = false;
    }

    return animalHasImage;
}

function displayAnimalData (animalData) {
    //sets elements in the card to current pet
    //console.log("displayAnimalData: ", arrayOfCurrentPets)
    if (animalHasImage(animalData)) {
        currentPet = animalData.id;
        document.getElementById("petName").textContent = `${animalData.name}`;
        document.getElementById("petAge").textContent = `Age: ${animalData.age}`;
        document.getElementById("petPhoto").setAttribute("src", animalData.photos[0].large)
        document.getElementById("petType").textContent = `Species: ${animalData.type}`;
        document.getElementById("petGender").textContent = `Gender: ${animalData.gender}`;
        document.getElementById("petBreed").textContent = `Breed: ${animalData.breeds.primary}`;
        document.getElementById("petSize").textContent = `Size: ${animalData.size}`;
        document.getElementById("petDescription").textContent = `Description: ${animalData.description}`;

        dogApiCall(animalData.breeds);
    }
}

//Button functionality
swipeLeft.addEventListener("click", function() {
    arrayOfCurrentPets.shift();
    displayAnimalData(arrayOfCurrentPets[0]);
});

//Saves pet to local storage
swipeRight.addEventListener("click", function() {
    likedPets.push(currentPet);
    tempArr = JSON.parse(localStorage.getItem("likedPets"));
    if(tempArr != null) { //if there is already items in local storage
        tempArr.push(currentPet)
        localStorage.setItem("likedPets",JSON.stringify(tempArr));
    } else {
        tempArr = [currentPet];
        console.log(tempArr);
        localStorage.setItem("likedPets",JSON.stringify(tempArr));
    }
    arrayOfCurrentPets.shift();
    displayAnimalData(arrayOfCurrentPets[0]);
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
    // var lifeSpan = result[0].life_span;
    // var temperament = result[0].temperament
    var weightStr = result[0].weight.metric;
    weighArr = weightStr.split(" - ");
    var usWeightArr = weighArr.map(Number);
    for(var i = 0;i < usWeightArr.length;i++){
        usWeightArr[i] *= 2.2046;
    }
    // console.log("dogCallApi: ", Math.round(usWeightArr[0]) + '-' + Math.round(usWeightArr[1]));
    usWeightStr = Math.round(usWeightArr[0]) + '-' + Math.round(usWeightArr[1]);
    // var tempStr = [lifeSpan,temperament,usWeightStr].filter(Boolean).join(', ');

    var tempStr = "";
    if (result[0].life_span != null || result[0].life_span != undefined) {
        tempStr += "Life Span: " + result[0].life_span;
    }

    if (result[0].temperament != null || result[0].temperament != undefined) {
        tempStr += "\n" + "Temperament: " + result[0].temperament;
    }

    if (result[0].weight.metric != null || result[0].weight.metric != undefined) {
        tempStr += "\n" + "Weight (pounds): " + usWeightStr;
    }

    document.getElementById("petBreed").setAttribute("data-tooltip",tempStr);
    })
    .catch (function (error) {
        console.log('Unable to connect to the Dog API' + error);
        document.getElementById("petBreed").setAttribute("data-tooltip", "  ")
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
