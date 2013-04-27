var Immortal = {
    currentScreen : null, // sets to homeScreen in init
    actions : [], // sets in init
    buttons : [],
    facts : [],

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
        moveLeft : function (ctx, collisions) {
            var nextX = Immortal.guy.x <= 0 ? 0 : Immortal.guy.x - 1;
            if (collisions !== undefined && Immortal.guy.checkCollision(nextX, Immortal.guy.y)) {
                return;
            }
            Immortal.guy.x = nextX;
            Immortal.guy.level = 3;
            if ( Immortal.guy.stepPadding === 0)
            {
                Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
            Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10; 
        },
        moveRight : function (ctx, collisions){
            var nextX =  Immortal.guy.x +  Immortal.guy.width >= ctx.canvas.width ?  ctx.canvas.width -  Immortal.guy.width :  Immortal.guy.x + 1;
            if (collisions !== undefined && Immortal.guy.checkCollision(nextX, Immortal.guy.y)) {
                return;
            }
            Immortal.guy.x = nextX;
            Immortal.guy.level = 1;
            if ( Immortal.guy.stepPadding === 0) {
                Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
            Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10;
        },
        moveDown : function (ctx, collisions){
            var nextY =  Immortal.guy.y +  Immortal.guy.height >= ctx.canvas.height ?   ctx.canvas.height -  Immortal.guy.height:  Immortal.guy.y + 1;
            if (collisions !== undefined && Immortal.guy.checkCollision(Immortal.guy.x, nextY)) {
                return;
            }
            Immortal.guy.y = nextY;
            Immortal.guy.level = 0;
            if ( Immortal.guy.stepPadding === 0){
                Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
            Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10;
        },
        moveUp : function (ctx, collisions) {
            var nextY =  Immortal.guy.y <= 0 ?  0 : Immortal.guy.y - 1;
            if (collisions !== undefined && Immortal.guy.checkCollision(Immortal.guy.x, nextX)) {
                return;
            }
            Immortal.guy.y = nextY;
            Immortal.guy.level = 2;
            if ( Immortal.guy.stepPadding === 0){
                Immortal.guy.step = (Immortal.guy.step + 1) % 3;
            }
            Immortal.guy.stepPadding = (Immortal.guy.stepPadding + 1) % 10;
        },
        checkCollision : function (collisions, nextX, nextY){
            for (var i = 0; i < collisions.length; i++){
                var object = collisions[i];
                if (object.x + object.width <= nextX || Immortal.guy.width + nextX <= object.x || object.y + object.height <= nextY || Immortal.guy.height + nextY <= object.y) {
                    //collision
                    return true;
                }
            }
            return false;
        }
    },

    update : function( ctx ) {

        // update stuff
        ctx.canvas.width = ctx.canvas.width;
        ctx.fillStyle = '#999999';
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

        // draw debug spots for action hotspots
        for ( var i=0;i<Immortal.actions.length;i++ ) {
            if ( Immortal.distance( Immortal.guy, Immortal.actions[i].coords ) < Immortal.actions[i].radius ) {
                //ctx.fillStyle = "#ff0000";
            }
            else {
                //ctx.fillStyle = "#00ff00";
            }

            //ctx.fillRect(Immortal.actions[i].coords.x, Immortal.actions[i].coords.y, 4, 4);
        }

        // show/hide buttons as appropriate
        for ( var i=0;i<Immortal.actions.length;i++ ) {
            if ( Immortal.distance( Immortal.guy, Immortal.actions[i].coords ) < Immortal.actions[i].radius ) {
                if ( Immortal.buttons[i].getAttribute( 'style' ) === 'visibility:hidden;' ) {
                    Immortal.buttons[i].setAttribute( 'style', 'visiblity:hidden;' );
                }
            }
            else {
                if ( Immortal.buttons[i].getAttribute( 'style' ) === 'visibility:hidden;' )
                Immortal.buttons[i].setAttribute( 'style', 'visibility:visible;' );
            }
        }

        // movement
        if ( keysDown[37]) { //left!
            Immortal.guy.moveLeft(ctx);
        }
        if ( keysDown[39]) { // right!
            Immortal.guy.moveRight(ctx);
        }
        if ( keysDown[38]) { // up!
            Immortal.guy.moveUp(ctx);
        }
        if ( keysDown[40]) { // down!
            Immortal.guy.moveDown(ctx);
        }
        if ( keysDown[32]) {
            // check for actions
            console.log( Immortal.actions );
            for ( var i=0; i < Immortal.actions.length; i++ ) {
                console.log( 'guy.x : ' + Immortal.guy.x + ' guy.y : ' + Immortal.guy.y + ' available action: ' + Immortal.actions[i].action + ' distance to action: ' + Immortal.distance( Immortal.guy, Immortal.actions[i].coords ) );
            }
        }
        
        // draw the guy
        Immortal.guy.draw( ctx );

        // check for move off screen
        // if ( movingoffscreen )
        //    load up new screen

        // request new frame
        requestAnimFrame(function() {
            Immortal.update( ctx );
        });
    },

    init : function() {
        var canvas = document.getElementById("immortal_canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 512;

        ctx.fillStyle = '#999999';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        Immortal.guy.img = document.createElement('img');
        Immortal.guy.img.src = "./images/GuyLightExample.png";

        Immortal.loadScreen( Screens.homeScreen );

        Immortal.update( ctx );
    },

    loadScreen : function( screen ) {
        Immortal.currentScreen = screen;
        Immortal.actions = screen.actions;
        for ( var i=0;i<screen.actions.length;i++ ) {
            var b = document.createElement( 'button' );
            b.setAttribute( 'id', screen.actions[i].action );
            b.innerHTML = screen.actions[i].action;
            b.setAttribute( 'onClick', screen.actions[i].effect );
            Immortal.buttons[i] = b;
            document.body.appendChild(b);
            console.log( screen.actions[i].effect );
        }
    },

    distance : function( obj1, obj2 ) {
        return Math.sqrt( obj1.x*obj2.x + obj1.y*obj2.y );
    }
};

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
    Immortal.init();
};
