import BaseDatalet from '../base-datalet/base-datalet.js';
import * as AjaxJsonAlasqlBehavior from '../lib/modules/AjaxJsonAlasqlBehavior.js';
import * as HighChartsBehavior from '../lib/modules/HighChartsBehavior.js';
import '../lib/vendors/highcharts/highstock.js';
import '../lib/vendors/highcharts/wordcloud.js';
import * as builder from '../lib/modules/HighChartsBuilder.js';

class WordcloudDatalet extends BaseDatalet
{
    constructor()
    {
        super('wordcloud-datalet');
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
        const template = this.currentDocument.querySelector('#wordcloud-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - wordcloud-datalet');

        let options = await builder.build('wordcloud', this, data);

        let series = [];

        for(let i = 0; i < data.categories.length; i++)
            series.push({name: data.categories[i], weight: data.series[0].data[i]})

        data.series = series;


        options.series = [{
            type: 'wordcloud',
            data: data.series
        }];

        Highcharts.chart(this.shadowRoot.querySelector('#datalet_container'), options);
    }
}


const FrozenWordcloudDatalet = Object.freeze(WordcloudDatalet);
window.customElements.define('wordcloud-datalet', FrozenWordcloudDatalet);