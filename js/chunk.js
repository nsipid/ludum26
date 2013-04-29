
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

var junkLevel0 = document.createElement('img');
junkLevel0.src = "https://github.com/nsipid/ludum26/raw/master/images/low-junk.png";
var junkLevel1 = document.createElement('img');
junkLevel1.src = "https://github.com/nsipid/ludum26/raw/master/images/middle-junk.png";
var junkLevel2 = document.createElement('img');
junkLevel2.src = "https://github.com/nsipid/ludum26/raw/master/images/high-junk.png";

var junkSprite = {
    x: 600,
    y: 400,
    img: junkLevel1
};

var obstacles = [
    {
	x: 300,
	y: 40,
	width: 187,
	height: 174,
	img: document.createElement('img'),
	imageSrc: "https://github.com/nsipid/ludum26/raw/master/images/obstacle-boxes.png"
    },
    {
	x: 20,
	y: 60,
	width: 125,
	height: 196,
	img: document.createElement('img'),
	imageSrc: "https://github.com/nsipid/ludum26/raw/master/images/obstacle-couch.png"
    },
    {
	x: 700,
	y: 60,
	width: 87,
	height: 92,
	img: document.createElement('img'),
	imageSrc: "https://github.com/nsipid/ludum26/raw/master/images/obstacle-crate.png"
    },
    {
	x: 590,
	y: 400,
	width: 72,
	height: 93,
	img: document.createElement('img'),
	imageSrc: "https://github.com/nsipid/ludum26/raw/master/images/obstacle-paint-cans.png"
    }
];

var entities = [
    {
        x: 600,
        y: 60,
        nextX: 700,
        nextY: 60,
        speed: 0.1,
        width: 74,
        height: 101,
        img: document.createElement('img'),
        flippedImg: document.createElement('img'),
        flippedImgSrc: 'https://github.com/nsipid/ludum26/blob/master/images/snazzy_sprite_sheet_flipped.png?raw=true',
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/snazzy_sprite_sheet.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 1,
        spriteState: 0,
        lastSpriteTime: 0,
    },
    {
        x: 130,
        y: 230,
        nextX: 60,
        nextY: 60,
        speed: 0.1,
        width: 74,
        height: 101,
        img: document.createElement('img'),
        flippedImg: document.createElement('img'),
        flippedImgSrc: 'https://github.com/nsipid/ludum26/blob/master/images/monk_sprite_sheet_flipped.png?raw=true',
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/monk_sprite_sheet.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 2,
        originX: 60,
        originY: 60,
        destX: 65,
        destY: 65,
        victim: null,
        distanceTravelled: 0,
        destCooldown: 0,
        huntCooldown: 0,
        shootCooldown: 0,
	fleeCooldown: 0,
        spriteState: 0,
        lastSpriteTime: 0,
    },
    {
        x: 500,
        y: 500,
        nextX: 700,
        nextY: 500,
        speed: 0.1,
        width: 74,
        height: 101,
        img: document.createElement('img'),
        flippedImg: document.createElement('img'),
        flippedImgSrc: 'https://github.com/nsipid/ludum26/blob/master/images/ardiente_sprite_sheet_flipped.png?raw=true',
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/ardiente_sprite_sheet.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 3,
        originX: 700,
        originY: 500,
        destX: 705,
        destY: 505,
        victim: null,
        distanceTravelled: 0,
        destCooldown: 0,
        huntCooldown: 0,
        shootCooldown: 0,
	fleeCooldown: 0,
        spriteState: 0,
        lastSpriteTime: 0,
    },
    {
        x: 60,
        y: 500,
        nextX: 60,
        nextY: 500,
        speed: 0.1,
        width: 74,
        height: 101,
        img: document.createElement('img'),
        flippedImg: document.createElement('img'),
        flippedImgSrc: 'https://github.com/nsipid/ludum26/blob/master/images/dbag_sprite_sheet_flipped.png?raw=true',
        imageSrc : 'https://github.com/nsipid/ludum26/blob/master/images/dbag_sprite_sheet.png?raw=true',
        actualJunk: 10,
        throwableJunk: 10,
        playerId: 4,
        originX: 60,
        originY: 500,
        destX: 65,
        destY: 505,
        victim: null,
        distanceTravelled: 0,
        destCooldown: 0,
        huntCooldown: 0,
        shootCooldown: 0,
	fleeCooldown: 0,
        spriteState: 0,
        lastSpriteTime: 0,
    }
];

