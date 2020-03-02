function kmlParser () {}

kmlParser.prototype.parse = function(kml) {
	var result="";
	try {
		//result = toGeoJSON.kml(kml);
		result = toGeoJSON.kml((new DOMParser()).parseFromString(kml, 'text/xml'));
	}catch(err){
		console.log(err);
		result="";
	}
	return result;
};