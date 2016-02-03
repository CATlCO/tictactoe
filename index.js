var scoreyou = 0;
var scorepc = 0;
var moved;
var combos = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["1", "4", "7"], ["2", "5", "8"], ["3", "6", "9"], ["1", "5", "9"], ["3", "5", "7"]];
var you = { label: "", value: [], name: "you" };
var pc = { label: "", value: [], name: "pc" };
var dur = 1;
var easing = Elastic.easeOut.config(1, 0.2);
var restart = false;
var size = 20;

function free(sq){
  if (you.value.indexOf(sq) === -1 & pc.value.indexOf(sq) === -1){
    return true;
  }
}
function cross(sq){
  return $("#c" + sq).find('.cross');
}
function circleOuter(sq){
  return $("#c" + sq).find('.circle');
}
function circleInner(sq){
  return $("#c" + sq).find('.circle-inner');
}

function cont(current){
  checkWinner(current);
  checkDraw();
  if (current === you & !restart) { 
    pcMove(); 
  }
}

function fillValue(current, sq) {
  if (current.label === "cross") {
    TweenLite.to(cross(sq), dur, { borderWidth: size, ease: easing });
  } else {
    TweenLite.to(circleOuter(sq), dur, { borderRadius: "50%", ease: easing });
    TweenLite.to(circleInner(sq), dur, { width: size , height: size, ease: easing })
  }
  setTimeout(function(){ cont(current); }, dur*1000);
}

function findPattern(current){
  for (i in combos) {
    var count = 0;
    for (j in combos[i]) {
      if (current.value.indexOf(combos[i][j]) !== -1) {
        count++;
      } else {
        target = combos[i][j];
      }
    }
    if (count === 2 & free(target)) {
      pc.value.push(target);
      moved = true;
      fillValue(pc, target);
      break;
    }
  }
}

function pcMove(){
  moved = false;
  if (!moved) { findPattern(pc); }
  if (!moved) { findPattern(you); }
  if (!moved) { random(); }
}
function random(){
  randomSq = Math.floor((Math.random()*9) + 1).toString();
  if (free(randomSq)){
    pc.value.push(randomSq);
    fillValue(pc, randomSq);
  } else {
    random();
  }
  
}
function checkWinner(current){
  for (i in combos) {
    count = 0;
    for (j in combos[i]) {
      if (current.value.indexOf(combos[i][j]) !== -1) {
        count++;
      }
    }
    if (count === 3) {
      if (current === you) {
        alert("You win!");
        scoreyou++;
        $('#you').html(scoreyou);
      } else {
        alert("You lose!");
        scorepc++;
        $('#pc').html(scorepc);
      }
      restartGame();
    }
  }
}
function checkDraw(){
  if (you.value.length + pc.value.length === 9) {
    alert("It's a draw!");
    scoreyou++;
    scorepc++;
    $('#you').html(scoreyou);
    $('#pc').html(scorepc);
    restartGame();
  }
}

function restartGame() {
  you.value = [];
  pc.value = [];
  TweenLite.to($('.cross'), dur, { borderWidth: 0, borderRadius: 0, ease: Elastic.easeIn })
  TweenLite.to($('.circle'), dur, { borderRadius: '20px', ease: Elastic.easeIn })
  TweenLite.to($('.circle-inner'), dur, { width: 0, height: 0, ease: Elastic.easeIn });
  // restart = true;
}

$(document).ready(function(){
  you.label = "cross";
  $('button').click(function(){
    $('.choose').hide();
    $('.table').show();
    you.label = this.id;
    if (you.label === "cross") {
      pc.label = "circle";
    } else {
      pc.label = "cross";
    }
  })
  $('.td').click(function(){
    no = this.id.slice(-1);
    if (free(no)){
      you.value.push(no);
      fillValue(you, no);
      // restart = false;
    }
  })
});