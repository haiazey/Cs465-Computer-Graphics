var canvas;
var gl;

var maxNumTriangles = 100000;
var maxNumVertices  = 3 * maxNumTriangles;
var theta = 0.0;
var thetaLoc;
var index = 0;
var first = true;
var maxWidth = 0;
var minWidth = 0;
var houseAttractor, treeAttractor, rockAttractor;
var xLeft = 0;
var noCircle = 0;
var cIndex = 0;
var points = [];
var riverEndIndex =0;
var program;
var circleEndIndex;
var circleBeginIndex;
var vBuffer;
var vPosition;
var cBuffer;
var vColor;
var xCoord = 0;
var yCoord;
var result2;
var decidedShape;//0 for Rock, 1 for Tree, 2 For HOuse
var restrictedArray =[];

var houseArray = [];
var treeArray = [];
var rockArray = [];

var houseVert = [];

var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

var numRect =0;
var houseIndices =[];
houseIndices[0] = 0;
var startHouse = [0];

var numFruit = 0;
var fruitIndices = [];
fruitIndices[0] = 0;
var startFruit = [0];

var numTree = 0;
var treeIndices = [];
treeIndices[0] = 0;
var startTree = [0];

var numRock = 0;
var rockIndices = [];
rockIndices[0] = 0;
var startRock = [0];


var intersectCircle = true;
var intersectRiver = true;
var intersectCanvas = true;
var drawCirclePressed = false;
var circleDetected;
var housePressed =false;
var treePressed = false;
var rockPressed = false;
var fruitArray = [];
var randomPlace;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
    vec4( 0.92, 0.36, 0.36,1.0), //pembemsi
    vec4(0.94,0.33,0.19,1.0), //turuncu
    vec4( 0.96, 0.46, 0.13, 1.0), // açık turuncu
    vec4( 0.98, 0.63, 0.18, 1.0), // koyu sarı
    vec4( 0.98, 0.86, 0.18, 1.0), // sarı
    vec4( 0.75, 0.84, 0.18, 1.0), // açık yeşil
    vec4( 0.53, 0.77, 0.24, 1.0), //bi tık koyu yeşil
    vec4( 0.29, 0.72, 0.28, 1.0), // den den
    vec4( 0.07, 0.54, 0.26, 1.0),//koyu yeşil
    vec4( 0.15, 0.70, 0.4, 1.0), // yeşil tonusu
    vec4( 0.04, 0.50, 0.24, 1.0), //mavi açık
    vec4( 0.06, 0.44, 0.66, 1.0), 
    vec4( 0.09, 0.37, 0.67, 1.0), 
    vec4( 0.12, 0.26, 0.62, 1.0), //mavi koyu
    vec4( 0.52, 0.31, 0.63, 1.0), //morss
    vec4( 0.37, 0.18, 0.56, 1.0), 
    vec4( 0.67, 0.32, 0.36, 1.0), 
    vec4( 0.94, 0.46, 0.62, 1.0), //pembiş
    vec4( 0.8, 0.30, 0.62, 1.0), 
    vec4( 0.7, 0.12, 0.45, 1.0), 
    vec4( 0.2, 0.2, 0.2, 1.0), //gri
    vec4( 0.6, 0.6, 0.6, 1.0), 
    vec4( 0.8, 0.8, 0.8, 1.0)
];

var vertices = [];

