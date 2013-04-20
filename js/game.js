var Immortal = {
    init : function() {
	var canvas = document.getElementById("immortal_canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 640;
	canvas.height = 480;

	ctx.fillStyle = '#999999';
	ctx.fillRect(0,0,canvas.width,canvas.height);
    }
};

window.onload = function() {
    // disable scrolling
    document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40 && event.keyCode!=32};
    Immortal.init();
};
