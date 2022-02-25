const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const delay = t => new Promise(res => setTimeout(res, t * 1000));
const shuffleArray = (array) => array.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value)


var COLORS_IF_MORE_THAN_ONE = ['#088f90', '#708fae', '#1335a3', '#0047ab', '#6494ed', '#00018b']
const CLICKED_IF_MORE_THAN_ONE = '#30475d'

const COLOR_IF_ONE = '#1e3955'
const CLICKED_IF_ONE = '#30475d'

const COLOR_IF_ONE_5CITY = '#005c53'
const COLOR_IF_MORE_THAN_ONE_5CITY = ['#005c53','#1c8b80','#0850ad','#09ad21','#076905','#12e5de']
const CLICKED_IF_5CITY = '#a0c131'

const SQUARE_WIDTH_5CITY = "80px";
const SQUARE_WIDTH_NOPIXEL = "100px";

const SQUARE_WIDTH_5CITY_INT = 80;
const SQUARE_WIDTH_NOPIXEL_INT = 100;

const SQUARE_FONT_5CITY = "50px"
const SQUARE_FONT_COLOR_5CITY = "#d7ef4f"
const SQUARE_FONT_WEIGHT_5CITY = "bold"

const SQUARE_FONT_NOPIXEL = "60px"
const SQUARE_FONT_COLOR_NOPIXEL = "white"
const SQUARE_FONT_WEIGHT_NOPIXEL = "normal"



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
var timeToRemember = 4;
var isBorder = 0;
var main_size = 0;
var type = "NOPIXEL";
var time_5City = 1;

var main_width = [1150, 1540]
var main_height = [650 , 870]

function getColorOfSquareNOPIXEL(){
  if(amountOfColors == 1){
    return COLOR_IF_ONE;
  }else{
    return COLORS_IF_MORE_THAN_ONE[randomInt(amountOfColors)];
  }
}
function getColorOfSquare5City(){
  if(amountOfColors == 1){
    return COLOR_IF_ONE_5CITY;
  }else{
    return COLOR_IF_MORE_THAN_ONE_5CITY[randomInt(amountOfColors)];
  }
}


function getColorOfSquareAfterClick(){
  if(amountOfColors == 1){
    return COLOR_IF_ONE_5CITY;
  }else{
    return CLICKED_IF_MORE_THAN_ONE;
  }
}
function makeNewPosition(){
    
  if(type=="5CITY")
  {
    var height = $("#main5CityBox").height() - SQUARE_WIDTH_5CITY_INT;
    var width = $("#main5CityBox").width() - SQUARE_WIDTH_5CITY_INT;
    
    var newHeight = $('#main5CityBox').offset().top + Math.floor(Math.random() * height);
    var newWidth = $('#main5CityBox').offset().left + Math.floor(Math.random() * width);
    
    return [newHeight,newWidth];    
  }else if(type=="NOPIXEL")
  {
    var height = $("#main").height() - SQUARE_WIDTH_NOPIXEL_INT;
    var width = $("#main").width() - SQUARE_WIDTH_NOPIXEL_INT;
    
    var newHeight = $('#main').offset().top + Math.floor(Math.random() * height);
    var newWidth = $('#main').offset().left + Math.floor(Math.random() * width);
  
    return [newHeight,newWidth];    
  }
  return [0,0]
}

