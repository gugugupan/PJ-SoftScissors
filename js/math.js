/* --- math.js --- */

Math.pointDistToLine = function( x, y, x1, y1, x2, y2 ) {
	var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1) ;
	if (cross <= 0) return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1)) ;
	var d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) ;
	if (cross >= d2) return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2)) ;
	var r = cross / d2 ;
	var px = x1 + (x2 - x1) * r ;
	var py = y1 + (y2 - y1) * r ;
	return Math.sqrt((x - px) * (x - px) + (py - y1) * (py - y1)) ;
} ;

Math.sgn = function( x ) {
	if ( x < 0 ) return -1 ;
	return 1 ;
} ;

/* Math.vectorSub(a,b) : vector a - vector b*/
Math.vectorSub = function( a , b ) {
	var c = [] ;
	for ( var i = 0 ; i < a.length ; i ++ )
		c.push( a[ i ] - b[ i ] ) ;
	return c ;
} ;

/* Math.vectorDotProduct(a,b) : dot product of vector a and b */
Math.vectorDotProduct = function( a , b ) {
	var c = 0 ;
	for ( var i = 0 ; i < a.length ; i ++ )
		c += a[ i ] * b[ i ] ;
	return c ;
} ;

/* Math.vectorSqrLength(v) : return length * length of vector */
Math.vectorSqrLength = function( v ) {
	var c = 0;
	for ( var i = 0 ; i < v.length ; i ++ )
		c += v[ i ] * v[ i ] ;
	return c ;
} ;

Math.vectorLength = function( v ) {
	var c = 0 ;
	for ( var i = 0 ; i < v.length ; i ++ )
		c += v[ i ] * v[ i ] ;
	return Math.sqrt( c ) ;
} ;
