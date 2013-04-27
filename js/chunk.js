var canvas = document.getElementById("chunk_canvas");
canvas.width = 512;
canvas.height = 512;
var ctx = canvas.getContext("2d");

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

function draw( guy ) {
    ctx.fillStyle = '#444444';
    ctx.fillRect( guy.x, guy.y, guy.width, guy.height );
}

function update() {
    // update stuff
    ctx.canvas.width = ctx.canvas.width;
    ctx.fillStyle = '#999999';
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

    // movement (updates player)
    if ( keysDown[37]) {
        entities[0].nextX = entities[0].x--;
        //move left
    }
    if ( keysDown[39]) {
        entities[0].nextX = entities[0].x++;
        // move right
    }
    if ( keysDown[38]) {
        entities[0].nextY = entities[0].y--;
        // move up
    }
    if ( keysDown[40]) {
        entities[0].nextY = entities[0].y++;
        // move down
    }
    if ( keysDown[32]) {
        // chunk your stuff
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

    // draw the guys
    for ( e in entities )
        draw( entities[e] );

    // request new frame
    requestAnimFrame(function() {
        update( ctx );
    });
}

function checkCollision (testObject, collisionObjects) {
    for ( var i = 0; i < collisionObjects.length; i++ ){
        var object = collisionObjects[i];
        if (object.x + object.width <= testObject.nextX ||
            testObject.width + testObject.nextX <= object.x ||
            object.y + object.height <= testObject.nextY ||
            testObject.height + testObject.nextY <= object.y) {
            return true;
        }
    }
    return false;
}

// Keyboard 'buffer'
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false );

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
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
    update();
};
