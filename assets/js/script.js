//! API PRESETS
const dogAPIkey = 'c8cd1d33-b825-4d0b-aeca-b35206aec201';
const petFinderAPIKey = '8iY0rDCqC9P4DVIu9eTVbZY5cUJW1QoDmuRxes5N6FQi72MxhF';
const petFinderSecret = '5FxTpncHn5lzFXtfQykl1xpBtDX1O3q6QC8KWhrS';

//! HTML ELEMENTS
var dislikeBtnEl = document.getElementById('dislikeBtn');
var likeBtnEl = document.getElementById('likeBtn');
var preferenceDivEl = document.getElementById('preferenceDiv');
var pastLikesDivEl = document.getElementById('pastLikesDiv');
var pasLikesBtnEl = document.getElementById('past-likes-button');
var preferencesBtnEl = document.getElementById('preferences-button');
var cityFormEl = document.getElementById('user-city');
var ageEl = document.getElementById('user-age');
var sizeEl = document.getElementById('user-size');
var genderMaleEl = document.getElementById('user-gender-male');
var genderFemaleEl = document.getElementById('user-gender-female');
var searchBtnEl = document.getElementById('searchButton');
var descriptionEl = document.getElementById('petDescription');

//! GLOBAL VARIABLES
const maxPastLikes = 10; //max amount of likes saved and displayed on past likes tab &&keep low because each save is a single api request
const animalArrayLength = 40; //amount the api gets per call and the ideal length the pet array should float around

var arrayOfPetsInQueue = []; //array of pets to go through deletes index 0 everytime it goes to next pet
var currentPetId = 0; //id of currently displayed pet INTEGER
var userRange = 50; //miles range 1-500 default:100 (gets bigger if no animals are found in area)
var petFinderClient = new petfinder.Client({ //petfinder api object (called in 2 places so up here)
    apiKey: petFinderAPIKey, //private api key (required)
    secret: petFinderSecret //private secret key (required)
});

//!TEMP VARIABLES
var timesApiIsCalled = 0;

//sets up js file when page loads put events and calls in here
function init() {
    //SETUP HTML ELEMENT EVENTS
    dislikeBtnEl.addEventListener('click', dislikeCurrentPet);
    likeBtnEl.addEventListener('click', likeCurrentPet);

    //CALL ANIMAL IDS THAT WERE SAVED FROM LOCAL STORAGE
    showLikedPets();
}

function updateApiCallAmount() {
    timesApiIsCalled += 1;
    console.log('updateApiCallAmount', timesApiIsCalled);
}

function petFinderCall() {
    updateApiCallAmount(); //show amount of times called
    var userLocation = cityFormEl.value.trim();
    var userAge = ageEl.value;
    var userSize = sizeEl.value;
    var userSelectedGender = getGenderCheckboxValues();

    petFinderClient.animal.search({
        //presets do not change
        status: 'adoptable', //preset to only show adoptable pets
        type: 'dog', //preset to only show dogs so works with dogAPI
        limit: animalArrayLength,
        //variables
        location: userLocation,
        distance: userRange, //miles range 1-500 default:100
        before: displayPetsBeforeDate(),
        age: userAge,
        size: userSize,
        gender: userSelectedGender,
    })
        .then(function (response) { //response object from api
            if (response.data.animals.length < animalArrayLength && userRange < 500) {
                userRange += 50; //if animals are starting to run out then start to increase the range
                petFinderCall();
            }
            arrayOfPetsInQueue = arrayOfPetsInQueue.concat(response.data.animals);
            displayAnimalData(arrayOfPetsInQueue[0]); //display first animal in queue
        })
        .catch(function (error) { //catches errors and prints it to console
            console.log('PetFinderAPI Error: ', error);
        });

    return;
}

//Returns string to give to petfinder api for selected gender based on checkboxes
function getGenderCheckboxValues() {
    var userSelectedGender = ''; //initialize string

    if (genderMaleEl.checked) { //if male is checked add to string
        userSelectedGender = 'male';
    }

    if (genderFemaleEl.checked && userSelectedGender.length > 0){ //if female is checked and user selected male add comma
        userSelectedGender += ',female';
    } else if (genderFemaleEl.checked) { //if only selected female
        userSelectedGender = 'female';
    }

    if (userSelectedGender.length === 0) {  //if nothing was checked default to both
        userSelectedGender = 'male,female';
    }

    return userSelectedGender;
}

//sets elements in the card to current pet data
function displayAnimalData (animalData) {
    if (animalHasImage(animalData)) { //look and see if the animal has a image on file
        currentPetId = animalData.id; //assignes current pet id to global for local storage if favorited
        document.getElementById('petName').textContent = `${animalData.name}`;
        document.getElementById('petAge').textContent = `Age: ${animalData.age}`;
        document.getElementById('petPhoto').setAttribute('src', animalData.photos[0].large)
        document.getElementById('petType').textContent = `Species: ${animalData.type}`;
        document.getElementById('petGender').textContent = `Gender: ${animalData.gender}`;
        document.getElementById('petBreed').textContent = `Breed: ${animalData.breeds.primary}`;
        document.getElementById('petSize').textContent = `Size: ${animalData.size}`;

        //Handles null description by
        if (animalData.description !== null) {
            document.getElementById('petDescription').textContent = `Description: ${animalData.description}`;
        };

        dogApiCall(animalData.breeds);
    } else {
        displayNextAnimal(); //if there is no image on file just skip this animal
    }

    return;
}

//looks to see if a image is inside the animal data object
function animalHasImage (animalData) {
    var animalHasImage = true; //default to true to return
    if (animalData.photos == undefined || animalData.photos === null) { //test if undefined first so no errors
        animalHasImage = false;
    } else if (animalData.photos.length === 0){ //if array is just empty still no photos so return false
        animalHasImage = false;
    }

    return animalHasImage;
}

