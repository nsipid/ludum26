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
        x: 240,
        y: 40,
        nextX: 240,
        nextY: 40,
        speed: 0.1,
        width: 20,
        height: 20
    },

    {
        x : 60,
        y : 140,
        nextX: 60,
        nextY: 140,
        speed: 0.1,
        width: 20,
        height: 20
    }
];

var Bullet = function() {
    return {
        x : 0,
        y : 0,
        originX : 0,
        originY : 0,
        destX : 0,
        destY : 0,
        width : 5,
        height : 5,
        nextX : 0,
        nextY : 0,
        speed : 0.3,
        distanceTravelled: 0
    };
};

var bullets = [];

function draw( thing ) {
    ctx.fillStyle = '#444444';
    ctx.fillRect( thing.x, thing.y, thing.width, thing.height );
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
        entities[0].nextX = entities[0].x-entities[0].speed * dt();
        //move left
    }
    if ( keysDown[39]) {
        entities[0].nextX = entities[0].x+entities[0].speed * dt();
        // move right
    }
    if ( keysDown[38]) {
        entities[0].nextY = entities[0].y-entities[0].speed * dt();
        // move up
    }
    if ( keysDown[40]) {
        entities[0].nextY = entities[0].y+entities[0].speed * dt();
        // move down
    }
    if ( keysDown[32]) {
    }

    // set the entities x and y by nextX and nextY
    for ( e in entities ) {
        if ( !checkCollision( entities[e], entities ) 
                && !checkOutsideBoundary( entities[e], ctx ) ) {
            entities[e].x = entities[e].nextX;
            entities[e].y = entities[e].nextY;
        }
    }

    for ( b in bullets ) {
        var newBullet = nextBulletAlongLine( bullets[b] );

        // if bullet hits something
        if ( checkCollision( newBullet, entities ) ) {
            delete bullets[b];
            continue;
        }

        // if bullet leaves stage
        if ( checkOutsideBoundary ( newBullet, ctx ) ) {
            delete bullets[b];
            continue;
        }

        // else
        bullets[b] = newBullet;
        draw( bullets[b] );
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

function distance(point1,point2) {
    var xs = 0;
    var ys = 0;
    xs = point2.x - point1.x;
    xs = xs * xs;
    ys = point2.y - point1.y;
    ys = ys * ys;
    return Math.sqrt( xs + ys );
}

function checkCollision (testObject, collisionObjects) {
    var collides = false;

    for ( var i = 0; i < collisionObjects.length; i++ ){
        if ( testObject === collisionObjects[i] ) continue;
        var object = collisionObjects[i];
        if (!(object.x + object.width <= testObject.nextX ||
            testObject.width + testObject.nextX <= object.x ||
            object.y + object.height <= testObject.nextY ||
            testObject.height + testObject.nextY <= object.y)) {
            if ( testObject.shooter !== object )
                collides = true;
        }
    }

    return collides;
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

    bullet.distanceTravelled = bullet.distanceTravelled + (dt() * bullet.speed);
    bullet.x = Math.round(bullet.originX + nX3*bullet.distanceTravelled);
    bullet.y = Math.round(bullet.originY + nY3*bullet.distanceTravelled);

    // hacks
    bullet.nextX = bullet.x;
    bullet.nextY = bullet.y;

    return bullet;
}

function shoot ( entity, x, y ) {
    var b = new Bullet;
    b.x = entities[0].x;
    b.y = entities[0].y;
    b.originX = entities[0].x;
    b.originY = entities[0].y;
    b.destX = x;
    b.destY = y;
    b.shooter = entity;

    // find an unused slot in bullets
    for ( var i = 0; i < bullets.length; i++ ) {
        if ( bullets[i] === undefined ) {
            bullets[i] = b;
            return;
        }
    }

    // otherwise tack it onto the end
    bullets.push(b);
}

function updateSplashScreen ( splashSize ) {
    if ( splashSize < 100 ) {

        clearCanvas();

        // draw mouse coords
        var speed = 0.5;
        var ds = speed + dt() / 1000;
        var size = splashSize + ds;
        ctx.font = size + "px Verdana";
        ctx.fillStyle = "#777777";
        ctx.fillText('CHUNK', 256 - size * 1.7, 250);

        // request new frame
        requestAnimFrame(function() {
            updateSplashScreen( size );
        });
    } else {
        // request new frame
        requestAnimFrame(function() {
            updateSplashScreen( size );
        });
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

addEventListener("mousedown", skipSplash, false);

function mouseClick(e) {
    shoot( entities[0], e.offsetX, e.offsetY );
}

function skipSplash (e) {
    then(Date.now());
    updateMain();
    removeEventListener("mousedown", skipSplash, false);
    addEventListener("mousedown", mouseClick, false);
}

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
    // splash screen first
    updateSplashScreen( 0 );
    //updateMain();
};
