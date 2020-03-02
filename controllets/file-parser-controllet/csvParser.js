function csvParser () {}

csvParser.prototype.parse = function(csvString) {
	var config_CSVParser={
					"delimiter": "",	// auto-detect
					"newline": "",	// auto-detect
					"quoteChar": '"',
					"header": true,
					"dynamicTyping": true,
					"preview": 0,
					"encoding": "",
					"worker": false,
					"comments": true,
					"step": undefined,
					"complete": undefined,
					"error": undefined,
					"download": false,
					"skipEmptyLines": false,
					"chunk": undefined,
					"fastMode": undefined,
					"beforeFirstChunk": undefined,
					"withCredentials": undefined
				};
	try{
		var result=Papa.parse(csvString.replace(/((Lista_[0-9]+)|(Catania )|(SOLO))(\n)/g,'$1 ').replace(/([a-zA-Z])'/g,'$1 ').replace(/"/g,''),config_CSVParser);
		result.data.pop();
		return result.data;
	}catch(err){
		console.log(err);
		return '';
	}
};

