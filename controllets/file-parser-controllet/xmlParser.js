function xmlParser () {}

xmlParser.prototype.parse = function(xmlData) {
	var x2js = new X2JS();
	
	if(!(xmlData instanceof Object))
		xmlData=$.parseXML(xmlData);

	try{
		var result=x2js.xml2json(xmlData);
		console.log(result);
		return result;
	}catch(err){
		console.log(err);
		return '';
	}
};
