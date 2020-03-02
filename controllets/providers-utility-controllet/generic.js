function generic_Provider () {}

generic_Provider.prototype.selectData = function(data) {
    if(data.result && data.result.records)//ckan like
        return data.result.records;

    if(data instanceof Array)
        return data;
    if(_isGEOJSON(data))
        //return [{"GEOJSON" : data}];
        return data.features;
    if(data instanceof Object)
        return [{"JSON" : data}];
};

generic_Provider.prototype.addLimit = function(url) {
    return url;
};

generic_Provider.prototype.isGEOJSON = function() {
    return isGEOJSON;
};

function _isGEOJSON (data) {
    var dt = new DataTypeConverter();
    return (dt.inferDataSubTypeOfValue(data) && dt.inferDataSubTypeOfValue(data).name == DataTypeConverter.SUBTYPES.GEOJSON.name);
};