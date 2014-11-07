/* --- cluster.js --- */

/* Cluster Contructed Function
	Params:
		dimension: data point dimension num
		k : num of clusters
*/
var Cluster = function( dimension , k ) {

	/* max size of all data point  */
	this.maxQueueSize = 200 ;

	this.dimension = dimension ;
	this.k = k ;

	/* feature point data !!!! each dimension of feature vector \in [0,1] */
	this.data = [] ;

	/* center point */
	this.center = [] ;
	for ( var i = 0 ; i < k ; i ++ ) {
		var center_vector = [] ;
		for ( var j = 0 ; j < k ; j ++ )
			center_vector.push( Math.random() ) ; // center point initialize by random
		this.center.push( center_vector ) ;
	}
} ;

Cluster.prototype = {
	/* cluster.adjustFeature() - calc center point for each cluster  */
	adjustFeature: function() {
	} ,

	/* cluster.add( feature ) - Add feature into dataset */
	add: function( feature_list ) {
		var _self = this ;

		/* --- check feature_list code --- */

		_self.data = _self.data.concat( feature_list ) ;
		while ( _self.data.length > _self.maxQueueSize ) {
			var x = _self.data.shift() ;
			console.log( "Cluster shift " , x ) ;
		}

		adjustFeature() ;
	}
} ;
