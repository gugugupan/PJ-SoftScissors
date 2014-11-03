/* --- scissor.js --- */

/* Scissor Constructed Function
	Params:
		canvas_id: DOM id of image canvas
*/
var Scissor = function( canvas_id ) {
	this.canvas = document.getElementById( "myCanvas" ) ;
} ;

Scissor.prototype = {

	/* scissor.start( image_path ) - Start Scissor mouse monitor 
		Params:
			image_path: path of canvas load image(i.e:"image/dog.jpg")
	*/
	start: function( image_path ) {
		var _self = this ;

		_self.ctx = _self.canvas.getContext( "2d" ) ;
		var img = new Image() ;
		img.src = image_path ;
		img.onload = function() {
			_self.canvas.width = img.width ;
			_self.canvas.height = img.height ;
			_self.canvas.addEventListener( "mousedown" , mousedownHandle ) ;
			_self.ctx.drawImage( img , 0 , 0 ) ;
		}

		/* mousedownHandle() - Handle of mousedown event */
		var mousedownHandle = function( evt ) {
			evt.preventDefault();

			var x = evt.clientX - _self.canvas.offsetLeft ;
			var y = evt.clientY - _self.canvas.offsetTop ;

			_self.lastX = x ;
			_self.lastY = y ;

			_self.canvas.addEventListener( "mousemove" , mousemoveHandle ) ;
			_self.canvas.addEventListener( "mouseup" , mouseupHandle ) ;

			// // Draw a line 
			// _self.ctx.lineCap = "round";
			// _self.ctx.lineJoin = "round";
			// _self.ctx.lineWidth = 40 ;
			// _self.ctx.globalCompositeOperation = "destination-out";
			// _self.ctx.save() ;
			// _self.ctx.beginPath() ;
			// _self.ctx.arc( x , y , 1 , 0 , 2 * Math.PI ) ;
			// _self.ctx.fill() ;
			// _self.ctx.restore() ;
		} ;

		/* mousemoveHandle() - Handle of mousemove event */
		var mousemoveHandle = function( evt ) {
			evt.preventDefault() ;

			var x = evt.clientX - _self.canvas.offsetLeft ;
			var y = evt.clientY - _self.canvas.offsetTop ;

			/* Matting */

			_self.lastX = x ;
			_self.lastY = y ;

			// // Draw a line
			// _self.ctx.save() ;
			// _self.ctx.moveTo( _self.lastX , _self.lastY ) ;
			// _self.ctx.lineTo( x , y ) ;
			// _self.ctx.stroke() ;
			// _self.ctx.restore() ;
		} ;

		/* scissor.mouseupHandle() - Handle of mouseup event */
		var mouseupHandle = function( evt ) {
			evt.preventDefault() ;

			_self.lastX = null ;
			_self.lastY = null ;

			_self.canvas.removeEventListener( "mousemove" , mousemoveHandle ) ;
			_self.canvas.removeEventListener( "mouseup" , mouseupHandle ) ;
		} ;
	}
} ;
