function jsonParser () {}

const flattenJSON = (obj = {}, res = {}, extraKey = '') => {
	for(key in obj) {
	   if(typeof obj[key] !== 'object') {
		  res[extraKey + key] = obj[key];
	   } else {
		  flattenJSON(obj[key], res, `${extraKey}${key}.`);
	   };
	};
	return res;
};

let isNGSILD = function(obj){
	var is_ngsi_ld = false;
	if(Array.isArray(obj)){
		is_ngsi_ld = obj[0].hasOwnProperty('@context') && obj[0].hasOwnProperty('id') && obj[0].id.toLowerCase().startsWith('urn:ngsi-ld:');
	} else {
		is_ngsi_ld = obj.hasOwnProperty('@context') && obj.hasOwnProperty('id') && obj.id.toLowerCase().startsWith('urn:ngsi-ld:');
	}
	return is_ngsi_ld;
}

let ngsild2flat = function(srcObj){
	var result = [];
	if (Array.isArray(srcObj)) {
		for (var k = 0; k < srcObj.length; k++) {
			var curObj = flattenJSON(srcObj[k]);
			result.push(curObj);
		}
	}else{
		var curObj = flattenJSON(srcObj);
		result = curObj;
	}
	return result;
}

jsonParser.prototype.parse = function(json) {

	var obj="";
	if(json instanceof Object){
		console.log("ADAS")
		obj=json;
	}else{
		try{
			console.log("ADAS11111111111")
			obj=JSON.parse(json);
			console.log(obj)

			//FIX URBANITE - Transform NGSI-LD json into FLAT JSON - 25/11/2021
			console.log("1. Datalet Create ...");
			if( isNGSILD(obj) ) {
				obj=ngsild2flat(obj);
				console.log("1. Datalet Create, ngsi-ld trasformed obj => " + obj);
			}
			//

		}catch(err){
			console.log(err);
			return '';
		}
	}
	return obj;
};