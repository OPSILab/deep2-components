var cssId = 'cssTheme'; 
console.log("ELEMENT CSS: "+document.getElementById(cssId));
if (!document.getElementById(cssId))
{
	console.log("-- Dentro lo script del COLORE");
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '../../../theme.css';
    link.media = 'all';
    head.appendChild(link);
	console.log("-- Fine script del COLORE");
}
var customProps = window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor');
console.log("STAMPA COLORE:"+customProps);
function openDataSoft_Provider () {}

openDataSoft_Provider.prototype.selectData = function(data) {
    var selectedData = [];
    for(var i=0; i<data.records.length; i++) {
        if(data.records[i].geometry)
            data.records[i].fields["geometry"] = data.records[i].geometry;
        selectedData.push(data.records[i].fields);
    }
    return selectedData;
};

openDataSoft_Provider.prototype.addLimit = function(url) {
    if(url.indexOf("&rows=") > -1)
        return url;
    return url + "&rows=10000";
};

openDataSoft_Provider.prototype.getHTMLFormattedMetadata = function(dataset, resourceIndex) {
    dataset = dataset.metas;

    var html = '';

    // html += '<b>Producteur:</b> ' + dataset.publisher + '<br>';
    html += '<b>' + ln["resourceName_" + ln["localization"]] + ':</b> <b style="color: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+';">' + dataset.title + '</b><br>';
    html += '<b>' + ln["resourceDescription_" + ln["localization"]] + ':</b>' + dataset.description + '</b><div style="height: 1px; background: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+'; margin: 12px 0;"></div>';

    filters = ["_publisher", "title", "description"];

    var orderedKeys = Object.keys(dataset).sort()

    for(var i in orderedKeys) {
        var key = orderedKeys[i];
        var value = dataset[key];
        if (value != null && value != undefined && String(value).trim() != "" && typeof(value) != 'object' && $.inArray(key, filters) == -1)
            html += '<b>' + key + ':</b> ' + value + '<br>';
    }

    return html;
};

openDataSoft_Provider.prototype.getDatasetUrl = function(providerUrl, datasetId) {
    return providerUrl + '/api/datasets/1.0/' + datasetId;
};

openDataSoft_Provider.prototype.getResourceUrl = function(providerUrl, dataset, resourceIndex, datasetId)
{
    if (dataset.resourceUrl)
        return dataset.resourceUrl;

    return providerUrl + '/api/records/1.0/search?dataset=' + datasetId;
};