//! API PRESETS
const dogAPIkey = 'c8cd1d33-b825-4d0b-aeca-b35206aec201';
const petFinderAPIKey = 'RcXYh4mDw2b7Y8vdtikNqfAq4DnlTjpFXttwGIxMBSGQWBJBNx';
const petFinderSecret = '4zBV99JLvPpoicS8Efy8Bb6TFvDumlTyMylQ4z56';

//! HTML ELEMENTS
var dislikeBtnEl = document.getElementById('dislikeBtn');
var likeBtnEl = document.getElementById('likeBtn');
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
    document.getElementById('showModal').addEventListener('click', function(){
        console.log('showing modal');
        document.getElementById('settingsModal').classList.add('is-active');
    })
    document.getElementById('hideModalCancelBtn').addEventListener('click', hideSettingsModal)
    document.getElementById('hideModalDeleteBtn').addEventListener('click', hideSettingsModal)
    document.getElementById('pastLikesDiv').addEventListener('click', deletePastLikeElement)

    //CALL ANIMAL IDS THAT WERE SAVED FROM LOCAL STORAGE
    showLikedPets();
}

function hideSettingsModal() {
    console.log('hide modal');
    document.getElementById('settingsModal').classList.remove('is-active');
}

function updateApiCallAmount() {
    timesApiIsCalled += 1;
    console.log('updateApiCallAmount', timesApiIsCalled);
}

