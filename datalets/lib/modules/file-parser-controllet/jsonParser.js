export default (function () {

	const flattenJSON = (obj = {}, res = {}, extraKey = '') => {
		for(key in obj) {
		   if(typeof obj[key] !== 'object') {
			  res[extraKey + key] = obj[key];
		   }else {
			  flattenJSON(obj[key], res, `${extraKey}${key}.`);
		   };
		};
		return res;
	};

	let isNGSILD = function(obj) {
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
		} else {
			var curObj = flattenJSON(srcObj);
			result = curObj;
		}
		return result;
	}


	let jsonParser = function() { }

	jsonParser.prototype.parse = function (json) {

		var obj = "";
		if (json instanceof Object)
			obj = json;
		else {
			try {
				obj = JSON.parse(json);
			} catch (err) {
				console.log(err);
				return '';
			}
		}

		//FIX URBANITE - Transform NGSI-LD json into FLAT JSON - 25/11/2021
		console.log("2. Datalet Preview ...");
		if( isNGSILD(obj) ) {
			obj=ngsild2flat(obj);
			console.log("2. Datalet Preview, ngsi-ld trasformed obj => " + obj);
		} 
		//

		//FIX MISSING VISUALIZATION MAP 25/11/2021
		//return obj;
		if(obj.hasOwnProperty('features') && obj.hasOwnProperty('type') ){
			return obj['features'];
		}else{
			return obj;
		}
		//

	};

	return jsonParser;
})();

