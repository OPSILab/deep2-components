/*
 Highcharts JS v6.2.0 (2018-10-17)

 (c) 2009-2018 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(k){"object"===typeof module&&module.exports?module.exports=k:"function"===typeof define&&define.amd?define(function(){return k}):k(Highcharts)})(function(k){(function(b){var t=b.addEvent,h=b.Axis,k=b.Chart,m=b.color,q,g=b.each,r=b.extend,p=b.isNumber,e=b.Legend,c=b.LegendSymbolMixin,x=b.noop,w=b.merge,u=b.pick;b.ColorAxis||(q=b.ColorAxis=function(){this.init.apply(this,arguments)},r(q.prototype,h.prototype),r(q.prototype,{defaultColorAxisOptions:{lineWidth:0,minPadding:0,maxPadding:0,gridLineWidth:1,
    tickPixelInterval:72,startOnTick:!0,endOnTick:!0,offset:0,marker:{animation:{duration:50},width:.01,color:"#999999"},labels:{overflow:"justify",rotation:0},minColor:"#e6ebf5",maxColor:"#003399",tickLength:5,showInLegend:!0},keepProps:["legendGroup","legendItemHeight","legendItemWidth","legendItem","legendSymbol"].concat(h.prototype.keepProps),init:function(a,d){var f="vertical"!==a.options.legend.layout,n;this.coll="colorAxis";n=w(this.defaultColorAxisOptions,{side:f?2:1,reversed:!f},d,{opposite:!f,
    showEmpty:!1,title:null,visible:a.options.legend.enabled});h.prototype.init.call(this,a,n);d.dataClasses&&this.initDataClasses(d);this.initStops();this.horiz=f;this.zoomEnabled=!1;this.defaultLegendLength=200},initDataClasses:function(a){var d=this.chart,f,n=0,l=d.options.chart.colorCount,b=this.options,e=a.dataClasses.length;this.dataClasses=f=[];this.legendItems=[];g(a.dataClasses,function(a,c){a=w(a);f.push(a);a.color||("category"===b.dataClassColor?(c=d.options.colors,l=c.length,a.color=c[n],
    a.colorIndex=n,n++,n===l&&(n=0)):a.color=m(b.minColor).tweenTo(m(b.maxColor),2>e?.5:c/(e-1)))})},setTickPositions:function(){if(!this.dataClasses)return h.prototype.setTickPositions.call(this)},initStops:function(){this.stops=this.options.stops||[[0,this.options.minColor],[1,this.options.maxColor]];g(this.stops,function(a){a.color=m(a[1])})},setOptions:function(a){h.prototype.setOptions.call(this,a);this.options.crosshair=this.options.marker},setAxisSize:function(){var a=this.legendSymbol,d=this.chart,
    f=d.options.legend||{},n,l;a?(this.left=f=a.attr("x"),this.top=n=a.attr("y"),this.width=l=a.attr("width"),this.height=a=a.attr("height"),this.right=d.chartWidth-f-l,this.bottom=d.chartHeight-n-a,this.len=this.horiz?l:a,this.pos=this.horiz?f:n):this.len=(this.horiz?f.symbolWidth:f.symbolHeight)||this.defaultLegendLength},normalizedValue:function(a){this.isLog&&(a=this.val2lin(a));return 1-(this.max-a)/(this.max-this.min||1)},toColor:function(a,d){var f=this.stops,n,l,b=this.dataClasses,e,c;if(b)for(c=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               b.length;c--;){if(e=b[c],n=e.from,f=e.to,(void 0===n||a>=n)&&(void 0===f||a<=f)){l=e.color;d&&(d.dataClass=c,d.colorIndex=e.colorIndex);break}}else{a=this.normalizedValue(a);for(c=f.length;c--&&!(a>f[c][0]););n=f[c]||f[c+1];f=f[c+1]||n;a=1-(f[0]-a)/(f[0]-n[0]||1);l=n.color.tweenTo(f.color,a)}return l},getOffset:function(){var a=this.legendGroup,d=this.chart.axisOffset[this.side];a&&(this.axisParent=a,h.prototype.getOffset.call(this),this.added||(this.added=!0,this.labelLeft=0,this.labelRight=this.width),
    this.chart.axisOffset[this.side]=d)},setLegendColor:function(){var a,d=this.reversed;a=d?1:0;d=d?0:1;a=this.horiz?[a,0,d,0]:[0,d,0,a];this.legendColor={linearGradient:{x1:a[0],y1:a[1],x2:a[2],y2:a[3]},stops:this.stops}},drawLegendSymbol:function(a,d){var f=a.padding,b=a.options,l=this.horiz,c=u(b.symbolWidth,l?this.defaultLegendLength:12),e=u(b.symbolHeight,l?12:this.defaultLegendLength),g=u(b.labelPadding,l?16:30),b=u(b.itemDistance,10);this.setLegendColor();d.legendSymbol=this.chart.renderer.rect(0,
    a.baseline-11,c,e).attr({zIndex:1}).add(d.legendGroup);this.legendItemWidth=c+f+(l?b:g);this.legendItemHeight=e+f+(l?g:0)},setState:function(a){g(this.series,function(d){d.setState(a)})},visible:!0,setVisible:x,getSeriesExtremes:function(){var a=this.series,d=a.length;this.dataMin=Infinity;for(this.dataMax=-Infinity;d--;)a[d].getExtremes(),void 0!==a[d].valueMin&&(this.dataMin=Math.min(this.dataMin,a[d].valueMin),this.dataMax=Math.max(this.dataMax,a[d].valueMax))},drawCrosshair:function(a,d){var f=
    d&&d.plotX,b=d&&d.plotY,c,e=this.pos,g=this.len;d&&(c=this.toPixels(d[d.series.colorKey]),c<e?c=e-2:c>e+g&&(c=e+g+2),d.plotX=c,d.plotY=this.len-c,h.prototype.drawCrosshair.call(this,a,d),d.plotX=f,d.plotY=b,this.cross&&!this.cross.addedToColorAxis&&this.legendGroup&&(this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup),this.cross.addedToColorAxis=!0,this.cross.attr({fill:this.crosshair.color})))},getPlotLinePath:function(a,d,f,b,c){return p(c)?this.horiz?["M",c-4,this.top-6,"L",
    c+4,this.top-6,c,this.top,"Z"]:["M",this.left,c,"L",this.left-6,c+6,this.left-6,c-6,"Z"]:h.prototype.getPlotLinePath.call(this,a,d,f,b)},update:function(a,d){var c=this.chart,b=c.legend;g(this.series,function(a){a.isDirtyData=!0});a.dataClasses&&b.allItems&&(g(b.allItems,function(a){a.isDataClass&&a.legendGroup&&a.legendGroup.destroy()}),c.isDirtyLegend=!0);c.options[this.coll]=w(this.userOptions,a);h.prototype.update.call(this,a,d);this.legendItem&&(this.setLegendColor(),b.colorizeItem(this,!0))},
    remove:function(){this.legendItem&&this.chart.legend.destroyItem(this);h.prototype.remove.call(this)},getDataClassLegendSymbols:function(){var a=this,d=this.chart,f=this.legendItems,e=d.options.legend,l=e.valueDecimals,q=e.valueSuffix||"",h;f.length||g(this.dataClasses,function(e,n){var m=!0,p=e.from,k=e.to;h="";void 0===p?h="\x3c ":void 0===k&&(h="\x3e ");void 0!==p&&(h+=b.numberFormat(p,l)+q);void 0!==p&&void 0!==k&&(h+=" - ");void 0!==k&&(h+=b.numberFormat(k,l)+q);f.push(r({chart:d,name:h,options:{},
        drawLegendSymbol:c.drawRectangle,visible:!0,setState:x,isDataClass:!0,setVisible:function(){m=this.visible=!m;g(a.series,function(a){g(a.points,function(a){a.dataClass===n&&a.setVisible(m)})});d.legend.colorizeItem(this,m)}},e))});return f},name:""}),g(["fill","stroke"],function(a){b.Fx.prototype[a+"Setter"]=function(){this.elem.attr(a,m(this.start).tweenTo(m(this.end),this.pos),null,!0)}}),t(k,"afterGetAxes",function(){var a=this.options.colorAxis;this.colorAxis=[];a&&new q(this,a)}),t(e,"afterGetAllItems",
    function(a){var d=[],c=this.chart.colorAxis[0];c&&c.options&&c.options.showInLegend&&(c.options.dataClasses?d=c.getDataClassLegendSymbols():d.push(c),g(c.series,function(c){b.erase(a.allItems,c)}));for(c=d.length;c--;)a.allItems.unshift(d[c])}),t(e,"afterColorizeItem",function(a){a.visible&&a.item.legendColor&&a.item.legendSymbol.attr({fill:a.item.legendColor})}),t(e,"afterUpdate",function(a,c,b){this.chart.colorAxis[0]&&this.chart.colorAxis[0].update({},b)}))})(k);(function(b){var k=b.defined,h=
    b.each,v=b.noop,m=b.seriesTypes;b.colorPointMixin={isValid:function(){return null!==this.value&&Infinity!==this.value&&-Infinity!==this.value},setVisible:function(b){var g=this,q=b?"show":"hide";g.visible=!!b;h(["graphic","dataLabel"],function(b){if(g[b])g[b][q]()})},setState:function(h){b.Point.prototype.setState.call(this,h);this.graphic&&this.graphic.attr({zIndex:"hover"===h?1:0})}};b.colorSeriesMixin={pointArrayMap:["value"],axisTypes:["xAxis","yAxis","colorAxis"],optionalAxis:"colorAxis",trackerGroups:["group",
    "markerGroup","dataLabelsGroup"],getSymbol:v,parallelArrays:["x","y","value"],colorKey:"value",pointAttribs:m.column.prototype.pointAttribs,translateColors:function(){var b=this,g=this.options.nullColor,k=this.colorAxis,m=this.colorKey;h(this.data,function(e){var c=e[m];if(c=e.options.color||(e.isNull?g:k&&void 0!==c?k.toColor(c,e):e.color||b.color))e.color=c})},colorAttribs:function(b){var g={};k(b.color)&&(g[this.colorProp||"fill"]=b.color);return g}}})(k);(function(b){var k=b.colorPointMixin,h=
    b.each,v=b.merge,m=b.noop,q=b.pick,g=b.Series,r=b.seriesType,p=b.seriesTypes;r("heatmap","scatter",{animation:!1,borderWidth:0,nullColor:"#f7f7f7",dataLabels:{formatter:function(){return this.point.value},inside:!0,verticalAlign:"middle",crop:!1,overflow:!1,padding:0},marker:null,pointRange:null,tooltip:{pointFormat:"{point.x}, {point.y}: {point.value}\x3cbr/\x3e"},states:{hover:{halo:!1,brightness:.2}}},v(b.colorSeriesMixin,{pointArrayMap:["y","value"],hasPointSpecificOptions:!0,getExtremesFromAll:!0,
    directTouch:!0,init:function(){var b;p.scatter.prototype.init.apply(this,arguments);b=this.options;b.pointRange=q(b.pointRange,b.colsize||1);this.yAxis.axisPointRange=b.rowsize||1},translate:function(){var b=this.options,c=this.xAxis,g=this.yAxis,k=b.pointPadding||0,m=function(a,b,c){return Math.min(Math.max(b,a),c)};this.generatePoints();h(this.points,function(a){var d=(b.colsize||1)/2,e=(b.rowsize||1)/2,h=m(Math.round(c.len-c.translate(a.x-d,0,1,0,1)),-c.len,2*c.len),d=m(Math.round(c.len-c.translate(a.x+
        d,0,1,0,1)),-c.len,2*c.len),l=m(Math.round(g.translate(a.y-e,0,1,0,1)),-g.len,2*g.len),e=m(Math.round(g.translate(a.y+e,0,1,0,1)),-g.len,2*g.len),p=q(a.pointPadding,k);a.plotX=a.clientX=(h+d)/2;a.plotY=(l+e)/2;a.shapeType="rect";a.shapeArgs={x:Math.min(h,d)+p,y:Math.min(l,e)+p,width:Math.abs(d-h)-2*p,height:Math.abs(e-l)-2*p}});this.translateColors()},drawPoints:function(){p.column.prototype.drawPoints.call(this);h(this.points,function(b){b.graphic.attr(this.colorAttribs(b))},this)},animate:m,getBox:m,
    drawLegendSymbol:b.LegendSymbolMixin.drawRectangle,alignDataLabel:p.column.prototype.alignDataLabel,getExtremes:function(){g.prototype.getExtremes.call(this,this.valueData);this.valueMin=this.dataMin;this.valueMax=this.dataMax;g.prototype.getExtremes.call(this)}}),b.extend({haloPath:function(b){if(!b)return[];var c=this.shapeArgs;return["M",c.x-b,c.y-b,"L",c.x-b,c.y+c.height+b,c.x+c.width+b,c.y+c.height+b,c.x+c.width+b,c.y-b,"Z"]}},k))})(k)});
//# sourceMappingURL=heatmap.js.map