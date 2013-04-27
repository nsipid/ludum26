var canvas = document.getElementById("chunk_canvas");
canvas.width = 512;
canvas.height = 512;
var ctx = canvas.getContext("2d");
var targetX = 0;
var targetY = 0;
var mouseX = 0;
var mouseY = 0;
var mouseCoords = 'X=' + mouseX +  ' Y=' + mouseY;

function clearCanvas () {
    ctx.canvas.width = ctx.canvas.width;
    ctx.fillStyle = '#999999';
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

var entities = [
    {
        x: 40,
        y: 40,
        nextX: 40,
        nextY: 40,
        width: 20,
        height: 20
    },

    {
        x : 140,
        y : 140,
        nextX: 140,
        nextY: 140,
        width: 20,
        height: 20
    }
];

var bullets = (function() {
    var ret = [];
    for ( var x = 0; x < 50; x++ ) {
        ret[x] = {
            x : 0,
            y : 0,
            width : 5,
            height : 5,
            nextX : 0,
            nextY : 0,
            dx : 0,
            dy : 0,
            visible : false
        };
    }
    return ret;
})();

function draw( guy ) {
    ctx.fillStyle = '#444444';
    ctx.fillRect( guy.x, guy.y, guy.width, guy.height );
}

function findFreeBullet() {
    for ( b in bullets ) {
        if ( !bullets[b].visible )
            return bullets[b];
    }
}

var then = Date.now();
var now = Date.now();
var dt = now - then;

function updateMain( ) {
    clearCanvas();

    // movement (updates player)
    if ( keysDown[37]) {
        entities[0].nextX = entities[0].x-1;
        //move left
    }
    if ( keysDown[39]) {
        entities[0].nextX = entities[0].x+1;
        // move right
    }
    if ( keysDown[38]) {
        entities[0].nextY = entities[0].y-1;
        // move up
    }
    if ( keysDown[40]) {
        entities[0].nextY = entities[0].y+1;
        // move down
    }
    if ( keysDown[32]) {
        // chunk your stuff
        var b = findFreeBullet();
        b.visible = true;
        targetX = mouseX;
        targetY = mouseY;
    }

    for ( e in entities ) {
        if ( checkCollision( entities[e], entities ) ) {
            entities[e].nextX = 0;
            entities[e].nextY = 0;
        } else {
            entities[e].x = entities[e].nextX;
            entities[e].y = entities[e].nextY;
        }
    }

    for ( b in bullets ) {
        if ( bullets[b].visible ) {
            if ( checkCollision( bullets[b], entities ) ) {
                bullets[b].visible = false;
            }
            t = 0.1; // needs to be an actual t
            bullets[b].x = (1 - t)*entities[0].x + t * targetX;
            bullets[b].y = (1 - t)*entities[0].y + t * targetY;
            draw( bullets[b] );
        }
    }

    // draw the guys
    for ( e in entities )
        draw( entities[e] );

    // draw mouse coords
    ctx.font = "20px Verdana";
    ctx.fillStyle = "#ff0000";
    ctx.fillText(mouseCoords, 350, 350);

    // request new frame
    requestAnimFrame(function() {
        updateMain();
    });
}

function distance ( obj1, obj2 ) {
    return Math.sqrt( obj1.x*obj2.x + obj1.y*obj2.y );
}

function checkCollision (testObject, collisionObjects) {
    for ( var i = 0; i < collisionObjects.length; i++ ){
        var object = collisionObjects[i];
        if (object.x + object.width <= testObject.nextX ||
            testObject.width + testObject.nextX <= object.x ||
            object.y + object.height <= testObject.nextY ||
            testObject.height + testObject.nextY <= object.y) {
            return false;
        }
    }
    return true;
}

function updateSplashScreen ( splashSize ) {
    if ( splashSize < 100 ) {

        clearCanvas();

        // draw mouse coords
        var speed = 1;
        var ds = speed + dt / 1000;
        var size = splashSize + ds;
        ctx.font = size + "px Verdana";
        ctx.fillStyle = "#777777";
        ctx.fillText('CHUNK', 50, 100);

        // request new frame
        requestAnimFrame(function() {
            updateSplashScreen( size );
        });
    } else {
        updateMain();
    }
}

// Keyboard 'buffer'
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false );

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

addEventListener("mousemove", function (e) {
    mouseX = e.localX;
    mouseY = e.localY;
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

    // run the game here
    // spalsh screen first
    updateSplashScreen( 0 );
};
