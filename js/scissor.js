/* --- scissor.js --- */

/* Scissor Constructed Function
	Params:
		canvas_id: DOM id of image canvas
*/
var Scissor = function( canvas_id ) {
	/* <canvas> DOM elemment */
	this.canvas = document.getElementById( canvas_id ) ;

	/* image size */
	this.width = null ;
	this.height = null ;

	/* 2d context of canvas */
	this.ctx = null ;

	/* image data array for original image */
	this.imageData = null ;

	/* is each pixel have matte */
	this.isMatte = null ;

	/* alpha value of each pixel */
	this.alpha = null ;

	/* matte queue */
	// this.matteQueue = [] ;
	/* is each pixel in matte queue */
	// this.inQueue = null ;

	/* pixel array of boudary point */
	this.leftBoudary = [] ; // background
	this.rightBoudary = [] ; // foreground
	/* max size of boudary array */
	this.maxBoudaryArrSize = 20 ;

	/* size of mouse brush */
	this.brushWidth = 15 ;

	/* Theata */
	this.sqrTheata = 0.1 * 0.1 ;

	/* last mouse move point */
	this.lastX = null ;
	this.lastY = null ;
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
			_self.width = img.width ;
			_self.height = img.height ;
			_self.canvas.addEventListener( "mousedown" , mousedownHandle ) ;
			_self.ctx.drawImage( img , 0 , 0 ) ;

			// Initialize Array from image width and height
			// ( y * WIDTH + x ) * 4 + k
			_self.imageData = _self.ctx.getImageData( 0 , 0 , _self.width , _self.height ) ;
			_self.isMatte = [] ;
			_self.alpha = [] ;
			for ( var i = 0 ; i < _self.width * _self.height ; i ++ ) {
				_self.isMatte.push( false ) ;
				_self.alpha.push( NaN ) ;
			}
		} ;

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
			// _self.ctx.lineWidth = _self.brushWidth ;
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
			var lx = _self.lastX ;
			var ly = _self.lastY ;
			if ( x == lx && y == ly ) return ;
			_self.lastX = x ;
			_self.lastY = y ;

			// // Draw a line
			// _self.ctx.save() ;
			// _self.ctx.moveTo( lx , ly ) ;
			// _self.ctx.lineTo( x , y ) ;
			// _self.ctx.stroke() ;
			// _self.ctx.restore() ;

			// fetch boudary pixel
			var deltaX = x - lx , deltaY = y - ly ;
			var unitDeltaX = deltaX / Math.sqrt( deltaX * deltaX + deltaY * deltaY ) ,
				unitDeltaY = deltaY / Math.sqrt( deltaX * deltaX + deltaY * deltaY ) ;
			for ( var xx = lx , yy = ly ; Math.sgn( x - xx ) == Math.sgn( x - lx ) && Math.sgn( y - yy ) == Math.sgn( y - ly ) ; xx += unitDeltaX * 2 , yy += unitDeltaY * 2 ) {
				// // Draw a line 
				// _self.ctx.fillStyle = "#FF0000" ;
				// _self.ctx.fillRect( xx , yy , 1 , 1 ) ;
				var color , offset ;

				var leftBasePointX = parseInt( xx + unitDeltaY * _self.brushWidth , 10 ) ,
					leftBasePointY = parseInt( yy - unitDeltaX * _self.brushWidth , 10 ) ;
				if ( leftBasePointX < 0 ) leftBasePointX = 0 ;
				if ( leftBasePointY < 0 ) leftBasePointY = 0 ;
				if ( leftBasePointX >= _self.width ) leftBasePointX = _self.width - 1 ;
				if ( leftBasePointY >= _self.height ) leftBasePointY = _self.height - 1 ;
				color = [] ;
				offset = 4 * ( leftBasePointY * _self.width + leftBasePointX ) ;
				color.push( _self.imageData.data[ offset + 0 ] ) ;
				color.push( _self.imageData.data[ offset + 1 ] ) ;
				color.push( _self.imageData.data[ offset + 2 ] ) ;
				_self.leftBoudary.push( color ) ;
				if ( _self.leftBoudary.length > _self.maxBoudaryArrSize )
					_self.leftBoudary.shift() ;
				// // Draw a line 
				// _self.ctx.fillStyle = "#FFFF00" ;
				// _self.ctx.fillRect( leftBasePointX , leftBasePointY , 1 , 1 ) ;

				var rightBasePointX = parseInt( xx - unitDeltaY * _self.brushWidth , 10 ) ,
					rightBasePointY = parseInt( yy + unitDeltaX * _self.brushWidth , 10 ) ;
				if ( rightBasePointX < 0 ) rightBasePointX = 0 ;
				if ( rightBasePointY < 0 ) rightBasePointY = 0 ;
				if ( rightBasePointX >= _self.width ) rightBasePointX = _self.width - 1 ;
				if ( rightBasePointY >= _self.height ) rightBasePointY = _self.height - 1 ;
				color = [] ;
				offset = 4 * ( rightBasePointY * _self.width + rightBasePointX ) ;
				color.push( _self.imageData.data[ offset + 0 ] ) ;
				color.push( _self.imageData.data[ offset + 1 ] ) ;
				color.push( _self.imageData.data[ offset + 2 ] ) ;
				_self.rightBoudary.push( color ) ;
				if ( _self.rightBoudary.length > _self.maxBoudaryArrSize )
					_self.rightBoudary.shift() ;
				// // Draw a line 
				// _self.ctx.fillStyle = "#0000FF" ;
				// _self.ctx.fillRect( rightBasePointX , rightBasePointY , 1 , 1 ) ;
			}

			// fetch point into matte queue
			for ( var j = Math.min( x , lx ) - _self.brushWidth ; j < Math.max( x , lx ) + _self.brushWidth ; j ++ )
			for ( var i = Math.min( y , ly ) - _self.brushWidth ; i < Math.max( y , ly ) + _self.brushWidth ; i ++ )
				if ( i >= 0 && i < _self.height && j >= 0 && j < _self.width && Math.pointDistToLine( j , i , lx , ly , x , y ) <= _self.brushWidth ) {
					if ( _self.isMatte[ i * _self.width + j ] ) {
						/* Do nothing 
						var pixel = _self.ctx.getImageData( j , i , 1 , 1 ) ;
						pixel.data[ 0 ] = _self.imageData[ ( i * _self.width + j ) * 4 + 0 ] ;
						pixel.data[ 1 ] = _self.imageData[ ( i * _self.width + j ) * 4 + 1 ] ;
						pixel.data[ 2 ] = _self.imageData[ ( i * _self.width + j ) * 4 + 2 ] ;
						pixel.data[ 3 ] = 255 ;
						_self.ctx.putImageData( pixel , j , i ) ;
						*/
					} else {
						/* estimate alpha  */
						var pixelColor = [] , offset = 4 * ( i * _self.width + j ) ;
						pixelColor.push( _self.imageData.data[ offset + 0 ] ) ;
						pixelColor.push( _self.imageData.data[ offset + 1 ] ) ;
						pixelColor.push( _self.imageData.data[ offset + 2 ] ) ;

						// min fully foreground or background value
						var sqrDFi = NaN , sqrDBi = NaN ;
						for ( var ri = 0 ; ri < _self.rightBoudary.length ; ri ++ ) {
							var cici = Math.vectorSqrLength( Math.vectorSub( _self.rightBoudary[ ri ] , pixelColor ) ) ;
							if ( isNaN( sqrDFi ) || cici < sqrDFi )
								sqrDFi = cici ;
						}
						for ( var li = 0 ; li < _self.leftBoudary.length ; li ++ ) {
							var cici = Math.vectorSqrLength( Math.vectorSub( _self.leftBoudary[ li ] , pixelColor ) ) ;
							if ( isNaN( sqrDBi ) || cici < sqrDBi )
								sqrDBi = cici ;
						}

						// estimate alpha using confidence value
						var bestConf = NaN , bestAlpha = NaN ;
						for ( var li = 0 ; li < _self.leftBoudary.length ; li ++ )
							for ( var ri = 0 ; ri < _self.rightBoudary.length ; ri ++ ) {
								// xxxColor is [ r , g , b ] array
								var foreColor = _self.rightBoudary[ ri ] , backColor = _self.leftBoudary[ li ] ;
								var deltaFB = Math.vectorSub( foreColor , backColor ) ,
									deltaFBLength = Math.vectorLength( deltaFB ) ;
								var estimateAlpha = Math.vectorDotProduct( Math.vectorSub( pixelColor , backColor ) , deltaFB ) / ( deltaFBLength * deltaFBLength ) ;
								// if ( estimateAlpha < 0 ) estimateAlpha = 0 ;
								// if ( estimateAlpha > 1 ) estimateAlpha = 1 ;
								var divisor = [] ;
								divisor.push( pixelColor[ 0 ] - ( estimateAlpha * foreColor[ 0 ] + ( 1 - estimateAlpha ) * backColor[ 0 ] ) ) ;
								divisor.push( pixelColor[ 1 ] - ( estimateAlpha * foreColor[ 1 ] + ( 1 - estimateAlpha ) * backColor[ 1 ] ) ) ;
								divisor.push( pixelColor[ 2 ] - ( estimateAlpha * foreColor[ 2 ] + ( 1 - estimateAlpha ) * backColor[ 2 ] ) ) ;
								var ratio = Math.vectorLength( divisor ) / deltaFBLength ;
								var wFi = Math.exp( - Math.vectorSqrLength( Math.vectorSub( foreColor , pixelColor ) ) / sqrDFi ) ,
									wBi = Math.exp( - Math.vectorSqrLength( Math.vectorSub( backColor , pixelColor ) ) / sqrDBi ) ;
								var f = Math.exp( - ratio * ratio * wFi * wBi / _self.sqrTheata ) ;
								if ( isNaN( bestConf ) || f < bestConf ) {
									bestConf = f ;
									bestAlpha = estimateAlpha ;
								}
							}
						if ( bestAlpha < 0.5 ) {
							_self.ctx.fillStyle = "#FF0000" ;
							_self.ctx.fillRect( j , i , 1 , 1 ) ;
						}
						_self.alpha[ i * _self.width + j ] = bestAlpha ;
						_self.isMatte[ i * _self.width + j ] = true ;
					}
				}

			/* Matting Code */
			/* Just using estimate alpha to solve matting */

		} ;

		/* scissor.mouseupHandle() - Handle of mouseup event */
		var mouseupHandle = function( evt ) {
			evt.preventDefault() ;

			_self.lastX = null ;
			_self.lastY = null ;

			_self.canvas.removeEventListener( "mousemove" , mousemoveHandle ) ;
			_self.canvas.removeEventListener( "mouseup" , mouseupHandle ) ;
		} ;
	} ,

	/* scissor.finish() - Finish matting */
	finish: function() {
		var _self = this ;

		var que = [] , inQueue = [] ;
		for ( var i = 0 ; i < _self.width * _self.height ; i ++ )
			inQueue.push( false ) ;
		que.push( [ 0 , 0 ] ) ;
		inQueue[ 0 ] = true ;
		// BFS for clear all non-matte pixel
		while ( que.length > 0 ) {
			var pt = que.shift() ;
			var x = pt[ 0 ] , y = pt[ 1 ] ;
			_self.imageData.data[ ( y * _self.width + x ) * 4 + 3 ] = 0 ;
			for ( var dx = -1 ; dx <= 1 ; dx ++ )
				for ( var dy = -1 ; dy <= 1 ; dy ++ ) {
					var xx = x + dx , yy = y + dy ;
					if ( xx < 0 || yy < 0 || xx >= _self.width || yy >= _self.height ) continue ;
					var offset = yy * _self.width + xx ;
					if ( inQueue[ offset ] || _self.isMatte[ offset ] ) continue ;
					que.push( [ xx , yy ] ) ;
					inQueue[ offset ] = true ;
				}
		}

		// clear all matte pixel
		for ( var y = 0 ; y < _self.height ; y ++ )
			for ( var x = 0 ; x < _self.width ; x ++ ) {
				var offset = y * _self.width + x ;
				if ( _self.isMatte[ offset ] && _self.alpha[ offset ] <= 0.5 )
					_self.imageData.data[ offset * 4 + 3 ] = 0 ;
			}

		// put image into canvas
		_self.ctx.putImageData( _self.imageData , 0 , 0 ) ;
	}
} ;
