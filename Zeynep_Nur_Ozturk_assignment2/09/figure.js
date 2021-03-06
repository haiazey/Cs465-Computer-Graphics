var canvas;
var gl;
var program;

var instanceMatrix;
var pos = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var numTimesToSubdivide=6;
var index=0;
var sphereArray = [];
var normalsArray = [];

var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var ctm;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
    
function triangle(a, b, c) {

     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);
     
          // normals are vectors
     
     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);


     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];


var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftFrontUpperLegId = 2;
var leftFrontLowerLegId = 3;
var rightFrontUpperLegId = 4;
var rightFrontLowerLegId = 5;
var leftBackUpperLegId = 6;
var leftBackLowerLegId = 7;
var rightBackUpperLegId = 8;
var rightBackLowerLegId = 9;
var leftBackFeetId = 11;
var rightBackFeetId = 12;
var rightFrontFeetId = 13;
var leftFrontFeetId = 14;
var tailUpperId = 15;
var tailMiddleId = 16;
var tailLowerId = 17;

var torsoHeight = 3.0;
var torsoWidth = 6.0;
var upperFrontLegHeight = 3.0;
var lowerFrontLegHeight = 2.0;
var upperFrontLegWidth  = 0.5;
var lowerFrontLegWidth  = 0.5;
var upperBackLegWidth  = 0.5;
var lowerBackLegWidth  = 0.5;
var lowerBackLegHeight = 2.0;
var upperBackLegHeight = 3.0;
var feetWidth = 1.0;
var feetHeight = 0.5;
var headHeight = 2.0;
var headWidth = 2.0;
var tailWidth = 3.0;
var tailHeight = 0.5;

var numNodes = 18;
var numAngles = 18;
var angle = 0;

var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
///////////////////////////////////////////////////////
var timeSpots = [];
var timelineArray = [];
for( var i = 0; i < 6; i++){
  timelineArray[i] = [];
  timeSpots[i] = 0;
}

var timelineIndex = 0;
var time=0;
var beginTime;



function animate(){
  var first=0;
  var second=0;
  
  var filename = document.getElementById("filename").value;
  
  for(var i = 1; i < 6; i++){
    if( timeSpots[i] == 1){
      second = i;
      if( second-first!=1){
        for( var k = first+1; k < second; k++){
        	pos = pos + (parseInt(timelineArray[second][numNodes])-parseInt(timelineArray[first][numNodes]))/(second-first);
	      for(var j = 0; j< numNodes; j++){
	        var angleToAdd = (timelineArray[second][j] - timelineArray[first][j])/(second-first);
	        var arr = timelineArray[k-1][j] ;
	        var result = arr+ angleToAdd;
	        
	        timelineArray[k][j] = result;
	      }
          timelineArray[k][numNodes] = pos;
          timeSpots[k] = 1;
        }
      }
      first = second;
    }
  }
  var data = "";
  for( var i = 0; i < 6; i++){
  	for( var j = 0; j <= numNodes; j++){
  		data = data + timelineArray[i][j] + " ";
  		//download( timelineArray[i][j], "test.txt", 'text/plain');
  	}
  		data = data + "\n";
  }
  download( data,  filename + ".txt", 'text/plain');
  beginTime = setInterval( movePart, 10);
}
function movePart(){
  time ++;
  if(time%100<20){
    //pos = pos+(parseInt(timelineArray[2][numNodes])-parseInt(timelineArray[1][numNodes]))/10;
    for(var i = 0; i< numNodes; i++){
      var x =(timelineArray[1][i]-timelineArray[0][i])/20;
      var y = parseInt(theta[i])+x;
      theta[i] = y;
      initNodes(i);
    }
    pos = timelineArray[1][numNodes];
    initNodes(numNodes);
  }
  
  if( time%100 >= 20 && time%100 < 40){
  	//pos = pos+(parseInt(timelineArray[2][numNodes])-parseInt(timelineArray[1][numNodes]))/10;
    for(var i = 0; i< numNodes; i++){
      theta[i] += (timelineArray[2][i]-timelineArray[1][i])/20;
      initNodes(i);
    }
    pos = timelineArray[2][numNodes];
    initNodes(numNodes);
  }
  if( time%100 >= 40 && time%100 < 60){
  	//pos = pos+(parseInt(timelineArray[2][numNodes])-parseInt(timelineArray[1][numNodes]))/10;
    for(var i = 0; i< numNodes; i++){
      theta[i] += (timelineArray[3][i]-timelineArray[2][i])/20;
      initNodes(numNodes);
    }
    pos = timelineArray[3][numNodes];
    initNodes(numNodes);
  }
  if( time%100 >= 60 && time%100 < 80){
  	//pos = pos+(parseInt(timelineArray[2][numNodes])-parseInt(timelineArray[1][numNodes]))/10;
    for(var i = 0; i< numNodes; i++){
      theta[i] += (timelineArray[4][i]-timelineArray[3][i])/20;
      initNodes(numNodes);
    }
    pos = timelineArray[4][numNodes];
    initNodes(i);
  }
  if( time%100 >= 80 && time%100 < 99){
  	//pos = pos+(parseInt(timelineArray[2][numNodes])-parseInt(timelineArray[1][numNodes]))/10;
    for(var i = 0; i< numNodes; i++){
      theta[i] += (timelineArray[5][i]-timelineArray[4][i])/20;
      initNodes(i);
    }
    pos = timelineArray[5][numNodes];
    initNodes(numNodes);
  }
  
  if(time%100== 99){
    for(var i = 0; i< numNodes; i++){
      theta[i] = timelineArray[1][i];
      initNodes(i);
    }
    pos = timelineArray[1][numNodes];
    initNodes(numNodes);
    }
  
}


