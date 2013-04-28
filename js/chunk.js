
// put a canvas on in the DOM
var canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundImage = 'url("https://github.com/nsipid/ludum26/blob/master/images/background.png?raw=true")';
document.body.appendChild( canvas );
var ctx = canvas.getContext("2d");

// put the script in the DOM
var reactiveScript = document.createElement('script');
reactiveScript.src = "https://github.com/mattbaker/Reactive.js/raw/master/src/reactive.js";
document.body.appendChild( reactiveScript );

function clearCanvas() {
    ctx.canvas.width = ctx.canvas.width;
}

// need to add
/*
*/

var entities = [
    {
        x: 240,
        y: 40,
        nextX: 240,
        nextY: 40,
        speed: 0.1,
        width: 60,
        height: 60,
	img: document.createElement('img'),
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/snazzy.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 1
    },
    {
        x: 60,
        y: 140,
        nextX: 60,
        nextY: 140,
        speed: 0.1,
        width: 60,
        height: 60,
	img: document.createElement('img'),
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/monk.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 2,
        originX: 60,
        originY: 140,
        destX: 100,
        destY: 160,
        victim: null,
        distanceTravelled: 0,
        destCooldown: 0,
        huntCooldown: 0,
        shootCooldown: 0
    },
    {
        x: 140,
        y: 40,
        nextX: 140,
        nextY: 40,
        speed: 0.1,
        width: 60,
        height: 60,
	img: document.createElement('img'),
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/ardiente.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 3,
        originX: 140,
        originY: 40,
        destX: 30,
        destY: 40,
        victim: null,
        distanceTravelled: 0,
        destCooldown: 0,
        huntCooldown: 0,
        shootCooldown: 0
    },
    {
        x: 40,
        y: 40,
        nextX: 40,
        nextY: 40,
        speed: 0.1,
        width: 60,
        height: 60,
	img: document.createElement('img'),
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/douchebag.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 4,
        originX: 40,
        originY: 40,
        destX: 60,
        destY: 140,
        victim: null,
        distanceTravelled: 0,
        destCooldown: 0,
        huntCooldown: 0,
        shootCooldown: 0
    }
];

var Bullet = function () {
    return {
        x: 0,
        y: 0,
        originX: 0,
        originY: 0,
        destX: 0,
        destY: 0,
        width: 5,
        height: 5,
        nextX: 0,
        nextY: 0,
        speed: 0.3,
        distanceTravelled: 0
    };
};

var bullets = [];

function drawCharacter( thing ) {
    ctx.fillStyle = '#444444';
    // ctx.fillRect( thing.x, thing.y, thing.width, thing.height );
    ctx.drawImage( thing.img, thing.x, thing.y, thing.width, thing.height );
}

function drawBullet( thing ) {
    ctx.fillStyle = '#444444';
    ctx.fillRect(thing.x, thing.y, thing.width, thing.height);
}