function animateDiv(divID){
  var newPosition = makeNewPosition();
  var oldPosition = $("#s"+String(divID)).offset();
  var speed = calcSpeed([oldPosition.top, oldPosition.left], newPosition);
  $("#s"+String(divID)).animate({ top: newPosition[0], left: newPosition[1] }, speed, function(){
    animateDiv(divID);        
  });
  
};
function animateDiv5City(){
  var speed = time_5City*1000;
  for(var i = 1; i <= amountOfSquares - 1; i ++)
  {
    var newPosition = makeNewPosition();
    $("#s"+String(i)).animate({ top: newPosition[0], left: newPosition[1] }, speed, function(){
              
    });
  }
  var newPosition = makeNewPosition();
  $("#s"+String(i)).animate({ top: newPosition[0], left: newPosition[1] }, speed, function(){
    animateDiv5City();
  });

  
};
function stopAnimation(){
  for(var i = 1; i <= amountOfSquares; i ++)
  {
    $("#s"+String(i)).stop();
  }
}
async function stopProgressBar()
{
  $("#progress-bar").stop(true,true);
}

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
      
      if(type=="5CITY")
      {
        $("#s"+String(divID)).css("background-color", CLICKED_IF_5CITY)
      }else if(type=="NOPIXEL")
      {
        $("#s"+String(divID)).css("background-color",getColorOfSquareAfterClick())
      }
      $("#s"+String(divID)).css("border","0px solid white")
      if(divID == amountOfSquares)
      {
        result = true;
        $("#updateDiv").html("x");
        $("#updateDiv").html("");
      }
    }else if(divID != squareToClick)
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
async function startNopixelHack()
{
  $("#main").height(main_height[main_size])
  $("#main").width(main_width[main_size])

  for(var i = 1; i <= amountOfSquares; i ++)
  {
    $("#main").append(`<div class="square noselect" id="s`+String(i)+`" onmousedown="squareClick(`+String(i)+`);"> </div>`);
    var newPosition = makeNewPosition();
    $("#s"+String(i)).css("top",String(newPosition[0])+"px");
    $("#s"+String(i)).css("left",String(newPosition[1])+"px");
    $("#s"+String(i)).css("font-size",SQUARE_FONT_NOPIXEL);
    $("#s"+String(i)).css("color", SQUARE_FONT_COLOR_NOPIXEL);
    $("#s"+String(i)).css("font-weight", SQUARE_FONT_WEIGHT_NOPIXEL);
    $("#s"+String(i)).css("background-color", getColorOfSquareNOPIXEL())
    $("#s"+String(i)).css("width", SQUARE_WIDTH_NOPIXEL)
    $("#s"+String(i)).css("height", SQUARE_WIDTH_NOPIXEL)
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

async function start5CityHack()
{
  for(var i = 1; i <= amountOfSquares; i ++)
  {
    $("#main5CityBox").append(`<div class="square noselect" id="s`+String(i)+`" onmousedown="squareClick(`+String(i)+`);"> </div>`);
    var newPosition = makeNewPosition();
    $("#s"+String(i)).css("top",String(newPosition[0])+"px");
    $("#s"+String(i)).css("left",String(newPosition[1])+"px");
    $("#s"+String(i)).css("font-size",SQUARE_FONT_5CITY);
    $("#s"+String(i)).css("color", SQUARE_FONT_COLOR_5CITY);
    $("#s"+String(i)).css("font-weight", SQUARE_FONT_WEIGHT_5CITY);
    $("#s"+String(i)).css("background-color", getColorOfSquare5City())
    $("#s"+String(i)).css("width", SQUARE_WIDTH_5CITY)
    $("#s"+String(i)).css("height", SQUARE_WIDTH_5CITY)
    if(isBorder == 1){
      $("#s"+String(i)).css("border", "1px solid #ccec90")
    }
  }
  animateDiv5City();
  
  showNumbers();
  
  var progBar = $("#progress-bar");
  progBar.css("width","100%");
  progBar.animate({
    width: "0px"
  }, {
    duration: timeToRemember*1000,
    ease: "linear",
  });
  await delay(timeToRemember);
  await stopProgressBar();

  hideNumbers();
  isClickable = true;
  
  return new Promise(async (output) => {
    $('body').on('DOMSubtreeModified', '#updateDiv', function(){
      output(result);
    });
  });
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
  time_5City = document.getElementById("time5CITY").value;

  if(type=="5CITY")
  {
    var result = await start5CityHack();
    $('#main5CityBox').empty();
    if(result==true){
      $("#main5CityBox").append(`<div style="width:100%; text-align: center; height:60px; margin-left:auto;margin-right:auto; font-size:60px; color:#d7ef4f; font-weight:bold;" >ACCESS GRANTED</div>`);
    }else{
      $("#main5CityBox").append(`<div style="width:100%; text-align: center; height:60px; margin-left:auto;margin-right:auto; font-size:60px; color:#d7ef4f; font-weight:bold;" >ACCESS DENIED</div>`);
    }
    
    var progBar = $("#progress-bar");
    progBar.css("width","100%");
    progBar.animate({
      width: "0px"
    }, {
      duration: 500,
      ease: "linear",
    });
    await delay(0.5);
    await stopProgressBar();
    return result;
  }else if(type=="NOPIXEL")
  {
    return await startNopixelHack();
  }
  
}
async function start(){
  type = document.getElementById("type").value == 0? "NOPIXEL": "5CITY";;
  stopAnimation();
  $('#main').empty();
  $('#main5CityBox').empty();
  $("#settings").hide();
  if(type=="5CITY")
  {
    $("#main5City").show();
  }else if(type=="NOPIXEL")
  {
    $("#main").show();
  }
  var result = await startHack();
  stopAnimation();
  result == true ? $("#buttonStart").html("Success. Try again") : $("#buttonStart").html("Failed. Try again");
  $("#settings").show();
  $("#main").hide();
  $('#main5City').hide();
}
$("#buttonStart").on( "click", function() {
  start();
});