function download(data, filename, type) {

    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}


var openFile = function(event) {
    var input = event.target;
	
    var reader = new FileReader();
    reader.onload = function(){
      	
      	var timeInterval = reader.result.split("\n");
      	var movements ;
      	for(var i = 0; i < 6; i++){
      		movements = timeInterval[i].split(" ");
      		for( var j = 0; j <= numNodes; j++){
      			timelineArray[i][j] = movements[j];
      			
      		}
      		console.log( movements[18]);
      	}
    beginTime = setInterval( movePart, 100);
    };
    reader.readAsText(input.files[0]);
  };


//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
    
    case torsoId:
    m = rotate(theta[torsoId], 0, 1, 0 );
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

  case headId: 
  case head1Id: 
    case head2Id:
    m = translate(-(torsoWidth-headWidth)-3, torsoHeight-1.5, 0.0);
  m = mult(m, rotate(theta[head1Id], 1, 0, 0))
  m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftFrontUpperLegId, null);
    break;
    
  case leftFrontUpperLegId: //leftFrontLeg
    
    m = translate(-(torsoWidth+upperBackLegWidth)/2, upperBackLegHeight*0.2, 3.0);
  m = mult(m, rotate(theta[leftFrontUpperLegId], 0, 0, 1));
    figure[leftFrontUpperLegId] = createNode( m, leftFrontUpperLeg, rightFrontUpperLegId, leftFrontLowerLegId );
    break;

    case rightFrontUpperLegId: //rightFrontLeg
    
    m = translate(-(torsoWidth+upperBackLegWidth)/2, upperBackLegHeight*0.2, -3.0);
  m = mult(m, rotate(theta[rightFrontUpperLegId], 0, 0, 1));
    figure[rightFrontUpperLegId] = createNode( m, rightFrontUpperLeg, leftBackUpperLegId, rightFrontLowerLegId );
    break;
  
    case leftBackUpperLegId: //leftBackLeg
  m = translate(torsoWidth-3,  upperBackLegHeight*0.2, 3.0);//-(torsoWidth+upperBackLegWidth), 0.1*upperBackLegHeight, 0.0
  m = mult(m , rotate(theta[leftBackUpperLegId], 0, 0, 1));
    figure[leftBackUpperLegId] = createNode( m, leftBackUpperLeg, rightBackUpperLegId, leftBackLowerLegId );
    break;
  
  case rightBackUpperLegId: //rightUpperBackLeg
    m = translate(torsoWidth-3,  upperBackLegHeight*0.2, -3.0);
  m = mult(m, rotate(theta[rightBackUpperLegId], 0, 0, 1));
    figure[rightBackUpperLegId] = createNode( m, rightBackUpperLeg, tailUpperId, rightBackLowerLegId );
    break;
    
    case leftFrontLowerLegId: //leftBackLeg
    m = translate(0.0, -upperFrontLegHeight, 0.0);
    m = mult(m, rotate(theta[leftFrontLowerLegId], 0, 0, 1));
    figure[leftFrontLowerLegId] = createNode( m, leftFrontLowerLeg, null, leftFrontFeetId );
    break;
    
    case rightFrontLowerLegId: //rightBackLeg
    m = translate(0.0, -upperFrontLegHeight, 0.0);
    m = mult(m, rotate(theta[rightFrontLowerLegId], 0, 0, 1));
    figure[rightFrontLowerLegId] = createNode( m, rightFrontLowerLeg, null, rightFrontFeetId );
    break;
    
    case leftBackLowerLegId: //leftLowerBackLeg
    m = translate(0.0, upperBackLegHeight, 0.0);
    m = mult(m, rotate(theta[leftBackLowerLegId], 0, 0, 1));
    figure[leftBackLowerLegId] = createNode( m, leftBackLowerLeg, null, leftBackFeetId );
    break;
    
    case rightBackLowerLegId: //rightLowerBackLeg
    m = translate(0.0, upperBackLegHeight, 0.0);
    m = mult(m, rotate(theta[rightBackLowerLegId], 0, 0, 1));
    figure[rightBackLowerLegId] = createNode( m, rightBackLowerLeg, null, rightBackFeetId );
    break;
  ///////////////////////////////////////
  case leftBackFeetId: 
    m = translate(0.0, lowerBackLegHeight-0.25, 0.0);
    m = mult(m, rotate(theta[leftBackFeetId], 0, 0, 1));
    figure[leftBackFeetId] = createNode( m, leftBackFeet, null, null );
    break;
  
  case rightBackFeetId: 
    m = translate(0.1, lowerBackLegHeight-0.25, 0.0);
    m = mult(m, rotate(theta[rightBackFeetId], 0, 0, 1));
    figure[rightBackFeetId] = createNode( m, rightBackFeet, null, null );
    break;
  
  case rightFrontFeetId: 
    m = translate(feetWidth*0.02, -lowerFrontLegHeight+0.2, 0.0);
    m = mult(m, rotate(theta[rightFrontFeetId], 0, 0, 1));
    figure[rightFrontFeetId] = createNode( m, rightFrontFeet, null, null );
    break;
  
  case leftFrontFeetId: 
    m = translate(feetWidth*0.01, -lowerFrontLegHeight+0.2, 0.0);
    m = mult(m, rotate(theta[leftFrontFeetId], 0, 0, 1));
    figure[leftFrontFeetId] = createNode( m, leftFrontFeet, null, null );
    break;