function petFinderCall() {
    updateApiCallAmount(); //show amount of times called

    petFinderClient.animal.search({
        //presets do not change
        status: 'adoptable', //preset to only show adoptable pets
        type: 'dog', //preset to only show dogs so works with dogAPI
        limit: animalArrayLength,
        //variables
        location: document.getElementById('user-city').value.trim(),
        distance: userRange, //miles range 1-500 default:100
        before: displayPetsBeforeDate(),
        age: document.getElementById('user-age').value,
        size: document.getElementById('user-size').value,
        gender: getGenderCheckboxValues(),
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

function getAgeCheckboxValues() {
    var userSelectedAges = '';



    return userSelectedAges;
}

//Returns string to give to petfinder api for selected gender based on checkboxes
function getGenderCheckboxValues() {
    var genderMaleEl = document.getElementById('user-gender-male');
    var genderFemaleEl = document.getElementById('user-gender-female');
    var userSelectedGenders = ''; //initialize string

    if (genderMaleEl.checked) { //if male is checked add to string
        userSelectedGenders = 'male';
    }

    if (genderFemaleEl.checked && userSelectedGenders.length > 0){ //if female is checked and user selected male add comma
        userSelectedGenders += ',female';
    } else if (genderFemaleEl.checked) { //if only selected female
        userSelectedGenders = 'female';
    }

    if (userSelectedGenders.length === 0) {  //if nothing was checked default to both
        userSelectedGenders = 'male,female';
    }

    return userSelectedGenders;
}

//sets elements in the card to current pet data
function displayAnimalData (animalData) {
    if (animalHasImage(animalData)) { //look and see if the animal has a image on file
        currentPetId = animalData.id; //assignes current pet id to global for local storage if favorited
        document.getElementById('petName').textContent = `${animalData.name}`;
        document.getElementById('petGender').textContent = `${animalData.gender.toLowerCase()}`;
        document.getElementById('petBreed').textContent = `${animalData.breeds.primary}`;
        document.getElementById('petPhoto').setAttribute('src', animalData.photos[0].large)
        document.getElementById('petAge').textContent = `Age: ${animalData.age}`;
        document.getElementById('petSize').textContent = `Size: ${animalData.size}`;

        //Handles null description by
        if (animalData.description !== null) {
            document.getElementById('petDescription').textContent = `${animalData.description}`;
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
    var petBreedToolTipEl = document.getElementById('petBreed');

    if (petBreed.primary !== null) {
        fetch(`https://api.thedogapi.com/v1/breeds/search?q=${petBreed.primary}`, {
        headers: {
            'x-api-key': 'c8cd1d33-b825-4d0b-aeca-b35206aec201'
        }})
        .then(response => response.json())
        .then(result => {
            var weightStr = result[0].weight.metric;
            var weighArr = weightStr.split(' - ');
            var usWeightArr = weighArr.map(Number);
            var usWeightStr = Math.round(usWeightArr[0]) + '-' + Math.round(usWeightArr[1]);
            var tempStr = '';

            for(var i = 0;i < usWeightArr.length;i++){
                usWeightArr[i] *= 2.2046;
            }

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
            delete petBreedToolTipEl.dataset.tooltip;
        })
    }
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

function updatePastLikes(animalObject) {
    var pastLikeEl = $(`
    <div class="columns m-0">
        <a class="column is-11 my-3 p-0 past-likes is-align-items-center" href="${animalObject.url}" target="_blank">
            <figure class="image past-liked-photo">
                <img class="is-64x64" src="${animalObject.image}">
            </figure>
            <span><strong>${animalObject.name}</strong>
            <br>${animalObject.description}</span>
        </a>
        <div class="column is-1 p-0 is-flex is-align-items-center is-justify-content-center content">
            <span class="material-icons delete-button" id="deleteButton">
                remove
            </span>
        </div>
    </div>
    `)
    $('#pastLikesDiv').prepend(pastLikeEl);

    return;
}

//############################### Events #################################

function dislikeCurrentPet() {
    descriptionEl.textContent = ``; //Resets pet description
    displayNextAnimal();

    return;
}

function likeCurrentPet() {
    var pastLikesDivEl = document.getElementById('pastLikesDiv');
    var tempArr = JSON.parse(localStorage.getItem('likedPets'));
    descriptionEl.textContent = ``; //Resets pet description

    if (arrayOfPetsInQueue[0].description === null) { //if the animal doesnt have a description
        var tempDescriptionStr = arrayOfPetsInQueue[0].breeds.primary;
    } else {
        var tempDescriptionStr = arrayOfPetsInQueue[0].description.slice(0, 30);
    }

    var tempObject = { //build the object to put in the storage array
        name: arrayOfPetsInQueue[0].name,
        image: arrayOfPetsInQueue[0].photos[0].medium,
        url: arrayOfPetsInQueue[0].url,
        description: tempDescriptionStr,
    }

    if(tempArr != null) { //if there is already items in local storage
        if (tempArr.length >= maxPastLikes) { //cap at maxPastLikes and start overwriting
            tempArr.shift(); //take out the item at the beginning to take length down by one to make room for new one
            pastLikesDivEl.children[pastLikesDivEl.children.length - 1].remove()
        }
        tempArr.push(tempObject) //add current pet onto the end of exsisting array
        localStorage.setItem('likedPets',JSON.stringify(tempArr));
    } else { //if nothing is already in storage set array to just current petid
        tempArr = [tempObject];
        localStorage.setItem('likedPets',JSON.stringify(tempArr));
    }
    updatePastLikes(tempObject);
    displayNextAnimal();

    return;
}

//Add past likes from local storage to Past Likes tab
//On init, look at local storage, loop over all IDs saved, call get animal by ID one at a time and give id(inside this function, create these things to display)
function showLikedPets() {
    var likedAnimalsArr = JSON.parse(localStorage.getItem('likedPets'));
    if (likedAnimalsArr !== null) { //error handling of empty localstorage no likes
        for (var i = likedAnimalsArr.length - 1; i >= 0; i--) {
            updatePastLikes(likedAnimalsArr[i])
        }
    }

    return;
}

function deletePastLikeElement(event) {
    if (event.target.id === 'deleteButton') {
        likedAnimalsArr = JSON.parse(localStorage.getItem('likedPets'));
        var animalName = event.target.parentElement.parentElement.children[0].children[1].children[0].textContent;
        var savedIndex = 0;

        for (let index = 0; index < likedAnimalsArr.length; index++) {
            if (likedAnimalsArr[index].name === animalName) {
                savedIndex = index;
                break;
            }
        }
        likedAnimalsArr.splice(savedIndex, 1);
        localStorage.setItem('likedPets',JSON.stringify(likedAnimalsArr));
        event.target.parentElement.parentElement.remove();
    }
}

//Search button event listener
//If you hit submit button, clear out array first and then do petfinder call
searchBtnEl.onclick = function() {
    //Clears array each time the Submit button is clicked by user so that we aren't getting previous searches
    hideSettingsModal();
    arrayOfPetsInQueue = [];
    petFinderCall();

    return;
}

init() //calls when page starts up leave at bottom