import * as alasql_utility   from '../vendors/alasql/alasql-utility.js';
import csvParser from './file-parser-controllet/csvParser.js';
import jsonParser from './file-parser-controllet/jsonParser.js';
import xmlParser from './file-parser-controllet/xmlParser.js';
import kmlParser from './file-parser-controllet/kmlParser.js';

export const requestData = function(data_url,nodeID,datasetID,distributionID,idraURL,format)
{
    return new Promise((res, rej) =>
    {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function()
        {
            if (this.readyState === 4 )
            {
                if(this.status === 200)
                    res({data: this.responseText, contentType: (format!=undefined)?format:xhttp.getResponseHeader("Content-Type")});
                else
                    rej(this);
            }
        };

        xhttp.open("GET", idraURL+"Idra/api/v1/client/downloadFromUri?url="+encodeURIComponent(data_url), true);
        xhttp.send();
    });
};

export const selectData = function(json_results,contentType, data_url)
{
    let f = Object.create(fileParserFactory);
    let provider = f.checkFile(contentType);
    let data = provider.parse(json_results);
    return data;

    // let converter = new DataTypeConverter();

    // let result = converter.inferJsonDataType(data, ["*"]);
    // result = converter.cast(result);
    // return result.dataset;
};

export const filterData = function(data, selected_fields, filters, aggregators, orders)
{
    let selectedFields = JSON.parse(selected_fields);
    filters = JSON.parse(filters);
    aggregators = JSON.parse(aggregators);
    orders = JSON.parse(orders);
    let converter = new DataTypeConverter();

    let fields = [];
    for (let i=0; i < selectedFields.length; i++)
        if (selectedFields[i])
            fields.push(selectedFields[i].value);

    let result = [];

    if(filters && filters.length) {
        data = alasql_utility.alasql_QUERY(data, "*", filters, null, null);
        result = converter.inferJsonDataType(data, ["*"]);
        result = converter.cast(result);
        data = result.dataset;
    }

    if(aggregators && aggregators.length) {
        data = alasql_utility.alasql_QUERY(data, null, null, aggregators, orders);
        result = converter.inferJsonDataType(data, ["*"]);
        result = converter.cast(result);
        data = result.dataset;
    }
    else {
        data = alasql_utility.alasql_QUERY(data, fields, null, null, orders);
        result = converter.inferJsonDataType(data, ["*"]);
        result = converter.cast(result);
        data = result.dataset;
    }

    return alasql_utility.alasql_transformData(data, fields, true);

};

export const transformData = function(data, fields)
{
    return data;
};

let fileParserFactory = {
    checkFile: function (contentType){
        var type="";
        console.log(contentType)
            switch (contentType.toLowerCase()){
                case "text/comma-separated-values":
                case "text/csv":
                case "application/csv":
                case "application/excel":
                case "application/vnd.ms-excel":
                case "application/vnd.msexcel":
                case "text/anytext":
                case "text/plain":
                case "csv":
                    return new csvParser();
                break;	
                case "text/xml":
                case "application/x-xml":
                case "application/xml":
                case "application/rss+xml":
                case "xml":
                    return new xmlParser();
                break;
                case "application/earthviewer":
                case "application/vnd.google-earth.kml+xml":
                case "kml":
                    return new kmlParser();
                break;
                default:
                    return new jsonParser();
            };
            return type;
        }
};