/* --- cluster.js --- */

/* Cluster Contructed Function
	Params:
		feature : list of feature array
		k : num of cluster
*/
var Cluster = function( feature , k ) {
	var _self = this ;

	/* initialize center point */
	var n = feature.length ;
	var dimension = 3 ; // MAGIC NUMBER!
	if ( k > n ) k = n ;
	_self.k = k ;
	_self.dimension = dimension ;
	_self.center = [] ;
	for ( var i = 0 ; i < k ; i ++ ) {
		var center_vector = [] ;
		for ( var d = 0 ; d < dimension ; d ++ )
			center_vector.push( Math.random() * 255 ) ; // center point initialize by random, MAGIC NUMBER!
		_self.center.push( center_vector ) ;
	}

	/* initialize for some varible */
	var belongsTo = [] ;
	var numCluster = [] ;
	for ( var i = 0 ; i < n ; i ++ ) belongsTo.push( 0 ) ;
	for ( var i = 0 ; i < k ; i ++ ) numCluster.push( 0 ) ;

	/* iteration for ITER num */
	for ( var ITER = 0 ; ITER < 5 ; ITER ++ ) {
		for ( var i = 0 ; i < k ; i ++ )
			numCluster[ i ] = 0 ;

		var sumDist = 0 ;
		for ( var i = 0 ; i < n ; i ++ ) { // Find nearest center
			belongsTo[ i ] = _self.getNearestCenter( feature[ i ] ) ;
			numCluster[ belongsTo[ i ] ] ++ ;
			// sumDist += Math.vectorDist( feature[ i ] , _self.center[ belongsTo[ i ] ] ) ;
		}
		// console.log( belongsTo ) ;
		// console.log( sumDist ) ;

		for ( var i = 0 ; i < k ; i ++ ) // Calc new center
			if ( numCluster[ i ] <= 1 )
				_self.center[ i ] = feature[ parseInt( n * Math.random() , 10 ) ] ;
			else {
				_self.center[ i ] = [ 0 , 0 , 0 ] ; // MAGIC NUMBER!
				for ( var j = 0 ; j < n ; j ++ )
					if ( belongsTo[ j ] == i ) 
						for ( var d = 0 ; d < dimension ; d ++ )
							_self.center[ i ] [ d ] += feature[ j ] [ d ] ;
				for ( var d = 0 ; d < dimension ; d ++ )
					_self.center[ i ] [ d ] /= numCluster[ i ] ;
			}
	}
} ;

Cluster.prototype = {
	/* cluster.getProb( feature ) */
	getNearestCenterDist: function( feature ) {
		var _self = this ;
		if ( _self.k == 0 ) return 1 ;
		var belongsTo = _self.getNearestCenter( feature ) ;
		return Math.vectorDist( feature , _self.center[ belongsTo ] ) ;
	} ,

	/* cluster.add( feature ) - Add feature into dataset */
	add: function( feature_list ) {
		return null ;
	} ,

	/* cluster.getNearestCenter( feature ) - get nearest center of feature */
	getNearestCenter: function( feature ) {
		var _self = this ;
		if ( _self.k == 0 ) return NaN ;
		var belongsTo = 0 ;
		var minDist = Math.vectorDist( feature , _self.center[ 0 ] ) ;
		for ( var j = 1 ; j < _self.k ; j ++ ) {
			var dist = Math.vectorDist( feature , _self.center[ j ] ) ;
			if ( dist < minDist ) {
				minDist = dist ;
				belongsTo = j ;
			}
		}
		return belongsTo ;
	}
} ;
