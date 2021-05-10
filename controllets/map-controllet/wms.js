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
function WMS_Provider() { //--> dataUrl inutile
    //this.dataUrl = dataUrl;
    //this.path = "result->records";
    //this.arrayPath = ["result", "records", "*"];
    this.isOGC = true;
    this.isWMS = true;
    this.Format = 'WMS';
    this.parsedUrl;
}
WMS_Provider.prototype.parseQueryStringParameters = function (srcUrl) {
    var url = '', params = {};
    srcUrl.match(/([^?=&]+)(=([^&]*))?/g).forEach(function (value) {
        value = value.split('=');
        if (value.length == 1) url = value[0];
        else params[value[0].toUpperCase()] = decodeURIComponent(value[1]);
    });
    return {url: url, params: params};
}

// WMS_Provider.prototype.selectData = function(data) {
//     return data.result.records;
// };

WMS_Provider.prototype.addLimit = function (url) {
    return url;
};

WMS_Provider.prototype.getHTMLFormattedMetadata = function (detail) {
    var layers = detail.wmsLayers;
    var info = detail.wmsInfo;
    var provider = detail.provider;
    var html = '';

    if (layers && info) {
        html += '<b>Service Name:</b> <b style="color: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+';">' + info.Service.Title + '</b><br>';
        html += '<b>Service Description:</b> <b>' + info.Service.Abstract + '</b><br>';
        html += '<b>Service Version:</b> <b>' + info.Version + '</b><br>';
        html += '<div style="height: 1px; background: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+'; margin: 12px 0;"></div>';

        html += '<b>Organization:</b> ' + info.Service.ContactInformation.ContactPersonPrimary.ContactOrganization + '<br>';

        if (this.parsedUrl.params.LAYERS){
            var ln = provider.parsedUrl.params.LAYERS ? (/(?:\w+:)?(\w+)/gi).exec(provider.parsedUrl.params.LAYERS)[1] : null;
            layers.filter(function(l){return l.Name==ln}).forEach(function(l,i){
                html += '<b>Resource Name:</b> <b style="color: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+';">' + l.Title + '</b><br>';
            })
        }else{
            html += '<b>Layers:</b> ' + layers.length + '<br>';
        }
    }
    return html;
};

WMS_Provider.prototype.getDatasetUrl = function (providerUrl) {

    var pu = this.parsedUrl = this.parseQueryStringParameters(providerUrl);
    var params = {};

    if (pu.params.SERVICE && pu.params.VERSION && pu.params.LAYERS && pu.params.SRS
        && pu.params.BBOX && pu.params.FORMAT)
        return providerUrl

    if (pu.params.MAP) params.MAP = pu.params.MAP
    params.SERVICE = SERVICE = pu.params.SERVICE || 'WMS';
    params.VERSION = pu.params.VERSION || '1.1.1';
    params.REQUEST = 'getCapabilities';

    var url = [pu.url, '?'];
    for (p in params)
        url.push(url[url.length - 1] != '?' ? '&' : '', p, '=', params[p]);
    return url.join('');
};

// WMS_Provider.prototype.getResourceUrl = function(providerUrl) {
//     // return providerUrl + '/api/3/action/datastore_search?resource_id=' + resourceId;
//     if ( !this.parsedUrl ) return providerUrl;
//
//     return providerUrl + '/api/action/datastore_search?resource_id=' + resourceId;
// };

//    var fields = [];
//    for (var key in data.result.records[0])
//        fields.push(key);
//    return fields;
//};

//ckan_Provider.prototype.requestData = function() {
//    var that = this;
//
//    $.ajax({
//        url: this.dataUrl,
//        dataType: "json",
//        success: function(data){
//            that.data = data.result.records;
//        }
//    });
//};