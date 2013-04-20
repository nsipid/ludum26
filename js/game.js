var Immortal = {
    guy : {
        x : 40,
        y : 40,
        height : 20,
        width : 20
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
            Immortal.guy.x--;
        }
        if ( keysDown[39]) { // right!
            Immortal.guy.x++;
        }
        if ( keysDown[38]) { // up!
            Immortal.guy.y--;
        }
        if ( keysDown[40]) {
            Immortal.guy.y++;
        }

        // draw ellipse
        Immortal.drawEllipse( ctx, "#555555", Immortal.guy.x, Immortal.guy.y, Immortal.guy.width, Immortal.guy.height );

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