//******************** Init**********************
window.onload = function init() {


    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 1, 0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    //*************************************************
    //  Load shaders
    //************************************************
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    //circleProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );




    //******************************************
    //             River
    //*******************************************
    document.getElementById("Submit").addEventListener("click", create);

    function create(){

        vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);

        vPosition = gl.getAttribLocation( program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

        vColor = gl.getAttribLocation( program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);


        minWidth = document.getElementById("minLength").value;
        maxWidth = document.getElementById("maxLength").value;
        var result = Math.random()*(maxWidth-minWidth);
        result2 = Math.round(result + parseFloat(minWidth));
        //console.log(result2);

        cIndex = 3;
        drawRiver();

        xLeft = (result2 ) / canvas.width;

        cIndex = 4;
        drawRiver();

    }

     function drawRiver(){

        vertices[0] = vec2( -xLeft, -1 );
        vertices[1] =  vec2(  -xLeft,  1 );
        vertices[2] = vec2( xLeft, -1 );
        vertices[3] = vec2( xLeft, 1);


        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );

        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(vertices[0]));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(vertices[1]));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(vertices[3]));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(vertices[2]));

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        index+=4;

        t = vec4(colors[cIndex]);

        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));


        riverEndIndex = index;
        //console.log("in draw");
        render();
    }


    //*********************************************
    //                 House
    //**********************************************
    document.getElementById("House").addEventListener("click", house);

    function house(){

        canvas.addEventListener("mousedown", function(event){
            if(houseAttractor == null){
                houseAttractor = vec2(2*event.clientX/canvas.width-1,
                    2*(canvas.height-event.clientY)/canvas.height-1);
                console.log("house"+houseAttractor);
            }
        });

    }

    // *****************************************
    //                 Tree
    //********************************************
    document.getElementById("Tree").addEventListener("click", tree);

    function tree(){
        canvas.addEventListener("mousedown", function(event){
            if(treeAttractor == null){
                treeAttractor = vec2(2*event.clientX/canvas.width-1,
                    2*(canvas.height-event.clientY)/canvas.height-1);
                console.log("tree" +treeAttractor);
            }
        });
    }

    //*************************************************
    //                         Rock
    //*************************************************
    document.getElementById("Rock").addEventListener("click", rock);

    function rock(){
        canvas.addEventListener("mousedown", function(event){
            if(rockAttractor == null){
                rockAttractor = vec2(2*event.clientX/canvas.width-1,
                    2*(canvas.height-event.clientY)/canvas.height-1);
                console.log("rock" + rockAttractor);
            }
        });
    }

    //**********************************
    //             RANDOM NUMBERS
    //*********************************

    function randomSpace(){
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

        if(plusOrMinus == -1){
            randomPlace = 0.0-Math.random();
        }
        if(plusOrMinus == 1){
            randomPlace = Math.random();
        }

    }
    function createRandomCenter(){
        intersectRiver = true;
        while (intersectRiver == true){
            randomSpace();
            if( (randomPlace > xLeft+0.08 && randomPlace < 0.92) || (randomPlace > (0-0.92)  && randomPlace < (0-xLeft-0.08))){
                xCoord = randomPlace;
                intersectRiver = false;
            }
        }
        intersectCanvas = true;
        while (intersectCanvas == true){
            randomSpace();
            if( (randomPlace < 0.92) && (randomPlace > (0-0.92) )){
                yCoord = randomPlace;
                intersectCanvas = false;
            }
        }
    }

    function distance(vec1, vec2){
        return dist = Math.sqrt( Math.pow((vec1[0]-vec2[0]), 2) + Math.pow((vec1[1]-vec2[1]), 2) );
    }

    //**********************************************
    //            Circle
    //*****************************************
    document.getElementById("Village").addEventListener("click", drawCircle);

    function drawCircle(){


        start[0] = 8;
        drawCirclePressed =true;
        noCircle = document.getElementById("count").value;
        //console.log(noCircle);

        //restrictions
        var maxLeft = -0.93;
        var maxRight = 0.93;
        var minLeft = 0-xLeft-0.07;
        var maxRight = xLeft+0.07;


        var r = 360;
        var radius = 0.05;//18 pix//0.07

        for ( var x = 0; x < noCircle; x++){


            var center;
            intersectCircle = true;
            while( intersectCircle == true){
                createRandomCenter();


                if( restrictedArray.length == 0){
                    center = vec2(xCoord, yCoord);
                    restrictedArray [x] = center;
                    intersectCircle = false;
                }
                else{
                    circleDetected = false;
                    for( var n = 0; n < x; n++){
                        var dist = Math.sqrt( Math.pow((restrictedArray[n][0]-xCoord), 2) + Math.pow((restrictedArray[n][1]-yCoord), 2) );
                        if( dist < 0.16){
                            circleDetected = true;
                            n = x;
                        }
                    }
                    if( circleDetected == false){
                        center = vec2(xCoord, yCoord);
                        restrictedArray [x] = center;
                        intersectCircle = false;
                    }

                }
            }



            //console.log(i);
            rockHouseTree( center);
            for (i = 0; i <= 32; i++){

                var newcircle;
                var angle = (i-1)/32 * 2*Math.PI;
                var here = vec2((r* Math.cos(angle)*2/canvas.width -1)*radius,
                    (2*(canvas.height-r*Math.sin(angle))/canvas.height-1)*radius) ;
                newcircle = vec2(here[0]+center[0]+0.05,here[1]+center[1]-0.05);

                gl.clear( gl.COLOR_BUFFER_BIT );
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(newcircle));

                t = vec4(colors[3]);

                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
                numIndices[numPolygons]++;
                index++;
            }



            circleEndIndex = circleBeginIndex+33;
            numPolygons++;
            numIndices[numPolygons] = 0;
            start[numPolygons] = index;

            render();

        }
        //startHouse[0] = numIndices[numPolygons];
        drawHouse();

    }

    function drawFruits(treeCenter){
        var noFruits = Math.round( Math.random()* 10 +parseFloat(3));
        //console.log(noFruits);
		var fruitColors = [];
		fruitColors.push( 1);
		fruitColors.push( 5);
		fruitColors.push( 7);
		fruitColors.push( 8);
		fruitColors.push( 9);
		fruitColors.push( 10);
		fruitColors.push( 11);
		fruitColors.push( 12);
		fruitColors.push( 22);
		fruitColors.push( 23);
		fruitColors.push( 24);
		fruitColors.push( 25);
		fruitColors.push( 26);
		fruitColors.push( 27);
		 var randomColor = Math.floor( Math.random() * fruitColors.length);
        for(var j = 0; j < noFruits; j++){


            var fCenter;
            intersectCircle = true;
            while( intersectCircle == true){
                var x = Math.random()* 0.05 +treeCenter[0]-0.04;
                var y = Math.random()*0.05 + treeCenter[1]-0.03;
                //var fCenter = vec2(x,y);
                //console.log(distance( fCenter, treeCenter) );


                if( fruitArray.length == 0){
                        fCenter = vec2(x,y);
                        fruitArray [j] = fCenter;
                        intersectCircle = false;

                }
                else{
                    circleDetected = false;
                    for( var n = 0; n < j; n++){
                        var dist = Math.sqrt( Math.pow((fruitArray[n][0]-x), 2) + Math.pow((fruitArray[n][1]-y), 2) );
                        if( dist < 0.01){
                            circleDetected = true;
                            n = j;
                        }
                    }
                    if( circleDetected == false){
                        fCenter = vec2(x,y);
                        fruitArray [j] = fCenter;
                        intersectCircle = false;
                    }

                }
            }

            //numTree++;
            // = createRandomCenter();


            var radius = 0.005;//0.05
            var r = 360;


            gl.clear( gl.COLOR_BUFFER_BIT );
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(fCenter));

            t = vec4(colors[fruitColors[randomColor]]);

            gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
            fruitIndices[numFruit]++;
            index++;

            for (i = 0; i <= 32; i++){

                var newcircle;
                var angle = (i-1)/32 * 2*Math.PI;
                var here = vec2((r* Math.cos(angle)*2/canvas.width -1)*radius,
                    (2*(canvas.height-r*Math.sin(angle))/canvas.height-1)*radius) ;

                newcircle = vec2(here[0]+fCenter[0]+0.005,here[1]+fCenter[1]-0.005);

                gl.clear( gl.COLOR_BUFFER_BIT );
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(newcircle));

                t = vec4(colors[fruitColors[randomColor]]);

                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

                fruitIndices[numFruit]++;
                index++;
            }

            numFruit++;
            fruitIndices[numFruit] = 0;
            startFruit[numFruit] = index;

            render();
        }

    }



    function drawTree(){
        var noTree = treeArray.length;
        //console.log(noTree);
        var treeColors = [];
		treeColors.push( 13);
		treeColors.push( 14);
		treeColors.push( 15);
		treeColors.push( 16);
		treeColors.push( 17);
      
        for(var j = 0; j < noTree; j++){
			  
		
			var randomColor = Math.floor( Math.random() * 5);
            //numTree++;
            var tCenter = treeArray[j];

            var radius = 0.035;//0.05
            var r = 360;


            gl.clear( gl.COLOR_BUFFER_BIT );
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(tCenter));

            t = vec4(colors[treeColors[randomColor]]);

            gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
            treeIndices[numTree]++;
            index++;

            for (i = 0; i <= 32; i++){

                var newcircle;
                var angle = (i-1)/32 * 2*Math.PI;
                var here = vec2((r* Math.cos(angle)*2/canvas.width -1)*radius,
                    (2*(canvas.height-r*Math.sin(angle))/canvas.height-1)*radius) ;

                newcircle = vec2(here[0]+tCenter[0]+0.035,here[1]+tCenter[1]-0.035);

                gl.clear( gl.COLOR_BUFFER_BIT );
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(newcircle));

                t = vec4(colors[treeColors[randomColor]]);

                gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

                treeIndices[numTree]++;
                index++;
            }



            numTree++;
            treeIndices[numTree] = 0;
            startTree[numTree] = index;

            render();

        }
        startFruit[0] = index;
        for( var x = 0; x < noTree; x++)
            drawFruits(treeArray[x]);
        startRock[0] = index;
        drawRock();
    }



    function drawRock(){

		var rockColors = [];
		rockColors.push( 28);
		rockColors.push( 29);
		rockColors.push( 30);
		
		
        
        var noRock = rockArray.length;
        console.log(noRock);
        for(var j = 0; j < noRock; j++){
			
			var randomColor = Math.floor( Math.random() * rockColors.length);
            var polNo = Math.round(Math.random() * 8 + 5.0);

            console.log("polNo" + polNo);

            var edgeNo = [];
            var i = 0;
            var say;
            while(i < polNo){
                say = Math.round(Math.random() * 32 +1);
                if( i == 0){
                    edgeNo[i] = say;
                    i++;
                }
                else{
                    var sameRandom = false;
                    for( var k = 0; k < edgeNo.length; k++){
                        if( say == edgeNo[k]){
                            sameRandom = true;
                            k = edgeNo.length;
                        }
                    }
                    if( sameRandom == false){
                        edgeNo[i] = say;
                        i++;
                    }
                }
            }
            edgeNo.sort(function(a, b){return a - b});

            //numTree++;
            var tCenter = rockArray[j];

            var radius = 0.035;//0.05
            var r = 360;


            gl.clear( gl.COLOR_BUFFER_BIT );
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(tCenter));

            t = vec4(colors[rockColors[randomColor]]);

            gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
            rockIndices[numRock]++;
            index++;

            for (i = 0; i <= 32; i++){

                for( var l = 0; l < polNo; l++){
                    if( edgeNo[l] == i){
                        var newcircle;
                        var angle = (i-1)/32 * 2*Math.PI;
                        var here = vec2((r* Math.cos(angle)*2/canvas.width -1)*radius,
                            (2*(canvas.height-r*Math.sin(angle))/canvas.height-1)*radius) ;

                        newcircle = vec2(here[0]+tCenter[0]+0.035,here[1]+tCenter[1]-0.035);

                        gl.clear( gl.COLOR_BUFFER_BIT );
                        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(newcircle));

                        t = vec4(colors[rockColors[randomColor]]);

                        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

                        rockIndices[numRock]++;
                        index++;
                    }
                }
                if( i == 32){
                    var newcircle;
                    var angle = (edgeNo[0]-1)/32 * 2*Math.PI;
                    var here = vec2((r* Math.cos(angle)*2/canvas.width -1)*radius,
                        (2*(canvas.height-r*Math.sin(angle))/canvas.height-1)*radius) ;

                    newcircle = vec2(here[0]+tCenter[0]+0.035,here[1]+tCenter[1]-0.035);

                    gl.clear( gl.COLOR_BUFFER_BIT );
                    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(newcircle));

                    t = vec4(colors[rockColors[randomColor]]);

                    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));

                    rockIndices[numRock]++;
                    index++;
                }
            }


            numRock++;
            rockIndices[numRock] = 0;
            startRock[numRock] = index;

            render();

        }


    }
