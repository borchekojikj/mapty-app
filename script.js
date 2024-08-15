'use strict';


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Planning STEP
// 1. User stories - Description of the application's functionality from the user's perspective
// 2. Features
// 3. Flowchart, WHAT will we build
// 4. Architecture, HOW we will build it


// Development STEP



// 1. User Stories for Mapty

// Commot format: As a [type of user](who), i want [an action](what) so that [a benefit](why)

// - As a "user", i want to "log my running workouts with location, distance, time, pace and steps/min", so i can "keep a log of all my running".
// - As a "user", i want to "log my cycling workouts with location, distance, time, speed and elevation gain", so that i can keet a "log of my cycling".
// - As a "user", i want to "see all my workouts at a glance", so that i can easly "trach my progress over time".
// - As a "user", i want to "also see my workouts on a map", so that i can "easily check where i work out the most".
// - As a "user", i want to "see all my workouts when i leace the app and come back later", so that i can "keep using the app over time".

// 2. Features

// - Map where user clicks to add new workout
// - Geolocation to display map at current location
// - Form to input distance, time, pace, steps/minute
// - Form to input distance, time, pace, elevation gain
// - Display all workouts in a list
// - Display all workouts on the map
// - Store workout data in the browser using local storage API
// - On page laod, read the saved data form local storage and dispaly

// 3. Flowchart

// - Page loads ---> 
// 1. Get current location coordinates ---> 
// 2. Render map on current location ---> User clicks on map --->
// 3. / 4. Render workout form  running / cycling

//______________________________ ---> 5. Render workout on map
// User submits new workout  
//______________________________  ---> 6. Render workout on list 


// 4. Architecture


// Geolocation API
let map, mapEvent;
const workouts = [];

class App {
    #map;
    #mapEvent;
    #workouts = [];
    #zoomLvl = 13;
    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleEvelationField.bind(this));
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this)
                , function () {
                    alert('Could not get you positon!');
                });
        };

    }

    _loadMap(positon) {
        const { latitude } = positon.coords;
        const { longitude } = positon.coords;
        // console.log(`https://www.google.com/maps/@${latitude},${longitude}z`);
        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, this.#zoomLvl);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        // Handling clicks on map
        this.#map.on('click', this._showForm.bind(this));

    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _hideForm() {
        // Empty Inputs
        inputDistance.value = inputCadence.value = inputElevation.value = inputDuration.value = '';
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => form.style.display = 'grid', 1000);

    }
    _toggleEvelationField() {

        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');

    }

    _newWorkout(e) {
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);
        e.preventDefault();
        let workout;

        // Get Data from form
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);

        const { lat, lng } = this.#mapEvent.latlng;

        // console.log(lat, lng);

        // If workout running, create running object
        if (type === 'running') {
            const cadence = Number(inputCadence.value);

            // Check if data is valid
            // if (
            //     !Number.isFinite(distance) ||
            //     !Number.isFinite(duration) ||
            //     !Number.isFinite(cadence)
            // )
            //     return alert('Inputs have to be positive numbers!');
            // Check if data is valid

            if (
                !validInputs(distance, duration, cadence) ||
                !allPositive(distance, distance, cadence)
            ) {
                return alert('Inputs have to be positive numbers!');
            }

            workout = new Running([lat, lng], distance, duration, cadence);

        }
        // If workout cycliin, create cyclung object
        if (type === 'cycling') {
            const elevationGain = Number(inputElevation.value);

            // Check if data is valid
            if (
                !validInputs(distance, duration, elevationGain) ||
                !allPositive(distance, distance)
            ) {
                return alert('Inputs have to be positive numbers!');
            }


            workout = new Cycling([lat, lng], distance, duration, elevationGain);
        };

        // Add new object to wrokout array
        this.#workouts.push(workout);


        // Render workout list
        this._renderWorkout(workout);


        // Hide from + clear input fields
        this._hideForm();

        // Render workout on map as marker
        // console.log(workout);
        this._renderWorkoutMarker(workout);

        // Clear value

        // console.log(this.#mapEvent);






    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`
            })).setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
            .openPopup();
    }

    _renderWorkout(workout) {
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div >
    <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
    </div>
    `;
        if (workout.type === 'running') {
            html += `
                <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span >
                <span class="workout__unit">min/km</span>
          </div >
                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">spm</span>
                </div>
        </li >
                `;
        };
        if (workout.type === 'cycling') {
            html += `
         <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
                `;
        };


        form.insertAdjacentHTML('afterend', html);;
    }

    _moveToPopup(e) {

        // console.log(this.#workouts);
        const workoutEl = e.target.closest('.workout');

        if (!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);


        this.#map.setView(workout.coords, this.#zoomLvl, {
            animate: true,
            pan: {
                duration: 1,
            }
        });

        // using the public interface

        workout._click();
    }

}
class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    clicks = 0;
    constructor(coords, distance, duration) {
        // this.date = ...
        // this.id = ...
        this.coords = coords; // [lat,lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }
    _setDescription() {
        // prettier-ignore
        // console.log(this.type.toUpperCase());
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} un ${months[this.date.getMonth()]} ${this.date.getDate()} `;

    }
    _click() {
        this.clicks++;
    }
};


class Running extends Workout {
    type = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
};

class Cycling extends Workout {
    type = 'cycling';
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.cadence = elevationGain;
        this.caclSpeed();
        this._setDescription();
    }


    caclSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
};

const app = new App();



// const run1 = new Running([39, -12], 5.2, 24, 187);
// const cuc1 = new Cycling([39, -12], 27, 95, 523);

// console.log(run1, cuc1);
// https://www.google.com/maps/@42.0088748,21.3918047,15z?entry=ttu