////////////////////////////////////////////////////////////
  case tailUpperId: 
    m = translate(feetWidth*5.8, lowerFrontLegHeight-2, 0.0);
    m = mult(m, rotate(theta[tailUpperId], 0, 0, 1));
    figure[tailUpperId] = createNode( m, tailUpper, null, tailMiddleId );
    break;
  
  case tailMiddleId: 
    m = translate(feetWidth*2.3, lowerFrontLegHeight-2, 0.0);
    m = mult(m, rotate(theta[tailMiddleId], 0, 0, 1));
    figure[tailMiddleId] = createNode( m, tailMiddle, null, tailLowerId );
    break;
  
  case tailLowerId: 
    m = translate(feetWidth*1.5, lowerFrontLegHeight/200, 0.0);
    m = mult(m, rotate(theta[tailLowerId], 0, 0, 1));
    figure[tailLowerId] = createNode( m, tailLower, null, null );
    break;
    
    }

}

function traverse(Id) {
   if(Id == null) return; 
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

function torso() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.1*pos, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );
}

function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
  instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));        
    for( var i=0; i<index; i+=3) 
        gl.drawArrays( gl.TRIANGLES, i, 3 );
}

function leftFrontUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * upperFrontLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(upperFrontLegWidth, upperFrontLegHeight, upperFrontLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFrontLowerLeg() {
instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * lowerFrontLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerFrontLegWidth, lowerFrontLegHeight, lowerFrontLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFrontUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * upperFrontLegHeight, 0.0) );
  	instanceMatrix = mult(instanceMatrix, scale4(upperFrontLegWidth, upperFrontLegHeight, upperFrontLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFrontLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -0.5 * lowerFrontLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerFrontLegWidth, lowerFrontLegHeight, lowerFrontLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftBackUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0,0.5 * upperBackLegHeight, 0.0) );
  	instanceMatrix = mult(instanceMatrix, scale4(upperBackLegWidth, upperBackLegHeight, upperBackLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftBackLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerBackLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerBackLegWidth, lowerBackLegHeight, lowerBackLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightBackUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperBackLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(upperBackLegWidth, upperBackLegHeight, upperBackLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightBackLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerBackLegHeight, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(lowerBackLegWidth, lowerBackLegHeight, lowerBackLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
//////////////////////////////////////
function leftBackFeet() {
    instanceMatrix = mult(modelViewMatrix, translate(0.5, 0.0,  0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(feetWidth, feetHeight, feetWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightBackFeet() {
    instanceMatrix = mult(modelViewMatrix, translate(0.1 * lowerBackLegHeight, 0.0, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(feetWidth, feetHeight, feetWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFrontFeet() {
    instanceMatrix = mult(modelViewMatrix, translate(-0.1 * lowerBackLegHeight, 0.0, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(feetWidth, feetHeight, feetWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFrontFeet() {
    instanceMatrix = mult(modelViewMatrix, translate(-0.1 * lowerBackLegHeight, 0.0, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(feetWidth, feetHeight, feetWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailUpper() {
    instanceMatrix = mult(modelViewMatrix, translate(2.30*tailHeight, 0.0, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(tailWidth, tailHeight, tailWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailMiddle() {
    instanceMatrix = mult(modelViewMatrix, translate(0.8, 0.0, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(tailWidth/2, tailHeight, tailWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tailLower() {
    instanceMatrix = mult(modelViewMatrix, translate(0.8, 0.0, 0.0) );
  instanceMatrix = mult(instanceMatrix, scale4(tailWidth/2, tailHeight, tailWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function frame(){
	var frameNo = document.getElementById("frame").value;
      for ( var i = 0; i < 6; i++){
        for( var j = 0; j <numNodes; j++){
          timelineArray[frameNo][j] = parseInt(theta[j]);
        }
        timelineArray[frameNo][numNodes] = pos;
      }
      
      timeSpots[parseInt(frameNo)] = 1;
      timelineIndex++;
    
}
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     pointsArray.push(vertices[b]); 
     pointsArray.push(vertices[c]);     
     pointsArray.push(vertices[d]);    
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  gl.enable(gl.DEPTH_TEST);
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    
    gl.useProgram( program);
  
instanceMatrix = mat4();
    
    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
   
    modelViewMatrix = mat4();
  
  // create a buffer with color data



// used the buffer to create a DataTexture

    
        normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
        
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
    
    cube();
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
  left = -15.0;
  right = 15.0;
  ytop =13.0;
  bottom = -13.0;
  projectionMatrix = ortho(left, right, bottom, ytop, near, far);
  gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
  tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
  
  	
  
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
        
    vBuffer = gl.createBuffer();
        
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );

gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
  
  document.getElementById("Submit").addEventListener("click", animate);
    
  document.getElementById("slider0").onchange = function() {
    theta[torsoId ] = event.srcElement.value;
    initNodes(torsoId);
    };
  document.getElementById("slider1").onchange = function() {
    theta[head1Id] = event.srcElement.value;
    initNodes(head1Id);
    };

  document.getElementById("slider2").onchange = function() {
         theta[leftFrontUpperLegId] = event.srcElement.value;
         initNodes(leftFrontUpperLegId);
    };
    document.getElementById("slider3").onchange = function() {
         theta[leftFrontLowerLegId] =  event.srcElement.value;
         initNodes(leftFrontLowerLegId);
    };
     
        document.getElementById("slider4").onchange = function() {
        theta[rightFrontUpperLegId] = event.srcElement.value;
        initNodes(rightFrontUpperLegId);
    };
    document.getElementById("slider5").onchange = function() {
         theta[rightFrontLowerLegId] =  event.srcElement.value;
         initNodes(rightFrontLowerLegId);
    };
        document.getElementById("slider6").onchange = function() {
        theta[leftBackUpperLegId] = 180-parseInt(event.srcElement.value);
        initNodes(leftBackUpperLegId);
    };
    document.getElementById("slider7").onchange = function() {
         theta[leftBackLowerLegId] = event.srcElement.value;
         initNodes(leftBackLowerLegId);
    };
    document.getElementById("slider8").onchange = function() {
         theta[rightBackUpperLegId] =  180-parseInt(event.srcElement.value);
         initNodes(rightBackUpperLegId);
    };
        document.getElementById("slider9").onchange = function() {
        theta[rightBackLowerLegId] = event.srcElement.value;
        initNodes(rightBackLowerLegId);
    };
    document.getElementById("slider10").onchange = function() {
         theta[head2Id] = event.srcElement.value;
         initNodes(head2Id);
    };
  document.getElementById("slider11").onchange = function() {
    theta[leftBackFeetId] = event.srcElement.value;
    initNodes(leftBackFeetId);
  };
  document.getElementById("slider12").onchange = function() {
    theta[rightBackFeetId] = event.srcElement.value;
    initNodes(rightBackFeetId);
  };
  document.getElementById("slider13").onchange = function() {
    theta[rightFrontFeetId] = event.srcElement.value;
    initNodes(rightFrontFeetId);
  };
  document.getElementById("slider14").onchange = function() {
    theta[leftFrontFeetId] = event.srcElement.value;
    initNodes(leftFrontFeetId);
  };
  
  document.getElementById("slider15").onchange = function() {
    theta[tailUpperId] = event.srcElement.value;
    initNodes(tailUpperId);
  };
  document.getElementById("slider16").onchange = function() {
    theta[tailMiddleId] = event.srcElement.value;
    initNodes(tailMiddleId);
  };
  document.getElementById("slider17").onchange = function() {
    theta[tailLowerId] = event.srcElement.value;
    initNodes(tailLowerId);
  };
  
  
  
  document.getElementById("torsoPosition").onchange = function() {
    pos = event.srcElement.value;
    initNodes(torsoId);
  };
  
  document.getElementById("SubmitFrame").addEventListener("click", frame);

    for(i=0; i<numNodes; i++)
  {
    initNodes(i);
    }
    render();
}


var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(torsoId);
        requestAnimFrame(render);
}