/*1 kır 5  mag 7 pembe 8 9 turun 10 11 12 sarı

13-17 yeşil
18-21 mavi
22 24 mor
25-27 pembe
28-30 gri*/

//var randomColor = Math.floor( Math.random() * rockColors.length);
    //*******************************************
    //            HOUSE DRAWING
    //*************************************
    function drawHouse(){
		
		var homeColors = [];
		homeColors.push( 1);
		homeColors.push( 7);
		homeColors.push( 8);
		homeColors.push( 9);
		homeColors.push( 1);
		homeColors.push( 8);
		homeColors.push( 1);
		homeColors.push( 9);
		homeColors.push( 8);
		homeColors.push( 10);
		homeColors.push( 9);
		homeColors.push( 11);
		homeColors.push( 8);
		homeColors.push( 12);
		homeColors.push( 18);
		homeColors.push(20 );
		homeColors.push( 19);
		homeColors.push(21 );
		homeColors.push( 22);
		homeColors.push( 25);
		homeColors.push( 24);
		homeColors.push( 27);
		
        var noHouse = houseArray.length;
        //var v1,v2,v3,v4,v5,v6,v7,v8,v9,v10;

        for(var i = 0; i < noHouse; i++){
			
			var randomColor = Math.floor( Math.random() * homeColors.length);
			if( randomColor % 2 != 0)
				randomColor --;
				 
            var hCenter = houseArray[i];
            var x =  hCenter[0];
            var y =  hCenter[1];
            
           

 			houseVert[0] = vec2((x-0.04), y-0.03 );
            houseVert[1] =  vec2(x+0.04, y-0.03);

            houseVert[2] = vec2( x+0.04, y );
            houseVert[3] = vec2( x-0.04, y);

            houseVert[4] = vec2( x-0.04, y+0.03 );
            houseVert[5] = vec2( x+0.04, y+0.03 );

            houseVert[6] = vec2( x+0.02, y+0.01 );
            houseVert[7] = vec2( x+0.03, y+0.01);
            houseVert[8] = vec2( x+0.02, y+0.02 );
            houseVert[9] = vec2( x+0.03, y+0.02 );

            

             gl.clear( gl.COLOR_BUFFER_BIT );
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );

            numRect++;
            houseIndices[numRect] = 0;
            startHouse[numRect] = index;

            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(houseVert[0]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(houseVert[1]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(houseVert[3]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(houseVert[2]));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            index+=4;
            houseIndices[numRect]+=4;

			
            t = vec4(colors[homeColors[randomColor]]);

            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));

            numRect++;
            houseIndices[numRect] = 0;
            startHouse[numRect] = index;

            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(houseVert[2]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(houseVert[3]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(houseVert[5]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(houseVert[4]));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            index+=4;
            houseIndices[numRect]+=4;

            t = vec4(colors[homeColors[randomColor+1]]);

            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));

            numRect++;
            houseIndices[numRect] = 0;
            startHouse[numRect] = index;

            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(houseVert[6]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(houseVert[7]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(houseVert[9]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(houseVert[8]));

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            index+=4;
            houseIndices[numRect]+=4;

            t = vec4(colors[0]);

            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-4), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-3), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-2), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index-1), flatten(t));

            numRect++;
            houseIndices[numRect] = 0;
            startHouse[numRect] = index;

            render();
         }
         startTree[0] = index;
        drawTree();

    }



    function rockHouseTree( vecCenter){
        var distToHouse = -1;
        var distToTree = -1;
        var distToRock = -1;

        if( houseAttractor != null)
            distToHouse = distance( vecCenter, houseAttractor);
        if( treeAttractor != null)
            distToTree = distance( vecCenter, treeAttractor);
        if( rockAttractor != null)
            distToRock = distance( vecCenter, rockAttractor);

        if( distToRock != -1 && distToTree != -1 && distToHouse != -1){
            var total = distToRock + distToTree + distToHouse;
			distToRock = distToRock / total *100;
			distToTree = distToTree / total *100;
			distToHouse = distToHouse /total* 100;
			total = distToRock + distToTree + distToHouse;
			
            var result = Math.random()*(total);
            if ( result < distToRock)
                 decidedShape = 1;//rock
            else if ( result > distToRock +1 && result < distToRock + distToTree+1)
                decidedShape = 2; //tree
            else
                decidedShape = 0; // house
        }

        if ( distToRock == -1 &&  distToTree != -1 && distToHouse != -1){
            var total =  + distToTree + distToHouse;
			distToTree = distToTree / total *100;
			distToHouse = distToHouse /total* 100;
			total =  + distToTree + distToHouse;
			
            var result = Math.random()*(total);
            if ( result < distToTree)
                 decidedShape = 2;//tree
            else
                decidedShape = 1; // house
        }
        if( distToRock != -1 && distToTree == -1 && distToHouse != -1){
            var total = distToRock + distToHouse;
			distToRock = distToRock / total *100;
			distToHouse = distToHouse /total* 100;
			total = distToRock + distToHouse;
			
            var result = Math.random()*(total);
            if ( result < distToRock)
                 decidedShape = 2;//rock
            else
                decidedShape = 0; // house
        }
        if( distToRock != -1 && distToTree != -1 && distToHouse == -1){
            var total = distToRock + distToTree;
			distToRock = distToRock / total *100;
			distToTree = distToTree / total *100;
			total = distToRock + distToTree;
			
            var result = Math.random()*(total);
            if ( result < distToRock)
                 decidedShape = 1;//rock
            else
                decidedShape = 0; //tree
        }
        if( distToRock != -1 && distToTree == -1 && distToHouse == -1)
            decidedShape = 0;//rock
        if( distToRock == -1 && distToTree != -1 && distToHouse == -1)
            decidedShape = 1; //tree
        if( distToRock == -1 && distToTree == -1 && distToHouse != -1)
            decidedShape = 2; //house

        if( decidedShape == 0)
            rockArray.push(vecCenter);
        if( decidedShape == 1)
            treeArray.push(vecCenter);
        if( decidedShape == 2)
            houseArray.push(vecCenter);

    }





};




//***************************************
//            RENDER
//***************************************

function render() {



    //gl.useProgram( program);

    gl.clear( gl.COLOR_BUFFER_BIT );


    for(var i = 0; i<riverEndIndex; i+=4)
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );


    if( drawCirclePressed == true){
        for( var i = 0; i < numPolygons; i++)
             gl.drawArrays( gl.LINE_LOOP, start[i], numIndices[i] );
         startHouse[0] = numIndices[numPolygons];


     }

     for(var i = 0; i < numRect; i++)
         gl.drawArrays(gl.TRIANGLE_STRIP, startHouse[i] ,houseIndices[i]);

    //startTree[0] = houseIndices[numRect];

    for( var i = 0; i< numTree; i++)
        gl.drawArrays(gl.TRIANGLE_FAN, startTree[i], treeIndices[i]);

    for ( var i = 0; i < numFruit; i++)
        gl.drawArrays(gl.TRIANGLE_FAN, startFruit[i], fruitIndices[i]);

    for ( var i = 0; i < numRock; i++)
        gl.drawArrays(gl.TRIANGLE_FAN, startRock[i], rockIndices[i]);

    //console.log("in render");
    window.requestAnimFrame(render);

}
