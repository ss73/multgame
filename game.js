const MULT = 1;
const PICK = 2;
const PREP = 3;
const SCORE = 4;
const RESULT = 5;
const START_TIME = 6*30 - 1;
const PAUSE_TIME = 4*30;
const SCORE_START = 1000;
const NUM_QUESTIONS = 20;
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
let lastclick = Date.now;
let scale = 1;
let max_size = 600;

function setup() {
  var side = Math.min(windowWidth, windowHeight, max_size);
  var canvas = createCanvas(side, side);
  canvas.parent("sketch");
  scale = side / max_size;
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
  // Prevent clicking closer than 50 milliseconds apart as a workaround
  // for both touch and click events
  if(Date.now() - lastclick < 50) {
    return;
  }
  lastclick = Date.now();
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
  textSize(64 * scale);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Välj tabeller', width/2, height/2 - 90 * scale);
  fill(155, 155, 155);
  for(let i = 2; i <= 9; i++) {
    if(picks[i-2]) {
      fill(255, 255, 0);
    }
    text(i, i*55*scale , height/2);
    fill(155, 155, 155);
  }
  fill(200);
  rect(160 * scale, height/2 + 75 * scale, 300 * scale, 80 * scale, 
    20 * scale, 20 * scale, 20 * scale, 20 * scale);
  if(picksMade()) {
    fill(0);
  }
  else {
    fill(150);
  }
  text('Fortsätt', width/2, height/2 + 120 * scale);
}

function picksMade() {
  for(let i = 2; i <= 9; i++) {
    if(picks[i-2]) {
      return true;
    }
  }
  return false;
}

function clickPickMultRange(mouseX, mouseY) {
  let midy = height / 2;
  for(let i = 2; i <= 9; i++) {
    let minx = (i*55 - 25) * scale;
    let maxx = (i*55 + 25) * scale;
    let miny = midy - 25 * scale;
    let maxy = midy + 25 * scale;
    if(mouseX > minx && mouseX < maxx && mouseY > miny && mouseY < maxy) {
      picks[i-2] = !picks[i-2];
    }    
  }
  if(mouseX > 160 * scale && mouseX < 460 * scale && 
     mouseY > midy + 75 * scale && mouseY < midy + 155 * scale &&
     picksMade()) {
    let factors = [];
    for(let i = 0; i < picks.length; i++) {
      if(picks[i]) {
        factors.push(i+2);
      }
    }
    for(let i = 0; i < NUM_QUESTIONS; i++) {
      let factor1 = factors[Math.floor(Math.random() * factors.length)];
      let factor2 = Math.floor((Math.random() * 10) + 1);
      questions[i] = [factor1, factor2];
    }
    current_question = 0;
    timer = START_TIME;
    state = PREP;
  }
}

function clickMultiplicationQuestion(mouseX, mouseY) {
  let midy = height / 2;
  for(let i = 0; i <= 9; i++) {
    let minx = (i*55 + 25) * scale;
    let maxx = (i*55 + 75) * scale;
    let miny = height - 220 * scale;
    let maxy = miny + 70 * scale;
    if(mouseX > minx && mouseX < maxx && mouseY > miny && mouseY < maxy) {
      input += i;
    }    
  }
  if(mouseX > width/2 - 180 * scale && mouseX < width/2 - 30 * scale && 
     mouseY > height - 120 * scale && mouseY < height - 50 * scale) {
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
  else if(mouseX > width/2 + 30 * scale && mouseX < width/2 + 180 * scale && 
          mouseY > height - 120 * scale && mouseY < height - 50 * scale) {
    input = input.slice(0, -1);
  }
}

function drawMultiplicationQuestion() {
  background(0);
  textSize(46 * scale);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Poäng ' + score_countdown, width/2, height/2 - 200 * scale);
  textSize(80 * scale);
  text('' + questions[current_question][0] + ' × ' +
       questions[current_question][1] + ' = ' +
       input, width/2, height/2 - 50 * scale);
  textSize(64 * scale);
  for(let i = 0; i <= 9; i++) {
    fill(200);
    rect((i*55 + 25) * scale, height - 220 * scale, 50 * scale, 70 * scale,
      10 * scale, 10 * scale, 10 * scale, 10 * scale);
    fill(0);
    text(i, (i*55 + 50) * scale , height - 180 * scale);
  }
  fill(200);
  rect(width/2 - 180 * scale, height - 120 * scale, 150 * scale, 70 * scale,
    10 * scale, 10 * scale, 10 * scale, 10 * scale);
  rect(width/2 + 30 * scale, height - 120 * scale, 150 * scale, 70 * scale,
    10 * scale, 10 * scale, 10 * scale, 10 * scale);
  fill(0);
  text('OK', width/2 - 110 * scale, height - 80 * scale);
  text('⌫', width/2 + 100 * scale, height - 80 * scale);
  fill(255, 255, 255);
  score_countdown--;
  if(score_countdown < 100) {
    score_countdown = 100;
  }
}

function drawPrep() {
  background(0);
  textSize(64 * scale);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Var beredd', width/2, height/2 - 200 * scale);
  textSize(256 * scale);
  text((int)(timer/30), width/2, height/2);
  timer--;
  if(timer < 0) {
    state = MULT;
    timer = START_TIME;
  }
}

function drawScore() {
  background(0);
  textSize(64 * scale);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  if(last_answer_correct) {
    text('Bra jobbat!', width/2, height/2 - 200 * scale);
  }
  else {
    text('Tyvärr det var fel.', width/2, height/2 - 200 * scale);
    text('Rätt svar är: ' + correct_answer, width/2, height/2 - 140 * scale);
  }
  text('Poäng: ' + score_acc, width/2, height/2);
  textSize(128 * scale);
  text((int)(timer/30), width/2, height/2 + 200 * scale);
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
  textSize(64 * scale);
  fill(255, 255, 255);
  textAlign(CENTER, CENTER);
  text('Ditt resultat', width/2, height/2 - 200 * scale);
  textSize(128 * scale);
  text(score_acc, width/2, height/2 - 100 * scale);
  textSize(64 * scale);
  if(score_acc == hi_score) {
    fill(255, 255, 0);
    text('Nytt Highscore!', width/2, height/2);
    fill(255, 255, 255);
  }
  fill(200);
  rect(160 * scale, height/2 + 75 * scale, 300 * scale, 80 * scale,
    20 * scale, 20 * scale, 20 * scale, 20 * scale);
  fill(0);
  text('Fortsätt', width/2, height/2 + 120 * scale);
}

function clickResult(mouseX, mouseY) {
  let midy = height / 2;
  if(mouseX > 160 * scale && mouseX < 460 * scale && 
     mouseY > midy + 75 * scale && mouseY < midy + 155 * scale) {
    score_acc = 0;
    state = PICK;
  }
}