//deletes the index 0 pet and then just displays the new animal at index 0
function displayNextAnimal() {
    if (arrayOfPetsInQueue.length == animalArrayLength / 2) { //if we are under half of what we should have get more pets
        petFinderCall()
    }
    arrayOfPetsInQueue.shift(); //removed index 0
    displayAnimalData(arrayOfPetsInQueue[0]);

    return;
}

//Calls Dog API and provides info on the breed
function dogApiCall(petBreed) {
    if (petBreed.primary === null) {
        fetch(`https://api.thedogapi.com/v1/breeds/search?q=${petBreed.primary}`, {
        headers: {
            'X-Api-Key': 'c8cd1d33-b825-4d0b-aeca-b35206aec201'
        }})
        .then(response => response.json())
        .then(result => {
            // var lifeSpan = result[0].life_span;
            // var temperament = result[0].temperament
            var weightStr = result[0].weight.metric;
            weighArr = weightStr.split(' - ');
            var usWeightArr = weighArr.map(Number);
            for(var i = 0;i < usWeightArr.length;i++){
                usWeightArr[i] *= 2.2046;
            }
            usWeightStr = Math.round(usWeightArr[0]) + '-' + Math.round(usWeightArr[1]);
            // var tempStr = [lifeSpan,temperament,usWeightStr].filter(Boolean).join(', ');

            var tempStr = '';
            if (result[0].life_span != null || result[0].life_span != undefined) {
                tempStr += 'Life Span: ' + result[0].life_span;
            }

            if (result[0].temperament != null || result[0].temperament != undefined) {
                tempStr += '\n' + 'Temperament: ' + result[0].temperament;
            }

            if (result[0].weight.metric != null || result[0].weight.metric != undefined) {
                tempStr += '\n' + 'Weight (pounds): ' + usWeightStr;
            }

            petBreedToolTipEl.setAttribute('data-tooltip', tempStr);
        })
        .catch (function (error) {
            console.log('Unable to connect to the Dog API' + error);
            delete petBreedToolTipEl.dataset.tooltip
        })
    }

    return;
}

function displayPetsBeforeDate() {
    var date = 0;
    if (arrayOfPetsInQueue === null || arrayOfPetsInQueue.length === 0){
        date = moment().toISOString();
    } else {
        date = arrayOfPetsInQueue[arrayOfPetsInQueue.length - 1].published_at;
    }

    return date; //Must be a valid ISO8601 date-time string (e.g. 2019-10-07T19:13:01+00:00)
}

function displayAnimalById(animalId) {
    updateApiCallAmount(); //show amount of times called

    petFinderClient.animal.show(animalId)
    .then(function (response) {
        if (response.data.animal.description === null) {
            var tempDescriptionStr = response.data.animal.breeds.primary;
        } else {
            var tempDescriptionStr = response.data.animal.description.slice(0, 30);
        }
        var pastLikeEl = $(`
        <a class="past-likes" href="${response.data.animal.url}" target="_blank">
            <figure class="image is-48x48 past-liked-photo">
                <img class="is-48x48" src="${response.data.animal.photos[0].medium}">
            </figure>
            <span><strong>${response.data.animal.name}</strong>
            <br>${tempDescriptionStr}</span>
        </a>
        `)
        $('#pastLikesDiv').prepend(pastLikeEl);
    });

    return;
}

//############################### Events #################################

function dislikeCurrentPet() {
    descriptionEl.textContent = ``; //Resets pet description
    displayNextAnimal();

    return;
}

function likeCurrentPet() {
    descriptionEl.textContent = ``; //Resets pet description
    tempArr = JSON.parse(localStorage.getItem('likedPets'));
    if(tempArr != null) { //if there is already items in local storage
        if (tempArr.length >= maxPastLikes) {
            tempArr.shift(); //take out the item at the beginning to take length down by one to make room for new one
            pastLikesDivEl.children[pastLikesDivEl.children.length - 1].remove()
        }
        tempArr.push(currentPetId) //add current pet onto the end of exsisting array
        localStorage.setItem('likedPets',JSON.stringify(tempArr));
    } else { //if nothing is already in storage set array to just current petid
        tempArr = [currentPetId];
        localStorage.setItem('likedPets',JSON.stringify(tempArr));
    }
    displayAnimalById(currentPetId);
    displayNextAnimal();

    return;
}

//Click event to switch between Preferences and Past Likes tabs
pasLikesBtnEl.onclick = function() {
    preferenceDivEl.style.display = 'none';
    pastLikesDivEl.style.display = 'block';

    return;
}

preferencesBtnEl.onclick = function() {
    pastLikesDivEl.style.display = 'none';
    preferenceDivEl.style.display = 'block';

    return;
}

//Add past likes from local storage to Past Likes tab
//On init, look at local storage, loop over all IDs saved, call get animal by ID one at a time and give id(inside this function, create these things to display)
function showLikedPets() {
    likedAnimalsArr = JSON.parse(localStorage.getItem('likedPets'));
    //console.log(likedAnimalsArr);
    if (likedAnimalsArr !== null) { //error handling of empty localstorage no likes
        for (var i = likedAnimalsArr.length - 1; i >= 0; i--) {
            displayAnimalById(likedAnimalsArr[i])
        }
    }

    return;
}

//Search button event listener
//If you hit submit button, clear out array first and then do petfinder call
searchBtnEl.onclick = function() {
    //Clears array each time the Submit button is clicked by user so that we aren't getting previous searches
    arrayOfPetsInQueue = [];
    petFinderCall();

    return;
}

init() //calls when page starts up leave at bottom