var player = entities[0];

var Bullet = function () {
    return {
        x: 0,
        y: 0,
        originX: 0,
        originY: 0,
        destX: 0,
        destY: 0,
        width: 25,
        height: 25,
        nextX: 0,
        nextY: 0,
        speed: 0.3,
        distanceTravelled: 0
    };
};

var bullets = [];

function drawCharacter( thing ) {
    ctx.fillStyle = '#444444'; 

    var image = thing.flipped ? thing.flippedImg : thing.img;

    if (thing.spriteState === 0) {
        ctx.drawImage(image, 0, 0, thing.width, thing.height, thing.x, thing.y, thing.width, thing.height);
    } else {
        ctx.drawImage(image, thing.width, 0, thing.width, thing.height, thing.x, thing.y, thing.width, thing.height);
    }
}

var drawThing = function ( thing ) {
    ctx.drawImage(thing.img, 0, 0, thing.img.width, thing.img.height, thing.x, thing.y, thing.img.width, thing.img.height);
}
// aliases
var drawObstacle = drawThing;
var drawBullet = drawThing;

function updateSpriteState(sprite) {
    sprite.lastSpriteTime += dt();
    if (sprite.lastSpriteTime === 0 || sprite.lastSpriteTime >= 100) {
        sprite.lastSpriteTime = 0;
        sprite.spriteState++;
        sprite.spriteState %= 2;
    }
}

