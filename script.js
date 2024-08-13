'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
// 3. / 4. Render wokrout form  running / cycling

//______________________________ ---> 5. Render workout on map
// User submits new workout  
//______________________________  ---> 6. Render workout on list 


// 4. Architecture