export default (function () {
	let xmlParser = function () { }

	let extractArray = function(elem){
		if(Array.isArray(elem)){
			return elem;
		}else{
			let keys = Object.keys(elem);
			if (keys.length != 1) {
				return elem;
			}else{
				return extractArray(elem[keys[0]]);
			}
		}
	}
	
	xmlParser.prototype.parse = function (xmlData) {
		var x2js = new X2JS();
	
		if (!(xmlData instanceof Object))
			xmlData = $.parseXML(xmlData);
	
		try {
			var result = x2js.xml2json(xmlData);
			return extractArray(result);
		} catch (err) {
			console.error(err);
			return '';
		}
	};
	
	return xmlParser;
})();
