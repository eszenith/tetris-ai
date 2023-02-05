"use strict";
//constants  ={a :-0.4,b:70,c:-0.8,d:-0.2}

let generations = [];
let populationSize = 12;
let scoreOfGenk = [];
let currentGen = 0;
let currentValues = -1;
let gaInterval;
let checkGameOverInterval;
let gameTime = 120000;
let gameInterval ;
const genInfoEl = document.querySelector(".genInfo");

function setConstantValues(constantGen) {
    constants.a = constantGen.a;
    constants.b = constantGen.b;
    constants.c = constantGen.c;
    constants.d = constantGen.d;
}

//creates a generation k for which scores are calculated
function createGenerationk() {
    let generationk = [];
    if (generations.length === 0) {
        for (let i = 0; i < populationSize; i++) {
            let constantsGenk = {
                a: Math.random() - 0.5,
                b: Math.random() - 0.5,
                c: Math.random() - 0.5,
                d: Math.random() - 0.5,
                score: 0,
            }
            generationk.push(constantsGenk);
        }
        generations.push(generationk);
        return;
    }
    //selection using sorting
    generations[currentGen] = generations[currentGen ].sort((a, b) => b.score - a.score);

    generations.push(crossover());
    currentGen++;
}

function crossover() {
    let genk = []
    let keys = ["a", "b", "c", "d"];
    let mutationProb = 0.05;
    let mutationRate = 0.2;

    for (let i = 0; i < populationSize/2; i++) {

        let constantsChild1 = {
            a: -999,
            b: -999,
            c: -999,
            d: -999,
            score: 0,
        }
        let constantsChild2 = {
            a: -999,
            b: -999,
            c: -999,
            d: -999,
            score: 0,
        }

        //select one of top 6 parents
        let parent1 = generations[currentGen][Math.floor(Math.random() * 6)];
        let parent2 = generations[currentGen][Math.floor(Math.random() * 6)];
        while (parent1 === parent2) {
            parent2 = generations[currentGen][Math.floor(Math.random() * 6)];
        }

        /*//choose parents at random
        if (Math.floor(Math.random() * 2)) {
            parent1 = generations[currentGen][i];
            parent2 = generations[currentGen][i + 1];
        }*/


        let selectedGene1 = Math.floor(Math.random() * 4);
        let selectedGene2 = Math.floor(Math.random() * 4);
        while (selectedGene1 === selectedGene2) {
            selectedGene2 = Math.floor(Math.random() * 4);
        }
        for (let j = 0; j < keys.length; j++) {
            if (j === selectedGene1 || j === selectedGene2) {
                constantsChild1[keys[j]] = parent1[keys[j]];
                constantsChild2[keys[j]] = parent2[keys[j]];
            }
            else{
                constantsChild1[keys[j]] = parent2[keys[j]];
                constantsChild2[keys[j]] = parent1[keys[j]];
            }
            
        }

        //mutation
        for(let j = 0;j<keys.length;j++) {
            if(Math.random() < mutationProb) {
                constantsChild1[keys[j]] = constantsChild1[keys[j]]+(((2*Math.random()) - 1) * mutationRate);
            }
            if(Math.random() < mutationProb) {
                constantsChild2[keys[j]] = constantsChild2[keys[j]]+(((2*Math.random()) - 1) * mutationRate);
            }
        }

        genk.push(constantsChild1)
        genk.push(constantsChild2)
    }
    return genk;
}


function ga() {
    if (!gameOverFlag) {
        clearInterval(gameInterval);
        gameOverFlag = true;
        if(!startGA)
            generations[currentGen][currentValues].score = (parseInt(scoreSpan.innerHTML));
        restartGame(false);
    }

    if (currentValues === populationSize - 1) {
        currentValues = 0;
        createGenerationk();
    }
    else {
        currentValues++;
    }

    setConstantValues(generations[currentGen][currentValues]);
    genInfoEl.innerHTML = "gen "+currentGen+" val "+currentValues+" a = "+constants.a+" b = "+constants.b+" c = "+constants.c+" d = "+constants.d;
    gameInterval = setIntervalForGame(gameSpeed / 32);
}

function checkGameOverGA() {
    if(gameOverFlag) {
        gameOverFlag = false;
        ga();
        clearInterval(gaInterval);
        gaInterval = setInterval(() => {
            ga();
        }, gameTime);
    }
}

let startGA = true;
//init
createGenerationk()
ga();
startGA = false;
gaInterval = setInterval(() => {
    ga();
}, gameTime);

checkGameOverInterval=  setInterval(() => {
    console.log("checking game over");
    checkGameOverGA();
}, gameSpeed/32); 