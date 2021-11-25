const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const delay = t => new Promise(res => setTimeout(res, t * 1000));
const shuffleArray = (array) => array.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value)

function playSound(name, volume){
    const sound = new Audio(name)
    sound.volume = volume || 0.15;
    sound.play();     
    return sound
}
var amountOfSquares = 0;
var speed = 0;
var squareToClick = 0;
var isClickable = false;
var result = false;
var timeToRemember = 0;
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
  
  var speedModifier = speed;

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
      $("#s"+String(divID)).css("background-color","#30475d")
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
  result = false;
  isClickable = false;
  squareToClick = 1;
  speed =  document.getElementById("speed").value;
  amountOfSquares = document.getElementById("amount").value;
  timeToRemember = document.getElementById("timeToRemember").value;
  for(var i = 1; i <= amountOfSquares; i ++)
  {
    $("#main").append(`<div class="square noselect" id="s`+String(i)+`" onclick="squareClick(`+String(i)+`);"> </div>`);
    var newPosition = makeNewPosition();
    $("#s"+String(i)).css("top",String(newPosition[0])+"px");
    $("#s"+String(i)).css("left",String(newPosition[1])+"px");
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