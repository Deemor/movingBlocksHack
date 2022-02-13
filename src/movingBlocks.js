const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const delay = t => new Promise(res => setTimeout(res, t * 1000));
const shuffleArray = (array) => array.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value)


var COLORS_IF_MORE_THAN_ONE = ['#088f90', '#708fae', '#1335a3', '#0047ab', '#6494ed', '#00018b']
const CLICKED_IF_MORE_THAN_ONE = '#30475d'

const COLOR_IF_ONE = '#1e3955'
const CLICKED_IF_ONE = '#30475d'



function playSound(name, volume){
    const sound = new Audio(name)
    sound.volume = volume || 0.15;
    sound.play();     
    return sound
}
var amountOfSquares = 0;
var speedAmount = 0;
var squareToClick = 0;
var amountOfColors = 1;
var isClickable = false;
var result = false;
var timeToRemember = 0;
var isBorder = 0;
var main_size = 0;

var main_width = [1150, 1540]
var main_height = [650 , 870]

function getColorOfSquare(){
  if(amountOfColors == 1){
    return COLOR_IF_ONE;
  }else{
    return COLORS_IF_MORE_THAN_ONE[randomInt(amountOfColors)];
  }
}

function getColorOfSquareAfterClick(){
  if(amountOfColors == 1){
    return CLICKED_IF_ONE;
  }else{
    return CLICKED_IF_MORE_THAN_ONE;
  }
}
function makeNewPosition(){
    
  // Get viewport dimensions (remove the dimension of the div)
  var height = $("#main").height() - 100;
  var width = $("#main").width() - 100;
  
  var newHeight = $('#main').offset().top + Math.floor(Math.random() * height);
  var newWidth = $('#main').offset().left + Math.floor(Math.random() * width);
  
  return [newHeight,newWidth];    
  
}

function animateDiv(divID){
  var newPosition = makeNewPosition();
  var oldPosition = $("#s"+String(divID)).offset();
  var speed = calcSpeed([oldPosition.top, oldPosition.left], newPosition);
  
  $("#s"+String(divID)).animate({ top: newPosition[0], left: newPosition[1] }, speed, function(){
    animateDiv(divID);        
  });
  
};

function calcSpeed(prev, next) {
  
  var x = Math.abs(prev[1] - next[1]);
  var y = Math.abs(prev[0] - next[0]);
  
  var greatest = x > y ? x : y;
  
  var speedModifier = speedAmount;

  var speed = Math.ceil(greatest/speedModifier);

  return speed;

}
function squareClick(divID)
{
  if(isClickable == true)
  {
    if(divID == squareToClick)
    {
      squareToClick+=1;
      $("#s"+String(divID)).css("background-color",getColorOfSquareAfterClick())
      $("#s"+String(divID)).css("border","0px solid white")
      if(divID == amountOfSquares)
      {
        result = true;
        $("#updateDiv").html("x");
        $("#updateDiv").html("");
      }
    }else if(divID > squareToClick)
    {
      result = false;
      $("#updateDiv").html("x");
      $("#updateDiv").html("");
    }
  }
}
function showNumbers()
{
  for(var i = 1; i <= amountOfSquares; i ++)
  {
    $("#s"+String(i)).html(i);
  }
}
function hideNumbers()
{
  for(var i = 1; i <= amountOfSquares; i ++)
  {
    $("#s"+String(i)).html("");
  }
}
async function startHack()
{
  COLORS_IF_MORE_THAN_ONE = shuffleArray(COLORS_IF_MORE_THAN_ONE)
  result = false;
  isClickable = false;
  squareToClick = 1;
  speedAmount =  document.getElementById("speed").value;
  amountOfSquares = document.getElementById("amount").value;
  timeToRemember = document.getElementById("timeToRemember").value;
  amountOfColors =  document.getElementById("colors").value;
  isBorder =  document.getElementById("border").value;
  main_size = document.getElementById("mainSize").value;

  $("#main").height(main_height[main_size])
  $("#main").width(main_width[main_size])

  for(var i = 1; i <= amountOfSquares; i ++)
  {
    $("#main").append(`<div class="square noselect" id="s`+String(i)+`" onclick="squareClick(`+String(i)+`);"> </div>`);
    var newPosition = makeNewPosition();
    $("#s"+String(i)).css("top",String(newPosition[0])+"px");
    $("#s"+String(i)).css("left",String(newPosition[1])+"px");
    $("#s"+String(i)).css("background-color", getColorOfSquare())
    if(isBorder == 1){
      $("#s"+String(i)).css("border", "1px solid white")
    }
  }
  for(var i = 1; i <= amountOfSquares; i ++)
  {
    animateDiv(i);
  }
  showNumbers();
  await delay(timeToRemember);
  hideNumbers();
  isClickable = true;

  return new Promise(async (output) => {
    $('body').on('DOMSubtreeModified', '#updateDiv', function(){
        output(result);
    });
  });
}
async function start(){
  $('#main').empty();
  $("#settings").hide();
  $("#main").show();
  var result = await startHack();
  result == true ? $("#buttonStart").html("Success. Try again") : $("#buttonStart").html("Failed. Try again");
  $("#settings").show();
  $("#main").hide();
}
$("#buttonStart").on( "click", function() {
  start();
});