function updateMain( ) {
    now(Date.now());
    clearCanvas();
    for (var e in entities) {
        entities[e].nextX = entities[e].x;
        entities[e].nextY = entities[e].y;
    }

    // movement (updates player)
    if (keysDown[37] || keysDown[65]) {
        player.nextX = Math.floor(player.x - player.speed * dt());
        //move left
    }
    if (keysDown[39] || keysDown[68]) {
        player.nextX = Math.floor(player.x + player.speed * dt());
        // move right
    }
    if (keysDown[38] || keysDown[87]) {
        player.nextY = Math.floor(player.y - player.speed * dt());
        // move up
    }
    if (keysDown[40] || keysDown[83]) {
        player.nextY = Math.floor(player.y + player.speed * dt());
        // move down
    }
    if ( keysDown[32]) {
	// do something with spacebar
    }

    // drawing the obstacles
    for ( o in obstacles ) {
	drawObstacle( obstacles[o] );
    }

    // AI (updates AI)
    //
    // this state changing code should only happen every half second
    if ( stateChangeTimer < 0 ) {
        for ( var i = 0; i < entities.length; i++ ) {
	    if ( entities[i] === player ) continue; // everyone but the player
            for ( var j = 0; j < entities.length; j++ ) {
		// ouch I got hit, run away!
		if ( entities[i].gotHit ) {
		    entities[i].state = "fleeing";
		    entities[i].gotHit = false; // okay let's get back into it (at next state change)
		    break;
		}

		// for the opponents
                if ( entities[i] === entities[j] ) continue; // I'm not my own opponent!

                if ( canSee( entities[i], entities[j] ) ) {
                    entities[i].state = "attacking";
                    entities[i].victim = entities[j];
                    break; // found someone, that's enough for now
                    // NOTE: this means the AI will gang up on player,
                    // or if player is not around, will gang up on entities[1]
                    // or if entities[1] is not around, will gang up on entities[2], etc...
                } else {
                    entities[i].state = "seeking";
                }
            }
        }
        stateChangeTimer = 100; // every 100ms
    }

    // AI Movement and shooting
    for ( var i = 0; i < entities.length; i ++ ) {
	if ( entities[i] === player ) continue; // everyone but the player
        var newEntity = nextThingAlongLine( entities[i] );

	updateXY(newEntity);

	var findPointNear = function ( x, y, dist ) {
	    // let's make sure the destination isn't invalid
	    var pending = { nextX: 9999, nextY: 9999, width: newEntity.width, height: newEntity.height };
	    while ( checkOutsideBoundary( pending ) ) {
                pending.nextX = x + (Math.random() * dist * 2) - dist;
                pending.nextY = y + (Math.random() * dist * 2) - dist;
	    }

	    return pending;
	};

	var findPointFar = function ( x, y, min ) {
	    var dist = min * 2;
	    // let's make sure the destination isn't invalid
	    var pending = { nextX: 9999, nextY: 9999, width: newEntity.width, height: newEntity.height };
	    while ( checkOutsideBoundary( pending ) &&
		  distance({x:x, y:y}, {x:pending.nextX, y:pending.nextY}) < min ) {
                pending.nextX = x + (Math.random() * dist * 2) - dist;
                pending.nextY = y + (Math.random() * dist * 2) - dist;
	    }

	    return pending;
	};

	if ( newEntity.state == "fleeing" ) {
	    // move far from the entity at random
            if ( newEntity.huntCooldown < 0 ) {
		var destination = findPointFar( newEntity.x, newEntity.y, 200 );
		newEntity.destX = destination.nextX;
		newEntity.destY = destination.nextY;
                newEntity.originX = newEntity.x;
                newEntity.originY = newEntity.y;
                newEntity.fleeCooldown = 300; // change flee dest every 300ms
		newEntity.distanceTravelled = 0; // need to reset for getNextThing
            }
	}

        if ( newEntity.state == "attacking" ) {
            // shoot 'nearby' the entity at random
            if ( newEntity.shootCooldown < 0 ) {
                shoot( newEntity,
                       newEntity.victim.x + (Math.random() * 40) - 20,
                       newEntity.victim.y + (Math.random() * 40) - 20 );
                newEntity.shootCooldown = 300; // shoot every 300ms
            }

	    // move to 'nearby' the entity at random
            if ( newEntity.huntCooldown < 0 ) {
		destination = findPointNear( newEntity.victim.x, newEntity.victim.y, 150 );
		newEntity.destX = destination.nextX;
		newEntity.destY = destination.nextY;
                newEntity.originX = newEntity.x;
                newEntity.originY = newEntity.y;
                newEntity.huntCooldown = 100; // change dest every 100ms
		newEntity.distanceTravelled = 0; // need to reset for getNextThing
            }
        }

        if ( newEntity.state == "seeking") {
            if ( newEntity.destCooldown < 0 ) {
		destination = findPointNear( newEntity.x, newEntity.y, 150 );
		newEntity.destX = destination.nextX;
		newEntity.destY = destination.nextY;
                newEntity.originX = newEntity.x;
                newEntity.originY = newEntity.y;
                newEntity.destCooldown = 500; // change hunt dest every 500ms
		newEntity.distanceTravelled = 0; // need to reset for getNextThing
            }
        }
	newEntity.destCooldown-=dt();
	newEntity.huntCooldown-=dt();
	newEntity.shootCooldown-=dt();
        entities[i] = newEntity;
    }

    // dont' forget the player
    updateXY(player);

    // need to draw by z-order
    entities.sort(function(e1,e2){ return e1.y - e2.y;});
    for (e in entities) {
	drawCharacter( entities[e] );
    }

    // update the bullets
    for (b in bullets) {
        var newBullet = nextThingAlongLine(bullets[b]);

	updateXY(newBullet);

        var onCollisionEntity = function (entity) {
            //if we collided into a player
            if (entity.actualJunk !== undefined) {
                entity.actualJunk++;
                entity.throwableJunk++;
		entity.gotHit = true;
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
        };

        var onCollisionObstacle = function (obstacle) {
            //if we collided into an obstacle, just give it back
            newBullet.shooter.throwableJunk++;
        };

        // if bullet hits something
        if (checkCollision(newBullet, obstacles, onCollisionObstacle) ||
	    checkCollision(newBullet, entities, onCollisionEntity)) {
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
        drawBullet(bullets[b]);
    }

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
	if (e !== '0') ctx.fillText(entities[e].state,
				  entities[e].x + 50,
				  entities[e].y + 30);
    }

    // possibly update junk pile
    if ( player.actualJunk < 5 ) junkSprite.img = junkLevel0;
    if ( player.actualJunk >= 5 ) junkSprite.img = junkLevel1;
    if ( player.actualJunk >= 15 ) junkSprite.img = junkLevel2
;
    // draw junk pile
    drawThing(junkSprite);

    // draw level
    for ( var i = 0; i < player.actualJunk; i++ ) {
	ctx.fillStyle = "#33bb33";
	ctx.fillRect(740,450 + i * 11,30,10);
	ctx.fillStyle = "#55dd55";
	ctx.fillRect(742,452 + i * 11,25,4);
    }

    then(Date.now()); // then is now now

    stateChangeTimer--; // for the next possible AI statechange

    // request new frame
    requestAnimFrame(function () {
        updateMain();
    });
}

function updateXY(thing) {
    if (!checkCollision(thing, obstacles) &&
	!checkOutsideBoundary(thing, ctx)) {

        if (thing.spriteState !== undefined && (thing.x != thing.nextX || thing.y != thing.nextY)) {
            if (thing.x < thing.nextX) {
                thing.flipped = false;
            }
            else if (thing.x > thing.nextX) {
                thing.flipped = true;
            }

            updateSpriteState(thing);
        }       
        thing.x = thing.nextX;
        thing.y = thing.nextY;
    }
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

function checkOutsideBoundary(testObject) {
    if (testObject.nextX < 0
        || testObject.nextY < 0
        || testObject.nextX + testObject.width > canvas.width
        || testObject.nextY + testObject.height > canvas.height) {
        return true;
    }
    return false;
}

function nextThingAlongLine(thing) {
    var x3 = thing.destX - thing.originX;
    var y3 = thing.destY - thing.originY;
    var d3 = Math.sqrt(x3 * x3 + y3 * y3);
    var nX3 = x3 / d3;
    var nY3 = y3 / d3;

    thing.distanceTravelled = thing.distanceTravelled + (dt() * thing.speed);
    thing.nextX = Math.round(thing.originX + nX3 * thing.distanceTravelled);
    thing.nextY = Math.round(thing.originY + nY3 * thing.distanceTravelled);

    return thing;
}

function shoot(entity, x, y) {
    if (entity.throwableJunk === 0) {
        //console.log("Player " + entity.playerId + " had no junk to throw.");
        return;
    }

    entity.throwableJunk--;
    //console.log("Player " + entity.playerId + " loses throwable junk\n");

    var b = new Bullet;
    b.x = entity.x;
    b.y = entity.y;
    b.originX = entity.x + entity.width/2;
    b.originY = entity.y + entity.height/2;
    b.destX = x;
    b.destY = y;
    b.shooter = entity;
    b.img = bulletType[Math.floor(Math.random() * bulletType.length)];

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
    if ( distance(entity1, entity2) < 200 ) ret = true;
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
        entities[e].flippedImg.src = entities[e].flippedImgSrc;
    }
    for ( e in obstacles ) {
        obstacles[e].img.src = obstacles[e].imageSrc;
    }

    bulletType = [];
    img1 = document.createElement('img');
    img1.src = "https://github.com/nsipid/ludum26/raw/master/images/object-blender-small.png";
    bulletType.push(img1);
    img2 = document.createElement('img');
    img2.src = "https://github.com/nsipid/ludum26/raw/master/images/object-cardboardbox-small.png";
    bulletType.push(img2);
    img3 = document.createElement('img');
    img3.src = "https://github.com/nsipid/ludum26/raw/master/images/object-toaster-small.png";
    bulletType.push(img3);
    img4 = document.createElement('img');
    img4.src = "https://github.com/nsipid/ludum26/raw/master/images/object-onepaintcan-small.png";
    bulletType.push(img4);


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
	shoot(player, e.offsetX, e.offsetY);
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

// Event handled for Mute / Unmute button.  Toggle between playing and pausing the audio
function toggleAudioOnOff () {
    var audio = document.getElementById("backgroundAudio");
    if ( audio.muted ) {
        audio.muted = false;
    } else {
        audio.muted = true;
    }
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
