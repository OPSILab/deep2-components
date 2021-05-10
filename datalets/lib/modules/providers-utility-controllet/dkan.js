var cssId = 'cssTheme'; 
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '../../../../../theme.css';
    link.media = 'all';
    head.appendChild(link);
}
var customProps = window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor');

export default (function () {

    function dkan_Provider () {}

    dkan_Provider.prototype.selectData = function(data) {
        return data.result.records;
    };

    dkan_Provider.prototype.addLimit = function(url) {
        if(url.indexOf("&limit=") > -1)
            return url;
        return url + "&limit=99999";
    };

    dkan_Provider.prototype.getHTMLFormattedMetadata = function(datasets, resourceIndex, datasetId) {

        let dataset;

        for(let i=0; i<datasets.result.length; i++)
            if (datasets.result[i].id === datasetId) {
                dataset = datasets.result[i];
                break;
            }

        let html = '';

        html += '<b>Resource Title:</b> <b style="color: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+';">' + dataset.resources[resourceIndex].title + '</b><br>';
        html += '<b>Resource Description:</b> ' + dataset.description + '</b><div style="height: 1px; background: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+'; margin: 12px 0;"></div>';

        html += '<b>Organization:</b> ' + ((dataset.organization) ? dataset.organization.name : "") + '<br>';
        html += '<b>Dataset Name:</b> ' + dataset.name + '<br>';
        html += '<b>Dataset Title:</b> ' + dataset.title + '<div style="height: 1px; background: '+ window.getComputedStyle(document.documentElement).getPropertyValue('--mainColor')+'; margin: 12px 0;"></div>';

        return html;
    };

    dkan_Provider.prototype.getDatasetUrl = function(providerUrl, datasetId) {
        return 'https://cors.io/?' +providerUrl + '/?q=api/3/action/current_package_list_with_resources/';
    };

    dkan_Provider.prototype.getResourceUrl = function(providerUrl, dataset, resourceIndex, datasetId)
    {
        for(let i=0; i<dataset.result.length; i++)
        {
            if(dataset.result[i].id === datasetId)
                return 'https://cors.io/?' + providerUrl +'/?q=api/action/datastore/search.json&resource_id=' + dataset.result[i].resources[resourceIndex].id;
        }
    };

    return dkan_Provider;

})();