function jsonParser () {}

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
		}catch(err){
			console.log(err);
			return '';
		}
	}
	return obj;
};