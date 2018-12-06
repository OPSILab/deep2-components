import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import '../lib/vendors/highcharts/highstock.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class LinechartDatalet extends BaseDatalet
{
    constructor()
    {
        super('linechart-datalet');
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
        const template = this.currentDocument.querySelector('#linechart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - linechart-datalet');

        let options = await builder.build('line', this, data);

        let suffix = this.getAttribute("suffix");
        let dataLabels = this.getAttribute("data-labels");

        options.plotOptions.line = {
            dataLabels: {
                formatter: function() {
                    return this.y + ' ' + suffix;
                },
                enabled: dataLabels
            }
        };

        if(data.series[0].data.length > 20)
            Highcharts.stockChart(this.shadowRoot.querySelector('#datalet_container'), options);
        else
            Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}

const FrozenLinechartDatalet = Object.freeze(LinechartDatalet);
window.customElements.define('linechart-datalet', FrozenLinechartDatalet);