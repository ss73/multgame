const MULT = 1;
const PICK = 2;
const PREP = 3;
const SCORE = 4;
const RESULT = 5;
const START_TIME = 6*30 - 1;
const PAUSE_TIME = 4*30;
const SCORE_START = 1000;
let state = PICK;
let picks = [0, 0, 0, 0 ,0 ,0, 0, 0];
let timer = START_TIME;
let questions = [[5, 4]];
let answers = [];
let input = "";
let score_countdown = SCORE_START;
let last_answer = 0;
let correct_answer = 0;
let score_acc = 0;
let current_question = 0;
let last_answer_correct = false;
let hi_score = 0;

function setup() {
  var canvas = createCanvas(600, 600);
  canvas.parent("sketch");
}

function draw() {
  switch(state) {
    case MULT: {
      drawMultiplicationQuestion();
      break;
    }
    case PICK: {
      drawPickMultRange();
      break;
    }
    case PREP: {
      drawPrep();
      break;
    }
    case SCORE: {
      drawScore();
      break;
    }
    case RESULT: {
      drawResult();
      break;
    }
    default:
  }
}

function mouseClicked() {
  switch(state) {
    case MULT: {
      clickMultiplicationQuestion(mouseX, mouseY);
      break;
    }
    case PICK: {
      clickPickMultRange(mouseX, mouseY);
      break;
    }
    case RESULT: {
      clickResult(mouseX, mouseY);
      break;
    }
    default:
      break;
  }
}

function touchEnded() {
  mouseClicked();  
}


function drawPickMultRange() {
  background(0);
  textSize(64);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Välj tabeller', width/2, height/2 - 90);
  fill(155, 155, 155);
  for(let i = 2; i <= 9; i++) {
    if(picks[i-2]) {
      fill(255, 255, 0);
    }
    text(i, i*55 , height/2);
    fill(155, 155, 155);
  }
  fill(255, 255, 255);
  text('Fortsätt', width/2, height/2 + 120);
  stroke(255);
  strokeWeight(4);
  noFill();
  rect(160, height/2 + 75, 300, 80, 20, 20, 20, 20);
  noStroke();
}

function clickPickMultRange(mouseX, mouseY) {
  let midy = height / 2;
  for(let i = 2; i <= 9; i++) {
    let minx = i*55 - 25;
    let maxx = i*55 + 25;
    let miny = midy - 25;
    let maxy = midy + 25;
    if(mouseX > minx && mouseX < maxx && mouseY > miny && mouseY < maxy) {
      picks[i-2] = !picks[i-2];
    }    
  }
  if(mouseX > 160 && mouseX < 460 && 
     mouseY > midy + 75 && mouseY < midy + 75 + 80) {
    let factors = [];
    for(let i = 0; i < picks.length; i++) {
      if(picks[i]) {
        factors.push(i+2);
      }
    }
    for(let i = 0; i < 20; i++) {
      let factor1 = factors[Math.floor(Math.random() * factors.length)];
      let factor2 = Math.floor((Math.random() * 10) + 1);
      questions[i] = [factor1, factor2];
    }
    current_question = 0;
    state = PREP;
  }
}

function clickMultiplicationQuestion(mouseX, mouseY) {
  let midy = height / 2;
  for(let i = 0; i <= 9; i++) {
    let minx = i*55 + 25;
    let maxx = i*55 + 75;
    let miny = height - 220;
    let maxy = miny + 70;
    if(mouseX > minx && mouseX < maxx && mouseY > miny && mouseY < maxy) {
      input += i;
    }    
  }
  if(mouseX > width/2 - 180 && mouseX < width/2 - 30 && 
     mouseY > height - 120 && mouseY < height - 50) {
    last_answer = parseInt(input);
    input = '';
    correct_answer = questions[current_question][0] * 
      questions[current_question][1]
    if(last_answer == correct_answer) {
      score_acc += score_countdown;
      last_answer_correct = true;
    }
    else {
      last_answer_correct = false;
    }
    timer = PAUSE_TIME;
    state = SCORE;
  }
  else if(mouseX > width/2 +30 && mouseX < width/2 + 180 && 
          mouseY > height - 120 && mouseY < height - 50) {
    input = input.slice(0, -1);
  }
}

function drawMultiplicationQuestion() {
  background(0);
  textSize(46);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Poäng ' + score_countdown, width/2, height/2 - 200);
  textSize(80);
  text('' + questions[current_question][0] + ' × ' +
       questions[current_question][1] + ' = ' +
       input, width/2, height/2 - 50);
  textSize(64);
  for(let i = 0; i <= 9; i++) {
    text(i, i*55 + 50 , height - 180);
    stroke(255);
    strokeWeight(2);
    noFill();
    rect(i*55 + 25, height - 220, 50, 70, 10, 10, 10, 10);
    noStroke();
    fill(255, 255, 255);
  }
  text('OK', width/2 - 110, height - 80);
  text('⌫', width/2 + 100, height - 80);
  stroke(255);
  strokeWeight(4);
  noFill();
  rect(width/2 - 180, height - 120, 150, 70, 10, 10, 10, 10);
  rect(width/2 + 30, height - 120, 150, 70, 10, 10, 10, 10);
  noStroke();
  fill(255, 255, 255);
  score_countdown--;
  if(score_countdown < 100) {
    score_countdown = 100;
  }
}

function drawPrep() {
  background(0);
  textSize(64);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Var beredd', width/2, height/2 - 200);
  textSize(256);
  text((int)(timer/30), width/2, height/2);
  timer--;
  if(timer < 0) {
    state = MULT;
    timer = START_TIME;
  }
}

function drawScore() {
  background(0);
  textSize(64);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  if(last_answer_correct) {
    text('Bra jobbat!', width/2, height/2 - 200);
  }
  else {
    text('Tyvärr det var fel.', width/2, height/2 - 200);
    text('Rätt svar är: ' + correct_answer, width/2, height/2 - 140);
  }
  text('Poäng: ' + score_acc, width/2, height/2);
  textSize(128);
  text((int)(timer/30), width/2, height/2 + 200);
  timer--;
  if(timer < 0) {
    if(current_question == questions.length - 1) {
      if(score_acc > hi_score) {
        hi_score = score_acc;
      }
      state = RESULT;
    }
    else {
      current_question++;
      state = MULT;
      score_countdown = SCORE_START;
      timer = START_TIME;
    }
  }
}

function drawResult() {
  background(0);
  textSize(64);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Ditt resultat', width/2, height/2 - 200);
  textSize(128);
  text(score_acc, width/2, height/2 - 100);
  textSize(64);
  if(score_acc == hi_score) {
    fill(255, 255, 0);
    text('Nytt Highscore!', width/2, height/2);
    fill(255, 255, 255);
  }
  text('Fortsätt', width/2, height/2 + 120);
  stroke(255);
  strokeWeight(4);
  noFill();
  rect(160, height/2 + 75, 300, 80, 20, 20, 20, 20);
  noStroke();
}

function clickResult(mouseX, mouseY) {
  let midy = height / 2;
  if(mouseX > 160 && mouseX < 460 && 
     mouseY > midy + 75 && mouseY < midy + 75 + 80) {
    score_acc = 0;
    state = PICK;
  }
}