function updateMain( ) {
    now(Date.now());
    clearCanvas();

    // movement (updates player)
    if (keysDown[37]) {
        entities[0].nextX = entities[0].x - entities[0].speed * dt();
        //move left
    }
    if (keysDown[39]) {
        entities[0].nextX = entities[0].x + entities[0].speed * dt();
        // move right
    }
    if (keysDown[38]) {
        entities[0].nextY = entities[0].y - entities[0].speed * dt();
        // move up
    }
    if (keysDown[40]) {
        entities[0].nextY = entities[0].y + entities[0].speed * dt();
        // move down
    }
    if ( keysDown[32]) {
    }

    // AI (updates AI)
    //
    // this state changing code should only happen every half second
    if ( stateChangeTimer < 0 ) {
        for ( var i = 1; i < entities.length; i++ ) { // everyone but the player
            for ( var j = 0; j < entities.length; j++ ) {
                if ( entities[i] === entities[j] ) continue; // that's a me!

                if ( canSee( entities[i], entities[j] ) ) {
                    entities[i].state = "attacking";
                    entities[i].victim = entities[j];
                    break; // found someone, that's enough for now
                    // NOTE: this means the AI will gang up on player,
                    // or if player is not around, will gang up on entities[1]
                    // or if entities[1] is not around, will gang up on entities[2], etc...
                } else {
                    entities[i].state = "hunting";
                }
            }
        }
        stateChangeTimer = 500; // every half second
    }

    // AI Movement and shooting
    for ( var i = 1; i < entities.length; i ++ ) {
        var newEntity = nextBulletAlongLine( entities[i] );

        if ( newEntity.state == "attacking" ) {
            // shoot 'nearby' the entity at random
            if ( newEntity.shootCooldown < 0 ) {
                shoot( newEntity,
                       newEntity.victim.x + (Math.random() * 40) - 20,
                       newEntity.victim.y + (Math.random() * 40) - 20 );
                newEntity.shootCooldown = 100; // shoot every 100 milliseconds
            }

            if ( newEntity.huntCooldown < 0 ) {
                // move to 'nearby' the entity at random
                newEntity.destX = newEntity.victim.x + (Math.random() * 40) - 20;
                newEntity.destY = newEntity.victim.y + (Math.random() * 40) - 20;
                newEntity.huntCooldown = 50; // change dest every 50 milliseconds
            }
        }
        if ( newEntity.state == "hunting") {
            if ( newEntity.destCooldown < 0 ) {
                newEntity.destX = newEntity.x + (Math.random() * 100) - 50;
                newEntity.destY = newEntity.y + (Math.random() * 100) - 50;
                newEntity.originX = newEntity.x;
                newEntity.originY = newEntity.y;
                newEntity.destCooldown = 200; // change hunt dest every 200 milliseconds
		newEntity.distanceTravelled = 0; // need to reset for getNextThing
            }
        }
	newEntity.destCooldown--;
	newEntity.huntCooldown--;
	newEntity.shootCooldown--;
        entities[i] = newEntity;
    }

    // set the entities x and y by nextX and nextY
    for (e in entities) {
        if (!checkCollision(entities[e], entities)
                && !checkOutsideBoundary(entities[e], ctx)) {
            entities[e].x = entities[e].nextX;
            entities[e].y = entities[e].nextY;
        }
    }

    for (b in bullets) {
        var newBullet = nextBulletAlongLine(bullets[b]);

        var onCollision = function (entity) {
            //if we collided into a player
            if (entity.actualJunk !== undefined) {
                entity.actualJunk++;
                console.log("Player " + entity.playerId + " gains actual junk\n");
                if (newBullet.shooter.actualJunk > 0) {
                    newBullet.shooter.actualJunk--;
                    //console.log("Player " + newBullet.shooter.playerId + " loses actual junk\n");
                }
            } else {
                //obstacle
                newBullet.shooter.throwableJunk++;
                //console.log("Player " + newBullet.shooter.playerId + " gains throwable junk\n");
            }
        }

        // if bullet hits something
        if (checkCollision(newBullet, entities, onCollision)) {
            delete bullets[b];
            continue;
        }

        // if bullet leaves stage
        if (checkOutsideBoundary(newBullet, ctx)) {
            //console.log("Player " + newBullet.shooter.playerId + " gains throwable junk\n");
            newBullet.shooter.throwableJunk++;
            delete bullets[b];
            continue;
        }

        // else
        bullets[b] = newBullet;
        drawBullet( bullets[b] );
    }

    // draw the guys
    for (e in entities)
        drawCharacter( entities[e] );

    // draw debug info
    for (e in entities) {
	ctx.font = "20px Verdana";
	ctx.fillStyle = "#ff0000";
	ctx.fillText("throwable junk: " + entities[e].throwableJunk,
		     entities[e].x,
		     entities[e].y);
	ctx.fillText("actual junk: " + entities[e].actualJunk,
		     entities[e].x,
		     entities[e].y - 20);
    }
    
    then(Date.now()); // then is now now

    stateChangeTimer--; // for the next possible AI statechange

    // request new frame
    requestAnimFrame(function () {
        updateMain();
    });
}

