function ArrayUtils(){}ArrayUtils.TestAndSet=function(a,b,c){return'undefined'==typeof a?null:!1==Array.isArray(a)?null:('undefined'==typeof a[b]&&(a[b]=c),a[b])},ArrayUtils.TestAndInitializeKey=function(a,b,c){return'undefined'==typeof a?null:('undefined'==typeof a[b]&&(a[b]=c),a[b])},ArrayUtils.TestAndIncrement=function(a,b){var c=a[b];return'undefined'==typeof c&&(a[b]=0),a[b]++,a},ArrayUtils.toFieldsArray=function(a){var b=[];return ArrayUtils.IteratorOverKeys(a,function(c,d){c.key=d,b.push(c)}),b},ArrayUtils.IteratorOverKeys=function(a,b){for(var c in a)if(a.hasOwnProperty(c)){var d=a[c];b(d,c)}},ArrayUtils.FindMinMax=function(a,b){var c=null,d=null;for(var e in a)null==c||b(a[e],c.value)?(d=c,c={index:-1,key:e,value:a[e]}):(null==d||b(a[e],d.value))&&(d={index:-1,key:e,value:a[e]});return{first:c,second:d}},ArrayUtils.isArray=function(a){return!!Array.isArray(a)&&0<a.length};export default function DataTypeConverter(){this._fields=[],this._numOfRows=0}DataTypeConverter.TYPES={EMPTY:{value:0,name:'NULL'},TEXT:{value:1,name:'TEXT'},NUMBER:{value:2,name:'NUMBER'},OBJECT:{value:3,name:'OBJECT'},DATETIME:{value:4,name:'DATETIME'}},DataTypeConverter.SUBTYPES={GEOCOORDINATE:{value:1e3,name:'GEOCOORDINATE'},GEOJSON:{value:1001,name:'GEOJSON'},BOOL:{value:1002,name:'BOOL'},CONST:{value:1003,name:'CONST'},CATEGORY:{value:1004,name:'CATEGORY'},PERCENTAGE:{value:1100,name:'PERCENTAGE'},LATITUDE:{value:1101,name:'LATITUDE'},LONGITUDE:{value:1102,name:'LONGITUDE'},DATETIMEYM:{value:1200,name:'DATETIMEYM'},DATETIMEYMD:{value:1201,name:'DATETIMEYMD'},DATETIMEDMY:{value:1202,name:'DATETIMEDMY'},DATETIMEMDY:{value:1203,name:'DATETIMEMDY'},DATETIMEXXY:{value:1203,name:'DATETIMEXXY'},NUMINTEGER:{value:1300,name:'INTEGER'},NUMREAL:{value:1300,name:'REAL'}},DataTypeConverter.LANGS={EN:{value:1e3,name:'EN'},IT:{value:1001,name:'IT'},FR:{value:1100,name:'FR'},NL:{value:1101,name:'NL'}},DataTypeConverter.GEOJSONTYPES=['Point','MultiPoint','LineString','MultiLineString','Polygon','MultiPolygon','GeometryCollection','Feature','FeatureCollection'],DataTypeConverter.prototype=function(){var b=function(k){ArrayUtils.IteratorOverKeys(k,function(l){var m=ArrayUtils.FindMinMax(l._inferredTypes,function(w,x){return w>x}),n=m.first.key;n===DataTypeConverter.TYPES.EMPTY.name&&null!=m.second&&'undefined'!=typeof m.second&&(n=m.second.key),l.type=n,l.typeConfidence=l._inferredTypes[l.type]/l.numOfItems;var m=ArrayUtils.FindMinMax(l._inferredSubTypes,function(w,x){return w>x});if('undefined'!=typeof m&&null!=m&&'undefined'!=typeof m.first&&null!=m.first&&m.first.key===DataTypeConverter.SUBTYPES.DATETIMEXXY.name&&'undefined'!=typeof m.second&&null!=m.second){var o=m.first;m.first=m.second,m.second=o}if('undefined'!==m.second&&null!=m.second&&m.second.key===DataTypeConverter.SUBTYPES.DATETIMEXXY.name){var p=0,q=l._inferredSubTypes[m.first.key];for(var r in l._inferredSubTypes)r!==DataTypeConverter.SUBTYPES.DATETIMEXXY.name&&l._inferredSubTypes[r]==q&&p++;1<p&&(m.first=m.second,m.second=null)}if(l.subtype=null,null!=m&&null!=m.first){l.subtype=m.first.key,l.subtypeConfidence=l._inferredSubTypes[l.subtype]/l.numOfItems;var s=l.name.toLowerCase(),t=l.subtype===DataTypeConverter.SUBTYPES.LATITUDE.name,u=0<=s.indexOf('lat'),v=0<=s.indexOf('ng');!0==t&&!1==u&&!0==v&&(l.subtype=DataTypeConverter.SUBTYPES.LONGITUDE.name)}})},c=function(k){if(null===k||'undefined'==typeof k)return DataTypeConverter.TYPES.EMPTY;if('object'==typeof k)return DataTypeConverter.TYPES.OBJECT;var l=DataTypesUtils.FilterNumber(k);if(!0!==isNaN(l))return DataTypeConverter.TYPES.NUMBER;var m=DataTypesUtils.FilterDateTime(k);return null==m?DataTypeConverter.TYPES.TEXT:m},d=function(k){if(null===k||'undefined'==typeof k)return null;if(Array.isArray(k)&&2==k.length&&DataTypesUtils.FilterNumber(k[0])!=NaN&&DataTypesUtils.FilterNumber(k[1])!=NaN&&4<DataTypesUtils.DecimalPlaces(k[0])&&4<DataTypesUtils.DecimalPlaces(k[1]))return DataTypeConverter.SUBTYPES.GEOCOORDINATE;if('string'==typeof k){var l=k.split(',');if(DataTypesUtils.IsLatLng(l[0])&&DataTypesUtils.IsLatLng(l[1]))return DataTypeConverter.SUBTYPES.GEOCOORDINATE}var m=DataTypesUtils.FilterNumber(k);if(!0!==isNaN(m)){if(-90<=m&&90>=m&&5<=DataTypesUtils.DecimalPlaces(m))return DataTypeConverter.SUBTYPES.GEOCOORDINATE;if(-180<=m&&180>=m&&5<=DataTypesUtils.DecimalPlaces(m))return DataTypeConverter.SUBTYPES.GEOCOORDINATE;var n=(k+'').split(/(,|\.)/g);return 1<n.length?DataTypeConverter.SUBTYPES.NUMREAL:DataTypeConverter.SUBTYPES.NUMINTEGER}if('object'==typeof k&&k.hasOwnProperty('type')){var o=k.type,p=DataTypeConverter.GEOJSONTYPES.includes(o);if(p)return DataTypeConverter.SUBTYPES.GEOJSON}return null},e=function(k,l){return ArrayUtils.IteratorOverKeys(k.types,function(m){if(!(m.typeConfidence>=l)){var o=DataTypeHierarchy.HIERARCHY[m.type];if(null==o)return k;var p={lastType:o[0],lastTypeCounter:m._inferredTypes[o[0]],typeConfidence:0};p.typeConfidence=p.lastTypeCounter/m.numOfItems;for(var r,s,q=1;q<o.length,r=o[q];q++)if(s=m._inferredTypes.hasOwnProperty(r)?m._inferredTypes[r]:0,p.lastType=r,p.lastTypeCounter+=s,p.typeConfidence=p.lastTypeCounter/m.numOfItems,p.typeConfidence>=l){m.type=p.lastType,m.typeConfidence=p.typeConfidence;break}}}),k},f=function(k){return k.charAt(0).toUpperCase()+k.slice(1)},h=function(k,l,m){var n=[],o=0;for(n.push({item:k,fieldKeyIndex:0});0<n.length;){var p=n.pop(),q=p.item,r=p.fieldKeyIndex,s=l[r];if('*'==s&&!1==ArrayUtils.isArray(q)){var t=l.slice(0,r).toString();ArrayUtils.IteratorOverKeys(q,function(y,z){var A=t+(0<t.length?',':'')+z,B=m(y,z,A,o);q[z]=B}),o++;continue}if('*'==s&&!0==ArrayUtils.isArray(q)){for(var v,u=0;u<q.length&&(v=q[u]);u++)n.push({item:v,fieldKeyIndex:r}),o++;continue}var w=q[s];if(Array.isArray(w))for(var x,u=0;u<w.length;u++)x=w[u],n.push({item:x,fieldKeyIndex:r+1});else n.push({item:w,fieldKeyIndex:r+1})}};return{constructor:DataTypeConverter,cast:function(k,l){return('undefined'==typeof l||null==l)&&(l={castThresholdConfidence:1,castIfNull:!1,makeChangesToDataset:!1}),this.convert(k,l)},convert:function(k,l){var m=0,p=0,q=0,r=0;return('undefined'==typeof l||null==l)&&(l={castThresholdConfidence:1,castIfNull:!1,makeChangesToDataset:!1}),h(k.dataset,k.fieldKeys,function(t,u,v,w){var x=k.types[v];q++,m!=w&&(m=w,p++),null!=t&&'undefined'!=typeof t&&0!=(t+'').length;var y=x.typeConfidence>=l.castThresholdConfidence;if(x.type==DataTypeConverter.TYPES.NUMBER.name&&y){!1==isNaN(DataTypesUtils.FilterNumber(t))&&'string'==typeof t&&(t=t.replace(',','.'));var z=parseFloat(t);return isNaN(z)?(r++,t):z}return t}),k.qualityIndex.notNullValues=(q-0)/q,k.qualityIndex.errors=(q-r)/q,k},inferJsonDataType:function(k,l,m){('undefined'==typeof m||null==m)&&(m={}),!1==m.hasOwnProperty('thresholdConfidence')&&(m.thresholdConfidence=1),!1==m.hasOwnProperty('filterOnThresholdConfidence')&&(m.filterOnThresholdConfidence=!0),m.language=!1==m.hasOwnProperty('language')?DataTypeConverter.LANGS.EN.name:m.language.toUpperCase(),!1==m.hasOwnProperty('trackCellsForEachType')&&(m.trackCellsForEachType=!1);var n=[],o={},q=0;if('undefined'==typeof l)throw'IllegalArgumentException: undefined json path to analyse.';for(n.push({item:k,fieldKeyIndex:0});0<n.length;){var r=n.pop(),s=r.item,t=r.fieldKeyIndex,u=l[t];if('*'==u&&!1==ArrayUtils.isArray(s)){var v=l.slice(0,t).toString();ArrayUtils.IteratorOverKeys(s,function(F,G){var H=v+(0==v.length?'':',')+G,I=H;if('undefined'!=typeof k&&k.hasOwnProperty('fields'))if('undefined'!=typeof k.fields[G])I=k.fields[G].label;else for(var K,J=0;J<k.fields.length&&(K=k.fields[J]);J++)K.hasOwnProperty('name')&&K.name===G&&K.hasOwnProperty('label')&&(I=K.label);var L=ArrayUtils.TestAndInitializeKey(o,H,{name:H,label:I,_inferredTypes:[],_inferredSubTypes:[],_inferredValues:[],numOfItems:0});L.numOfItems++;var M=c(F),N=M;if(M.hasOwnProperty('type')&&(N=M.type),ArrayUtils.TestAndIncrement(L._inferredTypes,N.name),N===DataTypeConverter.TYPES.TEXT&&ArrayUtils.TestAndIncrement(L._inferredValues,F),m.trackCellsForEachType){var O=ArrayUtils.TestAndInitializeKey(L._inferredTypes,N.name+'_cells',[]);O.push({columnKey:G,rowIndex:q})}var P=M.hasOwnProperty('subtype')?M.subtype:d(F);null!=P&&'undefined'!=typeof P&&ArrayUtils.TestAndIncrement(L._inferredSubTypes,P.name)}),q++;continue}if('*'==u&&ArrayUtils.isArray(s)){for(var x,w=0;w<s.length&&(x=s[w]);w++)n.push({item:x,fieldKeyIndex:t}),q++;continue}var y=s[u];if(Array.isArray(y))for(var z,w=y.length-1;0<=w;w--)z=y[w],n.push({item:z,fieldKeyIndex:t+1});else n.push({item:y,fieldKeyIndex:t+1})}var A=0;ArrayUtils.IteratorOverKeys(o,function(F){F.numOfItems>A&&(A=F.numOfItems)}),ArrayUtils.IteratorOverKeys(o,function(F){F._inferredTypes.hasOwnProperty(DataTypeConverter.TYPES.EMPTY.name)||(F._inferredTypes[DataTypeConverter.TYPES.EMPTY.name]=0),F._inferredTypes[DataTypeConverter.TYPES.EMPTY.name]=F._inferredTypes[DataTypeConverter.TYPES.EMPTY.name]+(A-F.numOfItems)}),b(o);var B={homogeneity:1,completeness:1,totalNullValues:0,totalValues:0};ArrayUtils.IteratorOverKeys(o,function(F){B.totalValues+=F.numOfItems,B.homogeneity*=F.typeConfidence,F.totalNullValues=0,F._inferredTypes.hasOwnProperty(DataTypeConverter.TYPES.EMPTY.name)&&(F.totalNullValues=F._inferredTypes[DataTypeConverter.TYPES.EMPTY.name],B.totalNullValues+=F.totalNullValues)}),B.homogeneity=Math.round(100*B.homogeneity)/100;var C=B.totalValues-B.totalNullValues;B.completeness=Math.round(100*(C/B.totalValues))/100,ArrayUtils.IteratorOverKeys(o,function(F){var G=F.type;F.typeLabel=G;var H=('key_type'+G).toLowerCase();if(JDC_LNG.hasOwnProperty(H)){var I=JDC_LNG[H];I.hasOwnProperty(m.language)?F.typeLabel=I[m.language]:console.warn('JSDatachecker translation not found. Language '+m.language+'. Type '+G)}else console.warn('JSDatachecker translation not found. Language '+m.language+'. Type '+G);var J=F.subtype;if(F.subtypeLabel=J,null!=J){var H=('key_subtype'+J).toLowerCase();if(JDC_LNG.hasOwnProperty(H)){var I=JDC_LNG[H];I.hasOwnProperty(m.language)?F.subtypeLabel=I[m.language]:console.warn('JSDatachecker translation not found. Language '+m.language+'. Subtype '+J)}else console.warn('JSDatachecker translation not found. Language '+m.language+'. Subtype '+J)}});var D='';ArrayUtils.IteratorOverKeys(o,function(F){F.errorsDescription='';var G='';if(1>F.typeConfidence){var H=F.numOfItems-F._inferredTypes[F.type];if(0<H){var I=f(JDC_LNG.key_declaretype[m.language])+'.',J=f(JDC_LNG.key_notoftype_singular[m.language])+'.';1<H&&(J=f(JDC_LNG.key_notoftype_plural[m.language])+'.');var K='',L='';if(m.trackCellsForEachType){K=f(JDC_LNG.key_seewrongrows[m.language])+'.';var M=Object.keys(F._inferredTypes).filter(function(X){return 0>X.indexOf('_cells')&&0<F._inferredTypes[X]&&X!==F.type});F.cellsWithWarnings=[];for(var N=0;N<M.length;N++){var O=M[N],P=F._inferredTypes[O+'_cells'];if('undefined'!=typeof P)for(var Q=0;Q<P.length;Q++){var R=P[Q],S=f(JDC_LNG.key_declaretype[m.language])+'. ';S+=f(JDC_LNG.key_cellnotoftype[m.language])+'. ',S=S.replace(/%COL_NAME/g,F.label),S=S.replace(/%COL_TYPE/g,F.type),R.warningMessage=S,O===DataTypeConverter.TYPES.EMPTY.name&&(R.warningMessage=f(JDC_LNG.key_emptycell[m.language])+'.'),F.cellsWithWarnings.push(R)}}for(var N=0;N<M.length;N++){var T=M[N],U=F._inferredTypes[T+'_cells'];if('undefined'!=typeof U)for(var R,Q=0;Q<U.length;Q++)R=U[Q],L+=R.rowIndex+2+'('+T+')'+(Q==U.length-2?', and ':'')+(Q<U.length-2?', ':'')}}var V=I+' '+J+' '+K;V=V.replace(/%COL_NAME/g,F.label),V=V.replace(/%COL_TYPE/g,F.type),V=V.replace(/%COL_ERRORS/g,H),V=V.replace(/%LIST_WRONG_ROWS/g,L),G+=V}}if(F.type===DataTypeConverter.TYPES.DATETIME.name)if(F.subtype===DataTypeConverter.SUBTYPES.DATETIMEXXY.name)G+=' '+f(JDC_LNG.key_dateformatunknown[m.language])+'. ';else{var W=F.numOfItems-F._inferredSubTypes[F.subtype]-(F.hasOwnProperty(DataTypeConverter.SUBTYPES.DATETIMEXXY.name)?F._inferredSubTypes[DataTypeConverter.SUBTYPES.DATETIMEXXY.name]:0);if(0<W){var V=f(JDC_LNG.key_datenotinformat[m.language]);V=V.replace(/%COL_NUMDATENOTINFORMAT/g,W),G+=V}}var V='';1==F.totalNullValues?V=f(JDC_LNG.key_emptyvalue_singolar[m.language])+'.':1<F.totalNullValues&&(V=f(JDC_LNG.key_emptyvalue_plural[m.language])+'.'),G=G+' '+V,G=G.replace(/%COL_NAME/g,F.label),G=G.replace(/%COL_TYPE/g,F.type),G=G.replace(/%COL_SUBTYPE/g,F.subtypeLabel),G=G.replace(/%COL_NULLVALUES/g,F.totalNullValues),F.errorsDescription=G.trim(),D+=G.trim()});var E={dataset:k,fieldKeys:l,types:o,qualityIndex:B,warningsTextual:D};return!0==m.filterOnThresholdConfidence&&e(E,m.thresholdConfidence),E},inferDataTypeOfValue:function(k){return c(k)},inferDataSubTypeOfValue:function(k){return d(k)}}}();function DataTypesUtils(){}DataTypesUtils.FilterTime=function(a){var b=/^[0-9]{2}:[0-9]{2}(:[0-9]{2})?(\+[0-9]{2}:[0-9]{2})?$/;if(!1==b.test(a))return null;var c=a.split(/[:|\+]/),d=/^[0-9]{2}$/,e=d.test(c[0])?parseInt(c[0]):0,f=d.test(c[1])?parseInt(c[1]):0,g=3<=c.length&&d.test(c[2])?parseInt(c[2]):0,h=new Date;return h.setHours(e),h.setMinutes(f),h.setSeconds(g),h},DataTypesUtils.FilterDateTime=function(a){var b=a.split(/[T|\s]/);if(2==b.length){var c=DataTypesUtils.FilterTime(b[1]);if(null==c)return null;var d=DataTypesUtils.FilterDate(b[0],c);return d}var e=DataTypesUtils.FilterDate(a);if(null!=e)return e;var c=DataTypesUtils.FilterTime(a);return c},DataTypesUtils.FilterDate=function(a,b){if(null==b&&(b=new Date('YYYY-MM-DD')),/^[0-9]{1,4}(\-|\/)[0-9]{1,2}$/.test(a)){var c=a.split(/[\-|\/]/),d=parseInt(c[0]),e=parseInt(c[1]);return 12<e?null:(b.setYear(d),b.setMonth(e),{type:DataTypeConverter.TYPES.DATETIME,subtype:DataTypeConverter.SUBTYPES.DATETIMEYM,date:b})}var f=/^[0-9]{1,4}(\-|\/)[0-9]{1,2}((\-|\/)[0-9]{1,2})?$/;if(f.test(a)){var c=a.split(/[\-|\/]/),d=parseInt(c[0]),e=parseInt(c[1]),g=3==c.length?parseInt(c[2]):0;return 0>=e||13<=e?null:0>=g||32<=g?null:(b.setYear(d),b.setMonth(e),b.setDate(g),{type:DataTypeConverter.TYPES.DATETIME,subtype:DataTypeConverter.SUBTYPES.DATETIMEYMD,date:b})}if(f=/^[0-9]{1,2}(\-|\/)[0-9]{1,2}(\-|\/)[0-9]{1,4}$/,f.test(a)){var c=a.split(/[\-|\/]/),d=parseInt(c[2]),e=parseInt(c[1]),g=parseInt(c[0]),h={type:DataTypeConverter.TYPES.DATETIME,subtype:DataTypeConverter.SUBTYPES.DATETIMEDMY,date:b};if(12<e){var k=e;e=g,g=k,h.subtype=DataTypeConverter.SUBTYPES.DATETIMEMDY}return 0>=e||13<=e?null:0>=g||32<=g?null:(12>=g&&12>=e&&(h.subtype=DataTypeConverter.SUBTYPES.DATETIMEXXY),b.setYear(d),b.setMonth(e),b.setDate(g),h)}return null},DataTypesUtils.FilterFloat=function(a){return /^(\-|\+)?((0|([1-9][0-9]*))(\.[0-9]+)?|Infinity)$/.test(a)?+a:NaN},DataTypesUtils.FilterNumber=function(a){var b=DataTypesUtils.FilterFloat(a);if(!1==isNaN(b))return b;if('string'!=typeof a)return NaN;var c=a.split(/(,|\.)/g),d={idx:a.indexOf('.'),sym:'.'},e={idx:a.lastIndexOf(','),sym:','},f={};f=-1==d.idx?e:-1==e.idx?d:d.idx<e.idx?d:e;var g={idx:a.lastIndexOf('.'),sym:'.'},h={idx:a.lastIndexOf(','),sym:','},k={};k=-1==g.idx?h:-1==h.idx?g:g.idx>h.idx?g:h;var l=a.split(/(\.|,|\-|\+)/g);if(0==l.length)return NaN;var m=0,n=0,o=0;('-'==l[0]||'+'==l[0])&&(o=1);for(var p;o<l.length,p=l[o];o++)if('.'==p)m++;else if(','==p)n++;else if(!1==/^(0|([0-9]+))$/g.test(p))return NaN;var q=l[l.length-1];if('.'==q||','==q||0==q.length)return NaN;if(-1==f.idx&&-1==k.idx)return DataTypesUtils.FilterFloat(a);if(f.idx==k.idx&&'.'==f.sym)return+a;if(f.idx==k.idx&&','==f.sym){var r=a.replace(',','.');return+r}return NaN},DataTypesUtils.DecimalPlaces=function(a){var b=(''+a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return b?Math.max(0,(b[1]?b[1].length:0)-(b[2]?+b[2]:0)):0},DataTypesUtils.IsLatLng=function(a){return DataTypesUtils.FilterFloat(a)!=NaN&&!!(4<DataTypesUtils.DecimalPlaces(a))};function DataTypeHierarchy(){}DataTypeHierarchy.HIERARCHY=[],DataTypeHierarchy.HIERARCHY[DataTypeConverter.TYPES.TEXT.name]=[DataTypeConverter.TYPES.TEXT.name],DataTypeHierarchy.HIERARCHY[DataTypeConverter.TYPES.NUMBER.name]=[DataTypeConverter.TYPES.NUMBER.name,DataTypeConverter.TYPES.TEXT.name],DataTypeHierarchy.HIERARCHY[DataTypeConverter.TYPES.DATETIME.name]=[DataTypeConverter.TYPES.DATETIME.name,DataTypeConverter.TYPES.TEXT.name],DataTypeHierarchy.HIERARCHY[DataTypeConverter.SUBTYPES.GEOCOORDINATE.name]=[DataTypeConverter.SUBTYPES.GEOCOORDINATE.name,DataTypeConverter.TYPES.NUMBER.name,DataTypeConverter.TYPES.TEXT.name],DataTypeHierarchy.canConvert=function(a,b){var c=DataTypeHierarchy.HIERARCHY[a],d=c.indexOf(b);return 0<=d};var JDC_LNG={key_declaretype:{EN:'the column \'%COL_NAME\' is of type \'%COL_TYPE\'',IT:'la colonna \'%COL_NAME\' \xE8 di tipo \'%COL_TYPE\'',FR:'le colonne \'%COL_NAME\' est de type \'%COL_TYPE\'',NL:'de kolom \'%COL_NAME\' is van het type \'%COL_TYPE\''},key_notoftype_singular:{EN:'a value is not \'%COL_TYPE\'',IT:'un valore non \xE8 un \'%COL_TYPE\'',FR:'La valeur n\'est pas \'%COL_TYPE\'',NL:'een waarde is niet \'%COL_TYPE\''},key_cellnotoftype:{EN:'the cell value is not \'%COL_TYPE\'',IT:'il valore della cella non \xE8 di tipo \'%COL_TYPE\'',FR:'the cell value is not \'%COL_TYPE\'',NL:'the cell value is not \'%COL_TYPE\''},key_notoftype_plural:{EN:'%COL_ERRORS values are not \'%COL_TYPE\'',IT:'%COL_ERRORS valori non sono di tipo \'%COL_TYPE\'',FR:'%COL_ERRORS les valeurs ne sont pas de type \'%COL_TYPE\'',NL:'%COL_ERRORS waarden niet \'%COL_TYPE\''},key_emptyvalue_singolar:{EN:'the column \'%COL_NAME\' has an empty value',IT:'la colonna \'%COL_NAME\' ha un valore vuoto',FR:'La colonne \'%COL_NAME\'  a une valeur vide',NL:'de kolom \'%COL_NAME\' heeft een lege waarde'},key_emptycell:{EN:'the cell is empty',IT:'la cella \xE8 vuota',FR:'the cell is empty',NL:'the cell is empty'},key_emptyvalue_plural:{EN:'the column \'%COL_NAME\' has \'%COL_NULLVALUES\' empty values',IT:'la colonna \'%COL_NAME\' ha \'%COL_NULLVALUES\' valori vuoti',FR:'La colonne \'%COL_NAME\' a la valeur \'%COL_NULLVALUES\' qui est vide',NL:'de kolom \'%COL_NAME\' heeft \'%COL_NULLVALUES\' lege waarde'},key_seewrongrows:{EN:'check rows \'%LIST_WRONG_ROWS\'',IT:'controlla le righe \'%LIST_WRONG_ROWS\'',FR:'check rows \'%LIST_WRONG_ROWS\'',NL:'check rows \'%LIST_WRONG_ROWS\''},key_type:{EN:'type',IT:'tipo',FR:'type',NL:'type'},key_subtype:{EN:'subtype',IT:'sottotipo',FR:'sous-type',NL:'subtype'},key_typetext:{EN:'text',IT:'testo',FR:'texte',NL:'tekst'},key_typenumber:{EN:'number',IT:'numero',FR:'chiffres',NL:'aantal'},key_typeobject:{EN:'object',IT:'oggetto',FR:'objet',NL:'voorwerp'},key_typedatetime:{EN:'date or time',IT:'data o orario',FR:'date ou l\'heure',NL:'datum of tijd'},key_typeempty:{EN:'empty',IT:'vuoto',FR:'vide',NL:'leeg'},key_typenull:{EN:'empty',IT:'vuoto',FR:'vide',NL:'leeg'},key_typelatitude:{EN:'latitude',IT:'latitudine',FR:'latitude',NL:'breedtegraad'},key_typelongitude:{EN:'longitude',IT:'longitudine',FR:'longitude',NL:'lengtegraad'},key_subtypegeocoordinate:{EN:'coordinate',IT:'coordinate',FR:'coordonn\xE9es',NL:'coordinate'},key_subtypegeojson:{EN:'geojson',IT:'geojson',FR:'geojson',NL:'geojson'},key_subtypebool:{EN:'bool',IT:'bool',FR:'bool',NL:'bool'},key_subtypeconst:{EN:'const',IT:'costante',FR:'const',NL:'const'},key_subtypecategory:{EN:'category',IT:'categoria',FR:'category',NL:'category'},key_subtypepercentage:{EN:'percentage',IT:'percentuale',FR:'percentage',NL:'percentage'},key_subtypelatitude:{EN:'latitude',IT:'latitudine',FR:'latitude',NL:'latitude'},key_subtypelongitude:{EN:'longitude',IT:'longitudine',FR:'longitude',NL:'longitude'},key_subtypedatetimeymd:{EN:'YYYY/MM/DD',IT:'YYYY/MM/DD',FR:'YYYY/MM/DD',NL:'YYYY/MM/DD'},key_subtypedatetimedmy:{EN:'DD/MM/YYYY',IT:'DD/MM/YYYY',FR:'DD/MM/YYYY',NL:'DD/MM/YYYY'},key_subtypedatetimexxy:{EN:'D?M/D?M/YYYY',IT:'D?M/D?M/YYYY',FR:'D?M/D?M/YYYY',NL:'D?M/D?M/YYYY'},key_subtypenuminteger:{EN:'integer number',IT:'numero intero',FR:'integer number',NL:'integer number'},key_subtypenumreal:{EN:'real number',IT:'numero reale',FR:'real number',NL:'real number'},key_subtypeinteger:{EN:'integer number',IT:'numero intero',FR:'integer number',NL:'integer number'},key_subtypereal:{EN:'real number',IT:'numero reale',FR:'real number',NL:'real number'},key_dateformatunknown:{EN:'Cannot determine the date format for the column \'%COL_NAME\'',IT:'Impossibile determinare il formato della data per la colonna \'%COL_NAME\'',FR:'Cannot determine the date format for the column \'%COL_NAME\'',NL:'Cannot determine the date format for the column \'%COL_NAME\''},key_datenotinformat:{EN:'\'%COL_NUMDATENOTINFORMAT\' values of the column \'%COL_NAME\' are not in format \'%COL_SUBTYPE\'',IT:'\'%COL_NUMDATENOTINFORMAT\' valori della colonna \'%COL_NAME\' non sono in formato \'%COL_SUBTYPE\'',FR:'\'%COL_NUMDATENOTINFORMAT\' values of the column \'%COL_NAME\' are not in format \'%COL_SUBTYPE\'',NL:'\'%COL_NUMDATENOTINFORMAT\' values of the column \'%COL_NAME\' are not in format \'%COL_SUBTYPE\''}};function DataTypeHelper(){}DataTypeHelper.forEachType=function(a,b){for(var c=Object.keys(a.types),d=0;d<c.length;d++){var e=c[d],f=a.types[e];b(f)}};