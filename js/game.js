var Immortal = {
    guy : {
	x : 40,
	y : 40,
	height : 40,
	width : 40,
	level : 0,
	step : 0,
	stepPadding : 0,
	draw : function ( ctx ) {
	    ctx.drawImage( Immortal.guy.img,  Immortal.guy.step * Immortal.guy.width, Immortal.guy.level * Immortal.guy.height, 
			   Immortal.guy.width, Immortal.guy.height, Immortal.guy.x, Immortal.guy.y, Immortal.guy.width, Immortal.guy.height); 
	},
	moveLeft : function (ctx) {
	    Immortal.guy.x = Immortal.guy.x <= 0 ? 0 : Immortal.guy.x - 1;
	    Immortal.guy.level = 3;
	    if ( Immortal.guy.stepPadding === 0)
            {
	        Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
	    Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10; 
        },
	moveRight : function (ctx) {
	    Immortal.guy.x =  Immortal.guy.x +  Immortal.guy.width >= ctx.canvas.width ?  ctx.canvas.width -  Immortal.guy.width :  Immortal.guy.x + 1;
	    Immortal.guy.level = 1;
	    if ( Immortal.guy.stepPadding === 0) 
            {
	        Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
	    Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10;
	},
	moveDown : function (ctx) {
	        Immortal.guy.y =  Immortal.guy.y +  Immortal.guy.height >= ctx.canvas.height ?   ctx.canvas.height -  Immortal.guy.height:  Immortal.guy.y + 1;		   
            Immortal.guy.level = 0;
	    if ( Immortal.guy.stepPadding === 0)
            {
	        Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
	    Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10;
	},
        moveUp : function (ctx) {
			Immortal.guy.y =  Immortal.guy.y <= 0 ?  0 : Immortal.guy.y - 1;
            Immortal.guy.level = 2;
	    if ( Immortal.guy.stepPadding === 0)
            {
	        Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
	    Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10;
        }

    },

    drawEllipse : function(ctx, color, centerX, centerY, width, height) {
    
	ctx.beginPath();
	
	ctx.moveTo(centerX, centerY - height/2);
	
	ctx.bezierCurveTo(
            centerX + width/2, centerY - height/2,
            centerX + width/2, centerY + height/2,
            centerX, centerY + height/2);

	ctx.bezierCurveTo(
            centerX - width/2, centerY + height/2,
            centerX - width/2, centerY - height/2,
            centerX, centerY - height/2);
	
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
    },

    update : function( ctx ) {
	// update stuff
	ctx.canvas.width = ctx.canvas.width;
	ctx.fillStyle = '#999999';
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

	if ( keysDown[37]) { //left!
            Immortal.guy.moveLeft(ctx);
	}
	if ( keysDown[39]) { // right!
            Immortal.guy.moveRight(ctx);
	}
	if ( keysDown[38]) { // up!
            Immortal.guy.moveUp(ctx);
	}
	if ( keysDown[40]) {
            Immortal.guy.moveDown(ctx);
	}
        
	// draw the guy
        Immortal.guy.draw( ctx );

	// request new frame
        requestAnimFrame(function() {
            Immortal.update( ctx );
        });
    },

    init : function() {
	var canvas = document.getElementById("immortal_canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 640;
	canvas.height = 480;

	ctx.fillStyle = '#999999';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	Immortal.guy.img = document.createElement('img');
	Immortal.guy.img.src = "./images/GuyLightExample.png";
	Immortal.update( ctx );
    }
};

// Keyboard 'buffer'
var keysDown = {};
var left = false;
var right = false;
var up = false;
var down = false;

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    if (e.keyCode === 37) {
	left = true;
    }
    if (e.keyCode === 39) {
	right = true;
    }
    if (e.keyCode === 38) {
	up = true;
    }
    if (e.keyCode === 40) {
	down = true;
    }
}, false );

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
    if (e.keyCode === 37) {
	left = false;
    }
    if (e.keyCode === 39) {
	right = false;
    }
    if (e.keyCode === 38) {
	up = false;
    }
    if (e.keyCode === 40) {
	down = false;
    }
}, false);


// animation loop across multiple browsers
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	    	
	    window.setTimeout(callback, 1000 / 60);
	};
})();

window.onload = function() {
    // disable scrolling
    document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=32};
    Immortal.init();
};