function distance(point1, point2) {
    var xs = 0;
    var ys = 0;
    xs = point2.x - point1.x;
    xs = xs * xs;
    ys = point2.y - point1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
}

function checkCollision(testObject, collisionObjects, onCollision) {
    var collides = false;

    for (var i = 0; i < collisionObjects.length; i++) {
        if (testObject === collisionObjects[i]) continue;
        var object = collisionObjects[i];
        if (!(object.x + object.width <= testObject.nextX ||
            testObject.width + testObject.nextX <= object.x ||
            object.y + object.height <= testObject.nextY ||
            testObject.height + testObject.nextY <= object.y)) {
            if (testObject.shooter !== object) {
                collides = true;
                if (onCollision !== undefined) {
                    onCollision(collisionObjects[i]);
                }
            }
        }
    }

    return collides;
}

function checkOutsideBoundary(testObject, ctx) {
    if (testObject.nextX < 0
        || testObject.nextY < 0
        || testObject.nextX > ctx.canvas.width
        || testObject.nextY > ctx.canvas.height) {
        return true;
    }
    return false;
}

function nextBulletAlongLine(bullet) {
    var x3 = bullet.destX - bullet.originX;
    var y3 = bullet.destY - bullet.originY;
    var d3 = Math.sqrt(x3 * x3 + y3 * y3);
    var nX3 = x3 / d3;
    var nY3 = y3 / d3;

    bullet.distanceTravelled = bullet.distanceTravelled + (dt() * bullet.speed);
    bullet.x = Math.round(bullet.originX + nX3 * bullet.distanceTravelled);
    bullet.y = Math.round(bullet.originY + nY3 * bullet.distanceTravelled);

    // hacks
    bullet.nextX = bullet.x;
    bullet.nextY = bullet.y;

    return bullet;
}

function shoot(entity, x, y) {
    if (entity.throwableJunk === 0) {
        console.log("Player " + entity.playerId + " had no junk to throw.");
        return;
    }

    entity.throwableJunk--;
    console.log("Player " + entity.playerId + " loses throwable junk\n");

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

function canSee( entity1, entity2 ) {
    var ret = false;
    if ( distance(entity1, entity2) < 100 ) ret = true;
    return ret;
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
        requestAnimFrame(function () {
            updateSplashScreen(size);
        });
    } else {
        // request new frame
        requestAnimFrame(function () {
            updateSplashScreen(size);
        });
    }
}

// kinda dumb, but some of this can't be run before DOM is complete
function init() {
    targetX = 0;
    targetY = 0;

    mouseX = $R.state(0);
    mouseY = $R.state(0);
    mouseCoords = $R(function (mouseX, mouseY) { return 'X=' + mouseX + ' Y=' + mouseY; });
    mouseCoords.bindTo(mouseX, mouseY);

    then = $R.state(Date.now());
    now = $R.state(Date.now());
    dt = $R(function (now, then) { return now - then; });
    dt.bindTo(now, then);

    stateChangeTimer = 100;

    // this is dumb, but...
    for ( e in entities ) {
	entities[e].img.src = entities[e].imageSrc;
    }

    // Keyboard 'buffer'
    keysDown = {};

    addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
    }, false);

    addEventListener("mousedown", skipSplash, false);

    function mouseClick(e) {
	shoot(entities[0], e.offsetX, e.offsetY);
    }

    function skipSplash(e) {
	then(Date.now());
	updateMain();
	removeEventListener("mousedown", skipSplash, false);
	addEventListener("mousedown", mouseClick, false);
    }

    addEventListener("mousemove", function (e) {
	mouseX(e.offsetX);
	mouseY(e.offsetY);
    }, false);

}

// animation loop across multiple browsers
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    // disable scrolling
    document.onkeydown = function () { return event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 32; };

    // do some nasty global initialization first
    init();

    // run the game here
    // splash screen first
    updateSplashScreen(0);
    //updateMain();
};
