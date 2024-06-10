/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

//show email
var shown = false
function showhideEmail() {
    if (shown) {
        document.getElementById('email').innerHTML = "Show my email";
        shown = false;
    }else {
        var myemail = "<a href='mailto:hillarbp" + "@" + "mail.uc.edu'>hillarbp" + "@" + "mail.uc.edu</a>";
        document.getElementById('email').innerHTML = myemail;
        shown = true;
    }
}

//Analog Clock Code
var canvas = document.getElementById("analog-clock");
var ctx = canvas?.getContext("2d");
var radius = canvas?.height / 2;
ctx?.translate(radius, radius);
radius = radius * 0.90
if(radius){
setInterval(drawClock, 1000);
}

function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
}

//JS Time Display
function displayTime() {
    if(document.getElementById('digit-clock'))
    document.getElementById('digit-clock').innerHTML = "Current time: " + new Date();
}
setInterval(displayTime, 500);

//Joke API integration
function joke_call() {
    $.get("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist,explicit&type=single", function(result) {
        console.log("From jokeAPI: " + JSON.stringify(result));
        console.log(result.joke.length)
        if(JSON.stringify(result).length == 0 || result.joke.length == 0){ return};
        $("#joke_response").html(encodeInput(result.joke));
    })
}
joke_call();
setInterval(joke_call, 60000);
//Pokemon Sprite call
async function getPokemon() {
    rand_poke = Math.floor(Math.random() * 1025);
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/"+rand_poke);
    const result = await response.json();
    if(result.length == 0) return;
    if(result.sprites.other.showdown.front_default){
        $("#poke_response").attr("src", encodeInput(result.sprites.other.showdown.front_default));
    }else if(result.sprites.front_default){
        $("#poke_response").attr("src", encodeInput(result.sprites.front_default));
    }
}
getPokemon();
setInterval(getPokemon, 10000);

function encodeInput (input) {
    const encoded = document.createElement('div');
    encoded.innerText = input;
    return encoded.innerHTML;
}