import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import '../lib/vendors/highcharts/highstock.js';

class ScatterchartDatalet extends BaseDatalet
{
    constructor()
    {
        super('scatterchart-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours([AjaxJsonAlasqlBehavior, HighChartsBehavior], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        const template = this.currentDocument.querySelector('#scatterchart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - scatterchart-datalet');

        let properties_series;

        if (data.data.length === 3) {// multiseries
            let x = data.data[2]["data"];

            let categories = x.filter(function (item, pos) {
                return x.indexOf(item) === pos;
            });

            let scatterSeries = [];
            let series = [];
            let point = [];

            for (let i = 0; i < categories.length; i++) {
                for (let j = 0; j < x.length; j++) {
                    if (data.data[2].data[j] === categories[i]) {
                        point = [data.data[0].data[j], data.data[1].data[j]];
                        series.push(point);
                    }
                }

                scatterSeries.push({name: categories[i], data: series});
                series = [];
            }

            properties_series = scatterSeries;
        }
        else {// == 2
            let scatterSeries = [];
            let series = [];
            let point = [];

            for (let j = 0; j < data.data[0]["data"].length; j++) {
                point = [data.data[0].data[j], data.data[1].data[j]];
                series.push(point);
            }

            scatterSeries.push({data: series});

            properties_series = scatterSeries;
        }

        let options = {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: this.getAttribute("xAxisLabel")
                }
            },
            yAxis: {
                title: {
                    text: this.getAttribute("yAxisLabel")
                }
            },
            plotOptions: {
                scatter: {
                    dataLabels: {
                        enabled: this.getAttribute("dataLabels")
                    }
                },
            },
            credits: {
                enabled: false
            },
            series: properties_series
        };

        if (this.getAttribute("legend") === "topRight")
            options.legend = {
                layout: 'vertical',
                verticalAlign: 'top',
                align: 'right',
                x: -4,
                y: 4,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts[this.getAttribute("theme")] && Highcharts[this.getAttribute("theme")].legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            };
        else if (this.getAttribute("legend") === "bottom")
            options.legend = {
                enabled: true
            };
        else
            options.legend = {
                enabled: false
            };

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenScatterchartDatalet = Object.freeze(ScatterchartDatalet);
window.customElements.define('scatterchart-datalet', FrozenScatterchartDatalet);