var canvas = document.getElementById("chunk_canvas");
canvas.width = 512;
canvas.height = 512;
var ctx = canvas.getContext("2d");
var targetX = 0;
var targetY = 0;
var mouseX = $R.state(0);
var mouseY = $R.state(0);
var mouseCoords = $R(function(mouseX, mouseY){ return 'X=' + mouseX +  ' Y=' + mouseY; });
mouseCoords.bindTo( mouseX, mouseY );

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
            originX : 0,
            originY : 0,
            destX : 100,
            destY : 200,
            width : 5,
            height : 5,
            nextX : 0,
            nextY : 0,
            speed : 10,
            distanceTravelled: 0,
            visible : true 
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

var then = $R.state( Date.now() );
var now = $R.state( Date.now() );
var dt = $R(function(now, then){ return now - then; });
dt.bindTo(now, then);

function updateMain( ) {
    now(Date.now());
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
        if ( checkCollision( entities[e], entities ) 
                || checkOutsideBoundary( entities[e], ctx ) ) {
            entities[e].nextX = 0;
            entities[e].nextY = 0;
        } else {
            entities[e].x = entities[e].nextX;
            entities[e].y = entities[e].nextY;
        }
    }

    for ( b in bullets ) {
        if ( bullets[b].visible ) {
            var newBullet = nextBulletAlongLine( bullets[b] );
            if ( checkCollision( newBullet, bullets ) ) {
                bullets[b].visible = false;
            }
            if ( !checkOutsideBoundary ( bullets[b], ctx ) ) {
                bullets[b] = newBullet;
                draw( bullets[b] );
            }
        }
    }

    // draw the guys
    for ( e in entities )
        draw( entities[e] );

    // draw mouse coords
    ctx.font = "20px Verdana";
    ctx.fillStyle = "#ff0000";
    ctx.fillText(mouseCoords(), 350, 350);
    
    then(Date.now()); // then is now now

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

function checkOutsideBoundary (testObject, ctx) {
    if (testObject.nextX < 0 
        || testObject.nextY < 0 
        || testObject.nextX > ctx.width 
        || testObject.nextY > ctx.width){
                return true;
        }
       return false; 
}

function nextBulletAlongLine(bullet) {
    var x3 = bullet.destX - bullet.originX;
    var y3 = bullet.destY - bullet.originY;
    var d3 = Math.sqrt ( x3*x3 + y3*y3 ); 
    var nX3 = x3 / d3;
    var nY3 = y3 / d3;

    var nextBullet= {};
    nextBullet.prototype = bullet;
    nextBullet.distanceTravelled = bullet.distanceTravelled + (dt() * bullet.speed);
    nextBullet.x = bullet.originX + nX3*nextBullet.distanceTravelled;
    nextBullet.y = bullet.originY + nY3*nextBullet.distanceTravelled;
    return nextBullet;
}

function updateSplashScreen ( splashSize ) {
    if ( splashSize < 100 ) {

        clearCanvas();

        // draw mouse coords
        var speed = 1;
        var ds = speed + dt() / 1000;
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
    mouseX(e.offsetX);
    mouseY(e.offsetY);
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
