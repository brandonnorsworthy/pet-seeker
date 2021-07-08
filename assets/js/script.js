//! API PRESETS
const dogAPIkey = 'c8cd1d33-b825-4d0b-aeca-b35206aec201';
const petFinderAPIKey = '8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF';
const petFinderSecret = '5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS';

//! HTML ELEMENTS
var dislikeBtnEl = document.getElementById("dislikeBtn");
var likeBtnEl = document.getElementById("likeBtn");

//! GLOBAL VARIABLES
var arrayOfPetsInQueue = []; //array of pets to go through deletes index 0 everytime it goes to next pet
var currentPetId = 0; //id of currently displayed pet INTEGER

//! TEMPORARY PRESETS
var userLocation = `houston, texas`; //implement grabbing users location

//sets up js file when page loads put events and calls in here
function init() {
    //SETUP HTML ELEMENT EVENTS
    dislikeBtnEl.addEventListener("click", dislikeCurrentPet);
    likeBtnEl.addEventListener("click", likeCurrentPet);

    //CALL INITIAL FUNCTIONS
    petFinderCall(); //call upon start to load up on api data
}

function petFinderCall() {
    //object that calls the petfiner api
    var pf = new petfinder.Client({
        apiKey: petFinderAPIKey, //private api key (required)
        secret: petFinderSecret //private secret key (required)
    });

    pf.animal.search({ //
        //distance: 50, //miles range 1-500 default:100
        status: "adoptable", //preset to only show adoptable pets
        type: "dog", //preset to only show dogs so works with dogAPI
        //TODO CONNECT PREFERENCE VALUES TO THESE SETTINGS
        location: userLocation,
        /* age: "baby",
        size: "small",
        gender: "male", */
    })
        .then(function (response) { //response object from api
            arrayOfPetsInQueue = arrayOfPetsInQueue.concat(response.data.animals);
            displayAnimalData(arrayOfPetsInQueue[0]); //display first animal in queue
        })
        .catch(function (error) { //catches errors and prints it to console
            alert("PetFinderAPI Error: ", error);
        });

    return;
}

//sets elements in the card to current pet data
function displayAnimalData (animalData) {
    if (animalHasImage(animalData)) { //look and see if the animal has a image on file
        currentPetId = animalData.id; //assignes current pet id to global for local storage if favorited
        document.getElementById("petName").textContent = `${animalData.name}`;
        document.getElementById("petAge").textContent = `Age: ${animalData.age}`;
        document.getElementById("petPhoto").setAttribute("src", animalData.photos[0].large)
        document.getElementById("petType").textContent = `Species: ${animalData.type}`;
        document.getElementById("petGender").textContent = `Gender: ${animalData.gender}`;
        document.getElementById("petBreed").textContent = `Breed: ${animalData.breeds.primary}`;
        document.getElementById("petSize").textContent = `Size: ${animalData.size}`;
        document.getElementById("petDescription").textContent = `Description: ${animalData.description}`;

        dogApiCall(animalData.breeds);
    } else {
        displayNextAnimal(); //if there is no image on file just skip this animal
    }
}

//looks to see if a image is inside the animal data object
function animalHasImage (animalData) {
    var animalHasImage = true; //default to true to return
    if (animalData.photos == undefined || animalData.photos === null) {
        animalHasImage = false;
    } else if (animalData.photos.length === 0){
        animalHasImage = false;
    }

    return animalHasImage;
}

function displayNextAnimal() {
    arrayOfPetsInQueue.shift();
    displayAnimalData(arrayOfPetsInQueue[0]);
}

//Calls Dog API and provides info on the breed
function dogApiCall(petBreed) {
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${petBreed.primary}`,{
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

//############################### Events #################################
function dislikeCurrentPet() {
    displayNextAnimal();
}

function likeCurrentPet() {
    tempArr = JSON.parse(localStorage.getItem("likedPets"));
    if(tempArr != null) { //if there is already items in local storage
        tempArr.push(currentPetId)
        localStorage.setItem("likedPets",JSON.stringify(tempArr));
    } else {
        tempArr = [currentPetId];
        console.log(tempArr);
        localStorage.setItem("likedPets",JSON.stringify(tempArr));
    }
    displayNextAnimal();
}

init() //calls when page starts up leave at bottom
