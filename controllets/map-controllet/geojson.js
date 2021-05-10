var cssId = 'cssTheme'; 
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '../../../theme.css';
    link.media = 'all';
    head.appendChild(link);
}
function GEOJSON_Provider() { //--> dataUrl inutile
    //this.dataUrl = dataUrl;
    //this.path = "result->records";
    //this.arrayPath = ["result", "records", "*"];
    this.isOGC = true;
    this.isGeoJSON = true;
    this.Format = 'GeoJSON';
}


GEOJSON_Provider.prototype.addLimit = function (url) {
    return url;
};

GEOJSON_Provider.prototype.getHTMLFormattedMetadata = function (detail) {
    var html = '';
    var ds = detail.dataset;
    var info = detail.info;
    if (ds && info) {
		//#2196F3
        html += '<b>Resource Name:</b> <b style="color: '+window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+';">' + (ds.rsTitle || ds.dsTitle) + '</b><br>';
        html += '<div style="height: 1px; background: '+window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+'; margin: 12px 0;"></div>';

        html += '<b>Geometry Type:</b> ' + info.geometryType + '<br>';
        html += '<b>Features Count:</b> ' + info.featuresCount + '<br>';
        html += '<b>Properties length:</b> ' + info.propertiesName.length + '<br>';

        var properties = [];
        for(p in info.propertiesName) properties.push(info.propertiesName[p]);

        html += '<b>Properties:</b> '+ properties.join(' , ') +'<br>';
    }
    return html;
};

GEOJSON_Provider.prototype.getDatasetUrl = function (providerUrl) {
    return providerUrl;

};