import BaseDatalet from '../base-datalet/base-datalet.js';

class ColumnchartDatalet extends BaseDatalet
{
    constructor()
    {
        super('columnchart-datalet');
    }

    handle_behaviour()
    {
        try {
            //{requestData:0}, {selectData:0}, {filterData:0}, {trasformData:0} -> [0, 0, 0, 0]
            this.set_behaviours(['../lib/modules/AjaxJsonAlasqlBehavior.js', '../lib/modules/HighChartsBehavior.js'], [0, 0, 0, 1]);
        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    }

    template()
    {
        const template = this.currentDocument.querySelector('#columnchart-datalet');
        return template.content.cloneNode(true);
    }

    async render(data)
    {
        console.log('RENDER - columnchart-datalet');

        await this.import_module('../lib/vendors/highstock/highstock.js');
        await this.import_module('../lib/vendors/highstock/themes/themes.js');
        const builder = await this.import_module('../lib/modules/HighChartsBuilder.js');

        builder.build('column', this, data);
    }
}


const FrozenColumnchartDatalet = Object.freeze(ColumnchartDatalet);
window.customElements.define('columnchart-datalet', FrozenColumnchartDatalet);