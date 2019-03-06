//! AlaSQL v0.4.11 | © 2014-2018 Andrey Gershun & Mathias Rangel Wulff | License: MIT
/*
 @module alasql
 @version 0.4.11

 AlaSQL - JavaScript SQL database
 © 2014-2016	Andrey Gershun & Mathias Rangel Wulff

 @license
 The MIT License (MIT)

 Copyright 2014-2016 Andrey Gershun (agershun@gmail.com) & Mathias Rangel Wulff (m@rawu.dk)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

/* eslint-disable */

"use strict";

/**
 @fileoverview AlaSQL JavaScript SQL library
 @see http://github.com/agershun/alasql
 */

/**
 Callback from statement
 @callback statement-callback
 @param {object} data Result data
 */

/**
 UMD envelope for AlaSQL
 */

export default (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        /** alasql main function */
        module.exports = factory();
    } else {
        return factory();
    }
}(this, function () {

    /**
     AlaSQL - Main Alasql class
     @function
     @param {string|function|object} sql - SQL-statement or data object for fuent interface
     @param {object} params - SQL parameters
     @param {function} cb - callback function
     @param {object} scope - Scope for nested queries
     @return {any} - Result data object

     @example
     Standard sync call:
     alasql('CREATE TABLE one');
     Query:
     var res = alasql('SELECT * FROM one');
     Call with parameters:
     var res = alasql('SELECT * FROM ?',[data]);
     Standard async call with callback function:
     alasql('SELECT * FROM ?',[data],function(res){
		console.log(data);
 	});
     Call with scope for subquery (to pass common values):
     var scope = {one:{a:2,b;20}}
     alasql('SELECT * FROM ? two WHERE two.a = one.a',[data],null,scope);
     Call for fluent interface with data object:
     alasql(data).Where(function(x){return x.a == 10}).exec();
     Call for fluent interface without data object:
     alasql().From(data).Where(function(x){return x.a == 10}).exec();
     */

    var alasql = function(sql, params, cb, scope) {

        params = params||[];

        if(typeof importScripts !== 'function' && alasql.webworker) {
            var id = alasql.lastid++;
            alasql.buffer[id] = cb;
            alasql.webworker.postMessage({id:id,sql:sql,params:params});
            return;
        }

        if(arguments.length === 0) {
            // Without arguments - Fluent interface
            return new yy.Select({
                columns:[new yy.Column({columnid:'*'})],
                from: [new yy.ParamValue({param:0})]
            });
        } else if(arguments.length === 1){
            // Access promise notation without using `.promise(...)`
            if(sql.constructor === Array){
                return alasql.promise(sql);
            }
        }
        // Avoid setting params if not needed even with callback
        if(typeof params === 'function'){
            scope = cb;
            cb = params;
            params = [];
        }

        if(typeof params !== 'object'){
            params = [params];
        }

        // Standard interface
        // alasql('#sql');
        if(typeof sql === 'string' && sql[0]==='#' && typeof document === "object") {
            sql = document.querySelector(sql).textContent;
        } else if(typeof sql === 'object' && sql instanceof HTMLElement) {
            sql = sql.textContent;
        } else if(typeof sql === 'function') {
            // to run multiline functions
            sql = sql.toString();
            sql = (/\/\*([\S\s]+)\*\//m.exec(sql) || ['','Function given as SQL. Plese Provide SQL string or have a /* ... */ syle comment with SQL in the function.'])[1];
        }
        // Run SQL
        return alasql.exec(sql, params, cb, scope);
    };

    /**
     Current version of alasql
     @constant {string}
     */
    alasql.version = '0.4.11';

    /**
     Debug flag
     @type {boolean}
     */
    alasql.debug = undefined; // Initial debug variable

//*only-for-browser/*
    var require = function(){return null}; // as alasqlparser.js is generated, we can not "remove" referenses to
    var __dirname = '';
//*/

    /* parser generated by jison 0.4.18 */
    /*
     Returns a Parser object of the following structure:

     Parser: {
     yy: {}
     }

     Parser.prototype: {
     yy: {},
     trace: function(),
     symbols_: {associative list: name ==> number},
     terminals_: {associative list: number ==> name},
     productions_: [...],
     performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
     table: [...],
     defaultActions: {...},
     parseError: function(str, hash),
     parse: function(input),

     lexer: {
     EOF: 1,
     parseError: function(str, hash),
     setInput: function(input),
     input: function(),
     unput: function(str),
     more: function(),
     less: function(n),
     pastInput: function(),
     upcomingInput: function(),
     showPosition: function(),
     test_match: function(regex_match_array, rule_index),
     next: function(),
     lex: function(),
     begin: function(condition),
     popState: function(),
     _currentRules: function(),
     topState: function(),
     pushState: function(condition),

     options: {
     ranges: boolean           (optional: true ==> token location info will include a .range[] member)
     flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
     backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
     },

     performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
     rules: [...],
     conditions: {associative list: name ==> set},
     }
     }

     token location info (@$, _$, etc.): {
     first_line: n,
     last_line: n,
     first_column: n,
     last_column: n,
     range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
     }

     the parseError function receives a 'hash' object with these members for lexer and parser errors: {
     text:        (matched text)
     token:       (the produced terminal token, if any)
     line:        (yylineno)
     }
     while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
     loc:         (yylloc)
     expected:    (string describing the set of expected tokens)
     recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
     }
     */
    var alasqlparser = (function(){
        var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,13],$V1=[1,104],$V2=[1,102],$V3=[1,103],$V4=[1,6],$V5=[1,42],$V6=[1,79],$V7=[1,76],$V8=[1,94],$V9=[1,93],$Va=[1,69],$Vb=[1,101],$Vc=[1,85],$Vd=[1,64],$Ve=[1,71],$Vf=[1,84],$Vg=[1,66],$Vh=[1,70],$Vi=[1,68],$Vj=[1,61],$Vk=[1,74],$Vl=[1,62],$Vm=[1,67],$Vn=[1,83],$Vo=[1,77],$Vp=[1,86],$Vq=[1,87],$Vr=[1,81],$Vs=[1,82],$Vt=[1,80],$Vu=[1,88],$Vv=[1,89],$Vw=[1,90],$Vx=[1,91],$Vy=[1,92],$Vz=[1,98],$VA=[1,65],$VB=[1,78],$VC=[1,72],$VD=[1,96],$VE=[1,97],$VF=[1,63],$VG=[1,73],$VH=[1,108],$VI=[1,107],$VJ=[10,306,602,764],$VK=[10,306,310,602,764],$VL=[1,115],$VM=[1,116],$VN=[1,117],$VO=[1,118],$VP=[1,119],$VQ=[130,353,410],$VR=[1,127],$VS=[1,126],$VT=[1,134],$VU=[1,164],$VV=[1,175],$VW=[1,178],$VX=[1,173],$VY=[1,181],$VZ=[1,185],$V_=[1,160],$V$=[1,182],$V01=[1,169],$V11=[1,171],$V21=[1,174],$V31=[1,183],$V41=[1,166],$V51=[1,193],$V61=[1,188],$V71=[1,189],$V81=[1,194],$V91=[1,195],$Va1=[1,196],$Vb1=[1,197],$Vc1=[1,198],$Vd1=[1,199],$Ve1=[1,200],$Vf1=[1,201],$Vg1=[1,202],$Vh1=[1,176],$Vi1=[1,177],$Vj1=[1,179],$Vk1=[1,180],$Vl1=[1,186],$Vm1=[1,192],$Vn1=[1,184],$Vo1=[1,187],$Vp1=[1,172],$Vq1=[1,170],$Vr1=[1,191],$Vs1=[1,203],$Vt1=[2,4,5],$Vu1=[2,471],$Vv1=[1,206],$Vw1=[1,211],$Vx1=[1,220],$Vy1=[1,216],$Vz1=[10,72,78,93,98,118,128,162,168,169,183,198,232,245,247,306,310,602,764],$VA1=[2,4,5,10,72,76,77,78,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,183,185,187,198,280,281,282,283,284,285,286,287,288,306,310,420,424,602,764],$VB1=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VC1=[1,249],$VD1=[1,256],$VE1=[1,265],$VF1=[1,270],$VG1=[1,269],$VH1=[2,4,5,10,72,77,78,93,98,107,118,128,131,132,137,143,145,149,152,154,156,162,168,169,179,180,181,183,198,232,245,247,265,266,270,271,273,280,281,282,283,284,285,286,287,288,290,291,292,293,294,295,296,297,298,299,302,303,306,310,312,317,420,424,602,764],$VI1=[2,162],$VJ1=[1,281],$VK1=[10,74,78,306,310,505,602,764],$VL1=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,193,198,206,208,222,223,224,225,226,227,228,229,230,231,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,297,300,302,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,343,344,356,368,369,370,373,374,386,389,396,400,401,402,403,404,405,406,408,409,417,418,420,424,426,433,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,514,515,516,517,602,764],$VM1=[2,4,5,10,53,72,89,124,146,156,189,266,267,290,306,335,338,339,396,400,401,404,406,408,409,417,418,434,436,437,439,440,441,442,443,447,448,451,452,505,507,508,517,602,764],$VN1=[1,562],$VO1=[1,564],$VP1=[2,503],$VQ1=[1,569],$VR1=[1,580],$VS1=[1,583],$VT1=[1,584],$VU1=[10,78,89,132,137,146,189,296,306,310,470,602,764],$VV1=[10,74,306,310,602,764],$VW1=[2,567],$VX1=[1,602],$VY1=[2,4,5,156],$VZ1=[1,640],$V_1=[1,612],$V$1=[1,646],$V02=[1,647],$V12=[1,620],$V22=[1,631],$V32=[1,618],$V42=[1,626],$V52=[1,619],$V62=[1,627],$V72=[1,629],$V82=[1,621],$V92=[1,622],$Va2=[1,641],$Vb2=[1,638],$Vc2=[1,639],$Vd2=[1,615],$Ve2=[1,617],$Vf2=[1,609],$Vg2=[1,610],$Vh2=[1,611],$Vi2=[1,613],$Vj2=[1,614],$Vk2=[1,616],$Vl2=[1,623],$Vm2=[1,624],$Vn2=[1,628],$Vo2=[1,630],$Vp2=[1,632],$Vq2=[1,633],$Vr2=[1,634],$Vs2=[1,635],$Vt2=[1,636],$Vu2=[1,642],$Vv2=[1,643],$Vw2=[1,644],$Vx2=[1,645],$Vy2=[2,287],$Vz2=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,231,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,297,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,343,356,368,369,373,374,396,400,401,404,406,408,409,417,418,420,424,426,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VA2=[2,359],$VB2=[1,668],$VC2=[1,678],$VD2=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,231,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,426,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VE2=[1,694],$VF2=[1,703],$VG2=[1,702],$VH2=[2,4,5,10,72,74,78,93,98,118,128,162,168,169,206,208,222,223,224,225,226,227,228,229,230,231,232,245,247,306,310,602,764],$VI2=[10,72,74,78,93,98,118,128,162,168,169,206,208,222,223,224,225,226,227,228,229,230,231,232,245,247,306,310,602,764],$VJ2=[2,202],$VK2=[1,725],$VL2=[10,72,78,93,98,118,128,162,168,169,183,232,245,247,306,310,602,764],$VM2=[2,163],$VN2=[1,728],$VO2=[2,4,5,112],$VP2=[1,741],$VQ2=[1,760],$VR2=[1,740],$VS2=[1,739],$VT2=[1,734],$VU2=[1,735],$VV2=[1,737],$VW2=[1,738],$VX2=[1,742],$VY2=[1,743],$VZ2=[1,744],$V_2=[1,745],$V$2=[1,746],$V03=[1,747],$V13=[1,748],$V23=[1,749],$V33=[1,750],$V43=[1,751],$V53=[1,752],$V63=[1,753],$V73=[1,754],$V83=[1,755],$V93=[1,756],$Va3=[1,757],$Vb3=[1,759],$Vc3=[1,761],$Vd3=[1,762],$Ve3=[1,763],$Vf3=[1,764],$Vg3=[1,765],$Vh3=[1,766],$Vi3=[1,767],$Vj3=[1,770],$Vk3=[1,771],$Vl3=[1,772],$Vm3=[1,773],$Vn3=[1,774],$Vo3=[1,775],$Vp3=[1,776],$Vq3=[1,777],$Vr3=[1,778],$Vs3=[1,779],$Vt3=[1,780],$Vu3=[1,781],$Vv3=[74,89,189],$Vw3=[10,74,78,154,187,230,297,306,310,343,356,368,369,373,374,602,764],$Vx3=[1,798],$Vy3=[10,74,78,300,306,310,602,764],$Vz3=[1,799],$VA3=[1,805],$VB3=[1,806],$VC3=[1,810],$VD3=[10,74,78,306,310,602,764],$VE3=[2,4,5,77,131,132,137,143,145,149,152,154,156,179,180,181,265,266,270,271,273,280,281,282,283,284,285,286,287,288,290,291,292,293,294,295,296,297,298,299,302,303,312,317,420,424],$VF3=[10,72,78,93,98,107,118,128,162,168,169,183,198,232,245,247,306,310,602,764],$VG3=[2,4,5,10,72,77,78,93,98,107,118,128,131,132,137,143,145,149,152,154,156,162,164,168,169,179,180,181,183,185,187,195,198,232,245,247,265,266,270,271,273,280,281,282,283,284,285,286,287,288,290,291,292,293,294,295,296,297,298,299,302,303,306,310,312,317,420,424,602,764],$VH3=[2,4,5,132,296],$VI3=[1,844],$VJ3=[10,74,76,78,306,310,602,764],$VK3=[2,738],$VL3=[10,74,76,78,132,139,141,145,152,306,310,420,424,602,764],$VM3=[2,1161],$VN3=[10,74,76,78,139,141,145,152,306,310,420,424,602,764],$VO3=[10,74,76,78,139,141,145,306,310,420,424,602,764],$VP3=[10,74,78,139,141,306,310,602,764],$VQ3=[10,78,89,132,146,189,296,306,310,470,602,764],$VR3=[335,338,339],$VS3=[2,764],$VT3=[1,869],$VU3=[1,870],$VV3=[1,871],$VW3=[1,872],$VX3=[1,881],$VY3=[1,880],$VZ3=[164,166,334],$V_3=[2,444],$V$3=[1,936],$V04=[2,4,5,77,131,156,290,291,292,293],$V14=[1,951],$V24=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,118,122,124,128,129,130,131,132,134,135,137,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,313,314,315,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$V34=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$V44=[2,375],$V54=[1,958],$V64=[306,308,310],$V74=[74,300],$V84=[74,300,426],$V94=[1,965],$Va4=[2,4,5,10,53,72,74,76,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$Vb4=[74,426],$Vc4=[1,978],$Vd4=[1,977],$Ve4=[1,984],$Vf4=[10,72,78,93,98,118,128,162,168,169,232,245,247,306,310,602,764],$Vg4=[1,1010],$Vh4=[10,72,78,306,310,602,764],$Vi4=[1,1016],$Vj4=[1,1017],$Vk4=[1,1018],$Vl4=[2,4,5,10,72,74,76,77,78,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,198,280,281,282,283,284,285,286,287,288,306,310,420,424,602,764],$Vm4=[1,1068],$Vn4=[1,1067],$Vo4=[1,1081],$Vp4=[1,1080],$Vq4=[1,1088],$Vr4=[10,72,74,78,93,98,107,118,128,162,168,169,183,198,232,245,247,306,310,602,764],$Vs4=[1,1119],$Vt4=[10,78,89,146,189,306,310,470,602,764],$Vu4=[1,1139],$Vv4=[1,1138],$Vw4=[1,1137],$Vx4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,297,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,343,356,368,369,373,374,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$Vy4=[1,1153],$Vz4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,118,122,124,128,129,130,131,132,134,135,137,139,140,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,313,314,315,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VA4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,118,122,124,128,129,130,131,132,134,135,137,139,140,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,313,315,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VB4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,118,122,124,128,129,130,131,132,133,134,135,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,313,314,315,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VC4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,118,122,124,128,129,130,131,132,134,135,137,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,313,314,315,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VD4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,118,122,124,128,129,130,131,132,134,135,137,139,140,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,314,320,321,322,323,324,325,326,330,331,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VE4=[2,406],$VF4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,107,118,122,128,129,130,131,132,134,135,137,143,145,146,148,149,150,152,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,314,330,331,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VG4=[2,285],$VH4=[2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,426,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$VI4=[10,78,306,310,602,764],$VJ4=[1,1189],$VK4=[10,77,78,143,145,152,181,302,306,310,420,424,602,764],$VL4=[10,74,78,306,308,310,464,602,764],$VM4=[1,1200],$VN4=[10,72,78,118,128,162,168,169,232,245,247,306,310,602,764],$VO4=[10,72,74,78,93,98,118,128,162,168,169,183,198,232,245,247,306,310,602,764],$VP4=[2,4,5,72,76,77,78,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,185,187,280,281,282,283,284,285,286,287,288,420,424],$VQ4=[2,4,5,72,74,76,77,78,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,185,187,280,281,282,283,284,285,286,287,288,420,424],$VR4=[2,1085],$VS4=[2,4,5,72,74,76,77,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,185,187,280,281,282,283,284,285,286,287,288,420,424],$VT4=[1,1252],$VU4=[10,74,78,128,306,308,310,464,602,764],$VV4=[115,116,124],$VW4=[2,584],$VX4=[1,1280],$VY4=[76,139],$VZ4=[2,724],$V_4=[1,1297],$V$4=[1,1298],$V05=[2,4,5,10,53,72,76,89,124,146,156,189,230,266,267,290,306,310,335,338,339,396,400,401,404,406,408,409,417,418,434,436,437,439,440,441,442,443,447,448,451,452,505,507,508,517,602,764],$V15=[2,330],$V25=[1,1322],$V35=[1,1336],$V45=[1,1338],$V55=[2,487],$V65=[74,78],$V75=[10,306,308,310,464,602,764],$V85=[10,72,78,118,162,168,169,232,245,247,306,310,602,764],$V95=[1,1354],$Va5=[1,1358],$Vb5=[1,1359],$Vc5=[1,1361],$Vd5=[1,1362],$Ve5=[1,1363],$Vf5=[1,1364],$Vg5=[1,1365],$Vh5=[1,1366],$Vi5=[1,1367],$Vj5=[1,1368],$Vk5=[10,72,74,78,93,98,118,128,162,168,169,206,208,222,223,224,225,226,227,228,229,232,245,247,306,310,602,764],$Vl5=[1,1393],$Vm5=[10,72,78,118,162,168,169,245,247,306,310,602,764],$Vn5=[10,72,78,93,98,118,128,162,168,169,206,208,222,223,224,225,226,227,228,229,232,245,247,306,310,602,764],$Vo5=[1,1490],$Vp5=[1,1492],$Vq5=[2,4,5,77,143,145,152,156,181,290,291,292,293,302,420,424],$Vr5=[1,1506],$Vs5=[10,72,74,78,162,168,169,245,247,306,310,602,764],$Vt5=[1,1524],$Vu5=[1,1526],$Vv5=[1,1527],$Vw5=[1,1523],$Vx5=[1,1522],$Vy5=[1,1521],$Vz5=[1,1528],$VA5=[1,1518],$VB5=[1,1519],$VC5=[1,1520],$VD5=[1,1545],$VE5=[2,4,5,10,53,72,89,124,146,156,189,266,267,290,306,310,335,338,339,396,400,401,404,406,408,409,417,418,434,436,437,439,440,441,442,443,447,448,451,452,505,507,508,517,602,764],$VF5=[1,1556],$VG5=[1,1564],$VH5=[1,1563],$VI5=[10,72,78,162,168,169,245,247,306,310,602,764],$VJ5=[10,72,78,93,98,118,128,162,168,169,206,208,222,223,224,225,226,227,228,229,230,231,232,245,247,306,310,602,764],$VK5=[2,4,5,10,72,78,93,98,118,128,162,168,169,206,208,222,223,224,225,226,227,228,229,230,231,232,245,247,306,310,602,764],$VL5=[1,1621],$VM5=[1,1623],$VN5=[1,1620],$VO5=[1,1622],$VP5=[187,193,368,369,370,373],$VQ5=[2,515],$VR5=[1,1628],$VS5=[1,1647],$VT5=[10,72,78,162,168,169,306,310,602,764],$VU5=[1,1657],$VV5=[1,1658],$VW5=[1,1659],$VX5=[1,1678],$VY5=[4,10,243,306,310,343,356,602,764],$VZ5=[1,1726],$V_5=[10,72,74,78,118,162,168,169,239,245,247,306,310,602,764],$V$5=[2,4,5,77],$V06=[1,1820],$V16=[1,1832],$V26=[1,1851],$V36=[10,72,78,162,168,169,306,310,415,602,764],$V46=[10,74,78,230,306,310,602,764];
        var parser = {trace: function trace() { },
            yy: {},
            symbols_: {"error":2,"Literal":3,"LITERAL":4,"BRALITERAL":5,"NonReserved":6,"LiteralWithSpaces":7,"main":8,"Statements":9,"EOF":10,"Statements_group0":11,"AStatement":12,"ExplainStatement":13,"EXPLAIN":14,"QUERY":15,"PLAN":16,"Statement":17,"AlterTable":18,"AttachDatabase":19,"Call":20,"CreateDatabase":21,"CreateIndex":22,"CreateGraph":23,"CreateTable":24,"CreateView":25,"CreateEdge":26,"CreateVertex":27,"Declare":28,"Delete":29,"DetachDatabase":30,"DropDatabase":31,"DropIndex":32,"DropTable":33,"DropView":34,"If":35,"Insert":36,"Merge":37,"Reindex":38,"RenameTable":39,"Select":40,"ShowCreateTable":41,"ShowColumns":42,"ShowDatabases":43,"ShowIndex":44,"ShowTables":45,"TruncateTable":46,"WithSelect":47,"CreateTrigger":48,"DropTrigger":49,"BeginTransaction":50,"CommitTransaction":51,"RollbackTransaction":52,"EndTransaction":53,"UseDatabase":54,"Update":55,"JavaScript":56,"Source":57,"Assert":58,"While":59,"Continue":60,"Break":61,"BeginEnd":62,"Print":63,"Require":64,"SetVariable":65,"ExpressionStatement":66,"AddRule":67,"Query":68,"Echo":69,"CreateFunction":70,"CreateAggregate":71,"WITH":72,"WithTablesList":73,"COMMA":74,"WithTable":75,"AS":76,"LPAR":77,"RPAR":78,"SelectClause":79,"Select_option0":80,"IntoClause":81,"FromClause":82,"Select_option1":83,"WhereClause":84,"GroupClause":85,"OrderClause":86,"LimitClause":87,"UnionClause":88,"SEARCH":89,"Select_repetition0":90,"Select_option2":91,"PivotClause":92,"PIVOT":93,"Expression":94,"FOR":95,"PivotClause_option0":96,"PivotClause_option1":97,"UNPIVOT":98,"IN":99,"ColumnsList":100,"PivotClause_option2":101,"PivotClause2":102,"AsList":103,"AsLiteral":104,"AsPart":105,"RemoveClause":106,"REMOVE":107,"RemoveClause_option0":108,"RemoveColumnsList":109,"RemoveColumn":110,"Column":111,"LIKE":112,"StringValue":113,"ArrowDot":114,"ARROW":115,"DOT":116,"SearchSelector":117,"ORDER":118,"BY":119,"OrderExpressionsList":120,"SearchSelector_option0":121,"DOTDOT":122,"CARET":123,"EQ":124,"SearchSelector_repetition_plus0":125,"SearchSelector_repetition_plus1":126,"SearchSelector_option1":127,"WHERE":128,"OF":129,"CLASS":130,"NUMBER":131,"STRING":132,"SLASH":133,"VERTEX":134,"EDGE":135,"EXCLAMATION":136,"SHARP":137,"MODULO":138,"GT":139,"LT":140,"GTGT":141,"LTLT":142,"DOLLAR":143,"Json":144,"AT":145,"SET":146,"SetColumnsList":147,"TO":148,"VALUE":149,"ROW":150,"ExprList":151,"COLON":152,"PlusStar":153,"NOT":154,"SearchSelector_repetition2":155,"IF":156,"SearchSelector_repetition3":157,"Aggregator":158,"SearchSelector_repetition4":159,"SearchSelector_group0":160,"SearchSelector_repetition5":161,"UNION":162,"SearchSelectorList":163,"ALL":164,"SearchSelector_repetition6":165,"ANY":166,"SearchSelector_repetition7":167,"INTERSECT":168,"EXCEPT":169,"AND":170,"OR":171,"PATH":172,"RETURN":173,"ResultColumns":174,"REPEAT":175,"SearchSelector_repetition8":176,"SearchSelectorList_repetition0":177,"SearchSelectorList_repetition1":178,"PLUS":179,"STAR":180,"QUESTION":181,"SearchFrom":182,"FROM":183,"SelectModifier":184,"DISTINCT":185,"TopClause":186,"UNIQUE":187,"SelectClause_option0":188,"SELECT":189,"COLUMN":190,"MATRIX":191,"TEXTSTRING":192,"INDEX":193,"RECORDSET":194,"TOP":195,"NumValue":196,"TopClause_option0":197,"INTO":198,"Table":199,"FuncValue":200,"ParamValue":201,"VarValue":202,"FromTablesList":203,"JoinTablesList":204,"ApplyClause":205,"CROSS":206,"APPLY":207,"OUTER":208,"FromTable":209,"FromTable_option0":210,"FromTable_option1":211,"INDEXED":212,"INSERTED":213,"FromString":214,"JoinTable":215,"JoinMode":216,"JoinTableAs":217,"OnClause":218,"JoinTableAs_option0":219,"JoinTableAs_option1":220,"JoinModeMode":221,"NATURAL":222,"JOIN":223,"INNER":224,"LEFT":225,"RIGHT":226,"FULL":227,"SEMI":228,"ANTI":229,"ON":230,"USING":231,"GROUP":232,"GroupExpressionsList":233,"HavingClause":234,"GroupExpression":235,"GROUPING":236,"ROLLUP":237,"CUBE":238,"HAVING":239,"CORRESPONDING":240,"OrderExpression":241,"DIRECTION":242,"COLLATE":243,"NOCASE":244,"LIMIT":245,"OffsetClause":246,"OFFSET":247,"LimitClause_option0":248,"FETCH":249,"LimitClause_option1":250,"LimitClause_option2":251,"LimitClause_option3":252,"ResultColumn":253,"Star":254,"AggrValue":255,"Op":256,"LogicValue":257,"NullValue":258,"ExistsValue":259,"CaseValue":260,"CastClause":261,"ArrayValue":262,"NewClause":263,"Expression_group0":264,"CURRENT_TIMESTAMP":265,"JAVASCRIPT":266,"CREATE":267,"FUNCTION":268,"AGGREGATE":269,"NEW":270,"CAST":271,"ColumnType":272,"CONVERT":273,"PrimitiveValue":274,"OverClause":275,"OVER":276,"OverPartitionClause":277,"OverOrderByClause":278,"PARTITION":279,"SUM":280,"COUNT":281,"MIN":282,"MAX":283,"AVG":284,"FIRST":285,"LAST":286,"AGGR":287,"ARRAY":288,"FuncValue_option0":289,"REPLACE":290,"DATEADD":291,"DATEDIFF":292,"INTERVAL":293,"TRUE":294,"FALSE":295,"NSTRING":296,"NULL":297,"EXISTS":298,"ARRAYLBRA":299,"RBRA":300,"ParamValue_group0":301,"BRAQUESTION":302,"CASE":303,"WhensList":304,"ElseClause":305,"END":306,"When":307,"WHEN":308,"THEN":309,"ELSE":310,"REGEXP":311,"TILDA":312,"GLOB":313,"ESCAPE":314,"NOT_LIKE":315,"BARBAR":316,"MINUS":317,"AMPERSAND":318,"BAR":319,"GE":320,"LE":321,"EQEQ":322,"EQEQEQ":323,"NE":324,"NEEQEQ":325,"NEEQEQEQ":326,"CondOp":327,"AllSome":328,"ColFunc":329,"BETWEEN":330,"NOT_BETWEEN":331,"IS":332,"DOUBLECOLON":333,"SOME":334,"UPDATE":335,"SetColumn":336,"SetColumn_group0":337,"DELETE":338,"INSERT":339,"Into":340,"Values":341,"ValuesListsList":342,"DEFAULT":343,"VALUES":344,"ValuesList":345,"Value":346,"DateValue":347,"TemporaryClause":348,"TableClass":349,"IfNotExists":350,"CreateTableDefClause":351,"CreateTableOptionsClause":352,"TABLE":353,"CreateTableOptions":354,"CreateTableOption":355,"IDENTITY":356,"TEMP":357,"ColumnDefsList":358,"ConstraintsList":359,"Constraint":360,"ConstraintName":361,"PrimaryKey":362,"ForeignKey":363,"UniqueKey":364,"IndexKey":365,"Check":366,"CONSTRAINT":367,"CHECK":368,"PRIMARY":369,"KEY":370,"PrimaryKey_option0":371,"ColsList":372,"FOREIGN":373,"REFERENCES":374,"ForeignKey_option0":375,"OnForeignKeyClause":376,"ParColsList":377,"OnDeleteClause":378,"OnUpdateClause":379,"NO":380,"ACTION":381,"UniqueKey_option0":382,"UniqueKey_option1":383,"ColumnDef":384,"ColumnConstraintsClause":385,"ColumnConstraints":386,"SingularColumnType":387,"NumberMax":388,"ENUM":389,"MAXNUM":390,"ColumnConstraintsList":391,"ColumnConstraint":392,"ParLiteral":393,"ColumnConstraint_option0":394,"ColumnConstraint_option1":395,"DROP":396,"DropTable_group0":397,"IfExists":398,"TablesList":399,"ALTER":400,"RENAME":401,"ADD":402,"MODIFY":403,"ATTACH":404,"DATABASE":405,"DETACH":406,"AsClause":407,"USE":408,"SHOW":409,"VIEW":410,"CreateView_option0":411,"CreateView_option1":412,"SubqueryRestriction":413,"READ":414,"ONLY":415,"OPTION":416,"SOURCE":417,"ASSERT":418,"JsonObject":419,"ATLBRA":420,"JsonArray":421,"JsonValue":422,"JsonPrimitiveValue":423,"LCUR":424,"JsonPropertiesList":425,"RCUR":426,"JsonElementsList":427,"JsonProperty":428,"OnOff":429,"SetPropsList":430,"AtDollar":431,"SetProp":432,"OFF":433,"COMMIT":434,"TRANSACTION":435,"ROLLBACK":436,"BEGIN":437,"ElseStatement":438,"WHILE":439,"CONTINUE":440,"BREAK":441,"PRINT":442,"REQUIRE":443,"StringValuesList":444,"PluginsList":445,"Plugin":446,"ECHO":447,"DECLARE":448,"DeclaresList":449,"DeclareItem":450,"TRUNCATE":451,"MERGE":452,"MergeInto":453,"MergeUsing":454,"MergeOn":455,"MergeMatchedList":456,"OutputClause":457,"MergeMatched":458,"MergeNotMatched":459,"MATCHED":460,"MergeMatchedAction":461,"MergeNotMatchedAction":462,"TARGET":463,"OUTPUT":464,"CreateVertex_option0":465,"CreateVertex_option1":466,"CreateVertex_option2":467,"CreateVertexSet":468,"SharpValue":469,"CONTENT":470,"CreateEdge_option0":471,"GRAPH":472,"GraphList":473,"GraphVertexEdge":474,"GraphElement":475,"GraphVertexEdge_option0":476,"GraphVertexEdge_option1":477,"GraphElementVar":478,"GraphVertexEdge_option2":479,"GraphVertexEdge_option3":480,"GraphVertexEdge_option4":481,"GraphVar":482,"GraphAsClause":483,"GraphAtClause":484,"GraphElement2":485,"GraphElement2_option0":486,"GraphElement2_option1":487,"GraphElement2_option2":488,"GraphElement2_option3":489,"GraphElement_option0":490,"GraphElement_option1":491,"GraphElement_option2":492,"SharpLiteral":493,"GraphElement_option3":494,"GraphElement_option4":495,"GraphElement_option5":496,"ColonLiteral":497,"DeleteVertex":498,"DeleteVertex_option0":499,"DeleteEdge":500,"DeleteEdge_option0":501,"DeleteEdge_option1":502,"DeleteEdge_option2":503,"Term":504,"COLONDASH":505,"TermsList":506,"QUESTIONDASH":507,"CALL":508,"TRIGGER":509,"BeforeAfter":510,"InsertDeleteUpdate":511,"CreateTrigger_option0":512,"CreateTrigger_option1":513,"BEFORE":514,"AFTER":515,"INSTEAD":516,"REINDEX":517,"A":518,"ABSENT":519,"ABSOLUTE":520,"ACCORDING":521,"ADA":522,"ADMIN":523,"ALWAYS":524,"ASC":525,"ASSERTION":526,"ASSIGNMENT":527,"ATTRIBUTE":528,"ATTRIBUTES":529,"BASE64":530,"BERNOULLI":531,"BLOCKED":532,"BOM":533,"BREADTH":534,"C":535,"CASCADE":536,"CATALOG":537,"CATALOG_NAME":538,"CHAIN":539,"CHARACTERISTICS":540,"CHARACTERS":541,"CHARACTER_SET_CATALOG":542,"CHARACTER_SET_NAME":543,"CHARACTER_SET_SCHEMA":544,"CLASS_ORIGIN":545,"COBOL":546,"COLLATION":547,"COLLATION_CATALOG":548,"COLLATION_NAME":549,"COLLATION_SCHEMA":550,"COLUMNS":551,"COLUMN_NAME":552,"COMMAND_FUNCTION":553,"COMMAND_FUNCTION_CODE":554,"COMMITTED":555,"CONDITION_NUMBER":556,"CONNECTION":557,"CONNECTION_NAME":558,"CONSTRAINTS":559,"CONSTRAINT_CATALOG":560,"CONSTRAINT_NAME":561,"CONSTRAINT_SCHEMA":562,"CONSTRUCTOR":563,"CONTROL":564,"CURSOR_NAME":565,"DATA":566,"DATETIME_INTERVAL_CODE":567,"DATETIME_INTERVAL_PRECISION":568,"DB":569,"DEFAULTS":570,"DEFERRABLE":571,"DEFERRED":572,"DEFINED":573,"DEFINER":574,"DEGREE":575,"DEPTH":576,"DERIVED":577,"DESC":578,"DESCRIPTOR":579,"DIAGNOSTICS":580,"DISPATCH":581,"DOCUMENT":582,"DOMAIN":583,"DYNAMIC_FUNCTION":584,"DYNAMIC_FUNCTION_CODE":585,"EMPTY":586,"ENCODING":587,"ENFORCED":588,"EXCLUDE":589,"EXCLUDING":590,"EXPRESSION":591,"FILE":592,"FINAL":593,"FLAG":594,"FOLLOWING":595,"FORTRAN":596,"FOUND":597,"FS":598,"G":599,"GENERAL":600,"GENERATED":601,"GO":602,"GOTO":603,"GRANTED":604,"HEX":605,"HIERARCHY":606,"ID":607,"IGNORE":608,"IMMEDIATE":609,"IMMEDIATELY":610,"IMPLEMENTATION":611,"INCLUDING":612,"INCREMENT":613,"INDENT":614,"INITIALLY":615,"INPUT":616,"INSTANCE":617,"INSTANTIABLE":618,"INTEGRITY":619,"INVOKER":620,"ISOLATION":621,"K":622,"KEY_MEMBER":623,"KEY_TYPE":624,"LENGTH":625,"LEVEL":626,"LIBRARY":627,"LINK":628,"LOCATION":629,"LOCATOR":630,"M":631,"MAP":632,"MAPPING":633,"MAXVALUE":634,"MESSAGE_LENGTH":635,"MESSAGE_OCTET_LENGTH":636,"MESSAGE_TEXT":637,"MINVALUE":638,"MORE":639,"MUMPS":640,"NAME":641,"NAMES":642,"NAMESPACE":643,"NESTING":644,"NEXT":645,"NFC":646,"NFD":647,"NFKC":648,"NFKD":649,"NIL":650,"NORMALIZED":651,"NULLABLE":652,"NULLS":653,"OBJECT":654,"OCTETS":655,"OPTIONS":656,"ORDERING":657,"ORDINALITY":658,"OTHERS":659,"OVERRIDING":660,"P":661,"PAD":662,"PARAMETER_MODE":663,"PARAMETER_NAME":664,"PARAMETER_ORDINAL_POSITION":665,"PARAMETER_SPECIFIC_CATALOG":666,"PARAMETER_SPECIFIC_NAME":667,"PARAMETER_SPECIFIC_SCHEMA":668,"PARTIAL":669,"PASCAL":670,"PASSING":671,"PASSTHROUGH":672,"PERMISSION":673,"PLACING":674,"PLI":675,"PRECEDING":676,"PRESERVE":677,"PRIOR":678,"PRIVILEGES":679,"PUBLIC":680,"RECOVERY":681,"RELATIVE":682,"REPEATABLE":683,"REQUIRING":684,"RESPECT":685,"RESTART":686,"RESTORE":687,"RESTRICT":688,"RETURNED_CARDINALITY":689,"RETURNED_LENGTH":690,"RETURNED_OCTET_LENGTH":691,"RETURNED_SQLSTATE":692,"RETURNING":693,"ROLE":694,"ROUTINE":695,"ROUTINE_CATALOG":696,"ROUTINE_NAME":697,"ROUTINE_SCHEMA":698,"ROW_COUNT":699,"SCALE":700,"SCHEMA":701,"SCHEMA_NAME":702,"SCOPE_CATALOG":703,"SCOPE_NAME":704,"SCOPE_SCHEMA":705,"SECTION":706,"SECURITY":707,"SELECTIVE":708,"SELF":709,"SEQUENCE":710,"SERIALIZABLE":711,"SERVER":712,"SERVER_NAME":713,"SESSION":714,"SETS":715,"SIMPLE":716,"SIZE":717,"SPACE":718,"SPECIFIC_NAME":719,"STANDALONE":720,"STATE":721,"STATEMENT":722,"STRIP":723,"STRUCTURE":724,"STYLE":725,"SUBCLASS_ORIGIN":726,"T":727,"TABLE_NAME":728,"TEMPORARY":729,"TIES":730,"TOKEN":731,"TOP_LEVEL_COUNT":732,"TRANSACTIONS_COMMITTED":733,"TRANSACTIONS_ROLLED_BACK":734,"TRANSACTION_ACTIVE":735,"TRANSFORM":736,"TRANSFORMS":737,"TRIGGER_CATALOG":738,"TRIGGER_NAME":739,"TRIGGER_SCHEMA":740,"TYPE":741,"UNBOUNDED":742,"UNCOMMITTED":743,"UNDER":744,"UNLINK":745,"UNNAMED":746,"UNTYPED":747,"URI":748,"USAGE":749,"USER_DEFINED_TYPE_CATALOG":750,"USER_DEFINED_TYPE_CODE":751,"USER_DEFINED_TYPE_NAME":752,"USER_DEFINED_TYPE_SCHEMA":753,"VALID":754,"VERSION":755,"WHITESPACE":756,"WORK":757,"WRAPPER":758,"WRITE":759,"XMLDECLARATION":760,"XMLSCHEMA":761,"YES":762,"ZONE":763,"SEMICOLON":764,"PERCENT":765,"ROWS":766,"FuncValue_option0_group0":767,"$accept":0,"$end":1},
            terminals_: {2:"error",4:"LITERAL",5:"BRALITERAL",10:"EOF",14:"EXPLAIN",15:"QUERY",16:"PLAN",53:"EndTransaction",72:"WITH",74:"COMMA",76:"AS",77:"LPAR",78:"RPAR",89:"SEARCH",93:"PIVOT",95:"FOR",98:"UNPIVOT",99:"IN",107:"REMOVE",112:"LIKE",115:"ARROW",116:"DOT",118:"ORDER",119:"BY",122:"DOTDOT",123:"CARET",124:"EQ",128:"WHERE",129:"OF",130:"CLASS",131:"NUMBER",132:"STRING",133:"SLASH",134:"VERTEX",135:"EDGE",136:"EXCLAMATION",137:"SHARP",138:"MODULO",139:"GT",140:"LT",141:"GTGT",142:"LTLT",143:"DOLLAR",145:"AT",146:"SET",148:"TO",149:"VALUE",150:"ROW",152:"COLON",154:"NOT",156:"IF",162:"UNION",164:"ALL",166:"ANY",168:"INTERSECT",169:"EXCEPT",170:"AND",171:"OR",172:"PATH",173:"RETURN",175:"REPEAT",179:"PLUS",180:"STAR",181:"QUESTION",183:"FROM",185:"DISTINCT",187:"UNIQUE",189:"SELECT",190:"COLUMN",191:"MATRIX",192:"TEXTSTRING",193:"INDEX",194:"RECORDSET",195:"TOP",198:"INTO",206:"CROSS",207:"APPLY",208:"OUTER",212:"INDEXED",213:"INSERTED",222:"NATURAL",223:"JOIN",224:"INNER",225:"LEFT",226:"RIGHT",227:"FULL",228:"SEMI",229:"ANTI",230:"ON",231:"USING",232:"GROUP",236:"GROUPING",237:"ROLLUP",238:"CUBE",239:"HAVING",240:"CORRESPONDING",242:"DIRECTION",243:"COLLATE",244:"NOCASE",245:"LIMIT",247:"OFFSET",249:"FETCH",265:"CURRENT_TIMESTAMP",266:"JAVASCRIPT",267:"CREATE",268:"FUNCTION",269:"AGGREGATE",270:"NEW",271:"CAST",273:"CONVERT",276:"OVER",279:"PARTITION",280:"SUM",281:"COUNT",282:"MIN",283:"MAX",284:"AVG",285:"FIRST",286:"LAST",287:"AGGR",288:"ARRAY",290:"REPLACE",291:"DATEADD",292:"DATEDIFF",293:"INTERVAL",294:"TRUE",295:"FALSE",296:"NSTRING",297:"NULL",298:"EXISTS",299:"ARRAYLBRA",300:"RBRA",302:"BRAQUESTION",303:"CASE",306:"END",308:"WHEN",309:"THEN",310:"ELSE",311:"REGEXP",312:"TILDA",313:"GLOB",314:"ESCAPE",315:"NOT_LIKE",316:"BARBAR",317:"MINUS",318:"AMPERSAND",319:"BAR",320:"GE",321:"LE",322:"EQEQ",323:"EQEQEQ",324:"NE",325:"NEEQEQ",326:"NEEQEQEQ",330:"BETWEEN",331:"NOT_BETWEEN",332:"IS",333:"DOUBLECOLON",334:"SOME",335:"UPDATE",338:"DELETE",339:"INSERT",343:"DEFAULT",344:"VALUES",347:"DateValue",353:"TABLE",356:"IDENTITY",357:"TEMP",367:"CONSTRAINT",368:"CHECK",369:"PRIMARY",370:"KEY",373:"FOREIGN",374:"REFERENCES",380:"NO",381:"ACTION",386:"ColumnConstraints",389:"ENUM",390:"MAXNUM",396:"DROP",400:"ALTER",401:"RENAME",402:"ADD",403:"MODIFY",404:"ATTACH",405:"DATABASE",406:"DETACH",408:"USE",409:"SHOW",410:"VIEW",414:"READ",415:"ONLY",416:"OPTION",417:"SOURCE",418:"ASSERT",420:"ATLBRA",424:"LCUR",426:"RCUR",433:"OFF",434:"COMMIT",435:"TRANSACTION",436:"ROLLBACK",437:"BEGIN",439:"WHILE",440:"CONTINUE",441:"BREAK",442:"PRINT",443:"REQUIRE",447:"ECHO",448:"DECLARE",451:"TRUNCATE",452:"MERGE",460:"MATCHED",463:"TARGET",464:"OUTPUT",470:"CONTENT",472:"GRAPH",505:"COLONDASH",507:"QUESTIONDASH",508:"CALL",509:"TRIGGER",514:"BEFORE",515:"AFTER",516:"INSTEAD",517:"REINDEX",518:"A",519:"ABSENT",520:"ABSOLUTE",521:"ACCORDING",522:"ADA",523:"ADMIN",524:"ALWAYS",525:"ASC",526:"ASSERTION",527:"ASSIGNMENT",528:"ATTRIBUTE",529:"ATTRIBUTES",530:"BASE64",531:"BERNOULLI",532:"BLOCKED",533:"BOM",534:"BREADTH",535:"C",536:"CASCADE",537:"CATALOG",538:"CATALOG_NAME",539:"CHAIN",540:"CHARACTERISTICS",541:"CHARACTERS",542:"CHARACTER_SET_CATALOG",543:"CHARACTER_SET_NAME",544:"CHARACTER_SET_SCHEMA",545:"CLASS_ORIGIN",546:"COBOL",547:"COLLATION",548:"COLLATION_CATALOG",549:"COLLATION_NAME",550:"COLLATION_SCHEMA",551:"COLUMNS",552:"COLUMN_NAME",553:"COMMAND_FUNCTION",554:"COMMAND_FUNCTION_CODE",555:"COMMITTED",556:"CONDITION_NUMBER",557:"CONNECTION",558:"CONNECTION_NAME",559:"CONSTRAINTS",560:"CONSTRAINT_CATALOG",561:"CONSTRAINT_NAME",562:"CONSTRAINT_SCHEMA",563:"CONSTRUCTOR",564:"CONTROL",565:"CURSOR_NAME",566:"DATA",567:"DATETIME_INTERVAL_CODE",568:"DATETIME_INTERVAL_PRECISION",569:"DB",570:"DEFAULTS",571:"DEFERRABLE",572:"DEFERRED",573:"DEFINED",574:"DEFINER",575:"DEGREE",576:"DEPTH",577:"DERIVED",578:"DESC",579:"DESCRIPTOR",580:"DIAGNOSTICS",581:"DISPATCH",582:"DOCUMENT",583:"DOMAIN",584:"DYNAMIC_FUNCTION",585:"DYNAMIC_FUNCTION_CODE",586:"EMPTY",587:"ENCODING",588:"ENFORCED",589:"EXCLUDE",590:"EXCLUDING",591:"EXPRESSION",592:"FILE",593:"FINAL",594:"FLAG",595:"FOLLOWING",596:"FORTRAN",597:"FOUND",598:"FS",599:"G",600:"GENERAL",601:"GENERATED",602:"GO",603:"GOTO",604:"GRANTED",605:"HEX",606:"HIERARCHY",607:"ID",608:"IGNORE",609:"IMMEDIATE",610:"IMMEDIATELY",611:"IMPLEMENTATION",612:"INCLUDING",613:"INCREMENT",614:"INDENT",615:"INITIALLY",616:"INPUT",617:"INSTANCE",618:"INSTANTIABLE",619:"INTEGRITY",620:"INVOKER",621:"ISOLATION",622:"K",623:"KEY_MEMBER",624:"KEY_TYPE",625:"LENGTH",626:"LEVEL",627:"LIBRARY",628:"LINK",629:"LOCATION",630:"LOCATOR",631:"M",632:"MAP",633:"MAPPING",634:"MAXVALUE",635:"MESSAGE_LENGTH",636:"MESSAGE_OCTET_LENGTH",637:"MESSAGE_TEXT",638:"MINVALUE",639:"MORE",640:"MUMPS",641:"NAME",642:"NAMES",643:"NAMESPACE",644:"NESTING",645:"NEXT",646:"NFC",647:"NFD",648:"NFKC",649:"NFKD",650:"NIL",651:"NORMALIZED",652:"NULLABLE",653:"NULLS",654:"OBJECT",655:"OCTETS",656:"OPTIONS",657:"ORDERING",658:"ORDINALITY",659:"OTHERS",660:"OVERRIDING",661:"P",662:"PAD",663:"PARAMETER_MODE",664:"PARAMETER_NAME",665:"PARAMETER_ORDINAL_POSITION",666:"PARAMETER_SPECIFIC_CATALOG",667:"PARAMETER_SPECIFIC_NAME",668:"PARAMETER_SPECIFIC_SCHEMA",669:"PARTIAL",670:"PASCAL",671:"PASSING",672:"PASSTHROUGH",673:"PERMISSION",674:"PLACING",675:"PLI",676:"PRECEDING",677:"PRESERVE",678:"PRIOR",679:"PRIVILEGES",680:"PUBLIC",681:"RECOVERY",682:"RELATIVE",683:"REPEATABLE",684:"REQUIRING",685:"RESPECT",686:"RESTART",687:"RESTORE",688:"RESTRICT",689:"RETURNED_CARDINALITY",690:"RETURNED_LENGTH",691:"RETURNED_OCTET_LENGTH",692:"RETURNED_SQLSTATE",693:"RETURNING",694:"ROLE",695:"ROUTINE",696:"ROUTINE_CATALOG",697:"ROUTINE_NAME",698:"ROUTINE_SCHEMA",699:"ROW_COUNT",700:"SCALE",701:"SCHEMA",702:"SCHEMA_NAME",703:"SCOPE_CATALOG",704:"SCOPE_NAME",705:"SCOPE_SCHEMA",706:"SECTION",707:"SECURITY",708:"SELECTIVE",709:"SELF",710:"SEQUENCE",711:"SERIALIZABLE",712:"SERVER",713:"SERVER_NAME",714:"SESSION",715:"SETS",716:"SIMPLE",717:"SIZE",718:"SPACE",719:"SPECIFIC_NAME",720:"STANDALONE",721:"STATE",722:"STATEMENT",723:"STRIP",724:"STRUCTURE",725:"STYLE",726:"SUBCLASS_ORIGIN",727:"T",728:"TABLE_NAME",729:"TEMPORARY",730:"TIES",731:"TOKEN",732:"TOP_LEVEL_COUNT",733:"TRANSACTIONS_COMMITTED",734:"TRANSACTIONS_ROLLED_BACK",735:"TRANSACTION_ACTIVE",736:"TRANSFORM",737:"TRANSFORMS",738:"TRIGGER_CATALOG",739:"TRIGGER_NAME",740:"TRIGGER_SCHEMA",741:"TYPE",742:"UNBOUNDED",743:"UNCOMMITTED",744:"UNDER",745:"UNLINK",746:"UNNAMED",747:"UNTYPED",748:"URI",749:"USAGE",750:"USER_DEFINED_TYPE_CATALOG",751:"USER_DEFINED_TYPE_CODE",752:"USER_DEFINED_TYPE_NAME",753:"USER_DEFINED_TYPE_SCHEMA",754:"VALID",755:"VERSION",756:"WHITESPACE",757:"WORK",758:"WRAPPER",759:"WRITE",760:"XMLDECLARATION",761:"XMLSCHEMA",762:"YES",763:"ZONE",764:"SEMICOLON",765:"PERCENT",766:"ROWS"},
            productions_: [0,[3,1],[3,1],[3,2],[7,1],[7,2],[8,2],[9,3],[9,1],[9,1],[13,2],[13,4],[12,1],[17,0],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[47,3],[73,3],[73,1],[75,5],[40,10],[40,4],[92,8],[92,11],[102,4],[104,2],[104,1],[103,3],[103,1],[105,1],[105,3],[106,3],[109,3],[109,1],[110,1],[110,2],[114,1],[114,1],[117,1],[117,5],[117,5],[117,1],[117,2],[117,1],[117,2],[117,2],[117,3],[117,4],[117,4],[117,4],[117,4],[117,4],[117,1],[117,1],[117,1],[117,1],[117,1],[117,1],[117,2],[117,2],[117,2],[117,1],[117,1],[117,1],[117,1],[117,1],[117,1],[117,2],[117,3],[117,4],[117,3],[117,1],[117,4],[117,2],[117,2],[117,4],[117,4],[117,4],[117,4],[117,4],[117,5],[117,4],[117,4],[117,4],[117,4],[117,4],[117,4],[117,4],[117,4],[117,6],[163,3],[163,1],[153,1],[153,1],[153,1],[182,2],[79,4],[79,4],[79,4],[79,3],[184,1],[184,2],[184,2],[184,2],[184,2],[184,2],[184,2],[184,2],[186,3],[186,4],[186,0],[81,0],[81,2],[81,2],[81,2],[81,2],[81,2],[82,2],[82,3],[82,5],[82,0],[205,6],[205,7],[205,6],[205,7],[203,1],[203,3],[209,4],[209,5],[209,3],[209,3],[209,2],[209,3],[209,1],[209,3],[209,2],[209,3],[209,1],[209,1],[209,2],[209,3],[209,1],[209,1],[209,2],[209,3],[209,1],[209,2],[209,3],[214,1],[199,3],[199,1],[204,2],[204,2],[204,1],[204,1],[215,3],[217,1],[217,2],[217,3],[217,3],[217,2],[217,3],[217,4],[217,5],[217,1],[217,2],[217,3],[217,1],[217,2],[217,3],[216,1],[216,2],[221,1],[221,2],[221,2],[221,3],[221,2],[221,3],[221,2],[221,3],[221,2],[221,2],[221,2],[218,2],[218,2],[218,0],[84,0],[84,2],[85,0],[85,4],[233,1],[233,3],[235,5],[235,4],[235,4],[235,1],[234,0],[234,2],[88,0],[88,2],[88,3],[88,2],[88,2],[88,3],[88,4],[88,3],[88,3],[86,0],[86,3],[120,1],[120,3],[241,1],[241,2],[241,3],[241,4],[87,0],[87,3],[87,8],[246,0],[246,2],[174,3],[174,1],[253,3],[253,2],[253,3],[253,2],[253,3],[253,2],[253,1],[254,5],[254,3],[254,1],[111,5],[111,3],[111,3],[111,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,1],[94,3],[94,3],[94,3],[94,1],[94,1],[56,1],[70,5],[71,5],[263,2],[263,2],[261,6],[261,8],[261,6],[261,8],[274,1],[274,1],[274,1],[274,1],[274,1],[274,1],[274,1],[255,5],[255,6],[255,6],[275,0],[275,4],[275,4],[275,5],[277,3],[278,3],[158,1],[158,1],[158,1],[158,1],[158,1],[158,1],[158,1],[158,1],[158,1],[200,5],[200,3],[200,4],[200,4],[200,8],[200,8],[200,8],[200,8],[200,3],[151,1],[151,3],[196,1],[257,1],[257,1],[113,1],[113,1],[258,1],[202,2],[259,4],[262,3],[201,2],[201,2],[201,1],[201,1],[260,5],[260,4],[304,2],[304,1],[307,4],[305,2],[305,0],[256,3],[256,3],[256,3],[256,3],[256,5],[256,3],[256,5],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,5],[256,3],[256,3],[256,3],[256,5],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,3],[256,6],[256,6],[256,3],[256,3],[256,2],[256,2],[256,2],[256,2],[256,2],[256,3],[256,5],[256,6],[256,5],[256,6],[256,4],[256,5],[256,3],[256,4],[256,3],[256,4],[256,3],[256,3],[256,3],[256,3],[256,3],[329,1],[329,1],[329,4],[327,1],[327,1],[327,1],[327,1],[327,1],[327,1],[328,1],[328,1],[328,1],[55,6],[55,4],[147,1],[147,3],[336,3],[336,4],[29,5],[29,3],[36,5],[36,4],[36,7],[36,6],[36,5],[36,4],[36,5],[36,8],[36,7],[36,4],[36,6],[36,7],[341,1],[341,1],[340,0],[340,1],[342,3],[342,1],[342,1],[342,5],[342,3],[342,3],[345,1],[345,3],[346,1],[346,1],[346,1],[346,1],[346,1],[346,1],[100,1],[100,3],[24,9],[24,5],[349,1],[349,1],[352,0],[352,1],[354,2],[354,1],[355,1],[355,3],[355,3],[355,3],[348,0],[348,1],[350,0],[350,3],[351,3],[351,1],[351,2],[359,1],[359,3],[360,2],[360,2],[360,2],[360,2],[360,2],[361,0],[361,2],[366,4],[362,6],[363,9],[377,3],[376,0],[376,2],[378,4],[379,4],[364,6],[365,5],[365,5],[372,1],[372,1],[372,3],[372,3],[358,1],[358,3],[384,3],[384,2],[384,1],[387,6],[387,4],[387,1],[387,4],[272,2],[272,1],[388,1],[388,1],[385,0],[385,1],[391,2],[391,1],[393,3],[392,2],[392,5],[392,3],[392,6],[392,1],[392,2],[392,4],[392,2],[392,1],[392,2],[392,1],[392,1],[392,3],[392,5],[33,4],[399,3],[399,1],[398,0],[398,2],[18,6],[18,6],[18,6],[18,8],[18,6],[39,5],[19,4],[19,7],[19,6],[19,9],[30,3],[21,4],[21,6],[21,9],[21,6],[407,0],[407,2],[54,3],[54,2],[31,4],[31,5],[31,5],[22,8],[22,9],[32,3],[43,2],[43,4],[43,3],[43,5],[45,2],[45,4],[45,4],[45,6],[42,4],[42,6],[44,4],[44,6],[41,4],[41,6],[25,11],[25,8],[413,3],[413,3],[413,5],[34,4],[66,2],[57,2],[58,2],[58,2],[58,4],[144,4],[144,2],[144,2],[144,2],[144,2],[144,1],[144,2],[144,2],[422,1],[422,1],[423,1],[423,1],[423,1],[423,1],[423,1],[423,1],[423,1],[423,3],[419,3],[419,4],[419,2],[421,2],[421,3],[421,1],[425,3],[425,1],[428,3],[428,3],[428,3],[427,3],[427,1],[65,4],[65,3],[65,4],[65,5],[65,5],[65,6],[431,1],[431,1],[430,3],[430,2],[432,1],[432,1],[432,3],[429,1],[429,1],[51,2],[52,2],[50,2],[35,4],[35,3],[438,2],[59,3],[60,1],[61,1],[62,3],[63,2],[63,2],[64,2],[64,2],[446,1],[446,1],[69,2],[444,3],[444,1],[445,3],[445,1],[28,2],[449,1],[449,3],[450,3],[450,4],[450,5],[450,6],[46,3],[37,6],[453,1],[453,2],[454,2],[455,2],[456,2],[456,2],[456,1],[456,1],[458,4],[458,6],[461,1],[461,3],[459,5],[459,7],[459,7],[459,9],[459,7],[459,9],[462,3],[462,6],[462,3],[462,6],[457,0],[457,2],[457,5],[457,4],[457,7],[27,6],[469,2],[468,0],[468,2],[468,2],[468,1],[26,8],[23,3],[23,4],[473,3],[473,1],[474,3],[474,7],[474,6],[474,3],[474,4],[478,1],[478,1],[482,2],[483,3],[484,2],[485,4],[475,4],[475,3],[475,2],[475,1],[497,2],[493,2],[493,2],[498,4],[500,6],[67,3],[67,2],[506,3],[506,1],[504,1],[504,4],[68,2],[20,2],[48,9],[48,8],[48,9],[510,0],[510,1],[510,1],[510,1],[510,2],[511,1],[511,1],[511,1],[49,3],[38,2],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[11,1],[11,1],[80,0],[80,1],[83,0],[83,1],[90,0],[90,2],[91,0],[91,1],[96,0],[96,1],[97,0],[97,1],[101,0],[101,1],[108,0],[108,1],[121,0],[121,1],[125,1],[125,2],[126,1],[126,2],[127,0],[127,1],[155,0],[155,2],[157,0],[157,2],[159,0],[159,2],[160,1],[160,1],[161,0],[161,2],[165,0],[165,2],[167,0],[167,2],[176,0],[176,2],[177,0],[177,2],[178,0],[178,2],[188,0],[188,1],[197,0],[197,1],[210,0],[210,1],[211,0],[211,1],[219,0],[219,1],[220,0],[220,1],[248,0],[248,1],[250,0],[250,1],[251,0],[251,1],[252,0],[252,1],[264,1],[264,1],[767,1],[767,1],[289,0],[289,1],[301,1],[301,1],[337,1],[337,1],[371,0],[371,1],[375,0],[375,1],[382,0],[382,1],[383,0],[383,1],[394,0],[394,1],[395,0],[395,1],[397,1],[397,1],[411,0],[411,1],[412,0],[412,1],[465,0],[465,1],[466,0],[466,1],[467,0],[467,1],[471,0],[471,1],[476,0],[476,1],[477,0],[477,1],[479,0],[479,1],[480,0],[480,1],[481,0],[481,1],[486,0],[486,1],[487,0],[487,1],[488,0],[488,1],[489,0],[489,1],[490,0],[490,1],[491,0],[491,1],[492,0],[492,1],[494,0],[494,1],[495,0],[495,1],[496,0],[496,1],[499,0],[499,2],[501,0],[501,2],[502,0],[502,2],[503,0],[503,2],[512,0],[512,1],[513,0],[513,1]],
            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
                /* this == yyval */

                var $0 = $$.length - 1;
                switch (yystate) {
                    case 1:

                        if (alasql.options.casesensitive) this.$ = $$[$0];
                        else this.$ = $$[$0].toLowerCase();

                        break;
                    case 2:
                        this.$ = doubleq($$[$0].substr(1,$$[$0].length-2));
                        break;
                    case 3:
                        this.$ = $$[$0].toLowerCase()
                        break;
                    case 4:
                        this.$ = $$[$0]
                        break;
                    case 5:
                        this.$ = $$[$0] ? $$[$0-1] + ' ' + $$[$0] : $$[$0-1]
                        break;
                    case 6:
                        return new yy.Statements({statements:$$[$0-1]});
                        break;
                    case 7:
                        this.$ = $$[$0-2]; if($$[$0]) $$[$0-2].push($$[$0]);
                        break;
                    case 8: case 9: case 70: case 80: case 85: case 143: case 177: case 205: case 206: case 242: case 261: case 273: case 354: case 372: case 451: case 474: case 475: case 479: case 487: case 528: case 529: case 566: case 649: case 659: case 683: case 685: case 687: case 701: case 702: case 732: case 756:
                    this.$ = [$$[$0]];
                    break;
                    case 10:
                        this.$ = $$[$0]; $$[$0].explain = true;
                        break;
                    case 11:
                        this.$ = $$[$0];  $$[$0].explain = true;
                        break;
                    case 12:

                        this.$ = $$[$0];

                        // TODO combine exists and queries
                        if(yy.exists) this.$.exists = yy.exists;
                        delete yy.exists;
                        if(yy.queries) this.$.queries = yy.queries;
                        delete yy.queries;

                        break;
                    case 13: case 162: case 172: case 237: case 238: case 240: case 248: case 250: case 259: case 267: case 270: case 375: case 491: case 501: case 503: case 515: case 521: case 522: case 567:
                    this.$ = undefined;
                    break;
                    case 68:
                        this.$ = new yy.WithSelect({withs: $$[$0-1], select:$$[$0]});
                        break;
                    case 69: case 565:
                    $$[$0-2].push($$[$0]); this.$=$$[$0-2];
                    break;
                    case 71:
                        this.$ = {name:$$[$0-4], select:$$[$0-1]};
                        break;
                    case 72:

                        yy.extend(this.$,$$[$0-9]); yy.extend(this.$,$$[$0-8]); yy.extend(this.$,$$[$0-7]); yy.extend(this.$,$$[$0-6]);
                        yy.extend(this.$,$$[$0-5]); yy.extend(this.$,$$[$0-4]);yy.extend(this.$,$$[$0-3]);
                        yy.extend(this.$,$$[$0-2]); yy.extend(this.$,$$[$0-1]); yy.extend(this.$,$$[$0]);
                        this.$ = $$[$0-9];
                        /*		    if(yy.exists) this.$.exists = yy.exists;
                         delete yy.exists;
                         if(yy.queries) this.$.queries = yy.queries;
                         delete yy.queries;
                         */
                        break;
                    case 73:

                        this.$ = new yy.Search({selectors:$$[$0-2], from:$$[$0]});
                        yy.extend(this.$,$$[$0-1]);

                        break;
                    case 74:
                        this.$ = {pivot:{expr:$$[$0-5], columnid:$$[$0-3], inlist:$$[$0-2], as:$$[$0]}};
                        break;
                    case 75:
                        this.$ = {unpivot:{tocolumnid:$$[$0-8], forcolumnid:$$[$0-6], inlist:$$[$0-3], as:$$[$0]}};
                        break;
                    case 76: case 520: case 549: case 585: case 619: case 636: case 637: case 640: case 662:
                    this.$ = $$[$0-1];
                    break;
                    case 77: case 78: case 86: case 147: case 185: case 247: case 280: case 288: case 289: case 290: case 291: case 292: case 293: case 294: case 295: case 296: case 297: case 298: case 299: case 300: case 301: case 304: case 305: case 320: case 321: case 322: case 323: case 324: case 325: case 374: case 440: case 441: case 442: case 443: case 444: case 445: case 516: case 542: case 546: case 548: case 623: case 624: case 625: case 626: case 627: case 628: case 632: case 634: case 635: case 644: case 660: case 661: case 723: case 738: case 739: case 741: case 742: case 748: case 749:
                    this.$ = $$[$0];
                    break;
                    case 79: case 84: case 731: case 755:
                    this.$ = $$[$0-2]; this.$.push($$[$0]);
                    break;
                    case 81:
                        this.$ = {expr:$$[$0]};
                        break;
                    case 82:
                        this.$ = {expr:$$[$0-2],as:$$[$0]};
                        break;
                    case 83:
                        this.$ = {removecolumns:$$[$0]};
                        break;
                    case 87:
                        this.$ = {like:$$[$0]};
                        break;
                    case 90: case 104:
                    this.$ = {srchid:"PROP", args: [$$[$0]]};
                    break;
                    case 91:
                        this.$ = {srchid:"ORDERBY", args: $$[$0-1]};
                        break;
                    case 92:

                        var dir = $$[$0-1];
                        if(!dir) dir = 'ASC';
                        this.$ = {srchid:"ORDERBY", args: [{expression: new yy.Column({columnid:'_'}), direction:dir}]};

                        break;
                    case 93:
                        this.$ = {srchid:"PARENT"};
                        break;
                    case 94:
                        this.$ = {srchid:"APROP", args: [$$[$0]]};
                        break;
                    case 95:
                        this.$ = {selid:"ROOT"};
                        break;
                    case 96:
                        this.$ = {srchid:"EQ", args: [$$[$0]]};
                        break;
                    case 97:
                        this.$ = {srchid:"LIKE", args: [$$[$0]]};
                        break;
                    case 98: case 99:
                    this.$ = {selid:"WITH", args: $$[$0-1]};
                    break;
                    case 100:
                        this.$ = {srchid:$$[$0-3].toUpperCase(), args:$$[$0-1]};
                        break;
                    case 101:
                        this.$ = {srchid:"WHERE", args:[$$[$0-1]]};
                        break;
                    case 102:
                        this.$ = {selid:"OF", args:[$$[$0-1]]};
                        break;
                    case 103:
                        this.$ = {srchid:"CLASS", args:[$$[$0-1]]};
                        break;
                    case 105:
                        this.$ = {srchid:"NAME", args: [$$[$0].substr(1,$$[$0].length-2)]};
                        break;
                    case 106:
                        this.$ = {srchid:"CHILD"};
                        break;
                    case 107:
                        this.$ = {srchid:"VERTEX"};
                        break;
                    case 108:
                        this.$ = {srchid:"EDGE"};
                        break;
                    case 109:
                        this.$ = {srchid:"REF"};
                        break;
                    case 110:
                        this.$ = {srchid:"SHARP", args:[$$[$0]]};
                        break;
                    case 111:
                        this.$ = {srchid:"ATTR", args:((typeof $$[$0] == 'undefined')?undefined:[$$[$0]])};
                        break;
                    case 112:
                        this.$ = {srchid:"ATTR"};
                        break;
                    case 113:
                        this.$ = {srchid:"OUT"};
                        break;
                    case 114:
                        this.$ = {srchid:"IN"};
                        break;
                    case 115:
                        this.$ = {srchid:"OUTOUT"};
                        break;
                    case 116:
                        this.$ = {srchid:"ININ"};
                        break;
                    case 117:
                        this.$ = {srchid:"CONTENT"};
                        break;
                    case 118:
                        this.$ = {srchid:"EX",args:[new yy.Json({value:$$[$0]})]};
                        break;
                    case 119:
                        this.$ = {srchid:"AT", args:[$$[$0]]};
                        break;
                    case 120:
                        this.$ = {srchid:"AS", args:[$$[$0]]};
                        break;
                    case 121:
                        this.$ = {srchid:"SET", args:$$[$0-1]};
                        break;
                    case 122:
                        this.$ = {selid:"TO", args:[$$[$0]]};
                        break;
                    case 123:
                        this.$ = {srchid:"VALUE"};
                        break;
                    case 124:
                        this.$ = {srchid:"ROW", args:$$[$0-1]};
                        break;
                    case 125:
                        this.$ = {srchid:"CLASS", args:[$$[$0]]};
                        break;
                    case 126:
                        this.$ = {selid:$$[$0],args:[$$[$0-1]] };
                        break;
                    case 127:
                        this.$ = {selid:"NOT",args:$$[$0-1] };
                        break;
                    case 128:
                        this.$ = {selid:"IF",args:$$[$0-1] };
                        break;
                    case 129:
                        this.$ = {selid:$$[$0-3],args:$$[$0-1] };
                        break;
                    case 130:
                        this.$ = {selid:'DISTINCT',args:$$[$0-1] };
                        break;
                    case 131:
                        this.$ = {selid:'UNION',args:$$[$0-1] };
                        break;
                    case 132:
                        this.$ = {selid:'UNIONALL',args:$$[$0-1] };
                        break;
                    case 133:
                        this.$ = {selid:'ALL',args:[$$[$0-1]] };
                        break;
                    case 134:
                        this.$ = {selid:'ANY',args:[$$[$0-1]] };
                        break;
                    case 135:
                        this.$ = {selid:'INTERSECT',args:$$[$0-1] };
                        break;
                    case 136:
                        this.$ = {selid:'EXCEPT',args:$$[$0-1] };
                        break;
                    case 137:
                        this.$ = {selid:'AND',args:$$[$0-1] };
                        break;
                    case 138:
                        this.$ = {selid:'OR',args:$$[$0-1] };
                        break;
                    case 139:
                        this.$ = {selid:'PATH',args:[$$[$0-1]] };
                        break;
                    case 140:
                        this.$ = {srchid:'RETURN',args:$$[$0-1] };
                        break;
                    case 141:
                        this.$ = {selid:'REPEAT',sels:$$[$0-3], args:$$[$0-1] };
                        break;
                    case 142:
                        this.$ = $$[$0-2]; this.$.push($$[$0]);
                        break;
                    case 144:
                        this.$ = "PLUS";
                        break;
                    case 145:
                        this.$ = "STAR";
                        break;
                    case 146:
                        this.$ = "QUESTION";
                        break;
                    case 148:
                        this.$ = new yy.Select({ columns:$$[$0], distinct: true }); yy.extend(this.$, $$[$0-3]); yy.extend(this.$, $$[$0-1]);
                        break;
                    case 149:
                        this.$ = new yy.Select({ columns:$$[$0], distinct: true }); yy.extend(this.$, $$[$0-3]);yy.extend(this.$, $$[$0-1]);
                        break;
                    case 150:
                        this.$ = new yy.Select({ columns:$$[$0], all:true }); yy.extend(this.$, $$[$0-3]);yy.extend(this.$, $$[$0-1]);
                        break;
                    case 151:

                        if(!$$[$0]) {
                            this.$ = new yy.Select({columns:[new yy.Column({columnid:'_',})], modifier:'COLUMN'});
                        } else {
                            this.$ = new yy.Select({ columns:$$[$0] }); yy.extend(this.$, $$[$0-2]);yy.extend(this.$, $$[$0-1]);
                        }

                        break;
                    case 152:
                        if($$[$0]=='SELECT') this.$ = undefined; else this.$ = {modifier: $$[$0]};
                        break;
                    case 153:
                        this.$ = {modifier:'VALUE'}
                        break;
                    case 154:
                        this.$ = {modifier:'ROW'}
                        break;
                    case 155:
                        this.$ = {modifier:'COLUMN'}
                        break;
                    case 156:
                        this.$ = {modifier:'MATRIX'}
                        break;
                    case 157:
                        this.$ = {modifier:'TEXTSTRING'}
                        break;
                    case 158:
                        this.$ = {modifier:'INDEX'}
                        break;
                    case 159:
                        this.$ = {modifier:'RECORDSET'}
                        break;
                    case 160:
                        this.$ = {top: $$[$0-1], percent:(typeof $$[$0] != 'undefined'?true:undefined)};
                        break;
                    case 161:
                        this.$ = {top: $$[$0-1]};
                        break;
                    case 163: case 330: case 523: case 524: case 724:
                    this.$ = undefined;
                    break;
                    case 164: case 165: case 166: case 167:
                    this.$ = {into: $$[$0]}
                    break;
                    case 168:

                        var s = $$[$0];
                        s = s.substr(1,s.length-2);
                        var x3 = s.substr(-3).toUpperCase();
                        var x4 = s.substr(-4).toUpperCase();
                        if(s[0] == '#') {
                            this.$ = {into: new yy.FuncValue({funcid: 'HTML', args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]})};
                        } else if(x3=='XLS' || x3 == 'CSV' || x3=='TAB') {
                            this.$ = {into: new yy.FuncValue({funcid: x3, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]})};
                        } else if(x4=='XLSX' || x4 == 'JSON') {
                            this.$ = {into: new yy.FuncValue({funcid: x4, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]})};
                        }

                        break;
                    case 169:
                        this.$ = { from: $$[$0] };
                        break;
                    case 170:
                        this.$ = { from: $$[$0-1], joins: $$[$0] };
                        break;
                    case 171:
                        this.$ = { from: $$[$0-2], joins: $$[$0-1] };
                        break;
                    case 173:
                        this.$ = new yy.Apply({select: $$[$0-2], applymode:'CROSS', as:$$[$0]});
                        break;
                    case 174:
                        this.$ = new yy.Apply({select: $$[$0-3], applymode:'CROSS', as:$$[$0]});
                        break;
                    case 175:
                        this.$ = new yy.Apply({select: $$[$0-2], applymode:'OUTER', as:$$[$0]});
                        break;
                    case 176:
                        this.$ = new yy.Apply({select: $$[$0-3], applymode:'OUTER', as:$$[$0]});
                        break;
                    case 178: case 243: case 452: case 530: case 531:
                    this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
                    break;
                    case 179:
                        this.$ = $$[$0-2]; this.$.as = $$[$0]
                        break;
                    case 180:
                        this.$ = $$[$0-3]; this.$.as = $$[$0]
                        break;
                    case 181:
                        this.$ = $$[$0-1]; this.$.as = 'default'
                        break;
                    case 182:
                        this.$ = new yy.Json({value:$$[$0-2]}); $$[$0-2].as = $$[$0]
                        break;
                    case 183:
                        this.$ = $$[$0-1]; $$[$0-1].as = $$[$0]
                        break;
                    case 184:
                        this.$ = $$[$0-2]; $$[$0-2].as = $$[$0]
                        break;
                    case 186: case 638: case 641:
                    this.$ = $$[$0-2];
                    break;
                    case 187: case 191: case 195: case 198:
                    this.$ = $$[$0-1]; $$[$0-1].as = $$[$0];
                    break;
                    case 188: case 192: case 196: case 199:
                    this.$ = $$[$0-2]; $$[$0-2].as = $$[$0];
                    break;
                    case 189: case 190: case 194: case 197:
                    this.$ = $$[$0]; $$[$0].as = 'default';
                    break;
                    case 193:
                        this.$ = {inserted:true}; /*$$[$0].as = 'default'*/;
                        break;
                    case 200:

                        var s = $$[$0];
                        s = s.substr(1,s.length-2);
                        var x3 = s.substr(-3).toUpperCase();
                        var x4 = s.substr(-4).toUpperCase();
                        var r;
                        if(s[0] == '#') {
                            r = new yy.FuncValue({funcid: 'HTML', args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]});
                        } else if(x3=='XLS' || x3 == 'CSV' || x3=='TAB') {
                            r = new yy.FuncValue({funcid: x3, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]});
                        } else if(x4=='XLSX' || x4 == 'JSON') {
                            r = new yy.FuncValue({funcid: x4, args:[new yy.StringValue({value: s}), new yy.Json({value:{headers:true}})]});
                        } else {
                            throw new Error('Unknown string in FROM clause');
                        };
                        this.$ = r;

                        break;
                    case 201:

                        if($$[$0-2] == 'INFORMATION_SCHEMA') {
                            this.$ = new yy.FuncValue({funcid: $$[$0-2], args:[new yy.StringValue({value:$$[$0]})]});
                        } else {
                            this.$ = new yy.Table({databaseid: $$[$0-2], tableid:$$[$0]});
                        }

                        break;
                    case 202:
                        this.$ = new yy.Table({tableid: $$[$0]});
                        break;
                    case 203: case 204:
                    this.$ = $$[$0-1]; $$[$0-1].push($$[$0]);
                    break;
                    case 207:
                        this.$ = new yy.Join($$[$0-2]); yy.extend(this.$, $$[$0-1]); yy.extend(this.$, $$[$0]);
                        break;
                    case 208:
                        this.$ = {table: $$[$0]};
                        break;
                    case 209:
                        this.$ = {table: $$[$0-1], as: $$[$0] } ;
                        break;
                    case 210:
                        this.$ = {table: $$[$0-2], as: $$[$0] } ;
                        break;
                    case 211:
                        this.$ = {json:new yy.Json({value:$$[$0-2],as:$$[$0]})};
                        break;
                    case 212:
                        this.$ = {param: $$[$0-1], as: $$[$0] } ;
                        break;
                    case 213:
                        this.$ = {param: $$[$0-2], as: $$[$0] } ;
                        break;
                    case 214:
                        this.$ = {select: $$[$0-2], as: $$[$0]} ;
                        break;
                    case 215:
                        this.$ = {select: $$[$0-3], as: $$[$0] } ;
                        break;
                    case 216:
                        this.$ = {funcid:$$[$0], as:'default'};
                        break;
                    case 217:
                        this.$ = {funcid:$$[$0-1], as: $$[$0]};
                        break;
                    case 218:
                        this.$ = {funcid:$$[$0-2], as: $$[$0]};
                        break;
                    case 219:
                        this.$ = {variable:$$[$0],as:'default'};
                        break;
                    case 220:
                        this.$ = {variable:$$[$0-1],as:$$[$0]};
                        break;
                    case 221:
                        this.$ = {variable:$$[$0-2],as:$$[$0]}
                        break;
                    case 222:
                        this.$ = { joinmode: $$[$0] } ;
                        break;
                    case 223:
                        this.$ = {joinmode: $$[$0-1], natural:true} ;
                        break;
                    case 224: case 225:
                    this.$ = "INNER";
                    break;
                    case 226: case 227:
                    this.$ = "LEFT";
                    break;
                    case 228: case 229:
                    this.$ = "RIGHT";
                    break;
                    case 230: case 231:
                    this.$ = "OUTER";
                    break;
                    case 232:
                        this.$ = "SEMI";
                        break;
                    case 233:
                        this.$ = "ANTI";
                        break;
                    case 234:
                        this.$ = "CROSS";
                        break;
                    case 235:
                        this.$ = {on: $$[$0]};
                        break;
                    case 236: case 697:
                    this.$ = {using: $$[$0]};
                    break;
                    case 239:
                        this.$ = {where: new yy.Expression({expression:$$[$0]})};
                        break;
                    case 241:
                        this.$ = {group:$$[$0-1]}; yy.extend(this.$,$$[$0]);
                        break;
                    case 244:
                        this.$ = new yy.GroupExpression({type:'GROUPING SETS', group: $$[$0-1]});
                        break;
                    case 245:
                        this.$ = new yy.GroupExpression({type:'ROLLUP', group: $$[$0-1]});
                        break;
                    case 246:
                        this.$ = new yy.GroupExpression({type:'CUBE', group: $$[$0-1]});
                        break;
                    case 249:
                        this.$ = {having:$$[$0]}
                        break;
                    case 251:
                        this.$ = {union: $$[$0]} ;
                        break;
                    case 252:
                        this.$ = {unionall: $$[$0]} ;
                        break;
                    case 253:
                        this.$ = {except: $$[$0]} ;
                        break;
                    case 254:
                        this.$ = {intersect: $$[$0]} ;
                        break;
                    case 255:
                        this.$ = {union: $$[$0], corresponding:true} ;
                        break;
                    case 256:
                        this.$ = {unionall: $$[$0], corresponding:true} ;
                        break;
                    case 257:
                        this.$ = {except: $$[$0], corresponding:true} ;
                        break;
                    case 258:
                        this.$ = {intersect: $$[$0], corresponding:true} ;
                        break;
                    case 260:
                        this.$ = {order:$$[$0]}
                        break;
                    case 262:
                        this.$ = $$[$0-2]; $$[$0-2].push($$[$0])
                        break;
                    case 263:
                        this.$ = new yy.Expression({expression: $$[$0], direction:'ASC'})
                        break;
                    case 264:
                        this.$ = new yy.Expression({expression: $$[$0-1], direction:$$[$0].toUpperCase()})
                        break;
                    case 265:
                        this.$ = new yy.Expression({expression: $$[$0-2], direction:'ASC', nocase:true})
                        break;
                    case 266:
                        this.$ = new yy.Expression({expression: $$[$0-3], direction:$$[$0].toUpperCase(), nocase:true})
                        break;
                    case 268:
                        this.$ = {limit:$$[$0-1]}; yy.extend(this.$, $$[$0]);
                        break;
                    case 269:
                        this.$ = {limit:$$[$0-2],offset:$$[$0-6]};
                        break;
                    case 271:
                        this.$ = {offset:$$[$0]};
                        break;
                    case 272: case 509: case 533: case 648: case 658: case 682: case 684: case 688:
                    $$[$0-2].push($$[$0]); this.$ = $$[$0-2];
                    break;
                    case 274: case 276: case 278:
                    $$[$0-2].as = $$[$0]; this.$ = $$[$0-2];
                    break;
                    case 275: case 277: case 279:
                    $$[$0-1].as = $$[$0]; this.$ = $$[$0-1];
                    break;
                    case 281:
                        this.$ = new yy.Column({columid: $$[$0], tableid: $$[$0-2], databaseid:$$[$0-4]});
                        break;
                    case 282:
                        this.$ = new yy.Column({columnid: $$[$0], tableid: $$[$0-2]});
                        break;
                    case 283:
                        this.$ = new yy.Column({columnid:$$[$0]});
                        break;
                    case 284:
                        this.$ = new yy.Column({columnid: $$[$0], tableid: $$[$0-2], databaseid:$$[$0-4]});
                        break;
                    case 285: case 286:
                    this.$ = new yy.Column({columnid: $$[$0], tableid: $$[$0-2]});
                    break;
                    case 287:
                        this.$ = new yy.Column({columnid: $$[$0]});
                        break;
                    case 302:
                        this.$ = new yy.DomainValueValue();
                        break;
                    case 303:
                        this.$ = new yy.Json({value:$$[$0]});
                        break;
                    case 306: case 307: case 308:

                    if(!yy.queries) yy.queries = [];
                    yy.queries.push($$[$0-1]);
                    $$[$0-1].queriesidx = yy.queries.length;
                    this.$ = $$[$0-1];

                    break;
                    case 309:
                        this.$ = $$[$0]
                        break;
                    case 310:
                        this.$ = new yy.FuncValue({funcid:'CURRENT_TIMESTAMP'});
                        break;
                    case 311:
                        this.$ = new yy.JavaScript({value:$$[$0].substr(2,$$[$0].length-4)});
                        break;
                    case 312:
                        this.$ = new yy.JavaScript({value:'alasql.fn["'+$$[$0-2]+'"] = '+$$[$0].substr(2,$$[$0].length-4)});
                        break;
                    case 313:
                        this.$ = new yy.JavaScript({value:'alasql.aggr["'+$$[$0-2]+'"] = '+$$[$0].substr(2,$$[$0].length-4)});
                        break;
                    case 314:
                        this.$ = new yy.FuncValue({funcid:$$[$0], newid:true});
                        break;
                    case 315:
                        this.$ = $$[$0]; yy.extend(this.$,{newid:true});
                        break;
                    case 316:
                        this.$ = new yy.Convert({expression:$$[$0-3]}) ; yy.extend(this.$,$$[$0-1]) ;
                        break;
                    case 317:
                        this.$ = new yy.Convert({expression:$$[$0-5], style:$$[$0-1]}) ; yy.extend(this.$,$$[$0-3]) ;
                        break;
                    case 318:
                        this.$ = new yy.Convert({expression:$$[$0-1]}) ; yy.extend(this.$,$$[$0-3]) ;
                        break;
                    case 319:
                        this.$ = new yy.Convert({expression:$$[$0-3], style:$$[$0-1]}) ; yy.extend(this.$,$$[$0-5]) ;
                        break;
                    case 326:
                        this.$ = new yy.FuncValue({funcid:'CURRENT_TIMESTAMP'});
                        break;
                    case 327:

                        if($$[$0-2].length > 1 && ($$[$0-4].toUpperCase() == 'MAX' || $$[$0-4].toUpperCase() == 'MIN')) {
                            this.$ = new yy.FuncValue({funcid:$$[$0-4],args:$$[$0-2]});
                        } else {
                            this.$ = new yy.AggrValue({aggregatorid: $$[$0-4].toUpperCase(), expression: $$[$0-2].pop(), over:$$[$0]});
                        }

                        break;
                    case 328:
                        this.$ = new yy.AggrValue({aggregatorid: $$[$0-5].toUpperCase(), expression: $$[$0-2], distinct:true, over:$$[$0]});
                        break;
                    case 329:
                        this.$ = new yy.AggrValue({aggregatorid: $$[$0-5].toUpperCase(), expression: $$[$0-2],
                            over:$$[$0]});
                        break;
                    case 331: case 332:
                    this.$ = new yy.Over(); yy.extend(this.$,$$[$0-1]);
                    break;
                    case 333:
                        this.$ = new yy.Over(); yy.extend(this.$,$$[$0-2]); yy.extend(this.$,$$[$0-1]);
                        break;
                    case 334:
                        this.$ = {partition:$$[$0]};
                        break;
                    case 335:
                        this.$ = {order:$$[$0]};
                        break;
                    case 336:
                        this.$ = "SUM";
                        break;
                    case 337:
                        this.$ = "COUNT";
                        break;
                    case 338:
                        this.$ = "MIN";
                        break;
                    case 339: case 544:
                    this.$ = "MAX";
                    break;
                    case 340:
                        this.$ = "AVG";
                        break;
                    case 341:
                        this.$ = "FIRST";
                        break;
                    case 342:
                        this.$ = "LAST";
                        break;
                    case 343:
                        this.$ = "AGGR";
                        break;
                    case 344:
                        this.$ = "ARRAY";
                        break;
                    case 345:

                        var funcid = $$[$0-4];
                        var exprlist = $$[$0-1];
                        if(exprlist.length > 1 && (funcid.toUpperCase() == 'MIN' || funcid.toUpperCase() == 'MAX')) {
                            this.$ = new yy.FuncValue({funcid: funcid, args: exprlist});
                        } else if(alasql.aggr[$$[$0-4]]) {
                            this.$ = new yy.AggrValue({aggregatorid: 'REDUCE',
                                funcid: funcid, expression: exprlist.pop(),distinct:($$[$0-2]=='DISTINCT') });
                        } else {
                            this.$ = new yy.FuncValue({funcid: funcid, args: exprlist});
                        };

                        break;
                    case 346:
                        this.$ = new yy.FuncValue({ funcid: $$[$0-2] })
                        break;
                    case 347:
                        this.$ = new yy.FuncValue({ funcid: 'IIF', args:$$[$0-1] })
                        break;
                    case 348:
                        this.$ = new yy.FuncValue({ funcid: 'REPLACE', args:$$[$0-1] })
                        break;
                    case 349:
                        this.$ = new yy.FuncValue({ funcid: 'DATEADD', args:[new yy.StringValue({value:$$[$0-5]}),$$[$0-3],$$[$0-1]]})
                        break;
                    case 350:
                        this.$ = new yy.FuncValue({ funcid: 'DATEADD', args:[$$[$0-5],$$[$0-3],$$[$0-1]]})
                        break;
                    case 351:
                        this.$ = new yy.FuncValue({ funcid: 'DATEDIFF', args:[new yy.StringValue({value:$$[$0-5]}),$$[$0-3],$$[$0-1]]})
                        break;
                    case 352:
                        this.$ = new yy.FuncValue({ funcid: 'DATEDIFF', args:[$$[$0-5],$$[$0-3],$$[$0-1]]})
                        break;
                    case 353:
                        this.$ = new yy.FuncValue({ funcid: 'INTERVAL', args:[$$[$0-1],new yy.StringValue({value:($$[$0]).toLowerCase()})]});
                        break;
                    case 355:
                        $$[$0-2].push($$[$0]); this.$ = $$[$0-2]
                        break;
                    case 356:
                        this.$ = new yy.NumValue({value:+$$[$0]});
                        break;
                    case 357:
                        this.$ = new yy.LogicValue({value:true});
                        break;
                    case 358:
                        this.$ = new yy.LogicValue({value:false});
                        break;
                    case 359:
                        this.$ = new yy.StringValue({value: $$[$0].substr(1,$$[$0].length-2).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'")});
                        break;
                    case 360:
                        this.$ = new yy.StringValue({value: $$[$0].substr(2,$$[$0].length-3).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'")});
                        break;
                    case 361:
                        this.$ = new yy.NullValue({value:undefined});
                        break;
                    case 362:
                        this.$ = new yy.VarValue({variable:$$[$0]});
                        break;
                    case 363:

                        if(!yy.exists) yy.exists = [];
                        this.$ = new yy.ExistsValue({value:$$[$0-1], existsidx:yy.exists.length});
                        yy.exists.push($$[$0-1]);

                        break;
                    case 364:
                        this.$ = new yy.ArrayValue({value:$$[$0-1]});
                        break;
                    case 365: case 366:
                    this.$ = new yy.ParamValue({param: $$[$0]});
                    break;
                    case 367:

                        if(typeof yy.question == 'undefined') yy.question = 0;
                        this.$ = new yy.ParamValue({param: yy.question++});

                        break;
                    case 368:

                        if(typeof yy.question == 'undefined') yy.question = 0;
                        this.$ = new yy.ParamValue({param: yy.question++, array:true});

                        break;
                    case 369:
                        this.$ = new yy.CaseValue({expression:$$[$0-3], whens: $$[$0-2], elses: $$[$0-1]});
                        break;
                    case 370:
                        this.$ = new yy.CaseValue({whens: $$[$0-2], elses: $$[$0-1]});
                        break;
                    case 371: case 699: case 700:
                    this.$ = $$[$0-1]; this.$.push($$[$0]);
                    break;
                    case 373:
                        this.$ = {when: $$[$0-2], then: $$[$0] };
                        break;
                    case 376: case 377:
                    this.$ = new yy.Op({left:$$[$0-2], op:'REGEXP', right:$$[$0]});
                    break;
                    case 378:
                        this.$ = new yy.Op({left:$$[$0-2], op:'GLOB', right:$$[$0]});
                        break;
                    case 379:
                        this.$ = new yy.Op({left:$$[$0-2], op:'LIKE', right:$$[$0]});
                        break;
                    case 380:
                        this.$ = new yy.Op({left:$$[$0-4], op:'LIKE', right:$$[$0-2], escape:$$[$0]});
                        break;
                    case 381:
                        this.$ = new yy.Op({left:$$[$0-2], op:'NOT LIKE', right:$$[$0] });
                        break;
                    case 382:
                        this.$ = new yy.Op({left:$$[$0-4], op:'NOT LIKE', right:$$[$0-2], escape:$$[$0] });
                        break;
                    case 383:
                        this.$ = new yy.Op({left:$$[$0-2], op:'||', right:$$[$0]});
                        break;
                    case 384:
                        this.$ = new yy.Op({left:$$[$0-2], op:'+', right:$$[$0]});
                        break;
                    case 385:
                        this.$ = new yy.Op({left:$$[$0-2], op:'-', right:$$[$0]});
                        break;
                    case 386:
                        this.$ = new yy.Op({left:$$[$0-2], op:'*', right:$$[$0]});
                        break;
                    case 387:
                        this.$ = new yy.Op({left:$$[$0-2], op:'/', right:$$[$0]});
                        break;
                    case 388:
                        this.$ = new yy.Op({left:$$[$0-2], op:'%', right:$$[$0]});
                        break;
                    case 389:
                        this.$ = new yy.Op({left:$$[$0-2], op:'^', right:$$[$0]});
                        break;
                    case 390:
                        this.$ = new yy.Op({left:$$[$0-2], op:'>>', right:$$[$0]});
                        break;
                    case 391:
                        this.$ = new yy.Op({left:$$[$0-2], op:'<<', right:$$[$0]});
                        break;
                    case 392:
                        this.$ = new yy.Op({left:$$[$0-2], op:'&', right:$$[$0]});
                        break;
                    case 393:
                        this.$ = new yy.Op({left:$$[$0-2], op:'|', right:$$[$0]});
                        break;
                    case 394: case 395: case 397:
                    this.$ = new yy.Op({left:$$[$0-2], op:'->' , right:$$[$0]});
                    break;
                    case 396:
                        this.$ = new yy.Op({left:$$[$0-4], op:'->' , right:$$[$0-1]});
                        break;
                    case 398: case 399: case 401:
                    this.$ = new yy.Op({left:$$[$0-2], op:'!' , right:$$[$0]});
                    break;
                    case 400:
                        this.$ = new yy.Op({left:$$[$0-4], op:'!' , right:$$[$0-1]});
                        break;
                    case 402:
                        this.$ = new yy.Op({left:$$[$0-2], op:'>' , right:$$[$0]});
                        break;
                    case 403:
                        this.$ = new yy.Op({left:$$[$0-2], op:'>=' , right:$$[$0]});
                        break;
                    case 404:
                        this.$ = new yy.Op({left:$$[$0-2], op:'<' , right:$$[$0]});
                        break;
                    case 405:
                        this.$ = new yy.Op({left:$$[$0-2], op:'<=' , right:$$[$0]});
                        break;
                    case 406:
                        this.$ = new yy.Op({left:$$[$0-2], op:'=' , right:$$[$0]});
                        break;
                    case 407:
                        this.$ = new yy.Op({left:$$[$0-2], op:'==' , right:$$[$0]});
                        break;
                    case 408:
                        this.$ = new yy.Op({left:$$[$0-2], op:'===' , right:$$[$0]});
                        break;
                    case 409:
                        this.$ = new yy.Op({left:$$[$0-2], op:'!=' , right:$$[$0]});
                        break;
                    case 410:
                        this.$ = new yy.Op({left:$$[$0-2], op:'!==' , right:$$[$0]});
                        break;
                    case 411:
                        this.$ = new yy.Op({left:$$[$0-2], op:'!===' , right:$$[$0]});
                        break;
                    case 412:

                        if(!yy.queries) yy.queries = [];
                        this.$ = new yy.Op({left:$$[$0-5], op:$$[$0-4] , allsome:$$[$0-3], right:$$[$0-1], queriesidx: yy.queries.length});
                        yy.queries.push($$[$0-1]);

                        break;
                    case 413:

                        this.$ = new yy.Op({left:$$[$0-5], op:$$[$0-4] , allsome:$$[$0-3], right:$$[$0-1]});

                        break;
                    case 414:

                        if($$[$0-2].op == 'BETWEEN1') {

                            if($$[$0-2].left.op == 'AND') {
                                this.$ = new yy.Op({left:$$[$0-2].left.left,op:'AND',right:
                                    new yy.Op({left:$$[$0-2].left.right, op:'BETWEEN',
                                        right1:$$[$0-2].right, right2:$$[$0]})
                                });
                            } else {
                                this.$ = new yy.Op({left:$$[$0-2].left, op:'BETWEEN',
                                    right1:$$[$0-2].right, right2:$$[$0]});
                            }

                        } else if($$[$0-2].op == 'NOT BETWEEN1') {
                            if($$[$0-2].left.op == 'AND') {
                                this.$ = new yy.Op({left:$$[$0-2].left.left,op:'AND',right:
                                    new yy.Op({left:$$[$0-2].left.right, op:'NOT BETWEEN',
                                        right1:$$[$0-2].right, right2:$$[$0]})
                                });
                            } else {
                                this.$ = new yy.Op({left:$$[$0-2].left, op:'NOT BETWEEN',
                                    right1:$$[$0-2].right, right2:$$[$0]});
                            }
                        } else {
                            this.$ = new yy.Op({left:$$[$0-2], op:'AND', right:$$[$0]});
                        }

                        break;
                    case 415:
                        this.$ = new yy.Op({left:$$[$0-2], op:'OR' , right:$$[$0]});
                        break;
                    case 416:
                        this.$ = new yy.UniOp({op:'NOT' , right:$$[$0]});
                        break;
                    case 417:
                        this.$ = new yy.UniOp({op:'-' , right:$$[$0]});
                        break;
                    case 418:
                        this.$ = new yy.UniOp({op:'+' , right:$$[$0]});
                        break;
                    case 419:
                        this.$ = new yy.UniOp({op:'~' , right:$$[$0]});
                        break;
                    case 420:
                        this.$ = new yy.UniOp({op:'#' , right:$$[$0]});
                        break;
                    case 421:
                        this.$ = new yy.UniOp({right: $$[$0-1]});
                        break;
                    case 422:

                        if(!yy.queries) yy.queries = [];
                        this.$ = new yy.Op({left: $$[$0-4], op:'IN', right:$$[$0-1], queriesidx: yy.queries.length});
                        yy.queries.push($$[$0-1]);

                        break;
                    case 423:

                        if(!yy.queries) yy.queries = [];
                        this.$ = new yy.Op({left: $$[$0-5], op:'NOT IN', right:$$[$0-1], queriesidx: yy.queries.length});
                        yy.queries.push($$[$0-1]);

                        break;
                    case 424:
                        this.$ = new yy.Op({left: $$[$0-4], op:'IN', right:$$[$0-1]});
                        break;
                    case 425:
                        this.$ = new yy.Op({left: $$[$0-5], op:'NOT IN', right:$$[$0-1]});
                        break;
                    case 426:
                        this.$ = new yy.Op({left: $$[$0-3], op:'IN', right:[]});
                        break;
                    case 427:
                        this.$ = new yy.Op({left: $$[$0-4], op:'NOT IN', right:[]});
                        break;
                    case 428: case 430:
                    this.$ = new yy.Op({left: $$[$0-2], op:'IN', right:$$[$0]});
                    break;
                    case 429: case 431:
                    this.$ = new yy.Op({left: $$[$0-3], op:'NOT IN', right:$$[$0]});
                    break;
                    case 432:

                        /*			var expr = $$[$0];
                         if(expr.left && expr.left.op == 'AND') {
                         this.$ = new yy.Op({left:new yy.Op({left:$$[$0-2], op:'BETWEEN', right:expr.left}), op:'AND', right:expr.right });
                         } else {
                         */
                        this.$ = new yy.Op({left:$$[$0-2], op:'BETWEEN1', right:$$[$0] });

                        break;
                    case 433:

                        this.$ = new yy.Op({left:$$[$0-2], op:'NOT BETWEEN1', right:$$[$0] });

                        break;
                    case 434:
                        this.$ = new yy.Op({op:'IS' , left:$$[$0-2], right:$$[$0]});
                        break;
                    case 435:

                        this.$ = new yy.Op({
                            op:'IS',
                            left:$$[$0-2],
                            right: new yy.UniOp({
                                op:'NOT',
                                right:new yy.NullValue({value:undefined})
                            })
                        });

                        break;
                    case 436:
                        this.$ = new yy.Convert({expression:$$[$0-2]}) ; yy.extend(this.$,$$[$0]) ;
                        break;
                    case 437: case 438:
                    this.$ = $$[$0];
                    break;
                    case 439:
                        this.$ = $$[$0-1];
                        break;
                    case 446:
                        this.$ = 'ALL';
                        break;
                    case 447:
                        this.$ = 'SOME';
                        break;
                    case 448:
                        this.$ = 'ANY';
                        break;
                    case 449:
                        this.$ = new yy.Update({table:$$[$0-4], columns:$$[$0-2], where:$$[$0]});
                        break;
                    case 450:
                        this.$ = new yy.Update({table:$$[$0-2], columns:$$[$0]});
                        break;
                    case 453:
                        this.$ = new yy.SetColumn({column:$$[$0-2], expression:$$[$0]})
                        break;
                    case 454:
                        this.$ = new yy.SetColumn({variable:$$[$0-2], expression:$$[$0], method:$$[$0-3]})
                        break;
                    case 455:
                        this.$ = new yy.Delete({table:$$[$0-2], where:$$[$0]});
                        break;
                    case 456:
                        this.$ = new yy.Delete({table:$$[$0]});
                        break;
                    case 457:
                        this.$ = new yy.Insert({into:$$[$0-2], values: $$[$0]});
                        break;
                    case 458:
                        this.$ = new yy.Insert({into:$$[$0-1], values: $$[$0]});
                        break;
                    case 459: case 461:
                    this.$ = new yy.Insert({into:$$[$0-2], values: $$[$0], orreplace:true});
                    break;
                    case 460: case 462:
                    this.$ = new yy.Insert({into:$$[$0-1], values: $$[$0], orreplace:true});
                    break;
                    case 463:
                        this.$ = new yy.Insert({into:$$[$0-2], "default": true}) ;
                        break;
                    case 464:
                        this.$ = new yy.Insert({into:$$[$0-5], columns: $$[$0-3], values: $$[$0]});
                        break;
                    case 465:
                        this.$ = new yy.Insert({into:$$[$0-4], columns: $$[$0-2], values: $$[$0]});
                        break;
                    case 466:
                        this.$ = new yy.Insert({into:$$[$0-1], select: $$[$0]});
                        break;
                    case 467:
                        this.$ = new yy.Insert({into:$$[$0-1], select: $$[$0], orreplace:true});
                        break;
                    case 468:
                        this.$ = new yy.Insert({into:$$[$0-4], columns: $$[$0-2], select: $$[$0]});
                        break;
                    case 473:
                        this.$ = [$$[$0-1]];
                        break;
                    case 476:
                        this.$ = $$[$0-4]; $$[$0-4].push($$[$0-1])
                        break;
                    case 477: case 478: case 480: case 488:
                    this.$ = $$[$0-2]; $$[$0-2].push($$[$0])
                    break;
                    case 489:

                        this.$ = new yy.CreateTable({table:$$[$0-4]});
                        yy.extend(this.$,$$[$0-7]);
                        yy.extend(this.$,$$[$0-6]);
                        yy.extend(this.$,$$[$0-5]);
                        yy.extend(this.$,$$[$0-2]);
                        yy.extend(this.$,$$[$0]);

                        break;
                    case 490:

                        this.$ = new yy.CreateTable({table:$$[$0]});
                        yy.extend(this.$,$$[$0-3]);
                        yy.extend(this.$,$$[$0-2]);
                        yy.extend(this.$,$$[$0-1]);

                        break;
                    case 492:
                        this.$ = {"class":true};
                        break;
                    case 502:
                        this.$ = {temporary:true};
                        break;
                    case 504:
                        this.$ = {ifnotexists: true};
                        break;
                    case 505:
                        this.$ = {columns: $$[$0-2], constraints: $$[$0]};
                        break;
                    case 506:
                        this.$ = {columns: $$[$0]};
                        break;
                    case 507:
                        this.$ = {as: $$[$0]}
                        break;
                    case 508: case 532:
                    this.$ = [$$[$0]];
                    break;
                    case 510: case 511: case 512: case 513: case 514:
                    $$[$0].constraintid = $$[$0-1]; this.$ = $$[$0];
                    break;
                    case 517:
                        this.$ = {type: 'CHECK', expression: $$[$0-1]};
                        break;
                    case 518:
                        this.$ = {type: 'PRIMARY KEY', columns: $$[$0-1], clustered:($$[$0-3]+'').toUpperCase()};
                        break;
                    case 519:
                        this.$ = {type: 'FOREIGN KEY', columns: $$[$0-5], fktable: $$[$0-2], fkcolumns: $$[$0-1]};
                        break;
                    case 525:

                        this.$ = {type: 'UNIQUE', columns: $$[$0-1], clustered:($$[$0-3]+'').toUpperCase()};

                        break;
                    case 534:
                        this.$ = new yy.ColumnDef({columnid:$$[$0-2]}); yy.extend(this.$,$$[$0-1]); yy.extend(this.$,$$[$0]);
                        break;
                    case 535:
                        this.$ = new yy.ColumnDef({columnid:$$[$0-1]}); yy.extend(this.$,$$[$0]);
                        break;
                    case 536:
                        this.$ = new yy.ColumnDef({columnid:$$[$0], dbtypeid: ''});
                        break;
                    case 537:
                        this.$ = {dbtypeid: $$[$0-5], dbsize: $$[$0-3], dbprecision: +$$[$0-1]}
                        break;
                    case 538:
                        this.$ = {dbtypeid: $$[$0-3], dbsize: $$[$0-1]}
                        break;
                    case 539:
                        this.$ = {dbtypeid: $$[$0]}
                        break;
                    case 540:
                        this.$ = {dbtypeid: 'ENUM', enumvalues: $$[$0-1]}
                        break;
                    case 541:
                        this.$ = $$[$0-1]; $$[$0-1].dbtypeid += '[' + $$[$0] + ']';
                        break;
                    case 543: case 750:
                    this.$ = +$$[$0];
                    break;
                    case 545:
                        this.$ = undefined
                        break;
                    case 547:

                        yy.extend($$[$0-1],$$[$0]); this.$ = $$[$0-1];

                        break;
                    case 550:
                        this.$ = {primarykey:true};
                        break;
                    case 551: case 552:
                    this.$ = {foreignkey:{table:$$[$0-1], columnid: $$[$0]}};
                    break;
                    case 553:
                        this.$ = {identity: {value:$$[$0-3],step:$$[$0-1]}}
                        break;
                    case 554:
                        this.$ = {identity: {value:1,step:1}}
                        break;
                    case 555: case 557:
                    this.$ = {"default":$$[$0]};
                    break;
                    case 556:
                        this.$ = {"default":$$[$0-1]};
                        break;
                    case 558:
                        this.$ = {"null":true};
                        break;
                    case 559:
                        this.$ = {notnull:true};
                        break;
                    case 560:
                        this.$ = {check:$$[$0]};
                        break;
                    case 561:
                        this.$ = {unique:true};
                        break;
                    case 562:
                        this.$ = {"onupdate":$$[$0]};
                        break;
                    case 563:
                        this.$ = {"onupdate":$$[$0-1]};
                        break;
                    case 564:
                        this.$ = new yy.DropTable({tables:$$[$0],type:$$[$0-2]}); yy.extend(this.$, $$[$0-1]);
                        break;
                    case 568:
                        this.$ = {ifexists: true};
                        break;
                    case 569:
                        this.$ = new yy.AlterTable({table:$$[$0-3], renameto: $$[$0]});
                        break;
                    case 570:
                        this.$ = new yy.AlterTable({table:$$[$0-3], addcolumn: $$[$0]});
                        break;
                    case 571:
                        this.$ = new yy.AlterTable({table:$$[$0-3], modifycolumn: $$[$0]});
                        break;
                    case 572:
                        this.$ = new yy.AlterTable({table:$$[$0-5], renamecolumn: $$[$0-2], to: $$[$0]});
                        break;
                    case 573:
                        this.$ = new yy.AlterTable({table:$$[$0-3], dropcolumn: $$[$0]});
                        break;
                    case 574:
                        this.$ = new yy.AlterTable({table:$$[$0-2], renameto: $$[$0]});
                        break;
                    case 575:
                        this.$ = new yy.AttachDatabase({databaseid:$$[$0], engineid:$$[$0-2].toUpperCase() });
                        break;
                    case 576:
                        this.$ = new yy.AttachDatabase({databaseid:$$[$0-3], engineid:$$[$0-5].toUpperCase(), args:$$[$0-1] });
                        break;
                    case 577:
                        this.$ = new yy.AttachDatabase({databaseid:$$[$0-2], engineid:$$[$0-4].toUpperCase(), as:$$[$0] });
                        break;
                    case 578:
                        this.$ = new yy.AttachDatabase({databaseid:$$[$0-5], engineid:$$[$0-7].toUpperCase(), as:$$[$0], args:$$[$0-3]});
                        break;
                    case 579:
                        this.$ = new yy.DetachDatabase({databaseid:$$[$0]});
                        break;
                    case 580:
                        this.$ = new yy.CreateDatabase({databaseid:$$[$0] }); yy.extend(this.$,$$[$0]);
                        break;
                    case 581:
                        this.$ = new yy.CreateDatabase({engineid:$$[$0-4].toUpperCase(), databaseid:$$[$0-1], as:$$[$0] }); yy.extend(this.$,$$[$0-2]);
                        break;
                    case 582:
                        this.$ = new yy.CreateDatabase({engineid:$$[$0-7].toUpperCase(), databaseid:$$[$0-4], args:$$[$0-2], as:$$[$0] }); yy.extend(this.$,$$[$0-5]);
                        break;
                    case 583:
                        this.$ = new yy.CreateDatabase({engineid:$$[$0-4].toUpperCase(),
                            as:$$[$0], args:[$$[$0-1]] }); yy.extend(this.$,$$[$0-2]);
                        break;
                    case 584:
                        this.$ = undefined;
                        break;
                    case 586: case 587:
                    this.$ = new yy.UseDatabase({databaseid: $$[$0] });
                    break;
                    case 588:
                        this.$ = new yy.DropDatabase({databaseid: $$[$0] }); yy.extend(this.$,$$[$0-1]);
                        break;
                    case 589: case 590:
                    this.$ = new yy.DropDatabase({databaseid: $$[$0], engineid:$$[$0-3].toUpperCase() }); yy.extend(this.$,$$[$0-1]);
                    break;
                    case 591:
                        this.$ = new yy.CreateIndex({indexid:$$[$0-5], table:$$[$0-3], columns:$$[$0-1]})
                        break;
                    case 592:
                        this.$ = new yy.CreateIndex({indexid:$$[$0-5], table:$$[$0-3], columns:$$[$0-1], unique:true})
                        break;
                    case 593:
                        this.$ = new yy.DropIndex({indexid:$$[$0]});
                        break;
                    case 594:
                        this.$ = new yy.ShowDatabases();
                        break;
                    case 595:
                        this.$ = new yy.ShowDatabases({like:$$[$0]});
                        break;
                    case 596:
                        this.$ = new yy.ShowDatabases({engineid:$$[$0-1].toUpperCase() });
                        break;
                    case 597:
                        this.$ = new yy.ShowDatabases({engineid:$$[$0-3].toUpperCase() , like:$$[$0]});
                        break;
                    case 598:
                        this.$ = new yy.ShowTables();
                        break;
                    case 599:
                        this.$ = new yy.ShowTables({like:$$[$0]});
                        break;
                    case 600:
                        this.$ = new yy.ShowTables({databaseid: $$[$0]});
                        break;
                    case 601:
                        this.$ = new yy.ShowTables({like:$$[$0], databaseid: $$[$0-2]});
                        break;
                    case 602:
                        this.$ = new yy.ShowColumns({table: $$[$0]});
                        break;
                    case 603:
                        this.$ = new yy.ShowColumns({table: $$[$0-2], databaseid:$$[$0]});
                        break;
                    case 604:
                        this.$ = new yy.ShowIndex({table: $$[$0]});
                        break;
                    case 605:
                        this.$ = new yy.ShowIndex({table: $$[$0-2], databaseid: $$[$0]});
                        break;
                    case 606:
                        this.$ = new yy.ShowCreateTable({table: $$[$0]});
                        break;
                    case 607:
                        this.$ = new yy.ShowCreateTable({table: $$[$0-2], databaseid:$$[$0]});
                        break;
                    case 608:

                        this.$ = new yy.CreateTable({table:$$[$0-6],view:true,select:$$[$0-1],viewcolumns:$$[$0-4]});
                        yy.extend(this.$,$$[$0-9]);
                        yy.extend(this.$,$$[$0-7]);

                        break;
                    case 609:

                        this.$ = new yy.CreateTable({table:$$[$0-3],view:true,select:$$[$0-1]});
                        yy.extend(this.$,$$[$0-6]);
                        yy.extend(this.$,$$[$0-4]);

                        break;
                    case 613:
                        this.$ = new yy.DropTable({tables:$$[$0], view:true}); yy.extend(this.$, $$[$0-1]);
                        break;
                    case 614: case 760:
                    this.$ = new yy.ExpressionStatement({expression:$$[$0]});
                    break;
                    case 615:
                        this.$ = new yy.Source({url:$$[$0].value});
                        break;
                    case 616:
                        this.$ = new yy.Assert({value:$$[$0]});
                        break;
                    case 617:
                        this.$ = new yy.Assert({value:$$[$0].value});
                        break;
                    case 618:
                        this.$ = new yy.Assert({value:$$[$0], message:$$[$0-2]});
                        break;
                    case 620: case 631: case 633:
                    this.$ = $$[$0].value;
                    break;
                    case 621: case 629:
                    this.$ = +$$[$0].value;
                    break;
                    case 622:
                        this.$ = (!!$$[$0].value);
                        break;
                    case 630:
                        this.$ = ""+$$[$0].value;
                        break;
                    case 639:
                        this.$ = {};
                        break;
                    case 642:
                        this.$ = [];
                        break;
                    case 643:
                        yy.extend($$[$0-2],$$[$0]); this.$ = $$[$0-2];
                        break;
                    case 645:
                        this.$ = {}; this.$[$$[$0-2].substr(1,$$[$0-2].length-2)] = $$[$0];
                        break;
                    case 646: case 647:
                    this.$ = {}; this.$[$$[$0-2]] = $$[$0];
                    break;
                    case 650:
                        this.$ = new yy.SetVariable({variable:$$[$0-2].toLowerCase(), value:$$[$0]});
                        break;
                    case 651:
                        this.$ = new yy.SetVariable({variable:$$[$0-1].toLowerCase(), value:$$[$0]});
                        break;
                    case 652:
                        this.$ = new yy.SetVariable({variable:$$[$0-2], expression:$$[$0]});
                        break;
                    case 653:
                        this.$ = new yy.SetVariable({variable:$$[$0-3], props: $$[$0-2], expression:$$[$0]});
                        break;
                    case 654:
                        this.$ = new yy.SetVariable({variable:$$[$0-2], expression:$$[$0], method:$$[$0-3]});
                        break;
                    case 655:
                        this.$ = new yy.SetVariable({variable:$$[$0-3], props: $$[$0-2], expression:$$[$0], method:$$[$0-4]});
                        break;
                    case 656:
                        this.$ = '@';
                        break;
                    case 657:
                        this.$ = '$';
                        break;
                    case 663:
                        this.$ = true;
                        break;
                    case 664:
                        this.$ = false;
                        break;
                    case 665:
                        this.$ = new yy.CommitTransaction();
                        break;
                    case 666:
                        this.$ = new yy.RollbackTransaction();
                        break;
                    case 667:
                        this.$ = new yy.BeginTransaction();
                        break;
                    case 668:
                        this.$ = new yy.If({expression:$$[$0-2],thenstat:$$[$0-1], elsestat:$$[$0]});
                        if($$[$0-1].exists) this.$.exists = $$[$0-1].exists;
                        if($$[$0-1].queries) this.$.queries = $$[$0-1].queries;

                        break;
                    case 669:

                        this.$ = new yy.If({expression:$$[$0-1],thenstat:$$[$0]});
                        if($$[$0].exists) this.$.exists = $$[$0].exists;
                        if($$[$0].queries) this.$.queries = $$[$0].queries;

                        break;
                    case 670:
                        this.$ = $$[$0];
                        break;
                    case 671:
                        this.$ = new yy.While({expression:$$[$0-1],loopstat:$$[$0]});
                        if($$[$0].exists) this.$.exists = $$[$0].exists;
                        if($$[$0].queries) this.$.queries = $$[$0].queries;

                        break;
                    case 672:
                        this.$ = new yy.Continue();
                        break;
                    case 673:
                        this.$ = new yy.Break();
                        break;
                    case 674:
                        this.$ = new yy.BeginEnd({statements:$$[$0-1]});
                        break;
                    case 675:
                        this.$ = new yy.Print({exprs:$$[$0]});
                        break;
                    case 676:
                        this.$ = new yy.Print({select:$$[$0]});
                        break;
                    case 677:
                        this.$ = new yy.Require({paths:$$[$0]});
                        break;
                    case 678:
                        this.$ = new yy.Require({plugins:$$[$0]});
                        break;
                    case 679: case 680:
                    this.$ = $$[$0].toUpperCase();
                    break;
                    case 681:
                        this.$ = new yy.Echo({expr:$$[$0]});
                        break;
                    case 686:
                        this.$ = new yy.Declare({declares:$$[$0]});
                        break;
                    case 689:
                        this.$ = {variable: $$[$0-1]}; yy.extend(this.$,$$[$0]);
                        break;
                    case 690:
                        this.$ = {variable: $$[$0-2]}; yy.extend(this.$,$$[$0]);
                        break;
                    case 691:
                        this.$ = {variable: $$[$0-3], expression:$$[$0]}; yy.extend(this.$,$$[$0-2]);
                        break;
                    case 692:
                        this.$ = {variable: $$[$0-4], expression:$$[$0]}; yy.extend(this.$,$$[$0-2]);
                        break;
                    case 693:
                        this.$ = new yy.TruncateTable({table:$$[$0]});
                        break;
                    case 694:

                        this.$ = new yy.Merge(); yy.extend(this.$,$$[$0-4]); yy.extend(this.$,$$[$0-3]);
                        yy.extend(this.$,$$[$0-2]);
                        yy.extend(this.$,{matches:$$[$0-1]});yy.extend(this.$,$$[$0]);

                        break;
                    case 695: case 696:
                    this.$ = {into: $$[$0]};
                    break;
                    case 698:
                        this.$ = {on:$$[$0]};
                        break;
                    case 703:
                        this.$ = {matched:true, action:$$[$0]}
                        break;
                    case 704:
                        this.$ = {matched:true, expr: $$[$0-2], action:$$[$0]}
                        break;
                    case 705:
                        this.$ = {"delete":true};
                        break;
                    case 706:
                        this.$ = {update:$$[$0]};
                        break;
                    case 707: case 708:
                    this.$ = {matched:false, bytarget: true, action:$$[$0]}
                    break;
                    case 709: case 710:
                    this.$ = {matched:false, bytarget: true, expr:$$[$0-2], action:$$[$0]}
                    break;
                    case 711:
                        this.$ = {matched:false, bysource: true, action:$$[$0]}
                        break;
                    case 712:
                        this.$ = {matched:false, bysource: true, expr:$$[$0-2], action:$$[$0]}
                        break;
                    case 713:
                        this.$ = {insert:true, values:$$[$0]};
                        break;
                    case 714:
                        this.$ = {insert:true, values:$$[$0], columns:$$[$0-3]};
                        break;
                    case 715:
                        this.$ = {insert:true, defaultvalues:true};
                        break;
                    case 716:
                        this.$ = {insert:true, defaultvalues:true, columns:$$[$0-3]};
                        break;
                    case 718:
                        this.$ = {output:{columns:$$[$0]}}
                        break;
                    case 719:
                        this.$ = {output:{columns:$$[$0-3], intovar: $$[$0], method:$$[$0-1]}}
                        break;
                    case 720:
                        this.$ = {output:{columns:$$[$0-2], intotable: $$[$0]}}
                        break;
                    case 721:
                        this.$ = {output:{columns:$$[$0-5], intotable: $$[$0-3], intocolumns:$$[$0-1]}}
                        break;
                    case 722:

                        this.$ = new yy.CreateVertex({"class":$$[$0-3],sharp:$$[$0-2], name:$$[$0-1]});
                        yy.extend(this.$,$$[$0]);

                        break;
                    case 725:
                        this.$ = {sets:$$[$0]};
                        break;
                    case 726:
                        this.$ = {content:$$[$0]};
                        break;
                    case 727:
                        this.$ = {select:$$[$0]};
                        break;
                    case 728:

                        this.$ = new yy.CreateEdge({from:$$[$0-3],to:$$[$0-1],name:$$[$0-5]});
                        yy.extend(this.$,$$[$0]);

                        break;
                    case 729:
                        this.$ = new yy.CreateGraph({graph:$$[$0]});
                        break;
                    case 730:
                        this.$ = new yy.CreateGraph({from:$$[$0]});
                        break;
                    case 733:

                        this.$ = $$[$0-2];
                        if($$[$0-1]) this.$.json = new yy.Json({value:$$[$0-1]});
                        if($$[$0]) this.$.as = $$[$0];

                        break;
                    case 734:

                        this.$ = {source:$$[$0-6], target: $$[$0]};
                        if($$[$0-3]) this.$.json = new yy.Json({value:$$[$0-3]});
                        if($$[$0-2]) this.$.as = $$[$0-2];
                        yy.extend(this.$,$$[$0-4]);

                        break;
                    case 735:

                        this.$ = {source:$$[$0-5], target: $$[$0]};
                        if($$[$0-2]) this.$.json = new yy.Json({value:$$[$0-3]});
                        if($$[$0-1]) this.$.as = $$[$0-2];

                        break;
                    case 736:

                        this.$ = {source:$$[$0-2], target: $$[$0]};

                        break;
                    case 740:
                        this.$ = {vars:$$[$0], method:$$[$0-1]};
                        break;
                    case 743: case 744:

                    var s3 = $$[$0-1];
                    this.$ = {prop:$$[$0-3], sharp:$$[$0-2], name:(typeof s3 == 'undefined')?undefined:s3.substr(1,s3.length-2), "class":$$[$0]};

                    break;
                    case 745:

                        var s2 = $$[$0-1];
                        this.$ = {sharp:$$[$0-2], name:(typeof s2 == 'undefined')?undefined:s2.substr(1,s2.length-2), "class":$$[$0]};

                        break;
                    case 746:

                        var s1 = $$[$0-1];
                        this.$ = {name:(typeof s1 == 'undefined')?undefined:s1.substr(1,s1.length-2), "class":$$[$0]};

                        break;
                    case 747:

                        this.$ = {"class":$$[$0]};

                        break;
                    case 753:
                        this.$ = new yy.AddRule({left:$$[$0-2], right:$$[$0]});
                        break;
                    case 754:
                        this.$ = new yy.AddRule({right:$$[$0]});
                        break;
                    case 757:
                        this.$ = new yy.Term({termid:$$[$0]});
                        break;
                    case 758:
                        this.$ = new yy.Term({termid:$$[$0-3],args:$$[$0-1]});
                        break;
                    case 761:

                        this.$ = new yy.CreateTrigger({trigger:$$[$0-6], when:$$[$0-5], action:$$[$0-4], table:$$[$0-2], statement:$$[$0]});
                        if($$[$0].exists) this.$.exists = $$[$0].exists;
                        if($$[$0].queries) this.$.queries = $$[$0].queries;

                        break;
                    case 762:

                        this.$ = new yy.CreateTrigger({trigger:$$[$0-5], when:$$[$0-4], action:$$[$0-3], table:$$[$0-1], funcid:$$[$0]});

                        break;
                    case 763:

                        this.$ = new yy.CreateTrigger({trigger:$$[$0-6], when:$$[$0-4], action:$$[$0-3], table:$$[$0-5], statement:$$[$0]});
                        if($$[$0].exists) this.$.exists = $$[$0].exists;
                        if($$[$0].queries) this.$.queries = $$[$0].queries;

                        break;
                    case 764: case 765: case 767:
                    this.$ = 'AFTER';
                    break;
                    case 766:
                        this.$ = 'BEFORE';
                        break;
                    case 768:
                        this.$ = 'INSTEADOF';
                        break;
                    case 769:
                        this.$ = 'INSERT';
                        break;
                    case 770:
                        this.$ = 'DELETE';
                        break;
                    case 771:
                        this.$ = 'UPDATE';
                        break;
                    case 772:
                        this.$ = new yy.DropTrigger({trigger:$$[$0]});
                        break;
                    case 773:
                        this.$ = new yy.Reindex({indexid:$$[$0]});
                        break;
                    case 1047: case 1067: case 1069: case 1071: case 1075: case 1077: case 1079: case 1081: case 1083: case 1085:
                    this.$ = [];
                    break;
                    case 1048: case 1062: case 1064: case 1068: case 1070: case 1072: case 1076: case 1078: case 1080: case 1082: case 1084: case 1086:
                    $$[$0-1].push($$[$0]);
                    break;
                    case 1061: case 1063:
                    this.$ = [$$[$0]];
                    break;
                }
            },
            table: [o([10,602,764],$V0,{8:1,9:2,12:3,13:4,17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,2:$V1,4:$V2,5:$V3,14:$V4,53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),{1:[3]},{10:[1,105],11:106,602:$VH,764:$VI},o($VJ,[2,8]),o($VJ,[2,9]),o($VK,[2,12]),o($VJ,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,12:109,2:$V1,4:$V2,5:$V3,15:[1,110],53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),o($VK,[2,14]),o($VK,[2,15]),o($VK,[2,16]),o($VK,[2,17]),o($VK,[2,18]),o($VK,[2,19]),o($VK,[2,20]),o($VK,[2,21]),o($VK,[2,22]),o($VK,[2,23]),o($VK,[2,24]),o($VK,[2,25]),o($VK,[2,26]),o($VK,[2,27]),o($VK,[2,28]),o($VK,[2,29]),o($VK,[2,30]),o($VK,[2,31]),o($VK,[2,32]),o($VK,[2,33]),o($VK,[2,34]),o($VK,[2,35]),o($VK,[2,36]),o($VK,[2,37]),o($VK,[2,38]),o($VK,[2,39]),o($VK,[2,40]),o($VK,[2,41]),o($VK,[2,42]),o($VK,[2,43]),o($VK,[2,44]),o($VK,[2,45]),o($VK,[2,46]),o($VK,[2,47]),o($VK,[2,48]),o($VK,[2,49]),o($VK,[2,50]),o($VK,[2,51]),o($VK,[2,52]),o($VK,[2,53]),o($VK,[2,54]),o($VK,[2,55]),o($VK,[2,56]),o($VK,[2,57]),o($VK,[2,58]),o($VK,[2,59]),o($VK,[2,60]),o($VK,[2,61]),o($VK,[2,62]),o($VK,[2,63]),o($VK,[2,64]),o($VK,[2,65]),o($VK,[2,66]),o($VK,[2,67]),{353:[1,111]},{2:$V1,3:112,4:$V2,5:$V3},{2:$V1,3:114,4:$V2,5:$V3,156:$VL,200:113,290:$VM,291:$VN,292:$VO,293:$VP},o($VQ,[2,501],{3:121,348:125,2:$V1,4:$V2,5:$V3,134:$VR,135:$VS,187:[1,123],193:[1,122],268:[1,129],269:[1,130],357:[1,131],405:[1,120],472:[1,124],509:[1,128]}),{145:$VT,449:132,450:133},{183:[1,135]},{405:[1,136]},{2:$V1,3:138,4:$V2,5:$V3,130:[1,144],193:[1,139],353:[1,143],397:140,405:[1,137],410:[1,141],509:[1,142]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:145,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vt1,$Vu1,{340:204,171:[1,205],198:$Vv1}),o($Vt1,$Vu1,{340:207,198:$Vv1}),{2:$V1,3:219,4:$V2,5:$V3,77:$Vw1,132:$Vx1,143:$VY,144:212,145:$VZ,152:$V$,156:$VL,181:$V31,198:[1,210],199:213,200:215,201:214,202:217,209:209,213:$Vy1,214:218,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1,419:190,420:$Vr1,424:$Vs1,453:208},{2:$V1,3:221,4:$V2,5:$V3},{353:[1,222]},o($Vz1,[2,1043],{80:223,106:224,107:[1,225]}),o($VA1,[2,1047],{90:226}),{2:$V1,3:230,4:$V2,5:$V3,190:[1,228],193:[1,231],267:[1,227],353:[1,232],405:[1,229]},{353:[1,233]},{2:$V1,3:236,4:$V2,5:$V3,73:234,75:235},o([306,602,764],$V0,{12:3,13:4,17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,9:238,2:$V1,4:$V2,5:$V3,14:$V4,53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,435:[1,237],436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),{435:[1,239]},{435:[1,240]},{2:$V1,3:242,4:$V2,5:$V3,405:[1,241]},{2:$V1,3:244,4:$V2,5:$V3,199:243},o($VB1,[2,311]),{113:245,132:$VW,296:$Vj1},{2:$V1,3:114,4:$V2,5:$V3,113:251,131:$VV,132:[1,248],143:$VY,144:246,145:$VC1,152:$V$,156:$VL,181:$V31,196:250,200:255,201:254,257:252,258:253,265:$VD1,274:247,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,302:$Vn1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:257,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VK,[2,672]),o($VK,[2,673]),{2:$V1,3:168,4:$V2,5:$V3,40:259,56:165,77:$VU,79:75,89:$V7,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:258,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,184:99,189:$Vb,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:266,4:$V2,5:$V3,113:263,132:$VW,296:$Vj1,444:261,445:262,446:264,447:$VE1},{2:$V1,3:267,4:$V2,5:$V3,143:$VF1,145:$VG1,431:268},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:271,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{505:[1,272]},{2:$V1,3:100,4:$V2,5:$V3,504:274,506:273},{2:$V1,3:114,4:$V2,5:$V3,156:$VL,200:275,290:$VM,291:$VN,292:$VO,293:$VP},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:276,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VH1,$VI1,{186:280,164:[1,279],185:[1,277],187:[1,278],195:$VJ1}),o($VK1,[2,757],{77:[1,282]}),o([2,4,5,10,72,77,78,93,98,107,118,128,131,132,137,143,145,152,154,156,162,164,168,169,179,180,181,183,185,187,195,198,232,245,247,265,266,270,271,273,280,281,282,283,284,285,286,287,288,290,291,292,293,294,295,296,297,298,299,302,303,306,310,312,317,420,424,602,764],[2,152],{149:[1,283],150:[1,284],190:[1,285],191:[1,286],192:[1,287],193:[1,288],194:[1,289]}),o($VL1,[2,1]),o($VL1,[2,2]),{6:290,131:[1,439],172:[1,462],245:[1,411],285:[1,373],286:[1,407],370:[1,404],381:[1,295],402:[1,297],410:[1,549],414:[1,471],416:[1,443],417:[1,509],433:[1,442],435:[1,525],440:[1,342],460:[1,418],464:[1,448],470:[1,341],514:[1,307],515:[1,299],516:[1,399],518:[1,291],519:[1,292],520:[1,293],521:[1,294],522:[1,296],523:[1,298],524:[1,300],525:[1,301],526:[1,302],527:[1,303],528:[1,304],529:[1,305],530:[1,306],531:[1,308],532:[1,309],533:[1,310],534:[1,311],535:[1,312],536:[1,313],537:[1,314],538:[1,315],539:[1,316],540:[1,317],541:[1,318],542:[1,319],543:[1,320],544:[1,321],545:[1,322],546:[1,323],547:[1,324],548:[1,325],549:[1,326],550:[1,327],551:[1,328],552:[1,329],553:[1,330],554:[1,331],555:[1,332],556:[1,333],557:[1,334],558:[1,335],559:[1,336],560:[1,337],561:[1,338],562:[1,339],563:[1,340],564:[1,343],565:[1,344],566:[1,345],567:[1,346],568:[1,347],569:[1,348],570:[1,349],571:[1,350],572:[1,351],573:[1,352],574:[1,353],575:[1,354],576:[1,355],577:[1,356],578:[1,357],579:[1,358],580:[1,359],581:[1,360],582:[1,361],583:[1,362],584:[1,363],585:[1,364],586:[1,365],587:[1,366],588:[1,367],589:[1,368],590:[1,369],591:[1,370],592:[1,371],593:[1,372],594:[1,374],595:[1,375],596:[1,376],597:[1,377],598:[1,378],599:[1,379],600:[1,380],601:[1,381],602:[1,382],603:[1,383],604:[1,384],605:[1,385],606:[1,386],607:[1,387],608:[1,388],609:[1,389],610:[1,390],611:[1,391],612:[1,392],613:[1,393],614:[1,394],615:[1,395],616:[1,396],617:[1,397],618:[1,398],619:[1,400],620:[1,401],621:[1,402],622:[1,403],623:[1,405],624:[1,406],625:[1,408],626:[1,409],627:[1,410],628:[1,412],629:[1,413],630:[1,414],631:[1,415],632:[1,416],633:[1,417],634:[1,419],635:[1,420],636:[1,421],637:[1,422],638:[1,423],639:[1,424],640:[1,425],641:[1,426],642:[1,427],643:[1,428],644:[1,429],645:[1,430],646:[1,431],647:[1,432],648:[1,433],649:[1,434],650:[1,435],651:[1,436],652:[1,437],653:[1,438],654:[1,440],655:[1,441],656:[1,444],657:[1,445],658:[1,446],659:[1,447],660:[1,449],661:[1,450],662:[1,451],663:[1,452],664:[1,453],665:[1,454],666:[1,455],667:[1,456],668:[1,457],669:[1,458],670:[1,459],671:[1,460],672:[1,461],673:[1,463],674:[1,464],675:[1,465],676:[1,466],677:[1,467],678:[1,468],679:[1,469],680:[1,470],681:[1,472],682:[1,473],683:[1,474],684:[1,475],685:[1,476],686:[1,477],687:[1,478],688:[1,479],689:[1,480],690:[1,481],691:[1,482],692:[1,483],693:[1,484],694:[1,485],695:[1,486],696:[1,487],697:[1,488],698:[1,489],699:[1,490],700:[1,491],701:[1,492],702:[1,493],703:[1,494],704:[1,495],705:[1,496],706:[1,497],707:[1,498],708:[1,499],709:[1,500],710:[1,501],711:[1,502],712:[1,503],713:[1,504],714:[1,505],715:[1,506],716:[1,507],717:[1,508],718:[1,510],719:[1,511],720:[1,512],721:[1,513],722:[1,514],723:[1,515],724:[1,516],725:[1,517],726:[1,518],727:[1,519],728:[1,520],729:[1,521],730:[1,522],731:[1,523],732:[1,524],733:[1,526],734:[1,527],735:[1,528],736:[1,529],737:[1,530],738:[1,531],739:[1,532],740:[1,533],741:[1,534],742:[1,535],743:[1,536],744:[1,537],745:[1,538],746:[1,539],747:[1,540],748:[1,541],749:[1,542],750:[1,543],751:[1,544],752:[1,545],753:[1,546],754:[1,547],755:[1,548],756:[1,550],757:[1,551],758:[1,552],759:[1,553],760:[1,554],761:[1,555],762:[1,556],763:[1,557]},{1:[2,6]},o($VJ,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,12:558,2:$V1,4:$V2,5:$V3,53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),o($VM1,[2,1041]),o($VM1,[2,1042]),o($VJ,[2,10]),{16:[1,559]},{2:$V1,3:244,4:$V2,5:$V3,199:560},{405:[1,561]},o($VK,[2,760]),{77:$VN1},{77:[1,563]},{77:$VO1},{77:[1,565]},{77:[1,566]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:567,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vt1,$VP1,{350:568,156:$VQ1}),{405:[1,570]},{2:$V1,3:571,4:$V2,5:$V3},{193:[1,572]},{2:$V1,3:578,4:$V2,5:$V3,132:$VR1,137:$VS1,143:$VF1,145:$VG1,152:$VT1,183:[1,574],431:585,473:573,474:575,475:576,478:577,482:582,493:579,497:581},{130:[1,589],349:586,353:[1,588],410:[1,587]},{113:591,132:$VW,183:[2,1141],296:$Vj1,471:590},o($VU1,[2,1135],{465:592,3:593,2:$V1,4:$V2,5:$V3}),{2:$V1,3:594,4:$V2,5:$V3},{4:[1,595]},{4:[1,596]},o($VQ,[2,502]),o($VK,[2,686],{74:[1,597]}),o($VV1,[2,687]),{2:$V1,3:598,4:$V2,5:$V3},{2:$V1,3:244,4:$V2,5:$V3,199:599},{2:$V1,3:600,4:$V2,5:$V3},o($Vt1,$VW1,{398:601,156:$VX1}),{405:[1,603]},{2:$V1,3:604,4:$V2,5:$V3},o($Vt1,$VW1,{398:605,156:$VX1}),o($Vt1,$VW1,{398:606,156:$VX1}),{2:$V1,3:607,4:$V2,5:$V3},o($VY1,[2,1129]),o($VY1,[2,1130]),o($VK,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,12:608,114:625,327:637,2:$V1,4:$V2,5:$V3,53:$V5,72:$V6,89:$V7,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$V22,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,146:$V9,154:$Va2,156:$Va,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,189:$Vb,266:$Vc,267:$Vd,290:$Ve,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),o($VB1,[2,288]),o($VB1,[2,289]),o($VB1,[2,290]),o($VB1,[2,291]),o($VB1,[2,292]),o($VB1,[2,293]),o($VB1,[2,294]),o($VB1,[2,295]),o($VB1,[2,296]),o($VB1,[2,297]),o($VB1,[2,298]),o($VB1,[2,299]),o($VB1,[2,300]),o($VB1,[2,301]),o($VB1,[2,302]),o($VB1,[2,303]),o($VB1,[2,304]),o($VB1,[2,305]),{2:$V1,3:168,4:$V2,5:$V3,26:654,27:653,36:649,40:648,56:165,77:$VU,79:75,89:$V7,94:651,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,184:99,189:$Vb,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,264:650,265:$V41,266:$Vc,267:[1,655],270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:[1,652],291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,339:$Vh,419:190,420:$Vr1,424:$Vs1},o($VB1,[2,309]),o($VB1,[2,310]),{77:[1,656]},o([2,4,5,10,53,72,74,76,78,89,93,95,98,99,107,112,115,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$Vy2,{77:$VN1,116:[1,657]}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:658,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:659,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:660,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:661,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:662,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VB1,[2,283]),o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,231,232,239,242,243,245,247,249,265,266,267,270,271,273,280,281,282,283,284,285,286,287,288,290,291,292,293,294,295,296,297,298,299,300,302,303,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,343,356,368,369,373,374,396,400,401,404,406,408,409,415,417,418,420,424,426,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764,765,766],[2,356]),o($Vz2,[2,357]),o($Vz2,[2,358]),o($Vz2,$VA2),o($Vz2,[2,360]),o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,297,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,343,356,368,369,373,374,396,400,401,404,406,408,409,417,418,420,424,426,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,361]),{2:$V1,3:664,4:$V2,5:$V3,131:[1,665],301:663},{2:$V1,3:666,4:$V2,5:$V3},o($Vz2,[2,367]),o($Vz2,[2,368]),{2:$V1,3:667,4:$V2,5:$V3,77:$VB2,113:669,131:$VV,132:$VW,143:$VY,152:$V$,181:$V31,196:670,201:672,257:671,294:$Vh1,295:$Vi1,296:$Vj1,302:$Vn1,419:673,424:$Vs1},{77:[1,674]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:675,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,304:676,307:677,308:$VC2,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{77:[1,679]},{77:[1,680]},o($VD2,[2,624]),{2:$V1,3:695,4:$V2,5:$V3,77:$VE2,111:690,113:688,131:$VV,132:$VW,143:$VY,144:685,145:$VC1,152:$V$,156:$VL,181:$V31,196:687,200:693,201:692,257:689,258:691,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,300:[1,683],302:$Vn1,419:190,420:$Vr1,421:681,422:684,423:686,424:$Vs1,427:682},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:696,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:697,4:$V2,5:$V3,156:$VL,200:698,290:$VM,291:$VN,292:$VO,293:$VP},{77:[2,336]},{77:[2,337]},{77:[2,338]},{77:[2,339]},{77:[2,340]},{77:[2,341]},{77:[2,342]},{77:[2,343]},{77:[2,344]},{2:$V1,3:704,4:$V2,5:$V3,131:$VF2,132:$VG2,425:699,426:[1,700],428:701},{2:$V1,3:244,4:$V2,5:$V3,199:705},{290:[1,706]},o($Vt1,[2,472]),{2:$V1,3:244,4:$V2,5:$V3,199:707},{231:[1,709],454:708},{231:[2,695]},{2:$V1,3:219,4:$V2,5:$V3,77:$Vw1,132:$Vx1,143:$VY,144:212,145:$VZ,152:$V$,156:$VL,181:$V31,199:213,200:215,201:214,202:217,209:710,213:$Vy1,214:218,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1,419:190,420:$Vr1,424:$Vs1},{40:711,79:75,89:$V7,184:99,189:$Vb},o($VH2,[2,1091],{210:712,76:[1,713]}),o($VI2,[2,185],{3:714,2:$V1,4:$V2,5:$V3,76:[1,715],154:[1,716]}),o($VI2,[2,189],{3:717,2:$V1,4:$V2,5:$V3,76:[1,718]}),o($VI2,[2,190],{3:719,2:$V1,4:$V2,5:$V3,76:[1,720]}),o($VI2,[2,193]),o($VI2,[2,194],{3:721,2:$V1,4:$V2,5:$V3,76:[1,722]}),o($VI2,[2,197],{3:723,2:$V1,4:$V2,5:$V3,76:[1,724]}),o([2,4,5,10,72,74,76,78,93,98,118,128,154,162,168,169,183,206,208,222,223,224,225,226,227,228,229,230,231,232,245,247,306,310,602,764],$VJ2,{77:$VN1,116:$VK2}),o([2,4,5,10,72,74,76,78,93,98,118,128,162,168,169,206,208,222,223,224,225,226,227,228,229,230,231,232,245,247,306,310,602,764],[2,200]),o($VK,[2,773]),{2:$V1,3:244,4:$V2,5:$V3,199:726},o($VL2,$VM2,{81:727,198:$VN2}),o($Vz1,[2,1044]),o($VO2,[2,1057],{108:729,190:[1,730]}),o([10,78,183,306,310,602,764],$VM2,{419:190,81:731,117:732,3:733,114:736,144:758,158:768,160:769,2:$V1,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,112:$VS2,115:$V$1,116:$V02,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,198:$VN2,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,420:$Vr1,424:$Vs1}),{353:[1,782]},{183:[1,783]},o($VK,[2,594],{112:[1,784]}),{405:[1,785]},{183:[1,786]},o($VK,[2,598],{112:[1,787],183:[1,788]}),{2:$V1,3:244,4:$V2,5:$V3,199:789},{40:790,74:[1,791],79:75,89:$V7,184:99,189:$Vb},o($Vv3,[2,70]),{76:[1,792]},o($VK,[2,667]),{11:106,306:[1,793],602:$VH,764:$VI},o($VK,[2,665]),o($VK,[2,666]),{2:$V1,3:794,4:$V2,5:$V3},o($VK,[2,587]),{146:[1,795]},o([2,4,5,10,53,72,74,76,77,78,89,95,124,128,143,145,146,148,149,152,154,156,181,183,187,189,230,266,267,290,297,302,306,310,335,338,339,343,344,356,368,369,373,374,396,400,401,402,403,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,505,507,508,514,515,516,517,602,764],$VJ2,{116:$VK2}),o($VK,[2,615]),o($VK,[2,616]),o($VK,[2,617]),o($VK,$VA2,{74:[1,796]}),{77:$VB2,113:669,131:$VV,132:$VW,143:$VY,152:$V$,181:$V31,196:670,201:672,257:671,294:$Vh1,295:$Vi1,296:$Vj1,302:$Vn1,419:673,424:$Vs1},o($Vw3,[2,320]),o($Vw3,[2,321]),o($Vw3,[2,322]),o($Vw3,[2,323]),o($Vw3,[2,324]),o($Vw3,[2,325]),o($Vw3,[2,326]),o($VK,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,114:625,327:637,12:797,2:$V1,4:$V2,5:$V3,53:$V5,72:$V6,89:$V7,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$V22,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,146:$V9,154:$Va2,156:$Va,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,189:$Vb,266:$Vc,267:$Vd,290:$Ve,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),o($VK,[2,675],{74:$Vx3}),o($VK,[2,676]),o($Vy3,[2,354],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VK,[2,677],{74:[1,800]}),o($VK,[2,678],{74:[1,801]}),o($VV1,[2,683]),o($VV1,[2,685]),o($VV1,[2,679]),o($VV1,[2,680]),{114:807,115:$V$1,116:$V02,124:[1,802],230:$VA3,429:803,430:804,433:$VB3},{2:$V1,3:808,4:$V2,5:$V3},o($Vt1,[2,656]),o($Vt1,[2,657]),o($VK,[2,614],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:100,4:$V2,5:$V3,504:274,506:809},o($VK,[2,754],{74:$VC3}),o($VD3,[2,756]),o($VK,[2,759]),o($VK,[2,681],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VE3,$VI1,{186:811,195:$VJ1}),o($VE3,$VI1,{186:812,195:$VJ1}),o($VE3,$VI1,{186:813,195:$VJ1}),o($VF3,[2,1087],{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,188:814,174:815,253:816,94:817,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),{77:[1,819],131:$VV,196:818},{2:$V1,3:100,4:$V2,5:$V3,504:274,506:820},o($VG3,[2,153]),o($VG3,[2,154]),o($VG3,[2,155]),o($VG3,[2,156]),o($VG3,[2,157]),o($VG3,[2,158]),o($VG3,[2,159]),o($VL1,[2,3]),o($VL1,[2,774]),o($VL1,[2,775]),o($VL1,[2,776]),o($VL1,[2,777]),o($VL1,[2,778]),o($VL1,[2,779]),o($VL1,[2,780]),o($VL1,[2,781]),o($VL1,[2,782]),o($VL1,[2,783]),o($VL1,[2,784]),o($VL1,[2,785]),o($VL1,[2,786]),o($VL1,[2,787]),o($VL1,[2,788]),o($VL1,[2,789]),o($VL1,[2,790]),o($VL1,[2,791]),o($VL1,[2,792]),o($VL1,[2,793]),o($VL1,[2,794]),o($VL1,[2,795]),o($VL1,[2,796]),o($VL1,[2,797]),o($VL1,[2,798]),o($VL1,[2,799]),o($VL1,[2,800]),o($VL1,[2,801]),o($VL1,[2,802]),o($VL1,[2,803]),o($VL1,[2,804]),o($VL1,[2,805]),o($VL1,[2,806]),o($VL1,[2,807]),o($VL1,[2,808]),o($VL1,[2,809]),o($VL1,[2,810]),o($VL1,[2,811]),o($VL1,[2,812]),o($VL1,[2,813]),o($VL1,[2,814]),o($VL1,[2,815]),o($VL1,[2,816]),o($VL1,[2,817]),o($VL1,[2,818]),o($VL1,[2,819]),o($VL1,[2,820]),o($VL1,[2,821]),o($VL1,[2,822]),o($VL1,[2,823]),o($VL1,[2,824]),o($VL1,[2,825]),o($VL1,[2,826]),o($VL1,[2,827]),o($VL1,[2,828]),o($VL1,[2,829]),o($VL1,[2,830]),o($VL1,[2,831]),o($VL1,[2,832]),o($VL1,[2,833]),o($VL1,[2,834]),o($VL1,[2,835]),o($VL1,[2,836]),o($VL1,[2,837]),o($VL1,[2,838]),o($VL1,[2,839]),o($VL1,[2,840]),o($VL1,[2,841]),o($VL1,[2,842]),o($VL1,[2,843]),o($VL1,[2,844]),o($VL1,[2,845]),o($VL1,[2,846]),o($VL1,[2,847]),o($VL1,[2,848]),o($VL1,[2,849]),o($VL1,[2,850]),o($VL1,[2,851]),o($VL1,[2,852]),o($VL1,[2,853]),o($VL1,[2,854]),o($VL1,[2,855]),o($VL1,[2,856]),o($VL1,[2,857]),o($VL1,[2,858]),o($VL1,[2,859]),o($VL1,[2,860]),o($VL1,[2,861]),o($VL1,[2,862]),o($VL1,[2,863]),o($VL1,[2,864]),o($VL1,[2,865]),o($VL1,[2,866]),o($VL1,[2,867]),o($VL1,[2,868]),o($VL1,[2,869]),o($VL1,[2,870]),o($VL1,[2,871]),o($VL1,[2,872]),o($VL1,[2,873]),o($VL1,[2,874]),o($VL1,[2,875]),o($VL1,[2,876]),o($VL1,[2,877]),o($VL1,[2,878]),o($VL1,[2,879]),o($VL1,[2,880]),o($VL1,[2,881]),o($VL1,[2,882]),o($VL1,[2,883]),o($VL1,[2,884]),o($VL1,[2,885]),o($VL1,[2,886]),o($VL1,[2,887]),o($VL1,[2,888]),o($VL1,[2,889]),o($VL1,[2,890]),o($VL1,[2,891]),o($VL1,[2,892]),o($VL1,[2,893]),o($VL1,[2,894]),o($VL1,[2,895]),o($VL1,[2,896]),o($VL1,[2,897]),o($VL1,[2,898]),o($VL1,[2,899]),o($VL1,[2,900]),o($VL1,[2,901]),o($VL1,[2,902]),o($VL1,[2,903]),o($VL1,[2,904]),o($VL1,[2,905]),o($VL1,[2,906]),o($VL1,[2,907]),o($VL1,[2,908]),o($VL1,[2,909]),o($VL1,[2,910]),o($VL1,[2,911]),o($VL1,[2,912]),o($VL1,[2,913]),o($VL1,[2,914]),o($VL1,[2,915]),o($VL1,[2,916]),o($VL1,[2,917]),o($VL1,[2,918]),o($VL1,[2,919]),o($VL1,[2,920]),o($VL1,[2,921]),o($VL1,[2,922]),o($VL1,[2,923]),o($VL1,[2,924]),o($VL1,[2,925]),o($VL1,[2,926]),o($VL1,[2,927]),o($VL1,[2,928]),o($VL1,[2,929]),o($VL1,[2,930]),o($VL1,[2,931]),o($VL1,[2,932]),o($VL1,[2,933]),o($VL1,[2,934]),o($VL1,[2,935]),o($VL1,[2,936]),o($VL1,[2,937]),o($VL1,[2,938]),o($VL1,[2,939]),o($VL1,[2,940]),o($VL1,[2,941]),o($VL1,[2,942]),o($VL1,[2,943]),o($VL1,[2,944]),o($VL1,[2,945]),o($VL1,[2,946]),o($VL1,[2,947]),o($VL1,[2,948]),o($VL1,[2,949]),o($VL1,[2,950]),o($VL1,[2,951]),o($VL1,[2,952]),o($VL1,[2,953]),o($VL1,[2,954]),o($VL1,[2,955]),o($VL1,[2,956]),o($VL1,[2,957]),o($VL1,[2,958]),o($VL1,[2,959]),o($VL1,[2,960]),o($VL1,[2,961]),o($VL1,[2,962]),o($VL1,[2,963]),o($VL1,[2,964]),o($VL1,[2,965]),o($VL1,[2,966]),o($VL1,[2,967]),o($VL1,[2,968]),o($VL1,[2,969]),o($VL1,[2,970]),o($VL1,[2,971]),o($VL1,[2,972]),o($VL1,[2,973]),o($VL1,[2,974]),o($VL1,[2,975]),o($VL1,[2,976]),o($VL1,[2,977]),o($VL1,[2,978]),o($VL1,[2,979]),o($VL1,[2,980]),o($VL1,[2,981]),o($VL1,[2,982]),o($VL1,[2,983]),o($VL1,[2,984]),o($VL1,[2,985]),o($VL1,[2,986]),o($VL1,[2,987]),o($VL1,[2,988]),o($VL1,[2,989]),o($VL1,[2,990]),o($VL1,[2,991]),o($VL1,[2,992]),o($VL1,[2,993]),o($VL1,[2,994]),o($VL1,[2,995]),o($VL1,[2,996]),o($VL1,[2,997]),o($VL1,[2,998]),o($VL1,[2,999]),o($VL1,[2,1000]),o($VL1,[2,1001]),o($VL1,[2,1002]),o($VL1,[2,1003]),o($VL1,[2,1004]),o($VL1,[2,1005]),o($VL1,[2,1006]),o($VL1,[2,1007]),o($VL1,[2,1008]),o($VL1,[2,1009]),o($VL1,[2,1010]),o($VL1,[2,1011]),o($VL1,[2,1012]),o($VL1,[2,1013]),o($VL1,[2,1014]),o($VL1,[2,1015]),o($VL1,[2,1016]),o($VL1,[2,1017]),o($VL1,[2,1018]),o($VL1,[2,1019]),o($VL1,[2,1020]),o($VL1,[2,1021]),o($VL1,[2,1022]),o($VL1,[2,1023]),o($VL1,[2,1024]),o($VL1,[2,1025]),o($VL1,[2,1026]),o($VL1,[2,1027]),o($VL1,[2,1028]),o($VL1,[2,1029]),o($VL1,[2,1030]),o($VL1,[2,1031]),o($VL1,[2,1032]),o($VL1,[2,1033]),o($VL1,[2,1034]),o($VL1,[2,1035]),o($VL1,[2,1036]),o($VL1,[2,1037]),o($VL1,[2,1038]),o($VL1,[2,1039]),o($VL1,[2,1040]),o($VJ,[2,7]),o($VJ,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,12:821,2:$V1,4:$V2,5:$V3,53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),{396:[1,825],401:[1,822],402:[1,823],403:[1,824]},{2:$V1,3:826,4:$V2,5:$V3},o($VE3,[2,1111],{289:827,767:829,78:[1,828],164:[1,831],185:[1,830]}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:832,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:833,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:834,4:$V2,5:$V3,132:[1,835]},{2:$V1,3:836,4:$V2,5:$V3,132:[1,837]},{2:$V1,3:838,4:$V2,5:$V3,99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{2:$V1,3:839,4:$V2,5:$V3},{154:[1,840]},o($VH3,$VP1,{350:841,156:$VQ1}),{230:[1,842]},{2:$V1,3:843,4:$V2,5:$V3},o($VK,[2,729],{74:$VI3}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:845,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VD3,[2,732]),o($VJ3,[2,1143],{419:190,476:846,144:847,139:$VK3,141:$VK3,145:$VC1,420:$Vr1,424:$Vs1}),{139:[1,848],141:[1,849]},o($VL3,$VM3,{490:851,493:852,77:[1,850],137:$VS1}),o($VN3,[2,1167],{494:853,132:[1,854]}),o($VO3,[2,1171],{496:855,497:856,152:$VT1}),o($VO3,[2,747]),o($VP3,[2,739]),{2:$V1,3:857,4:$V2,5:$V3,131:[1,858]},{2:$V1,3:859,4:$V2,5:$V3},{2:$V1,3:860,4:$V2,5:$V3},o($Vt1,$VP1,{350:861,156:$VQ1}),o($Vt1,$VP1,{350:862,156:$VQ1}),o($VY1,[2,491]),o($VY1,[2,492]),{183:[1,863]},{183:[2,1142]},o($VQ3,[2,1137],{466:864,469:865,137:[1,866]}),o($VU1,[2,1136]),o($VR3,$VS3,{510:867,95:$VT3,230:[1,868],514:$VU3,515:$VV3,516:$VW3}),{76:[1,873]},{76:[1,874]},{145:$VT,450:875},{4:$VX3,7:879,76:[1,877],272:876,387:878,389:$VY3},o($VK,[2,456],{128:[1,882]}),o($VK,[2,579]),{2:$V1,3:883,4:$V2,5:$V3},{298:[1,884]},o($VH3,$VW1,{398:885,156:$VX1}),o($VK,[2,593]),{2:$V1,3:244,4:$V2,5:$V3,199:887,399:886},{2:$V1,3:244,4:$V2,5:$V3,199:887,399:888},o($VK,[2,772]),o($VJ,[2,669],{438:889,310:[1,890]}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:891,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:892,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:893,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:894,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:895,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:896,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:897,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:898,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:899,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:900,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:901,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:902,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:903,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:904,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:905,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:906,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:907,4:$V2,5:$V3,77:[1,909],131:$VV,156:$VL,196:908,200:910,290:$VM,291:$VN,292:$VO,293:$VP},{2:$V1,3:911,4:$V2,5:$V3,77:[1,913],131:$VV,156:$VL,196:912,200:914,290:$VM,291:$VN,292:$VO,293:$VP},o($VZ3,[2,440],{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,94:915,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),o($VZ3,[2,441],{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,94:916,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),o($VZ3,[2,442],{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,94:917,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),o($VZ3,[2,443],{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,94:918,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),o($VZ3,$V_3,{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,94:919,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:920,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:921,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VZ3,[2,445],{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,94:922,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:923,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:924,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{164:[1,926],166:[1,928],328:925,334:[1,927]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:929,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:930,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:695,4:$V2,5:$V3,77:[1,931],111:934,145:$V$3,156:$VL,200:935,202:933,290:$VM,291:$VN,292:$VO,293:$VP,329:932},{99:[1,937],297:[1,938]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:939,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:940,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:941,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{4:$VX3,7:879,272:942,387:878,389:$VY3},o($V04,[2,88]),o($V04,[2,89]),{78:[1,943]},{78:[1,944]},{78:[1,945]},{78:[1,946],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($Vt1,$Vu1,{340:207,77:$VO1,198:$Vv1}),{78:[2,1107]},{78:[2,1108]},{134:$VR,135:$VS},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:947,152:$V$,154:$V01,156:$VL,158:167,164:[1,949],179:$V11,180:$V21,181:$V31,185:[1,948],196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:950,4:$V2,5:$V3,149:$V14,180:[1,952]},o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,118,122,128,129,130,131,132,134,135,137,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,314,330,331,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,416],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,332:$Vw2}),o($V24,[2,417],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,180:$Ve2,312:$Vg2,316:$Vj2}),o($V24,[2,418],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,180:$Ve2,312:$Vg2,316:$Vj2}),o($V34,[2,419],{114:625,327:637,316:$Vj2}),o($V34,[2,420],{114:625,327:637,316:$Vj2}),o($Vz2,[2,365]),o($Vz2,[2,1113]),o($Vz2,[2,1114]),o($Vz2,[2,366]),o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,231,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,362]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:953,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VD2,[2,620]),o($VD2,[2,621]),o($VD2,[2,622]),o($VD2,[2,623]),o($VD2,[2,625]),{40:954,79:75,89:$V7,184:99,189:$Vb},{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,304:955,307:677,308:$VC2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{305:956,306:$V44,307:957,308:$VC2,310:$V54},o($V64,[2,372]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:959,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:960,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{4:$VX3,7:879,272:961,387:878,389:$VY3},o($VD2,[2,626]),{74:[1,963],300:[1,962]},o($VD2,[2,642]),o($V74,[2,649]),o($V84,[2,627]),o($V84,[2,628]),o($V84,[2,629]),o($V84,[2,630]),o($V84,[2,631]),o($V84,[2,632]),o($V84,[2,633]),o($V84,[2,634]),o($V84,[2,635]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:964,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o([2,4,5,10,53,72,74,76,78,89,93,95,98,99,107,112,115,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,426,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],$Vy2,{77:$VN1,116:$V94}),{74:$Vx3,300:[1,966]},o($Va4,[2,314],{77:$VN1}),o($VB1,[2,315]),{74:[1,968],426:[1,967]},o($VD2,[2,639]),o($Vb4,[2,644]),{152:[1,969]},{152:[1,970]},{152:[1,971]},{40:976,77:[1,975],79:75,89:$V7,143:$VY,144:979,145:$VC1,149:$Vc4,152:$V$,181:$V31,184:99,189:$Vb,201:980,302:$Vn1,341:972,342:973,343:[1,974],344:$Vd4,419:190,420:$Vr1,424:$Vs1},o($Vt1,$Vu1,{340:981,198:$Vv1}),{77:$Ve4,143:$VY,144:979,145:$VC1,149:$Vc4,152:$V$,181:$V31,201:980,302:$Vn1,341:982,342:983,344:$Vd4,419:190,420:$Vr1,424:$Vs1},{230:[1,986],455:985},{2:$V1,3:219,4:$V2,5:$V3,77:$Vw1,132:$Vx1,143:$VY,144:212,145:$VZ,152:$V$,156:$VL,181:$V31,199:213,200:215,201:214,202:217,209:987,213:$Vy1,214:218,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1,419:190,420:$Vr1,424:$Vs1},{231:[2,696]},{78:[1,988]},o($VI2,[2,1093],{211:989,3:990,2:$V1,4:$V2,5:$V3}),o($VH2,[2,1092]),o($VI2,[2,183]),{2:$V1,3:991,4:$V2,5:$V3},{212:[1,992]},o($VI2,[2,187]),{2:$V1,3:993,4:$V2,5:$V3},o($VI2,[2,191]),{2:$V1,3:994,4:$V2,5:$V3},o($VI2,[2,195]),{2:$V1,3:995,4:$V2,5:$V3},o($VI2,[2,198]),{2:$V1,3:996,4:$V2,5:$V3},{2:$V1,3:997,4:$V2,5:$V3},{148:[1,998]},o($Vf4,[2,172],{82:999,183:[1,1000]}),{2:$V1,3:219,4:$V2,5:$V3,132:[1,1005],143:$VY,145:[1,1006],152:$V$,156:$VL,181:$V31,199:1001,200:1002,201:1003,202:1004,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1},{2:$V1,3:1011,4:$V2,5:$V3,109:1007,110:1008,111:1009,112:$Vg4},o($VO2,[2,1058]),o($Vh4,[2,1049],{91:1012,182:1013,183:[1,1014]}),o($VA1,[2,1048],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o([2,4,5,10,72,74,76,78,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,198,280,281,282,283,284,285,286,287,288,306,310,420,424,602,764],[2,90],{77:[1,1019]}),{119:[1,1020]},o($Vl4,[2,93]),{2:$V1,3:1021,4:$V2,5:$V3},o($Vl4,[2,95]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1022,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1023,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,112:$VS2,114:736,115:$V$1,116:$V02,117:1025,118:$VT2,122:$VU2,123:$VV2,124:$VW2,125:1024,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{77:[1,1026]},{77:[1,1027]},{77:[1,1028]},{77:[1,1029]},o($Vl4,[2,104]),o($Vl4,[2,105]),o($Vl4,[2,106]),o($Vl4,[2,107]),o($Vl4,[2,108]),o($Vl4,[2,109]),{2:$V1,3:1030,4:$V2,5:$V3},{2:$V1,3:1031,4:$V2,5:$V3,133:[1,1032]},o($Vl4,[2,113]),o($Vl4,[2,114]),o($Vl4,[2,115]),o($Vl4,[2,116]),o($Vl4,[2,117]),o($Vl4,[2,118]),{2:$V1,3:1033,4:$V2,5:$V3,77:$VB2,113:669,131:$VV,132:$VW,143:$VY,152:$V$,181:$V31,196:670,201:672,257:671,294:$Vh1,295:$Vi1,296:$Vj1,302:$Vn1,419:673,424:$Vs1},{145:[1,1034]},{77:[1,1035]},{145:[1,1036]},o($Vl4,[2,123]),{77:[1,1037]},{2:$V1,3:1038,4:$V2,5:$V3},{77:[1,1039]},{77:[1,1040]},{77:[1,1041]},{77:[1,1042]},{77:[1,1043],164:[1,1044]},{77:[1,1045]},{77:[1,1046]},{77:[1,1047]},{77:[1,1048]},{77:[1,1049]},{77:[1,1050]},{77:[1,1051]},{77:[1,1052]},{77:[1,1053]},{77:[2,1073]},{77:[2,1074]},{2:$V1,3:244,4:$V2,5:$V3,199:1054},{2:$V1,3:244,4:$V2,5:$V3,199:1055},{113:1056,132:$VW,296:$Vj1},o($VK,[2,596],{112:[1,1057]}),{2:$V1,3:244,4:$V2,5:$V3,199:1058},{113:1059,132:$VW,296:$Vj1},{2:$V1,3:1060,4:$V2,5:$V3},o($VK,[2,693]),o($VK,[2,68]),{2:$V1,3:236,4:$V2,5:$V3,75:1061},{77:[1,1062]},o($VK,[2,674]),o($VK,[2,586]),{2:$V1,3:1011,4:$V2,5:$V3,111:1065,143:$Vm4,145:$Vn4,147:1063,336:1064,337:1066},{144:1069,145:$VC1,419:190,420:$Vr1,424:$Vs1},o($VK,[2,671]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1070,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VZ3,$V_3,{255:146,200:147,256:148,111:149,254:150,196:151,257:152,113:153,258:154,201:155,202:156,259:157,260:158,261:159,144:161,262:162,263:163,56:165,158:167,3:168,419:190,94:1071,2:$V1,4:$V2,5:$V3,77:$VU,131:$VV,132:$VW,137:$VX,143:$VY,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,179:$V11,180:$V21,181:$V31,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,420:$Vr1,424:$Vs1}),{113:1072,132:$VW,296:$Vj1},{2:$V1,3:266,4:$V2,5:$V3,446:1073,447:$VE1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1075,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,230:$VA3,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1,429:1074,433:$VB3},o($VK,[2,651]),{114:1077,115:$V$1,116:$V02,124:[1,1076]},o($VK,[2,663]),o($VK,[2,664]),{2:$V1,3:1079,4:$V2,5:$V3,77:$Vo4,131:$Vp4,432:1078},{114:807,115:$V$1,116:$V02,124:[1,1082],430:1083},o($VK,[2,753],{74:$VC3}),{2:$V1,3:100,4:$V2,5:$V3,504:1084},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:817,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,174:1085,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,253:816,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:817,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,174:1086,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,253:816,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:817,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,174:1087,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,253:816,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VF3,[2,151]),o($VF3,[2,1088],{74:$Vq4}),o($Vr4,[2,273]),o($Vr4,[2,280],{114:625,327:637,3:1090,113:1092,2:$V1,4:$V2,5:$V3,76:[1,1089],99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,131:[1,1091],132:$VW,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,296:$Vj1,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VH1,[2,1089],{197:1093,765:[1,1094]}),{131:$VV,196:1095},{74:$VC3,78:[1,1096]},o($VJ,[2,11]),{148:[1,1097],190:[1,1098]},{190:[1,1099]},{190:[1,1100]},{190:[1,1101]},o($VK,[2,575],{76:[1,1103],77:[1,1102]}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1104,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vz2,[2,346]),o($VE3,[2,1112]),o($VE3,[2,1109]),o($VE3,[2,1110]),{74:$Vx3,78:[1,1105]},{74:$Vx3,78:[1,1106]},{74:[1,1107]},{74:[1,1108]},{74:[1,1109]},{74:[1,1110]},o($Vz2,[2,353]),o($VK,[2,580]),{298:[1,1111]},{2:$V1,3:1112,4:$V2,5:$V3,113:1113,132:$VW,296:$Vj1},{2:$V1,3:244,4:$V2,5:$V3,199:1114},{230:[1,1115]},{2:$V1,3:578,4:$V2,5:$V3,132:$VR1,137:$VS1,143:$VF1,145:$VG1,152:$VT1,431:585,474:1116,475:576,478:577,482:582,493:579,497:581},o($VK,[2,730],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VD3,[2,1145],{477:1117,483:1118,76:$Vs4}),o($VJ3,[2,1144]),{2:$V1,3:1122,4:$V2,5:$V3,132:$VR1,137:$VS1,144:1121,145:$VC1,152:$VT1,419:190,420:$Vr1,424:$Vs1,475:1120,493:579,497:581},{2:$V1,3:1122,4:$V2,5:$V3,132:$VR1,137:$VS1,143:$VF1,145:$VG1,152:$VT1,431:585,475:1124,478:1123,482:582,493:579,497:581},{2:$V1,3:578,4:$V2,5:$V3,132:$VR1,137:$VS1,143:$VF1,145:$VG1,152:$VT1,431:585,473:1125,474:575,475:576,478:577,482:582,493:579,497:581},o($VN3,[2,1163],{491:1126,132:[1,1127]}),o($VL3,[2,1162]),o($VO3,[2,1169],{495:1128,497:1129,152:$VT1}),o($VN3,[2,1168]),o($VO3,[2,746]),o($VO3,[2,1172]),o($VL3,[2,749]),o($VL3,[2,750]),o($VO3,[2,748]),o($VP3,[2,740]),{2:$V1,3:244,4:$V2,5:$V3,199:1130},{2:$V1,3:244,4:$V2,5:$V3,199:1131},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1132,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vt4,[2,1139],{467:1133,113:1134,132:$VW,296:$Vj1}),o($VQ3,[2,1138]),{2:$V1,3:1135,4:$V2,5:$V3},{335:$Vu4,338:$Vv4,339:$Vw4,511:1136},{2:$V1,3:244,4:$V2,5:$V3,199:1140},o($VR3,[2,765]),o($VR3,[2,766]),o($VR3,[2,767]),{129:[1,1141]},{266:[1,1142]},{266:[1,1143]},o($VV1,[2,688]),o($VV1,[2,689],{124:[1,1144]}),{4:$VX3,7:879,272:1145,387:878,389:$VY3},o([2,4,10,53,72,74,76,77,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,297,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,343,356,368,369,373,374,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,542],{5:[1,1146]}),o([2,5,10,53,72,74,76,78,89,93,95,98,99,107,112,115,116,118,122,123,124,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,230,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,297,300,306,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,343,356,368,369,373,374,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,539],{4:[1,1148],77:[1,1147]}),{77:[1,1149]},o($Vx4,[2,4]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1150,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VK,[2,588]),o($VH3,[2,568]),{2:$V1,3:1151,4:$V2,5:$V3,113:1152,132:$VW,296:$Vj1},o($VK,[2,564],{74:$Vy4}),o($VV1,[2,566]),o($VK,[2,613],{74:$Vy4}),o($VK,[2,668]),o($VK,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,12:1154,2:$V1,4:$V2,5:$V3,53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),o($Vz4,[2,376],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2}),o($V34,[2,377],{114:625,327:637,316:$Vj2}),o($Vz4,[2,378],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2}),o($VA4,[2,379],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,312:$Vg2,314:[1,1155],316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2}),o($VA4,[2,381],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,312:$Vg2,314:[1,1156],316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2}),o($VB1,[2,383],{114:625,327:637}),o($V24,[2,384],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,180:$Ve2,312:$Vg2,316:$Vj2}),o($V24,[2,385],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,180:$Ve2,312:$Vg2,316:$Vj2}),o($VB4,[2,386],{114:625,327:637,115:$V$1,116:$V02,123:$V12,136:$V42,312:$Vg2,316:$Vj2}),o($VB4,[2,387],{114:625,327:637,115:$V$1,116:$V02,123:$V12,136:$V42,312:$Vg2,316:$Vj2}),o($VB4,[2,388],{114:625,327:637,115:$V$1,116:$V02,123:$V12,136:$V42,312:$Vg2,316:$Vj2}),o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,112,118,122,123,124,128,129,130,131,132,133,134,135,137,138,139,140,141,142,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,179,180,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,311,313,314,315,317,318,319,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,389],{114:625,327:637,115:$V$1,116:$V02,136:$V42,312:$Vg2,316:$Vj2}),o($VC4,[2,390],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2}),o($VC4,[2,391],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2}),o($VC4,[2,392],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2}),o($VC4,[2,393],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2}),o($Va4,[2,394],{77:$VN1}),o($VB1,[2,395]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1157,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VB1,[2,397]),o($Va4,[2,398],{77:$VN1}),o($VB1,[2,399]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1158,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VB1,[2,401]),o($VD4,[2,402],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,403],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,404],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,405],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o([2,4,5,10,53,72,89,99,124,139,140,146,154,156,170,171,189,266,267,290,306,310,320,321,322,323,324,325,326,330,331,333,335,338,339,396,400,401,404,406,408,409,417,418,434,436,437,439,440,441,442,443,447,448,451,452,505,507,508,517,602,764],$VE4,{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,407],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,408],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,409],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,410],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VD4,[2,411],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),{77:[1,1159]},{77:[2,446]},{77:[2,447]},{77:[2,448]},o($VF4,[2,414],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,332:$Vw2}),o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,107,118,122,128,129,130,131,132,134,135,137,143,145,146,148,149,150,152,156,162,164,166,168,169,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,314,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,415],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2}),{2:$V1,3:168,4:$V2,5:$V3,40:1160,56:165,77:$VU,78:[1,1162],79:75,89:$V7,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1161,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,184:99,189:$Vb,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VB1,[2,428]),o($VB1,[2,430]),o($VB1,[2,437]),o($VB1,[2,438]),{2:$V1,3:667,4:$V2,5:$V3,77:[1,1163]},{2:$V1,3:695,4:$V2,5:$V3,77:[1,1164],111:934,145:$V$3,156:$VL,200:935,202:1166,290:$VM,291:$VN,292:$VO,293:$VP,329:1165},o($VB1,[2,435]),o($VF4,[2,432],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,332:$Vw2}),o($VF4,[2,433],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,332:$Vw2}),o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,99,107,118,122,124,128,129,130,131,132,134,135,137,139,140,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,189,198,206,208,222,223,224,225,226,227,228,229,232,239,242,243,245,247,266,267,280,281,282,283,284,285,286,287,288,290,296,300,306,308,309,310,314,320,321,322,323,324,325,326,330,331,332,333,335,338,339,396,400,401,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,464,470,505,507,508,517,602,764],[2,434],{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2}),o($VB1,[2,436]),o($VB1,[2,306]),o($VB1,[2,307]),o($VB1,[2,308]),o($VB1,[2,421]),{74:$Vx3,78:[1,1167]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1168,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1169,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VB1,$VG4),o($VH4,[2,286]),o($VB1,[2,282]),{78:[1,1171],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1172]},{305:1173,306:$V44,307:957,308:$VC2,310:$V54},{306:[1,1174]},o($V64,[2,371]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1175,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,309:[1,1176],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{76:[1,1177],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{74:[1,1178]},o($VD2,[2,640]),{2:$V1,3:695,4:$V2,5:$V3,77:$VE2,111:690,113:688,131:$VV,132:$VW,143:$VY,144:685,145:$VC1,152:$V$,156:$VL,181:$V31,196:687,200:693,201:692,257:689,258:691,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,300:[1,1179],302:$Vn1,419:190,420:$Vr1,422:1180,423:686,424:$Vs1},{78:[1,1181],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{2:$V1,3:1182,4:$V2,5:$V3,149:$V14},o($VB1,[2,364]),o($VD2,[2,637]),{2:$V1,3:704,4:$V2,5:$V3,131:$VF2,132:$VG2,426:[1,1183],428:1184},{2:$V1,3:695,4:$V2,5:$V3,77:$VE2,111:690,113:688,131:$VV,132:$VW,143:$VY,144:685,145:$VC1,152:$V$,156:$VL,181:$V31,196:687,200:693,201:692,257:689,258:691,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,302:$Vn1,419:190,420:$Vr1,422:1185,423:686,424:$Vs1},{2:$V1,3:695,4:$V2,5:$V3,77:$VE2,111:690,113:688,131:$VV,132:$VW,143:$VY,144:685,145:$VC1,152:$V$,156:$VL,181:$V31,196:687,200:693,201:692,257:689,258:691,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,302:$Vn1,419:190,420:$Vr1,422:1186,423:686,424:$Vs1},{2:$V1,3:695,4:$V2,5:$V3,77:$VE2,111:690,113:688,131:$VV,132:$VW,143:$VY,144:685,145:$VC1,152:$V$,156:$VL,181:$V31,196:687,200:693,201:692,257:689,258:691,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,302:$Vn1,419:190,420:$Vr1,422:1187,423:686,424:$Vs1},{77:$Ve4,143:$VY,144:979,145:$VC1,152:$V$,181:$V31,201:980,302:$Vn1,342:1188,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,458],{74:$VJ4}),{149:$Vc4,341:1190,344:$Vd4},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1194,100:1191,111:1193,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,345:1192,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,466]),o($VK4,[2,469]),o($VK4,[2,470]),o($VL4,[2,474]),o($VL4,[2,475]),{2:$V1,3:244,4:$V2,5:$V3,199:1195},{77:$Ve4,143:$VY,144:979,145:$VC1,152:$V$,181:$V31,201:980,302:$Vn1,342:1196,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,462],{74:$VJ4}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1194,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,345:1192,419:190,420:$Vr1,424:$Vs1},{308:$VM4,456:1197,458:1198,459:1199},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1201,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{230:[2,697]},o($VI2,[2,181],{3:1202,2:$V1,4:$V2,5:$V3,76:[1,1203]}),o($VI2,[2,182]),o($VI2,[2,1094]),o($VI2,[2,184]),o($VI2,[2,186]),o($VI2,[2,188]),o($VI2,[2,192]),o($VI2,[2,196]),o($VI2,[2,199]),o([2,4,5,10,53,72,74,76,77,78,89,93,95,98,118,124,128,143,145,146,148,149,152,154,156,162,168,169,181,183,187,189,206,208,222,223,224,225,226,227,228,229,230,231,232,245,247,266,267,290,297,302,306,310,335,338,339,343,344,356,368,369,373,374,396,400,401,402,403,404,406,408,409,417,418,420,424,434,436,437,439,440,441,442,443,447,448,451,452,505,507,508,514,515,516,517,602,764],[2,201]),{2:$V1,3:1204,4:$V2,5:$V3},o($VN4,[2,1045],{83:1205,92:1206,93:[1,1207],98:[1,1208]}),{2:$V1,3:219,4:$V2,5:$V3,77:[1,1210],132:$Vx1,143:$VY,144:212,145:$VZ,152:$V$,156:$VL,181:$V31,199:213,200:215,201:214,202:217,203:1209,209:1211,213:$Vy1,214:218,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1,419:190,420:$Vr1,424:$Vs1},o($VL2,[2,164]),o($VL2,[2,165]),o($VL2,[2,166]),o($VL2,[2,167]),o($VL2,[2,168]),{2:$V1,3:667,4:$V2,5:$V3},o($Vz1,[2,83],{74:[1,1212]}),o($VO4,[2,85]),o($VO4,[2,86]),{113:1213,132:$VW,296:$Vj1},o([10,72,74,78,93,98,118,124,128,162,168,169,183,198,206,208,222,223,224,225,226,227,228,229,232,245,247,306,310,602,764],$Vy2,{116:$V94}),o($Vh4,[2,73]),o($Vh4,[2,1050]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1214,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vl4,[2,126]),o($Vl4,[2,144]),o($Vl4,[2,145]),o($Vl4,[2,146]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,78:[2,1065],94:260,111:149,113:153,127:1215,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1216,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{77:[1,1217]},o($Vl4,[2,94]),o([2,4,5,10,72,74,76,77,78,118,122,124,128,129,130,131,132,134,135,137,139,140,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,198,280,281,282,283,284,285,286,287,288,306,310,420,424,602,764],[2,96],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o([2,4,5,10,72,74,76,77,78,112,118,122,124,128,129,130,131,132,134,135,137,139,140,143,145,146,148,149,150,152,154,156,162,164,166,168,169,170,171,172,173,175,181,183,185,187,198,280,281,282,283,284,285,286,287,288,306,310,420,424,602,764],[2,97],{114:625,327:637,99:$VZ1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1218],112:$VS2,114:736,115:$V$1,116:$V02,117:1219,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},o($VP4,[2,1061],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,112:$VS2,114:736,115:$V$1,116:$V02,117:1221,118:$VT2,122:$VU2,123:$VV2,124:$VW2,126:1220,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1222,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1223,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1224,4:$V2,5:$V3},o($Vl4,[2,110]),o($Vl4,[2,111]),o($Vl4,[2,112]),o($Vl4,[2,119]),{2:$V1,3:1225,4:$V2,5:$V3},{2:$V1,3:1011,4:$V2,5:$V3,111:1065,143:$Vm4,145:$Vn4,147:1226,336:1064,337:1066},{2:$V1,3:1227,4:$V2,5:$V3},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1228,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vl4,[2,125]),o($VP4,[2,1067],{155:1229}),o($VP4,[2,1069],{157:1230}),o($VP4,[2,1071],{159:1231}),o($VP4,[2,1075],{161:1232}),o($VQ4,$VR4,{163:1233,178:1234}),{77:[1,1235]},o($VP4,[2,1077],{165:1236}),o($VP4,[2,1079],{167:1237}),o($VQ4,$VR4,{178:1234,163:1238}),o($VQ4,$VR4,{178:1234,163:1239}),o($VQ4,$VR4,{178:1234,163:1240}),o($VQ4,$VR4,{178:1234,163:1241}),{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,112:$VS2,114:736,115:$V$1,116:$V02,117:1242,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:817,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,174:1243,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,253:816,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VS4,[2,1081],{176:1244}),o($VK,[2,606],{183:[1,1245]}),o($VK,[2,602],{183:[1,1246]}),o($VK,[2,595]),{113:1247,132:$VW,296:$Vj1},o($VK,[2,604],{183:[1,1248]}),o($VK,[2,599]),o($VK,[2,600],{112:[1,1249]}),o($Vv3,[2,69]),{40:1250,79:75,89:$V7,184:99,189:$Vb},o($VK,[2,450],{74:$VT4,128:[1,1251]}),o($VU4,[2,451]),{124:[1,1253]},{2:$V1,3:1254,4:$V2,5:$V3},o($Vt1,[2,1115]),o($Vt1,[2,1116]),o($VK,[2,618]),o($Vy3,[2,355],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VD4,$VE4,{114:625,327:637,112:$V_1,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,332:$Vw2}),o($VV1,[2,682]),o($VV1,[2,684]),o($VK,[2,650]),o($VK,[2,652],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1255,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1079,4:$V2,5:$V3,77:$Vo4,131:$Vp4,432:1256},o($VV4,[2,659]),o($VV4,[2,660]),o($VV4,[2,661]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1257,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1258,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{114:1077,115:$V$1,116:$V02,124:[1,1259]},o($VD3,[2,755]),o($VF3,[2,148],{74:$Vq4}),o($VF3,[2,149],{74:$Vq4}),o($VF3,[2,150],{74:$Vq4}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:817,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,253:1260,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1261,4:$V2,5:$V3,113:1263,131:[1,1262],132:$VW,296:$Vj1},o($Vr4,[2,275]),o($Vr4,[2,277]),o($Vr4,[2,279]),o($VH1,[2,160]),o($VH1,[2,1090]),{78:[1,1264]},o($VK1,[2,758]),{2:$V1,3:1265,4:$V2,5:$V3},{2:$V1,3:1266,4:$V2,5:$V3},{2:$V1,3:1268,4:$V2,5:$V3,384:1267},{2:$V1,3:1268,4:$V2,5:$V3,384:1269},{2:$V1,3:1270,4:$V2,5:$V3},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1271,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1272,4:$V2,5:$V3},{74:$Vx3,78:[1,1273]},o($Vz2,[2,347]),o($Vz2,[2,348]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1274,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1275,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1276,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1277,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VH3,[2,504]),o($VK,$VW4,{407:1278,76:$VX4,77:[1,1279]}),o($VK,$VW4,{407:1281,76:$VX4}),{77:[1,1282]},{2:$V1,3:244,4:$V2,5:$V3,199:1283},o($VD3,[2,731]),o($VD3,[2,733]),o($VD3,[2,1146]),{143:$VF1,145:$VG1,431:1284},o($VY4,[2,1147],{419:190,479:1285,144:1286,145:$VC1,420:$Vr1,424:$Vs1}),{76:$Vs4,139:[2,1151],481:1287,483:1288},o([10,74,76,78,132,139,145,152,306,310,420,424,602,764],$VM3,{490:851,493:852,137:$VS1}),o($VD3,[2,736]),o($VD3,$VK3),{74:$VI3,78:[1,1289]},o($VO3,[2,1165],{492:1290,497:1291,152:$VT1}),o($VN3,[2,1164]),o($VO3,[2,745]),o($VO3,[2,1170]),o($VK,[2,490],{77:[1,1292]}),{76:[1,1294],77:[1,1293]},{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,148:[1,1295],154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($VI4,$VZ4,{79:75,184:99,468:1296,40:1299,89:$V7,146:$V_4,189:$Vb,470:$V$4}),o($Vt4,[2,1140]),o($VQ3,[2,723]),{230:[1,1300]},o($V05,[2,769]),o($V05,[2,770]),o($V05,[2,771]),o($VR3,$VS3,{510:1301,95:$VT3,514:$VU3,515:$VV3,516:$VW3}),o($VR3,[2,768]),o($VK,[2,312]),o($VK,[2,313]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1302,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VV1,[2,690],{124:[1,1303]}),o($Vx4,[2,541]),{131:[1,1305],388:1304,390:[1,1306]},o($Vx4,[2,5]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1194,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,345:1307,419:190,420:$Vr1,424:$Vs1},o($VK,[2,455],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VK,[2,589]),o($VK,[2,590]),{2:$V1,3:244,4:$V2,5:$V3,199:1308},o($VK,[2,670]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1309,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1310,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{78:[1,1311],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1312],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{2:$V1,3:168,4:$V2,5:$V3,40:1313,56:165,77:$VU,79:75,89:$V7,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1314,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,184:99,189:$Vb,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{78:[1,1315]},{74:$Vx3,78:[1,1316]},o($VB1,[2,426]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1317,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,40:1318,56:165,77:$VU,78:[1,1320],79:75,89:$V7,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1319,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,184:99,189:$Vb,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VB1,[2,429]),o($VB1,[2,431]),o($VB1,$V15,{275:1321,276:$V25}),{78:[1,1323],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1324],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{2:$V1,3:1325,4:$V2,5:$V3,180:[1,1326]},o($VD2,[2,619]),o($VB1,[2,363]),{306:[1,1327]},o($VB1,[2,370]),{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,306:[2,374],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1328,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{4:$VX3,7:879,272:1329,387:878,389:$VY3},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1330,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VD2,[2,641]),o($V74,[2,648]),o($V84,[2,636]),o($VH4,$VG4),o($VD2,[2,638]),o($Vb4,[2,643]),o($Vb4,[2,645]),o($Vb4,[2,646]),o($Vb4,[2,647]),o($VI4,[2,457],{74:$VJ4}),{77:[1,1332],143:$VY,144:1333,145:$VC1,152:$V$,181:$V31,201:1334,302:$Vn1,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,463]),{74:$V35,78:[1,1335]},{74:$V45,78:[1,1337]},o([74,78,99,112,115,116,123,124,133,136,138,139,140,141,142,154,170,171,179,180,311,312,313,315,316,317,318,319,320,321,322,323,324,325,326,330,331,332,333],$V55),o($V65,[2,479],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{40:1341,77:$Ve4,79:75,89:$V7,143:$VY,144:979,145:$VC1,149:$Vc4,152:$V$,181:$V31,184:99,189:$Vb,201:980,302:$Vn1,341:1339,342:1340,344:$Vd4,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,461],{74:$VJ4}),o($VK,[2,717],{457:1342,458:1343,459:1344,308:$VM4,464:[1,1345]}),o($V75,[2,701]),o($V75,[2,702]),{154:[1,1347],460:[1,1346]},{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,308:[2,698],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($VI2,[2,179]),{2:$V1,3:1348,4:$V2,5:$V3},o($VK,[2,574]),o($V85,[2,238],{84:1349,128:[1,1350]}),o($VN4,[2,1046]),{77:[1,1351]},{77:[1,1352]},o($Vf4,[2,169],{204:1353,215:1355,205:1356,216:1357,221:1360,74:$V95,206:$Va5,208:$Vb5,222:$Vc5,223:$Vd5,224:$Ve5,225:$Vf5,226:$Vg5,227:$Vh5,228:$Vi5,229:$Vj5}),{2:$V1,3:219,4:$V2,5:$V3,40:711,77:$Vw1,79:75,89:$V7,132:$Vx1,143:$VY,144:212,145:$VZ,152:$V$,156:$VL,181:$V31,184:99,189:$Vb,199:213,200:215,201:214,202:217,203:1369,209:1211,213:$Vy1,214:218,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1,419:190,420:$Vr1,424:$Vs1},o($Vk5,[2,177]),{2:$V1,3:1011,4:$V2,5:$V3,110:1370,111:1009,112:$Vg4},o($VO4,[2,87]),o($Vh4,[2,147],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{78:[1,1371]},{74:$Vx3,78:[2,1066]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,78:[2,1059],94:1376,111:149,113:153,120:1372,121:1373,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,241:1374,242:[1,1375],254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vl4,[2,98]),o($VP4,[2,1062],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1377],112:$VS2,114:736,115:$V$1,116:$V02,117:1378,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},o($VP4,[2,1063],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),{78:[1,1379],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1380],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1381]},o($Vl4,[2,120]),{74:$VT4,78:[1,1382]},o($Vl4,[2,122]),{74:$Vx3,78:[1,1383]},{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1384],112:$VS2,114:736,115:$V$1,116:$V02,117:1385,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1386],112:$VS2,114:736,115:$V$1,116:$V02,117:1387,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1388],112:$VS2,114:736,115:$V$1,116:$V02,117:1389,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1390],112:$VS2,114:736,115:$V$1,116:$V02,117:1391,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{74:$Vl5,78:[1,1392]},o($V65,[2,143],{419:190,3:733,114:736,144:758,158:768,160:769,117:1394,2:$V1,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,112:$VS2,115:$V$1,116:$V02,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,420:$Vr1,424:$Vs1}),o($VQ4,$VR4,{178:1234,163:1395}),{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1396],112:$VS2,114:736,115:$V$1,116:$V02,117:1397,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,78:[1,1398],112:$VS2,114:736,115:$V$1,116:$V02,117:1399,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{74:$Vl5,78:[1,1400]},{74:$Vl5,78:[1,1401]},{74:$Vl5,78:[1,1402]},{74:$Vl5,78:[1,1403]},{78:[1,1404],153:1015,179:$Vi4,180:$Vj4,181:$Vk4},{74:$Vq4,78:[1,1405]},{2:$V1,3:733,4:$V2,5:$V3,72:$VP2,74:[1,1406],76:$VQ2,77:$VR2,112:$VS2,114:736,115:$V$1,116:$V02,117:1407,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,144:758,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,158:768,160:769,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1408,4:$V2,5:$V3},{2:$V1,3:1409,4:$V2,5:$V3},o($VK,[2,597]),{2:$V1,3:1410,4:$V2,5:$V3},{113:1411,132:$VW,296:$Vj1},{78:[1,1412]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1413,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1011,4:$V2,5:$V3,111:1065,143:$Vm4,145:$Vn4,336:1414,337:1066},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1415,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{124:[1,1416]},o($VK,[2,653],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VV4,[2,658]),{78:[1,1417],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($VK,[2,654],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1418,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vr4,[2,272]),o($Vr4,[2,274]),o($Vr4,[2,276]),o($Vr4,[2,278]),o($VH1,[2,161]),o($VK,[2,569]),{148:[1,1419]},o($VK,[2,570]),o($VD3,[2,536],{387:878,7:879,272:1420,4:$VX3,386:[1,1421],389:$VY3}),o($VK,[2,571]),o($VK,[2,573]),{74:$Vx3,78:[1,1422]},o($VK,[2,577]),o($Vz2,[2,345]),{74:[1,1423],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{74:[1,1424],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{74:[1,1425],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{74:[1,1426],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($VK,[2,581]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1427,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1428,4:$V2,5:$V3},o($VK,[2,583]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1376,111:149,113:153,120:1429,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,241:1374,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{77:[1,1430]},{2:$V1,3:1431,4:$V2,5:$V3},{76:$Vs4,139:[2,1149],480:1432,483:1433},o($VY4,[2,1148]),{139:[1,1434]},{139:[2,1152]},o($VD3,[2,737]),o($VO3,[2,744]),o($VO3,[2,1166]),{2:$V1,3:1268,4:$V2,5:$V3,76:[1,1437],351:1435,358:1436,384:1438},{2:$V1,3:1011,4:$V2,5:$V3,100:1439,111:1440},{40:1441,79:75,89:$V7,184:99,189:$Vb},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1442,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,722]),{2:$V1,3:1011,4:$V2,5:$V3,111:1065,143:$Vm4,145:$Vn4,147:1443,336:1064,337:1066},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1444,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,727]),{2:$V1,3:244,4:$V2,5:$V3,199:1445},{335:$Vu4,338:$Vv4,339:$Vw4,511:1446},o($VV1,[2,691],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1447,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{74:[1,1448],78:[1,1449]},o($V65,[2,543]),o($V65,[2,544]),{74:$V45,78:[1,1450]},o($VV1,[2,565]),o($Vz4,[2,380],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2}),o($Vz4,[2,382],{114:625,327:637,115:$V$1,116:$V02,123:$V12,133:$V32,136:$V42,138:$V52,141:$V82,142:$V92,179:$Vd2,180:$Ve2,312:$Vg2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2}),o($VB1,[2,396]),o($VB1,[2,400]),{78:[1,1451]},{74:$Vx3,78:[1,1452]},o($VB1,[2,422]),o($VB1,[2,424]),{78:[1,1453],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1454]},{74:$Vx3,78:[1,1455]},o($VB1,[2,427]),o($VB1,[2,327]),{77:[1,1456]},o($VB1,$V15,{275:1457,276:$V25}),o($VB1,$V15,{275:1458,276:$V25}),o($VH4,[2,284]),o($VB1,[2,281]),o($VB1,[2,369]),o($V64,[2,373],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{74:[1,1460],78:[1,1459]},{74:[1,1462],78:[1,1461],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{2:$V1,3:1325,4:$V2,5:$V3},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1194,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,345:1463,419:190,420:$Vr1,424:$Vs1},o($VL4,[2,477]),o($VL4,[2,478]),{40:1466,77:$Ve4,79:75,89:$V7,143:$VY,144:979,145:$VC1,149:$Vc4,152:$V$,181:$V31,184:99,189:$Vb,201:980,302:$Vn1,341:1464,342:1465,344:$Vd4,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1011,4:$V2,5:$V3,111:1467},o($VL4,[2,473]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1468,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{77:$Ve4,143:$VY,144:979,145:$VC1,152:$V$,181:$V31,201:980,302:$Vn1,342:1469,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,460],{74:$VJ4}),o($VI4,[2,467]),o($VK,[2,694]),o($V75,[2,699]),o($V75,[2,700]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:817,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,174:1470,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,253:816,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{170:[1,1472],309:[1,1471]},{460:[1,1473]},o($VI2,[2,180]),o($Vm5,[2,240],{85:1474,232:[1,1475]}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1476,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1477,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1478,4:$V2,5:$V3},o($Vf4,[2,170],{216:1357,221:1360,215:1479,205:1480,206:$Va5,208:$Vb5,222:$Vc5,223:$Vd5,224:$Ve5,225:$Vf5,226:$Vg5,227:$Vh5,228:$Vi5,229:$Vj5}),{2:$V1,3:219,4:$V2,5:$V3,77:$Vw1,132:$Vx1,143:$VY,144:212,145:$VZ,152:$V$,156:$VL,181:$V31,199:213,200:215,201:214,202:217,209:1481,213:$Vy1,214:218,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1,419:190,420:$Vr1,424:$Vs1},o($Vn5,[2,205]),o($Vn5,[2,206]),{2:$V1,3:219,4:$V2,5:$V3,77:[1,1486],143:$VY,144:1484,145:$VZ,152:$V$,156:$VL,181:$V31,199:1483,200:1487,201:1485,202:1488,217:1482,290:$VM,291:$VN,292:$VO,293:$VP,302:$Vn1,419:190,420:$Vr1,424:$Vs1},{207:[1,1489],223:$Vo5},{207:[1,1491],223:$Vp5},o($Vq5,[2,222]),{206:[1,1495],208:[1,1494],221:1493,223:$Vd5,224:$Ve5,225:$Vf5,226:$Vg5,227:$Vh5,228:$Vi5,229:$Vj5},o($Vq5,[2,224]),{223:[1,1496]},{208:[1,1498],223:[1,1497]},{208:[1,1500],223:[1,1499]},{208:[1,1501]},{223:[1,1502]},{223:[1,1503]},{74:$V95,204:1504,205:1356,206:$Va5,208:$Vb5,215:1355,216:1357,221:1360,222:$Vc5,223:$Vd5,224:$Ve5,225:$Vf5,226:$Vg5,227:$Vh5,228:$Vi5,229:$Vj5},o($VO4,[2,84]),o($Vl4,[2,100]),{74:$Vr5,78:[1,1505]},{78:[1,1507]},o($Vs5,[2,261]),{78:[2,1060]},o($Vs5,[2,263],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,242:[1,1508],243:[1,1509],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($Vl4,[2,99]),o($VP4,[2,1064],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,101]),o($Vl4,[2,102]),o($Vl4,[2,103]),o($Vl4,[2,121]),o($Vl4,[2,124]),o($Vl4,[2,127]),o($VP4,[2,1068],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,128]),o($VP4,[2,1070],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,129]),o($VP4,[2,1072],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,130]),o($VP4,[2,1076],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,131]),o($VQ4,[2,1083],{177:1510}),o($VQ4,[2,1086],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),{74:$Vl5,78:[1,1511]},o($Vl4,[2,133]),o($VP4,[2,1078],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,134]),o($VP4,[2,1080],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,135]),o($Vl4,[2,136]),o($Vl4,[2,137]),o($Vl4,[2,138]),o($Vl4,[2,139]),o($Vl4,[2,140]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:260,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,151:1512,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VS4,[2,1082],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($VK,[2,607]),o($VK,[2,603]),o($VK,[2,605]),o($VK,[2,601]),o($Vv3,[2,71]),o($VK,[2,449],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VU4,[2,452]),o($VU4,[2,453],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1513,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VV4,[2,662]),o($VK,[2,655],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:1514,4:$V2,5:$V3},o($VD3,[2,545],{385:1515,391:1516,392:1517,366:1525,154:$Vt5,187:$Vu5,230:$Vv5,297:$Vw5,343:$Vx5,356:$Vy5,368:$Vz5,369:$VA5,373:$VB5,374:$VC5}),o($VD3,[2,535]),o($VK,[2,576],{76:[1,1529]}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1530,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1531,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1532,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1533,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{74:$Vx3,78:[1,1534]},o($VK,[2,585]),{74:$Vr5,78:[1,1535]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1376,111:149,113:153,120:1536,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,241:1374,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o([10,74,78,139,306,310,602,764],[2,741]),{139:[1,1537]},{139:[2,1150]},{2:$V1,3:1122,4:$V2,5:$V3,132:$VR1,137:$VS1,143:$VF1,145:$VG1,152:$VT1,431:585,475:1124,478:1538,482:582,493:579,497:581},{78:[1,1539]},{74:[1,1540],78:[2,506]},{40:1541,79:75,89:$V7,184:99,189:$Vb},o($V65,[2,532]),{74:$V35,78:[1,1542]},o($Vk5,$V55),o($VK,[2,1133],{412:1543,413:1544,72:$VD5}),o($VI4,$VZ4,{79:75,184:99,114:625,327:637,40:1299,468:1546,89:$V7,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,146:$V_4,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,189:$Vb,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2,470:$V$4}),o($VI4,[2,725],{74:$VT4}),o($VI4,[2,726],{74:$Vx3}),o([10,53,72,89,124,146,156,189,266,267,290,306,310,335,338,339,396,400,401,404,406,408,409,417,418,434,436,437,439,440,441,442,443,447,448,451,452,505,507,508,517,602,764],[2,1181],{512:1547,3:1548,2:$V1,4:$V2,5:$V3,76:[1,1549]}),o($VE5,[2,1183],{513:1550,76:[1,1551]}),o($VV1,[2,692],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{131:[1,1552]},o($Vx4,[2,538]),o($Vx4,[2,540]),o($VB1,[2,412]),o($VB1,[2,413]),o($VB1,[2,439]),o($VB1,[2,423]),o($VB1,[2,425]),{118:$VF5,277:1553,278:1554,279:[1,1555]},o($VB1,[2,328]),o($VB1,[2,329]),o($VB1,[2,316]),{131:[1,1557]},o($VB1,[2,318]),{131:[1,1558]},{74:$V45,78:[1,1559]},{77:$Ve4,143:$VY,144:979,145:$VC1,152:$V$,181:$V31,201:980,302:$Vn1,342:1560,419:190,420:$Vr1,424:$Vs1},o($VI4,[2,465],{74:$VJ4}),o($VI4,[2,468]),o($Vk5,[2,488]),o($V65,[2,480],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VI4,[2,459],{74:$VJ4}),o($VK,[2,718],{74:$Vq4,198:[1,1561]}),{335:$VG5,338:$VH5,461:1562},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1565,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{119:[1,1567],170:[1,1568],309:[1,1566]},o($VI5,[2,259],{86:1569,118:[1,1570]}),{119:[1,1571]},o($V85,[2,239],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{95:[1,1572],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{95:[1,1573]},o($Vn5,[2,203]),o($Vn5,[2,204]),o($Vk5,[2,178]),o($Vn5,[2,237],{218:1574,230:[1,1575],231:[1,1576]}),o($VJ5,[2,208],{3:1577,2:$V1,4:$V2,5:$V3,76:[1,1578]}),o($VK5,[2,1095],{219:1579,76:[1,1580]}),{2:$V1,3:1581,4:$V2,5:$V3,76:[1,1582]},{40:1583,79:75,89:$V7,184:99,189:$Vb},o($VJ5,[2,216],{3:1584,2:$V1,4:$V2,5:$V3,76:[1,1585]}),o($VJ5,[2,219],{3:1586,2:$V1,4:$V2,5:$V3,76:[1,1587]}),{77:[1,1588]},o($Vq5,[2,234]),{77:[1,1589]},o($Vq5,[2,230]),o($Vq5,[2,223]),{223:$Vp5},{223:$Vo5},o($Vq5,[2,225]),o($Vq5,[2,226]),{223:[1,1590]},o($Vq5,[2,228]),{223:[1,1591]},{223:[1,1592]},o($Vq5,[2,232]),o($Vq5,[2,233]),{78:[1,1593],205:1480,206:$Va5,208:$Vb5,215:1479,216:1357,221:1360,222:$Vc5,223:$Vd5,224:$Ve5,225:$Vf5,226:$Vg5,227:$Vh5,228:$Vi5,229:$Vj5},o($Vl4,[2,91]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1376,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,241:1594,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vl4,[2,92]),o($Vs5,[2,264]),{244:[1,1595]},o($V65,[2,142],{419:190,3:733,114:736,144:758,158:768,160:769,117:1596,2:$V1,4:$V2,5:$V3,72:$VP2,76:$VQ2,77:$VR2,112:$VS2,115:$V$1,116:$V02,118:$VT2,122:$VU2,123:$VV2,124:$VW2,128:$VX2,129:$VY2,130:$VZ2,131:$V_2,132:$V$2,133:$V03,134:$V13,135:$V23,136:$V33,137:$V43,138:$V53,139:$V63,140:$V73,141:$V83,142:$V93,143:$Va3,145:$Vb3,146:$Vc3,148:$Vd3,149:$Ve3,150:$Vf3,152:$Vg3,154:$Vh3,156:$Vi3,162:$Vj3,164:$Vk3,166:$Vl3,168:$Vm3,169:$Vn3,170:$Vo3,171:$Vp3,172:$Vq3,173:$Vr3,175:$Vs3,185:$Vt3,187:$Vu3,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,420:$Vr1,424:$Vs1}),o($Vl4,[2,132]),{74:$Vx3,78:[1,1597]},o($VU4,[2,454],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($VK,[2,572]),o($VD3,[2,534]),o($VD3,[2,546],{366:1525,392:1598,154:$Vt5,187:$Vu5,230:$Vv5,297:$Vw5,343:$Vx5,356:$Vy5,368:$Vz5,369:$VA5,373:$VB5,374:$VC5}),o($Vw3,[2,548]),{370:[1,1599]},{370:[1,1600]},{2:$V1,3:244,4:$V2,5:$V3,199:1601},o($Vw3,[2,554],{77:[1,1602]}),{2:$V1,3:114,4:$V2,5:$V3,77:[1,1604],113:251,131:$VV,132:$VW,143:$VY,152:$V$,156:$VL,181:$V31,196:250,200:1605,201:254,257:252,258:253,265:$VD1,274:1603,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,302:$Vn1},o($Vw3,[2,558]),{297:[1,1606]},o($Vw3,[2,560]),o($Vw3,[2,561]),{335:[1,1607]},{77:[1,1608]},{2:$V1,3:1609,4:$V2,5:$V3},{78:[1,1610],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1611],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1612],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{78:[1,1613],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($VK,$VW4,{407:1614,76:$VX4}),o($VK,[2,591]),{74:$Vr5,78:[1,1615]},{2:$V1,3:1122,4:$V2,5:$V3,132:$VR1,137:$VS1,143:$VF1,145:$VG1,152:$VT1,431:585,475:1124,478:1616,482:582,493:579,497:581},o($VD3,[2,735]),o($VK,[2,493],{352:1617,354:1618,355:1619,4:$VL5,243:$VM5,343:$VN5,356:$VO5}),o($VP5,$VQ5,{3:1268,359:1624,384:1625,360:1626,361:1627,2:$V1,4:$V2,5:$V3,367:$VR5}),{78:[2,507]},{76:[1,1629]},o($VK,[2,609]),o($VK,[2,1134]),{368:[1,1631],414:[1,1630]},o($VI4,[2,728]),o($VK,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,12:1632,2:$V1,4:$V2,5:$V3,53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),o($VK,[2,762]),o($VE5,[2,1182]),o($VK,$V0,{17:5,18:7,19:8,20:9,21:10,22:11,23:12,24:13,25:14,26:15,27:16,28:17,29:18,30:19,31:20,32:21,33:22,34:23,35:24,36:25,37:26,38:27,39:28,40:29,41:30,42:31,43:32,44:33,45:34,46:35,47:36,48:37,49:38,50:39,51:40,52:41,54:43,55:44,56:45,57:46,58:47,59:48,60:49,61:50,62:51,63:52,64:53,65:54,66:55,67:56,68:57,69:58,70:59,71:60,79:75,504:95,184:99,3:100,12:1633,2:$V1,4:$V2,5:$V3,53:$V5,72:$V6,89:$V7,124:$V8,146:$V9,156:$Va,189:$Vb,266:$Vc,267:$Vd,290:$Ve,335:$Vf,338:$Vg,339:$Vh,396:$Vi,400:$Vj,401:$Vk,404:$Vl,406:$Vm,408:$Vn,409:$Vo,417:$Vp,418:$Vq,434:$Vr,436:$Vs,437:$Vt,439:$Vu,440:$Vv,441:$Vw,442:$Vx,443:$Vy,447:$Vz,448:$VA,451:$VB,452:$VC,505:$VD,507:$VE,508:$VF,517:$VG}),o($VE5,[2,1184]),{78:[1,1634]},{78:[1,1635],118:$VF5,278:1636},{78:[1,1637]},{119:[1,1638]},{119:[1,1639]},{78:[1,1640]},{78:[1,1641]},o($VL4,[2,476]),o($VI4,[2,464],{74:$VJ4}),{2:$V1,3:244,4:$V2,5:$V3,143:$VF1,145:$VG1,199:1643,431:1642},o($V75,[2,703]),o($V75,[2,705]),{146:[1,1644]},{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,309:[1,1645],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},{339:$VS5,462:1646},{417:[1,1649],463:[1,1648]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1650,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VT5,[2,267],{87:1651,245:[1,1652],247:[1,1653]}),{119:[1,1654]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1660,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,233:1655,235:1656,236:$VU5,237:$VV5,238:$VW5,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1661,4:$V2,5:$V3},{2:$V1,3:1662,4:$V2,5:$V3},o($Vn5,[2,207]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1663,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1011,4:$V2,5:$V3,100:1664,111:1440},o($VJ5,[2,209]),{2:$V1,3:1665,4:$V2,5:$V3},o($VJ5,[2,1097],{220:1666,3:1667,2:$V1,4:$V2,5:$V3}),o($VK5,[2,1096]),o($VJ5,[2,212]),{2:$V1,3:1668,4:$V2,5:$V3},{78:[1,1669]},o($VJ5,[2,217]),{2:$V1,3:1670,4:$V2,5:$V3},o($VJ5,[2,220]),{2:$V1,3:1671,4:$V2,5:$V3},{40:1672,79:75,89:$V7,184:99,189:$Vb},{40:1673,79:75,89:$V7,184:99,189:$Vb},o($Vq5,[2,227]),o($Vq5,[2,229]),o($Vq5,[2,231]),o($Vf4,[2,171]),o($Vs5,[2,262]),o($Vs5,[2,265],{242:[1,1674]}),o($VQ4,[2,1084],{153:1015,179:$Vi4,180:$Vj4,181:$Vk4}),o($Vl4,[2,141]),o($Vw3,[2,547]),o($Vw3,[2,550]),{374:[1,1675]},o($Vw3,[2,1127],{395:1676,393:1677,77:$VX5}),{131:$VV,196:1679},o($Vw3,[2,555]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1680,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vw3,[2,557]),o($Vw3,[2,559]),{2:$V1,3:114,4:$V2,5:$V3,77:[1,1682],113:251,131:$VV,132:$VW,143:$VY,152:$V$,156:$VL,181:$V31,196:250,200:255,201:254,257:252,258:253,265:$VD1,274:1681,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,302:$Vn1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1683,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VK,[2,578]),o($Vz2,[2,349]),o($Vz2,[2,350]),o($Vz2,[2,351]),o($Vz2,[2,352]),o($VK,[2,582]),o($VK,[2,592]),o($VD3,[2,734]),o($VK,[2,489]),o($VK,[2,494],{355:1684,4:$VL5,243:$VM5,343:$VN5,356:$VO5}),o($VY5,[2,496]),o($VY5,[2,497]),{124:[1,1685]},{124:[1,1686]},{124:[1,1687]},{74:[1,1688],78:[2,505]},o($V65,[2,533]),o($V65,[2,508]),{187:[1,1696],193:[1,1697],362:1689,363:1690,364:1691,365:1692,366:1693,368:$Vz5,369:[1,1694],370:[1,1698],373:[1,1695]},{2:$V1,3:1699,4:$V2,5:$V3},{40:1700,79:75,89:$V7,184:99,189:$Vb},{415:[1,1701]},{416:[1,1702]},o($VK,[2,761]),o($VK,[2,763]),o($Vx4,[2,537]),o($VB1,[2,331]),{78:[1,1703]},o($VB1,[2,332]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1660,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,233:1704,235:1656,236:$VU5,237:$VV5,238:$VW5,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1376,111:149,113:153,120:1705,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,241:1374,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($VB1,[2,317]),o($VB1,[2,319]),{2:$V1,3:1706,4:$V2,5:$V3},o($VK,[2,720],{77:[1,1707]}),{2:$V1,3:1011,4:$V2,5:$V3,111:1065,143:$Vm4,145:$Vn4,147:1708,336:1064,337:1066},{335:$VG5,338:$VH5,461:1709},o($V75,[2,707]),{77:[1,1711],343:[1,1712],344:[1,1710]},{170:[1,1714],309:[1,1713]},{170:[1,1716],309:[1,1715]},{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,309:[1,1717],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($Vh4,[2,250],{88:1718,162:[1,1719],168:[1,1721],169:[1,1720]}),{131:$VV,196:1722},{131:$VV,196:1723},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1376,111:149,113:153,120:1724,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,241:1374,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},o($Vm5,[2,248],{234:1725,74:$VZ5,239:[1,1727]}),o($V_5,[2,242]),{146:[1,1728]},{77:[1,1729]},{77:[1,1730]},o($V_5,[2,247],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{78:[2,1051],96:1731,99:[1,1733],102:1732},{99:[1,1734]},o($Vn5,[2,235],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),o($Vn5,[2,236],{74:$V35}),o($VJ5,[2,210]),o($VJ5,[2,211]),o($VJ5,[2,1098]),o($VJ5,[2,213]),{2:$V1,3:1735,4:$V2,5:$V3,76:[1,1736]},o($VJ5,[2,218]),o($VJ5,[2,221]),{78:[1,1737]},{78:[1,1738]},o($Vs5,[2,266]),{2:$V1,3:244,4:$V2,5:$V3,199:1739},o($Vw3,[2,552]),o($Vw3,[2,1128]),{2:$V1,3:1740,4:$V2,5:$V3},{74:[1,1741]},{78:[1,1742],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($Vw3,[2,562]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1743,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{78:[1,1744],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($VY5,[2,495]),{2:$V1,3:1745,4:$V2,5:$V3},{131:$VV,196:1746},{2:$V1,3:1747,4:$V2,5:$V3},o($VP5,$VQ5,{361:1627,360:1748,367:$VR5}),o($VD3,[2,510]),o($VD3,[2,511]),o($VD3,[2,512]),o($VD3,[2,513]),o($VD3,[2,514]),{370:[1,1749]},{370:[1,1750]},o($V$5,[2,1121],{382:1751,370:[1,1752]}),{2:$V1,3:1753,4:$V2,5:$V3},{2:$V1,3:1754,4:$V2,5:$V3},o($VP5,[2,516]),o($VK,[2,1131],{411:1755,413:1756,72:$VD5}),o($VK,[2,610]),o($VK,[2,611],{367:[1,1757]}),o($VB1,[2,333]),o([78,118],[2,334],{74:$VZ5}),{74:$Vr5,78:[2,335]},o($VK,[2,719]),{2:$V1,3:1011,4:$V2,5:$V3,100:1758,111:1440},o($V75,[2,706],{74:$VT4}),o($V75,[2,704]),{77:$Ve4,143:$VY,144:979,145:$VC1,152:$V$,181:$V31,201:980,302:$Vn1,342:1759,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1011,4:$V2,5:$V3,100:1760,111:1440},{344:[1,1761]},{339:$VS5,462:1762},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1763,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{339:$VS5,462:1764},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1765,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{339:$VS5,462:1766},o($Vh4,[2,72]),{40:1767,79:75,89:$V7,164:[1,1768],184:99,189:$Vb,240:[1,1769]},{40:1770,79:75,89:$V7,184:99,189:$Vb,240:[1,1771]},{40:1772,79:75,89:$V7,184:99,189:$Vb,240:[1,1773]},o($VT5,[2,270],{246:1774,247:[1,1775]}),{248:1776,249:[2,1099],766:[1,1777]},o($VI5,[2,260],{74:$Vr5}),o($Vm5,[2,241]),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1660,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,235:1778,236:$VU5,237:$VV5,238:$VW5,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1779,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{77:[1,1780]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1660,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,233:1781,235:1656,236:$VU5,237:$VV5,238:$VW5,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1660,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,233:1782,235:1656,236:$VU5,237:$VV5,238:$VW5,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{78:[1,1783]},{78:[2,1052]},{77:[1,1784]},{77:[1,1785]},o($VJ5,[2,214]),{2:$V1,3:1786,4:$V2,5:$V3},{2:$V1,3:1787,4:$V2,5:$V3,76:[1,1788]},{2:$V1,3:1789,4:$V2,5:$V3,76:[1,1790]},o($Vw3,[2,1125],{394:1791,393:1792,77:$VX5}),{78:[1,1793]},{131:$VV,196:1794},o($Vw3,[2,556]),{78:[1,1795],99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($Vw3,[2,517]),o($VY5,[2,498]),o($VY5,[2,499]),o($VY5,[2,500]),o($V65,[2,509]),{2:$V1,3:1797,4:$V2,5:$V3,77:[2,1117],371:1796},{77:[1,1798]},{2:$V1,3:1800,4:$V2,5:$V3,77:[2,1123],383:1799},o($V$5,[2,1122]),{77:[1,1801]},{77:[1,1802]},o($VK,[2,608]),o($VK,[2,1132]),o($VP5,$VQ5,{361:1627,360:1803,367:$VR5}),{74:$V35,78:[1,1804]},o($V75,[2,713],{74:$VJ4}),{74:$V35,78:[1,1805]},o($V75,[2,715]),o($V75,[2,708]),{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,309:[1,1806],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($V75,[2,711]),{99:$VZ1,112:$V_1,114:625,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,309:[1,1807],311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,327:637,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2},o($V75,[2,709]),o($Vh4,[2,251]),{40:1808,79:75,89:$V7,184:99,189:$Vb,240:[1,1809]},{40:1810,79:75,89:$V7,184:99,189:$Vb},o($Vh4,[2,253]),{40:1811,79:75,89:$V7,184:99,189:$Vb},o($Vh4,[2,254]),{40:1812,79:75,89:$V7,184:99,189:$Vb},o($VT5,[2,268]),{131:$VV,196:1813},{249:[1,1814]},{249:[2,1100]},o($V_5,[2,243]),o($Vm5,[2,249],{114:625,327:637,99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1660,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,233:1815,235:1656,236:$VU5,237:$VV5,238:$VW5,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{74:$VZ5,78:[1,1816]},{74:$VZ5,78:[1,1817]},o($VN4,[2,1053],{97:1818,104:1819,3:1821,2:$V1,4:$V2,5:$V3,76:$V06}),{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1824,103:1822,105:1823,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1011,4:$V2,5:$V3,100:1825,111:1440},o($VJ5,[2,215]),o($Vn5,[2,173]),{2:$V1,3:1826,4:$V2,5:$V3},o($Vn5,[2,175]),{2:$V1,3:1827,4:$V2,5:$V3},o($Vw3,[2,551]),o($Vw3,[2,1126]),o($Vw3,[2,549]),{78:[1,1828]},o($Vw3,[2,563]),{77:[1,1829]},{77:[2,1118]},{2:$V1,3:1831,4:$V2,5:$V3,132:$V16,372:1830},{77:[1,1833]},{77:[2,1124]},{2:$V1,3:1011,4:$V2,5:$V3,100:1834,111:1440},{2:$V1,3:1011,4:$V2,5:$V3,100:1835,111:1440},o($VK,[2,612]),o($VK,[2,721]),{343:[1,1837],344:[1,1836]},{339:$VS5,462:1838},{335:$VG5,338:$VH5,461:1839},o($Vh4,[2,252]),{40:1840,79:75,89:$V7,184:99,189:$Vb},o($Vh4,[2,255]),o($Vh4,[2,257]),o($Vh4,[2,258]),o($VT5,[2,271]),{131:[2,1101],250:1841,645:[1,1842]},{74:$VZ5,78:[1,1843]},o($V_5,[2,245]),o($V_5,[2,246]),o($VN4,[2,74]),o($VN4,[2,1054]),{2:$V1,3:1844,4:$V2,5:$V3},o($VN4,[2,78]),{74:[1,1846],78:[1,1845]},o($V65,[2,80]),o($V65,[2,81],{114:625,327:637,76:[1,1847],99:$VZ1,112:$V_1,115:$V$1,116:$V02,123:$V12,124:$Vz3,133:$V32,136:$V42,138:$V52,139:$V62,140:$V72,141:$V82,142:$V92,154:$Va2,170:$Vb2,171:$Vc2,179:$Vd2,180:$Ve2,311:$Vf2,312:$Vg2,313:$Vh2,315:$Vi2,316:$Vj2,317:$Vk2,318:$Vl2,319:$Vm2,320:$Vn2,321:$Vo2,322:$Vp2,323:$Vq2,324:$Vr2,325:$Vs2,326:$Vt2,330:$Vu2,331:$Vv2,332:$Vw2,333:$Vx2}),{74:$V35,78:[1,1848]},o($Vn5,[2,174]),o($Vn5,[2,176]),o($Vw3,[2,553]),{2:$V1,3:1831,4:$V2,5:$V3,132:$V16,372:1849},{74:$V26,78:[1,1850]},o($V65,[2,528]),o($V65,[2,529]),{2:$V1,3:1011,4:$V2,5:$V3,100:1852,111:1440},{74:$V35,78:[1,1853]},{74:$V35,78:[1,1854]},{77:$Ve4,143:$VY,144:979,145:$VC1,152:$V$,181:$V31,201:980,302:$Vn1,342:1855,419:190,420:$Vr1,424:$Vs1},{344:[1,1856]},o($V75,[2,710]),o($V75,[2,712]),o($Vh4,[2,256]),{131:$VV,196:1857},{131:[2,1102]},o($V_5,[2,244]),o($VN4,[2,77]),{78:[2,76]},{2:$V1,3:168,4:$V2,5:$V3,56:165,77:$VU,94:1824,105:1858,111:149,113:153,131:$VV,132:$VW,137:$VX,143:$VY,144:161,145:$VZ,149:$V_,152:$V$,154:$V01,156:$VL,158:167,179:$V11,180:$V21,181:$V31,196:151,200:147,201:155,202:156,254:150,255:146,256:148,257:152,258:154,259:157,260:158,261:159,262:162,263:163,265:$V41,266:$Vc,270:$V51,271:$V61,273:$V71,280:$V81,281:$V91,282:$Va1,283:$Vb1,284:$Vc1,285:$Vd1,286:$Ve1,287:$Vf1,288:$Vg1,290:$VM,291:$VN,292:$VO,293:$VP,294:$Vh1,295:$Vi1,296:$Vj1,297:$Vk1,298:$Vl1,299:$Vm1,302:$Vn1,303:$Vo1,312:$Vp1,317:$Vq1,419:190,420:$Vr1,424:$Vs1},{2:$V1,3:1859,4:$V2,5:$V3},{78:[1,1860]},{74:$V26,78:[1,1861]},{374:[1,1862]},{2:$V1,3:1863,4:$V2,5:$V3,132:[1,1864]},{74:$V35,78:[1,1865]},o($VD3,[2,526]),o($VD3,[2,527]),o($V75,[2,714],{74:$VJ4}),o($V75,[2,716]),o($V36,[2,1103],{251:1866,766:[1,1867]}),o($V65,[2,79]),o($V65,[2,82]),o($VN4,[2,1055],{3:1821,101:1868,104:1869,2:$V1,4:$V2,5:$V3,76:$V06}),o($VD3,[2,518]),{2:$V1,3:244,4:$V2,5:$V3,199:1870},o($V65,[2,530]),o($V65,[2,531]),o($VD3,[2,525]),o($VT5,[2,1105],{252:1871,415:[1,1872]}),o($V36,[2,1104]),o($VN4,[2,75]),o($VN4,[2,1056]),o($V46,[2,1119],{375:1873,377:1874,77:[1,1875]}),o($VT5,[2,269]),o($VT5,[2,1106]),o($VD3,[2,521],{376:1876,378:1877,230:[1,1878]}),o($V46,[2,1120]),{2:$V1,3:1831,4:$V2,5:$V3,132:$V16,372:1879},o($VD3,[2,519]),{230:[1,1881],379:1880},{338:[1,1882]},{74:$V26,78:[1,1883]},o($VD3,[2,522]),{335:[1,1884]},{380:[1,1885]},o($V46,[2,520]),{380:[1,1886]},{381:[1,1887]},{381:[1,1888]},{230:[2,523]},o($VD3,[2,524])],
            defaultActions: {105:[2,6],194:[2,336],195:[2,337],196:[2,338],197:[2,339],198:[2,340],199:[2,341],200:[2,342],201:[2,343],202:[2,344],209:[2,695],591:[2,1142],653:[2,1107],654:[2,1108],710:[2,696],780:[2,1073],781:[2,1074],926:[2,446],927:[2,447],928:[2,448],987:[2,697],1288:[2,1152],1375:[2,1060],1433:[2,1150],1541:[2,507],1732:[2,1052],1777:[2,1100],1797:[2,1118],1800:[2,1124],1842:[2,1102],1845:[2,76],1887:[2,523]},
            parseError: function parseError(str, hash) {
                if (hash.recoverable) {
                    this.trace(str);
                } else {
                    var error = new Error(str);
                    error.hash = hash;
                    throw error;
                }
            },
            parse: function parse(input) {
                var self = this,
                    stack = [0],
                    tstack = [], // token stack
                    vstack = [null], // semantic value stack
                    lstack = [], // location stack
                    table = this.table,
                    yytext = '',
                    yylineno = 0,
                    yyleng = 0,
                    recovering = 0,
                    TERROR = 2,
                    EOF = 1;

                var args = lstack.slice.call(arguments, 1);

                //this.reductionCount = this.shiftCount = 0;

                var lexer = Object.create(this.lexer);
                var sharedState = { yy: {} };
                // copy state
                for (var k in this.yy) {
                    if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                        sharedState.yy[k] = this.yy[k];
                    }
                }

                lexer.setInput(input, sharedState.yy);
                sharedState.yy.lexer = lexer;
                sharedState.yy.parser = this;
                if (typeof lexer.yylloc == 'undefined') {
                    lexer.yylloc = {};
                }
                var yyloc = lexer.yylloc;
                lstack.push(yyloc);

                var ranges = lexer.options && lexer.options.ranges;

                if (typeof sharedState.yy.parseError === 'function') {
                    this.parseError = sharedState.yy.parseError;
                } else {
                    this.parseError = Object.getPrototypeOf(this).parseError;
                }

                function popStack (n) {
                    stack.length = stack.length - 2 * n;
                    vstack.length = vstack.length - n;
                    lstack.length = lstack.length - n;
                }

                _token_stack:
                    var lex = function () {
                        var token;
                        token = lexer.lex() || EOF;
                        // if token isn't its numeric value, convert
                        if (typeof token !== 'number') {
                            token = self.symbols_[token] || token;
                        }
                        return token;
                    }

                var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
                while (true) {
                    // retreive state number from top of stack
                    state = stack[stack.length - 1];

                    // use default actions if available
                    if (this.defaultActions[state]) {
                        action = this.defaultActions[state];
                    } else {
                        if (symbol === null || typeof symbol == 'undefined') {
                            symbol = lex();
                        }
                        // read action for current state and first input
                        action = table[state] && table[state][symbol];
                    }

                    _handle_error:
                        // handle parse error
                        if (typeof action === 'undefined' || !action.length || !action[0]) {
                            var error_rule_depth;
                            var errStr = '';

                            // Return the rule stack depth where the nearest error rule can be found.
                            // Return FALSE when no error recovery rule was found.
                            function locateNearestErrorRecoveryRule(state) {
                                var stack_probe = stack.length - 1;
                                var depth = 0;

                                // try to recover from error
                                for(;;) {
                                    // check for error recovery rule in this state
                                    if ((TERROR.toString()) in table[state]) {
                                        return depth;
                                    }
                                    if (state === 0 || stack_probe < 2) {
                                        return false; // No suitable error recovery rule available.
                                    }
                                    stack_probe -= 2; // popStack(1): [symbol, action]
                                    state = stack[stack_probe];
                                    ++depth;
                                }
                            }

                            if (!recovering) {
                                // first see if there's any chance at hitting an error recovery rule:
                                error_rule_depth = locateNearestErrorRecoveryRule(state);

                                // Report error
                                expected = [];
                                for (p in table[state]) {
                                    if (this.terminals_[p] && p > TERROR) {
                                        expected.push("'"+this.terminals_[p]+"'");
                                    }
                                }
                                if (lexer.showPosition) {
                                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                                } else {
                                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                        (symbol == EOF ? "end of input" :
                                            ("'"+(this.terminals_[symbol] || symbol)+"'"));
                                }
                                this.parseError(errStr, {
                                    text: lexer.match,
                                    token: this.terminals_[symbol] || symbol,
                                    line: lexer.yylineno,
                                    loc: yyloc,
                                    expected: expected,
                                    recoverable: (error_rule_depth !== false)
                                });
                            } else if (preErrorSymbol !== EOF) {
                                error_rule_depth = locateNearestErrorRecoveryRule(state);
                            }

                            // just recovered from another error
                            if (recovering == 3) {
                                if (symbol === EOF || preErrorSymbol === EOF) {
                                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                                }

                                // discard current lookahead and grab another
                                yyleng = lexer.yyleng;
                                yytext = lexer.yytext;
                                yylineno = lexer.yylineno;
                                yyloc = lexer.yylloc;
                                symbol = lex();
                            }

                            // try to recover from error
                            if (error_rule_depth === false) {
                                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
                            }
                            popStack(error_rule_depth);

                            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
                            symbol = TERROR;         // insert generic error symbol as new lookahead
                            state = stack[stack.length-1];
                            action = table[state] && table[state][TERROR];
                            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
                        }

                    // this shouldn't happen, unless resolve defaults are off
                    if (action[0] instanceof Array && action.length > 1) {
                        throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
                    }

                    switch (action[0]) {
                        case 1: // shift
                            //this.shiftCount++;

                            stack.push(symbol);
                            vstack.push(lexer.yytext);
                            lstack.push(lexer.yylloc);
                            stack.push(action[1]); // push state
                            symbol = null;
                            if (!preErrorSymbol) { // normal execution/no error
                                yyleng = lexer.yyleng;
                                yytext = lexer.yytext;
                                yylineno = lexer.yylineno;
                                yyloc = lexer.yylloc;
                                if (recovering > 0) {
                                    recovering--;
                                }
                            } else {
                                // error just occurred, resume old lookahead f/ before error
                                symbol = preErrorSymbol;
                                preErrorSymbol = null;
                            }
                            break;

                        case 2:
                            // reduce
                            //this.reductionCount++;

                            len = this.productions_[action[1]][1];

                            // perform semantic action
                            yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                            // default location, uses first token for firsts, last for lasts
                            yyval._$ = {
                                first_line: lstack[lstack.length-(len||1)].first_line,
                                last_line: lstack[lstack.length-1].last_line,
                                first_column: lstack[lstack.length-(len||1)].first_column,
                                last_column: lstack[lstack.length-1].last_column
                            };
                            if (ranges) {
                                yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                            }
                            r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                            if (typeof r !== 'undefined') {
                                return r;
                            }

                            // pop off stack
                            if (len) {
                                stack = stack.slice(0,-1*len*2);
                                vstack = vstack.slice(0, -1*len);
                                lstack = lstack.slice(0, -1*len);
                            }

                            stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            // goto new state = table[STATE][NONTERMINAL]
                            newState = table[stack[stack.length-2]][stack[stack.length-1]];
                            stack.push(newState);
                            break;

                        case 3:
                            // accept
                            return true;
                    }

                }

                return true;
            }};

// from https://www.postgresql.org/docs/current/static/sql-keywords-appendix.html
// JSON.stringify([].slice.call(document.querySelectorAll('tr')).filter(x => x.children.length == 5 && x.children[2].innerText == 'reserved').map(x => x.children[0].innerText))

        var nonReserved = ["A","ABSENT","ABSOLUTE","ACCORDING","ACTION","ADA","ADD","ADMIN","AFTER","ALWAYS","ASC","ASSERTION","ASSIGNMENT","ATTRIBUTE","ATTRIBUTES","BASE64","BEFORE","BERNOULLI","BLOCKED","BOM","BREADTH","C","CASCADE","CATALOG","CATALOG_NAME","CHAIN","CHARACTERISTICS","CHARACTERS","CHARACTER_SET_CATALOG","CHARACTER_SET_NAME","CHARACTER_SET_SCHEMA","CLASS_ORIGIN","COBOL","COLLATION","COLLATION_CATALOG","COLLATION_NAME","COLLATION_SCHEMA","COLUMNS","COLUMN_NAME","COMMAND_FUNCTION","COMMAND_FUNCTION_CODE","COMMITTED","CONDITION_NUMBER","CONNECTION","CONNECTION_NAME","CONSTRAINTS","CONSTRAINT_CATALOG","CONSTRAINT_NAME","CONSTRAINT_SCHEMA","CONSTRUCTOR","CONTENT","CONTINUE","CONTROL","CURSOR_NAME","DATA","DATETIME_INTERVAL_CODE","DATETIME_INTERVAL_PRECISION","DB","DEFAULTS","DEFERRABLE","DEFERRED","DEFINED","DEFINER","DEGREE","DEPTH","DERIVED","DESC","DESCRIPTOR","DIAGNOSTICS","DISPATCH","DOCUMENT","DOMAIN","DYNAMIC_FUNCTION","DYNAMIC_FUNCTION_CODE","EMPTY","ENCODING","ENFORCED","EXCLUDE","EXCLUDING","EXPRESSION","FILE","FINAL","FIRST","FLAG","FOLLOWING","FORTRAN","FOUND","FS","G","GENERAL","GENERATED","GO","GOTO","GRANTED","HEX","HIERARCHY","ID","IGNORE","IMMEDIATE","IMMEDIATELY","IMPLEMENTATION","INCLUDING","INCREMENT","INDENT","INITIALLY","INPUT","INSTANCE","INSTANTIABLE","INSTEAD","INTEGRITY","INVOKER","ISOLATION","K","KEY","KEY_MEMBER","KEY_TYPE","LAST","LENGTH","LEVEL","LIBRARY","LIMIT","LINK","LOCATION","LOCATOR","M","MAP","MAPPING","MATCHED","MAXVALUE","MESSAGE_LENGTH","MESSAGE_OCTET_LENGTH","MESSAGE_TEXT","MINVALUE","MORE","MUMPS","NAME","NAMES","NAMESPACE","NESTING","NEXT","NFC","NFD","NFKC","NFKD","NIL","NORMALIZED","NULLABLE","NULLS","NUMBER","OBJECT","OCTETS","OFF","OPTION","OPTIONS","ORDERING","ORDINALITY","OTHERS","OUTPUT","OVERRIDING","P","PAD","PARAMETER_MODE","PARAMETER_NAME","PARAMETER_ORDINAL_POSITION","PARAMETER_SPECIFIC_CATALOG","PARAMETER_SPECIFIC_NAME","PARAMETER_SPECIFIC_SCHEMA","PARTIAL","PASCAL","PASSING","PASSTHROUGH","PATH","PERMISSION","PLACING","PLI","PRECEDING","PRESERVE","PRIOR","PRIVILEGES","PUBLIC","READ","RECOVERY","RELATIVE","REPEATABLE","REQUIRING","RESPECT","RESTART","RESTORE","RESTRICT","RETURNED_CARDINALITY","RETURNED_LENGTH","RETURNED_OCTET_LENGTH","RETURNED_SQLSTATE","RETURNING","ROLE","ROUTINE","ROUTINE_CATALOG","ROUTINE_NAME","ROUTINE_SCHEMA","ROW_COUNT","SCALE","SCHEMA","SCHEMA_NAME","SCOPE_CATALOG","SCOPE_NAME","SCOPE_SCHEMA","SECTION","SECURITY","SELECTIVE","SELF","SEQUENCE","SERIALIZABLE","SERVER","SERVER_NAME","SESSION","SETS","SIMPLE","SIZE","SOURCE","SPACE","SPECIFIC_NAME","STANDALONE","STATE","STATEMENT","STRIP","STRUCTURE","STYLE","SUBCLASS_ORIGIN","T","TABLE_NAME","TEMPORARY","TIES","TOKEN","TOP_LEVEL_COUNT","TRANSACTION","TRANSACTIONS_COMMITTED","TRANSACTIONS_ROLLED_BACK","TRANSACTION_ACTIVE","TRANSFORM","TRANSFORMS","TRIGGER_CATALOG","TRIGGER_NAME","TRIGGER_SCHEMA","TYPE","UNBOUNDED","UNCOMMITTED","UNDER","UNLINK","UNNAMED","UNTYPED","URI","USAGE","USER_DEFINED_TYPE_CATALOG","USER_DEFINED_TYPE_CODE","USER_DEFINED_TYPE_NAME","USER_DEFINED_TYPE_SCHEMA","VALID","VERSION","VIEW","WHITESPACE","WORK","WRAPPER","WRITE","XMLDECLARATION","XMLSCHEMA","YES","ZONE"]

        parser.parseError = function(str, hash) {
            if (hash.expected && hash.expected.indexOf("'LITERAL'") > -1 && /[a-zA-Z_][a-zA-Z_0-9]*/.test(hash.token) && nonReserved.indexOf(hash.token) > -1) {
                return
            }
            throw new SyntaxError(str)
        }
        /* generated by jison-lex 0.3.4 */
        var lexer = (function(){
            var lexer = ({

                EOF:1,

                parseError:function parseError(str, hash) {
                    if (this.yy.parser) {
                        this.yy.parser.parseError(str, hash);
                    } else {
                        throw new Error(str);
                    }
                },

// resets the lexer, sets new input
                setInput:function (input, yy) {
                    this.yy = yy || this.yy || {};
                    this._input = input;
                    this._more = this._backtrack = this.done = false;
                    this.yylineno = this.yyleng = 0;
                    this.yytext = this.matched = this.match = '';
                    this.conditionStack = ['INITIAL'];
                    this.yylloc = {
                        first_line: 1,
                        first_column: 0,
                        last_line: 1,
                        last_column: 0
                    };
                    if (this.options.ranges) {
                        this.yylloc.range = [0,0];
                    }
                    this.offset = 0;
                    return this;
                },

// consumes and returns one char from the input
                input:function () {
                    var ch = this._input[0];
                    this.yytext += ch;
                    this.yyleng++;
                    this.offset++;
                    this.match += ch;
                    this.matched += ch;
                    var lines = ch.match(/(?:\r\n?|\n).*/g);
                    if (lines) {
                        this.yylineno++;
                        this.yylloc.last_line++;
                    } else {
                        this.yylloc.last_column++;
                    }
                    if (this.options.ranges) {
                        this.yylloc.range[1]++;
                    }

                    this._input = this._input.slice(1);
                    return ch;
                },

// unshifts one char (or a string) into the input
                unput:function (ch) {
                    var len = ch.length;
                    var lines = ch.split(/(?:\r\n?|\n)/g);

                    this._input = ch + this._input;
                    this.yytext = this.yytext.substr(0, this.yytext.length - len);
                    //this.yyleng -= len;
                    this.offset -= len;
                    var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                    this.match = this.match.substr(0, this.match.length - 1);
                    this.matched = this.matched.substr(0, this.matched.length - 1);

                    if (lines.length - 1) {
                        this.yylineno -= lines.length - 1;
                    }
                    var r = this.yylloc.range;

                    this.yylloc = {
                        first_line: this.yylloc.first_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.first_column,
                        last_column: lines ?
                        (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                        + oldLines[oldLines.length - lines.length].length - lines[0].length :
                        this.yylloc.first_column - len
                    };

                    if (this.options.ranges) {
                        this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                    }
                    this.yyleng = this.yytext.length;
                    return this;
                },

// When called from action, caches matched text and appends it on next action
                more:function () {
                    this._more = true;
                    return this;
                },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
                reject:function () {
                    if (this.options.backtrack_lexer) {
                        this._backtrack = true;
                    } else {
                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                            text: "",
                            token: null,
                            line: this.yylineno
                        });

                    }
                    return this;
                },

// retain first n characters of the match
                less:function (n) {
                    this.unput(this.match.slice(n));
                },

// displays already matched input, i.e. for error messages
                pastInput:function () {
                    var past = this.matched.substr(0, this.matched.length - this.match.length);
                    return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
                },

// displays upcoming input, i.e. for error messages
                upcomingInput:function () {
                    var next = this.match;
                    if (next.length < 20) {
                        next += this._input.substr(0, 20-next.length);
                    }
                    return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
                },

// displays the character position where the lexing error occurred, i.e. for error messages
                showPosition:function () {
                    var pre = this.pastInput();
                    var c = new Array(pre.length + 1).join("-");
                    return pre + this.upcomingInput() + "\n" + c + "^";
                },

// test the lexed token: return FALSE when not a match, otherwise return token
                test_match:function (match, indexed_rule) {
                    var token,
                        lines,
                        backup;

                    if (this.options.backtrack_lexer) {
                        // save context
                        backup = {
                            yylineno: this.yylineno,
                            yylloc: {
                                first_line: this.yylloc.first_line,
                                last_line: this.last_line,
                                first_column: this.yylloc.first_column,
                                last_column: this.yylloc.last_column
                            },
                            yytext: this.yytext,
                            match: this.match,
                            matches: this.matches,
                            matched: this.matched,
                            yyleng: this.yyleng,
                            offset: this.offset,
                            _more: this._more,
                            _input: this._input,
                            yy: this.yy,
                            conditionStack: this.conditionStack.slice(0),
                            done: this.done
                        };
                        if (this.options.ranges) {
                            backup.yylloc.range = this.yylloc.range.slice(0);
                        }
                    }

                    lines = match[0].match(/(?:\r\n?|\n).*/g);
                    if (lines) {
                        this.yylineno += lines.length;
                    }
                    this.yylloc = {
                        first_line: this.yylloc.last_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.last_column,
                        last_column: lines ?
                        lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                        this.yylloc.last_column + match[0].length
                    };
                    this.yytext += match[0];
                    this.match += match[0];
                    this.matches = match;
                    this.yyleng = this.yytext.length;
                    if (this.options.ranges) {
                        this.yylloc.range = [this.offset, this.offset += this.yyleng];
                    }
                    this._more = false;
                    this._backtrack = false;
                    this._input = this._input.slice(match[0].length);
                    this.matched += match[0];
                    token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                    if (this.done && this._input) {
                        this.done = false;
                    }
                    if (token) {
                        return token;
                    } else if (this._backtrack) {
                        // recover context
                        for (var k in backup) {
                            this[k] = backup[k];
                        }
                        return false; // rule action called reject() implying the next rule should be tested instead.
                    }
                    return false;
                },

// return next match in input
                next:function () {
                    if (this.done) {
                        return this.EOF;
                    }
                    if (!this._input) {
                        this.done = true;
                    }

                    var token,
                        match,
                        tempMatch,
                        index;
                    if (!this._more) {
                        this.yytext = '';
                        this.match = '';
                    }
                    var rules = this._currentRules();
                    for (var i = 0; i < rules.length; i++) {
                        tempMatch = this._input.match(this.rules[rules[i]]);
                        if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                            match = tempMatch;
                            index = i;
                            if (this.options.backtrack_lexer) {
                                token = this.test_match(tempMatch, rules[i]);
                                if (token !== false) {
                                    return token;
                                } else if (this._backtrack) {
                                    match = false;
                                    continue; // rule action called reject() implying a rule MISmatch.
                                } else {
                                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                    return false;
                                }
                            } else if (!this.options.flex) {
                                break;
                            }
                        }
                    }
                    if (match) {
                        token = this.test_match(match, rules[index]);
                        if (token !== false) {
                            return token;
                        }
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                    if (this._input === "") {
                        return this.EOF;
                    } else {
                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                            text: "",
                            token: null,
                            line: this.yylineno
                        });
                    }
                },

// return next match that has a token
                lex:function lex() {
                    var r = this.next();
                    if (r) {
                        return r;
                    } else {
                        return this.lex();
                    }
                },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
                begin:function begin(condition) {
                    this.conditionStack.push(condition);
                },

// pop the previously active lexer condition state off the condition stack
                popState:function popState() {
                    var n = this.conditionStack.length - 1;
                    if (n > 0) {
                        return this.conditionStack.pop();
                    } else {
                        return this.conditionStack[0];
                    }
                },

// produce the lexer rule set which is active for the currently active lexer condition state
                _currentRules:function _currentRules() {
                    if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                    } else {
                        return this.conditions["INITIAL"].rules;
                    }
                },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
                topState:function topState(n) {
                    n = this.conditionStack.length - 1 - Math.abs(n || 0);
                    if (n >= 0) {
                        return this.conditionStack[n];
                    } else {
                        return "INITIAL";
                    }
                },

// alias for begin(condition)
                pushState:function pushState(condition) {
                    this.begin(condition);
                },

// return the number of states currently on the stack
                stateStackSize:function stateStackSize() {
                    return this.conditionStack.length;
                },
                options: {"case-insensitive":true},
                performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
                    var YYSTATE=YY_START;
                    switch($avoiding_name_collisions) {
                        case 0:return 266
                            break;
                        case 1:return 302
                            break;
                        case 2:return 420
                            break;
                        case 3:return 299
                            break;
                        case 4:return 5
                            break;
                        case 5:return 5
                            break;
                        case 6:return 296
                            break;
                        case 7:return 296
                            break;
                        case 8:return 132
                            break;
                        case 9:return 132
                            break;
                        case 10:return /* its a COMMENT */
                            break;
                        case 11:/* skip whitespace */
                            break;
                        case 12:return 316
                            break;
                        case 13:return 319
                            break;
                        case 14:yy_.yytext = 'VALUE';return 89
                            break;
                        case 15:yy_.yytext = 'VALUE';return 189
                            break;
                        case 16:yy_.yytext = 'ROW';return 189
                            break;
                        case 17:yy_.yytext = 'COLUMN';return 189
                            break;
                        case 18:yy_.yytext = 'MATRIX';return 189
                            break;
                        case 19:yy_.yytext = 'INDEX';return 189
                            break;
                        case 20:yy_.yytext = 'RECORDSET';return 189
                            break;
                        case 21:yy_.yytext = 'TEXT';return 189
                            break;
                        case 22:yy_.yytext = 'SELECT';return 189
                            break;
                        case 23:return 520
                            break;
                        case 24:return 381
                            break;
                        case 25:return 402
                            break;
                        case 26:return 515
                            break;
                        case 27:return 287
                            break;
                        case 28:return 269
                            break;
                        case 29:return 269
                            break;
                        case 30:return 164
                            break;
                        case 31:return 400
                            break;
                        case 32:return 170
                            break;
                        case 33:return 229
                            break;
                        case 34:return 166
                            break;
                        case 35:return 207
                            break;
                        case 36:return 288
                            break;
                        case 37:return 76
                            break;
                        case 38:return 418
                            break;
                        case 39:return 242
                            break;
                        case 40:return 404
                            break;
                        case 41:return 356
                            break;
                        case 42:return 284
                            break;
                        case 43:return 514
                            break;
                        case 44:return 437
                            break;
                        case 45:return 330
                            break;
                        case 46:return 441
                            break;
                        case 47:return 331
                            break;
                        case 48:return 315
                            break;
                        case 49:return 119
                            break;
                        case 50:return 112
                            break;
                        case 51:return 315
                            break;
                        case 52:return 112
                            break;
                        case 53:return 315
                            break;
                        case 54:return 112
                            break;
                        case 55:return 315
                            break;
                        case 56:return 508
                            break;
                        case 57:return 303
                            break;
                        case 58:return 271
                            break;
                        case 59:return 368
                            break;
                        case 60:return 130
                            break;
                        case 61:return 'CLOSE'
                            break;
                        case 62:return 243
                            break;
                        case 63:return 190
                            break;
                        case 64:return 190
                            break;
                        case 65:return 434
                            break;
                        case 66:return 367
                            break;
                        case 67:return 470
                            break;
                        case 68:return 440
                            break;
                        case 69:return 273
                            break;
                        case 70:return 240
                            break;
                        case 71:return 281
                            break;
                        case 72:return 267
                            break;
                        case 73:return 206
                            break;
                        case 74:return 238
                            break;
                        case 75:return 265
                            break;
                        case 76:return 'CURSOR'
                            break;
                        case 77:return 405
                            break;
                        case 78:return 291
                            break;
                        case 79:return 292
                            break;
                        case 80:return 448
                            break;
                        case 81:return 343
                            break;
                        case 82:return 338
                            break;
                        case 83:return 'DELETED'
                            break;
                        case 84:return 242
                            break;
                        case 85:return 406
                            break;
                        case 86:return 185
                            break;
                        case 87:return 396
                            break;
                        case 88:return 447
                            break;
                        case 89:return 135
                            break;
                        case 90:return 306
                            break;
                        case 91:return 389
                            break;
                        case 92:return 310
                            break;
                        case 93:return 314
                            break;
                        case 94:return 169
                            break;
                        case 95:return 508
                            break;
                        case 96:return 508
                            break;
                        case 97:return 298
                            break;
                        case 98:return 14
                            break;
                        case 99:return 295
                            break;
                        case 100:return 249
                            break;
                        case 101:return 285
                            break;
                        case 102:return 95
                            break;
                        case 103:return 373
                            break;
                        case 104:return 183
                            break;
                        case 105:return 227
                            break;
                        case 106:return 268
                            break;
                        case 107:return 313
                            break;
                        case 108:return 602
                            break;
                        case 109:return 472
                            break;
                        case 110:return 232
                            break;
                        case 111:return 236
                            break;
                        case 112:return 239
                            break;
                        case 113:return 156
                            break;
                        case 114:return 356
                            break;
                        case 115:return 332
                            break;
                        case 116:return 99
                            break;
                        case 117:return 193
                            break;
                        case 118:return 212
                            break;
                        case 119:return 224
                            break;
                        case 120:return 516
                            break;
                        case 121:return 339
                            break;
                        case 122:return 213
                            break;
                        case 123:return 168
                            break;
                        case 124:return 293
                            break;
                        case 125:return 198
                            break;
                        case 126:return 223
                            break;
                        case 127:return 370
                            break;
                        case 128:return 286
                            break;
                        case 129:return 'LET'
                            break;
                        case 130:return 225
                            break;
                        case 131:return 112
                            break;
                        case 132:return 245
                            break;
                        case 133:return 460
                            break;
                        case 134:return 191
                            break;
                        case 135:return 283
                            break;
                        case 136:return 390
                            break;
                        case 137:return 282
                            break;
                        case 138:return 452
                            break;
                        case 139:return 169
                            break;
                        case 140:return 403
                            break;
                        case 141:return 222
                            break;
                        case 142:return 645
                            break;
                        case 143:return 270
                            break;
                        case 144:return 244
                            break;
                        case 145:return 380
                            break;
                        case 146:return 154
                            break;
                        case 147:return 297
                            break;
                        case 148:return 433
                            break;
                        case 149:return 230
                            break;
                        case 150:return 415
                            break;
                        case 151:return 129
                            break;
                        case 152:return 247
                            break;
                        case 153:return 'OPEN'
                            break;
                        case 154:return 416
                            break;
                        case 155:return 171
                            break;
                        case 156:return 118
                            break;
                        case 157:return 208
                            break;
                        case 158:return 276
                            break;
                        case 159:return 172
                            break;
                        case 160:return 279
                            break;
                        case 161:return 765
                            break;
                        case 162:return 93
                            break;
                        case 163:return 16
                            break;
                        case 164:return 369
                            break;
                        case 165:return 442
                            break;
                        case 166:return 678
                            break;
                        case 167:return 15
                            break;
                        case 168:return 414
                            break;
                        case 169:return 194
                            break;
                        case 170:return 'REDUCE'
                            break;
                        case 171:return 374
                            break;
                        case 172:return 311
                            break;
                        case 173:return 517
                            break;
                        case 174:return 682
                            break;
                        case 175:return 107
                            break;
                        case 176:return 401
                            break;
                        case 177:return 175
                            break;
                        case 178:return 290
                            break;
                        case 179:return 443
                            break;
                        case 180:return 687
                            break;
                        case 181:return 173
                            break;
                        case 182:return 173
                            break;
                        case 183:return 226
                            break;
                        case 184:return 436
                            break;
                        case 185:return 237
                            break;
                        case 186:return 150
                            break;
                        case 187:return 766
                            break;
                        case 188:return 405
                            break;
                        case 189:return 89
                            break;
                        case 190:return 228
                            break;
                        case 191:return 146
                            break;
                        case 192:return 146
                            break;
                        case 193:return 409
                            break;
                        case 194:return 334
                            break;
                        case 195:return 417
                            break;
                        case 196:return 'STRATEGY'
                            break;
                        case 197:return 'STORE'
                            break;
                        case 198:return 280
                            break;
                        case 199:return 353
                            break;
                        case 200:return 353
                            break;
                        case 201:return 463
                            break;
                        case 202:return 357
                            break;
                        case 203:return 357
                            break;
                        case 204:return 192
                            break;
                        case 205:return 309
                            break;
                        case 206:return 'TIMEOUT'
                            break;
                        case 207:return 148
                            break;
                        case 208:return 195
                            break;
                        case 209:return 435
                            break;
                        case 210:return 435
                            break;
                        case 211:return 509
                            break;
                        case 212:return 294
                            break;
                        case 213:return 451
                            break;
                        case 214:return 162
                            break;
                        case 215:return 187
                            break;
                        case 216:return 98
                            break;
                        case 217:return 335
                            break;
                        case 218:return 408
                            break;
                        case 219:return 231
                            break;
                        case 220:return 149
                            break;
                        case 221:return 344
                            break;
                        case 222:return 134
                            break;
                        case 223:return 410
                            break;
                        case 224:return 308
                            break;
                        case 225:return 128
                            break;
                        case 226:return 439
                            break;
                        case 227:return 72
                            break;
                        case 228:return 435  /* Is this keyword required? */
                            break;
                        case 229:return 131
                            break;
                        case 230:return 131
                            break;
                        case 231:return 115
                            break;
                        case 232:return 137
                            break;
                        case 233:return 179
                            break;
                        case 234:return 317
                            break;
                        case 235:return 180
                            break;
                        case 236:return 133
                            break;
                        case 237:return 138
                            break;
                        case 238:return 326
                            break;
                        case 239:return 323
                            break;
                        case 240:return 325
                            break;
                        case 241:return 322
                            break;
                        case 242:return 320
                            break;
                        case 243:return 318
                            break;
                        case 244:return 319
                            break;
                        case 245:return 142
                            break;
                        case 246:return 141
                            break;
                        case 247:return 139
                            break;
                        case 248:return 321
                            break;
                        case 249:return 324
                            break;
                        case 250:return 140
                            break;
                        case 251:return 124
                            break;
                        case 252:return 324
                            break;
                        case 253:return 77
                            break;
                        case 254:return 78
                            break;
                        case 255:return 145
                            break;
                        case 256:return 424
                            break;
                        case 257:return 426
                            break;
                        case 258:return 300
                            break;
                        case 259:return 505
                            break;
                        case 260:return 507
                            break;
                        case 261:return 122
                            break;
                        case 262:return 116
                            break;
                        case 263:return 74
                            break;
                        case 264:return 333
                            break;
                        case 265:return 152
                            break;
                        case 266:return 764
                            break;
                        case 267:return 143
                            break;
                        case 268:return 181
                            break;
                        case 269:return 136
                            break;
                        case 270:return 123
                            break;
                        case 271:return 312
                            break;
                        case 272:return 4
                            break;
                        case 273:return 10
                            break;
                        case 274:return 'INVALID'
                            break;
                    }
                },
                rules: [/^(?:``([^\`])+``)/i,/^(?:\[\?\])/i,/^(?:@\[)/i,/^(?:ARRAY\[)/i,/^(?:\[([^\]])*?\])/i,/^(?:`([^\`])*?`)/i,/^(?:N(['](\\.|[^']|\\')*?['])+)/i,/^(?:X(['](\\.|[^']|\\')*?['])+)/i,/^(?:(['](\\.|[^']|\\')*?['])+)/i,/^(?:(["](\\.|[^"]|\\")*?["])+)/i,/^(?:--(.*?)($|\r\n|\r|\n))/i,/^(?:\s+)/i,/^(?:\|\|)/i,/^(?:\|)/i,/^(?:VALUE\s+OF\s+SEARCH\b)/i,/^(?:VALUE\s+OF\s+SELECT\b)/i,/^(?:ROW\s+OF\s+SELECT\b)/i,/^(?:COLUMN\s+OF\s+SELECT\b)/i,/^(?:MATRIX\s+OF\s+SELECT\b)/i,/^(?:INDEX\s+OF\s+SELECT\b)/i,/^(?:RECORDSET\s+OF\s+SELECT\b)/i,/^(?:TEXT\s+OF\s+SELECT\b)/i,/^(?:SELECT\b)/i,/^(?:ABSOLUTE\b)/i,/^(?:ACTION\b)/i,/^(?:ADD\b)/i,/^(?:AFTER\b)/i,/^(?:AGGR\b)/i,/^(?:AGGREGATE\b)/i,/^(?:AGGREGATOR\b)/i,/^(?:ALL\b)/i,/^(?:ALTER\b)/i,/^(?:AND\b)/i,/^(?:ANTI\b)/i,/^(?:ANY\b)/i,/^(?:APPLY\b)/i,/^(?:ARRAY\b)/i,/^(?:AS\b)/i,/^(?:ASSERT\b)/i,/^(?:ASC\b)/i,/^(?:ATTACH\b)/i,/^(?:AUTO(_)?INCREMENT\b)/i,/^(?:AVG\b)/i,/^(?:BEFORE\b)/i,/^(?:BEGIN\b)/i,/^(?:BETWEEN\b)/i,/^(?:BREAK\b)/i,/^(?:NOT\s+BETWEEN\b)/i,/^(?:NOT\s+LIKE\b)/i,/^(?:BY\b)/i,/^(?:~~\*)/i,/^(?:!~~\*)/i,/^(?:~~)/i,/^(?:!~~)/i,/^(?:ILIKE\b)/i,/^(?:NOT\s+ILIKE\b)/i,/^(?:CALL\b)/i,/^(?:CASE\b)/i,/^(?:CAST\b)/i,/^(?:CHECK\b)/i,/^(?:CLASS\b)/i,/^(?:CLOSE\b)/i,/^(?:COLLATE\b)/i,/^(?:COLUMN\b)/i,/^(?:COLUMNS\b)/i,/^(?:COMMIT\b)/i,/^(?:CONSTRAINT\b)/i,/^(?:CONTENT\b)/i,/^(?:CONTINUE\b)/i,/^(?:CONVERT\b)/i,/^(?:CORRESPONDING\b)/i,/^(?:COUNT\b)/i,/^(?:CREATE\b)/i,/^(?:CROSS\b)/i,/^(?:CUBE\b)/i,/^(?:CURRENT_TIMESTAMP\b)/i,/^(?:CURSOR\b)/i,/^(?:DATABASE(S)?)/i,/^(?:DATEADD\b)/i,/^(?:DATEDIFF\b)/i,/^(?:DECLARE\b)/i,/^(?:DEFAULT\b)/i,/^(?:DELETE\b)/i,/^(?:DELETED\b)/i,/^(?:DESC\b)/i,/^(?:DETACH\b)/i,/^(?:DISTINCT\b)/i,/^(?:DROP\b)/i,/^(?:ECHO\b)/i,/^(?:EDGE\b)/i,/^(?:END\b)/i,/^(?:ENUM\b)/i,/^(?:ELSE\b)/i,/^(?:ESCAPE\b)/i,/^(?:EXCEPT\b)/i,/^(?:EXEC\b)/i,/^(?:EXECUTE\b)/i,/^(?:EXISTS\b)/i,/^(?:EXPLAIN\b)/i,/^(?:FALSE\b)/i,/^(?:FETCH\b)/i,/^(?:FIRST\b)/i,/^(?:FOR\b)/i,/^(?:FOREIGN\b)/i,/^(?:FROM\b)/i,/^(?:FULL\b)/i,/^(?:FUNCTION\b)/i,/^(?:GLOB\b)/i,/^(?:GO\b)/i,/^(?:GRAPH\b)/i,/^(?:GROUP\b)/i,/^(?:GROUPING\b)/i,/^(?:HAVING\b)/i,/^(?:IF\b)/i,/^(?:IDENTITY\b)/i,/^(?:IS\b)/i,/^(?:IN\b)/i,/^(?:INDEX\b)/i,/^(?:INDEXED\b)/i,/^(?:INNER\b)/i,/^(?:INSTEAD\b)/i,/^(?:INSERT\b)/i,/^(?:INSERTED\b)/i,/^(?:INTERSECT\b)/i,/^(?:INTERVAL\b)/i,/^(?:INTO\b)/i,/^(?:JOIN\b)/i,/^(?:KEY\b)/i,/^(?:LAST\b)/i,/^(?:LET\b)/i,/^(?:LEFT\b)/i,/^(?:LIKE\b)/i,/^(?:LIMIT\b)/i,/^(?:MATCHED\b)/i,/^(?:MATRIX\b)/i,/^(?:MAX(\s+)?(?=\())/i,/^(?:MAX(\s+)?(?=(,|\))))/i,/^(?:MIN(\s+)?(?=\())/i,/^(?:MERGE\b)/i,/^(?:MINUS\b)/i,/^(?:MODIFY\b)/i,/^(?:NATURAL\b)/i,/^(?:NEXT\b)/i,/^(?:NEW\b)/i,/^(?:NOCASE\b)/i,/^(?:NO\b)/i,/^(?:NOT\b)/i,/^(?:NULL\b)/i,/^(?:OFF\b)/i,/^(?:ON\b)/i,/^(?:ONLY\b)/i,/^(?:OF\b)/i,/^(?:OFFSET\b)/i,/^(?:OPEN\b)/i,/^(?:OPTION\b)/i,/^(?:OR\b)/i,/^(?:ORDER\b)/i,/^(?:OUTER\b)/i,/^(?:OVER\b)/i,/^(?:PATH\b)/i,/^(?:PARTITION\b)/i,/^(?:PERCENT\b)/i,/^(?:PIVOT\b)/i,/^(?:PLAN\b)/i,/^(?:PRIMARY\b)/i,/^(?:PRINT\b)/i,/^(?:PRIOR\b)/i,/^(?:QUERY\b)/i,/^(?:READ\b)/i,/^(?:RECORDSET\b)/i,/^(?:REDUCE\b)/i,/^(?:REFERENCES\b)/i,/^(?:REGEXP\b)/i,/^(?:REINDEX\b)/i,/^(?:RELATIVE\b)/i,/^(?:REMOVE\b)/i,/^(?:RENAME\b)/i,/^(?:REPEAT\b)/i,/^(?:REPLACE\b)/i,/^(?:REQUIRE\b)/i,/^(?:RESTORE\b)/i,/^(?:RETURN\b)/i,/^(?:RETURNS\b)/i,/^(?:RIGHT\b)/i,/^(?:ROLLBACK\b)/i,/^(?:ROLLUP\b)/i,/^(?:ROW\b)/i,/^(?:ROWS\b)/i,/^(?:SCHEMA(S)?)/i,/^(?:SEARCH\b)/i,/^(?:SEMI\b)/i,/^(?:SET\b)/i,/^(?:SETS\b)/i,/^(?:SHOW\b)/i,/^(?:SOME\b)/i,/^(?:SOURCE\b)/i,/^(?:STRATEGY\b)/i,/^(?:STORE\b)/i,/^(?:SUM\b)/i,/^(?:TABLE\b)/i,/^(?:TABLES\b)/i,/^(?:TARGET\b)/i,/^(?:TEMP\b)/i,/^(?:TEMPORARY\b)/i,/^(?:TEXTSTRING\b)/i,/^(?:THEN\b)/i,/^(?:TIMEOUT\b)/i,/^(?:TO\b)/i,/^(?:TOP\b)/i,/^(?:TRAN\b)/i,/^(?:TRANSACTION\b)/i,/^(?:TRIGGER\b)/i,/^(?:TRUE\b)/i,/^(?:TRUNCATE\b)/i,/^(?:UNION\b)/i,/^(?:UNIQUE\b)/i,/^(?:UNPIVOT\b)/i,/^(?:UPDATE\b)/i,/^(?:USE\b)/i,/^(?:USING\b)/i,/^(?:VALUE\b)/i,/^(?:VALUES\b)/i,/^(?:VERTEX\b)/i,/^(?:VIEW\b)/i,/^(?:WHEN\b)/i,/^(?:WHERE\b)/i,/^(?:WHILE\b)/i,/^(?:WITH\b)/i,/^(?:WORK\b)/i,/^(?:(\d*[.])?\d+[eE]\d+)/i,/^(?:(\d*[.])?\d+)/i,/^(?:->)/i,/^(?:#)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:!===)/i,/^(?:===)/i,/^(?:!==)/i,/^(?:==)/i,/^(?:>=)/i,/^(?:&)/i,/^(?:\|)/i,/^(?:<<)/i,/^(?:>>)/i,/^(?:>)/i,/^(?:<=)/i,/^(?:<>)/i,/^(?:<)/i,/^(?:=)/i,/^(?:!=)/i,/^(?:\()/i,/^(?:\))/i,/^(?:@)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\])/i,/^(?::-)/i,/^(?:\?-)/i,/^(?:\.\.)/i,/^(?:\.)/i,/^(?:,)/i,/^(?:::)/i,/^(?::)/i,/^(?:;)/i,/^(?:\$)/i,/^(?:\?)/i,/^(?:!)/i,/^(?:\^)/i,/^(?:~)/i,/^(?:[a-zA-Z_][a-zA-Z_0-9]*)/i,/^(?:$)/i,/^(?:.)/i],
                conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274],"inclusive":true}}
            });
            return lexer;
        })();
        parser.lexer = lexer;
        function Parser () {
            this.yy = {};
        }
        Parser.prototype = parser;parser.Parser = Parser;
        return new Parser;
    })();

    if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
        exports.parser = alasqlparser;
        exports.Parser = alasqlparser.Parser;
        exports.parse = function () { return alasqlparser.parse.apply(alasqlparser, arguments); };
        exports.main = function commonjsMain(args) {
            if (!args[1]) {
                console.log('Usage: '+args[0]+' FILE');
                process.exit(1);
            }
            var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
            return exports.parser.parse(source);
        };
        if (typeof module !== 'undefined' && require.main === module) {
            exports.main(process.argv.slice(1));
        }
    }
    /**
     12prettyflag.js - prettify
     @todo move this functionality to plugin
     */

    /**
     Pretty flag - nice HTML output or standard text without any tags
     @type {boolean}
     */

    alasql.prettyflag = false;

    /**
     Pretty output of SQL functions
     @function
     @param {string} sql SQL statement
     @param {boolean} flag value
     @return {string} HTML or text string with pretty output
     */

    alasql.pretty = function(sql, flag) {
        var pf = alasql.prettyflag;
        alasql.prettyflag = !flag;
        var s = alasql.parse(sql).toString();
        alasql.prettyflag = pf;
        return s;
    };

    /*jshint unused:false*/
    /*
     Utilities for Alasql.js

     @todo Review the list of utilities
     @todo Find more effective utilities
     */

    /**
     Alasql utility functions
     @type {object}
     */
    var utils = (alasql.utils = {});

    /**
     Convert NaN to undefined
     @function
     @param {string} s JavaScript string to be modified
     @return {string} Covered expression

     @example

     123         => 123
     undefined   => undefined
     NaN         => undefined

     */
    function n2u(s) {
        return '(y=' + s + ',y===y?y:undefined)';
    }

    /**
     Return undefined if s undefined
     @param {string} s JavaScript string to be modified
     @return {string} Covered expression

     @example

     123,a       => a
     undefined,a => undefined
     NaN,a       => undefined

     */
    function und(s, r) {
        return '(y=' + s + ',typeof y=="undefined"?undefined:' + r + ')';
    }

    /**
     Return always true. Stub for non-ecisting WHERE clause, because is faster then if(whenrfn) whenfn()
     @function
     @return {boolean} Always true
     */
    function returnTrue() {
        return true;
    }

    /**
     Return undefined. Stub for non-ecisting WHERE clause, because is faster then if(whenrfn) whenfn()
     @function
     @return {undefined} Always undefined
     */
    function returnUndefined() {}

    /**
     Escape string
     @function
     @param {string} s Source string
     @return {string} Escaped string
     @example

     Pit\er's => Pit\\er\'s

     */
// based on joliss/js-string-escape
    var escapeq = (utils.escapeq = function(s) {

        return ('' + s).replace(/["'\\\n\r\u2028\u2029]/g, function(character) {
            // Escape all characters not included in SingleStringCharacters and
            // DoubleStringCharacters on
            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
            switch (character) {
                case '"':
                case "'":
                case '\\':
                    // return '\\' + character;
                    return character;
                // Four possible LineTerminator characters need to be escaped:
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                case '\u2028':
                    return '\\u2028';
                case '\u2029':
                    return '\\u2029';
            }
        });
    });

    /**
     Double quotes for SQL statements
     @param {string} s Source string
     @return {string} Escaped string

     @example

     Piter's => Piter''s

     */
    var escapeqq = (utils.undoubleq = function(s) {
        return s.replace(/(\')/g, "''");
    });

    /**
     Replace double quotes with single quote
     @param {string} s Source string
     @return {string} Replaced string
     @example

     Piter''s => Piter's

     */
    var doubleq = (utils.doubleq = function(s) {
        return s.replace(/(\'\')/g, "\\'");
    });

    /**
     Replace sigle quote to escaped single quote
     @param {string} s Source string
     @return {string} Replaced string

     @todo Chack this functions

     */
    var doubleqq = (utils.doubleqq = function(s) {
        return s.replace(/\'/g, "'");
    });

    /**
     Cut BOM first character for UTF-8 files (for merging two files)
     @param {string} s Source string
     @return {string} Replaced string
     */

    var cutbom = function(s) {
        if (s[0] === String.fromCharCode(65279)) {
            s = s.substr(1);
        }
        return s;
    };

    /**
     Get the global scope
     Inspired by System.global
     @return {object} The global scope
     */
    utils.global = (function() {
        if (typeof self !== 'undefined') {
            return self;
        }
        if (typeof window !== 'undefined') {
            return window;
        }
        if (typeof global !== 'undefined') {
            return global;
        }
        return Function('return this')();
    })();

    /**
     Find out if a function is native to the enviroment
     @param {function} Function to check
     @return {boolean} True if function is native
     */
    var isNativeFunction = (utils.isNativeFunction = function(fn) {
        return typeof fn === 'function' && !!~fn.toString().indexOf('[native code]');
    });

    /**
     Find out if code is running in a web worker enviroment
     @return {boolean} True if code is running in a web worker enviroment
     */
    utils.isWebWorker = (function() {
        try {
            var importScripts = utils.global.importScripts;
            return utils.isNativeFunction(importScripts);
        } catch (e) {
            return false;
        }
    })();

    /**
     Find out if code is running in a node enviroment
     @return {boolean} True if code is running in a node enviroment
     */
    utils.isNode = (function() {
        try {
            return utils.isNativeFunction(utils.global.process.reallyExit);
        } catch (e) {
            return false;
        }
    })();

    /**
     Find out if code is running in a browser enviroment
     @return {boolean} True if code is running in a browser enviroment
     */
    utils.isBrowser = (function() {
        try {
            return utils.isNativeFunction(utils.global.location.reload);
        } catch (e) {
            return false;
        }
    })();

    /**
     Find out if code is running in a browser with a browserify setup
     @return {boolean} True if code is running in a browser with a browserify setup
     */
    utils.isBrowserify = (function() {
        return utils.isBrowser && typeof process !== 'undefined' && process.browser;
    })();

    /**
     Find out if code is running in a browser with a requireJS setup
     @return {boolean} True if code is running in a browser with a requireJS setup
     */
    utils.isRequireJS = (function() {
        return (
            utils.isBrowser && typeof require === 'function' && typeof require.specified === 'function'
        );
    })();

    /**
     Find out if code is running with Meteor in the enviroment
     @return {boolean} True if code is running with Meteor in the enviroment

     @todo Find out if this is the best way to do this
     */
    utils.isMeteor = (function() {
        return typeof Meteor !== 'undefined' && Meteor.release;
    })();

    /**
     Find out if code is running on a Meteor client
     @return {boolean} True if code is running on a Meteor client
     */
    utils.isMeteorClient = utils.isMeteorClient = (function() {
        return utils.isMeteor && Meteor.isClient;
    })();

    /**
     Find out if code is running on a Meteor server
     @return {boolean} True if code is running on a Meteor server
     */
    utils.isMeteorServer = (function() {
        return utils.isMeteor && Meteor.isServer;
    })();

    /**
     Find out code is running in a cordovar enviroment
     @return {boolean} True if code is running in a web worker enviroment

     @todo Find out if this is the best way to do this
     */
    utils.isCordova = (function() {
        return typeof cordova === 'object';
    })();

    utils.isReactNative = (function() {
        var isReact = false;
        /*not-for-browser/*
         try {
         if (typeof require('react-native') === 'object') {
         isReact = true;
         }
         } catch (e) {
         void 0;
         }
         //*/
        return isReact;
    })();

    utils.hasIndexedDB = (function() {
        return !!utils.global.indexedDB;
    })();

    utils.isArray = function(obj) {
        return '[object Array]' === Object.prototype.toString.call(obj);
    };
    /**
     Load text file from anywhere
     @param {string|object} path File path or HTML event
     @param {boolean} asy True - async call, false - sync call
     @param {function} success Success function
     @param {function} error Error function
     @return {string} Read data

     @todo Define Event type
     @todo Smaller if-else structures.
     */
    var loadFile = (utils.loadFile = function(path, asy, success, error) {
        var data, fs;
        if (utils.isNode || utils.isMeteorServer) {
            /*not-for-browser/*
             fs = require('fs');

             // If path is empty, than read data from stdin (for Node)
             if (typeof path === 'undefined') {
             var buff = '';
             process.stdin.setEncoding('utf8');
             process.stdin.on('readable', function() {
             var chunk = process.stdin.read();
             if (chunk !== null) {
             buff += chunk.toString();
             }
             });
             process.stdin.on('end', function() {
             success(cutbom(buff));
             });
             } else {
             if (/^[a-z]+:\/\//i.test(path)) {
             var request = require('request');
             request(path, function(err, response, body) {
             if (err) {
             return error(err, null);
             }
             success(cutbom(body.toString()));
             });
             } else {
             //If async callthen call async
             if (asy) {
             fs.readFile(path, function(err, data) {
             if (err) {
             return error(err, null);
             }
             success(cutbom(data.toString()));
             });
             } else {
             // Call sync version
             try {
             data = fs.readFileSync(path);
             } catch (e) {
             return error(err, null);
             }
             success(cutbom(data.toString()));
             }
             }
             }
             } else if (utils.isReactNative) {
             // If ReactNative
             var RNFS = require('react-native-fs');
             RNFS.readFile(path, 'utf8')
             .then(function(contents) {
             success(cutbom(contents));
             })["catch"](function(err) {
             return error(err, null);
             });
             //*/
        } else if (utils.isCordova) {
            /* If Cordova */
            utils.global.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                fileSystem.root.getFile(path, {create: false}, function(fileEntry) {
                    fileEntry.file(function(file) {
                        var fileReader = new FileReader();
                        fileReader.onloadend = function(e) {
                            success(cutbom(this.result));
                        };
                        fileReader.readAsText(file);
                    });
                });
            });

            /** @todo Check eliminated code below */

        } else {
            /* For string */
            if (typeof path === 'string') {
                // For browser read from tag
                /*
                 SELECT * FROM TXT('#one') -- read data from HTML element with id="one"
                 */
                if (path.substr(0, 1) === '#' && typeof document !== 'undefined') {
                    data = document.querySelector(path).textContent;
                    success(data);
                } else {
                    /*
                     Simply read file from HTTP request, like:
                     SELECT * FROM TXT('http://alasql.org/README.md');
                     */
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                if (success) {
                                    success(cutbom(xhr.responseText));
                                }
                            } else if (error) {
                                return error(xhr);
                            }
                            // Todo: else...?
                        }
                    };
                    xhr.open('GET', path, asy); // Async
                    xhr.responseType = 'text';
                    xhr.send();
                }
            } else if (path instanceof Event) {
                /*
                 For browser read from files input element
                 <input type="files" onchange="readFile(event)">
                 <script>
                 function readFile(event) {
                 alasql('SELECT * FROM TXT(?)',[event])
                 }
                 </script>
                 */
                /** @type {array} List of files from <input> element */
                var files = path.target.files;
                /** type {object} */
                var reader = new FileReader();
                /** type {string} */
                var name = files[0].name;
                reader.onload = function(e) {
                    var data = e.target.result;
                    success(cutbom(data));
                };
                reader.readAsText(files[0]);
            }
        }
    });

    /**
     @function Load binary file from anywhere
     @param {string} path File path
     @param {boolean} asy True - async call, false - sync call
     @param {function} success Success function
     @param {function} error Error function
     @return 1 for Async, data - for sync version

     @todo merge functionality from loadFile and LoadBinaryFile
     */

    var loadBinaryFile = (utils.loadBinaryFile = function(path, asy, success, error) {
        var fs;
        if (utils.isNode || utils.isMeteorServer) {
            /*not-for-browser/*
             fs = require('fs');

             if (/^[a-z]+:\/\//i.test(path)) {
             var request = require('request');
             request({url: path, encoding: null}, function(err, response, data) {
             if (err) {
             throw err;
             }
             var arr = [];
             for (var i = 0; i < data.length; ++i) {
             arr[i] = String.fromCharCode(data[i]);
             }
             success(arr.join(''));
             });
             } else {
             if (asy) {
             fs.readFile(path, function(err, data) {
             if (err) {
             throw err;
             }
             var arr = [];
             for (var i = 0; i < data.length; ++i) {
             arr[i] = String.fromCharCode(data[i]);
             }
             success(arr.join(''));
             });
             } else {
             var data = fs.readFileSync(path);
             var arr = [];
             for (var i = 0; i < data.length; ++i) {
             arr[i] = String.fromCharCode(data[i]);
             }
             success(arr.join(''));
             }
             }
             } else if (utils.isReactNative) {
             // If ReactNative
             //var RNFS = require('react-native-fs');
             var RNFetchBlob = require('react-native-fetch-blob')["default"];
             var dirs = RNFetchBlob.fs.dirs;
             //should use readStream instead if the file is large
             RNFetchBlob.fs.readFile(path, 'base64').then(function(data) {
             //RNFetchBlob.base64.decode(data) //need more test on excel
             success(data);
             });
             //*/
        } else {
            if (typeof path === 'string') {
                // For browser
                var xhr = new XMLHttpRequest();
                xhr.open('GET', path, asy); // Async
                xhr.responseType = 'arraybuffer';
                xhr.onload = function() {
                    var data = new Uint8Array(xhr.response);
                    var arr = [];
                    for (var i = 0; i < data.length; ++i) {
                        arr[i] = String.fromCharCode(data[i]);
                    }
                    success(arr.join(''));
                };
                // xhr.responseType = "blob";
                xhr.send();
            } else if (path instanceof Event) {

                var files = path.target.files;
                var reader = new FileReader();
                var name = files[0].name;
                reader.onload = function(e) {
                    var data = e.target.result;
                    success(data);
                };
                reader.readAsArrayBuffer(files[0]);
            } else if (path instanceof Blob) {
                success(path);
            }
        }
    });

    var removeFile = (utils.removeFile = function(path, cb) {
        if (utils.isNode) {
            /*not-for-browser/*
             var fs = require('fs');
             fs.remove(path, cb);
             } else if (utils.isCordova) {
             utils.global.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
             fileSystem.root.getFile(
             path,
             {create: false},
             function(fileEntry) {
             fileEntry.remove(cb);
             cb && cb(); // jshint ignore:line
             },
             function() {
             cb && cb(); // jshint ignore:line
             }
             );
             });
             } else if (utils.isReactNative) {
             // If ReactNative
             var RNFS = require('react-native-fs');
             RNFS.unlink(path)
             .then(function() {
             cb && cb();
             })["catch"](function(err) {
             throw err;
             });
             //*/
        } else {
            throw new Error('You can remove files only in Node.js and Apache Cordova');
        }
    });

// Todo: check if it makes sense to support cordova and Meteor server
    var deleteFile = (utils.deleteFile = function(path, cb) {
        /*not-for-browser/*
         if (utils.isNode) {
         var fs = require('fs');
         fs.unlink(path, cb);
         } else if (utils.isReactNative) {
         // If ReactNative
         var RNFS = require('react-native-fs');
         RNFS.unlink(path)
         .then(function() {
         cb && cb();
         })["catch"](function(err) {
         throw err;
         });
         }
         //*/
    });

    utils.autoExtFilename = function(filename, ext, config) {
        config = config || {};
        if (
            typeof filename !== 'string' ||
            filename.match(/^[A-z]+:\/\/|\n|\..{2,4}$/) ||
            config.autoExt === 0 ||
            config.autoExt === false
        ) {
            return filename;
        }
        return filename + '.' + ext;
    };

    var fileExists = (utils.fileExists = function(path, cb) {
        if (utils.isNode) {
            /*not-for-browser/*
             var fs = require('fs');
             fs.exists(path, cb);
             } else if (utils.isCordova) {
             utils.global.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
             fileSystem.root.getFile(
             path,
             {create: false},
             function(fileEntry) {
             cb(true);
             },
             function() {
             cb(false);
             }
             );
             });
             } else if (utils.isReactNative) {
             // If ReactNative
             var RNFS = require('react-native-fs');
             RNFS.exists(path)
             .then(function(yes) {
             cb && cb(yes);
             })["catch"](function(err) {
             throw err;
             });
             //*/
        } else {
            // TODO Cordova, etc.
            throw new Error('You can use exists() only in Node.js or Apach Cordova');
        }
    });

    /**
     Save text file from anywhere
     @param {string} path File path
     @param {array} data Data object
     @param {function} cb Callback
     @param {object=} opts
     */

    var saveFile = (utils.saveFile = function(path, data, cb, opts) {
        var res = 1;
        if (path === undefined) {
            //
            // Return data into result variable
            // like: alasql('SELECT * INTO TXT() FROM ?',[data]);
            //
            res = data;
            if (cb) {
                res = cb(res);
            }
        } else {
            if (utils.isNode) {
                /*not-for-browser/*
                 var fs = require('fs');
                 data = fs.writeFileSync(path, data);
                 if (cb) {
                 res = cb(res);
                 }
                 } else if (utils.isReactNative) {
                 var RNFS = require('react-native-fs');
                 RNFS.writeFile(path, data)
                 .then(function(success) {
                 //, 'utf8'
                 if (cb) res = cb(res);
                 })["catch"](function(err) {
                 console.error(err.message);
                 });
                 } else if (utils.isCordova) {
                 utils.global.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                 //                alasql.utils.removeFile(path,function(){
                 fileSystem.root.getFile(path, {create: true}, function(fileEntry) {
                 fileEntry.createWriter(function(fileWriter) {
                 fileWriter.onwriteend = function() {
                 if (cb) {
                 res = cb(res);
                 }
                 };
                 fileWriter.write(data);
                 });
                 });
                 });
                 //*/

                //                     });
                //                });
                //            });
            } else {
                if (isIE() === 9) {
                    // Solution was taken from
                    // http://megatuto.com/formation-JAVASCRIPT.php?JAVASCRIPT_Example=Javascript+Save+CSV+file+in+IE+8/IE+9+without+using+window.open()+Categorie+javascript+internet-explorer-8&category=&article=7993
                    //				var URI = 'data:text/plain;charset=utf-8,';

                    // Prepare data
                    var ndata = data.replace(/\r\n/g, '&#A;&#D;');
                    ndata = ndata.replace(/\n/g, '&#D;');
                    ndata = ndata.replace(/\t/g, '&#9;');
                    var testlink = utils.global.open('about:blank', '_blank');
                    testlink.document.write(ndata); //fileData has contents for the file
                    testlink.document.close();
                    testlink.document.execCommand('SaveAs', false, path);
                    testlink.close();
                } else {
                    var opt = {
                        disableAutoBom: false,
                    };
                    alasql.utils.extend(opt, opts);
                    var blob = new Blob([data], {type: 'text/plain;charset=utf-8'});
                    saveAs(blob, path, opt.disableAutoBom);
                    if (cb) {
                        res = cb(res);
                    }
                }
            }
        }

        return res;
    });

    /**
     @function Is this IE9
     @return {boolean} True for IE9 and false for other browsers

     For IE9 compatibility issues
     */
    function isIE() {
        var myNav = navigator.userAgent.toLowerCase();
        return myNav.indexOf('msie') !== -1 ? parseInt(myNav.split('msie')[1]) : false;
    }

    /**
     @function Hash a string to signed integer
     @param {string} source string
     @return {integer} hash number
     */

// FNV-1a inspired hashing
    var hash = (utils.hash = function(str) {
        var hash = 0x811c9dc5,
            i = str.length;
        while (i) {
            hash ^= str.charCodeAt(--i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return hash;
    });

    /**
     Union arrays
     @function
     @param {array} a
     @param {array} b
     @return {array}
     */
    var arrayUnion = (utils.arrayUnion = function(a, b) {
        var r = b.slice(0);
        a.forEach(function(i) {
            if (r.indexOf(i) < 0) {
                r.push(i);
            }
        });
        return r;
    });

    /**
     Array Difference
     */
    var arrayDiff = (utils.arrayDiff = function(a, b) {
        return a.filter(function(i) {
            return b.indexOf(i) < 0;
        });
    });

    /**
     Arrays deep intersect (with records)
     */
    var arrayIntersect = (utils.arrayIntersect = function(a, b) {
        var r = [];
        a.forEach(function(ai) {
            var found = false;

            b.forEach(function(bi) {
                found = found || ai === bi;
            });

            if (found) {
                r.push(ai);
            }
        });
        return r;
    });

    /**
     Arrays deep union (with records)
     */
    var arrayUnionDeep = (utils.arrayUnionDeep = function(a, b) {
        var r = b.slice(0);
        a.forEach(function(ai) {
            var found = false;

            r.forEach(function(ri) {
                //            found = found || equalDeep(ai, ri, true);
                found = found || deepEqual(ai, ri);
            });

            if (!found) {
                r.push(ai);
            }
        });
        return r;
    });

    /**
     Arrays deep union (with records)
     */
    var arrayExceptDeep = (utils.arrayExceptDeep = function(a, b) {
        var r = [];
        a.forEach(function(ai) {
            var found = false;

            b.forEach(function(bi) {
                //            found = found || equalDeep(ai, bi, true);
                found = found || deepEqual(ai, bi);
            });

            if (!found) {
                r.push(ai);
            }
        });
        return r;
    });

    /**
     Arrays deep intersect (with records)
     */
    var arrayIntersectDeep = (utils.arrayIntersectDeep = function(a, b) {
        var r = [];
        a.forEach(function(ai) {
            var found = false;

            b.forEach(function(bi) {
                //            found = found || equalDeep(ai, bi, true);
                found = found || deepEqual(ai, bi, true);
            });

            if (found) {
                r.push(ai);
            }
        });
        return r;
    });

    /**
     Deep clone objects
     */
    var cloneDeep = (utils.cloneDeep = function cloneDeep(obj) {
        if (null === obj || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj);
        }

        var temp = obj.constructor(); // changed

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = cloneDeep(obj[key]);
            }
        }
        return temp;
    });

    /**
     Check equality of objects
     */

    /**
     Compare two objects in deep
     */
    var deepEqual = (utils.deepEqual = function(x, y) {
        if (x === y) {
            return true;
        }

        if (typeof x === 'object' && null !== x && (typeof y === 'object' && null !== y)) {
            if (Object.keys(x).length !== Object.keys(y).length) {
                return false;
            }
            for (var prop in x) {
                if (!deepEqual(x[prop], y[prop])) {
                    return false;
                }
            }
            return true;
        }

        return false;
    });
    /**
     Array with distinct records
     @param {array} data
     @return {array}
     */
    var distinctArray = (utils.distinctArray = function(data) {
        var uniq = {};
        // TODO: Speedup, because Object.keys is slow
        for (var i = 0, ilen = data.length; i < ilen; i++) {
            var uix;
            if (typeof data[i] === 'object') {
                uix = Object.keys(data[i])
                    .sort()
                    .map(function(k) {
                        return k + '`' + data[i][k];
                    })
                    .join('`');
            } else {
                uix = data[i];
            }
            uniq[uix] = data[i];
        }
        var res = [];
        for (var key in uniq) {
            res.push(uniq[key]);
        }
        return res;
    });

    /**
     Extend object a with properties of b
     @function
     @param {object} a
     @param {object} b
     @return {object}
     */
    var extend = (utils.extend = function extend(a, b) {
        a = a || {};
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    });

    /**
     Flat array by first row
     */
    var flatArray = (utils.flatArray = function(a) {

        if (!a || 0 === a.length) {
            return [];
        }

        // For recordsets
        if (typeof a === 'object' && a instanceof alasql.Recordset) {
            return a.data.map(function(ai) {
                return ai[a.columns[0].columnid];
            });
        }
        // Else for other arrays
        var key = Object.keys(a[0])[0];
        if (key === undefined) {
            return [];
        }
        return a.map(function(ai) {
            return ai[key];
        });
    });

    /**
     Convert array of objects to array of arrays
     */
    var arrayOfArrays = (utils.arrayOfArrays = function(a) {
        return a.map(function(aa) {
            var ar = [];
            for (var key in aa) {
                ar.push(aa[key]);
            }
            return ar;
        });
    });

    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    /**
     Excel:convert number to Excel column, like 1 => 'A'
     @param {integer} i Column number, starting with 0
     @return {string} Column name, starting with 'A'
     */

    var xlsnc = (utils.xlsnc = function(i) {
        var addr = String.fromCharCode(65 + i % 26);
        if (i >= 26) {
            i = ((i / 26) | 0) - 1;
            addr = String.fromCharCode(65 + i % 26) + addr;
            if (i > 26) {
                i = ((i / 26) | 0) - 1;
                addr = String.fromCharCode(65 + i % 26) + addr;
            }
        }
        return addr;
    });

    /**
     Excel:conver Excel column name to number
     @param {string} s Column number, like 'A' or 'BE'
     @return {string} Column name, starting with 0
     */
    var xlscn = (utils.xlscn = function(s) {
        var n = s.charCodeAt(0) - 65;
        if (s.length > 1) {
            n = (n + 1) * 26 + s.charCodeAt(1) - 65;

            if (s.length > 2) {
                n = (n + 1) * 26 + s.charCodeAt(2) - 65;
            }
        }
        return n;
    });

    var domEmptyChildren = (utils.domEmptyChildren = function(container) {
        var len = container.childNodes.length;
        while (len--) {
            container.removeChild(container.lastChild);
        }
    });

    /**
     SQL LIKE emulation
     @parameter {string} pattern Search pattern
     @parameter {string} value Searched value
     @parameter {string} escape Escape character (optional)
     @return {boolean} If value LIKE pattern ESCAPE escape
     */

    var like = (utils.like = function(pattern, value, escape) {
        // Verify escape character
        if (!escape) escape = '';

        var i = 0;
        var s = '^';

        while (i < pattern.length) {
            var c = pattern[i],
                c1 = '';
            if (i < pattern.length - 1) c1 = pattern[i + 1];

            if (c === escape) {
                s += '\\' + c1;
                i++;
            } else if (c === '[' && c1 === '^') {
                s += '[^';
                i++;
            } else if (c === '[' || c === ']') {
                s += c;
            } else if (c === '%') {
                s += '.*';
            } else if (c === '_') {
                s += '.';
            } else if ('/.*+?|(){}'.indexOf(c) > -1) {
                s += '\\' + c;
            } else {
                s += c;
            }
            i++;
        }

        s += '$';
        //    if(value == undefined) return false;

        return ('' + (value || '')).toUpperCase().search(RegExp(s.toUpperCase())) > -1;
    });

    utils.glob = function(value, pattern) {
        var i = 0;
        var s = '^';

        while (i < pattern.length) {
            var c = pattern[i],
                c1 = '';
            if (i < pattern.length - 1) c1 = pattern[i + 1];

            if (c === '[' && c1 === '^') {
                s += '[^';
                i++;
            } else if (c === '[' || c === ']') {
                s += c;
            } else if (c === '*') {
                s += '.*';
            } else if (c === '?') {
                s += '.';
            } else if ('/.*+?|(){}'.indexOf(c) > -1) {
                s += '\\' + c;
            } else {
                s += c;
            }
            i++;
        }

        s += '$';
        return ('' + (value || '')).toUpperCase().search(RegExp(s.toUpperCase())) > -1;
    };

    /**
     Get path of alasql.js
     @todo Rewrite and simplify the code. Review, is this function is required separately
     */
    utils.findAlaSQLPath = function() {
        /** type {string} Path to alasql library and plugins */

        if (utils.isWebWorker) {
            return '';
            /** @todo Check how to get path in worker */
        } else if (utils.isMeteorClient) {
            return '/packages/dist/';
        } else if (utils.isMeteorServer) {
            return 'assets/packages/dist/';
        } else if (utils.isNode) {
            return __dirname;
        } else if (utils.isBrowser) {
            var sc = document.getElementsByTagName('script');

            for (var i = 0; i < sc.length; i++) {
                if (sc[i].src.substr(-16).toLowerCase() === 'alasql-worker.js') {
                    return sc[i].src.substr(0, sc[i].src.length - 16);
                } else if (sc[i].src.substr(-20).toLowerCase() === 'alasql-worker.min.js') {
                    return sc[i].src.substr(0, sc[i].src.length - 20);
                } else if (sc[i].src.substr(-9).toLowerCase() === 'alasql.js') {
                    return sc[i].src.substr(0, sc[i].src.length - 9);
                } else if (sc[i].src.substr(-13).toLowerCase() === 'alasql.min.js') {
                    return sc[i].src.substr(0, sc[i].src.length - 13);
                }
            }
        }
        return '';
    };

    var getXLSX = function() {
        var XLSX = alasql["private"].externalXlsxLib;

        if (XLSX) {
            return XLSX;
        }

        if (utils.isNode || utils.isBrowserify || utils.isMeteorServer) {
            /*not-for-browser/*
             XLSX = require('xlsx') || null;
             //*/
        } else {
            XLSX = utils.global.XLSX || null;
        }

        if (null === XLSX) {
            throw new Error('Please include the xlsx.js library');
        }

        return XLSX;
    };

// set AlaSQl path
    alasql.path = alasql.utils.findAlaSQLPath();

    /**
     Strip all comments.
     @function
     @param {string} str
     @return {string}
     Based om the https://github.com/lehni/uncomment.js/blob/master/uncomment.js
     I just replaced JavaScript's '//' to SQL's '--' and remove other stuff

     @todo Fixed [aaa/*bbb] for column names
     @todo Bug if -- comments in the last line
     @todo Check if it possible to model it with Jison parser
     @todo Remove unused code
     */

    /* global alasql */

    alasql.utils.uncomment = function(str) {
        // Add some padding so we can always look ahead and behind by two chars
        str = ('__' + str + '__').split('');
        var quote = false,
            quoteSign,
            // regularExpression = false,
            // characterClass = false,
            blockComment = false,
            lineComment = false;
        // preserveComment = false;

        for (var i = 0, l = str.length; i < l; i++) {

            // When checking for quote escaping, we also need to check that the
            // escape sign itself is not escaped, as otherwise '\\' would cause
            // the wrong impression of an unclosed string:
            var unescaped = str[i - 1] !== '\\' || str[i - 2] === '\\';

            if (quote) {
                if (str[i] === quoteSign && unescaped) {
                    quote = false;
                }

            } else if (blockComment) {
                // Is the block comment closing?
                if (str[i] === '*' && str[i + 1] === '/') {
                    // if (!preserveComment)
                    str[i] = str[i + 1] = '';
                    blockComment /* = preserveComment*/ = false;
                    // Increase by 1 to skip closing '/', as it would be mistaken
                    // for a regexp otherwise
                    i++;
                } else {
                    //if (!preserveComment) {
                    str[i] = '';
                }
            } else if (lineComment) {
                // One-line comments end with the line-break
                if (str[i + 1] === '\n' || str[i + 1] === '\r') {
                    lineComment = false;
                }
                str[i] = '';
            } else {
                if (str[i] === '"' || str[i] === "'") {
                    quote = true;
                    quoteSign = str[i];
                } else if (str[i] === '[' && str[i - 1] !== '@') {
                    quote = true;
                    quoteSign = ']';
                    // } else if (str[i] === '-' &&  str[i + 1] === '-') {
                    // 	str[i] = '';
                    // 	lineComment = true;
                } else if (str[i] === '/' && str[i + 1] === '*') {
                    // Do not filter out conditional comments /*@ ... */
                    // and comments marked as protected /*! ... */
                    //					preserveComment = /[@!]/.test(str[i + 2]);
                    //					if (!preserveComment)
                    str[i] = '';
                    blockComment = true;

                }
            }
        }
        // Remove padding again.
        str = str.join('').slice(2, -2);

        return str;
    };

    /**
     Database class for Alasql.js
     */

// Initial parameters

    /**
     Jison parser
     */
    alasql.parser = alasqlparser;

    alasql.parser.parseError = function(str, hash) {
        throw new Error('Have you used a reserved keyword without `escaping` it?\n' + str);
    };

    /**
     Jison parser
     @param {string} sql SQL statement
     @return {object} AST (Abstract Syntax Tree)

     @todo Create class AST
     @todo Add other parsers

     @example
     alasql.parse = function(sql) {
		// My own parser here
 	}
     */
    alasql.parse = function(sql) {
        return alasqlparser.parse(alasql.utils.uncomment(sql));
    };

    /**
     List of engines of external databases
     @type {object}
     @todo Create collection type
     */
    alasql.engines = {};

    /**
     List of databases
     @type {object}
     */
    alasql.databases = {};

    /**
     Number of databases
     @type {number}
     */
    alasql.databasenum = 0;

    /**
     Alasql options object
     */
    alasql.options = {};
    alasql.options.errorlog = false; // Log or throw error
    alasql.options.valueof = false; // Use valueof in orderfn
    alasql.options.dropifnotexists = false; // DROP database in any case
    alasql.options.datetimeformat = 'sql'; // How to handle DATE and DATETIME types
// Another value is 'javascript'
    alasql.options.casesensitive = true; // Table and column names are case sensitive and converted to lower-case
    alasql.options.logtarget = 'output'; // target for log. Values: 'console', 'output', 'id' of html tag
    alasql.options.logprompt = true; // Print SQL at log

    alasql.options.progress = false; // Callback for async queries progress

// Default modifier
// values: RECORDSET, VALUE, ROW, COLUMN, MATRIX, TEXTSTRING, INDEX
    alasql.options.modifier = undefined;
// How many rows to lookup to define columns
    alasql.options.columnlookup = 10;
// Create vertex if not found
    alasql.options.autovertex = true;

// Use dbo as current database (for partial T-SQL comaptibility)
    alasql.options.usedbo = true;

// AUTOCOMMIT ON | OFF
    alasql.options.autocommit = true;

// Use cache
    alasql.options.cache = true;

// Compatibility flags
    alasql.options.tsql = true;

    alasql.options.mysql = true;

    alasql.options.postgres = true;

    alasql.options.oracle = true;

    alasql.options.sqlite = true;

    alasql.options.orientdb = true;

// for SET NOCOUNT OFF
    alasql.options.nocount = false;

// Check for NaN and convert it to undefined
    alasql.options.nan = false;

    alasql.options.joinstar = 'overwrite'; // Option for SELECT * FROM a,b

//alasql.options.worker = false;

// Variables
    alasql.vars = {};

    alasql.declares = {};

    alasql.prompthistory = [];

    alasql.plugins = {}; // If plugin already loaded

    alasql.from = {}; // FROM functions

    alasql.into = {}; // INTO functions

    alasql.fn = {};

    alasql.aggr = {};

    alasql.busy = 0;

// Cache
    alasql.MAXSQLCACHESIZE = 10000;
    alasql.DEFAULTDATABASEID = 'alasql';

    /* WebWorker */
    alasql.lastid = 0;

    alasql.buffer = {};

    alasql["private"] = {
        externalXlsxLib: null,
    };

    alasql.setXLSX = function(XLSX) {
        alasql["private"].externalXlsxLib = XLSX;
    };

    /**
     Select current database
     @param {string} databaseid Selected database identificator
     */
    alasql.use = function(databaseid) {
        if (!databaseid) {
            databaseid = alasql.DEFAULTDATABASEID;
        }
        if (alasql.useid === databaseid) {
            return;
        }
        alasql.useid = databaseid;
        var db = alasql.databases[alasql.useid];
        alasql.tables = db.tables;
        //	alasql.fn = db.fn;
        db.resetSqlCache();
        if (alasql.options.usedbo) {
            alasql.databases.dbo = db; // Operator???
        }
    };

    alasql.autoval = function(tablename, colname, getNext, databaseid) {
        var db = databaseid ? alasql.databases[databaseid] : alasql.databases[alasql.useid];

        if (!db.tables[tablename]) {
            throw new Error('Tablename not found: ' + tablename);
        }

        if (!db.tables[tablename].identities[colname]) {
            throw new Error('Colname not found: ' + colname);
        }

        if (getNext) {
            return db.tables[tablename].identities[colname].value || null;
        }

        return (
            db.tables[tablename].identities[colname].value -
            db.tables[tablename].identities[colname].step || null
        );
    };

    /**
     Run single SQL statement on current database
     */
    alasql.exec = function(sql, params, cb, scope) {
        // Avoid setting params if not needed even with callback
        if (typeof params === 'function') {
            scope = cb;
            cb = params;
            params = {};
        }

        delete alasql.error;
        params = params || {};
        if (alasql.options.errorlog) {
            try {
                return alasql.dexec(alasql.useid, sql, params, cb, scope);
            } catch (err) {
                alasql.error = err;
                if (cb) {
                    cb(null, alasql.error);
                }
            }
        } else {
            return alasql.dexec(alasql.useid, sql, params, cb, scope);
        }
    };

    /**
     Run SQL statement on specific database
     */
    alasql.dexec = function(databaseid, sql, params, cb, scope) {
        var db = alasql.databases[databaseid];
        //	if(db.databaseid != databaseid) console.trace('got!');

        var hh;
        // Create hash
        if (alasql.options.cache) {
            hh = hash(sql);
            var statement = db.sqlCache[hh];
            // If database structure was not changed since last time return cache
            if (statement && db.dbversion === statement.dbversion) {
                return statement(params, cb);
            }
        }

        // Create AST
        var ast = alasql.parse(sql);
        if (!ast.statements) {
            return;
        }
        if (0 === ast.statements.length) {
            return 0;
        } else if (1 === ast.statements.length) {
            if (ast.statements[0].compile) {
                // Compile and Execute
                var statement = ast.statements[0].compile(databaseid, params);
                if (!statement) {
                    return;
                }
                statement.sql = sql;
                statement.dbversion = db.dbversion;

                if (alasql.options.cache) {
                    // Secure sqlCache size
                    if (db.sqlCacheSize > alasql.MAXSQLCACHESIZE) {
                        db.resetSqlCache();
                    }
                    db.sqlCacheSize++;
                    db.sqlCache[hh] = statement;
                }
                var res = (alasql.res = statement(params, cb, scope));
                return res;
            } else {

                alasql.precompile(ast.statements[0], alasql.useid, params);
                var res = (alasql.res = ast.statements[0].execute(databaseid, params, cb, scope));
                return res;
            }
        } else {
            // Multiple statements
            if (cb) {
                alasql.adrun(databaseid, ast, params, cb, scope);
            } else {
                return alasql.drun(databaseid, ast, params, cb, scope);
            }
        }
    };

    /**
     Run multiple statements and return array of results sync
     */
    alasql.drun = function(databaseid, ast, params, cb, scope) {
        var useid = alasql.useid;

        if (useid !== databaseid) {
            alasql.use(databaseid);
        }

        var res = [];
        for (var i = 0, ilen = ast.statements.length; i < ilen; i++) {
            if (ast.statements[i]) {
                if (ast.statements[i].compile) {
                    var statement = ast.statements[i].compile(alasql.useid);
                    res.push((alasql.res = statement(params, null, scope)));
                } else {
                    alasql.precompile(ast.statements[i], alasql.useid, params);
                    res.push((alasql.res = ast.statements[i].execute(alasql.useid, params)));
                }
            }
        }
        if (useid !== databaseid) {
            alasql.use(useid);
        }

        if (cb) {
            cb(res);
        }

        alasql.res = res;

        return res;
    };

    /**
     Run multiple statements and return array of results async
     */
    alasql.adrun = function(databaseid, ast, params, cb, scope) {
        var idx = 0;
        var noqueries = ast.statements.length;
        if (alasql.options.progress !== false) {
            alasql.options.progress(noqueries, idx++);
        }

        //	alasql.busy++;
        var useid = alasql.useid;
        if (useid !== databaseid) {
            alasql.use(databaseid);
        }
        var res = [];

        function adrunone(data) {
            if (data !== undefined) {
                res.push(data);
            }
            var astatement = ast.statements.shift();
            if (!astatement) {
                if (useid !== databaseid) {
                    alasql.use(useid);
                }
                cb(res);
                //			alasql.busy--;
                //			if(alasql.busy<0) alasql.busy = 0;
            } else {
                if (astatement.compile) {
                    var statement = astatement.compile(alasql.useid);
                    statement(params, adrunone, scope);
                    if (alasql.options.progress !== false) {
                        alasql.options.progress(noqueries, idx++);
                    }
                } else {
                    alasql.precompile(ast.statements[0], alasql.useid, params);
                    astatement.execute(alasql.useid, params, adrunone);
                    if (alasql.options.progress !== false) {
                        alasql.options.progress(noqueries, idx++);
                    }
                }
            }
        }

        adrunone(); /** @todo Check, why data is empty here */
    };

    /**
     Compile statement to JavaScript function
     @param {string} sql SQL statement
     @param {string} databaseid Database identificator
     @return {functions} Compiled statement functions
     */
    alasql.compile = function(sql, databaseid) {
        databaseid = databaseid || alasql.useid;

        var ast = alasql.parse(sql); // Create AST

        if (1 === ast.statements.length) {
            var statement = ast.statements[0].compile(databaseid);
            statement.promise = function(params) {
                return new Promise(function(resolve, reject) {
                    statement(params, function(data, err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });
            };

            return statement;

        } else {
            throw new Error('Cannot compile, because number of statements in SQL is not equal to 1');
        }
    };

//
// Promises for AlaSQL
//

    if (!utils.global.Promise) {
        if (utils.isNode) {
            /*not-for-browser/*
             utils.global.Promise = require('es6-promise').Promise;
             //*/
        } else {
            /*!
             * @overview es6-promise - a tiny implementation of Promises/A+.
             * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
             * @license   Licensed under MIT license
             *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
             * @version   3.2.1
             */
            (function() {
                'use strict';
                function t(t) {
                    return 'function' == typeof t || ('object' == typeof t && null !== t);
                }
                function e(t) {
                    return 'function' == typeof t;
                }
                function n(t) {
                    G = t;
                }
                function r(t) {
                    Q = t;
                }
                function o() {
                    return function() {
                        process.nextTick(a);
                    };
                }
                function i() {
                    return function() {
                        B(a);
                    };
                }
                function s() {
                    var t = 0,
                        e = new X(a),
                        n = document.createTextNode('');
                    return (
                        e.observe(n, {characterData: !0}),
                            function() {
                                n.data = t = ++t % 2;
                            }
                    );
                }
                function u() {
                    var t = new MessageChannel();
                    return (
                        (t.port1.onmessage = a),
                            function() {
                                t.port2.postMessage(0);
                            }
                    );
                }
                function c() {
                    return function() {
                        setTimeout(a, 1);
                    };
                }
                function a() {
                    for (var t = 0; J > t; t += 2) {
                        var e = tt[t],
                            n = tt[t + 1];
                        e(n), (tt[t] = void 0), (tt[t + 1] = void 0);
                    }
                    J = 0;
                }
                function f() {
                    try {
                        var t = require,
                            e = t('vertx');
                        return (B = e.runOnLoop || e.runOnContext, i());
                    } catch (n) {
                        return c();
                    }
                }
                function l(t, e) {
                    var n = this,
                        r = new this.constructor(p);
                    void 0 === r[rt] && k(r);
                    var o = n._state;
                    if (o) {
                        var i = arguments[o - 1];
                        Q(function() {
                            x(o, r, i, n._result);
                        });
                    } else E(n, r, t, e);
                    return r;
                }
                function h(t) {
                    var e = this;
                    if (t && 'object' == typeof t && t.constructor === e) return t;
                    var n = new e(p);
                    return (g(n, t), n);
                }
                function p() {}
                function _() {
                    return new TypeError('You cannot resolve a promise with itself');
                }
                function d() {
                    return new TypeError('A promises callback cannot return that same promise.');
                }
                function v(t) {
                    try {
                        return t.then;
                    } catch (e) {
                        return (ut.error = e, ut);
                    }
                }
                function y(t, e, n, r) {
                    try {
                        t.call(e, n, r);
                    } catch (o) {
                        return o;
                    }
                }
                function m(t, e, n) {
                    Q(function(t) {
                        var r = !1,
                            o = y(
                                n,
                                e,
                                function(n) {
                                    r || ((r = !0), e !== n ? g(t, n) : S(t, n));
                                },
                                function(e) {
                                    r || ((r = !0), j(t, e));
                                },
                                'Settle: ' + (t._label || ' unknown promise')
                            );
                        !r && o && ((r = !0), j(t, o));
                    }, t);
                }
                function b(t, e) {
                    e._state === it
                        ? S(t, e._result)
                        : e._state === st
                        ? j(t, e._result)
                        : E(
                        e,
                        void 0,
                        function(e) {
                            g(t, e);
                        },
                        function(e) {
                            j(t, e);
                        }
                    );
                }
                function w(t, n, r) {
                    n.constructor === t.constructor && r === et && constructor.resolve === nt
                        ? b(t, n)
                        : r === ut
                        ? j(t, ut.error)
                        : void 0 === r ? S(t, n) : e(r) ? m(t, n, r) : S(t, n);
                }
                function g(e, n) {
                    e === n ? j(e, _()) : t(n) ? w(e, n, v(n)) : S(e, n);
                }
                function A(t) {
                    t._onerror && t._onerror(t._result), T(t);
                }
                function S(t, e) {
                    t._state === ot &&
                    ((t._result = e), (t._state = it), 0 !== t._subscribers.length && Q(T, t));
                }
                function j(t, e) {
                    t._state === ot && ((t._state = st), (t._result = e), Q(A, t));
                }
                function E(t, e, n, r) {
                    var o = t._subscribers,
                        i = o.length;
                    (t._onerror = null),
                        (o[i] = e),
                        (o[i + it] = n),
                        (o[i + st] = r),
                    0 === i && t._state && Q(T, t);
                }
                function T(t) {
                    var e = t._subscribers,
                        n = t._state;
                    if (0 !== e.length) {
                        for (var r, o, i = t._result, s = 0; s < e.length; s += 3)
                            (r = e[s]), (o = e[s + n]), r ? x(n, r, o, i) : o(i);
                        t._subscribers.length = 0;
                    }
                }
                function M() {
                    this.error = null;
                }
                function P(t, e) {
                    try {
                        return t(e);
                    } catch (n) {
                        return (ct.error = n, ct);
                    }
                }
                function x(t, n, r, o) {
                    var i,
                        s,
                        u,
                        c,
                        a = e(r);
                    if (a) {
                        if (
                            ((i = P(r, o)),
                                i === ct ? ((c = !0), (s = i.error), (i = null)) : (u = !0),
                            n === i)
                        )
                            return void j(n, d());
                    } else (i = o), (u = !0);
                    n._state !== ot ||
                    (a && u ? g(n, i) : c ? j(n, s) : t === it ? S(n, i) : t === st && j(n, i));
                }
                function C(t, e) {
                    try {
                        e(
                            function(e) {
                                g(t, e);
                            },
                            function(e) {
                                j(t, e);
                            }
                        );
                    } catch (n) {
                        j(t, n);
                    }
                }
                function O() {
                    return at++;
                }
                function k(t) {
                    (t[rt] = at++), (t._state = void 0), (t._result = void 0), (t._subscribers = []);
                }
                function Y(t) {
                    return new _t(this, t).promise;
                }
                function q(t) {
                    var e = this;
                    return new e(
                        I(t)
                            ? function(n, r) {
                            for (var o = t.length, i = 0; o > i; i++)
                                e.resolve(t[i]).then(n, r);
                        }
                            : function(t, e) {
                            e(new TypeError('You must pass an array to race.'));
                        }
                    );
                }
                function F(t) {
                    var e = this,
                        n = new e(p);
                    return (j(n, t), n);
                }
                function D() {
                    throw new TypeError(
                        'You must pass a resolver function as the first argument to the promise constructor'
                    );
                }
                function K() {
                    throw new TypeError(
                        "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
                    );
                }
                function L(t) {
                    (this[rt] = O()),
                        (this._result = this._state = void 0),
                        (this._subscribers = []),
                    p !== t &&
                    ('function' != typeof t && D(), this instanceof L ? C(this, t) : K());
                }
                function N(t, e) {
                    (this._instanceConstructor = t),
                        (this.promise = new t(p)),
                    this.promise[rt] || k(this.promise),
                        Array.isArray(e)
                            ? ((this._input = e),
                            (this.length = e.length),
                            (this._remaining = e.length),
                            (this._result = new Array(this.length)),
                            0 === this.length
                                ? S(this.promise, this._result)
                                : ((this.length = this.length || 0),
                                this._enumerate(),
                            0 === this._remaining && S(this.promise, this._result)))
                            : j(this.promise, U());
                }
                function U() {
                    return new Error('Array Methods must be provided an Array');
                }
                function W() {
                    var t;
                    if ('undefined' != typeof global) t = global;
                    else if ('undefined' != typeof self) t = self;
                    else
                        try {
                            t = Function('return this')();
                        } catch (e) {
                            throw new Error(
                                'polyfill failed because global object is unavailable in this environment'
                            );
                        }
                    var n = t.Promise;
                    (!n ||
                    '[object Promise]' !== Object.prototype.toString.call(n.resolve()) ||
                    n.cast) &&
                    (t.Promise = pt);
                }
                var z;
                z = Array.isArray
                    ? Array.isArray
                    : function(t) {
                    return '[object Array]' === Object.prototype.toString.call(t);
                };
                var B,
                    G,
                    H,
                    I = z,
                    J = 0,
                    Q = function(t, e) {
                        (tt[J] = t), (tt[J + 1] = e), (J += 2), 2 === J && (G ? G(a) : H());
                    },
                    R = 'undefined' != typeof window ? window : void 0,
                    V = R || {},
                    X = V.MutationObserver || V.WebKitMutationObserver,
                    Z =
                        'undefined' == typeof self &&
                        'undefined' != typeof process &&
                        '[object process]' === {}.toString.call(process),
                    $ =
                        'undefined' != typeof Uint8ClampedArray &&
                        'undefined' != typeof importScripts &&
                        'undefined' != typeof MessageChannel,
                    tt = new Array(1e3);
                H = Z
                    ? o()
                    : X ? s() : $ ? u() : void 0 === R && 'function' == typeof require ? f() : c();
                var et = l,
                    nt = h,
                    rt = Math.random()
                        .toString(36)
                        .substring(16),
                    ot = void 0,
                    it = 1,
                    st = 2,
                    ut = new M(),
                    ct = new M(),
                    at = 0,
                    ft = Y,
                    lt = q,
                    ht = F,
                    pt = L;
                (L.all = ft),
                    (L.race = lt),
                    (L.resolve = nt),
                    (L.reject = ht),
                    (L._setScheduler = n),
                    (L._setAsap = r),
                    (L._asap = Q),
                    (L.prototype = {
                        constructor: L,
                        then: et,
                        "catch": function(t) {
                            return this.then(null, t);
                        },
                    });
                var _t = N;
                (N.prototype._enumerate = function() {
                    for (var t = this.length, e = this._input, n = 0; this._state === ot && t > n; n++)
                        this._eachEntry(e[n], n);
                }),
                    (N.prototype._eachEntry = function(t, e) {
                        var n = this._instanceConstructor,
                            r = n.resolve;
                        if (r === nt) {
                            var o = v(t);
                            if (o === et && t._state !== ot) this._settledAt(t._state, e, t._result);
                            else if ('function' != typeof o) this._remaining--, (this._result[e] = t);
                            else if (n === pt) {
                                var i = new n(p);
                                w(i, t, o), this._willSettleAt(i, e);
                            } else
                                this._willSettleAt(
                                    new n(function(e) {
                                        e(t);
                                    }),
                                    e
                                );
                        } else this._willSettleAt(r(t), e);
                    }),
                    (N.prototype._settledAt = function(t, e, n) {
                        var r = this.promise;
                        r._state === ot &&
                        (this._remaining--, t === st ? j(r, n) : (this._result[e] = n)),
                        0 === this._remaining && S(r, this._result);
                    }),
                    (N.prototype._willSettleAt = function(t, e) {
                        var n = this;
                        E(
                            t,
                            void 0,
                            function(t) {
                                n._settledAt(it, e, t);
                            },
                            function(t) {
                                n._settledAt(st, e, t);
                            }
                        );
                    });
                var dt = W,
                    vt = {Promise: pt, polyfill: dt};
                'function' == typeof define && define.amd
                    ? define(function() {
                    return vt;
                })
                    : 'undefined' != typeof module && module.exports
                    ? (module.exports = vt)
                    : 'undefined' != typeof this && (this.ES6Promise = vt),
                    dt();
            }.call(this));

        }
    }

    var promiseExec = function(sql, params, counterStep, counterTotal) {
        return new utils.global.Promise(function(resolve, reject) {
            alasql(sql, params, function(data, err) {
                if (err) {
                    reject(err);
                } else {
                    if (counterStep && counterTotal && alasql.options.progress !== false) {
                        alasql.options.progress(counterStep, counterTotal);
                    }
                    resolve(data);
                }
            });
        });
    };

    var promiseAll = function(sqlParamsArray) {
        if (sqlParamsArray.length < 1) {
            return;
        }

        var active, sql, params;

        var execArray = [];

        for (var i = 0; i < sqlParamsArray.length; i++) {
            active = sqlParamsArray[i];

            if (typeof active === 'string') {
                active = [active];
            }

            if (!utils.isArray(active) || active.length < 1 || 2 < active.length) {
                throw new Error('Error in .promise parameter');
            }

            sql = active[0];
            params = active[1] || undefined;

            execArray.push(promiseExec(sql, params, i, sqlParamsArray.length));
        }

        return utils.global.Promise.all(execArray);
    };

    alasql.promise = function(sql, params) {
        if (typeof Promise === 'undefined') {
            throw new Error('Please include a Promise/A+ library');
        }

        if (typeof sql === 'string') {
            return promiseExec(sql, params);
        }

        if (!utils.isArray(sql) || sql.length < 1 || typeof params !== 'undefined') {
            throw new Error('Error in .promise parameters');
        }
        return promiseAll(sql);
    };

    /*
     //
     // Database class for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// Main Database class

    /**
     @class Database
     */

    var Database = (alasql.Database = function(databaseid) {
        var self = this;

        //		self.prototype = this;

        if (self === alasql) {
            if (databaseid) {
                //			if(alasql.databases[databaseid]) {
                self = alasql.databases[databaseid];
                //			} else {
                alasql.databases[databaseid] = self;
                //			}
                if (!self) {
                    throw new Error('Database "' + databaseid + '" not found');
                }
            } else {
                // Create new database (or get alasql?)
                self = alasql.databases.alasql;
                // For SQL Server examples, USE tempdb
                if (alasql.options.tsql) {
                    alasql.databases.tempdb = alasql.databases.alasql;
                }
                //			self = new Database(databaseid); // to call without new
            }
        }
        if (!databaseid) {
            databaseid = 'db' + alasql.databasenum++; // Random name
        }

        // Step 1
        self.databaseid = databaseid;
        alasql.databases[databaseid] = self;
        self.dbversion = 0;

        //Steps 2-5
        self.tables = {};
        self.views = {};
        self.triggers = {};
        self.indices = {};

        // Step 6: Objects storage
        self.objects = {};
        self.counter = 0;

        self.resetSqlCache();
        return self;
    });

    /**
     Reset SQL statements cache
     */

    Database.prototype.resetSqlCache = function() {
        this.sqlCache = {}; // Cache for compiled SQL statements
        this.sqlCacheSize = 0;
    };

// Main SQL function

    /**
     Run SQL statement on database
     @param {string} sql SQL statement
     @param [object] params Parameters
     @param {function} cb callback
     */

    Database.prototype.exec = function(sql, params, cb) {
        return alasql.dexec(this.databaseid, sql, params, cb);
    };

    Database.prototype.autoval = function(tablename, colname, getNext) {
        return alasql.autoval(tablename, colname, getNext, this.databaseid);
    };

// Aliases like MS SQL

    /*
     //
     // Transactio class for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    Database.prototype.transaction = function(cb) {
        var tx = new alasql.Transaction(this.databaseid);
        var res = cb(tx);
        return res;
    };

// Transaction class (for WebSQL compatibility)

    /**
     Transaction class
     @class Transaction
     */

    var Transaction = (alasql.Transaction = function(databaseid) {
        this.transactionid = Date.now();
        this.databaseid = databaseid;
        this.commited = false;
        this.dbversion = alasql.databases[databaseid].dbversion;
        //	this.bank = cloneDeep(alasql.databases[databaseid]);
        this.bank = JSON.stringify(alasql.databases[databaseid]);
        // TODO CLone Tables with insertfns

        return this;
    });

// Main class

// Commit

    /**
     Commit transaction
     */
    Transaction.prototype.commit = function() {
        this.commited = true;
        alasql.databases[this.databaseid].dbversion = Date.now();
        delete this.bank;
    };

// Rollback
    /**
     Rollback transaction
     */
    Transaction.prototype.rollback = function() {
        if (!this.commited) {
            alasql.databases[this.databaseid] = JSON.parse(this.bank);
            // alasql.databases[this.databaseid].tables = this.bank;
            // alasql.databases[this.databaseid].dbversion = this.dbversion;
            delete this.bank;
        } else {
            throw new Error('Transaction already commited');
        }
    };

// Transactions stub

    /**
     Execute SQL statement
     @param {string} sql SQL statement
     @param {object} params Parameters
     @param {function} cb Callback function
     @return result
     */
    Transaction.prototype.exec = function(sql, params, cb) {

        return alasql.dexec(this.databaseid, sql, params, cb);
    };

    Transaction.prototype.executeSQL = Transaction.prototype.exec;

    /*
     //
     // Table class for Alasql.js
     // Date: 14.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// Table class
    var Table = (alasql.Table = function(params) {
        // Step 1: Data array
        this.data = [];

        // Step 2: Columns
        this.columns = [];
        this.xcolumns = {};

        // Step 3: indices
        this.inddefs = {};
        this.indices = {};
        this.uniqs = {};
        this.uniqdefs = {};

        // Step 4: identities
        this.identities = {};

        // Step 5: checkfn...
        this.checks = [];
        this.checkfns = []; // For restore... to be done...

        // Step 6: INSERT/DELETE/UPDATE

        // Step 7: Triggers...
        // Create trigger hubs
        this.beforeinsert = {};
        this.afterinsert = {};
        this.insteadofinsert = {};

        this.beforedelete = {};
        this.afterdelete = {};
        this.insteadofdelete = {};

        this.beforeupdate = {};
        this.afterupdate = {};
        this.insteadofupdate = {};

        // Done
        extend(this, params);
    });

    Table.prototype.indexColumns = function() {
        var self = this;
        self.xcolumns = {};
        self.columns.forEach(function(col) {
            self.xcolumns[col.columnid] = col;
        });
    };

    /*
     //
     // View class for Alasql.js
     // Date: 14.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// Table class
    var View = (alasql.View = function(params) {
        // Columns
        this.columns = [];
        this.xcolumns = {};
        // Data array
        this.query = [];

        extend(this, params);
    });

    /*
     //
     // Query class for Alasql.js
     // Date: 14.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// Table class

    /**
     @class Query Main query class
     */
    var Query = (alasql.Query = function(params) {
        this.alasql = alasql;

        // Columns
        this.columns = [];
        this.xcolumns = {};
        this.selectGroup = [];
        this.groupColumns = {};
        // Data array
        extend(this, params);
    });

    /**
     @class Recordset data object
     */
    var Recordset = (alasql.Recordset = function(params) {
        // Data array
        extend(this, params);
    });

    /*
     //
     // Parser helper for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    var yy = (alasqlparser.yy = alasql.yy = {});

// Utility
    yy.extend = extend;
// Option for case sensitive
    yy.casesensitive = alasql.options.casesensitive;

// Base class for all yy classes
    var Base = (yy.Base = function(params) {
        return yy.extend(this, params);
    });

    Base.prototype.toString = function() {};
    Base.prototype.toType = function() {};
    Base.prototype.toJS = function() {};

    Base.prototype.compile = returnUndefined;
    Base.prototype.exec = function() {};

    Base.prototype.compile = returnUndefined;
    Base.prototype.exec = function() {};

    /*
     //
     // Statements class for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// Statements container
    yy.Statements = function(params) {
        return yy.extend(this, params);
    };

    yy.Statements.prototype.toString = function() {
        return this.statements
            .map(function(st) {
                return st.toString();
            })
            .join('; ');
    };

// Compile array of statements into single statement
    yy.Statements.prototype.compile = function(db) {
        var statements = this.statements.map(function(st) {
            return st.compile(db);
        });
        if (statements.length === 1) {
            return statements[0];
        } else {
            return function(params, cb) {
                var res = statements.map(function(st) {
                    return st(params);
                });
                if (cb) {
                    cb(res);
                }
                return res;
            };
        }
    };

    /* global alasql */
    /* global yy */
    /*
     //
     // SEARCH for Alasql.js
     // Date: 04.05.2015
     // (c) 2015, Andrey Gershun
     //
     */

    function doSearch(databaseid, params, cb) {
        var res;
        var stope = {};
        var fromdata;
        var selectors = cloneDeep(this.selectors);

        function processSelector(selectors, sidx, value) {
            //		var val;

            var val, // temp values use many places
                nest, // temp value used many places
                r, // temp value used many places
                sel = selectors[sidx];

            //		if(!alasql.srch[sel.srchid]) {
            //			throw new Error('Selector "'+sel.srchid+'" not found');
            //		};

            var SECURITY_BREAK = 100000;

            if (sel.selid) {
                // TODO Process Selector
                if (sel.selid === 'PATH') {
                    var queue = [{node: value, stack: []}];
                    var visited = {};
                    //var path = [];
                    var objects = alasql.databases[alasql.useid].objects;
                    while (queue.length > 0) {
                        var q = queue.shift();
                        var node = q.node;
                        var stack = q.stack;
                        var r = processSelector(sel.args, 0, node);
                        if (r.length > 0) {
                            if (sidx + 1 + 1 > selectors.length) {
                                return stack;
                            } else {
                                var rv = [];
                                if (stack && stack.length > 0) {
                                    stack.forEach(function(stv) {
                                        rv = rv.concat(processSelector(selectors, sidx + 1, stv));
                                    });
                                }
                                return rv;
                                //							return processSelector(selectors,sidx+1,stack);
                            }
                        } else {
                            if (typeof visited[node.$id] !== 'undefined') {
                                continue;
                            } else {

                                visited[node.$id] = true;
                                if (node.$out && node.$out.length > 0) {
                                    node.$out.forEach(function(edgeid) {
                                        var edge = objects[edgeid];
                                        var stack2 = stack.concat(edge);
                                        stack2.push(objects[edge.$out[0]]);
                                        queue.push({
                                            node: objects[edge.$out[0]],
                                            stack: stack2,
                                        });
                                    });
                                }
                            }
                        }
                    }
                    // Else return fail
                    return [];
                }
                if (sel.selid === 'NOT') {
                    var nest = processSelector(sel.args, 0, value);

                    if (nest.length > 0) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return [value];
                        } else {
                            return processSelector(selectors, sidx + 1, value);
                        }
                    }
                } else if (sel.selid === 'DISTINCT') {
                    var nest;
                    if (typeof sel.args === 'undefined' || sel.args.length === 0) {
                        nest = distinctArray(value);
                    } else {
                        nest = processSelector(sel.args, 0, value);
                    }
                    if (nest.length === 0) {
                        return [];
                    } else {
                        var res = distinctArray(nest);
                        if (sidx + 1 + 1 > selectors.length) {
                            return res;
                        } else {
                            return processSelector(selectors, sidx + 1, res);
                        }
                    }
                } else if (sel.selid === 'AND') {
                    var res = true;
                    sel.args.forEach(function(se) {
                        res = res && processSelector(se, 0, value).length > 0;
                    });
                    if (!res) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return [value];
                        } else {
                            return processSelector(selectors, sidx + 1, value);
                        }
                    }
                } else if (sel.selid === 'OR') {
                    var res = false;
                    sel.args.forEach(function(se) {
                        res = res || processSelector(se, 0, value).length > 0;
                    });
                    if (!res) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return [value];
                        } else {
                            return processSelector(selectors, sidx + 1, value);
                        }
                    }
                } else if (sel.selid === 'ALL') {
                    var nest = processSelector(sel.args[0], 0, value);
                    if (nest.length === 0) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return nest;
                        } else {
                            return processSelector(selectors, sidx + 1, nest);
                        }
                    }
                } else if (sel.selid === 'ANY') {
                    var nest = processSelector(sel.args[0], 0, value);

                    if (nest.length === 0) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return [nest[0]];
                        } else {
                            return processSelector(selectors, sidx + 1, [nest[0]]);
                        }
                    }
                } else if (sel.selid === 'UNIONALL') {
                    var nest = [];
                    sel.args.forEach(function(se) {
                        nest = nest.concat(processSelector(se, 0, value));
                    });
                    if (nest.length === 0) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return nest;
                        } else {
                            return processSelector(selectors, sidx + 1, nest);
                        }
                    }
                } else if (sel.selid === 'UNION') {
                    var nest = [];
                    sel.args.forEach(function(se) {
                        nest = nest.concat(processSelector(se, 0, value));
                    });
                    var nest = distinctArray(nest);
                    if (nest.length === 0) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return nest;
                        } else {
                            return processSelector(selectors, sidx + 1, nest);
                        }
                    }
                } else if (sel.selid === 'IF') {
                    var nest = processSelector(sel.args, 0, value);

                    if (nest.length === 0) {
                        return [];
                    } else {
                        if (sidx + 1 + 1 > selectors.length) {
                            return [value];
                        } else {
                            return processSelector(selectors, sidx + 1, value);
                        }
                    }
                } else if (sel.selid === 'REPEAT') {

                    var lvar,
                        lmax,
                        lmin = sel.args[0].value;
                    if (!sel.args[1]) {
                        lmax = lmin; // Add security break
                    } else {
                        lmax = sel.args[1].value;
                    }
                    if (sel.args[2]) {
                        lvar = sel.args[2].variable;
                    }
                    //var lsel = sel.sels;

                    var retval = [];

                    if (lmin === 0) {
                        if (sidx + 1 + 1 > selectors.length) {
                            retval = [value];
                        } else {
                            if (lvar) {
                                alasql.vars[lvar] = 0;
                            }
                            retval = retval.concat(processSelector(selectors, sidx + 1, value));
                        }
                    }

                    // var nests = processSelector(sel.sels,0,value).slice();
                    if (lmax > 0) {
                        var nests = [{value: value, lvl: 1}];

                        var i = 0;
                        while (nests.length > 0) {
                            var nest = nests[0];

                            nests.shift();
                            if (nest.lvl <= lmax) {
                                if (lvar) {
                                    alasql.vars[lvar] = nest.lvl;
                                }

                                var nest1 = processSelector(sel.sels, 0, nest.value);

                                nest1.forEach(function(n) {
                                    nests.push({value: n, lvl: nest.lvl + 1});
                                });
                                if (nest.lvl >= lmin) {
                                    if (sidx + 1 + 1 > selectors.length) {
                                        retval = retval.concat(nest1);
                                        //return nests;
                                    } else {
                                        nest1.forEach(function(n) {
                                            retval = retval.concat(
                                                processSelector(selectors, sidx + 1, n)
                                            );
                                        });
                                    }
                                }
                            }
                            // Security brake
                            i++;
                            if (i > SECURITY_BREAK) {
                                throw new Error('Security brake. Number of iterations = ' + i);
                            }
                        }
                    }
                    return retval;
                } else if (sel.selid === 'OF') {
                    if (sidx + 1 + 1 > selectors.length) {
                        return [value];
                    } else {
                        var r1 = [];
                        Object.keys(value).forEach(function(keyv) {
                            alasql.vars[sel.args[0].variable] = keyv;
                            r1 = r1.concat(processSelector(selectors, sidx + 1, value[keyv]));
                        });
                        return r1;
                    }
                } else if (sel.selid === 'TO') {

                    var oldv = alasql.vars[sel.args[0]];
                    var newv = [];
                    if (oldv !== undefined) {

                        newv = oldv.slice(0);

                    } else {
                        newv = [];
                    }
                    newv.push(value);

                    if (sidx + 1 + 1 > selectors.length) {
                        return [value];
                    } else {
                        alasql.vars[sel.args[0]] = newv;
                        var r1 = processSelector(selectors, sidx + 1, value);

                        alasql.vars[sel.args[0]] = oldv;
                        return r1;
                    }

                } else if (sel.selid === 'ARRAY') {
                    var nest = processSelector(sel.args, 0, value);
                    if (nest.length > 0) {
                        val = nest;
                    } else {
                        return [];
                    }
                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'SUM') {
                    var nest = processSelector(sel.args, 0, value);
                    if (nest.length > 0) {
                        var val = nest.reduce(function(sum, current) {
                            return sum + current;
                        }, 0);
                    } else {
                        return [];
                    }
                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'AVG') {
                    nest = processSelector(sel.args, 0, value);
                    if (nest.length > 0) {
                        val =
                            nest.reduce(function(sum, current) {
                                return sum + current;
                            }, 0) / nest.length;
                    } else {
                        return [];
                    }
                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'COUNT') {
                    nest = processSelector(sel.args, 0, value);
                    if (nest.length > 0) {
                        val = nest.length;
                    } else {
                        return [];
                    }
                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'FIRST') {
                    nest = processSelector(sel.args, 0, value);
                    if (nest.length > 0) {
                        val = nest[0];
                    } else {
                        return [];
                    }

                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'LAST') {
                    nest = processSelector(sel.args, 0, value);
                    if (nest.length > 0) {
                        val = nest[nest.length - 1];
                    } else {
                        return [];
                    }

                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'MIN') {
                    nest = processSelector(sel.args, 0, value);
                    if (nest.length === 0) {
                        return [];
                    }
                    var val = nest.reduce(function(min, current) {
                        return Math.min(min, current);
                    }, Infinity);
                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'MAX') {
                    var nest = processSelector(sel.args, 0, value);
                    if (nest.length === 0) {
                        return [];
                    }
                    var val = nest.reduce(function(max, current) {
                        return Math.max(max, current);
                    }, -Infinity);
                    if (sidx + 1 + 1 > selectors.length) {
                        return [val];
                    } else {
                        return processSelector(selectors, sidx + 1, val);
                    }
                } else if (sel.selid === 'PLUS') {
                    var retval = [];
                    //				retval = retval.concat(processSelector(selectors,sidx+1,n))
                    var nests = processSelector(sel.args, 0, value).slice();
                    if (sidx + 1 + 1 > selectors.length) {
                        retval = retval.concat(nests);
                    } else {
                        nests.forEach(function(n) {
                            retval = retval.concat(processSelector(selectors, sidx + 1, n));
                        });
                    }

                    var i = 0;
                    while (nests.length > 0) {
                        //					nest = nests[0];
                        //					nests.shift();
                        var nest = nests.shift();

                        nest = processSelector(sel.args, 0, nest);

                        nests = nests.concat(nest);

                        if (sidx + 1 + 1 > selectors.length) {
                            retval = retval.concat(nest);
                            //return retval;
                        } else {
                            nest.forEach(function(n) {

                                var rn = processSelector(selectors, sidx + 1, n);

                                retval = retval.concat(rn);
                            });
                        }

                        // Security brake
                        i++;
                        if (i > SECURITY_BREAK) {
                            throw new Error('Security brake. Number of iterations = ' + i);
                        }
                    }
                    return retval;

                } else if (sel.selid === 'STAR') {
                    var retval = [];
                    retval = processSelector(selectors, sidx + 1, value);
                    var nests = processSelector(sel.args, 0, value).slice();
                    if (sidx + 1 + 1 > selectors.length) {
                        retval = retval.concat(nests);
                        //return nests;
                    } else {
                        nests.forEach(function(n) {
                            retval = retval.concat(processSelector(selectors, sidx + 1, n));
                        });
                    }
                    var i = 0;
                    while (nests.length > 0) {
                        var nest = nests[0];
                        nests.shift();

                        nest = processSelector(sel.args, 0, nest);

                        nests = nests.concat(nest);

                        if (sidx + 1 + 1 <= selectors.length) {
                            nest.forEach(function(n) {
                                retval = retval.concat(processSelector(selectors, sidx + 1, n));
                            });
                        }

                        // Security brake
                        i++;
                        if (i > SECURITY_BREAK) {
                            throw new Error('Loop brake. Number of iterations = ' + i);
                        }
                    }

                    return retval;
                } else if (sel.selid === 'QUESTION') {
                    var retval = [];
                    retval = retval.concat(processSelector(selectors, sidx + 1, value));
                    var nest = processSelector(sel.args, 0, value);
                    if (sidx + 1 + 1 <= selectors.length) {
                        nest.forEach(function(n) {
                            retval = retval.concat(processSelector(selectors, sidx + 1, n));
                        });
                    }
                    return retval;
                } else if (sel.selid === 'WITH') {
                    var nest = processSelector(sel.args, 0, value);

                    if (nest.length === 0) {
                        return [];
                    } else {

                        var r = {status: 1, values: nest};
                    }
                } else if (sel.selid === 'ROOT') {
                    if (sidx + 1 + 1 > selectors.length) {
                        return [value];
                    } else {
                        return processSelector(selectors, sidx + 1, fromdata);
                    }
                } else {
                    throw new Error('Wrong selector ' + sel.selid);
                }
            } else if (sel.srchid) {
                var r = alasql.srch[sel.srchid.toUpperCase()](value, sel.args, stope, params);

            } else {
                throw new Error('Selector not found');
            }

            if (typeof r === 'undefined') {
                r = {status: 1, values: [value]};
            }

            var res = [];
            if (r.status === 1) {
                var arr = r.values;

                if (sidx + 1 + 1 > selectors.length) {
                    //			if(sidx+1+1 > selectors.length) {
                    res = arr;

                } else {
                    for (var i = 0; i < r.values.length; i++) {
                        res = res.concat(processSelector(selectors, sidx + 1, arr[i]));
                    }
                }
            }
            return res;
        }

        if (selectors !== undefined && selectors.length > 0) {

            if (
                selectors &&
                selectors[0] &&
                selectors[0].srchid === 'PROP' &&
                selectors[0].args &&
                selectors[0].args[0]
            ) {

                if (selectors[0].args[0].toUpperCase() === 'XML') {
                    stope.mode = 'XML';
                    selectors.shift();
                } else if (selectors[0].args[0].toUpperCase() === 'HTML') {
                    stope.mode = 'HTML';
                    selectors.shift();
                } else if (selectors[0].args[0].toUpperCase() === 'JSON') {
                    stope.mode = 'JSON';
                    selectors.shift();
                }
            }
            if (selectors.length > 0 && selectors[0].srchid === 'VALUE') {
                stope.value = true;
                selectors.shift();
            }
        }

        if (this.from instanceof yy.Column) {
            var dbid = this.from.databaseid || databaseid;
            fromdata = alasql.databases[dbid].tables[this.from.columnid].data;
            //selectors.unshift({srchid:'CHILD'});
        } else if (this.from instanceof yy.FuncValue && alasql.from[this.from.funcid.toUpperCase()]) {
            var args = this.from.args.map(function(arg) {
                var as = arg.toJS();

                var fn = new Function('params,alasql', 'var y;return ' + as).bind(this);
                return fn(params, alasql);
            });

            fromdata = alasql.from[this.from.funcid.toUpperCase()].apply(this, args);

        } else if (typeof this.from === 'undefined') {
            fromdata = alasql.databases[databaseid].objects;
        } else {
            var fromfn = new Function('params,alasql', 'var y;return ' + this.from.toJS());
            fromdata = fromfn(params, alasql);
            // Check for Mogo Collections
            if (
                typeof Mongo === 'object' &&
                typeof Mongo.Collection !== 'object' &&
                fromdata instanceof Mongo.Collection
            ) {
                fromdata = fromdata.find().fetch();
            }

            //		if(typeof fromdata == 'object' && Array.isArray(fromdata)) {
            //			selectors.unshift({srchid:'CHILD'});
            //		}
        }

        // If source data is array than first step is to run over array
        //	var selidx = 0;
        //	var selvalue = fromdata;

        if (selectors !== undefined && selectors.length > 0) {
            // Init variables for TO() selectors

            if (false) {
                selectors.forEach(function(selector) {
                    if (selector.srchid === 'TO') {
                        //* @todo move to TO selector
                        alasql.vars[selector.args[0]] = [];
                        // TODO - process nested selectors
                    }
                });
            }

            res = processSelector(selectors, 0, fromdata);
        } else {
            res = fromdata;
        }

        if (this.into) {
            var a1, a2;
            if (typeof this.into.args[0] !== 'undefined') {
                a1 = new Function('params,alasql', 'var y;return ' + this.into.args[0].toJS())(
                    params,
                    alasql
                );
            }
            if (typeof this.into.args[1] !== 'undefined') {
                a2 = new Function('params,alasql', 'var y;return ' + this.into.args[1].toJS())(
                    params,
                    alasql
                );
            }
            res = alasql.into[this.into.funcid.toUpperCase()](a1, a2, res, [], cb);
        } else {
            if (stope.value && res.length > 0) {
                res = res[0];
            }
            if (cb) {
                res = cb(res);
            }
        }
        return res;
    }

    /**
     Search class
     @class
     @example
     SEARCH SUM(/a) FROM ? -- search over parameter object
     */

    yy.Search = function(params) {
        return yy.extend(this, params);
    };

    yy.Search.prototype.toString = function() {
        var s = 'SEARCH' + ' ';
        if (this.selectors) {
            s += this.selectors.toString();
        }
        if (this.from) {
            s += 'FROM' + ' ' + this.from.toString();
        }

        return s;
    };

    yy.Search.prototype.toJS = function(context) {

        var s = 'this.queriesfn[' + (this.queriesidx - 1) + '](this.params,null,' + context + ')';
        // var s = '';
        return s;
    };

    yy.Search.prototype.compile = function(databaseid) {
        var dbid = databaseid;
        var self = this;

        var statement = function(params, cb) {

            var res;
            doSearch.bind(self)(dbid, params, function(data) {

                res = modify(statement.query, data);

                if (cb) {
                    res = cb(res);
                }
            });

            //		if(cb) res = cb(res);
            return res;
        };
        statement.query = {};
        return statement;
    };

// List of search functions
    alasql.srch = {};

    alasql.srch.PROP = function(val, args, stope) {

        if (stope.mode === 'XML') {
            var arr = [];
            val.children.forEach(function(v) {
                if (v.name.toUpperCase() === args[0].toUpperCase()) {
                    arr.push(v);
                }
            });
            if (arr.length > 0) {
                return {status: 1, values: arr};
            } else {
                return {status: -1, values: []};
            }
        } else {
            if (
                typeof val !== 'object' ||
                val === null ||
                typeof args !== 'object' ||
                typeof val[args[0]] === 'undefined'
            ) {
                return {status: -1, values: []};
            } else {
                return {status: 1, values: [val[args[0]]]};
            }
        }
    };

    alasql.srch.APROP = function(val, args) {
        if (
            typeof val !== 'object' ||
            val === null ||
            typeof args !== 'object' ||
            typeof val[args[0]] === 'undefined'
        ) {
            return {status: 1, values: [undefined]};
        } else {
            return {status: 1, values: [val[args[0]]]};
        }
    };

// Test expression
    alasql.srch.EQ = function(val, args, stope, params) {
        var exprs = args[0].toJS('x', '');
        var exprfn = new Function('x,alasql,params', 'return ' + exprs);
        if (val === exprfn(val, alasql, params)) {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

// Test expression
    alasql.srch.LIKE = function(val, args, stope, params) {
        var exprs = args[0].toJS('x', '');
        var exprfn = new Function('x,alasql,params', 'return ' + exprs);
        if (
            val.toUpperCase().match(
                new RegExp(
                    '^' +
                    exprfn(val, alasql, params)
                        .toUpperCase()
                        .replace(/%/g, '.*')
                        .replace(/\?|_/g, '.') +
                    '$'
                ),
                'g'
            )
        ) {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

    alasql.srch.ATTR = function(val, args, stope) {
        if (stope.mode === 'XML') {
            if (typeof args === 'undefined') {
                return {status: 1, values: [val.attributes]};
            } else {
                if (
                    typeof val === 'object' &&
                    typeof val.attributes === 'object' &&
                    typeof val.attributes[args[0]] !== 'undefined'
                ) {
                    return {status: 1, values: [val.attributes[args[0]]]};
                } else {
                    return {status: -1, values: []};
                }
            }
        } else {
            throw new Error('ATTR is not using in usual mode');
        }
    };

    alasql.srch.CONTENT = function(val, args, stope) {
        if (stope.mode === 'XML') {
            return {status: 1, values: [val.content]};
        } else {
            throw new Error('ATTR is not using in usual mode');
        }
    };

    alasql.srch.SHARP = function(val, args) {
        var obj = alasql.databases[alasql.useid].objects[args[0]];
        if (typeof val !== 'undefined' && val === obj) {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

    alasql.srch.PARENT = function(/*val,args,stope*/) {
        // TODO: implement
        console.error('PARENT not implemented', arguments);

        return {status: -1, values: []};
    };

    alasql.srch.CHILD = function(val, args, stope) {

        if (typeof val === 'object') {
            if (Array.isArray(val)) {
                return {status: 1, values: val};
            } else {
                if (stope.mode === 'XML') {
                    return {
                        status: 1,
                        values: Object.keys(val.children).map(function(key) {
                            return val.children[key];
                        }),
                    };
                } else {
                    return {
                        status: 1,
                        values: Object.keys(val).map(function(key) {
                            return val[key];
                        }),
                    };
                }
            }
        } else {
            // If primitive value
            return {status: 1, values: []};
        }
    };

// Return all keys
    alasql.srch.KEYS = function(val) {
        if (typeof val === 'object' && val !== null) {
            return {status: 1, values: Object.keys(val)};
        } else {
            // If primitive value
            return {status: 1, values: []};
        }
    };

// Test expression
    alasql.srch.WHERE = function(val, args, stope, params) {
        var exprs = args[0].toJS('x', '');
        var exprfn = new Function('x,alasql,params', 'return ' + exprs);
        if (exprfn(val, alasql, params)) {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

    alasql.srch.NAME = function(val, args) {
        if (val.name === args[0]) {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

    alasql.srch.CLASS = function(val, args) {

        // Please avoid `===` here
        if (val.$class == args) {
            // jshint ignore:line
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

// Transform expression
    alasql.srch.VERTEX = function(val) {
        if (val.$node === 'VERTEX') {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

// Transform expression
    alasql.srch.INSTANCEOF = function(val, args) {
        if (val instanceof alasql.fn[args[0]]) {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

// Transform expression
    alasql.srch.EDGE = function(val) {
        if (val.$node === 'EDGE') {
            return {status: 1, values: [val]};
        } else {
            return {status: -1, values: []};
        }
    };

// Transform expression
    alasql.srch.EX = function(val, args, stope, params) {
        var exprs = args[0].toJS('x', '');
        var exprfn = new Function('x,alasql,params', 'return ' + exprs);
        return {status: 1, values: [exprfn(val, alasql, params)]};
    };

// Transform expression
    alasql.srch.RETURN = function(val, args, stope, params) {
        var res = {};
        if (args && args.length > 0) {
            args.forEach(function(arg) {
                var exprs = arg.toJS('x', '');
                var exprfn = new Function('x,alasql,params', 'return ' + exprs);
                if (typeof arg.as === 'undefined') {
                    arg.as = arg.toString();
                }
                res[arg.as] = exprfn(val, alasql, params);
            });
        }
        return {status: 1, values: [res]};
    };

// Transform expression
    alasql.srch.REF = function(val) {
        return {status: 1, values: [alasql.databases[alasql.useid].objects[val]]};
    };

// Transform expression
    alasql.srch.OUT = function(val) {
        if (val.$out && val.$out.length > 0) {
            var res = val.$out.map(function(v) {
                return alasql.databases[alasql.useid].objects[v];
            });
            return {status: 1, values: res};
        } else {
            return {status: -1, values: []};
        }
    };

    alasql.srch.OUTOUT = function(val) {
        if (val.$out && val.$out.length > 0) {
            var res = [];
            val.$out.forEach(function(v) {
                var av = alasql.databases[alasql.useid].objects[v];
                if (av && av.$out && av.$out.length > 0) {
                    av.$out.forEach(function(vv) {
                        res = res.concat(alasql.databases[alasql.useid].objects[vv]);
                    });
                }
            });
            return {status: 1, values: res};
        } else {
            return {status: -1, values: []};
        }
    };

// Transform expression
    alasql.srch.IN = function(val) {
        if (val.$in && val.$in.length > 0) {
            var res = val.$in.map(function(v) {
                return alasql.databases[alasql.useid].objects[v];
            });
            return {status: 1, values: res};
        } else {
            return {status: -1, values: []};
        }
    };

    alasql.srch.ININ = function(val) {
        if (val.$in && val.$in.length > 0) {
            var res = [];
            val.$in.forEach(function(v) {
                var av = alasql.databases[alasql.useid].objects[v];
                if (av && av.$in && av.$in.length > 0) {
                    av.$in.forEach(function(vv) {
                        res = res.concat(alasql.databases[alasql.useid].objects[vv]);
                    });
                }
            });
            return {status: 1, values: res};
        } else {
            return {status: -1, values: []};
        }
    };

// Transform expression
    alasql.srch.AS = function(val, args) {
        alasql.vars[args[0]] = val;
        return {status: 1, values: [val]};
    };

// Transform expression
    alasql.srch.AT = function(val, args) {
        var v = alasql.vars[args[0]];
        return {status: 1, values: [v]};
    };

// Transform expression
    alasql.srch.CLONEDEEP = function(val) {
        // TODO something wrong
        var z = cloneDeep(val);
        return {status: 1, values: [z]};
    };

// // Transform expression
// alasql.srch.DELETE = function(val,args) {

// };

// Transform expression
    alasql.srch.SET = function(val, args, stope, params) {

        var s = args
            .map(function(st) {

                if (st.method === '@') {
                    return "alasql.vars['" + st.variable + "']=" + st.expression.toJS('x', '');
                } else if (st.method === '$') {
                    return "params['" + st.variable + "']=" + st.expression.toJS('x', '');
                } else {
                    return "x['" + st.column.columnid + "']=" + st.expression.toJS('x', '');
                }
            })
            .join(';');
        var setfn = new Function('x,params,alasql', s);

        setfn(val, params, alasql);

        return {status: 1, values: [val]};
    };

    alasql.srch.ROW = function(val, args, stope, params) {
        var s = 'var y;return [';

        s += args
            .map(function(arg) {
                return arg.toJS('x', '');
            })
            .join(',');
        s += ']';
        var setfn = new Function('x,params,alasql', s);
        var rv = setfn(val, params, alasql);

        return {status: 1, values: [rv]};
    };

    alasql.srch.D3 = function(val) {
        if (val.$node !== 'VERTEX' && val.$node === 'EDGE') {
            val.source = val.$in[0];
            val.target = val.$out[0];
        }

        return {status: 1, values: [val]};
    };

    var compileSearchOrder = function(order) {
        if (order) {

            if (
                order &&
                order.length === 1 &&
                order[0].expression &&
                typeof order[0].expression === 'function'
            ) {

                var func = order[0].expression;

                return function(a, b) {
                    var ra = func(a),
                        rb = func(b);
                    if (ra > rb) {
                        return 1;
                    }
                    if (ra === rb) {
                        return 0;
                    }
                    return -1;
                };
            }

            var s = '';
            var sk = '';
            order.forEach(function(ord) {

                // Date conversion
                var dg = '';

                if (ord.expression instanceof yy.NumValue) {
                    ord.expression = self.columns[ord.expression.value - 1];
                }

                if (ord.expression instanceof yy.Column) {
                    var columnid = ord.expression.columnid;

                    if (alasql.options.valueof) {
                        dg = '.valueOf()'; // TODO Check
                    }
                    // COLLATE NOCASE
                    if (ord.nocase) {
                        dg += '.toUpperCase()';
                    }

                    if (columnid === '_') {
                        s +=
                            'if(a' +
                            dg +
                            (ord.direction === 'ASC' ? '>' : '<') +
                            'b' +
                            dg +
                            ')return 1;';
                        s += 'if(a' + dg + '==b' + dg + '){';
                    } else {
                        s +=
                            "if((a['" +
                            columnid +
                            "']||'')" +
                            dg +
                            (ord.direction === 'ASC' ? '>' : '<') +
                            "(b['" +
                            columnid +
                            "']||'')" +
                            dg +
                            ')return 1;';
                        s +=
                            "if((a['" +
                            columnid +
                            "']||'')" +
                            dg +
                            "==(b['" +
                            columnid +
                            "']||'')" +
                            dg +
                            '){';
                    }
                } else {
                    dg = '.valueOf()';
                    // COLLATE NOCASE
                    if (ord.nocase) {
                        dg += '.toUpperCase()';
                    }
                    s +=
                        'if((' +
                        ord.toJS('a', '') +
                        "||'')" +
                        dg +
                        (ord.direction === 'ASC' ? '>(' : '<(') +
                        ord.toJS('b', '') +
                        "||'')" +
                        dg +
                        ')return 1;';
                    s +=
                        'if((' +
                        ord.toJS('a', '') +
                        "||'')" +
                        dg +
                        '==(' +
                        ord.toJS('b', '') +
                        "||'')" +
                        dg +
                        '){';
                }

                // TODO Add date comparision
                // s += 'if(a[\''+columnid+"']"+dg+(ord.direction == 'ASC'?'>':'<')+'b[\''+columnid+"']"+dg+')return 1;';
                // s += 'if(a[\''+columnid+"']"+dg+'==b[\''+columnid+"']"+dg+'){';
                //			}
                sk += '}';
            });
            s += 'return 0;';
            s += sk + 'return -1';

            return new Function('a,b', s);
        }
    };

    alasql.srch.ORDERBY = function(val, args /*,stope*/) {

        var res = val.sort(compileSearchOrder(args));
        return {status: 1, values: res};
    };

// Main query procedure
    function queryfn(query, oldscope, cb, A, B) {
        var aaa = query.sources.length;

        var ms;
        query.sourceslen = query.sources.length;
        var slen = query.sourceslen;
        query.query = query; // TODO Remove to prevent memory leaks
        query.A = A;
        query.B = B;
        query.cb = cb;
        query.oldscope = oldscope;

        // Run all subqueries before main statement
        if (query.queriesfn) {
            query.sourceslen += query.queriesfn.length;
            slen += query.queriesfn.length;

            query.queriesdata = [];

            query.queriesfn.forEach(function(q, idx) {
                //			if(query.explain) ms = Date.now();

                //			var res = flatArray(q(query.params,null,queryfn2,(-idx-1),query));

                //			var res = flatArray(queryfn(q.query,null,queryfn2,(-idx-1),query));

                q.query.params = query.params;
                //			query.queriesdata[idx] =

                //	if(false) {
                //			queryfn(q.query,query.oldscope,queryfn2,(-idx-1),query);
                //	} else {
                queryfn2([], -idx - 1, query);
                //	}

                //			query.explaination.push({explid: query.explid++, description:'Query '+idx,ms:Date.now()-ms});
                //			query.queriesdata[idx] = res;
                //			return res;
            });

        }

        var scope;
        if (!oldscope) scope = {};
        else scope = cloneDeep(oldscope);
        query.scope = scope;

        // First - refresh data sources

        var result;
        query.sources.forEach(function(source, idx) {
            //		source.data = query.database.tables[source.tableid].data;

            source.query = query;
            var rs = source.datafn(query, query.params, queryfn2, idx, alasql);

            if (typeof rs !== 'undefined') {
                // TODO - this is a hack: check if result is array - check all cases and
                // make it more logical
                if ((query.intofn || query.intoallfn) && Array.isArray(rs)) rs = rs.length;
                result = rs;
            }
            //
            // Ugly hack to use in query.wherefn and source.srcwherefns functions
            // constructions like this.queriesdata['test'].
            // I can elimite it with source.srcwherefn.bind(this)()
            // but it may be slow.
            //
            source.queriesdata = query.queriesdata;
        });
        if (query.sources.length == 0 || 0 === slen) result = queryfn3(query);

        return result;
    }

    function queryfn2(data, idx, query) {

        //console.trace();

        if (idx >= 0) {
            var source = query.sources[idx];
            source.data = data;
            if (typeof source.data == 'function') {
                source.getfn = source.data;
                source.dontcache = source.getfn.dontcache;

                //			var prevsource = query.sources[h-1];
                if (
                    source.joinmode == 'OUTER' ||
                    source.joinmode == 'RIGHT' ||
                    source.joinmode == 'ANTI'
                ) {
                    source.dontcache = false;
                }
                source.data = {};
            }
        } else {
            // subqueries

            query.queriesdata[-idx - 1] = flatArray(data);

        }

        query.sourceslen--;
        if (query.sourceslen > 0) return;

        return queryfn3(query);
    }

    function queryfn3(query) {
        var scope = query.scope,
            jlen;

        // Preindexation of data sources
        //	if(!oldscope) {
        preIndex(query);
        //	}

        // query.sources.forEach(function(source) {

        // });

        // Prepare variables
        query.data = [];
        query.xgroups = {};
        query.groups = [];

        // Level of Joins
        var h = 0;

        // Start walking over data

        doJoin(query, scope, h);

        // If groupping, then filter groups with HAVING function

        if (query.groupfn) {
            query.data = [];
            if (0 === query.groups.length) {
                var g = {};
                if (query.selectGroup.length > 0) {

                    query.selectGroup.forEach(function(sg) {
                        if (sg.aggregatorid == 'COUNT' || sg.aggregatorid == 'SUM') {
                            g[sg.nick] = 0;
                        } else {
                            g[sg.nick] = undefined;
                        }
                    });
                }
                query.groups = [g];

            }

            // ******

            if (query.aggrKeys.length > 0) {
                var gfns = '';
                query.aggrKeys.forEach(function(col) {
                    gfns +=
                        "g['" +
                        col.nick +
                        "']=alasql.aggr['" +
                        col.funcid +
                        "'](undefined,g['" +
                        col.nick +
                        "'],3);";
                    //				gfns += 'return g[\''+col.nick+'\];';
                });

                var gfn = new Function('g,params,alasql', 'var y;' + gfns);
            }

            //					return "'"+colas+'\':alasql.aggr[\''+col.funcid+'\']('+colexp+',undefined,(acc={}),1),'
            //					+'\'__REDUCE__'+colas+'\':acc,';

            // *******

            // 	debugger;
            // if(false && (query.groups.length == 1) && (Object.keys(query.groups[0]).length == 0)) {

            // } else {
            for (var i = 0, ilen = query.groups.length; i < ilen; i++) {
                var g = query.groups[i];

                if (gfn) gfn(g, query.params, alasql);

                if (!query.havingfn || query.havingfn(g, query.params, alasql)) {

                    var d = query.selectgfn(g, query.params, alasql);
                    query.data.push(d);
                }
            }
            // }

            //			query.groups = query.groups.filter();
        }
        // Remove distinct values
        doDistinct(query);

        // UNION / UNION ALL
        if (query.unionallfn) {
            // TODO Simplify this part of program
            var ud, nd;
            if (query.corresponding) {
                if (!query.unionallfn.query.modifier) query.unionallfn.query.modifier = undefined;
                ud = query.unionallfn(query.params);
            } else {
                if (!query.unionallfn.query.modifier) query.unionallfn.query.modifier = 'RECORDSET';
                nd = query.unionallfn(query.params);
                ud = [];
                ilen = nd.data.length;
                for (var i = 0; i < ilen; i++) {
                    var r = {};
                    for (var j = Math.min(query.columns.length, nd.columns.length) - 1; 0 <= j; j--) {
                        r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
                    }
                    ud.push(r);
                }
            }
            query.data = query.data.concat(ud);
        } else if (query.unionfn) {
            if (query.corresponding) {
                if (!query.unionfn.query.modifier) query.unionfn.query.modifier = 'ARRAY';
                ud = query.unionfn(query.params);
            } else {
                if (!query.unionfn.query.modifier) query.unionfn.query.modifier = 'RECORDSET';
                nd = query.unionfn(query.params);
                ud = [];
                ilen = nd.data.length;
                for (var i = 0; i < ilen; i++) {
                    r = {};
                    jlen = Math.min(query.columns.length, nd.columns.length);
                    for (var j = 0; j < jlen; j++) {
                        r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
                    }
                    ud.push(r);
                }
            }

            query.data = arrayUnionDeep(query.data, ud);
        } else if (query.exceptfn) {
            if (query.corresponding) {
                if (!query.exceptfn.query.modifier) query.exceptfn.query.modifier = 'ARRAY';
                var ud = query.exceptfn(query.params);
            } else {
                if (!query.exceptfn.query.modifier) query.exceptfn.query.modifier = 'RECORDSET';
                var nd = query.exceptfn(query.params);
                var ud = [];
                for (var i = 0, ilen = nd.data.length; i < ilen; i++) {
                    var r = {};
                    for (var j = Math.min(query.columns.length, nd.columns.length) - 1; 0 <= j; j--) {
                        r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
                    }
                    ud.push(r);
                }
            }

            query.data = arrayExceptDeep(query.data, ud);
        } else if (query.intersectfn) {
            if (query.corresponding) {
                if (!query.intersectfn.query.modifier) query.intersectfn.query.modifier = undefined;
                ud = query.intersectfn(query.params);
            } else {
                if (!query.intersectfn.query.modifier) query.intersectfn.query.modifier = 'RECORDSET';
                nd = query.intersectfn(query.params);
                ud = [];
                ilen = nd.data.length;
                for (i = 0; i < ilen; i++) {
                    r = {};
                    jlen = Math.min(query.columns.length, nd.columns.length);
                    for (j = 0; j < jlen; j++) {
                        r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
                    }
                    ud.push(r);
                }
            }

            query.data = arrayIntersectDeep(query.data, ud);
        }

        // Ordering
        if (query.orderfn) {
            if (query.explain) var ms = Date.now();
            query.data = query.data.sort(query.orderfn);
            if (query.explain) {
                query.explaination.push({
                    explid: query.explid++,
                    description: 'QUERY BY',
                    ms: Date.now() - ms,
                });
            }
        }

        // Reduce to limit and offset
        doLimit(query);

        // Remove Angular.js artifacts and other unnecessary columns
        // Issue #25

        // TODO: Check what artefacts rest from Angular.js
        if (typeof angular != 'undefined') {
            query.removeKeys.push('$$hashKey');
        }

        if (query.removeKeys.length > 0) {
            var removeKeys = query.removeKeys;

            // Remove from data
            jlen = removeKeys.length;
            if (jlen > 0) {
                ilen = query.data.length;
                for (i = 0; i < ilen; i++) {
                    for (j = 0; j < jlen; j++) {
                        delete query.data[i][removeKeys[j]];
                    }
                }
            }

            // Remove from columns list
            if (query.columns.length > 0) {
                query.columns = query.columns.filter(function(column) {
                    var found = false;
                    removeKeys.forEach(function(key) {
                        if (column.columnid == key) found = true;
                    });
                    return !found;
                });
            }
        }

        if (typeof query.removeLikeKeys != 'undefined' && query.removeLikeKeys.length > 0) {
            var removeLikeKeys = query.removeLikeKeys;

            // Remove unused columns
            // SELECT * REMOVE COLUMNS LIKE "%b"
            for (var i = 0, ilen = query.data.length; i < ilen; i++) {
                r = query.data[i];
                for (var k in r) {
                    for (j = 0; j < query.removeLikeKeys.length; j++) {
                        if (alasql.utils.like(query.removeLikeKeys[j], k)) {
                            //					if(k.match(query.removeLikeKeys[j])) {
                            delete r[k];
                        }
                    }
                }
            }

            if (query.columns.length > 0) {
                query.columns = query.columns.filter(function(column) {
                    var found = false;
                    removeLikeKeys.forEach(function(key) {
                        //					if(column.columnid.match(key)) found = true;
                        if (alasql.utils.like(key, column.columnid)) {
                            found = true;
                        }
                    });
                    return !found;
                });
            }
        }

        if (query.pivotfn) query.pivotfn();
        if (query.unpivotfn) query.unpivotfn();

        if (query.intoallfn) {

            //		var res = query.intoallfn(query.columns,query.cb,query.A, query.B, alasql);
            var res = query.intoallfn(query.columns, query.cb, query.params, query.alasql);

            //		if(query.cb) res = query.cb(res,query.A, query.B);

            //		debugger;
            return res;
        } else if (query.intofn) {
            ilen = query.data.length;
            for (i = 0; i < ilen; i++) {
                query.intofn(query.data[i], i, query.params, query.alasql);
            }

            if (query.cb) query.cb(query.data.length, query.A, query.B);
            return query.data.length;
        } else {

            res = query.data;
            if (query.cb) res = query.cb(query.data, query.A, query.B);
            return res;
        }
    }

// Limiting
    function doLimit(query) {

        if (query.limit) {
            var offset = 0;
            if (query.offset) {
                offset = query.offset | 0 || 0;
                offset = offset < 0 ? 0 : offset;
            }
            var limit;
            if (query.percent) {
                limit = ((query.data.length * query.limit / 100) | 0) + offset;
            } else {
                limit = (query.limit | 0) + offset;
            }
            query.data = query.data.slice(offset, limit);
        }
    }

// Distinct
    function doDistinct(query) {
        if (query.distinct) {
            var uniq = {};
            // TODO: Speedup, because Object.keys is slow**
            // TODO: Problem with DISTINCT on objects
            var keys = Object.keys(query.data[0] || []);
            for (var i = 0, ilen = query.data.length; i < ilen; i++) {
                var uix = keys
                    .map(function(k) {
                        return query.data[i][k];
                    })
                    .join('`');
                uniq[uix] = query.data[i];
            }
            query.data = [];
            for (var key in uniq) {
                query.data.push(uniq[key]);
            }
        }
    }

// Optimization: preliminary indexation of joins
    var preIndex = function(query) {

        // Loop over all sources
        // Todo: make this loop smaller and more graspable
        for (var k = 0, klen = query.sources.length; k < klen; k++) {
            var source = query.sources[k];
            delete source.ix;
            // If there is indexation rule

            if (k > 0 && source.optimization == 'ix' && source.onleftfn && source.onrightfn) {
                // If there is no table.indices - create it
                if (source.databaseid && alasql.databases[source.databaseid].tables[source.tableid]) {
                    if (!alasql.databases[source.databaseid].tables[source.tableid].indices)
                        query.database.tables[source.tableid].indices = {};
                    // Check if index already exists
                    var ixx =
                        alasql.databases[source.databaseid].tables[source.tableid].indices[
                            hash(source.onrightfns + '`' + source.srcwherefns)
                            ];
                    if (!alasql.databases[source.databaseid].tables[source.tableid].dirty && ixx) {
                        source.ix = ixx;
                    }
                }

                if (!source.ix) {
                    source.ix = {};
                    // Walking over source data
                    var scope = {};
                    var i = 0;
                    var ilen = source.data.length;
                    var dataw;
                    //				while(source.getfn i<ilen) {

                    while (
                    (dataw = source.data[i]) ||
                    (source.getfn && (dataw = source.getfn(i))) ||
                    i < ilen
                        ) {
                        if (source.getfn && !source.dontcache) source.data[i] = dataw;
                        //					scope[tableid] = dataw;

                        //				for(var i=0, ilen=source.data.length; i<ilen; i++) {
                        // Prepare scope for indexation
                        scope[source.alias || source.tableid] = dataw;

                        // Check if it apply to where function
                        if (source.srcwherefn(scope, query.params, alasql)) {
                            // Create index entry for each address
                            var addr = source.onrightfn(scope, query.params, alasql);
                            var group = source.ix[addr];
                            if (!group) {
                                group = source.ix[addr] = [];
                            }
                            group.push(dataw);
                        }
                        i++;
                    }

                    if (
                        source.databaseid &&
                        alasql.databases[source.databaseid].tables[source.tableid]
                    ) {
                        // Save index to original table
                        alasql.databases[source.databaseid].tables[source.tableid].indices[
                            hash(source.onrightfns + '`' + source.srcwherefns)
                            ] =
                            source.ix;
                    }
                }

                // Optimization for WHERE column = expression
            } else if (source.wxleftfn) {
                if (!alasql.databases[source.databaseid].engineid) {
                    // Check if index exists
                    ixx =
                        alasql.databases[source.databaseid].tables[source.tableid].indices[
                            hash(source.wxleftfns + '`')
                            ];
                }
                if (!alasql.databases[source.databaseid].tables[source.tableid].dirty && ixx) {
                    // Use old index if exists
                    source.ix = ixx;
                    // Reduce data (apply filter)
                    source.data = source.ix[source.wxrightfn(null, query.params, alasql)];
                } else {
                    // Create new index
                    source.ix = {};
                    // Prepare scope
                    scope = {};
                    // Walking on each source line
                    i = 0;
                    ilen = source.data.length;
                    dataw;
                    //				while(source.getfn i<ilen) {

                    while (
                    (dataw = source.data[i]) ||
                    (source.getfn && (dataw = source.getfn(i))) ||
                    i < ilen
                        ) {
                        if (source.getfn && !source.dontcache) source.data[i] = dataw;
                        //					for(var i=0, ilen=source.data.length; i<ilen; i++) {
                        scope[source.alias || source.tableid] = source.data[i];
                        // Create index entry
                        addr = source.wxleftfn(scope, query.params, alasql);
                        group = source.ix[addr];
                        if (!group) {
                            group = source.ix[addr] = [];
                        }
                        group.push(source.data[i]);
                        i++;
                    }
                    //					query.database.tables[source.tableid].indices[hash(source.wxleftfns+'`'+source.onwherefns)] = source.ix;
                    if (!alasql.databases[source.databaseid].engineid) {
                        alasql.databases[source.databaseid].tables[source.tableid].indices[
                            hash(source.wxleftfns + '`')
                            ] =
                            source.ix;
                    }
                }
                // Apply where filter to reduces rows
                if (source.srcwherefns) {
                    if (source.data) {
                        scope = {};
                        source.data = source.data.filter(function(r) {
                            scope[source.alias] = r;
                            return source.srcwherefn(scope, query.params, alasql);
                        });
                    } else {
                        source.data = [];
                    }
                }
                //			}
                // If there is no any optimization than apply srcwhere filter
            } else if (source.srcwherefns && !source.dontcache) {
                if (source.data) {
                    var scope = {};
                    // TODO!!!!! Data as Function

                    source.data = source.data.filter(function(r) {
                        scope[source.alias] = r;

                        return source.srcwherefn(scope, query.params, alasql);
                    });

                    scope = {};
                    i = 0;
                    ilen = source.data.length;
                    //var dataw;
                    var res = [];
                    //				while(source.getfn i<ilen) {

                    while (
                    (dataw = source.data[i]) ||
                    (source.getfn && (dataw = source.getfn(i))) ||
                    i < ilen
                        ) {
                        if (source.getfn && !source.dontcache) source.data[i] = dataw;
                        scope[source.alias] = dataw;
                        if (source.srcwherefn(scope, query.params, alasql)) res.push(dataw);
                        i++;
                    }
                    source.data = res;
                } else {
                    source.data = [];
                }
            }
            // Change this to another place (this is a wrong)
            if (source.databaseid && alasql.databases[source.databaseid].tables[source.tableid]) {
                //query.database.tables[source.tableid].dirty = false;
            } else {
                // this is a subquery?
            }
        }
    };

//
// Join all lines over sources
//

    function doJoin(query, scope, h) {

        // Check, if this is a last join?
        if (h >= query.sources.length) {
            // Todo: check if this runs once too many

            // Then apply where and select

            if (query.wherefn(scope, query.params, alasql)) {

                //			var res = query.selectfn(scope, query.params, alasql);

                // If there is a GROUP BY then pipe to groupping function
                if (query.groupfn) {
                    query.groupfn(scope, query.params, alasql);
                } else {
                    //				query.qwerty = 999;

                    query.data.push(query.selectfn(scope, query.params, alasql));
                }
            }
        } else if (query.sources[h].applyselect) {

            var source = query.sources[h];
            source.applyselect(
                query.params,
                function(data) {
                    if (data.length > 0) {

                        for (var i = 0; i < data.length; i++) {
                            scope[source.alias] = data[i];
                            doJoin(query, scope, h + 1);
                        }
                    } else {
                        if (source.applymode == 'OUTER') {
                            scope[source.alias] = {};
                            doJoin(query, scope, h + 1);
                        }
                    }
                },
                scope
            );

        } else {
            // STEP 1

            var source = query.sources[h];
            var nextsource = query.sources[h + 1];

            //		if(source.joinmode == "LEFT" || source.joinmode == "INNER" || source.joinmode == "RIGHT"
            //			|| source.joinmode == "OUTER" || source.joinmode == "SEMI") {
            // Todo: check if this is smart
            if (true) {
                //source.joinmode != "ANTI") {

                var tableid = source.alias || source.tableid;
                var pass = false; // For LEFT JOIN
                var data = source.data;
                var opt = false;

                // Reduce data for looping if there is optimization hint
                if (!source.getfn || (source.getfn && !source.dontcache)) {
                    if (
                        source.joinmode != 'RIGHT' &&
                        source.joinmode != 'OUTER' &&
                        source.joinmode != 'ANTI' &&
                        source.optimization == 'ix'
                    ) {
                        data = source.ix[source.onleftfn(scope, query.params, alasql)] || [];
                        opt = true;

                    }
                }

                // Main cycle
                var i = 0;
                if (typeof data == 'undefined') {
                    throw new Error('Data source number ' + h + ' in undefined');
                }
                var ilen = data.length;
                var dataw;

                while (
                (dataw = data[i]) ||
                (!opt && (source.getfn && (dataw = source.getfn(i)))) ||
                i < ilen
                    ) {
                    if (!opt && source.getfn && !source.dontcache) data[i] = dataw;

                    scope[tableid] = dataw;
                    // Reduce with ON and USING clause
                    if (
                        !source.onleftfn ||
                        source.onleftfn(scope, query.params, alasql) ==
                        source.onrightfn(scope, query.params, alasql)
                    ) {
                        // For all non-standard JOINs like a-b=0
                        if (source.onmiddlefn(scope, query.params, alasql)) {
                            // Recursively call new join
                            //						if(source.joinmode == "LEFT" || source.joinmode == "INNER" || source.joinmode == "OUTER" || source.joinmode == "RIGHT" ) {
                            if (source.joinmode != 'SEMI' && source.joinmode != 'ANTI') {

                                doJoin(query, scope, h + 1);
                            }

                            // if(source.data[i].f = 200) debugger;

                            //						if(source.joinmode == "RIGHT" || source.joinmode == "ANTI" || source.joinmode == "OUTER") {
                            if (source.joinmode != 'LEFT' && source.joinmode != 'INNER') {
                                dataw._rightjoin = true;
                            }

                            // for LEFT JOIN
                            pass = true;
                        }
                    }
                    i++;
                }

                // Additional join for LEFT JOINS
                if (
                    (source.joinmode == 'LEFT' ||
                    source.joinmode == 'OUTER' ||
                    source.joinmode == 'SEMI') &&
                    !pass
                ) {
                    // Clear the scope after the loop
                    scope[tableid] = {};
                    doJoin(query, scope, h + 1);
                }
            }

            // When there is no records
            //		if(data.length == 0 && query.groupfn) {
            //			scope[tableid] = undefined;
            //			doJoin(query,scope,h+1);
            //		}

            // STEP 2

            if (h + 1 < query.sources.length) {
                if (
                    nextsource.joinmode == 'OUTER' ||
                    nextsource.joinmode == 'RIGHT' ||
                    nextsource.joinmode == 'ANTI'
                ) {
                    scope[source.alias] = {};

                    var j = 0;
                    var jlen = nextsource.data.length;
                    var dataw;

                    while (
                    (dataw = nextsource.data[j]) ||
                    (nextsource.getfn && (dataw = nextsource.getfn(j))) ||
                    j < jlen
                        ) {
                        if (nextsource.getfn && !nextsource.dontcache) {
                            nextsource.data[j] = dataw;
                        }

                        if (dataw._rightjoin) {
                            delete dataw._rightjoin;
                        } else {
                            //						delete dataw._rightjoin;

                            if (h == 0) {
                                scope[nextsource.alias] = dataw;
                                doJoin(query, scope, h + 2);
                            } else {
                                //scope[nextsource.alias] = dataw;
                                //doJoin(query, scope, h+2);

                            }
                        }
                        j++;
                    }
                    //				debugger;
                } else {

                }
            } else {

            }

            scope[tableid] = undefined;

        }
    }

    function swapSources(query, h) {
        var source = query.sources[h];
        var nextsource = query.sources[h + 1];

        var onleftfn = source.onleftfn;
        var onleftfns = source.onleftfns;
        var onrightfn = source.onrightfn;
        var onrightfns = source.onrightfns;
        var optimization = source.optimization;

        source.onleftfn = nextsource.onrightfn;
        source.onleftfns = nextsource.onrightfns;
        source.onrightfn = nextsource.onleftfn;
        source.onrightfns = nextsource.onleftfns;
        source.optimization = nextsource.optimization;

        nextsource.onleftfn = onleftfn;
        nextsource.onleftfns = onleftfns;
        nextsource.onrightfn = onrightfn;
        nextsource.onrightfns = onrightfns;
        nextsource.optimization = optimization;

        query.sources[h] = nextsource;
        query.sources[h + 1] = source;
    }

    /*
     //
     // Select run-time part for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

//
// Main part of SELECT procedure
//

    /* global yy */

    yy.Select = function(params) {
        return yy.extend(this, params);
    };
    yy.Select.prototype.toString = function() {
        var s;
        s = '';
        if (this.explain) {
            s += 'EXPLAIN ';
        }
        s += 'SELECT ';
        if (this.modifier) {
            s += this.modifier + ' ';
        }
        if (this.distinct) {
            s += 'DISTINCT ';
        }
        if (this.top) {
            s += 'TOP ' + this.top.value + ' ';
            if (this.percent) {
                s += 'PERCENT ';
            }
        }
        s += this.columns
            .map(function(col) {
                var s;
                s = col.toString();
                if (typeof col.as !== 'undefined') {
                    s += ' AS ' + col.as;
                }
                return s;
            })
            .join(', ');
        if (this.from) {
            s +=
                ' FROM ' +
                this.from
                    .map(function(f) {
                        var ss;
                        ss = f.toString();
                        if (f.as) {
                            ss += ' AS ' + f.as;
                        }
                        return ss;
                    })
                    .join(',');
        }
        if (this.joins) {
            s += this.joins
                .map(function(jn) {
                    var ss;
                    ss = ' ';
                    if (jn.joinmode) {
                        ss += jn.joinmode + ' ';
                    }
                    if (jn.table) {
                        ss += 'JOIN ' + jn.table.toString();
                    } else if (jn.select) {
                        ss += 'JOIN (' + jn.select.toString() + ')';
                    } else if (jn instanceof alasql.yy.Apply) {
                        ss += jn.toString();
                    } else {
                        throw new Error('Wrong type in JOIN mode');
                    }
                    if (jn.as) {
                        ss += ' AS ' + jn.as;
                    }
                    if (jn.using) {
                        ss += ' USING ' + jn.using.toString();
                    }
                    if (jn.on) {
                        ss += ' ON ' + jn.on.toString();
                    }
                    return ss;
                })
                .join('');
        }
        if (this.where) {
            s += ' WHERE ' + this.where.toString();
        }
        if (this.group && this.group.length > 0) {
            s +=
                ' GROUP BY ' +
                this.group
                    .map(function(grp) {
                        return grp.toString();
                    })
                    .join(', ');
        }
        if (this.having) {
            s += ' HAVING ' + this.having.toString();
        }
        if (this.order && this.order.length > 0) {
            s +=
                ' ORDER BY ' +
                this.order
                    .map(function(ord) {
                        return ord.toString();
                    })
                    .join(', ');
        }
        if (this.limit) {
            s += ' LIMIT ' + this.limit.value;
        }
        if (this.offset) {
            s += ' OFFSET ' + this.offset.value;
        }
        if (this.union) {
            s += ' UNION ' + (this.corresponding ? 'CORRESPONDING ' : '') + this.union.toString();
        }
        if (this.unionall) {
            s +=
                ' UNION ALL ' + (this.corresponding ? 'CORRESPONDING ' : '') + this.unionall.toString();
        }
        if (this.except) {
            s += ' EXCEPT ' + (this.corresponding ? 'CORRESPONDING ' : '') + this.except.toString();
        }
        if (this.intersect) {
            s +=
                ' INTERSECT ' +
                (this.corresponding ? 'CORRESPONDING ' : '') +
                this.intersect.toString();
        }
        return s;
    };

    /**
     Select statement in expression
     */
    yy.Select.prototype.toJS = function(context) {

        //	if(this.expression.reduced) return 'true';
        //	return this.expression.toJS(context, tableid, defcols);

        //	var s = 'this.queriesdata['+(this.queriesidx-1)+'][0]';

        var s =
            'alasql.utils.flatArray(this.queriesfn[' +
            (this.queriesidx - 1) +
            '](this.params,null,' +
            context +
            '))[0]';

        return s;
    };

// Compile SELECT statement
    yy.Select.prototype.compile = function(databaseid, params) {
        var db = alasql.databases[databaseid];
        // Create variable for query
        var query = new Query();

        // Array with columns to be removed
        query.removeKeys = [];
        query.aggrKeys = [];

        query.explain = this.explain; // Explain
        query.explaination = [];
        query.explid = 1;

        query.modifier = this.modifier;

        query.database = db;
        // 0. Precompile whereexists
        this.compileWhereExists(query);

        // 0. Precompile queries for IN, NOT IN, ANY and ALL operators
        this.compileQueries(query);

        query.defcols = this.compileDefCols(query, databaseid);

        // 1. Compile FROM clause
        query.fromfn = this.compileFrom(query);

        // 2. Compile JOIN clauses
        if (this.joins) {
            this.compileJoins(query);
        }

        // todo?: 3. Compile SELECT clause

        // For ROWNUM()
        query.rownums = [];

        this.compileSelectGroup0(query);

        if (this.group || query.selectGroup.length > 0) {
            query.selectgfns = this.compileSelectGroup1(query);
        } else {
            query.selectfns = this.compileSelect1(query, params);
        }

        // Remove columns clause
        this.compileRemoveColumns(query);

        // 5. Optimize WHERE and JOINS
        if (this.where) {
            this.compileWhereJoins(query);
        }

        // 4. Compile WHERE clause
        query.wherefn = this.compileWhere(query);

        // 6. Compile GROUP BY
        if (this.group || query.selectGroup.length > 0) {
            query.groupfn = this.compileGroup(query);
        }

        // 6. Compile HAVING
        if (this.having) {
            query.havingfn = this.compileHaving(query);
        }

        // 8. Compile ORDER BY clause
        if (this.order) {
            query.orderfn = this.compileOrder(query);
        }

        if (this.group || query.selectGroup.length > 0) {
            query.selectgfn = this.compileSelectGroup2(query);
        } else {
            query.selectfn = this.compileSelect2(query);
        }

        // 7. Compile DISTINCT, LIMIT and OFFSET
        query.distinct = this.distinct;

        // 9. Compile PIVOT clause
        if (this.pivot) query.pivotfn = this.compilePivot(query);
        if (this.unpivot) query.pivotfn = this.compileUnpivot(query);

        // 10. Compile TOP/LIMIT/OFFSET/FETCH cleuse
        if (this.top) {
            query.limit = this.top.value;
        } else if (this.limit) {
            query.limit = this.limit.value;
            if (this.offset) {
                query.offset = this.offset.value;
            }
        }

        query.percent = this.percent;

        // 9. Compile ordering function for UNION and UNIONALL
        query.corresponding = this.corresponding; // If CORRESPONDING flag exists
        if (this.union) {
            query.unionfn = this.union.compile(databaseid);
            if (this.union.order) {
                query.orderfn = this.union.compileOrder(query);
            } else {
                query.orderfn = null;
            }
        } else if (this.unionall) {
            query.unionallfn = this.unionall.compile(databaseid);
            if (this.unionall.order) {
                query.orderfn = this.unionall.compileOrder(query);
            } else {
                query.orderfn = null;
            }
        } else if (this.except) {
            query.exceptfn = this.except.compile(databaseid);
            if (this.except.order) {
                query.orderfn = this.except.compileOrder(query);
            } else {
                query.orderfn = null;
            }
        } else if (this.intersect) {
            query.intersectfn = this.intersect.compile(databaseid);
            if (this.intersect.order) {
                query.intersectfn = this.intersect.compileOrder(query);
            } else {
                query.orderfn = null;
            }
        }

        // SELECT INTO
        if (this.into) {
            if (this.into instanceof yy.Table) {
                //
                // Save into the table in database
                //
                if (
                    alasql.options.autocommit &&
                    alasql.databases[this.into.databaseid || databaseid].engineid
                ) {
                    // For external database when AUTOCOMMIT is ONs
                    query.intoallfns =
                        'return alasql.engines["' +
                        alasql.databases[this.into.databaseid || databaseid].engineid +
                        '"]' +
                        '.intoTable("' +
                        (this.into.databaseid || databaseid) +
                        '","' +
                        this.into.tableid +
                        '",this.data, columns, cb);';
                } else {
                    // Into AlaSQL tables
                    query.intofns =
                        "alasql.databases['" +
                        (this.into.databaseid || databaseid) +
                        "'].tables" +
                        "['" +
                        this.into.tableid +
                        "'].data.push(r);";
                }
            } else if (this.into instanceof yy.VarValue) {
                //
                // Save into local variable
                // SELECT * INTO @VAR1 FROM ?
                //
                query.intoallfns =
                    'alasql.vars["' +
                    this.into.variable +
                    '"]=this.data;res=this.data.length;if(cb)res=cb(res);return res;';
            } else if (this.into instanceof yy.FuncValue) {
                //
                // If this is INTO() function, then call it
                // with one or two parameters
                //
                var qs = "return alasql.into['" + this.into.funcid.toUpperCase() + "'](";
                if (this.into.args && this.into.args.length > 0) {
                    qs += this.into.args[0].toJS() + ',';
                    if (this.into.args.length > 1) {
                        qs += this.into.args[1].toJS() + ',';
                    } else {
                        qs += 'undefined,';
                    }
                } else {
                    qs += 'undefined, undefined,';
                }
                query.intoallfns = qs + 'this.data,columns,cb)';

            } else if (this.into instanceof yy.ParamValue) {
                //
                // Save data into parameters array
                // like alasql('SELECT * INTO ? FROM ?',[outdata,srcdata]);
                //
                query.intofns = "params['" + this.into.param + "'].push(r)";
            }

            if (query.intofns) {
                // Create intofn function

                query.intofn = new Function('r,i,params,alasql', 'var y;' + query.intofns);
            } else if (query.intoallfns) {
                // Create intoallfn function

                query.intoallfn = new Function('columns,cb,params,alasql', 'var y;' + query.intoallfns);
            }
        }

        // Now, compile all togeather into one function with query object in scope
        var statement = function(params, cb, oldscope) {
            query.params = params;
            // Note the callback function has the data and error reversed due to existing code in promiseExec which has the
            // err and data swapped.  This trickles down into alasql.exec and further. Rather than risk breaking the whole thing,
            // the (data, err) standard is maintained here.
            var res1 = queryfn(query, oldscope, function(res, err) {
                if (err) {
                    return cb(err, null);
                }
                if (query.rownums.length > 0) {
                    for (var i = 0, ilen = res.length; i < ilen; i++) {
                        for (var j = 0, jlen = query.rownums.length; j < jlen; j++) {
                            res[i][query.rownums[j]] = i + 1;
                        }
                    }
                }

                var res2 = modify(query, res);

                if (cb) {
                    cb(res2);
                }

                return res2;
            });

            //		if(typeof res1 != 'undefined') res1 =  modify(query,res1);

            return res1;
        };

        //	statement.dbversion = ;

        statement.query = query;
        return statement;
    };

    /**
     Modify res according modifier
     @function
     @param {object} query Query object
     @param res {object|number|string|boolean} res Data to be converted
     */
    function modify(query, res) {
        // jshint ignore:line

        /* If source is a primitive value then return it */
        if (
            typeof res === 'undefined' ||
            typeof res === 'number' ||
            typeof res === 'string' ||
            typeof res === 'boolean'
        ) {
            return res;
        }

        var modifier = query.modifier || alasql.options.modifier;
        var columns = query.columns;
        if (typeof columns === 'undefined' || columns.length == 0) {
            // Try to create columns
            if (res.length > 0) {
                var allcol = {};
                for (var i = Math.min(res.length, alasql.options.columnlookup || 10) - 1; 0 <= i; i--) {
                    for (var key in res[i]) {
                        allcol[key] = true;
                    }
                }

                columns = Object.keys(allcol).map(function(columnid) {
                    return {columnid: columnid};
                });
            } else {
                // Cannot recognize columns
                columns = [];
            }
        }

        if (modifier === 'VALUE') {

            if (res.length > 0) {
                var key;
                if (columns && columns.length > 0) {
                    key = columns[0].columnid;
                } else {
                    key = Object.keys(res[0])[0];
                }
                res = res[0][key];
            } else {
                res = undefined;
            }
        } else if (modifier === 'ROW') {
            if (res.length > 0) {
                var key;
                var a = [];
                for (var key in res[0]) {
                    a.push(res[0][key]);
                }
                res = a;
            } else {
                res = undefined;
            }
        } else if (modifier === 'COLUMN') {
            var ar = [];
            if (res.length > 0) {
                var key;
                if (columns && columns.length > 0) {
                    key = columns[0].columnid;
                } else {
                    key = Object.keys(res[0])[0];
                }

                for (var i = 0, ilen = res.length; i < ilen; i++) {
                    ar.push(res[i][key]);
                }
            }
            res = ar;
        } else if (modifier === 'MATRIX') {
            // Returns square matrix of rows
            var ar = [];
            for (var i = 0; i < res.length; i++) {
                var a = [];
                var r = res[i];
                for (var j = 0; j < columns.length; j++) {
                    a.push(r[columns[j].columnid]);
                }
                ar.push(a);
            }
            res = ar;
        } else if (modifier === 'INDEX') {
            var ar = {};
            var key, val;
            if (columns && columns.length > 0) {
                key = columns[0].columnid;
                val = columns[1].columnid;
            } else {
                var okeys = Object.keys(res[0]);
                key = okeys[0];
                val = okeys[1];
            }
            for (var i = 0, ilen = res.length; i < ilen; i++) {
                ar[res[i][key]] = res[i][val];
            }
            res = ar;
            //		res = arrayOfArrays(res);
        } else if (modifier === 'RECORDSET') {
            res = new alasql.Recordset({columns: columns, data: res});
            //		res = arrayOfArrays(res);
        } else if (modifier === 'TEXTSTRING') {
            var key;
            if (columns && columns.length > 0) {
                key = columns[0].columnid;
            } else {
                key = Object.keys(res[0])[0];
            }

            for (var i = 0, ilen = res.length; i < ilen; i++) {
                res[i] = res[i][key];
            }
            res = res.join('\n');
            //		res = arrayOfArrays(res);
        }
        return res;
    }

    yy.Select.prototype.execute = function(databaseid, params, cb) {
        return this.compile(databaseid)(params, cb);
        //	throw new Error('Insert statement is should be compiled')
    };

    /*
     //
     // EXISTS and other subqueries functions  functions for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.ExistsValue = function(params) {
        return yy.extend(this, params);
    };
    yy.ExistsValue.prototype.toString = function() {
        return 'EXISTS(' + this.value.toString() + ')';
    };

    yy.ExistsValue.prototype.toType = function() {
        return 'boolean';
    };

    yy.ExistsValue.prototype.toJS = function(context, tableid, defcols) {

        return 'this.existsfn[' + this.existsidx + '](params,null,' + context + ').data.length';
    };

    yy.Select.prototype.compileWhereExists = function(query) {
        if (!this.exists) return;
        query.existsfn = this.exists.map(function(ex) {
            var nq = ex.compile(query.database.databaseid);

            //		 if(!nq.query.modifier) nq.query.modifier = 'RECORDSET';
            nq.query.modifier = 'RECORDSET';
            return nq;
        });
    };

    yy.Select.prototype.compileQueries = function(query) {
        if (!this.queries) return;
        query.queriesfn = this.queries.map(function(q) {
            var nq = q.compile(query.database.databaseid);

            //	if(!nq.query) nq.query = {};
            nq.query.modifier = 'RECORDSET';
            //		 if(!nq.query.modifier) nq.query.modifier = 'RECORDSET';
            return nq;
        });
    };

//
// Prepare subqueries and exists
//
    alasql.precompile = function(statement, databaseid, params) {

        if (!statement) return;
        statement.params = params;
        if (statement.queries) {

            statement.queriesfn = statement.queries.map(function(q) {
                var nq = q.compile(databaseid || statement.database.databaseid);

                //			 nq.query.modifier = undefined;
                //			 if(!nq.query.modifier) nq.query.modifier = 'RECORDSET';
                nq.query.modifier = 'RECORDSET';
                return nq;
            });
        }
        if (statement.exists) {

            statement.existsfn = statement.exists.map(function(ex) {
                var nq = ex.compile(databaseid || statement.database.databaseid);

                //			 if(!nq.query.modifier) nq.query.modifier = 'RECORDSET';
                //			 if(!nq.query.modifier) nq.query.modifier = 'ARRAY';
                nq.query.modifier = 'RECORDSET';
                return nq;
            });
        }
    };

    /*
     //
     // Select compiler part for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* global yy, alasql, Mongo, returnTrue */

    yy.Select.prototype.compileFrom = function(query) {

        var self = this;
        query.sources = [];
        //	var tableid = this.from[0].tableid;
        //	var as = '';
        //	if(self.from[0].as) as = this.from[0].as;

        query.aliases = {};
        if (!self.from) return;

        self.from.forEach(function(tq) {

            var ps = '';

            var alias = tq.as || tq.tableid;

            if (tq instanceof yy.Table) {

                query.aliases[alias] = {
                    tableid: tq.tableid,
                    databaseid: tq.databaseid || query.database.databaseid,
                    type: 'table',
                };
            } else if (tq instanceof yy.Select) {
                query.aliases[alias] = {type: 'subquery'};
            } else if (tq instanceof yy.Search) {
                query.aliases[alias] = {type: 'subsearch'};
            } else if (tq instanceof yy.ParamValue) {
                query.aliases[alias] = {type: 'paramvalue'};
            } else if (tq instanceof yy.FuncValue) {
                query.aliases[alias] = {type: 'funcvalue'};
            } else if (tq instanceof yy.VarValue) {
                query.aliases[alias] = {type: 'varvalue'};
            } else if (tq instanceof yy.FromData) {
                query.aliases[alias] = {type: 'fromdata'};
            } else if (tq instanceof yy.Json) {
                query.aliases[alias] = {type: 'json'};
            } else if (tq.inserted) {
                query.aliases[alias] = {type: 'inserted'};
            } else {
                throw new Error('Wrong table at FROM');
            }

            var source = {
                alias: alias,
                databaseid: tq.databaseid || query.database.databaseid,
                tableid: tq.tableid,
                joinmode: 'INNER',
                onmiddlefn: returnTrue,
                srcwherefns: '', // for optimization
                srcwherefn: returnTrue,
                //			columns: []
            };

            if (tq instanceof yy.Table) {
                // Get columns from table
                source.columns = alasql.databases[source.databaseid].tables[source.tableid].columns;

                if (
                    alasql.options.autocommit &&
                    alasql.databases[source.databaseid].engineid &&
                    !alasql.databases[source.databaseid].tables[source.tableid].view
                ) {

                    // TODO -- make view for external engine
                    source.datafn = function(query, params, cb, idx, alasql) {
                        return alasql.engines[alasql.databases[source.databaseid].engineid].fromTable(
                            source.databaseid,
                            source.tableid,
                            cb,
                            idx,
                            query
                        );
                    };
                } else if (alasql.databases[source.databaseid].tables[source.tableid].view) {
                    source.datafn = function(query, params, cb, idx, alasql) {
                        var res = alasql.databases[source.databaseid].tables[source.tableid].select(
                            params
                        );
                        if (cb) res = cb(res, idx, query);
                        return res;
                    };
                } else {

                    source.datafn = function(query, params, cb, idx, alasql) {
                        /*

                         */
                        var res = alasql.databases[source.databaseid].tables[source.tableid].data;

                        if (cb) res = cb(res, idx, query);

                        return res;
                        //				return alasql.databases[source.databaseid].tables[source.tableid].data;
                    };
                }
            } else if (tq instanceof yy.Select) {
                source.subquery = tq.compile(query.database.databaseid);
                if (typeof source.subquery.query.modifier === 'undefined') {
                    source.subquery.query.modifier = 'RECORDSET'; // Subqueries always return recordsets
                }
                source.columns = source.subquery.query.columns;

                //			tq.columns;

                source.datafn = function(query, params, cb, idx, alasql) {
                    //				return source.subquery(query.params, cb, idx, query);
                    var res;
                    source.subquery(query.params, function(data) {
                        res = data.data;
                        if (cb) res = cb(res, idx, query);
                        return res;
                        //					return data.data;
                    });

                    return res;
                };
            } else if (tq instanceof yy.Search) {
                source.subsearch = tq;
                source.columns = [];

                source.datafn = function(query, params, cb, idx, alasql) {
                    //				return source.subquery(query.params, cb, idx, query);
                    var res;
                    source.subsearch.execute(query.database.databaseid, query.params, function(data) {
                        res = data;
                        if (cb) res = cb(res, idx, query);
                        return res;
                        //					return data.data;
                    });

                    return res;
                };
            } else if (tq instanceof yy.ParamValue) {
                ps = "var res = alasql.prepareFromData(params['" + tq.param + "']";

                if (tq.array) ps += ',true';
                ps += ');if(cb)res=cb(res,idx,query);return res';
                source.datafn = new Function('query,params,cb,idx,alasql', ps);
            } else if (tq.inserted) {
                ps = 'var res = alasql.prepareFromData(alasql.inserted';
                if (tq.array) ps += ',true';
                ps += ');if(cb)res=cb(res,idx,query);return res';
                source.datafn = new Function('query,params,cb,idx,alasql', ps);
            } else if (tq instanceof yy.Json) {
                ps = 'var res = alasql.prepareFromData(' + tq.toJS();

                if (tq.array) ps += ',true';
                ps += ');if(cb)res=cb(res,idx,query);return res';
                source.datafn = new Function('query,params,cb,idx,alasql', ps);
            } else if (tq instanceof yy.VarValue) {
                ps = "var res = alasql.prepareFromData(alasql.vars['" + tq.variable + "']";

                if (tq.array) ps += ',true';
                ps += ');if(cb)res=cb(res,idx,query);return res';
                source.datafn = new Function('query,params,cb,idx,alasql', ps);
            } else if (tq instanceof yy.FuncValue) {
                ps = "var res=alasql.from['" + tq.funcid.toUpperCase() + "'](";

                if (tq.args && tq.args.length > 0) {
                    if (tq.args[0]) {
                        ps += tq.args[0].toJS('query.oldscope') + ',';
                    } else {
                        ps += 'null,';
                    }
                    if (tq.args[1]) {
                        ps += tq.args[1].toJS('query.oldscope') + ',';
                    } else {
                        ps += 'null,';
                    }
                } else {
                    ps += 'null,null,';
                }
                ps += 'cb,idx,query';
                ps += ');/*if(cb)res=cb(res,idx,query);*/return res';

                source.datafn = new Function('query, params, cb, idx, alasql', ps);
            } else if (tq instanceof yy.FromData) {
                source.datafn = function(query, params, cb, idx, alasql) {
                    var res = tq.data;
                    if (cb) res = cb(res, idx, query);
                    return res;
                };
            } else {
                throw new Error('Wrong table at FROM');
            }
            //		source.data = alasql.databases[source.databaseid].tables[source.tableid].data;
            query.sources.push(source);
        });
        // TODO Add joins
        query.defaultTableid = query.sources[0].alias;

    };

    alasql.prepareFromData = function(data, array) {

        var i, ilen;
        var res = data;
        if (typeof data === 'string') {
            res = data.split(/\r?\n/);
            if (array) {
                for (i = 0, ilen = res.length; i < ilen; i++) {
                    res[i] = [res[i]];
                }
            }
        } else if (array) {
            res = [];
            for (i = 0, ilen = data.length; i < ilen; i++) {
                res.push([data[i]]);
            }

        } else if (typeof data === 'object' && !Array.isArray(data)) {
            //	} else if(typeof data == 'object' && !(typeof data.length == 'undefined')) {
            if (
                typeof Mongo !== 'undefined' &&
                typeof Mongo.Collection !== 'undefined' &&
                data instanceof Mongo.Collection
            ) {
                res = data.find().fetch();
            } else {
                res = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) res.push([key, data[key]]);
                }
            }

        }

        return res;
    };

    /*
     //
     // Select compiler part for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// SELECT Compile functions

    /* global yy, alasql, returnTrue, arrayIntersect */

// Compile JOIN caluese
    yy.Select.prototype.compileJoins = function(query) {

        //	debugger;
        var self = this;

        this.joins.forEach(function(jn) {
            // Test CROSS-JOIN
            var tq, ps, source;
            if (jn.joinmode === 'CROSS') {
                if (jn.using || jn.on) {
                    throw new Error('CROSS JOIN cannot have USING or ON clauses');
                } else {
                    jn.joinmode = 'INNER';
                }
            }

            if (jn instanceof yy.Apply) {

                source = {
                    alias: jn.as,
                    applymode: jn.applymode,
                    onmiddlefn: returnTrue,
                    srcwherefns: '', // for optimization
                    srcwherefn: returnTrue,
                    columns: [], // TODO check this
                };
                source.applyselect = jn.select.compile(query.database.databaseid);
                source.columns = source.applyselect.query.columns;

                source.datafn = function(query, params, cb, idx, alasql) {
                    var res;
                    if (cb) res = cb(res, idx, query);
                    return res;
                };

                query.sources.push(source);

                return;
            }

            if (jn.table) {
                tq = jn.table;
                source = {
                    alias: jn.as || tq.tableid,
                    databaseid: tq.databaseid || query.database.databaseid,
                    tableid: tq.tableid,
                    joinmode: jn.joinmode,
                    onmiddlefn: returnTrue,
                    srcwherefns: '', // for optimization
                    srcwherefn: returnTrue,
                    columns: [],
                };
                //

                if (!alasql.databases[source.databaseid].tables[source.tableid]) {
                    throw new Error(
                        "Table '" +
                        source.tableid +
                        "' is not exists in database '" +
                        source.databaseid +
                        "'"
                    );
                }

                source.columns = alasql.databases[source.databaseid].tables[source.tableid].columns;

                // source.data = query.database.tables[source.tableid].data;
                if (alasql.options.autocommit && alasql.databases[source.databaseid].engineid) {

                    source.datafn = function(query, params, cb, idx, alasql) {

                        return alasql.engines[alasql.databases[source.databaseid].engineid].fromTable(
                            source.databaseid,
                            source.tableid,
                            cb,
                            idx,
                            query
                        );
                    };
                } else if (alasql.databases[source.databaseid].tables[source.tableid].view) {
                    source.datafn = function(query, params, cb, idx, alasql) {
                        var res = alasql.databases[source.databaseid].tables[source.tableid].select(
                            params
                        );
                        if (cb) res = cb(res, idx, query);
                        return res;
                    };
                } else {
                    source.datafn = function(query, params, cb, idx, alasql) {
                        var res = alasql.databases[source.databaseid].tables[source.tableid].data;
                        if (cb) res = cb(res, idx, query);
                        return res;
                    };
                }

                //		var alias = jn.as || tq.tableid;
                //		if(tq) {
                query.aliases[source.alias] = {
                    tableid: tq.tableid,
                    databaseid: tq.databaseid || query.database.databaseid,
                };
                //		}
            } else if (jn.select) {
                tq = jn.select;
                source = {
                    alias: jn.as,
                    //				databaseid: jn.databaseid || query.database.databaseid,
                    //				tableid: tq.tableid,
                    joinmode: jn.joinmode,
                    onmiddlefn: returnTrue,
                    srcwherefns: '', // for optimization
                    srcwherefn: returnTrue,
                    columns: [],
                };

                source.subquery = tq.compile(query.database.databaseid);
                if (typeof source.subquery.query.modifier === 'undefined') {
                    source.subquery.query.modifier = 'RECORDSET'; // Subqueries always return recordsets
                }
                source.columns = source.subquery.query.columns;

                //			if(jn instanceof yy.Apply) {
                source.datafn = function(query, params, cb, idx, alasql) {
                    //					return cb(null,idx,alasql);
                    return source.subquery(query.params, null, cb, idx).data;
                };
                // } else {
                // 	source.datafn = function(query, params, cb, idx, alasql) {
                // 		return source.subquery(query.params, null, cb, idx);
                // 	}
                // }
                query.aliases[source.alias] = {type: 'subquery'};
            } else if (jn.param) {
                source = {
                    alias: jn.as,
                    //				databaseid: jn.databaseid || query.database.databaseid,
                    //				tableid: tq.tableid,
                    joinmode: jn.joinmode,
                    onmiddlefn: returnTrue,
                    srcwherefns: '', // for optimization
                    srcwherefn: returnTrue,
                };
                // source.data = ;
                var jnparam = jn.param.param;

                ps = "var res=alasql.prepareFromData(params['" + jnparam + "']";
                if (jn.array) ps += ',true';
                ps += ');if(cb)res=cb(res, idx, query);return res';

                source.datafn = new Function('query,params,cb,idx, alasql', ps);
                query.aliases[source.alias] = {type: 'paramvalue'};
            } else if (jn.variable) {
                source = {
                    alias: jn.as,
                    //				databaseid: jn.databaseid || query.database.databaseid,
                    //				tableid: tq.tableid,
                    joinmode: jn.joinmode,
                    onmiddlefn: returnTrue,
                    srcwherefns: '', // for optimization
                    srcwherefn: returnTrue,
                };
                // source.data = ;
                //			var jnparam = jn.param.param;

                ps = "var res=alasql.prepareFromData(alasql.vars['" + jn.variable + "']";
                if (jn.array) ps += ',true';
                ps += ');if(cb)res=cb(res, idx, query);return res';

                source.datafn = new Function('query,params,cb,idx, alasql', ps);
                query.aliases[source.alias] = {type: 'varvalue'};
            } else if (jn.funcid) {
                source = {
                    alias: jn.as,
                    //				databaseid: jn.databaseid || query.database.databaseid,
                    //				tableid: tq.tableid,
                    joinmode: jn.joinmode,
                    onmiddlefn: returnTrue,
                    srcwherefns: '', // for optimization
                    srcwherefn: returnTrue,
                };
                // source.data = ;

                var s = "var res=alasql.from['" + jn.funcid.toUpperCase() + "'](";

                if (jn.args && jn.args.length > 0) {
                    if (jn.args[0]) {
                        s += jn.args[0].toJS('query.oldscope') + ',';
                    } else {
                        s += 'null,';
                    }
                    if (jn.args[1]) {
                        s += jn.args[1].toJS('query.oldscope') + ',';
                    } else {
                        s += 'null,';
                    }
                } else {
                    s += 'null,null,';
                }
                s += 'cb,idx,query';
                s += ');/*if(cb)res=cb(res,idx,query);*/return res';

                source.datafn = new Function('query, params, cb, idx, alasql', s);

                query.aliases[source.alias] = {type: 'funcvalue'};
            }

            var alias = source.alias;

            // Test NATURAL-JOIN
            if (jn.natural) {
                if (jn.using || jn.on) {
                    throw new Error('NATURAL JOIN cannot have USING or ON clauses');
                } else {
                    //				source.joinmode == "INNER";
                    if (query.sources.length > 0) {
                        var prevSource = query.sources[query.sources.length - 1];
                        var prevTable =
                            alasql.databases[prevSource.databaseid].tables[prevSource.tableid];
                        var table = alasql.databases[source.databaseid].tables[source.tableid];

                        if (prevTable && table) {
                            var c1 = prevTable.columns.map(function(col) {
                                return col.columnid;
                            });
                            var c2 = table.columns.map(function(col) {
                                return col.columnid;
                            });
                            jn.using = arrayIntersect(c1, c2).map(function(colid) {
                                return {columnid: colid};
                            });

                        } else {
                            throw new Error(
                                'In this version of Alasql NATURAL JOIN ' +
                                'works for tables with predefined columns only'
                            );
                        }
                    }
                }
            }

            if (jn.using) {
                prevSource = query.sources[query.sources.length - 1];

                source.onleftfns = jn.using
                    .map(function(col) {

                        return (
                            "p['" +
                            (prevSource.alias || prevSource.tableid) +
                            "']['" +
                            col.columnid +
                            "']"
                        );
                    })
                    .join('+"`"+');

                source.onleftfn = new Function('p,params,alasql', 'var y;return ' + source.onleftfns);

                source.onrightfns = jn.using
                    .map(function(col) {
                        return "p['" + (source.alias || source.tableid) + "']['" + col.columnid + "']";
                    })
                    .join('+"`"+');
                source.onrightfn = new Function('p,params,alasql', 'var y;return ' + source.onrightfns);
                source.optimization = 'ix';

            } else if (jn.on) {

                if (jn.on instanceof yy.Op && jn.on.op === '=' && !jn.on.allsome) {

                    source.optimization = 'ix';

                    var lefts = '';
                    var rights = '';
                    var middles = '';
                    var middlef = false;
                    // Test right and left sides
                    var ls = jn.on.left.toJS('p', query.defaultTableid, query.defcols);
                    var rs = jn.on.right.toJS('p', query.defaultTableid, query.defcols);

                    if (
                        ls.indexOf("p['" + alias + "']") > -1 &&
                        !(rs.indexOf("p['" + alias + "']") > -1)
                    ) {
                        if (
                            (ls.match(/p\['.*?'\]/g) || []).every(function(s) {
                                return s === "p['" + alias + "']";
                            })
                        ) {
                            rights = ls;
                        } else {
                            middlef = true;
                        }
                    } else if (
                        !(ls.indexOf("p['" + alias + "']") > -1) &&
                        rs.indexOf("p['" + alias + "']") > -1
                    ) {
                        if (
                            (rs.match(/p\['.*?'\]/g) || []).every(function(s) {
                                return s === "p['" + alias + "']";
                            })
                        ) {
                            lefts = ls;
                        } else {
                            middlef = true;
                        }
                    } else {
                        middlef = true;
                    }

                    if (
                        rs.indexOf("p['" + alias + "']") > -1 &&
                        !(ls.indexOf("p['" + alias + "']") > -1)
                    ) {
                        if (
                            (rs.match(/p\['.*?'\]/g) || []).every(function(s) {
                                return s === "p['" + alias + "']";
                            })
                        ) {
                            rights = rs;
                        } else {
                            middlef = true;
                        }
                    } else if (
                        !(rs.indexOf("p['" + alias + "']") > -1) &&
                        ls.indexOf("p['" + alias + "']") > -1
                    ) {
                        if (
                            (ls.match(/p\['.*?'\]/g) || []).every(function(s) {
                                return s === "p['" + alias + "']";
                            })
                        ) {
                            lefts = rs;
                        } else {
                            middlef = true;
                        }
                    } else {
                        middlef = true;
                    }

                    if (middlef) {
                        //					middles = jn.on.toJS('p',query.defaultTableid);
                        //				} else {
                        rights = '';
                        lefts = '';
                        middles = jn.on.toJS('p', query.defaultTableid, query.defcols);
                        source.optimization = 'no';
                        // What to here?
                    }

                    source.onleftfns = lefts;
                    source.onrightfns = rights;
                    source.onmiddlefns = middles || 'true';

                    source.onleftfn = new Function(
                        'p,params,alasql',
                        'var y;return ' + source.onleftfns
                    );
                    source.onrightfn = new Function(
                        'p,params,alasql',
                        'var y;return ' + source.onrightfns
                    );
                    source.onmiddlefn = new Function(
                        'p,params,alasql',
                        'var y;return ' + source.onmiddlefns
                    );

                    //			} else if(jn.on instanceof yy.Op && jn.on.op == 'AND') {

                } else {

                    source.optimization = 'no';
                    //				source.onleftfn = returnTrue;
                    //				source.onleftfns = "true";
                    source.onmiddlefns = jn.on.toJS('p', query.defaultTableid, query.defcols);
                    source.onmiddlefn = new Function(
                        'p,params,alasql',
                        'var y;return ' + jn.on.toJS('p', query.defaultTableid, query.defcols)
                    );
                }

                // Optimization function
            }

            //		source.data = alasql.databases[source.databaseid].tables[source.tableid].data;

            // TODO SubQueries

            query.sources.push(source);
        });

    };

    yy.Select.prototype.compileWhere = function(query) {
        if (this.where) {
            if (typeof this.where == 'function') {
                return this.where;
            } else {
                var s = this.where.toJS('p', query.defaultTableid, query.defcols);
                query.wherefns = s;

                return new Function('p,params,alasql', 'var y;return ' + s);
            }
        } else
            return function() {
                return true;
            };
    };

    yy.Select.prototype.compileWhereJoins = function(query) {
        return;

        // TODO Fix Where optimization

        optimizeWhereJoin(query, this.where.expression);

        //for sources compile wherefs
        query.sources.forEach(function(source) {
            if (source.srcwherefns) {
                source.srcwherefn = new Function(
                    'p,params,alasql',
                    'var y;return ' + source.srcwherefns
                );
            }
            if (source.wxleftfns) {
                source.wxleftfn = new Function('p,params,alasql', 'var y;return ' + source.wxleftfns);
            }
            if (source.wxrightfns) {
                source.wxrightfn = new Function('p,params,alasql', 'var y;return ' + source.wxrightfns);
            }

        });
    };

    function optimizeWhereJoin(query, ast) {
        if (!ast) return false;
        if (!(ast instanceof yy.Op)) return;
        if (ast.op != '=' && ast.op != 'AND') return;
        if (ast.allsome) return;

        var s = ast.toJS('p', query.defaultTableid, query.defcols);
        var fsrc = [];
        query.sources.forEach(function(source, idx) {
            // Optimization allowed only for tables only
            if (source.tableid) {
                // This is a good place to remove all unnecessary optimizations
                if (s.indexOf("p['" + source.alias + "']") > -1) fsrc.push(source);
            }
        });

        //	if(fsrc.length < query.sources.length) return;

        if (fsrc.length == 0) {

            return;
        } else if (fsrc.length == 1) {
            if (
                !(s.match(/p\[\'.*?\'\]/g) || []).every(function(s) {
                    return s == "p['" + fsrc[0].alias + "']";
                })
            ) {
                return;
                // This is means, that we have column from parent query
                // So we return without optimization
            }

            var src = fsrc[0]; // optmiization source
            src.srcwherefns = src.srcwherefns ? src.srcwherefns + '&&' + s : s;

            if (ast instanceof yy.Op && (ast.op == '=' && !ast.allsome)) {
                if (ast.left instanceof yy.Column) {
                    var ls = ast.left.toJS('p', query.defaultTableid, query.defcols);
                    var rs = ast.right.toJS('p', query.defaultTableid, query.defcols);
                    if (rs.indexOf("p['" + fsrc[0].alias + "']") == -1) {
                        fsrc[0].wxleftfns = ls;
                        fsrc[0].wxrightfns = rs;
                    }
                }
                if (ast.right instanceof yy.Column) {
                    var ls = ast.left.toJS('p', query.defaultTableid, query.defcols);
                    var rs = ast.right.toJS('p', query.defaultTableid, query.defcols);
                    if (ls.indexOf("p['" + fsrc[0].alias + "']") == -1) {
                        fsrc[0].wxleftfns = rs;
                        fsrc[0].wxrightfns = ls;
                    }
                }
            }
            ast.reduced = true; // To do not duplicate wherefn and srcwherefn
            return;
        } else {
            if ((ast.op = 'AND')) {
                optimizeWhereJoin(query, ast.left);
                optimizeWhereJoin(query, ast.right);
            }
        }
    }

    /*
     //
     // Select compiler part for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /**
     Compile group of statements
     */
    yy.Select.prototype.compileGroup = function(query) {

        if (query.sources.length > 0) {
            var tableid = query.sources[0].alias;
        } else {
            // If SELECT contains group aggregators without source tables
            var tableid = '';
        }
        var defcols = query.defcols;

        var allgroup = [[]];
        if (this.group) {
            allgroup = decartes(this.group, query);
        }

        // Prepare groups
        //var allgroup = [['a'], ['a','b'], ['a', 'b', 'c']];

        // Union all arrays to get a maximum
        var allgroups = [];
        allgroup.forEach(function(a) {
            allgroups = arrayUnion(allgroups, a);
        });

        query.allgroups = allgroups;

        query.ingroup = [];

        // Create negative array

        var s = '';
        //	s+= query.selectfns;
        allgroup.forEach(function(agroup) {
            // Start of group function
            s += 'var g=this.xgroups[';

            //	var gcols = this.group.map(function(col){return col.columnid}); // Group fields with r
            // Array with group columns from record
            var rg = agroup.map(function(col2) {
                var columnid = col2.split('\t')[0];
                var coljs = col2.split('\t')[1];
                // Check, if aggregator exists but GROUP BY is not exists
                if (columnid === '') {
                    return '1'; // Create fictive groupping column for fictive GROUP BY
                }
                //			else return "r['"+columnid+"']";
                query.ingroup.push(columnid);

                return coljs;
            });

            if (rg.length === 0) {
                rg = ["''"];
            }

            s += rg.join('+"`"+');
            s += '];if(!g) {this.groups.push((g=this.xgroups[';
            s += rg.join('+"`"+');
            s += '] = {';
            //		s += ']=r';
            s += agroup
                .map(function(col2) {
                    var columnid = col2.split('\t')[0];
                    var coljs = col2.split('\t')[1];

                    if (columnid === '') {
                        return '';
                    }
                    return "'" + columnid + "':" + coljs + ',';
                })
                .join('');

            var neggroup = arrayDiff(allgroups, agroup);

            s += neggroup
                .map(function(col2) {
                    var columnid = col2.split('\t')[0];
                    //	var coljs = col2.split('\t')[1]
                    return "'" + columnid + "':null,";
                })
                .join('');

            var aft = '',
                aft2 = '';

            if (typeof query.groupStar !== 'undefined') {
                aft2 +=
                    "for(var f in p['" +
                    query.groupStar +
                    "']) {g[f]=p['" +
                    query.groupStar +
                    "'][f];};";
            }

            /*
             */
            //		s += self.columns.map(function(col){

            s += query.selectGroup
                .map(function(col) {

                    var colexp = col.expression.toJS('p', tableid, defcols);
                    var colas = col.nick;
                    // if(typeof colas == 'undefined') {
                    // 	if(col instanceof yy.Column) colas = col.columnid;
                    // 	else colas = col.toString();
                    // };
                    if (col instanceof yy.AggrValue) {
                        if (col.distinct) {
                            aft +=
                                ",g['$$_VALUES_" +
                                colas +
                                "']={},g['$$_VALUES_" +
                                colas +
                                "'][" +
                                colexp +
                                ']=true';
                        }
                        if (col.aggregatorid === 'SUM') {
                            return "'" + colas + "':(" + colexp + ')||0,';
                        } else if (
                            col.aggregatorid === 'MIN' ||
                            col.aggregatorid === 'MAX' ||
                            col.aggregatorid === 'FIRST' ||
                            col.aggregatorid === 'LAST'
                        //					|| col.aggregatorid == 'AVG'
                        //							) { return "'"+col.as+'\':r[\''+col.as+'\'],'; }//f.field.arguments[0].toJS();
                        ) {
                            return "'" + colas + "':" + colexp + ','; //f.field.arguments[0].toJS();
                        } else if (col.aggregatorid === 'ARRAY') {
                            return "'" + colas + "':[" + colexp + '],';
                        } else if (col.aggregatorid === 'COUNT') {
                            if (col.expression.columnid === '*') {
                                return "'" + colas + "':1,";
                            } else {
                                //						return "'"+colas+'\':(typeof '+colexp+' != "undefined")?1:0,';
                                //					} else {
                                return "'" + colas + "':(typeof " + colexp + ' != "undefined")?1:0,';
                            }

                            //				else if(col.aggregatorid == 'MIN') { return "'"+col.as+'\':r[\''+col.as+'\'],'; }
                            //				else if(col.aggregatorid == 'MAX') { return "'"+col.as+'\':r[\''+col.as+'\'],'; }
                        } else if (col.aggregatorid === 'AVG') {
                            query.removeKeys.push('_SUM_' + colas);
                            query.removeKeys.push('_COUNT_' + colas);

                            return (
                                '' +
                                "'" +
                                colas +
                                "':" +
                                colexp +
                                ",'_SUM_" +
                                colas +
                                "':(" +
                                colexp +
                                ")||0,'_COUNT_" +
                                colas +
                                "':(typeof " +
                                colexp +
                                ' != "undefined")?1:0,'
                            );
                        } else if (col.aggregatorid === 'AGGR') {
                            aft += ",g['" + colas + "']=" + col.expression.toJS('g', -1);
                            return '';
                        } else if (col.aggregatorid === 'REDUCE') {
                            //					query.removeKeys.push('_REDUCE_'+colas);
                            query.aggrKeys.push(col);

                            //					return "'"+colas+'\':alasql.aggr[\''+col.funcid+'\']('+colexp+',undefined,(acc={}),1),'
                            //					+'\'__REDUCE__'+colas+'\':acc,';
                            return (
                                "'" +
                                colas +
                                "':alasql.aggr['" +
                                col.funcid +
                                "'](" +
                                colexp +
                                ',undefined,1),'
                            );
                        }
                        return '';
                    }

                    return '';
                })
                .join('');

            s += '}' + aft + ',g));' + aft2 + '} else {';

            /*
             // var neggroup = arrayDiff(allgroups,agroup);

             // s += neggroup.map(function(columnid){
             // 	return "g['"+columnid+"']=null;";
             // }).join('');
             */

            //		s += self.columns.map(function(col){
            s += query.selectGroup
                .map(function(col) {
                    var colas = col.nick;

                    var colexp = col.expression.toJS('p', tableid, defcols);

                    if (col instanceof yy.AggrValue) {
                        var pre = '',
                            post = '';
                        if (col.distinct) {
                            var pre =
                                'if(typeof ' +
                                colexp +
                                '!="undefined" && (!g[\'$$_VALUES_' +
                                colas +
                                "'][" +
                                colexp +
                                '])) \
				 		 {';
                            var post = "g['$$_VALUES_" + colas + "'][" + colexp + ']=true;}';
                        }
                        if (col.aggregatorid === 'SUM') {
                            return pre + "g['" + colas + "']+=(" + colexp + '||0);' + post; //f.field.arguments[0].toJS();
                        } else if (col.aggregatorid === 'COUNT') {

                            if (col.expression.columnid === '*') {
                                return pre + "g['" + colas + "']++;" + post;
                            } else {
                                return (
                                    pre +
                                    'if(typeof ' +
                                    colexp +
                                    '!="undefined") g[\'' +
                                    colas +
                                    "']++;" +
                                    post
                                );
                            }
                        } else if (col.aggregatorid === 'ARRAY') {
                            return pre + "g['" + colas + "'].push(" + colexp + ');' + post;
                        } else if (col.aggregatorid === 'MIN') {
                            return (
                                pre +
                                "g['" +
                                colas +
                                "']=Math.min(g['" +
                                colas +
                                "']," +
                                colexp +
                                ');' +
                                post
                            );
                        } else if (col.aggregatorid === 'MAX') {
                            return (
                                pre +
                                "g['" +
                                colas +
                                "']=Math.max(g['" +
                                colas +
                                "']," +
                                colexp +
                                ');' +
                                post
                            );
                        } else if (col.aggregatorid === 'FIRST') {
                            return '';
                        } else if (col.aggregatorid === 'LAST') {
                            return pre + "g['" + colas + "']=" + colexp + ';' + post;
                        } else if (col.aggregatorid === 'AVG') {
                            return (
                                '' +
                                pre +
                                "g['_SUM_" +
                                colas +
                                "']+=(y=" +
                                colexp +
                                ')||0;' +
                                "g['_COUNT_" +
                                colas +
                                '\']+=(typeof y!="undefined")?1:0;' +
                                "g['" +
                                colas +
                                "']=g['_SUM_" +
                                colas +
                                "']/g['_COUNT_" +
                                colas +
                                "'];" +
                                post
                            );
                            //					 }
                            //			else if(col.aggregatorid == 'AVG') { srg.push(colas+':0'); }
                        } else if (col.aggregatorid === 'AGGR') {
                            return (
                                '' +
                                pre +
                                "g['" +
                                colas +
                                "']=" +
                                col.expression.toJS('g', -1) +
                                ';' +
                                post
                            );
                        } else if (col.aggregatorid === 'REDUCE') {
                            return (
                                '' +
                                pre +
                                "g['" +
                                colas +
                                "']=alasql.aggr." +
                                col.funcid +
                                '(' +
                                colexp +
                                ",g['" +
                                colas +
                                "'],2);" +
                                post
                            );
                        }

                        return '';
                    }

                    return '';
                })
                .join('');

            //		s += selectFields.map(function(f){

            //			if(f.constructor.name == 'LiteralValue') return '';
            //			if (f.field instanceof SQLParser.nodes.FunctionValue
            //				&& (f.field.name.toUpperCase() == 'SUM' || f.field.name.toUpperCase() == 'COUNT')) {
            //				return 'group.'+f.name.value+'=+(+group.'+f.name.value+'||0)+'+f.field.arguments[0].toJS('rec','')+';'; //f.field.arguments[0].toJS();
            //				return 'group.'+f.name.value+'+='+f.field.arguments[0].toJS('rec','')+';'; //f.field.arguments[0].toJS();
            //				return 'group.'+f.name.value+'+=rec.'+f.name.value+';'; //f.field.arguments[0].toJS();
            //			};
            //			return '';
            //		}).join('');

            //		s += '	group.amt += rec.emplid;';
            //		s += 'group.count++;';
            s += '}';
        });

        return new Function('p,params,alasql', 'var y;' + s);
    };

    /*
     //
     // Select compiler part for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// yy.Select.prototype.compileSources = function(query) {

// };

    function compileSelectStar(query, alias, joinstar) {

        var sp = '',
            ss = [];
        //	if(!alias) {
        //		sp += 'for(var k1 in p) var w=p[k1];for(var k2 in w){r[k2]=w[k2]};';
        //	} else 	{

        // TODO move this out of this function
        query.ixsources = {};
        query.sources.forEach(function(source) {
            query.ixsources[source.alias] = source;
        });

        // Fixed
        var columns;
        if (query.ixsources[alias]) {
            var columns = query.ixsources[alias].columns;
        }

        //		if(columns.length == 0 && query.aliases[alias].tableid) {
        //			var columns = alasql.databases[query.aliases[alias].databaseid].tables[query.aliases[alias].tableid].columns;
        //		};

        // Check if this is a Table or other
        if (joinstar && alasql.options.joinstar == 'json') {
            sp += "r['" + alias + "']={};";
        }

        if (columns && columns.length > 0) {
            columns.forEach(function(tcol) {
                if (joinstar && alasql.options.joinstar == 'underscore') {
                    ss.push(
                        "'" +
                        alias +
                        '_' +
                        tcol.columnid +
                        "':p['" +
                        alias +
                        "']['" +
                        tcol.columnid +
                        "']"
                    );
                } else if (joinstar && alasql.options.joinstar == 'json') {
                    //				ss.push('\''+alias+'_'+tcol.columnid+'\':p[\''+alias+'\'][\''+tcol.columnid+'\']');
                    sp +=
                        "r['" +
                        alias +
                        "']['" +
                        tcol.columnid +
                        "']=p['" +
                        alias +
                        "']['" +
                        tcol.columnid +
                        "'];";
                } else {
                    ss.push("'" + tcol.columnid + "':p['" + alias + "']['" + tcol.columnid + "']");
                }

                query.selectColumns[escapeq(tcol.columnid)] = true;

                var coldef = {
                    columnid: tcol.columnid,
                    dbtypeid: tcol.dbtypeid,
                    dbsize: tcol.dbsize,
                    dbprecision: tcol.dbprecision,
                    dbenum: tcol.dbenum,
                };
                query.columns.push(coldef);
                query.xcolumns[coldef.columnid] = coldef;
            });

        } else {

            // if column not exist, then copy all
            sp += 'var w=p["' + alias + '"];for(var k in w){r[k]=w[k]};';

            query.dirtyColumns = true;
        }
        //	}

        return {s: ss.join(','), sp: sp};
    }

    yy.Select.prototype.compileSelect1 = function(query, params) {
        var self = this;
        query.columns = [];
        query.xcolumns = {};
        query.selectColumns = {};
        query.dirtyColumns = false;
        var s = 'var r={';
        var sp = '';
        var ss = [];

        this.columns.forEach(function(col) {

            if (col instanceof yy.Column) {
                if (col.columnid === '*') {
                    if (col.func) {
                        sp +=
                            "r=params['" +
                            col.param +
                            "'](p['" +
                            query.sources[0].alias +
                            "'],p,params,alasql);";
                    } else if (col.tableid) {
                        //Copy all
                        var ret = compileSelectStar(query, col.tableid, false);
                        if (ret.s) {
                            ss = ss.concat(ret.s);
                        }
                        sp += ret.sp;
                    } else {

                        for (var alias in query.aliases) {
                            var ret = compileSelectStar(query, alias, true); //query.aliases[alias].tableid);
                            if (ret.s) {
                                ss = ss.concat(ret.s);
                            }
                            sp += ret.sp;
                        }
                        // TODO Remove these lines
                        // In case of no information
                        // sp += 'for(var k1 in p){var w=p[k1];'+
                        // 			'for(k2 in w) {r[k2]=w[k2]}}'
                    }
                } else {
                    // If field, otherwise - expression
                    var tbid = col.tableid;

                    var dbid =
                        col.databaseid || query.sources[0].databaseid || query.database.databaseid;
                    if (!tbid) tbid = query.defcols[col.columnid];
                    if (!tbid) tbid = query.defaultTableid;
                    if (col.columnid !== '_') {
                        if (
                            false &&
                            tbid &&
                            !query.defcols['.'][col.tableid] &&
                            !query.defcols[col.columnid]
                        ) {
                            ss.push(
                                "'" +
                                escapeq(col.as || col.columnid) +
                                "':p['" +
                                query.defaultTableid +
                                "']['" +
                                col.tableid +
                                "']['" +
                                col.columnid +
                                "']"
                            );
                        } else {
                            // workaround for multisheet xlsx export with custom COLUMNS
                            var isMultisheetParam =
                                params &&
                                params.length > 1 &&
                                Array.isArray(params[0]) &&
                                params[0].length >= 1 &&
                                params[0][0].hasOwnProperty('sheetid');
                            if (isMultisheetParam) {
                                sp =
                                    'var r={};var w=p["' +
                                    tbid +
                                    '"];' +
                                    'var cols=[' +
                                    self.columns
                                        .map(function(col) {
                                            return "'" + col.columnid + "'";
                                        })
                                        .join(',') +
                                    '];var colas=[' +
                                    self.columns
                                        .map(function(col) {
                                            return "'" + (col.as || col.columnid) + "'";
                                        })
                                        .join(',') +
                                    '];' +
                                    "for (var i=0;i<Object.keys(p['" +
                                    tbid +
                                    "']).length;i++)" +
                                    ' for(var k=0;k<cols.length;k++){if (!r.hasOwnProperty(i)) r[i]={}; r[i][colas[k]]=w[i][cols[k]];}';
                            } else {
                                ss.push(
                                    "'" +
                                    escapeq(col.as || col.columnid) +
                                    "':p['" +
                                    tbid +
                                    "']['" +
                                    col.columnid +
                                    "']"
                                );
                            }
                        }
                    } else {
                        ss.push("'" + escapeq(col.as || col.columnid) + "':p['" + tbid + "']");
                    }
                    query.selectColumns[escapeq(col.as || col.columnid)] = true;

                    if (query.aliases[tbid] && query.aliases[tbid].type === 'table') {
                        if (!alasql.databases[dbid].tables[query.aliases[tbid].tableid]) {

                            throw new Error("Table '" + tbid + "' does not exist in database");
                        }
                        var columns =
                            alasql.databases[dbid].tables[query.aliases[tbid].tableid].columns;
                        var xcolumns =
                            alasql.databases[dbid].tables[query.aliases[tbid].tableid].xcolumns;

                        if (xcolumns && columns.length > 0) {

                            var tcol = xcolumns[col.columnid];

                            if (undefined === tcol) {
                                throw new Error('Column does not exist: ' + col.columnid);
                            }

                            var coldef = {
                                columnid: col.as || col.columnid,
                                dbtypeid: tcol.dbtypeid,
                                dbsize: tcol.dbsize,
                                dbpecision: tcol.dbprecision,
                                dbenum: tcol.dbenum,
                            };

                            query.columns.push(coldef);
                            query.xcolumns[coldef.columnid] = coldef;
                        } else {
                            var coldef = {
                                columnid: col.as || col.columnid,
                                //							dbtypeid:tcol.dbtypeid,
                                //							dbsize:tcol.dbsize,
                                //							dbpecision:tcol.dbprecision,
                                //							dbenum: tcol.dbenum,
                            };

                            query.columns.push(coldef);
                            query.xcolumns[coldef.columnid] = coldef;

                            query.dirtyColumns = true;
                        }
                    } else {
                        var coldef = {
                            columnid: col.as || col.columnid,
                            //							dbtypeid:tcol.dbtypeid,
                            //							dbsize:tcol.dbsize,
                            //							dbpecision:tcol.dbprecision,
                            //							dbenum: tcol.dbenum,
                        };

                        query.columns.push(coldef);
                        query.xcolumns[coldef.columnid] = coldef;
                        // This is a subquery?
                        // throw new Error('There is now such table \''+col.tableid+'\'');
                    }
                }
            } else if (col instanceof yy.AggrValue) {
                if (!self.group) {
                    //				self.group=[new yy.Column({columnid:'q',as:'q'	})];
                    self.group = [''];
                }
                if (!col.as) {
                    col.as = escapeq(col.toString());
                }

                if (
                    col.aggregatorid === 'SUM' ||
                    col.aggregatorid === 'MAX' ||
                    col.aggregatorid === 'MIN' ||
                    col.aggregatorid === 'FIRST' ||
                    col.aggregatorid === 'LAST' ||
                    col.aggregatorid === 'AVG' ||
                    col.aggregatorid === 'ARRAY' ||
                    col.aggregatorid === 'REDUCE'
                ) {
                    ss.push(
                        "'" +
                        escapeq(col.as) +
                        "':" +
                        n2u(col.expression.toJS('p', query.defaultTableid, query.defcols))
                    );
                } else if (col.aggregatorid === 'COUNT') {
                    ss.push("'" + escapeq(col.as) + "':1");
                    // Nothing
                }
                // todo: confirm that no default action must be implemented

                //			query.selectColumns[col.aggregatorid+'('+escapeq(col.expression.toString())+')'] = thtd;

                var coldef = {
                    columnid: col.as || col.columnid || col.toString(),
                    //							dbtypeid:tcol.dbtypeid,
                    //							dbsize:tcol.dbsize,
                    //							dbpecision:tcol.dbprecision,
                    //							dbenum: tcol.dbenum,
                };

                query.columns.push(coldef);
                query.xcolumns[coldef.columnid] = coldef;

                //			else if (col.aggregatorid == 'MAX') {
                //				ss.push((col.as || col.columnid)+':'+col.toJS("p.",query.defaultTableid))
                //			} else if (col.aggregatorid == 'MIN') {
                //				ss.push((col.as || col.columnid)+':'+col.toJS("p.",query.defaultTableid))
                //			}
            } else {

                ss.push(
                    "'" +
                    escapeq(col.as || col.columnid || col.toString()) +
                    "':" +
                    n2u(col.toJS('p', query.defaultTableid, query.defcols))
                );
                //			ss.push('\''+escapeq(col.toString())+'\':'+col.toJS("p",query.defaultTableid));
                //if(col instanceof yy.Expression) {
                query.selectColumns[escapeq(col.as || col.columnid || col.toString())] = true;

                var coldef = {
                    columnid: col.as || col.columnid || col.toString(),
                    //							dbtypeid:tcol.dbtypeid,
                    //							dbsize:tcol.dbsize,
                    //							dbpecision:tcol.dbprecision,
                    //							dbenum: tcol.dbenum,
                };

                query.columns.push(coldef);
                query.xcolumns[coldef.columnid] = coldef;
            }
        });
        s += ss.join(',') + '};' + sp;
        return s;

    };
    yy.Select.prototype.compileSelect2 = function(query) {
        var s = query.selectfns;
        if (this.orderColumns && this.orderColumns.length > 0) {
            this.orderColumns.forEach(function(v, idx) {
                var key = '$$$' + idx;
                if (v instanceof yy.Column && query.xcolumns[v.columnid]) {
                    s += "r['" + key + "']=r['" + v.columnid + "'];";
                } else {
                    s += "r['" + key + "']=" + v.toJS('p', query.defaultTableid, query.defcols) + ';';
                }
                query.removeKeys.push(key);
            });
        }

        return new Function('p,params,alasql', 'var y;' + s + 'return r');
    };

    yy.Select.prototype.compileSelectGroup0 = function(query) {
        var self = this;
        self.columns.forEach(function(col, idx) {
            if (!(col instanceof yy.Column && col.columnid === '*')) {
                var colas;
                //  = col.as;
                if (col instanceof yy.Column) {
                    colas = escapeq(col.columnid);
                } else {
                    colas = escapeq(col.toString(true));

                }
                for (var i = 0; i < idx; i++) {
                    if (colas === self.columns[i].nick) {
                        colas = self.columns[i].nick + ':' + idx;
                        break;
                    }
                }
                // }
                col.nick = colas;
                if (
                    col.funcid &&
                    (col.funcid.toUpperCase() === 'ROWNUM' || col.funcid.toUpperCase() === 'ROW_NUMBER')
                ) {
                    query.rownums.push(col.as);
                }

                // }
            } else {
                query.groupStar = col.tableid || 'default';
            }
        });

        this.columns.forEach(function(col) {
            if (col.findAggregator) {
                col.findAggregator(query);
            }
        });

        if (this.having) {
            if (this.having.findAggregator) {
                this.having.findAggregator(query);
            }
        }
    };

    yy.Select.prototype.compileSelectGroup1 = function(query) {
        var self = this;
        var s = 'var r = {};';

        self.columns.forEach(function(col) {

            if (col instanceof yy.Column && col.columnid === '*') {
                //			s += 'for(var k in g){r[k]=g[k]};';
                //			s += 'for(var k in this.query.groupColumns){r[k]=g[this.query.groupColumns[k]]};';

                s += 'for(var k in g) {r[k]=g[k]};';
                return '';

            } else {
                // var colas = col.as;
                var colas = col.as;
                if (colas === undefined) {
                    if (col instanceof yy.Column) {
                        colas = escapeq(col.columnid);
                    } else {
                        colas = col.nick;
                    }
                }
                query.groupColumns[colas] = col.nick;

                //			if(col.as) {
                s += "r['" + colas + "']=";
                //			// } else {
                //			// 	s += 'r[\''+escapeq()+'\']=';
                //			// };
                //			// s += ';';

                s += n2u(col.toJS('g', '')) + ';';

                for (var i = 0; i < query.removeKeys.length; i++) {
                    // THis part should be intellectual
                    if (query.removeKeys[i] === colas) {
                        query.removeKeys.splice(i, 1);
                        break;
                    }
                }
            }
        });
        // return new Function('g,params,alasql',s+'return r');
        return s;
    };

    yy.Select.prototype.compileSelectGroup2 = function(query) {
        var self = this;
        var s = query.selectgfns;
        self.columns.forEach(function(col) {

            if (query.ingroup.indexOf(col.nick) > -1) {
                s += "r['" + (col.as || col.nick) + "']=g['" + col.nick + "'];";
            }
        });

        if (this.orderColumns && this.orderColumns.length > 0) {
            this.orderColumns.forEach(function(v, idx) {

                var key = '$$$' + idx;

                if (v instanceof yy.Column && query.groupColumns[v.columnid]) {
                    s += "r['" + key + "']=r['" + v.columnid + "'];";
                } else {
                    s += "r['" + key + "']=" + v.toJS('g', '') + ';';
                }
                query.removeKeys.push(key);
            });
        }

        return new Function('g,params,alasql', 'var y;' + s + 'return r');
    };

// SELECY * REMOVE [COLUMNS] col-list, LIKE ''
    yy.Select.prototype.compileRemoveColumns = function(query) {
        var self = this;
        if (typeof this.removecolumns !== 'undefined') {
            query.removeKeys = query.removeKeys.concat(
                this.removecolumns
                    .filter(function(column) {
                        return typeof column.like === 'undefined';
                    })
                    .map(function(column) {
                        return column.columnid;
                    })
            );

            query.removeLikeKeys = this.removecolumns
                .filter(function(column) {
                    return typeof column.like !== 'undefined';
                })
                .map(function(column) {
                    //				return new RegExp((column.like.value||'').replace(/\%/g,'.*').replace(/\?|_/g,'.'),'g');
                    return column.like.value;
                });
        }
    };

    /* global yy */

    yy.Select.prototype.compileHaving = function(query) {
        if (this.having) {
            var s = this.having.toJS('g', -1);
            query.havingfns = s;

            return new Function('g,params,alasql', 'var y;return ' + s);
        }

        return function() {
            return true;
        };
    };

    yy.Select.prototype.compileOrder = function(query) {
        var self = this;
        self.orderColumns = [];
        if (this.order) {

            if (
                this.order &&
                this.order.length == 1 &&
                this.order[0].expression &&
                typeof this.order[0].expression == 'function'
            ) {

                var func = this.order[0].expression;

                return function(a, b) {
                    var ra = func(a),
                        rb = func(b);
                    if (ra > rb) return 1;
                    if (ra == rb) return 0;
                    return -1;
                };
            }

            var s = '';
            var sk = '';
            this.order.forEach(function(ord, idx) {

                if (ord.expression instanceof yy.NumValue) {
                    var v = self.columns[ord.expression.value - 1];
                } else {
                    var v = ord.expression;
                }
                self.orderColumns.push(v);

                var key = '$$$' + idx;

                // Date conversion
                var dg = '';
                //if(alasql.options.valueof)
                if (ord.expression instanceof yy.Column) {
                    var columnid = ord.expression.columnid;
                    if (query.xcolumns[columnid]) {
                        var dbtypeid = query.xcolumns[columnid].dbtypeid;
                        if (dbtypeid == 'DATE' || dbtypeid == 'DATETIME' || dbtypeid == 'DATETIME2')
                            dg = '.valueOf()';
                        // TODO Add other types mapping
                    } else {
                        if (alasql.options.valueof) dg = '.valueOf()'; // TODO Check
                    }
                    //				dg = '.valueOf()';
                }
                // COLLATE NOCASE
                if (ord.nocase) dg += '.toUpperCase()';
                s +=
                    "if((a['" +
                    key +
                    "']||'')" +
                    dg +
                    (ord.direction == 'ASC' ? '>' : '<') +
                    "(b['" +
                    key +
                    "']||'')" +
                    dg +
                    ')return 1;';
                s += "if((a['" + key + "']||'')" + dg + "==(b['" + key + "']||'')" + dg + '){';

                /*
                 if(false) {

                 if(ord.expression instanceof yy.NumValue) {
                 ord.expression = self.columns[ord.expression.value-1];

                 ord.expression = new yy.Column({columnid:ord.expression.nick});
                 };

                 if(ord.expression instanceof yy.Column) {
                 var columnid = ord.expression.columnid;
                 if(query.xcolumns[columnid]) {
                 var dbtypeid = query.xcolumns[columnid].dbtypeid;
                 if( dbtypeid == 'DATE' || dbtypeid == 'DATETIME' || dbtypeid == 'DATETIME2') dg = '.valueOf()';
                 // TODO Add other types mapping
                 } else {
                 if(alasql.options.valueof) dg = '.valueOf()'; // TODO Check
                 }
                 // COLLATE NOCASE
                 if(ord.nocase) dg += '.toUpperCase()';

                 s += 'if((a[\''+columnid+"']||'')"+dg+(ord.direction == 'ASC'?'>':'<')+'(b[\''+columnid+"']||'')"+dg+')return 1;';
                 s += 'if((a[\''+columnid+"']||'')"+dg+'==(b[\''+columnid+"']||'')"+dg+'){';

                 } else {
                 dg = '.valueOf()';
                 // COLLATE NOCASE
                 if(ord.nocase) dg += '.toUpperCase()';
                 s += 'if(('+ord.toJS('a','')+"||'')"+dg+(ord.direction == 'ASC'?'>(':'<(')+ord.toJS('b','')+"||'')"+dg+')return 1;';
                 s += 'if(('+ord.toJS('a','')+"||'')"+dg+'==('+ord.toJS('b','')+"||'')"+dg+'){';
                 }

                 // TODO Add date comparision

                 }
                 */
                sk += '}';
            });
            s += 'return 0;';
            s += sk + 'return -1';
            query.orderfns = s;

            return new Function('a,b', 'var y;' + s);
        }
    };

// Pivot functions
    /**
     Compile Pivot functions
     @param {object} query Source query
     @return {function} Pivoting functions
     */
    yy.Select.prototype.compilePivot = function(query) {
        var self = this;
        /** @type {string} Main pivoting column */

        var columnid = self.pivot.columnid;
        var exprcolid = self.pivot.expr.expression.columnid;
        var aggr = self.pivot.expr.aggregatorid;
        var inlist = self.pivot.inlist;

        if (inlist) {
            inlist = inlist.map(function(l) {
                return l.expr.columnid;
            });
        }

        // Function for PIVOT post production
        return function() {
            var query = this;
            var cols = query.columns
                .filter(function(col) {
                    return col.columnid != columnid && col.columnid != exprcolid;
                })
                .map(function(col) {
                    return col.columnid;
                });

            var newcols = [];
            var gnewcols = {};
            var gr = {};
            var ga = {};
            var data = [];
            query.data.forEach(function(d) {
                if (!inlist || inlist.indexOf(d[columnid]) > -1) {
                    var gx = cols
                        .map(function(colid) {
                            return d[colid];
                        })
                        .join('`');
                    var g = gr[gx];
                    if (!g) {
                        g = {};
                        gr[gx] = g;
                        data.push(g);
                        cols.forEach(function(colid) {
                            g[colid] = d[colid];
                        });
                    }

                    if (!ga[gx]) {
                        ga[gx] = {};
                    }

                    if (ga[gx][d[columnid]]) {
                        ga[gx][d[columnid]]++;
                    } else {
                        ga[gx][d[columnid]] = 1;
                    }

                    if (!gnewcols[d[columnid]]) {
                        gnewcols[d[columnid]] = true;
                        newcols.push(d[columnid]);
                    }

                    if (aggr == 'SUM' || aggr == 'AVG') {
                        if (typeof g[d[columnid]] == 'undefined') g[d[columnid]] = 0;
                        g[d[columnid]] += d[exprcolid];
                    } else if (aggr == 'COUNT') {
                        if (typeof g[d[columnid]] == 'undefined') g[d[columnid]] = 0;
                        g[d[columnid]]++;
                    } else if (aggr == 'MIN') {
                        if (typeof g[d[columnid]] == 'undefined') g[d[columnid]] = Infinity;
                        if (d[exprcolid] < g[d[columnid]]) g[d[columnid]] = d[exprcolid];
                    } else if (aggr == 'MAX') {
                        if (typeof g[d[columnid]] == 'undefined') g[d[columnid]] = -Infinity;
                        if (d[exprcolid] > g[d[columnid]]) g[d[columnid]] = d[exprcolid];
                    } else if (aggr == 'FIRST') {
                        if (typeof g[d[columnid]] == 'undefined') g[d[columnid]] = d[exprcolid];
                    } else if (aggr == 'LAST') {
                        g[d[columnid]] = d[exprcolid];
                    } else if (alasql.aggr[aggr]) {
                        // Custom aggregator
                        alasql.aggr[aggr](g[d[columnid]], d[exprcolid]);
                    } else {
                        throw new Error('Wrong aggregator in PIVOT clause');
                    }
                }
            });

            if (aggr == 'AVG') {
                for (var gx in gr) {
                    var d = gr[gx];
                    for (var colid in d) {
                        if (cols.indexOf(colid) == -1 && colid != exprcolid) {
                            d[colid] = d[colid] / ga[gx][colid];
                        }
                    }
                }
            }

            // columns
            query.data = data;

            if (inlist) newcols = inlist;

            var ncol = query.columns.filter(function(col) {
                return col.columnid == exprcolid;
            })[0];
            query.columns = query.columns.filter(function(col) {
                return !(col.columnid == columnid || col.columnid == exprcolid);
            });
            newcols.forEach(function(colid) {
                var nc = cloneDeep(ncol);
                nc.columnid = colid;
                query.columns.push(nc);
            });
        };
    };

// var columnid = this.pivot.columnid;

// return function(data){

// if(false) {

// }

// if(false) {

// }
// };

    /**
     Compile UNPIVOT clause
     @param {object} query Query object
     @return {function} Function for unpivoting
     */
    yy.Select.prototype.compileUnpivot = function(query) {
        var self = this;
        var tocolumnid = self.unpivot.tocolumnid;
        var forcolumnid = self.unpivot.forcolumnid;
        var inlist = self.unpivot.inlist.map(function(l) {
            return l.columnid;
        });

        return function() {
            var data = [];

            var xcols = query.columns
                .map(function(col) {
                    return col.columnid;
                })
                .filter(function(colid) {
                    return inlist.indexOf(colid) == -1 && colid != forcolumnid && colid != tocolumnid;
                });

            query.data.forEach(function(d) {
                inlist.forEach(function(colid) {
                    var nd = {};
                    xcols.forEach(function(xcolid) {
                        nd[xcolid] = d[xcolid];
                    });
                    nd[forcolumnid] = colid;
                    nd[tocolumnid] = d[colid];
                    data.push(nd);
                });
            });

            query.data = data;

            //		});
        };
    };

    /*
     //
     // ROLLUP(), CUBE(), GROUPING SETS() for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /**
     Calculate ROLLUP() combination
     */

    var rollup = function(a, query) {
        var rr = [];
        var mask = 0;
        var glen = a.length;
        for (var g = 0; g < glen + 1; g++) {
            var ss = [];
            for (var i = 0; i < glen; i++) {
                if (a[i] instanceof yy.Column) {
                    a[i].nick = escapeq(a[i].columnid);

                    query.groupColumns[escapeq(a[i].columnid)] = a[i].nick;
                    var aaa = a[i].nick + '\t' + a[i].toJS('p', query.sources[0].alias, query.defcols);
                } else {
                    query.groupColumns[escapeq(a[i].toString())] = escapeq(a[i].toString());
                    var aaa =
                        escapeq(a[i].toString()) +
                        '\t' +
                        a[i].toJS('p', query.sources[0].alias, query.defcols);
                }

                if (mask & (1 << i)) ss.push(aaa);
            }
            rr.push(ss);
            mask = (mask << 1) + 1;
        }
        return rr;
    };

    /**
     Calculate CUBE()
     */
    var cube = function(a, query) {
        var rr = [];
        var glen = a.length;
        var glenCube = 1 << glen;
        for (var g = 0; g < glenCube; g++) {
            var ss = [];
            for (var i = 0; i < glen; i++) {
                if (g & (1 << i))
                //ss.push(a[i]);
                //ss = cartes(ss,decartes(a[i]));

                //				var aaa = a[i].toString()+'\t'
                //					+a[i].toJS('p',query.sources[0].alias,query.defcols);

                    ss = ss.concat(decartes(a[i], query));
                //
            }
            rr.push(ss);
        }
        return rr;
    };

    /**
     GROUPING SETS()
     */
    var groupingsets = function(a, query) {
        return a.reduce(function(acc, d) {
            acc = acc.concat(decartes(d, query));
            return acc;
        }, []);
    };

    /**
     Cartesian production
     */
    var cartes = function(a1, a2) {
        var rrr = [];
        for (var i1 = 0; i1 < a1.length; i1++) {
            for (var i2 = 0; i2 < a2.length; i2++) {
                rrr.push(a1[i1].concat(a2[i2]));
            }
        }
        return rrr;
    };

    /**
     Prepare groups function
     */
    function decartes(gv, query) {

        if (Array.isArray(gv)) {
            var res = [[]];
            for (var t = 0; t < gv.length; t++) {
                if (gv[t] instanceof yy.Column) {

                    gv[t].nick = escapeq(gv[t].columnid);
                    query.groupColumns[gv[t].nick] = gv[t].nick;
                    res = res.map(function(r) {
                        return r.concat(
                            gv[t].nick + '\t' + gv[t].toJS('p', query.sources[0].alias, query.defcols)
                        );
                    });
                    //		 		res = res.map(function(r){return r.concat(gv[t].columnid)});
                } else if (gv[t] instanceof yy.FuncValue) {
                    query.groupColumns[escapeq(gv[t].toString())] = escapeq(gv[t].toString());
                    res = res.map(function(r) {
                        return r.concat(
                            escapeq(gv[t].toString()) +
                            '\t' +
                            gv[t].toJS('p', query.sources[0].alias, query.defcols)
                        );
                    });
                    // to be defined
                } else if (gv[t] instanceof yy.GroupExpression) {
                    if (gv[t].type == 'ROLLUP') res = cartes(res, rollup(gv[t].group, query));
                    else if (gv[t].type == 'CUBE') res = cartes(res, cube(gv[t].group, query));
                    else if (gv[t].type == 'GROUPING SETS')
                        res = cartes(res, groupingsets(gv[t].group, query));
                    else throw new Error('Unknown grouping function');
                } else if (gv[t] === '') {

                    res = [['1\t1']];
                } else {
                    //				if(gv[t])

                    res = res.map(function(r) {
                        query.groupColumns[escapeq(gv[t].toString())] = escapeq(gv[t].toString());
                        return r.concat(
                            escapeq(gv[t].toString()) +
                            '\t' +
                            gv[t].toJS('p', query.sources[0].alias, query.defcols)
                        );
                    });
                    //				res = res.concat(gv[t]);
                }

            }
            return res;
        } else if (gv instanceof yy.FuncValue) {

            query.groupColumns[escapeq(gv.toString())] = escapeq(gv.toString());
            return [gv.toString() + '\t' + gv.toJS('p', query.sources[0].alias, query.defcols)];
        } else if (gv instanceof yy.Column) {
            gv.nick = escapeq(gv.columnid);
            query.groupColumns[gv.nick] = gv.nick;
            return [gv.nick + '\t' + gv.toJS('p', query.sources[0].alias, query.defcols)]; // Is this ever happened?
            // } else if(gv instanceof yy.Expression) {
            // 	return [gv.columnid]; // Is this ever happened?
        } else {
            query.groupColumns[escapeq(gv.toString())] = escapeq(gv.toString());
            return [
                escapeq(gv.toString()) + '\t' + gv.toJS('p', query.sources[0].alias, query.defcols),
            ];
            //			throw new Error('Single argument in the group without array');
        }

    }

    /*
     //
     // Select run-time part for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Select.prototype.compileDefCols = function(query, databaseid) {

        var defcols = {'.': {}};
        if (this.from) {
            this.from.forEach(function(fr) {
                defcols['.'][fr.as || fr.tableid] = true;
                if (fr instanceof yy.Table) {
                    var alias = fr.as || fr.tableid;

                    var table = alasql.databases[fr.databaseid || databaseid].tables[fr.tableid];

                    if (undefined === table) {
                        throw new Error('Table does not exist: ' + fr.tableid);
                    }

                    if (table.columns) {
                        table.columns.forEach(function(col) {
                            if (defcols[col.columnid]) {
                                defcols[col.columnid] = '-'; // Ambigous
                            } else {
                                defcols[col.columnid] = alias;
                            }
                        });
                    }
                } else if (fr instanceof yy.Select) {
                } else if (fr instanceof yy.Search) {
                } else if (fr instanceof yy.ParamValue) {
                } else if (fr instanceof yy.VarValue) {
                } else if (fr instanceof yy.FuncValue) {
                } else if (fr instanceof yy.FromData) {
                } else if (fr instanceof yy.Json) {
                } else if (fr.inserted) {
                } else {

                    throw new Error('Unknown type of FROM clause');
                }
            });
        }

        if (this.joins) {
            this.joins.forEach(function(jn) {
                defcols['.'][jn.as || jn.table.tableid] = true;

                if (jn.table) {
                    var alias = jn.table.tableid;
                    if (jn.as) alias = jn.as;
                    var alias = jn.as || jn.table.tableid;
                    var table =
                        alasql.databases[jn.table.databaseid || databaseid].tables[jn.table.tableid];

                    if (table.columns) {
                        table.columns.forEach(function(col) {
                            if (defcols[col.columnid]) {
                                defcols[col.columnid] = '-'; // Ambigous
                            } else {
                                defcols[col.columnid] = alias;
                            }
                        });
                    }
                } else if (jn.select) {
                } else if (jn.param) {
                } else if (jn.func) {
                } else {
                    throw new Error('Unknown type of FROM clause');
                }
            });
        }
        // for(var k in defcols) {
        // 	if(defcols[k] == '-') defcols[k] = undefined;
        // }

        return defcols;
    };

    /*
     //
     // UNION for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

// SELECT UNION statement

    yy.Union = function(params) {
        return yy.extend(this, params);
    };
    yy.Union.prototype.toString = function() {
        return 'UNION';
    };

    yy.Union.prototype.compile = function(tableid) {
        return null;
    };

    /*
     //
     // CROSS AND OUTER APPLY for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Apply = function(params) {
        return yy.extend(this, params);
    };

    yy.Apply.prototype.toString = function() {
        var s = this.applymode + ' APPLY (' + this.select.toString() + ')';

        if (this.as) s += ' AS ' + this.as;

        return s;
    };

    /*
     //
     // CROSS AND OUTER APPLY for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Over = function(params) {
        return yy.extend(this, params);
    };
    yy.Over.prototype.toString = function() {
        var s = 'OVER (';
        if (this.partition) {
            s += 'PARTITION BY ' + this.partition.toString();
            if (this.order) s += ' ';
        }
        if (this.order) {
            s += 'ORDER BY ' + this.order.toString();
        }
        s += ')';
        return s;
    };

    /*
     //
     // Expressions for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /**
     Expression statement ( = 2*2; )
     @class
     @param {object} params Initial parameters
     */
    yy.ExpressionStatement = function(params) {
        return yy.extend(this, params);
    };

    /**
     Convert AST to string
     @this ExpressionStatement
     @return {string}
     */
    yy.ExpressionStatement.prototype.toString = function() {
        return this.expression.toString();
    };
    /**
     Execute statement
     @param {string} databaseid Database identificatro
     @param {object} params Statement parameters
     @param {statement-callback} cb Callback
     @return {object} Result value
     */
    yy.ExpressionStatement.prototype.execute = function(databaseid, params, cb) {
        if (this.expression) {

            alasql.precompile(this, databaseid, params); // Precompile queries
            var exprfn = new Function(
                'params,alasql,p',
                'var y;return ' + this.expression.toJS('({})', '', null)
            ).bind(this);
            var res = exprfn(params, alasql);
            if (cb) {
                res = cb(res);
            }
            return res;
        }
    };

    /**
     Expression class
     @class
     @param {object} params Initial parameters
     */

    yy.Expression = function(params) {
        return yy.extend(this, params);
    };

    /**
     Convert AST to string
     @this ExpressionStatement
     @return {string}
     */
    yy.Expression.prototype.toString = function(dontas) {
        var s = this.expression.toString(dontas);
        if (this.order) {
            s += ' ' + this.order.toString();
        }
        if (this.nocase) {
            s += ' COLLATE NOCASE';
        }
        if (this.direction) {
            s += ' ' + this.direction;
        }
        return s;
    };

    /**
     Find aggregator in AST subtree
     @this ExpressionStatement
     @param {object} query Query object
     */
    yy.Expression.prototype.findAggregator = function(query) {
        if (this.expression.findAggregator) {
            this.expression.findAggregator(query);
        }
    };

    /**
     Convert AST to JavaScript expression
     @this ExpressionStatement
     @param {string} context Context string, e.g. 'p','g', or 'x'
     @param {string} tableid Default table name
     @param {object} defcols Default columns dictionary
     @return {string} JavaScript expression
     */

    yy.Expression.prototype.toJS = function(context, tableid, defcols) {

        if (this.expression.reduced) {
            return 'true';
        }
        return this.expression.toJS(context, tableid, defcols);
    };

    /**
     Compile AST to JavaScript expression
     @this ExpressionStatement
     @param {string} context Context string, e.g. 'p','g', or 'x'
     @param {string} tableid Default table name
     @param {object} defcols Default columns dictionary
     @return {string} JavaScript expression
     */

    yy.Expression.prototype.compile = function(context, tableid, defcols) {

        if (this.reduced) {
            return returnTrue();
        }
        return new Function('p', 'var y;return ' + this.toJS(context, tableid, defcols));
    };

    /**
     JavaScript class
     @class
     */
    yy.JavaScript = function(params) {
        return yy.extend(this, params);
    };
    yy.JavaScript.prototype.toString = function() {
        var s = '``' + this.value + '``';
        return s;
    };

    yy.JavaScript.prototype.toJS = function(/* context, tableid, defcols*/) {

        return '(' + this.value + ')';
    };
    yy.JavaScript.prototype.execute = function(databaseid, params, cb) {
        var res = 1;
        var expr = new Function('params,alasql,p', this.value);
        expr(params, alasql);
        if (cb) {
            res = cb(res);
        }
        return res;
    };

    /**
     Literal class
     @class
     @example
     MyVar, [My vairable], `MySQL variable`
     */

    yy.Literal = function(params) {
        return yy.extend(this, params);
    };
    yy.Literal.prototype.toString = function(dontas) {
        var s = this.value;
        if (this.value1) {
            s = this.value1 + '.' + s;
        }
        if (this.alias && !dontas) s += ' AS ' + this.alias;
        //	else s = tableid+'.'+s;
        return s;
    };

    /**
     Join class
     @class
     */

    yy.Join = function(params) {
        return yy.extend(this, params);
    };
    yy.Join.prototype.toString = function() {
        var s = ' ';
        if (this.joinmode) {
            s += this.joinmode + ' ';
        }
        s += 'JOIN ' + this.table.toString();
        return s;
    };

// }

    /**
     Table class
     @class
     */

    yy.Table = function(params) {
        return yy.extend(this, params);
    };
    yy.Table.prototype.toString = function() {
        var s = this.tableid;
        //	if(this.joinmode)
        if (this.databaseid) {
            s = this.databaseid + '.' + s;
        }
        return s;
    };

    /**
     View class
     @class
     */

    yy.View = function(params) {
        return yy.extend(this, params);
    };
    yy.View.prototype.toString = function() {
        var s = this.viewid;
        //	if(this.joinmode)
        if (this.databaseid) {
            s = this.databaseid + '.' + s;
        }
        return s;
    };

    /**
     Binary operation class
     @class
     */
    yy.Op = function(params) {
        return yy.extend(this, params);
    };
    yy.Op.prototype.toString = function() {
        if (this.op === 'IN' || this.op === 'NOT IN') {
            return this.left.toString() + ' ' + this.op + ' (' + this.right.toString() + ')';
        }
        if (this.allsome) {
            return (
                this.left.toString() +
                ' ' +
                this.op +
                ' ' +
                this.allsome +
                ' (' +
                this.right.toString() +
                ')'
            );
        }
        if (this.op === '->' || this.op === '!') {
            var s = this.left.toString() + this.op;

            if (typeof this.right !== 'string' && typeof this.right !== 'number') {
                s += '(';
            }

            s += this.right.toString();

            if (typeof this.right !== 'string' && typeof this.right !== 'number') {
                s += ')';
            }

            return s;
        }
        return (
            this.left.toString() +
            ' ' +
            this.op +
            ' ' +
            (this.allsome ? this.allsome + ' ' : '') +
            this.right.toString()
        );
    };

    yy.Op.prototype.findAggregator = function(query) {

        if (this.left && this.left.findAggregator) {
            this.left.findAggregator(query);
        }
        // Do not go in > ALL
        if (this.right && this.right.findAggregator && !this.allsome) {
            this.right.findAggregator(query);
        }
    };

    yy.Op.prototype.toType = function(tableid) {
        if (['-', '*', '/', '%', '^'].indexOf(this.op) > -1) {
            return 'number';
        }
        if (['||'].indexOf(this.op) > -1) {
            return 'string';
        }
        if (this.op === '+') {
            if (this.left.toType(tableid) === 'string' || this.right.toType(tableid) === 'string') {
                return 'string';
            }
            if (this.left.toType(tableid) === 'number' || this.right.toType(tableid) === 'number') {
                return 'number';
            }
        }

        if (
            [
                'AND',
                'OR',
                'NOT',
                '=',
                '==',
                '===',
                '!=',
                '!==',
                '!===',
                '>',
                '>=',
                '<',
                '<=',
                'IN',
                'NOT IN',
                'LIKE',
                'NOT LIKE',
                'REGEXP',
                'GLOB',
            ].indexOf(this.op) > -1
        ) {
            return 'boolean';
        }

        if (
            this.op === 'BETWEEN' ||
            this.op === 'NOT BETWEEN' ||
            this.op === 'IS NULL' ||
            this.op === 'IS NOT NULL'
        ) {
            return 'boolean';
        }

        if (this.allsome) {
            return 'boolean';
        }

        if (!this.op) {
            return this.left.toType();
        }

        return 'unknown';
    };

    yy.Op.prototype.toJS = function(context, tableid, defcols) {

        var s;
        var refs = [];
        var op = this.op;
        var _this = this;
        //var leftJS = function(){return _this.left.toJS(context,tableid, defcols)};
        //var rightJS = function(){return _this.right.toJS(context,tableid, defcols)};
        var accessedLeft = false,
            accessedRight = false;
        var ref = function(expr) {
            if (expr.toJS) {
                expr = expr.toJS(context, tableid, defcols);
            }
            var i = refs.push(expr) - 1;
            return 'y[' + i + ']';
        };
        var leftJS = function() {
            return ref(_this.left);
        };
        var rightJS = function() {
            return ref(_this.right);
        };

        if (this.op === '=') {
            op = '===';
        } else if (this.op === '<>') {
            op = '!=';
        } else if (this.op === 'OR') {
            op = '||';
        }

        // Arrow operator
        if (this.op === '->') {
            // Expression to prevent error if object is empty (#344)
            var ljs = '(' + leftJS() + '||{})';

            if (typeof this.right === 'string') {
                s = ljs + '["' + this.right + '"]';
            } else if (typeof this.right === 'number') {
                s = ljs + '[' + this.right + ']';
            } else if (this.right instanceof yy.FuncValue) {
                var ss = [];
                if (!(!this.right.args || 0 === this.right.args.length)) {
                    var ss = this.right.args.map(ref);
                }
                s = '' + ljs + "['" + this.right.funcid + "'](" + ss.join(',') + ')';
            } else {
                s = '' + ljs + '[' + rightJS() + ']';
            }
        }

        if (this.op === '!') {
            if (typeof this.right === 'string') {
                s =
                    '' +
                    'alasql.databases[alasql.useid].objects[' +
                    leftJS() +
                    ']["' +
                    this.right +
                    '"]';
            }
            // TODO - add other cases
        }

        if (this.op === 'IS') {
            s =
                '' +
                '(' +
                '(' +
                leftJS() +
                '==null)' + // Cant be ===
                ' === ' +
                '(' +
                rightJS() +
                '==null)' + // Cant be ===
                ')';
        }

        if (this.op === '==') {
            s = '' + 'alasql.utils.deepEqual(' + leftJS() + ',' + rightJS() + ')';
        }

        if (this.op === '===' || this.op === '!===') {
            s =
                '' +
                '(' +
                (this.op === '!===' ? '!' : '') +
                '(' +
                '(' +
                leftJS() +
                ').valueOf()' +
                '===' +
                '(' +
                rightJS() +
                ').valueOf()' +
                ')' +
                ')';
        }

        if (this.op === '!==') {
            s = '' + '(!alasql.utils.deepEqual(' + leftJS() + ',' + rightJS() + '))';
        }
        if (this.op === '||') {
            s = '' + "(''+(" + leftJS() + "||'')+(" + rightJS() + '||""))';
        }
        if (this.op === 'LIKE' || this.op === 'NOT LIKE') {
            var s =
                '(' +
                (this.op === 'NOT LIKE' ? '!' : '') +
                'alasql.utils.like(' +
                rightJS() +
                ',' +
                leftJS();
            if (this.escape) {
                s += ',' + ref(this.escape);
            }
            s += '))';
        }
        if (this.op === 'REGEXP') {
            s = 'alasql.stdfn.REGEXP_LIKE(' + leftJS() + ',' + rightJS() + ')';
        }
        if (this.op === 'GLOB') {
            s = 'alasql.utils.glob(' + leftJS() + ',' + rightJS() + ')';
        }

        if (this.op === 'BETWEEN' || this.op === 'NOT BETWEEN') {
            var left = leftJS();
            s =
                '' +
                '(' +
                (this.op === 'NOT BETWEEN' ? '!' : '') +
                '(' +
                '(' +
                ref(this.right1) +
                '<=' +
                left +
                ') && (' +
                left +
                '<=' +
                ref(this.right2) +
                ')' +
                ')' +
                ')';

        }

        if (this.op === 'IN') {
            if (this.right instanceof yy.Select) {
                s = '(';
                //			s += 'this.query.queriesdata['+this.queriesidx+']';
                //			s += 'alasql.utils.flatArray(this.query.queriesfn['+(this.queriesidx)+'](params,null,context))';
                s +=
                    'alasql.utils.flatArray(this.queriesfn[' +
                    this.queriesidx +
                    '](params,null,' +
                    context +
                    '))';
                s += '.indexOf(';
                s += leftJS() + ')>-1)';
            } else if (Array.isArray(this.right)) {
                //			if(this.right.length == 0) return 'false';
                s = '([' + this.right.map(ref).join(',') + '].indexOf(' + leftJS() + ')>-1)';

            } else {
                s = '(' + rightJS() + '.indexOf(' + leftJS() + ')>-1)';

                //		} else {
                //			throw new Error('Wrong IN operator without SELECT part');
            }
        }

        if (this.op === 'NOT IN') {
            if (this.right instanceof yy.Select) {
                s = '(';
                //this.query.queriesdata['+this.queriesidx+']
                //			s += 'alasql.utils.flatArray(this.query.queriesfn['+(this.queriesidx)+'](params,null,p))';
                s += 'alasql.utils.flatArray(this.queriesfn[' + this.queriesidx + '](params,null,p))';
                s += '.indexOf(';
                s += leftJS() + ')<0)';
            } else if (Array.isArray(this.right)) {
                //			if(this.right.length == 0) return 'true';
                s = '([' + this.right.map(ref).join(',') + '].indexOf(';
                s += leftJS() + ')<0)';
            } else {
                s = '(' + rightJS() + '.indexOf(';
                s += leftJS() + ')==-1)';

                //			throw new Error('Wrong NOT IN operator without SELECT part');
            }
        }

        if (this.allsome === 'ALL') {
            var s;
            if (this.right instanceof yy.Select) {
                //			var s = 'this.query.queriesdata['+this.queriesidx+']';
                s =
                    'alasql.utils.flatArray(this.query.queriesfn[' +
                    this.queriesidx +
                    '](params,null,p))';

                s += '.every(function(b){return (';
                s += leftJS() + ')' + op + 'b})';
            } else if (Array.isArray(this.right)) {
                s =
                    '' +
                    (this.right.length == 1
                        ? ref(this.right[0])
                        : '[' + this.right.map(ref).join(',') + ']');
                s += '.every(function(b){return (';
                s += leftJS() + ')' + op + 'b})';
            } else {
                throw new Error('NOT IN operator without SELECT');
            }
        }

        if (this.allsome === 'SOME' || this.allsome === 'ANY') {
            var s;
            if (this.right instanceof yy.Select) {
                //			var s = 'this.query.queriesdata['+this.queriesidx+']';
                s =
                    'alasql.utils.flatArray(this.query.queriesfn[' +
                    this.queriesidx +
                    '](params,null,p))';
                s += '.some(function(b){return (';
                s += leftJS() + ')' + op + 'b})';
            } else if (Array.isArray(this.right)) {
                s =
                    '' +
                    (this.right.length == 1
                        ? ref(this.right[0])
                        : '[' + this.right.map(ref).join(',') + ']');
                s += '.some(function(b){return (';
                s += leftJS() + ')' + op + 'b})';
            } else {
                throw new Error('SOME/ANY operator without SELECT');
            }
        }

        // Special case for AND optimization (if reduced)
        if (this.op === 'AND') {
            if (this.left.reduced) {
                if (this.right.reduced) {
                    return 'true';
                } else {
                    s = rightJS();
                }
            } else if (this.right.reduced) {
                s = leftJS();
            }

            // Otherwise process as regular operation (see below)
            op = '&&';
        }

        // if(this.op === '^') {
        // 	// return 	'Math.pow('
        // 	// 		+ leftJS()
        // 	// 		+ ','
        // 	// 		+ rightJS()
        // 	// 		+ ')';
        // }

        // Change names

        var expr = s || '(' + leftJS() + op + rightJS() + ')';

        var declareRefs = 'y=[(' + refs.join('), (') + ')]';

        if (op === '&&' || op === '||' || op === 'IS' || op === 'IS NULL' || op === 'IS NOT NULL') {
            return '(' + declareRefs + ', ' + expr + ')';
        }

        return (
            '(' + declareRefs + ', ' + 'y.some(function(e){return e == null}) ? void 0 : ' + expr + ')'
        );
    };

    yy.VarValue = function(params) {
        return yy.extend(this, params);
    };
    yy.VarValue.prototype.toString = function() {
        return '@' + this.variable;
    };

    yy.VarValue.prototype.toType = function() {
        return 'unknown';
    };

    yy.VarValue.prototype.toJS = function() {
        return "alasql.vars['" + this.variable + "']";
    };

    yy.NumValue = function(params) {
        return yy.extend(this, params);
    };
    yy.NumValue.prototype.toString = function() {
        return this.value.toString();
    };

    yy.NumValue.prototype.toType = function() {
        return 'number';
    };

    yy.NumValue.prototype.toJS = function() {
        return '' + this.value;
    };

    yy.StringValue = function(params) {
        return yy.extend(this, params);
    };
    yy.StringValue.prototype.toString = function() {
        return "'" + this.value.toString() + "'";
    };

    yy.StringValue.prototype.toType = function() {
        return 'string';
    };

    yy.StringValue.prototype.toJS = function() {

        //	return "'"+doubleqq(this.value)+"'";
        return "'" + escapeq(this.value) + "'";
    };

    yy.DomainValueValue = function(params) {
        return yy.extend(this, params);
    };
    yy.DomainValueValue.prototype.toString = function() {
        return 'VALUE';
    };

    yy.DomainValueValue.prototype.toType = function() {
        return 'object';
    };

    yy.DomainValueValue.prototype.toJS = function(context, tableid, defcols) {

        //	return "'"+doubleqq(this.value)+"'";
        return context;
    };

    yy.ArrayValue = function(params) {
        return yy.extend(this, params);
    };
    yy.ArrayValue.prototype.toString = function() {
        return 'ARRAY[]';
    };

    yy.ArrayValue.prototype.toType = function() {
        return 'object';
    };

    yy.ArrayValue.prototype.toJS = function(context, tableid, defcols) {

        //	return "'"+doubleqq(this.value)+"'";
        return (
            '[(' +
            this.value
                .map(function(el) {
                    return el.toJS(context, tableid, defcols);
                })
                .join('), (') +
            ')]'
        );
    };

    yy.LogicValue = function(params) {
        return yy.extend(this, params);
    };
    yy.LogicValue.prototype.toString = function() {
        return this.value ? 'TRUE' : 'FALSE';
    };

    yy.LogicValue.prototype.toType = function() {
        return 'boolean';
    };

    yy.LogicValue.prototype.toJS = function() {
        return this.value ? 'true' : 'false';
    };

    yy.NullValue = function(params) {
        return yy.extend(this, params);
    };
    yy.NullValue.prototype.toString = function() {
        return 'NULL';
    };
    yy.NullValue.prototype.toJS = function() {
        return 'undefined';
        //	return 'undefined';
    };

    yy.ParamValue = function(params) {
        return yy.extend(this, params);
    };
    yy.ParamValue.prototype.toString = function() {
        return '$' + this.param;
    };
    yy.ParamValue.prototype.toJS = function() {
        if (typeof this.param === 'string') {
            return "params['" + this.param + "']";
        }

        return 'params[' + this.param + ']';
    };

    yy.UniOp = function(params) {
        return yy.extend(this, params);
    };
    yy.UniOp.prototype.toString = function() {
        var s;
        s = void 0;
        if (this.op === '~') {
            s = this.op + this.right.toString();
        }
        if (this.op === '-') {
            s = this.op + this.right.toString();
        }
        if (this.op === '+') {
            s = this.op + this.right.toString();
        }
        if (this.op === '#') {
            s = this.op + this.right.toString();
        }
        if (this.op === 'NOT') {
            s = this.op + '(' + this.right.toString() + ')';
        }
        if (this.op === null) {
            s = '(' + this.right.toString() + ')';
        }
        if (!s) {
            s = '(' + this.right.toString() + ')';
        }
        return s;
    };

    yy.UniOp.prototype.findAggregator = function(query) {
        if (this.right.findAggregator) {
            this.right.findAggregator(query);
        }
    };

    yy.UniOp.prototype.toType = function() {
        if (this.op === '-') {
            return 'number';
        }

        if (this.op === '+') {
            return 'number';
        }

        if (this.op === 'NOT') {
            return 'boolean';
        }

        // Todo: implement default case
    };

    yy.UniOp.prototype.toJS = function(context, tableid, defcols) {
        if (this.op === '~') {
            return '(~(' + this.right.toJS(context, tableid, defcols) + '))';
        }

        if (this.op === '-') {
            return '(-(' + this.right.toJS(context, tableid, defcols) + '))';
        }

        if (this.op === '+') {
            return '(' + this.right.toJS(context, tableid, defcols) + ')';
        }

        if (this.op === 'NOT') {
            return '!(' + this.right.toJS(context, tableid, defcols) + ')';
        }

        if (this.op === '#') {
            if (this.right instanceof yy.Column) {
                return "(alasql.databases[alasql.useid].objects['" + this.right.columnid + "'])";
            } else {
                return (
                    '(alasql.databases[alasql.useid].objects[' +
                    this.right.toJS(context, tableid, defcols) +
                    '])'
                );
            }
        }

        // Please avoid === here
        if (this.op == null) {
            // jshint ignore:line
            return '(' + this.right.toJS(context, tableid, defcols) + ')';
        }

        // Todo: implement default case.
    };

    yy.Column = function(params) {
        return yy.extend(this, params);
    };
    yy.Column.prototype.toString = function(dontas) {
        var s;
        if (this.columnid == +this.columnid) {
            // jshint ignore:line
            s = '[' + this.columnid + ']';
        } else {
            s = this.columnid;
        }
        if (this.tableid) {
            if (+this.columnid === this.columnid) {
                s = this.tableid + s;
            } else {
                s = this.tableid + '.' + s;
            }
            if (this.databaseid) {
                s = this.databaseid + '.' + s;
            }
        }
        if (this.alias && !dontas) s += ' AS ' + this.alias;
        return s;
    };

    yy.Column.prototype.toJS = function(context, tableid, defcols) {

        var s = '';
        if (!this.tableid && tableid === '' && !defcols) {
            if (this.columnid !== '_') {
                s = context + "['" + this.columnid + "']";
            } else {
                if (context === 'g') {
                    s = "g['_']";
                } else {
                    s = context;
                }
            }
        } else {
            if (context === 'g') {
                // if(this.columnid == '_') {
                // } else {
                s = "g['" + this.nick + "']";
                // }
            } else if (this.tableid) {
                if (this.columnid !== '_') {
                    // if() {
                    // s = context+'[\''+tableid + '\'][\''+this.tableid+'\'][\''+this.columnid+'\']';
                    // } else {
                    s = context + "['" + this.tableid + "']['" + this.columnid + "']";
                    // }
                } else {
                    if (context === 'g') {
                        s = "g['_']";
                    } else {
                        s = context + "['" + this.tableid + "']";
                    }
                }
            } else if (defcols) {
                var tbid = defcols[this.columnid];
                if (tbid === '-') {
                    throw new Error(
                        'Cannot resolve column "' +
                        this.columnid +
                        '" because it exists in two source tables'
                    );
                } else if (tbid) {
                    if (this.columnid !== '_') {
                        s = context + "['" + tbid + "']['" + this.columnid + "']";
                    } else {
                        s = context + "['" + tbid + "']";
                    }

                } else {
                    if (this.columnid !== '_') {
                        // if(defcols['.'][this.tableid]) {

                        // 	s = context+'[\''+tableid + '\'][\''+this.tableid + '\'][\''+this.columnid+'\']';
                        // } else {
                        s = context + "['" + (this.tableid || tableid) + "']['" + this.columnid + "']";
                        // }
                    } else {
                        s = context + "['" + (this.tableid || tableid) + "']";
                    }
                }
            } else if (tableid === -1) {
                //			if(this.columnid != '') {
                s = context + "['" + this.columnid + "']";
                //			} else {
                //				s = context;
                //			}
            } else {
                if (this.columnid !== '_') {
                    s = context + "['" + (this.tableid || tableid) + "']['" + this.columnid + "']";
                } else {
                    s = context + "['" + (this.tableid || tableid) + "']";
                }
            }
        }

        //	console.trace(new Error());

        return s;
    };

    yy.AggrValue = function(params) {
        return yy.extend(this, params);
    };
    yy.AggrValue.prototype.toString = function(dontas) {
        var s = '';
        if (this.aggregatorid === 'REDUCE') {
            s += this.funcid + '(';
        } else {
            s += this.aggregatorid + '(';
        }

        if (this.distinct) {
            s += 'DISTINCT ';
        }

        if (this.expression) {
            s += this.expression.toString();
        }

        s += ')';

        if (this.over) {
            s += ' ' + this.over.toString();
        }

        if (this.alias && !dontas) s += ' AS ' + this.alias;
        //	if(this.alias) s += ' AS '+this.alias;
        return s;
    };

    yy.AggrValue.prototype.findAggregator = function(query) {

        //	var colas = this.as || this.toString();

        var colas = escapeq(this.toString()) + ':' + query.selectGroup.length;

        //		if(!query.selectColumns[colas]) {
        //		}

        var found = false;

        if (!found) {
            if (!this.nick) {
                this.nick = colas;
                var found = false;
                for (var i = 0; i < query.removeKeys.length; i++) {
                    if (query.removeKeys[i] === colas) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    query.removeKeys.push(colas);
                }
            }
            query.selectGroup.push(this);
        }

        //		this.reduced = true;
        return;
    };

    yy.AggrValue.prototype.toType = function() {
        if (
            ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX', 'AGGR', 'VAR', 'STDDEV'].indexOf(this.aggregatorid) >
            -1
        ) {
            return 'number';
        }

        if (['ARRAY'].indexOf(this.aggregatorid) > -1) {
            return 'array';
        }

        if (['FIRST', 'LAST'].indexOf(this.aggregatorid) > -1) {
            return this.expression.toType();
        }

        // todo: implement default;
    };

    yy.AggrValue.prototype.toJS = function(/*context, tableid, defcols*/) {

        var colas = this.nick;
        if (colas === undefined) {
            colas = this.toString();
        }
        return "g['" + colas + "']";
    };

    yy.OrderExpression = function(params) {
        return yy.extend(this, params);
    };
    yy.OrderExpression.prototype.toString = yy.Expression.prototype.toString;

    yy.GroupExpression = function(params) {
        return yy.extend(this, params);
    };
    yy.GroupExpression.prototype.toString = function() {
        return this.type + '(' + this.group.toString() + ')';
    };

// Alasql Linq library

    yy.FromData = function(params) {
        return yy.extend(this, params);
    };
    yy.FromData.prototype.toString = function() {
        if (this.data) return 'DATA(' + ((Math.random() * 10e15) | 0) + ')';
        else return '?';
    };
    yy.FromData.prototype.toJS = function() {

    };

    yy.Select.prototype.exec = function(params, cb) {
        if (this.preparams) params = this.preparams.concat(params);

        var databaseid = alasql.useid;
        db = alasql.databases[databaseid];
        var sql = this.toString();
        var hh = hash(sql);

        var statement = this.compile(databaseid);
        if (!statement) return;
        statement.sql = sql;
        statement.dbversion = db.dbversion;

        // Secure sqlCache size
        if (db.sqlCacheSize > alasql.MAXSQLCACHESIZE) {
            db.resetSqlCache();
        }
        db.sqlCacheSize++;
        db.sqlCache[hh] = statement;
        var res = (alasql.res = statement(params, cb));
        return res;
    };

    yy.Select.prototype.Select = function() {
        var self = this;
        var agrs = [];
        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments);
        } else if (arguments.length == 1) {
            if (Array.isArray(arguments[0])) {
                args = arguments[0];
            } else {
                args = [arguments[0]];
            }
        } else {
            throw new Error('Wrong number of arguments of Select() function');
        }

        self.columns = [];

        args.forEach(function(arg) {
            if (typeof arg == 'string') {
                self.columns.push(new yy.Column({columnid: arg}));
            } else if (typeof arg == 'function') {
                var pari = 0;
                if (self.preparams) {
                    pari = self.preparams.length;
                } else {
                    self.preparams = [];
                }
                self.preparams.push(arg);
                self.columns.push(new yy.Column({columnid: '*', func: arg, param: pari}));
            } else {
                // Unknown type
            }
        });

        return self;
    };

    yy.Select.prototype.From = function(tableid) {
        var self = this;
        if (!self.from) self.from = [];
        if (Array.isArray(tableid)) {
            var pari = 0;
            if (self.preparams) {
                pari = self.preparams.length;
            } else {
                self.preparams = [];
            }
            self.preparams.push(tableid);
            self.from.push(new yy.ParamValue({param: pari}));
        } else if (typeof tableid == 'string') {
            self.from.push(new yy.Table({tableid: tableid}));
        } else {
            throw new Error('Unknown arguments in From() function');
        }
        return self;
    };

    yy.Select.prototype.OrderBy = function() {
        var self = this;
        var agrs = [];

        self.order = [];

        if (arguments.length == 0) {
            //		self.order.push(new yy.OrderExpression({expression: new yy.Column({columnid:"_"}), direction:'ASC'}));
            args = ['_'];
        } else if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments);
        } else if (arguments.length == 1) {
            if (Array.isArray(arguments[0])) {
                args = arguments[0];
            } else {
                args = [arguments[0]];
            }
        } else {
            throw new Error('Wrong number of arguments of Select() function');
        }

        if (args.length > 0) {
            args.forEach(function(arg) {
                var expr = new yy.Column({columnid: arg});
                if (typeof arg == 'function') {
                    expr = arg;
                }
                self.order.push(new yy.OrderExpression({expression: expr, direction: 'ASC'}));
            });
        }
        return self;
    };

    yy.Select.prototype.Top = function(topnum) {
        var self = this;
        self.top = new yy.NumValue({value: topnum});
        return self;
    };

    yy.Select.prototype.GroupBy = function() {
        var self = this;
        var agrs = [];

        if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments);
        } else if (arguments.length == 1) {
            if (Array.isArray(arguments[0])) {
                args = arguments[0];
            } else {
                args = [arguments[0]];
            }
        } else {
            throw new Error('Wrong number of arguments of Select() function');
        }

        self.group = [];

        args.forEach(function(arg) {
            var expr = new yy.Column({columnid: arg});
            self.group.push(expr);
        });

        return self;
    };

    yy.Select.prototype.Where = function(expr) {
        var self = this;
        if (typeof expr == 'function') {
            self.where = expr;
        }
        return self;
    };

    /*
     //
     // Functions for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.FuncValue = function(params) {
        return yy.extend(this, params);
    };
    yy.FuncValue.prototype.toString = function(dontas) {
        var s = '';

        if (alasql.fn[this.funcid]) s += this.funcid;
        else if (alasql.aggr[this.funcid]) s += this.funcid;
        else if (alasql.stdlib[this.funcid.toUpperCase()] || alasql.stdfn[this.funcid.toUpperCase()])
            s += this.funcid.toUpperCase();

        s += '(';
        if (this.args && this.args.length > 0) {
            s += this.args
                .map(function(arg) {
                    return arg.toString();
                })
                .join(',');
        }
        s += ')';
        if (this.as && !dontas) s += ' AS ' + this.as.toString();
        //	if(this.alias) s += ' AS '+this.alias;
        return s;
    };

    yy.FuncValue.prototype.execute = function(databaseid, params, cb) {
        var res = 1;
        alasql.precompile(this, databaseid, params); // Precompile queries

        var expr = new Function('params,alasql', 'var y;return ' + this.toJS('', '', null));
        expr(params, alasql);
        if (cb) res = cb(res);
        return res;
    };

    yy.FuncValue.prototype.findAggregator = function(query) {
        if (this.args && this.args.length > 0) {
            this.args.forEach(function(arg) {
                if (arg.findAggregator) arg.findAggregator(query);
            });
        }
    };

    yy.FuncValue.prototype.toJS = function(context, tableid, defcols) {
        var s = '';
        var funcid = this.funcid;
        // IF this is standard compile functions
        if (!alasql.fn[funcid] && alasql.stdlib[funcid.toUpperCase()]) {
            if (this.args && this.args.length > 0) {
                s += alasql.stdlib[funcid.toUpperCase()].apply(
                    this,
                    this.args.map(function(arg) {
                        return arg.toJS(context, tableid);
                    })
                );
            } else {
                s += alasql.stdlib[funcid.toUpperCase()]();
            }
        } else if (!alasql.fn[funcid] && alasql.stdfn[funcid.toUpperCase()]) {
            if (this.newid) s += 'new ';
            s += 'alasql.stdfn.' + this.funcid.toUpperCase() + '(';
            //		if(this.args) s += this.args.toJS(context, tableid);
            if (this.args && this.args.length > 0) {
                s += this.args
                    .map(function(arg) {
                        return arg.toJS(context, tableid, defcols);
                    })
                    .join(',');
            }
            s += ')';
        } else {
            // This is user-defined run-time function
            // TODO arguments!!!
            //		var s = '';
            if (this.newid) s += 'new ';
            s += 'alasql.fn.' + this.funcid + '(';
            //		if(this.args) s += this.args.toJS(context, tableid);
            if (this.args && this.args.length > 0) {
                s += this.args
                    .map(function(arg) {
                        return arg.toJS(context, tableid, defcols);
                    })
                    .join(',');
            }
            s += ')';
        }

        //	if(this.alias) s += ' AS '+this.alias;
        return s;
    };

    var stdlib = (alasql.stdlib = {});
    var stdfn = (alasql.stdfn = {});

    stdlib.ABS = function(a) {
        return 'Math.abs(' + a + ')';
    };
    stdlib.CLONEDEEP = function(a) {
        return 'alasql.utils.cloneDeep(' + a + ')';
    };

    stdfn.CONCAT = function() {
        return Array.prototype.slice.call(arguments).join('');
    };
    stdlib.EXP = function(a) {
        return 'Math.pow(Math.E,' + a + ')';
    };

    stdlib.IIF = function(a, b, c) {
        if (arguments.length == 3) {
            return '((' + a + ')?(' + b + '):(' + c + '))';
        } else {
            throw new Error('Number of arguments of IFF is not equals to 3');
        }
    };
    stdlib.IFNULL = function(a, b) {
        return '(' + a + '||' + b + ')';
    };
    stdlib.INSTR = function(s, p) {
        return '((' + s + ').indexOf(' + p + ')+1)';
    };

//stdlib.LEN = stdlib.LENGTH = function(s) {return '('+s+'+"").length';};

    stdlib.LEN = stdlib.LENGTH = function(s) {
        return und(s, 'y.length');
    };
//stdlib.LENGTH = function(s) {return '('+s+').length'};

    stdlib.LOWER = stdlib.LCASE = function(s) {
        return und(s, 'String(y).toLowerCase()');
    };
//stdlib.LCASE = function(s) {return '('+s+').toLowerCase()';}

// Returns a character expression after it removes leading blanks.
// see https://docs.microsoft.com/en-us/sql/t-sql/functions/ltrim-transact-sql
    stdlib.LTRIM = function(s) {
        return und(s, 'y.replace(/^[ ]+/,"")');
    };

// Returns a character string after truncating all trailing spaces.
// see https://docs.microsoft.com/en-us/sql/t-sql/functions/rtrim-transact-sql
    stdlib.RTRIM = function(s) {
        return und(s, 'y.replace(/[ ]+$/,"")');
    };

    stdlib.MAX = stdlib.GREATEST = function() {
        return 'Math.max(' + Array.prototype.join.call(arguments, ',') + ')';
    };

    stdlib.MIN = stdlib.LEAST = function() {
        return 'Math.min(' + Array.prototype.join.call(arguments, ',') + ')';
    };

    stdlib.SUBSTRING = stdlib.SUBSTR = stdlib.MID = function(a, b, c) {
        if (arguments.length == 2) return und(a, 'y.substr(' + b + '-1)');
        else if (arguments.length == 3) return und(a, 'y.substr(' + b + '-1,' + c + ')');
    };

    stdfn.REGEXP_LIKE = function(a, b, c) {

        return (a || '').search(RegExp(b, c)) > -1;
    };

// Here we uses undefined instead of null
    stdlib.ISNULL = stdlib.NULLIF = function(a, b) {
        return '(' + a + '==' + b + '?undefined:' + a + ')';
    };

    stdlib.POWER = function(a, b) {
        return 'Math.pow(' + a + ',' + b + ')';
    };

    stdlib.RANDOM = function(r) {
        if (arguments.length == 0) {
            return 'Math.random()';
        } else {
            return '(Math.random()*(' + r + ')|0)';
        }
    };
    stdlib.ROUND = function(s, d) {
        if (arguments.length == 2) {
            return 'Math.round((' + s + ')*Math.pow(10,(' + d + ')))/Math.pow(10,(' + d + '))';
        } else {
            return 'Math.round(' + s + ')';
        }
    };
    stdlib.CEIL = stdlib.CEILING = function(s) {
        return 'Math.ceil(' + s + ')';
    };
    stdlib.FLOOR = function(s) {
        return 'Math.floor(' + s + ')';
    };

    stdlib.ROWNUM = function() {
        return '1';
    };
    stdlib.ROW_NUMBER = function() {
        return '1';
    };

    stdlib.SQRT = function(s) {
        return 'Math.sqrt(' + s + ')';
    };

    stdlib.TRIM = function(s) {
        return und(s, 'y.trim()');
    };

    stdlib.UPPER = stdlib.UCASE = function(s) {
        return und(s, 'String(y).toUpperCase()');
    };

// Concatination of strings
    stdfn.CONCAT_WS = function() {
        var args = Array.prototype.slice.call(arguments);
        return args.slice(1, args.length).join(args[0]);
    };

//stdlib.UCASE = function(s) {return '('+s+').toUpperCase()';}
//REPLACE
// RTRIM
// SUBSTR
// TRIM
//REPLACE
// RTRIM
// SUBSTR
// TRIM

// Aggregator for joining strings
    alasql.aggr.GROUP_CONCAT = function(v, s, stage) {
        if (stage === 1) {
            return '' + v;
        } else if (stage === 2) {
            s += ',' + v;
            return s;
        }
        return s;
    };

    alasql.aggr.MEDIAN = function(v, s, stage) {
        if (stage === 2) {
            if (v !== null) {
                s.push(v);
            }
            return s;
        } else if (stage === 1) {
            if (v === null) {
                return [];
            }
            return [v];
        } else {
            if (!s.length) {
                return s;
            }

            var r = s.sort();
            var p = (r.length + 1) / 2;
            if (Number.isInteger(p)) {
                return r[p - 1];
            }

            return (r[Math.floor(p - 1)] + r[Math.ceil(p - 1)]) / 2;
        }
    };

    alasql.aggr.QUART = function(v, s, stage, nth) {
        //Quartile (first quartile per default or input param)
        if (stage === 2) {
            if (v !== null) {
                s.push(v);
            }
            return s;
        } else if (stage === 1) {
            if (v === null) {
                return [];
            }
            return [v];
        } else {
            if (!s.length) {
                return s;
            }

            nth = !nth ? 1 : nth;
            var r = s.sort();
            var p = nth * (r.length + 1) / 4;
            if (Number.isInteger(p)) {
                return r[p - 1]; //Integer value
            }
            return r[Math.floor(p)]; //Math.ceil -1 or Math.floor
        }
    };

    alasql.aggr.QUART2 = function(v, s, stage) {
        //Second Quartile
        return alasql.aggr.QUART(v, s, stage, 2);
    };
    alasql.aggr.QUART3 = function(v, s, stage) {
        //Third Quartile
        return alasql.aggr.QUART(v, s, stage, 3);
    };

// Standard deviation
    alasql.aggr.VAR = function(v, s, stage) {
        if (stage === 1) {
            if (v === null) {
                return {arr: [], sum: 0};
            }
            return {arr: [v], sum: v};
        } else if (stage === 2) {
            if (v === null) {
                return s;
            }
            s.arr.push(v);
            s.sum += v;
            return s;
        } else {
            var N = s.arr.length;
            var avg = s.sum / N;
            var std = 0;
            for (var i = 0; i < N; i++) {
                std += (s.arr[i] - avg) * (s.arr[i] - avg);
            }
            std = std / (N - 1);
            return std;
        }
    };

    alasql.aggr.STDEV = function(v, s, stage) {
        if (stage === 1 || stage === 2) {
            return alasql.aggr.VAR(v, s, stage);
        } else {
            return Math.sqrt(alasql.aggr.VAR(v, s, stage));
        }
    };

// Standard deviation
// alasql.aggr.VARP = function(v,s,acc){

// };

    alasql.aggr.VARP = function(v, s, stage) {
        if (stage == 1) {
            return {arr: [v], sum: v};
        } else if (stage == 2) {
            s.arr.push(v);
            s.sum += v;
            return s;
        } else {
            var N = s.arr.length;
            var avg = s.sum / N;
            var std = 0;
            for (var i = 0; i < N; i++) {
                std += (s.arr[i] - avg) * (s.arr[i] - avg);
            }
            std = std / N;
            return std;
        }
    };

    alasql.aggr.STD = alasql.aggr.STDDEV = alasql.aggr.STDEVP = function(v, s, stage) {
        if (stage == 1 || stage == 2) {
            return alasql.aggr.VARP(v, s, stage);
        } else {
            return Math.sqrt(alasql.aggr.VARP(v, s, stage));
        }
    };

    alasql._aggrOriginal = alasql.aggr;
    alasql.aggr = {};
    Object.keys(alasql._aggrOriginal).forEach(function(k) {
        alasql.aggr[k] = function(v, s, stage) {
            if (stage === 3 && typeof s === 'undefined') return undefined;
            return alasql._aggrOriginal[k].apply(null, arguments);
        };
    });

// String functions
    stdfn.REPLACE = function(target, pattern, replacement) {
        return (target || '').split(pattern).join(replacement);
    };

// This array is required for fast GUID generation
    var lut = [];
    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + i.toString(16);
    }

    stdfn.NEWID = stdfn.UUID = stdfn.GEN_RANDOM_UUID = function() {
        var d0 = (Math.random() * 0xffffffff) | 0;
        var d1 = (Math.random() * 0xffffffff) | 0;
        var d2 = (Math.random() * 0xffffffff) | 0;
        var d3 = (Math.random() * 0xffffffff) | 0;
        return (
            lut[d0 & 0xff] +
            lut[(d0 >> 8) & 0xff] +
            lut[(d0 >> 16) & 0xff] +
            lut[(d0 >> 24) & 0xff] +
            '-' +
            lut[d1 & 0xff] +
            lut[(d1 >> 8) & 0xff] +
            '-' +
            lut[((d1 >> 16) & 0x0f) | 0x40] +
            lut[(d1 >> 24) & 0xff] +
            '-' +
            lut[(d2 & 0x3f) | 0x80] +
            lut[(d2 >> 8) & 0xff] +
            '-' +
            lut[(d2 >> 16) & 0xff] +
            lut[(d2 >> 24) & 0xff] +
            lut[d3 & 0xff] +
            lut[(d3 >> 8) & 0xff] +
            lut[(d3 >> 16) & 0xff] +
            lut[(d3 >> 24) & 0xff]
        );
    };

    /*
     //
     // CASE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.CaseValue = function(params) {
        return yy.extend(this, params);
    };
    yy.CaseValue.prototype.toString = function() {
        var s = 'CASE ';
        if (this.expression) s += this.expression.toString();
        if (this.whens) {
            s += this.whens
                .map(function(w) {
                    return ' WHEN ' + w.when.toString() + ' THEN ' + w.then.toString();
                })
                .join();
        }
        s += ' END';
        return s;
    };

    yy.CaseValue.prototype.findAggregator = function(query) {

        if (this.expression && this.expression.findAggregator) this.expression.findAggregator(query);
        if (this.whens && this.whens.length > 0) {
            this.whens.forEach(function(w) {
                if (w.when.findAggregator) w.when.findAggregator(query);
                if (w.then.findAggregator) w.then.findAggregator(query);
            });
        }
        if (this.elses && this.elses.findAggregator) this.elses.findAggregator(query);
    };

    yy.CaseValue.prototype.toJS = function(context, tableid, defcols) {
        var s = '((function(' + context + ',params,alasql){var y,r;';
        if (this.expression) {
            //			this.expression.toJS(context, tableid)
            s += 'v=' + this.expression.toJS(context, tableid, defcols) + ';';
            s += (this.whens || [])
                .map(function(w) {
                    return (
                        ' if(v==' +
                        w.when.toJS(context, tableid, defcols) +
                        ') {r=' +
                        w.then.toJS(context, tableid, defcols) +
                        '}'
                    );
                })
                .join(' else ');
            if (this.elses) s += ' else {r=' + this.elses.toJS(context, tableid, defcols) + '}';
        } else {
            s += (this.whens || [])
                .map(function(w) {
                    return (
                        ' if(' +
                        w.when.toJS(context, tableid, defcols) +
                        ') {r=' +
                        w.then.toJS(context, tableid, defcols) +
                        '}'
                    );
                })
                .join(' else ');
            if (this.elses) s += ' else {r=' + this.elses.toJS(context, tableid, defcols) + '}';
        }
        // TODO remove bind from CASE
        s += ';return r;}).bind(this))(' + context + ',params,alasql)';

        return s;
    };

    /*
     //
     // JSON for Alasql.js
     // Date: 19.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Json = function(params) {
        return yy.extend(this, params);
    };
    yy.Json.prototype.toString = function() {
        var s = ''; // '@'
        s += JSONtoString(this.value);
        s += '';
        return s;
    };

    var JSONtoString = (alasql.utils.JSONtoString = function(obj) {
        var s = '';
        if (typeof obj == 'string') s = '"' + obj + '"';
        else if (typeof obj == 'number') s = obj;
        else if (typeof obj == 'boolean') s = obj;
        else if (typeof obj == 'object') {
            if (Array.isArray(obj)) {
                s +=
                    '[' +
                    obj
                        .map(function(b) {
                            return JSONtoString(b);
                        })
                        .join(',') +
                    ']';
            } else if (!obj.toJS || obj instanceof yy.Json) {
                // to prevent recursion
                s = '{';
                var ss = [];
                for (var k in obj) {
                    var s1 = '';
                    if (typeof k == 'string') s1 += '"' + k + '"';
                    else if (typeof k == 'number') s1 += k;
                    else if (typeof k == 'boolean') s1 += k;
                    else {
                        throw new Error('THis is not ES6... no expressions on left side yet');
                    }
                    s1 += ':' + JSONtoString(obj[k]);
                    ss.push(s1);
                }
                s += ss.join(',') + '}';
            } else if (obj.toString) {
                s = obj.toString();
            } else {
                throw new Error('1Can not show JSON object ' + JSON.stringify(obj));
            }
        } else {
            throw new Error('2Can not show JSON object ' + JSON.stringify(obj));
        }

        return s;
    });

    function JSONtoJS(obj, context, tableid, defcols) {
        var s = '';
        if (typeof obj == 'string') s = '"' + obj + '"';
        else if (typeof obj == 'number') s = '(' + obj + ')';
        else if (typeof obj == 'boolean') s = obj;
        else if (typeof obj == 'object') {
            if (Array.isArray(obj)) {
                s +=
                    '[' +
                    obj
                        .map(function(b) {
                            return JSONtoJS(b, context, tableid, defcols);
                        })
                        .join(',') +
                    ']';
            } else if (!obj.toJS || obj instanceof yy.Json) {
                // to prevent recursion
                s = '{';
                var ss = [];
                for (var k in obj) {
                    var s1 = '';
                    if (typeof k == 'string') s1 += '"' + k + '"';
                    else if (typeof k == 'number') s1 += k;
                    else if (typeof k == 'boolean') s1 += k;
                    else {
                        throw new Error('THis is not ES6... no expressions on left side yet');
                    }
                    s1 += ':' + JSONtoJS(obj[k], context, tableid, defcols);
                    ss.push(s1);
                }
                s += ss.join(',') + '}';
            } else if (obj.toJS) {
                s = obj.toJS(context, tableid, defcols);
            } else {
                throw new Error('1Can not parse JSON object ' + JSON.stringify(obj));
            }
        } else {
            throw new Error('2Can not parse JSON object ' + JSON.stringify(obj));
        }

        return s;
    }

    yy.Json.prototype.toJS = function(context, tableid, defcols) {
        // TODO redo
        return JSONtoJS(this.value, context, tableid, defcols);
    };

    /*
     //
     // CAST and CONVERT functions
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Convert = function(params) {
        return yy.extend(this, params);
    };
    yy.Convert.prototype.toString = function() {
        var s = 'CONVERT(';
        s += this.dbtypeid;
        if (typeof this.dbsize != 'undefined') {
            s += '(' + this.dbsize;
            if (this.dbprecision) s += ',' + this.dbprecision;
            s += ')';
        }
        s += ',' + this.expression.toString();
        if (this.style) s += ',' + this.style;
        s += ')';
        return s;
    };
    yy.Convert.prototype.toJS = function(context, tableid, defcols) {
        //	if(this.style) {
        return (
            'alasql.stdfn.CONVERT(' +
            this.expression.toJS(context, tableid, defcols) +
            ',{dbtypeid:"' +
            this.dbtypeid +
            '",dbsize:' +
            this.dbsize +
            ',dbprecision:' +
            this.dbprecision +
            ',style:' +
            this.style +
            '})'
        );
        //	}

        throw new Error('There is not such type conversion for ' + this.toString());
    };

    /**
     Convert one type to another
     */
    alasql.stdfn.CONVERT = function(value, args) {
        var val = value;

        if (args.style) {
            // TODO 9,109, 20,120,21,121,126,130,131 conversions
            var t;
            if (/\d{8}/.test(val)) {
                t = new Date(+val.substr(0, 4), +val.substr(4, 2) - 1, +val.substr(6, 2));
            } else {
                t = new Date(val);
            }
            switch (args.style) {
                case 1: // mm/dd/yy
                    val =
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '/' +
                        ('0' + t.getDate()).substr(-2) +
                        '/' +
                        ('0' + t.getYear()).substr(-2);
                    break;
                case 2: // yy.mm.dd
                    val =
                        ('0' + t.getYear()).substr(-2) +
                        '.' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '.' +
                        ('0' + t.getDate()).substr(-2);
                    break;
                case 3: // dd/mm/yy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        '/' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '/' +
                        ('0' + t.getYear()).substr(-2);
                    break;
                case 4: // dd.mm.yy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        '.' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '.' +
                        ('0' + t.getYear()).substr(-2);
                    break;
                case 5: // dd-mm-yy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        '-' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '-' +
                        ('0' + t.getYear()).substr(-2);
                    break;
                case 6: // dd mon yy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        ' ' +
                        t
                            .toString()
                            .substr(4, 3)
                            .toLowerCase() +
                        ' ' +
                        ('0' + t.getYear()).substr(-2);
                    break;
                case 7: // Mon dd,yy
                    val =
                        t.toString().substr(4, 3) +
                        ' ' +
                        ('0' + t.getDate()).substr(-2) +
                        ',' +
                        ('0' + t.getYear()).substr(-2);
                    break;
                case 8: // hh:mm:ss
                case 108: // hh:mm:ss
                    val =
                        ('0' + t.getHours()).substr(-2) +
                        ':' +
                        ('0' + t.getMinutes()).substr(-2) +
                        ':' +
                        ('0' + t.getSeconds()).substr(-2);
                    break;
                case 10: // mm-dd-yy
                    val =
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '-' +
                        ('0' + t.getDate()).substr(-2) +
                        '-' +
                        ('0' + t.getYear()).substr(-2);
                    break;
                case 11: // yy/mm/dd
                    val =
                        ('0' + t.getYear()).substr(-2) +
                        '/' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '/' +
                        ('0' + t.getDate()).substr(-2);
                    break;
                case 12: // yymmdd
                    val =
                        ('0' + t.getYear()).substr(-2) +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        ('0' + t.getDate()).substr(-2);
                    break;
                case 101: // mm/dd/yyyy
                    val =
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '/' +
                        ('0' + t.getDate()).substr(-2) +
                        '/' +
                        t.getFullYear();
                    break;
                case 102: // yyyy.mm.dd
                    val =
                        t.getFullYear() +
                        '.' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '.' +
                        ('0' + t.getDate()).substr(-2);
                    break;
                case 103: // dd/mm/yyyy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        '/' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '/' +
                        t.getFullYear();
                    break;
                case 104: // dd.mm.yyyy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        '.' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '.' +
                        t.getFullYear();
                    break;
                case 105: // dd-mm-yyyy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        '-' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '-' +
                        t.getFullYear();
                    break;
                case 106: // dd mon yyyy
                    val =
                        ('0' + t.getDate()).substr(-2) +
                        ' ' +
                        t
                            .toString()
                            .substr(4, 3)
                            .toLowerCase() +
                        ' ' +
                        t.getFullYear();
                    break;
                case 107: // Mon dd,yyyy
                    val =
                        t.toString().substr(4, 3) +
                        ' ' +
                        ('0' + t.getDate()).substr(-2) +
                        ',' +
                        t.getFullYear();
                    break;
                case 110: // mm-dd-yyyy
                    val =
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '-' +
                        ('0' + t.getDate()).substr(-2) +
                        '-' +
                        t.getFullYear();
                    break;
                case 111: // yyyy/mm/dd
                    val =
                        t.getFullYear() +
                        '/' +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        '/' +
                        ('0' + t.getDate()).substr(-2);
                    break;

                case 112: // yyyymmdd
                    val =
                        t.getFullYear() +
                        ('0' + (t.getMonth() + 1)).substr(-2) +
                        ('0' + t.getDate()).substr(-2);
                    break;
                default:
                    throw new Error('The CONVERT style ' + args.style + ' is not realized yet.');
            }
        }

        var udbtypeid = args.dbtypeid.toUpperCase();

        if (args.dbtypeid == 'Date') {
            return new Date(val);
        } else if (udbtypeid == 'DATE') {
            var d = new Date(val);
            var s =
                d.getFullYear() +
                '.' +
                ('0' + (d.getMonth() + 1)).substr(-2) +
                '.' +
                ('0' + d.getDate()).substr(-2);
            return s;
        } else if (udbtypeid == 'DATETIME' || udbtypeid == 'DATETIME2') {
            var d = new Date(val);
            var s =
                d.getFullYear() +
                '.' +
                ('0' + (d.getMonth() + 1)).substr(-2) +
                '.' +
                ('0' + d.getDate()).substr(-2);
            s +=
                ' ' +
                ('0' + d.getHours()).substr(-2) +
                ':' +
                ('0' + d.getMinutes()).substr(-2) +
                ':' +
                ('0' + d.getSeconds()).substr(-2);
            s += '.' + ('00' + d.getMilliseconds()).substr(-3);
            return s;
        } else if (['MONEY'].indexOf(udbtypeid) > -1) {
            var m = +val;
            return (m | 0) + ((m * 100) % 100) / 100;
        } else if (['BOOLEAN'].indexOf(udbtypeid) > -1) {
            return !!val;
        } else if (
            ['INT', 'INTEGER', 'SMALLINT', 'BIGINT', 'SERIAL', 'SMALLSERIAL', 'BIGSERIAL'].indexOf(
                args.dbtypeid.toUpperCase()
            ) > -1
        ) {
            return val | 0;
        } else if (
            ['STRING', 'VARCHAR', 'NVARCHAR', 'CHARACTER VARIABLE'].indexOf(
                args.dbtypeid.toUpperCase()
            ) > -1
        ) {
            if (args.dbsize) return ('' + val).substr(0, args.dbsize);
            else return '' + val;
        } else if (['CHAR', 'CHARACTER', 'NCHAR'].indexOf(udbtypeid) > -1) {
            return (val + new Array(args.dbsize + 1).join(' ')).substr(0, args.dbsize);
            //else return ""+val.substr(0,1);
        } else if (['NUMBER', 'FLOAT', 'DECIMAL', 'NUMERIC'].indexOf(udbtypeid) > -1) {
            var m = +val;
            //toPrecision sets the number of numbers total in the result
            m = args.dbsize !== undefined ? parseFloat(m.toPrecision(args.dbsize)) : m;
            //toFixed sets the number of numbers to the right of the decimal
            m = args.dbprecision !== undefined ? parseFloat(m.toFixed(args.dbprecision)) : m;
            return m;
        } else if (['JSON'].indexOf(udbtypeid) > -1) {
            if (typeof val == 'object') return val;
            try {
                return JSON.parse(val);
            } catch (err) {
                throw new Error('Cannot convert string to JSON');
            }
        }
        return val;
    };

    /*
     //
     // CREATE TABLE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* global alasql, yy, hash */

    yy.ColumnDef = function(params) {
        return yy.extend(this, params);
    };
    yy.ColumnDef.prototype.toString = function() {
        var s = this.columnid;
        if (this.dbtypeid) {
            s += ' ' + this.dbtypeid;
        }

        if (this.dbsize) {
            s += '(' + this.dbsize;
            if (this.dbprecision) {
                s += ',' + this.dbprecision;
            }
            s += ')';
        }

        if (this.primarykey) {
            s += ' PRIMARY KEY';
        }

        if (this.notnull) {
            s += ' NOT NULL';
        }

        return s;
    };

    yy.CreateTable = function(params) {
        return yy.extend(this, params);
    };
    yy.CreateTable.prototype.toString = function() {
        var s = 'CREATE';
        if (this.temporary) {
            s += ' TEMPORARY';
        }

        if (this.view) {
            s += ' VIEW';
        } else {
            s += ' ' + (this["class"] ? 'CLASS' : 'TABLE');
        }
        if (this.ifnotexists) {
            s += ' IF  NOT EXISTS';
        }
        s += ' ' + this.table.toString();
        if (this.viewcolumns) {
            s +=
                '(' +
                this.viewcolumns
                    .map(function(vcol) {
                        return vcol.toString();
                    })
                    .join(',') +
                ')';
        }
        if (this.as) {
            s += ' AS ' + this.as;
        } else {
            var ss = this.columns.map(function(col) {
                return col.toString();
            });
            s += ' (' + ss.join(',') + ')';
        }

        if (this.view && this.select) {
            s += ' AS ' + this.select.toString();
        }

        return s;
    };

// CREATE TABLE
//yy.CreateTable.prototype.compile = returnUndefined;
    yy.CreateTable.prototype.execute = function(databaseid, params, cb) {
        //	var self = this;
        var db = alasql.databases[this.table.databaseid || databaseid];

        var tableid = this.table.tableid;
        if (!tableid) {
            throw new Error('Table name is not defined');
        }

        //	var ifnotexists = this.ifnotexists;
        var columns = this.columns;
        // if(false) {
        // 	if(!columns) {
        // 		throw new Error('Columns are not defined');
        // 	}
        // }
        var constraints = this.constraints || [];

        // IF NOT EXISTS
        if (this.ifnotexists && db.tables[tableid]) {
            return cb ? cb(0) : 0;
        }

        if (db.tables[tableid]) {
            throw new Error(
                "Can not create table '" +
                tableid +
                "', because it already exists in the database '" +
                db.databaseid +
                "'"
            );
        }

        var table = (db.tables[tableid] = new alasql.Table()); // TODO Can use special object?
        // If this is a class
        if (this["class"]) {
            table.isclass = true;
        }

        var ss = []; // DEFAULT function components
        var uss = []; // ON UPDATE function components
        if (columns) {
            columns.forEach(function(col) {
                var dbtypeid = col.dbtypeid;
                if (!alasql.fn[dbtypeid]) {
                    dbtypeid = dbtypeid.toUpperCase();
                }

                // Process SERIAL data type like Postgress
                if (['SERIAL', 'SMALLSERIAL', 'BIGSERIAL'].indexOf(dbtypeid) > -1) {
                    col.identity = {value: 1, step: 1};
                }

                var newcol = {
                    columnid: col.columnid,
                    dbtypeid: dbtypeid,
                    dbsize: col.dbsize, // Fixed issue #150
                    dbprecision: col.dbprecision, // Fixed issue #150
                    notnull: col.notnull,
                    identity: col.identity,
                };
                if (col.identity) {
                    table.identities[col.columnid] = {
                        value: +col.identity.value,
                        step: +col.identity.step,
                    };
                    //				ss.push('\''+col.columnid+'\':(alasql.databases[\''+db.databaseid+'\'].tables[\''
                    //					+tableid+'\'].identities[\''+col.columnid+'\'].value)');
                }
                if (col.check) {
                    table.checks.push({
                        id: col.check.constrantid,
                        fn: new Function('r', 'var y;return ' + col.check.expression.toJS('r', '')),
                    });
                }

                if (col["default"]) {
                    ss.push("'" + col.columnid + "':" + col["default"].toJS('r', ''));
                }

                // Check for primary key
                if (col.primarykey) {
                    var pk = (table.pk = {});
                    pk.columns = [col.columnid];
                    pk.onrightfns = "r['" + col.columnid + "']";
                    pk.onrightfn = new Function('r', 'var y;return ' + pk.onrightfns);
                    pk.hh = hash(pk.onrightfns);
                    table.uniqs[pk.hh] = {};
                }

                // UNIQUE clause
                if (col.unique) {
                    var uk = {};
                    table.uk = table.uk || [];
                    table.uk.push(uk);
                    uk.columns = [col.columnid];
                    uk.onrightfns = "r['" + col.columnid + "']";
                    uk.onrightfn = new Function('r', 'var y;return ' + uk.onrightfns);
                    uk.hh = hash(uk.onrightfns);
                    table.uniqs[uk.hh] = {};
                }

                // UNIQUE clause
                if (col.foreignkey) {

                    var fk = col.foreignkey.table;
                    var fktable = alasql.databases[fk.databaseid || databaseid].tables[fk.tableid];
                    if (typeof fk.columnid === 'undefined') {
                        if (fktable.pk.columns && fktable.pk.columns.length > 0) {
                            fk.columnid = fktable.pk.columns[0];
                        } else {
                            throw new Error('FOREIGN KEY allowed only to tables with PRIMARY KEYs');
                        }
                    }

                    var fkfn = function(r) {
                        var rr = {};
                        if (typeof r[col.columnid] === 'undefined') {
                            return true;
                        }
                        rr[fk.columnid] = r[col.columnid];
                        var addr = fktable.pk.onrightfn(rr);

                        if (!fktable.uniqs[fktable.pk.hh][addr]) {
                            throw new Error(
                                'Foreign key "' +
                                r[col.columnid] +
                                '" is not found in table ' +
                                fktable.tableid
                            );
                        }
                        return true;
                    };
                    table.checks.push({fn: fkfn});

                }

                if (col.onupdate) {
                    uss.push("r['" + col.columnid + "']=" + col.onupdate.toJS('r', ''));
                }

                table.columns.push(newcol);
                table.xcolumns[newcol.columnid] = newcol;
            });
        }
        table.defaultfns = ss.join(',');
        table.onupdatefns = uss.join(';');

        //	if(constraints) {
        constraints.forEach(function(con) {

            var checkfn;

            if (con.type === 'PRIMARY KEY') {
                if (table.pk) {
                    throw new Error('Primary key already exists');
                }
                var pk = (table.pk = {});
                pk.columns = con.columns;
                pk.onrightfns = pk.columns
                    .map(function(columnid) {
                        return "r['" + columnid + "']";
                    })
                    .join("+'`'+");
                pk.onrightfn = new Function('r', 'var y;return ' + pk.onrightfns);
                pk.hh = hash(pk.onrightfns);
                table.uniqs[pk.hh] = {};
            } else if (con.type === 'CHECK') {

                checkfn = new Function('r', 'var y;return ' + con.expression.toJS('r', ''));
            } else if (con.type === 'UNIQUE') {

                var uk = {};
                table.uk = table.uk || [];
                table.uk.push(uk);
                uk.columns = con.columns;
                uk.onrightfns = uk.columns
                    .map(function(columnid) {
                        return "r['" + columnid + "']";
                    })
                    .join("+'`'+");
                uk.onrightfn = new Function('r', 'var y;return ' + uk.onrightfns);
                uk.hh = hash(uk.onrightfns);
                table.uniqs[uk.hh] = {};
            } else if (con.type === 'FOREIGN KEY') {

                var col = table.xcolumns[con.columns[0]];
                var fk = con.fktable;
                if (con.fkcolumns && con.fkcolumns.length > 0) {
                    fk.columnid = con.fkcolumns[0];
                }
                var fktable = alasql.databases[fk.databaseid || databaseid].tables[fk.tableid];
                if (typeof fk.columnid === 'undefined') {
                    fk.columnid = fktable.pk.columns[0];
                }

                checkfn = function(r) {
                    var rr = {};
                    if (typeof r[col.columnid] === 'undefined') {
                        return true;
                    }
                    rr[fk.columnid] = r[col.columnid];
                    var addr = fktable.pk.onrightfn(rr);

                    if (!fktable.uniqs[fktable.pk.hh][addr]) {

                        throw new Error(
                            'Foreign key "' +
                            r[col.columnid] +
                            '" is not found in table ' +
                            fktable.tableid
                        );
                    }
                    return true;
                };
            }
            if (checkfn) {
                table.checks.push({fn: checkfn, id: con.constraintid, fk: con.type === 'FOREIGN KEY'});
            }
        });

        if (this.view && this.viewcolumns) {
            var self = this;
            this.viewcolumns.forEach(function(vcol, idx) {
                self.select.columns[idx].as = vcol.columnid;
            });
        }

        //Used in 420from queryfn when table.view = true!
        if (this.view && this.select) {
            table.view = true;

            table.select = this.select.compile(this.table.databaseid || databaseid);
        }

        if (db.engineid) {

            return alasql.engines[db.engineid].createTable(
                this.table.databaseid || databaseid,
                tableid,
                this.ifnotexists,
                cb
            );

            //		return res1;
        }

        //	}
        //			if(table.pk) {

        table.insert = function(r, orreplace) {
            var oldinserted = alasql.inserted;
            alasql.inserted = [r];

            var table = this;

            var toreplace = false; // For INSERT OR REPLACE

            /*
             // IDENTINY or AUTO_INCREMENT
             // if(table.identities && table.identities.length>0) {
             // 	table.identities.forEach(function(ident){
             // 		r[ident.columnid] = ident.value;
             // 	});
             // }
             */
            // Trigger prevent functionality
            var prevent = false;
            for (var tr in table.beforeinsert) {
                var trigger = table.beforeinsert[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        if (alasql.fn[trigger.funcid](r) === false) prevent = prevent || true;
                    } else if (trigger.statement) {
                        if (trigger.statement.execute(databaseid) === false) prevent = prevent || true;
                    }
                }
            }
            if (prevent) return;

            // Trigger prevent functionality
            var escape = false;
            for (tr in table.insteadofinsert) {
                escape = true;
                trigger = table.insteadofinsert[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        alasql.fn[trigger.funcid](r);
                    } else if (trigger.statement) {
                        trigger.statement.execute(databaseid);
                    }
                }
            }
            if (escape) return;

            for (var columnid in table.identities) {
                var ident = table.identities[columnid];

                r[columnid] = ident.value;

            }

            if (table.checks && table.checks.length > 0) {
                table.checks.forEach(function(check) {
                    if (!check.fn(r)) {
                        //					if(orreplace) toreplace=true; else
                        throw new Error('Violation of CHECK constraint ' + (check.id || ''));
                    }
                });
            }

            table.columns.forEach(function(column) {
                if (column.notnull && typeof r[column.columnid] === 'undefined') {
                    throw new Error('Wrong NULL value in NOT NULL column ' + column.columnid);
                }
            });
            if (table.pk) {
                var pk = table.pk;
                var addr = pk.onrightfn(r);

                if (typeof table.uniqs[pk.hh][addr] !== 'undefined') {

                    if (orreplace) toreplace = table.uniqs[pk.hh][addr];
                    else
                        throw new Error(
                            'Cannot insert record, because it already exists in primary key index'
                        );
                }
                //			table.uniqs[pk.hh][addr]=r;
            }

            if (table.uk && table.uk.length) {
                table.uk.forEach(function(uk) {
                    var ukaddr = uk.onrightfn(r);
                    if (typeof table.uniqs[uk.hh][ukaddr] !== 'undefined') {
                        if (orreplace) toreplace = table.uniqs[uk.hh][ukaddr];
                        else
                            throw new Error(
                                'Cannot insert record, because it already exists in unique index'
                            );
                    }
                    //				table.uniqs[uk.hh][ukaddr]=r;
                });
            }

            if (toreplace) {
                // Do UPDATE!!!

                table.update(
                    function(t) {
                        for (var f in r) t[f] = r[f];
                    },
                    table.data.indexOf(toreplace),
                    params
                );
            } else {
                table.data.push(r);

                // Final change before insert

                // Update indices

                for (var columnid in table.identities) {
                    var ident = table.identities[columnid];

                    ident.value += ident.step;

                }

                if (table.pk) {
                    var pk = table.pk;
                    var addr = pk.onrightfn(r);
                    table.uniqs[pk.hh][addr] = r;
                }
                if (table.uk && table.uk.length) {
                    table.uk.forEach(function(uk) {
                        var ukaddr = uk.onrightfn(r);
                        table.uniqs[uk.hh][ukaddr] = r;
                    });
                }
            }

            // Trigger prevent functionality
            for (var tr in table.afterinsert) {
                var trigger = table.afterinsert[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        alasql.fn[trigger.funcid](r);
                    } else if (trigger.statement) {
                        trigger.statement.execute(databaseid);
                    }
                }
            }
            alasql.inserted = oldinserted;
        };

        table["delete"] = function(index) {
            var table = this;
            var r = table.data[index];

            // Prevent trigger
            var prevent = false;
            for (var tr in table.beforedelete) {
                var trigger = table.beforedelete[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        if (alasql.fn[trigger.funcid](r) === false) prevent = prevent || true;
                    } else if (trigger.statement) {
                        if (trigger.statement.execute(databaseid) === false) prevent = prevent || true;
                    }
                }
            }
            if (prevent) return false;

            // Trigger prevent functionality
            var escape = false;
            for (var tr in table.insteadofdelete) {
                escape = true;
                var trigger = table.insteadofdelete[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        alasql.fn[trigger.funcid](r);
                    } else if (trigger.statement) {
                        trigger.statement.execute(databaseid);
                    }
                }
            }
            if (escape) return;

            if (this.pk) {
                var pk = this.pk;
                var addr = pk.onrightfn(r);
                if (typeof this.uniqs[pk.hh][addr] === 'undefined') {
                    throw new Error('Something wrong with primary key index on table');
                } else {
                    this.uniqs[pk.hh][addr] = undefined;
                }
            }
            if (table.uk && table.uk.length) {
                table.uk.forEach(function(uk) {
                    var ukaddr = uk.onrightfn(r);
                    if (typeof table.uniqs[uk.hh][ukaddr] === 'undefined') {
                        throw new Error('Something wrong with unique index on table');
                    }
                    table.uniqs[uk.hh][ukaddr] = undefined;
                });
            }
        };

        table.deleteall = function() {
            this.data.length = 0;
            if (this.pk) {
                //						var r = this.data[i];
                this.uniqs[this.pk.hh] = {};
            }
            if (table.uk && table.uk.length) {
                table.uk.forEach(function(uk) {
                    table.uniqs[uk.hh] = {};
                });
            }
        };

        table.update = function(assignfn, i, params) {
            // TODO: Analyze the speed
            var r = cloneDeep(this.data[i]);

            var pk;
            // PART 1 - PRECHECK
            if (this.pk) {
                pk = this.pk;
                pk.pkaddr = pk.onrightfn(r, params);
                if (typeof this.uniqs[pk.hh][pk.pkaddr] === 'undefined') {
                    throw new Error('Something wrong with index on table');
                }
            }
            if (table.uk && table.uk.length) {
                table.uk.forEach(function(uk) {
                    uk.ukaddr = uk.onrightfn(r);
                    if (typeof table.uniqs[uk.hh][uk.ukaddr] === 'undefined') {
                        throw new Error('Something wrong with unique index on table');
                    }
                });
            }

            assignfn(r, params, alasql);

            // Prevent trigger
            var prevent = false;
            for (var tr in table.beforeupdate) {
                var trigger = table.beforeupdate[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        if (alasql.fn[trigger.funcid](this.data[i], r) === false)
                            prevent = prevent || true;
                    } else if (trigger.statement) {
                        if (trigger.statement.execute(databaseid) === false) prevent = prevent || true;
                    }
                }
            }
            if (prevent) return false;

            // Trigger prevent functionality
            var escape = false;
            for (var tr in table.insteadofupdate) {
                escape = true;
                var trigger = table.insteadofupdate[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        alasql.fn[trigger.funcid](this.data[i], r);
                    } else if (trigger.statement) {
                        trigger.statement.execute(databaseid);
                    }
                }
            }
            if (escape) return;

            // PART 2 - POST CHECK
            if (table.checks && table.checks.length > 0) {
                table.checks.forEach(function(check) {
                    if (!check.fn(r)) {
                        throw new Error('Violation of CHECK constraint ' + (check.id || ''));
                    }
                });
            }

            table.columns.forEach(function(column) {
                if (column.notnull && typeof r[column.columnid] === 'undefined') {
                    throw new Error('Wrong NULL value in NOT NULL column ' + column.columnid);
                }
            });
            if (this.pk) {
                pk.newpkaddr = pk.onrightfn(r);
                if (
                    typeof this.uniqs[pk.hh][pk.newpkaddr] !== 'undefined' &&
                    pk.newpkaddr !== pk.pkaddr
                ) {
                    throw new Error('Record already exists');
                }
            }

            if (table.uk && table.uk.length) {
                table.uk.forEach(function(uk) {
                    uk.newukaddr = uk.onrightfn(r);
                    if (
                        typeof table.uniqs[uk.hh][uk.newukaddr] !== 'undefined' &&
                        uk.newukaddr !== uk.ukaddr
                    ) {
                        throw new Error('Record already exists');
                    }
                });
            }

            // PART 3 UPDATE
            if (this.pk) {
                this.uniqs[pk.hh][pk.pkaddr] = undefined;
                this.uniqs[pk.hh][pk.newpkaddr] = r;
            }
            if (table.uk && table.uk.length) {
                table.uk.forEach(function(uk) {
                    table.uniqs[uk.hh][uk.ukaddr] = undefined;
                    table.uniqs[uk.hh][uk.newukaddr] = r;
                });
            }

            this.data[i] = r;

            // Trigger prevent functionality
            for (var tr in table.afterupdate) {
                var trigger = table.afterupdate[tr];
                if (trigger) {
                    if (trigger.funcid) {
                        alasql.fn[trigger.funcid](this.data[i], r);
                    } else if (trigger.statement) {
                        trigger.statement.execute(databaseid);
                    }
                }
            }
        };

        var res;

        if (!alasql.options.nocount) {
            res = 1;
        }

        if (cb) res = cb(res);
        return res;
    };

//
// Date functions
//
// (c) 2014, Andrey Gershun
//

    /** Standard JavaScript data types */

    alasql.fn.Date = Object;
    alasql.fn.Date = Date;
    alasql.fn.Number = Number;
    alasql.fn.String = String;
    alasql.fn.Boolean = Boolean;

    /** Extend Object with properties */
    stdfn.EXTEND = alasql.utils.extend;

    stdfn.CHAR = String.fromCharCode.bind(String);
    stdfn.ASCII = function(a) {
        return a.charCodeAt(0);
    };

    /**
     Return first non-null argument
     See https://msdn.microsoft.com/en-us/library/ms190349.aspx
     */
    stdfn.COALESCE = function() {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == 'undefined') continue;
            if (typeof arguments[i] == 'number' && isNaN(arguments[i])) continue;
            return arguments[i];
        }
        return undefined;
    };

    stdfn.USER = function() {
        return 'alasql';
    };

    stdfn.OBJECT_ID = function(objid) {
        return !!alasql.tables[objid];
    };

    stdfn.DATE = function(d) {
        if (/\d{8}/.test(d)) return new Date(+d.substr(0, 4), +d.substr(4, 2) - 1, +d.substr(6, 2));
        return new Date(d);
    };

    stdfn.NOW = function() {
        var d = new Date();
        var s =
            d.getFullYear() +
            '.' +
            ('0' + (d.getMonth() + 1)).substr(-2) +
            '.' +
            ('0' + d.getDate()).substr(-2);
        s +=
            ' ' +
            ('0' + d.getHours()).substr(-2) +
            ':' +
            ('0' + d.getMinutes()).substr(-2) +
            ':' +
            ('0' + d.getSeconds()).substr(-2);
        s += '.' + ('00' + d.getMilliseconds()).substr(-3);
        return s;
    };

    stdfn.GETDATE = stdfn.NOW;
    stdfn.CURRENT_TIMESTAMP = stdfn.NOW;

    stdfn.SECOND = function(d) {
        var d = new Date(d);
        return d.getSeconds();
    };

    stdfn.MINUTE = function(d) {
        var d = new Date(d);
        return d.getMinutes();
    };

    stdfn.HOUR = function(d) {
        var d = new Date(d);
        return d.getHours();
    };

    stdfn.DAYOFWEEK = stdfn.WEEKDAY = function(d) {
        var d = new Date(d);
        return d.getDay();
    };

    stdfn.DAY = stdfn.DAYOFMONTH = function(d) {
        var d = new Date(d);
        return d.getDate();
    };

    stdfn.MONTH = function(d) {
        var d = new Date(d);
        return d.getMonth() + 1;
    };

    stdfn.YEAR = function(d) {
        var d = new Date(d);
        return d.getFullYear();
    };

    var PERIODS = {
        year: 1000 * 3600 * 24 * 365,
        quarter: 1000 * 3600 * 24 * 365 / 4,
        month: 1000 * 3600 * 24 * 30,
        week: 1000 * 3600 * 24 * 7,
        day: 1000 * 3600 * 24,
        dayofyear: 1000 * 3600 * 24,
        weekday: 1000 * 3600 * 24,
        hour: 1000 * 3600,
        minute: 1000 * 60,
        second: 1000,
        millisecond: 1,
        microsecond: 0.001,
    };

    alasql.stdfn.DATEDIFF = function(period, d1, d2) {
        var interval = new Date(d2).getTime() - new Date(d1).getTime();
        return interval / PERIODS[period.toLowerCase()];
    };

    alasql.stdfn.DATEADD = function(period, interval, d) {
        var nd = new Date(d).getTime() + interval * PERIODS[period.toLowerCase()];
        return new Date(nd);
    };

    alasql.stdfn.INTERVAL = function(interval, period) {
        return interval * PERIODS[period.toLowerCase()];
    };

    alasql.stdfn.DATE_ADD = alasql.stdfn.ADDDATE = function(d, interval) {
        var nd = new Date(d).getTime() + interval;
        return new Date(nd);
    };

    alasql.stdfn.DATE_SUB = alasql.stdfn.SUBDATE = function(d, interval) {
        var nd = new Date(d).getTime() - interval;
        return new Date(nd);
    };

    /*
     //
     // DROP TABLE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.DropTable = function(params) {
        return yy.extend(this, params);
    };
    yy.DropTable.prototype.toString = function() {
        var s = 'DROP' + ' ';
        if (this.view) s += 'VIEW';
        else s += 'TABLE';
        if (this.ifexists) s += ' IF EXISTS';
        s += ' ' + this.tables.toString();
        return s;
    };

// DROP TABLE
    /**
     Drop tables
     @param {string} databaseid Database id
     @param {object} params Parameters
     @param {callback} cb Callback function
     @return Number of dropped tables
     @example
     DROP TABLE one;
     DROP TABLE IF NOT EXISTS two, three;
     */
    yy.DropTable.prototype.execute = function(databaseid, params, cb) {
        var ifexists = this.ifexists;
        var res = 0; // No tables removed
        var count = 0;
        var tlen = this.tables.length;

        // For each table in the list
        this.tables.forEach(function(table) {
            var db = alasql.databases[table.databaseid || databaseid];
            var tableid = table.tableid;

            /** @todo Test with AUTOCOMMIT flag is ON */
            /** @todo Test with IndexedDB and multiple tables */

            if (!ifexists || (ifexists && db.tables[tableid])) {
                if (!db.tables[tableid]) {
                    if (!alasql.options.dropifnotexists) {
                        throw new Error(
                            "Can not drop table '" +
                            table.tableid +
                            "', because it does not exist in the database."
                        );
                    }
                } else {
                    if (db.engineid /*&& alasql.options.autocommit*/) {
                        alasql.engines[db.engineid].dropTable(
                            table.databaseid || databaseid,
                            tableid,
                            ifexists,
                            function(res1) {
                                delete db.tables[tableid];
                                res += res1;
                                count++;
                                if (count == tlen && cb) cb(res);
                            }
                        );
                    } else {
                        delete db.tables[tableid];
                        res++;
                        count++;
                        if (count == tlen && cb) cb(res);
                    }
                }
            } else {
                count++;
                if (count == tlen && cb) cb(res);
            }
        });
        // if(cb) res = cb(res);
        return res;
    };

    yy.TruncateTable = function(params) {
        return yy.extend(this, params);
    };
    yy.TruncateTable.prototype.toString = function() {
        var s = 'TRUNCATE TABLE';
        s += ' ' + this.table.toString();
        return s;
    };

    yy.TruncateTable.prototype.execute = function(databaseid, params, cb) {
        var db = alasql.databases[this.table.databaseid || databaseid];
        var tableid = this.table.tableid;
        if (db.engineid) {
            return alasql.engines[db.engineid].truncateTable(
                this.table.databaseid || databaseid,
                tableid,
                this.ifexists,
                cb
            );
        }
        if (db.tables[tableid]) {
            db.tables[tableid].data = [];
        } else {
            throw new Error('Cannot truncate table becaues it does not exist');
        }
        return cb ? cb(0) : 0;
    };

    /*
     //
     // CREATE VERTEX for AlaSQL
     // Date: 21.04.2015
     // (c) 2015, Andrey Gershun
     //
     */

    yy.CreateVertex = function(params) {
        return yy.extend(this, params);
    };
    yy.CreateVertex.prototype.toString = function() {
        var s = 'CREATE VERTEX ';
        if (this["class"]) {
            s += this["class"] + ' ';
        }
        if (this.sharp) {
            s += '#' + this.sharp + ' ';
        }
        if (this.sets) {
            s += this.sets.toString();
        } else if (this.content) {
            s += this.content.toString();
        } else if (this.select) {
            s += this.select.toString();
        }

        return s;
    };

    yy.CreateVertex.prototype.toJS = function(context) {

        var s = 'this.queriesfn[' + (this.queriesidx - 1) + '](this.params,null,' + context + ')';
        // var s = '';
        return s;
    };

// CREATE TABLE

    yy.CreateVertex.prototype.compile = function(databaseid) {
        var dbid = databaseid;

        // CREATE VERTEX #id
        var sharp = this.sharp;

        // CREATE VERTEX "Name"
        if (typeof this.name !== 'undefined') {
            var s = 'x.name=' + this.name.toJS();
            var namefn = new Function('x', s);
        }

        if (this.sets && this.sets.length > 0) {
            var s = this.sets
                .map(function(st) {
                    return "x['" + st.column.columnid + "']=" + st.expression.toJS('x', '');
                })
                .join(';');
            var setfn = new Function('x,params,alasql', s);
        }

        // Todo: check for content, select and default

        var statement = function(params, cb) {
            var res;

            // CREATE VERTEX without parameters
            var db = alasql.databases[dbid];
            var id;
            if (typeof sharp !== 'undefined') {
                id = sharp;
            } else {
                id = db.counter++;
            }
            var vertex = {$id: id, $node: 'VERTEX'};
            db.objects[vertex.$id] = vertex;
            res = vertex;
            if (namefn) {
                namefn(vertex);
            }
            if (setfn) {
                setfn(vertex, params, alasql);
            }

            if (cb) {
                res = cb(res);
            }
            return res;
        };
        return statement;
    };

    yy.CreateEdge = function(params) {
        return yy.extend(this, params);
    };
    yy.CreateEdge.prototype.toString = function() {

        var s = 'CREATE EDGE' + ' ';
        if (this["class"]) {
            s += this["class"] + ' ';
        }
        // todo: SET
        // todo: CONTENT
        // todo: SELECT
        return s;
    };

    yy.CreateEdge.prototype.toJS = function(context) {
        var s = 'this.queriesfn[' + (this.queriesidx - 1) + '](this.params,null,' + context + ')';
        return s;
    };

// CREATE TABLE

    yy.CreateEdge.prototype.compile = function(databaseid) {
        var dbid = databaseid;
        var fromfn = new Function('params,alasql', 'var y;return ' + this.from.toJS());
        var tofn = new Function('params,alasql', 'var y;return ' + this.to.toJS());

        // CREATE VERTEX "Name"
        if (typeof this.name !== 'undefined') {
            var s = 'x.name=' + this.name.toJS();
            var namefn = new Function('x', s);
        }

        if (this.sets && this.sets.length > 0) {
            var s = this.sets
                .map(function(st) {
                    return "x['" + st.column.columnid + "']=" + st.expression.toJS('x', '');
                })
                .join(';');
            var setfn = new Function('x,params,alasql', 'var y;' + s);
        }

        /*
         todo: handle content, select and default
         else if(this.content) {

         } else if(this.select) {

         } else {
         }
         */

        var statement = function(params, cb) {
            var res = 0;
            // CREATE VERTEX without parameters
            var db = alasql.databases[dbid];
            var edge = {$id: db.counter++, $node: 'EDGE'};
            var v1 = fromfn(params, alasql);
            var v2 = tofn(params, alasql);
            // Set link
            edge.$in = [v1.$id];
            edge.$out = [v2.$id];
            // Set sides
            if (v1.$out === undefined) {
                v1.$out = [];
            }
            v1.$out.push(edge.$id);

            if (typeof v2.$in === undefined) {
                v2.$in = [];
            }
            v2.$in.push(edge.$id);

            // Save in objects
            db.objects[edge.$id] = edge;
            res = edge;
            if (namefn) {
                namefn(edge);
            }

            if (setfn) {
                setfn(edge, params, alasql);
            }

            if (cb) {
                res = cb(res);
            }

            return res;
        };
        return statement;
    };

    yy.CreateGraph = function(params) {
        return yy.extend(this, params);
    };
    yy.CreateGraph.prototype.toString = function() {
        var s = 'CREATE GRAPH' + ' ';
        if (this["class"]) {
            s += this["class"] + ' ';
        }
        return s;
    };

    yy.CreateGraph.prototype.execute = function(databaseid, params, cb) {
        var res = [];
        if (this.from) {
            if (alasql.from[this.from.funcid]) {
                this.graph = alasql.from[this.from.funcid.toUpperCase()];
            }
        }

        //	stop;
        this.graph.forEach(function(g) {
            if (g.source) {
                // GREATE EDGE
                var e = {};
                if (typeof g.as !== 'undefined') {
                    alasql.vars[g.as] = e;
                }

                if (typeof g.prop !== 'undefined') {
                    //				e[g.prop] = e;
                    //				v.$id = g.prop; // We do not create $id for edge automatically
                    e.name = g.prop;
                }
                if (typeof g.sharp !== 'undefined') {
                    e.$id = g.sharp;
                }
                if (typeof g.name !== 'undefined') {
                    e.name = g.name;
                }
                if (typeof g["class"] !== 'undefined') {
                    e.$class = g["class"];
                }

                var db = alasql.databases[databaseid];
                if (typeof e.$id === 'undefined') {
                    e.$id = db.counter++;
                }
                e.$node = 'EDGE';
                if (typeof g.json !== 'undefined') {
                    extend(
                        e,
                        new Function('params,alasql', 'var y;return ' + g.json.toJS())(params, alasql)
                    );
                }

                var v1;
                if (g.source.vars) {
                    var vo = alasql.vars[g.source.vars];
                    if (typeof vo === 'object') {
                        v1 = vo;
                    } else {
                        v1 = db.objects[vo];
                    }
                } else {
                    var av1 = g.source.sharp;
                    if (typeof av1 === 'undefined') {
                        av1 = g.source.prop;
                    }
                    v1 = alasql.databases[databaseid].objects[av1];
                    if (
                        typeof v1 === 'undefined' &&
                        alasql.options.autovertex &&
                        (typeof g.source.prop !== 'undefined' || typeof g.source.name !== 'undefined')
                    ) {
                        v1 = findVertex(g.source.prop || g.source.name);
                        if (typeof v1 === 'undefined') {
                            v1 = createVertex(g.source);
                        }
                    }
                }

                var v2;
                if (g.source.vars) {
                    var vo = alasql.vars[g.target.vars];
                    if (typeof vo === 'object') {
                        v2 = vo;
                    } else {
                        v2 = db.objects[vo];
                    }
                } else {
                    var av2 = g.target.sharp;
                    if (typeof av2 === 'undefined') {
                        av2 = g.target.prop;
                    }
                    v2 = alasql.databases[databaseid].objects[av2];
                    if (
                        typeof v2 === 'undefined' &&
                        alasql.options.autovertex &&
                        (typeof g.target.prop !== 'undefined' || typeof g.target.name !== 'undefined')
                    ) {
                        v2 = findVertex(g.target.prop || g.target.name);
                        if (typeof v2 === 'undefined') {
                            v2 = createVertex(g.target);
                        }
                    }
                }

                // Set link
                e.$in = [v1.$id];
                e.$out = [v2.$id];
                // Set sides
                if (typeof v1.$out === 'undefined') {
                    v1.$out = [];
                }
                v1.$out.push(e.$id);
                if (typeof v2.$in === 'undefined') {
                    v2.$in = [];
                }
                v2.$in.push(e.$id);

                db.objects[e.$id] = e;
                if (typeof e.$class !== 'undefined') {
                    if (typeof alasql.databases[databaseid].tables[e.$class] === 'undefined') {
                        throw new Error('No such class. Pleace use CREATE CLASS');
                    } else {
                        // TODO - add insert()
                        alasql.databases[databaseid].tables[e.$class].data.push(e);
                    }
                }

                res.push(e.$id);
            } else {
                createVertex(g);
            }
        });

        if (cb) {
            res = cb(res);
        }
        return res;

        // Find vertex by name
        function findVertex(name) {
            var objects = alasql.databases[alasql.useid].objects;
            for (var k in objects) {
                if (objects[k].name === name) {
                    return objects[k];
                }
            }
            return undefined;
        }

        function createVertex(g) {
            // GREATE VERTEX
            var v = {};
            if (typeof g.as !== 'undefined') {
                alasql.vars[g.as] = v;
            }

            if (typeof g.prop !== 'undefined') {
                //				v[g.prop] = true;
                v.$id = g.prop;
                v.name = g.prop;
            }

            if (typeof g.sharp !== 'undefined') {
                v.$id = g.sharp;
            }
            if (typeof g.name !== 'undefined') {
                v.name = g.name;
            }
            if (typeof g["class"] !== 'undefined') {
                v.$class = g["class"];
            }

            var db = alasql.databases[databaseid];
            if (typeof v.$id === 'undefined') {
                v.$id = db.counter++;
            }
            v.$node = 'VERTEX';
            if (typeof g.json !== 'undefined') {
                extend(
                    v,
                    new Function('params,alasql', 'var y;return ' + g.json.toJS())(params, alasql)
                );
            }
            db.objects[v.$id] = v;
            if (typeof v.$class !== 'undefined') {
                if (typeof alasql.databases[databaseid].tables[v.$class] === 'undefined') {
                    throw new Error('No such class. Pleace use CREATE CLASS');
                } else {
                    // TODO - add insert()
                    alasql.databases[databaseid].tables[v.$class].data.push(v);
                }
            }

            res.push(v.$id);
            return v;
        }
    };

    yy.CreateGraph.prototype.compile1 = function(databaseid) {
        var dbid = databaseid;
        var fromfn = new Function('params,alasql', 'var y;return ' + this.from.toJS());
        var tofn = new Function('params,alasql', 'var y;return ' + this.to.toJS());

        // CREATE VERTEX "Name"
        if (typeof this.name !== 'undefined') {
            var s = 'x.name=' + this.name.toJS();
            var namefn = new Function('x', s);
        }

        if (this.sets && this.sets.length > 0) {
            var s = this.sets
                .map(function(st) {
                    return "x['" + st.column.columnid + "']=" + st.expression.toJS('x', '');
                })
                .join(';');
            var setfn = new Function('x,params,alasql', 'var y;' + s);
        }

        // Todo: handle content, select and default

        var statement = function(params, cb) {
            var res = 0;
            // CREATE VERTEX without parameters
            var db = alasql.databases[dbid];
            var edge = {$id: db.counter++, $node: 'EDGE'};
            var v1 = fromfn(params, alasql);
            var v2 = tofn(params, alasql);
            // Set link
            edge.$in = [v1.$id];
            edge.$out = [v2.$id];
            // Set sides
            if (typeof v1.$out === 'undefined') {
                v1.$out = [];
            }
            v1.$out.push(edge.$id);

            if (typeof v2.$in === 'undefined') {
                v2.$in = [];
            }
            v2.$in.push(edge.$id);
            // Save in objects
            db.objects[edge.$id] = edge;
            res = edge;
            if (namefn) {
                namefn(edge);
            }
            if (setfn) {
                setfn(edge, params, alasql);
            }

            if (cb) {
                res = cb(res);
            }
            return res;
        };
        return statement;
    };

    /*
     //
     // ALTER TABLE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */
    /* global alasql yy */

// ALTER TABLE table1 RENAME TO table2
    yy.AlterTable = function(params) {
        return yy.extend(this, params);
    };
    yy.AlterTable.prototype.toString = function() {
        var s = 'ALTER TABLE ' + this.table.toString();
        if (this.renameto) s += ' RENAME TO ' + this.renameto;
        return s;
    };

    yy.AlterTable.prototype.execute = function(databaseid, params, cb) {
        var db = alasql.databases[databaseid];
        db.dbversion = Date.now();

        if (this.renameto) {
            var oldtableid = this.table.tableid;
            var newtableid = this.renameto;
            var res = 1;
            if (db.tables[newtableid]) {
                throw new Error(
                    "Can not rename a table '" +
                    oldtableid +
                    "' to '" +
                    newtableid +
                    "', because the table with this name already exists"
                );
            } else if (newtableid === oldtableid) {
                throw new Error("Can not rename a table '" + oldtableid + "' to itself");
            } else {
                db.tables[newtableid] = db.tables[oldtableid];
                delete db.tables[oldtableid];
                res = 1;
            }
            if (cb) cb(res);
            return res;
        } else if (this.addcolumn) {
            db = alasql.databases[this.table.databaseid || databaseid];
            db.dbversion++;
            var tableid = this.table.tableid;
            var table = db.tables[tableid];
            var columnid = this.addcolumn.columnid;
            if (table.xcolumns[columnid]) {
                throw new Error(
                    'Cannot add column "' +
                    columnid +
                    '", because it already exists in the table "' +
                    tableid +
                    '"'
                );
            }

            var col = {
                columnid: columnid,
                dbtypeid: this.dbtypeid,
                dbsize: this.dbsize,
                dbprecision: this.dbprecision,
                dbenum: this.dbenum,
                defaultfns: null, // TODO defaultfns!!!
            };

            var defaultfn = function() {};

            table.columns.push(col);
            table.xcolumns[columnid] = col;

            for (var i = 0, ilen = table.data.length; i < ilen; i++) {

                table.data[i][columnid] = defaultfn();
            }

            // TODO
            return cb ? cb(1) : 1;
        } else if (this.modifycolumn) {
            var db = alasql.databases[this.table.databaseid || databaseid];
            db.dbversion++;
            var tableid = this.table.tableid;
            var table = db.tables[tableid];
            var columnid = this.modifycolumn.columnid;

            if (!table.xcolumns[columnid]) {
                throw new Error(
                    'Cannot modify column "' +
                    columnid +
                    '", because it was not found in the table "' +
                    tableid +
                    '"'
                );
            }

            col = table.xcolumns[columnid];
            col.dbtypeid = this.dbtypeid;
            col.dbsize = this.dbsize;
            col.dbprecision = this.dbprecision;
            col.dbenum = this.dbenum;

            // TODO
            return cb ? cb(1) : 1;
        } else if (this.renamecolumn) {
            var db = alasql.databases[this.table.databaseid || databaseid];
            db.dbversion++;

            var tableid = this.table.tableid;
            var table = db.tables[tableid];
            var columnid = this.renamecolumn;
            var tocolumnid = this.to;

            var col;
            if (!table.xcolumns[columnid]) {
                throw new Error(
                    'Column "' + columnid + '" is not found in the table "' + tableid + '"'
                );
            }
            if (table.xcolumns[tocolumnid]) {
                throw new Error(
                    'Column "' + tocolumnid + '" already exists in the table "' + tableid + '"'
                );
            }

            if (columnid != tocolumnid) {
                for (var j = 0; j < table.columns.length; j++) {
                    if (table.columns[j].columnid == columnid) {
                        table.columns[j].columnid = tocolumnid;
                    }
                }

                table.xcolumns[tocolumnid] = table.xcolumns[columnid];
                delete table.xcolumns[columnid];

                for (var i = 0, ilen = table.data.length; i < ilen; i++) {

                    table.data[i][tocolumnid] = table.data[i][columnid];
                    delete table.data[i][columnid];
                }
                return table.data.length;
            } else {
                return cb ? cb(0) : 0;
            }
        } else if (this.dropcolumn) {
            var db = alasql.databases[this.table.databaseid || databaseid];
            db.dbversion++;
            var tableid = this.table.tableid;
            var table = db.tables[tableid];
            var columnid = this.dropcolumn;

            var found = false;
            for (var j = 0; j < table.columns.length; j++) {
                if (table.columns[j].columnid == columnid) {
                    found = true;
                    table.columns.splice(j, 1);
                    break;
                }
            }

            if (!found) {
                throw new Error(
                    'Cannot drop column "' +
                    columnid +
                    '", because it was not found in the table "' +
                    tableid +
                    '"'
                );
            }

            delete table.xcolumns[columnid];

            for (i = 0, ilen = table.data.length; i < ilen; i++) {
                delete table.data[i][columnid];
            }
            return cb ? cb(table.data.length) : table.data.length;
        } else {
            throw Error('Unknown ALTER TABLE method');
        }
    };

    /*
     //
     // CREATE TABLE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.CreateIndex = function(params) {
        return yy.extend(this, params);
    };
    yy.CreateIndex.prototype.toString = function() {
        var s = 'CREATE';
        if (this.unique) s += ' UNIQUE';
        s += ' INDEX ' + this.indexid + ' ON ' + this.table.toString();
        s += '(' + this.columns.toString() + ')';
        return s;
    };

// CREATE TABLE
    yy.CreateIndex.prototype.execute = function(databaseid, params, cb) {
        //	var self = this;
        var db = alasql.databases[databaseid];
        var tableid = this.table.tableid;
        var table = db.tables[tableid];
        var indexid = this.indexid;
        db.indices[indexid] = tableid;

        var rightfns = this.columns
            .map(function(expr) {
                return expr.expression.toJS('r', '');
            })
            .join("+'`'+");

        var rightfn = new Function('r,params,alasql', 'return ' + rightfns);

        if (this.unique) {
            table.uniqdefs[indexid] = {
                rightfns: rightfns,
            };
            var ux = (table.uniqs[indexid] = {});
            if (table.data.length > 0) {
                for (var i = 0, ilen = table.data.length; i < ilen; i++) {
                    var addr = rightfns(table.data[i]);
                    if (!ux[addr]) {
                        ux[addr] = {num: 0};
                    }
                    ux[addr].num++;
                }
            }
        } else {
            var hh = hash(rightfns);
            table.inddefs[indexid] = {rightfns: rightfns, hh: hh};
            table.indices[hh] = {};

            var ix = (table.indices[hh] = {});
            if (table.data.length > 0) {
                for (var i = 0, ilen = table.data.length; i < ilen; i++) {
                    var addr = rightfn(table.data[i], params, alasql);
                    if (!ix[addr]) {
                        ix[addr] = [];
                    }
                    ix[addr].push(table.data[i]);
                }
            }
        }
        var res = 1;
        if (cb) res = cb(res);
        return res;
    };

    yy.Reindex = function(params) {
        return yy.extend(this, params);
    };
    yy.Reindex.prototype.toString = function() {
        var s = 'REINDEX ' + this.indexid;
        return s;
    };

// CREATE TABLE
    yy.Reindex.prototype.execute = function(databaseid, params, cb) {
        //	var self = this;
        var db = alasql.databases[databaseid];
        var indexid = this.indexid;

        var tableid = db.indices[indexid];
        var table = db.tables[tableid];
        table.indexColumns();
        var res = 1;
        if (cb) res = cb(res);
        return res;
    };

    /*
     //
     // DROP TABLE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.DropIndex = function(params) {
        return yy.extend(this, params);
    };
    yy.DropIndex.prototype.toString = function() {
        return 'DROP INDEX' + this.indexid;
    };

// DROP TABLE
    yy.DropIndex.prototype.compile = function(db) {
        var indexid = this.indexid;
        return function() {
            return 1;
        };
    };

    /*
     //
     // WITH SELECT for Alasql.js
     // Date: 11.01.2015
     // (c) 2015, Andrey Gershun
     //
     */

    yy.WithSelect = function(params) {
        return yy.extend(this, params);
    };
    yy.WithSelect.prototype.toString = function() {
        var s = 'WITH ';
        s +=
            this.withs
                .map(function(w) {
                    return w.name + ' AS (' + w.select.toString() + ')';
                })
                .join(',') + ' ';
        s += this.select.toString();
        return s;
    };

    yy.WithSelect.prototype.execute = function(databaseid, params, cb) {
        var self = this;
        // Create temporary tables
        var savedTables = [];
        self.withs.forEach(function(w) {
            savedTables.push(alasql.databases[databaseid].tables[w.name]);
            var tb = (alasql.databases[databaseid].tables[w.name] = new Table({tableid: w.name}));
            tb.data = w.select.execute(databaseid, params);
        });

        var res = 1;
        res = this.select.execute(databaseid, params, function(data) {
            // Clear temporary tables
            //		setTimeout(function(){
            self.withs.forEach(function(w, idx) {
                if (savedTables[idx]) alasql.databases[databaseid].tables[w.name] = savedTables[idx];
                else delete alasql.databases[databaseid].tables[w.name];
            });
            //		},0);

            if (cb) data = cb(data);
            return data;
        });
        return res;
    };

    /*
     //
     // IF for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.If = function(params) {
        return yy.extend(this, params);
    };
    yy.If.prototype.toString = function() {
        var s = 'IF' + ' ';
        s += this.expression.toString();
        s += ' ' + this.thenstat.toString();
        if (this.elsestat) s += ' ELSE ' + this.thenstat.toString();
        return s;
    };

// CREATE TABLE

    yy.If.prototype.execute = function(databaseid, params, cb) {
        var res;

        var fn = new Function(
            'params,alasql,p',
            'var y;return ' + this.expression.toJS('({})', '', null)
        ).bind(this);

        if (fn(params, alasql)) res = this.thenstat.execute(databaseid, params, cb);
        else {
            if (this.elsestat) res = this.elsestat.execute(databaseid, params, cb);
            else {
                if (cb) res = cb(res);
            }
        }
        //	 else res = this.elsestat.execute(databaseid,params,cb,scope);
        return res;
    };

    /*
     //
     // CREATE VIEW for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.While = function(params) {
        return yy.extend(this, params);
    };
    yy.While.prototype.toString = function() {
        var s = 'WHILE ';
        s += this.expression.toString();
        s += ' ' + this.loopstat.toString();
        return s;
    };

    yy.While.prototype.execute = function(databaseid, params, cb) {
        var self = this;
        var res = [];

        var fn = new Function('params,alasql,p', 'var y;return ' + this.expression.toJS());

        if (cb) {
            var first = false;
            loop();
            function loop(data) {
                if (first) {
                    res.push(data);
                } else {
                    first = true;
                }
                setTimeout(function() {
                    if (fn(params, alasql)) {
                        self.loopstat.execute(databaseid, params, loop);
                    } else {
                        res = cb(res);
                    }
                }, 0);
            }
        } else {
            while (fn(params, alasql)) {
                var res1 = self.loopstat.execute(databaseid, params);
                res.push(res1);
            }
        }
        return res;
    };

    yy.Break = function(params) {
        return yy.extend(this, params);
    };
    yy.Break.prototype.toString = function() {
        var s = 'BREAK';
        return s;
    };

    yy.Break.prototype.execute = function(databaseid, params, cb, scope) {
        var res = 1;
        if (cb) res = cb(res);
        return res;
    };

    yy.Continue = function(params) {
        return yy.extend(this, params);
    };
    yy.Continue.prototype.toString = function() {
        var s = 'CONTINUE';
        return s;
    };

    yy.Continue.prototype.execute = function(databaseid, params, cb, scope) {
        var res = 1;
        if (cb) res = cb(res);
        return res;
    };

    yy.BeginEnd = function(params) {
        return yy.extend(this, params);
    };
    yy.BeginEnd.prototype.toString = function() {
        var s = 'BEGIN ' + this.statements.toString() + ' END';
        return s;
    };

    yy.BeginEnd.prototype.execute = function(databaseid, params, cb, scope) {
        var self = this;
        var res = [];

        var idx = 0;
        runone();
        function runone() {
            self.statements[idx].execute(databaseid, params, function(data) {
                res.push(data);
                idx++;
                if (idx < self.statements.length) return runone();
                if (cb) res = cb(res);
            });
        }
        return res;
    };

    /*
     //
     // INSERT for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* global yy alasql*/
    yy.Insert = function(params) {
        return yy.extend(this, params);
    };
    yy.Insert.prototype.toString = function() {
        var s = 'INSERT ';
        if (this.orreplace) s += 'OR REPLACE ';
        if (this.replaceonly) s = 'REPLACE ';
        s += 'INTO ' + this.into.toString();
        if (this.columns) s += '(' + this.columns.toString() + ')';
        if (this.values) s += ' VALUES ' + this.values.toString();
        if (this.select) s += ' ' + this.select.toString();
        return s;
    };

    yy.Insert.prototype.toJS = function(context, tableid, defcols) {

        //	if(this.expression.reduced) return 'true';
        //	return this.expression.toJS(context, tableid, defcols);

        //	var s = 'this.queriesdata['+(this.queriesidx-1)+'][0]';

        var s = 'this.queriesfn[' + (this.queriesidx - 1) + '](this.params,null,' + context + ')';

        return s;
    };

    yy.Insert.prototype.compile = function(databaseid) {
        var self = this;
        databaseid = self.into.databaseid || databaseid;
        var db = alasql.databases[databaseid];

        var tableid = self.into.tableid;
        var table = db.tables[tableid];

        if (!table) {
            throw "Table '" + tableid + "' could not be found";
        }

        // Check, if this dirty flag is required
        var s = '';
        var sw = '';
        var s = "db.tables['" + tableid + "'].dirty=true;";
        var s3 = 'var a,aa=[],x;';

        var s33;

        // INSERT INTO table VALUES
        if (this.values) {
            if (this.exists) {
                this.existsfn = this.exists.map(function(ex) {
                    var nq = ex.compile(databaseid);
                    nq.query.modifier = 'RECORDSET';
                    return nq;
                });
            }
            if (this.queries) {
                this.queriesfn = this.queries.map(function(q) {
                    var nq = q.compile(databaseid);
                    nq.query.modifier = 'RECORDSET';
                    return nq;
                });
            }

            self.values.forEach(function(values) {
                var ss = [];

                //			s += 'db.tables[\''+tableid+'\'].data.push({';

                //			s += '';
                if (self.columns) {
                    self.columns.forEach(function(col, idx) {

                        //			ss.push(col.columnid +':'+ self.values[idx].value.toString());

                        //			if(rec[f.name.value] == "NULL") rec[f.name.value] = undefined;

                        //			if(table.xflds[f.name.value].dbtypeid == "INT") rec[f.name.value] = +rec[f.name.value]|0;
                        //			else if(table.xflds[f.name.value].dbtypeid == "FLOAT") rec[f.name.value] = +rec[f.name.value];
                        var q = "'" + col.columnid + "':";
                        if (table.xcolumns && table.xcolumns[col.columnid]) {
                            if (
                                ['INT', 'FLOAT', 'NUMBER', 'MONEY'].indexOf(
                                    table.xcolumns[col.columnid].dbtypeid
                                ) >= 0
                            ) {
                                //q += ''
                                q += '(x=' + values[idx].toJS() + ',x==undefined?undefined:+x)';
                            } else if (alasql.fn[table.xcolumns[col.columnid].dbtypeid]) {
                                q += '(new ' + table.xcolumns[col.columnid].dbtypeid + '(';
                                q += values[idx].toJS();
                                q += '))';
                            } else {
                                q += values[idx].toJS();
                            }
                        } else {
                            q += values[idx].toJS();
                        }
                        ss.push(q);
                    });
                } else {
                    //				var table = db.tables[tableid];

                    if (Array.isArray(values) && table.columns && table.columns.length > 0) {
                        table.columns.forEach(function(col, idx) {
                            var q = "'" + col.columnid + "':";
                            //						var val = values[idx].toJS();

                            if (['INT', 'FLOAT', 'NUMBER', 'MONEY'].indexOf(col.dbtypeid) >= 0) {
                                q += '+' + values[idx].toJS();
                            } else if (alasql.fn[col.dbtypeid]) {
                                q += '(new ' + col.dbtypeid + '(';
                                q += values[idx].toJS();
                                q += '))';
                            } else {
                                q += values[idx].toJS();
                            }

                            ss.push(q);

                        });
                    } else {

                        //					sw = 'var w='+JSONtoJS(values)+';for(var k in w){r[k]=w[k]};';
                        sw = JSONtoJS(values);
                    }
                }

                if (db.tables[tableid].defaultfns) {
                    ss.unshift(db.tables[tableid].defaultfns);
                }
                if (sw) {
                    s += 'a=' + sw + ';';
                } else {
                    s += 'a={' + ss.join(',') + '};';
                }

                // If this is a class
                if (db.tables[tableid].isclass) {
                    s += "var db=alasql.databases['" + databaseid + "'];";
                    s += 'a.$class="' + tableid + '";';
                    s += 'a.$id=db.counter++;';
                    s += 'db.objects[a.$id]=a;';
                }
                //			s += 'db.tables[\''+tableid+'\'].insert(r);';
                if (db.tables[tableid].insert) {
                    s += "var db=alasql.databases['" + databaseid + "'];";
                    s +=
                        "db.tables['" +
                        tableid +
                        "'].insert(a," +
                        (self.orreplace ? 'true' : 'false') +
                        ');';
                } else {
                    s += 'aa.push(a);';
                }
            });

            s33 = s3 + s;

            if (db.tables[tableid].insert) {
                //			s += 'alasql.databases[\''+databaseid+'\'].tables[\''+tableid+'\'].insert(r);';
            } else {
                s +=
                    "alasql.databases['" +
                    databaseid +
                    "'].tables['" +
                    tableid +
                    "'].data=" +
                    "alasql.databases['" +
                    databaseid +
                    "'].tables['" +
                    tableid +
                    "'].data.concat(aa);";
            }

            if (db.tables[tableid].insert) {
                if (db.tables[tableid].isclass) {
                    s += 'return a.$id;';
                } else {
                    s += 'return ' + self.values.length;
                }
            } else {
                s += 'return ' + self.values.length;
            }

            var insertfn = new Function('db, params, alasql', 'var y;' + s3 + s).bind(this);

            // INSERT INTO table SELECT
        } else if (this.select) {
            this.select.modifier = 'RECORDSET';
            var selectfn = this.select.compile(databaseid);
            if (db.engineid && alasql.engines[db.engineid].intoTable) {
                var statement = function(params, cb) {
                    var aa = selectfn(params);
                    var res = alasql.engines[db.engineid].intoTable(
                        db.databaseid,
                        tableid,
                        aa.data,
                        null,
                        cb
                    );
                    return res;
                };
                return statement;
            } else {

                var defaultfns = 'return alasql.utils.extend(r,{' + table.defaultfns + '})';
                var defaultfn = new Function('r,db,params,alasql', defaultfns);
                var insertfn = function(db, params, alasql) {
                    var res = selectfn(params).data;
                    if (db.tables[tableid].insert) {
                        // If insert() function exists (issue #92)
                        for (var i = 0, ilen = res.length; i < ilen; i++) {
                            var r = cloneDeep(res[i]);
                            defaultfn(r, db, params, alasql);
                            db.tables[tableid].insert(r, self.orreplace);
                        }
                    } else {
                        db.tables[tableid].data = db.tables[tableid].data.concat(res);
                    }
                    if (alasql.options.nocount) return;
                    else return res.length;
                };
            }
        } else if (this["default"]) {
            var insertfns =
                "db.tables['" + tableid + "'].data.push({" + table.defaultfns + '});return 1;';
            var insertfn = new Function('db,params,alasql', insertfns);
        } else {
            throw new Error('Wrong INSERT parameters');
        }

        if (db.engineid && alasql.engines[db.engineid].intoTable && alasql.options.autocommit) {
            var statement = function(params, cb) {
                var aa = new Function('db,params', 'var y;' + s33 + 'return aa;')(db, params);

                var res = alasql.engines[db.engineid].intoTable(db.databaseid, tableid, aa, null, cb);
                //			if(cb) cb(res);
                return res;
            };
        } else {
            var statement = function(params, cb) {

                var db = alasql.databases[databaseid];

                if (alasql.options.autocommit && db.engineid) {
                    alasql.engines[db.engineid].loadTableData(databaseid, tableid);
                }

                var res = insertfn(db, params, alasql);

                if (alasql.options.autocommit && db.engineid) {
                    alasql.engines[db.engineid].saveTableData(databaseid, tableid);
                }
                //		var res = insertfn(db, params);
                if (alasql.options.nocount) res = undefined;
                if (cb) cb(res);
                return res;
            };
        }

        return statement;
    };

    yy.Insert.prototype.execute = function(databaseid, params, cb) {
        return this.compile(databaseid)(params, cb);
        //	throw new Error('Insert statement is should be compiled')
    };

    /*
     //
     // TRIGGER for Alasql.js
     // Date: 29.12.2015
     //
     */

    yy.CreateTrigger = function(params) {
        return yy.extend(this, params);
    };
    yy.CreateTrigger.prototype.toString = function() {
        var s = 'CREATE TRIGGER ' + this.trigger + ' ';
        if (this.when) s += this.when + ' ';
        s += this.action + ' ON ';
        if (this.table.databaseid) s += this.table.databaseid + '.';
        s += this.table.tableid + ' ';
        s += this.statement.toString();
        return s;
    };

    yy.CreateTrigger.prototype.execute = function(databaseid, params, cb) {
        var res = 1; // No tables removed
        var triggerid = this.trigger;
        databaseid = this.table.databaseid || databaseid;
        var db = alasql.databases[databaseid];
        var tableid = this.table.tableid;

        var trigger = {
            action: this.action,
            when: this.when,
            statement: this.statement,
            funcid: this.funcid,
        };

        db.triggers[triggerid] = trigger;
        if (trigger.action == 'INSERT' && trigger.when == 'BEFORE') {
            db.tables[tableid].beforeinsert[triggerid] = trigger;
        } else if (trigger.action == 'INSERT' && trigger.when == 'AFTER') {
            db.tables[tableid].afterinsert[triggerid] = trigger;
        } else if (trigger.action == 'INSERT' && trigger.when == 'INSTEADOF') {
            db.tables[tableid].insteadofinsert[triggerid] = trigger;
        } else if (trigger.action == 'DELETE' && trigger.when == 'BEFORE') {
            db.tables[tableid].beforedelete[triggerid] = trigger;
        } else if (trigger.action == 'DELETE' && trigger.when == 'AFTER') {
            db.tables[tableid].afterdelete[triggerid] = trigger;
        } else if (trigger.action == 'DELETE' && trigger.when == 'INSTEADOF') {
            db.tables[tableid].insteadofdelete[triggerid] = trigger;
        } else if (trigger.action == 'UPDATE' && trigger.when == 'BEFORE') {
            db.tables[tableid].beforeupdate[triggerid] = trigger;
        } else if (trigger.action == 'UPDATE' && trigger.when == 'AFTER') {
            db.tables[tableid].afterupdate[triggerid] = trigger;
        } else if (trigger.action == 'UPDATE' && trigger.when == 'INSTEADOF') {
            db.tables[tableid].insteadofupdate[triggerid] = trigger;
        }

        if (cb) res = cb(res);
        return res;
    };

    yy.DropTrigger = function(params) {
        return yy.extend(this, params);
    };
    yy.DropTrigger.prototype.toString = function() {
        var s = 'DROP TRIGGER ' + this.trigger;
        return s;
    };

    /**
     Drop trigger
     @param {string} databaseid Database id
     @param {object} params Parameters
     @param {callback} cb Callback function
     @return Number of dropped triggers
     @example
     DROP TRIGGER one;
     */
    yy.DropTrigger.prototype.execute = function(databaseid, params, cb) {
        var res = 0; // No tables removed
        var db = alasql.databases[databaseid];
        var triggerid = this.trigger;
        // For each table in the list
        var tableid = db.triggers[triggerid];
        if (tableid) {
            res = 1;
            delete db.tables[tableid].beforeinsert[triggerid];
            delete db.tables[tableid].afterinsert[triggerid];
            delete db.tables[tableid].insteadofinsert[triggerid];
            delete db.tables[tableid].beforedelte[triggerid];
            delete db.tables[tableid].afterdelete[triggerid];
            delete db.tables[tableid].insteadofdelete[triggerid];
            delete db.tables[tableid].beforeupdate[triggerid];
            delete db.tables[tableid].afterupdate[triggerid];
            delete db.tables[tableid].insteadofupdate[triggerid];
            delete db.triggers[triggerid];
        } else {
            throw new Error('Trigger not found');
        }
        if (cb) res = cb(res);
        return res;
    };

    /*
     //
     // DELETE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Delete = function(params) {
        return yy.extend(this, params);
    };
    yy.Delete.prototype.toString = function() {
        var s = 'DELETE FROM ' + this.table.toString();
        if (this.where) s += ' WHERE ' + this.where.toString();
        return s;
    };

    yy.Delete.prototype.compile = function(databaseid) {

        databaseid = this.table.databaseid || databaseid;
        var tableid = this.table.tableid;
        var statement;
        var db = alasql.databases[databaseid];

        if (this.where) {

            //		this.query = {};

            if (this.exists) {
                this.existsfn = this.exists.map(function(ex) {
                    var nq = ex.compile(databaseid);
                    nq.query.modifier = 'RECORDSET';
                    return nq;
                });
            }
            if (this.queries) {
                this.queriesfn = this.queries.map(function(q) {
                    var nq = q.compile(databaseid);
                    nq.query.modifier = 'RECORDSET';
                    return nq;
                });
            }

            //		try {

            //		var query = {};

            var wherefn = new Function(
                'r,params,alasql',
                'var y;return (' + this.where.toJS('r', '') + ')'
            ).bind(this);

            statement = function(params, cb) {
                if (db.engineid && alasql.engines[db.engineid].deleteFromTable) {
                    return alasql.engines[db.engineid].deleteFromTable(
                        databaseid,
                        tableid,
                        wherefn,
                        params,
                        cb
                    );
                }

                if (alasql.options.autocommit && db.engineid && db.engineid == 'LOCALSTORAGE') {
                    alasql.engines[db.engineid].loadTableData(databaseid, tableid);
                }

                var table = db.tables[tableid];
                //			table.dirty = true;
                var orignum = table.data.length;

                var newtable = [];
                for (var i = 0, ilen = table.data.length; i < ilen; i++) {
                    if (wherefn(table.data[i], params, alasql)) {
                        // Check for transaction - if it is not possible then return all back
                        if (table["delete"]) {
                            table["delete"](i, params, alasql);
                        } else {
                            // Simply do not push
                        }
                    } else newtable.push(table.data[i]);
                }
                //			table.data = table.data.filter(function(r){return !;});
                table.data = newtable;

                // Trigger prevent functionality
                for (var tr in table.afterdelete) {
                    var trigger = table.afterdelete[tr];
                    if (trigger) {
                        if (trigger.funcid) {
                            alasql.fn[trigger.funcid]();
                        } else if (trigger.statement) {
                            trigger.statement.execute(databaseid);
                        }
                    }
                }

                var res = orignum - table.data.length;
                if (alasql.options.autocommit && db.engineid && db.engineid == 'LOCALSTORAGE') {
                    alasql.engines[db.engineid].saveTableData(databaseid, tableid);
                }

                if (cb) cb(res);
                return res;
            };
            //  .bind(query);

            // 		if(!this.queries) return;
            // 			query.queriesfn = this.queries.map(function(q) {
            // 			return q.compile(alasql.useid);
            // 		});
        } else {
            statement = function(params, cb) {
                if (alasql.options.autocommit && db.engineid) {
                    alasql.engines[db.engineid].loadTableData(databaseid, tableid);
                }

                var table = db.tables[tableid];
                table.dirty = true;
                var orignum = db.tables[tableid].data.length;
                //table.deleteall();
                // Delete all records from the array
                db.tables[tableid].data.length = 0;

                // Reset PRIMARY KEY and indexes
                for (var ix in db.tables[tableid].uniqs) {
                    db.tables[tableid].uniqs[ix] = {};
                }

                for (var ix in db.tables[tableid].indices) {
                    db.tables[tableid].indices[ix] = {};
                }

                if (alasql.options.autocommit && db.engineid) {
                    alasql.engines[db.engineid].saveTableData(databaseid, tableid);
                }

                if (cb) cb(orignum);
                return orignum;
            };
        }

        return statement;
    };

    yy.Delete.prototype.execute = function(databaseid, params, cb) {
        return this.compile(databaseid)(params, cb);
    };

    /*
     //
     // UPDATE for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* global yy alasql */

    yy.Update = function(params) {
        return yy.extend(this, params);
    };
    yy.Update.prototype.toString = function() {
        var s = 'UPDATE ' + this.table.toString();
        if (this.columns) s += ' SET ' + this.columns.toString();
        if (this.where) s += ' WHERE ' + this.where.toString();
        return s;
    };

    yy.SetColumn = function(params) {
        return yy.extend(this, params);
    };
    yy.SetColumn.prototype.toString = function() {
        return this.column.toString() + '=' + this.expression.toString();
    };

    yy.Update.prototype.compile = function(databaseid) {

        databaseid = this.table.databaseid || databaseid;
        var tableid = this.table.tableid;

        if (this.where) {
            if (this.exists) {
                this.existsfn = this.exists.map(function(ex) {
                    var nq = ex.compile(databaseid);
                    nq.query.modifier = 'RECORDSET';
                    return nq;
                });
            }
            if (this.queries) {
                this.queriesfn = this.queries.map(function(q) {
                    var nq = q.compile(databaseid);
                    nq.query.modifier = 'RECORDSET';
                    return nq;
                });
            }

            var wherefn = new Function(
                'r,params,alasql',
                'var y;return ' + this.where.toJS('r', '')
            ).bind(this);
        }

        // Construct update function
        var s = alasql.databases[databaseid].tables[tableid].onupdatefns || '';
        s += ';';
        this.columns.forEach(function(col) {
            s += "r['" + col.column.columnid + "']=" + col.expression.toJS('r', '') + ';';
        });

        var assignfn = new Function('r,params,alasql', 'var y;' + s);

        var statement = function(params, cb) {
            var db = alasql.databases[databaseid];

            if (db.engineid && alasql.engines[db.engineid].updateTable) {

                return alasql.engines[db.engineid].updateTable(
                    databaseid,
                    tableid,
                    assignfn,
                    wherefn,
                    params,
                    cb
                );
            }

            if (alasql.options.autocommit && db.engineid) {
                alasql.engines[db.engineid].loadTableData(databaseid, tableid);
            }

            var table = db.tables[tableid];
            if (!table) {
                throw new Error("Table '" + tableid + "' not exists");
            }
            //		table.dirty = true;
            var numrows = 0;
            for (var i = 0, ilen = table.data.length; i < ilen; i++) {
                if (!wherefn || wherefn(table.data[i], params, alasql)) {
                    if (table.update) {
                        table.update(assignfn, i, params);
                    } else {
                        assignfn(table.data[i], params, alasql);
                    }
                    numrows++;
                }
            }

            if (alasql.options.autocommit && db.engineid) {
                alasql.engines[db.engineid].saveTableData(databaseid, tableid);
            }

            if (cb) cb(numrows);
            return numrows;
        };
        return statement;
    };

    yy.Update.prototype.execute = function(databaseid, params, cb) {
        return this.compile(databaseid)(params, cb);
    };

    /*
     //
     // SET for Alasql.js
     // Date: 01.12.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* global alasql, yy */

    yy.Merge = function(params) {
        return yy.extend(this, params);
    };
    yy.Merge.prototype.toString = function() {
        var s = 'MERGE ';
        s += this.into.tableid + ' ';
        if (this.into.as) s += 'AS ' + this.into.as + ' ';
        s += 'USING ' + this.using.tableid + ' ';
        if (this.using.as) s += 'AS ' + this.using.as + ' ';
        s += 'ON ' + this.on.toString() + ' ';
        this.matches.forEach(function(m) {
            s += 'WHEN ';
            if (!m.matched) s += 'NOT ';
            s += 'MATCHED ';
            if (m.bytarget) s += 'BY TARGET ';
            if (m.bysource) s += 'BY SOURCE ';
            if (m.expr) s += 'AND' + ' ' + m.expr.toString() + ' ';
            s += 'THEN ';
            if (m.action["delete"]) s += 'DELETE ';
            if (m.action.insert) {
                s += 'INSERT ';
                if (m.action.columns) s += '(' + m.action.columns.toString() + ') ';
                if (m.action.values) s += 'VALUES (' + m.action.values.toString() + ') ';
                if (m.action.defaultvalues) s += 'DEFAULT VALUES ';
            }
            if (m.action.update) {
                s += 'UPDATE ';
                s +=
                    m.action.update
                        .map(function(u) {
                            return u.toString();
                        })
                        .join(',') + ' ';
            }
        });

        return s;
    };

    yy.Merge.prototype.execute = function(databaseid, params, cb) {
        var res = 1;

        if (cb) res = cb(res);
        return res;
    };

    /*
     //
     // UPDATE for Alasql.js
     // Date: 03.11.2014
     // Modified: 16.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* global yy alasql */

// CREATE DATABASE databaseid
    yy.CreateDatabase = function(params) {
        return yy.extend(this, params);
    };
    yy.CreateDatabase.prototype.toString = function() {
        var s = 'CREATE';
        if (this.engineid) s += ' ' + this.engineid;
        s += ' DATABASE';
        if (this.ifnotexists) s += ' IF NOT EXISTS';
        s += ' ' + this.databaseid;
        if (this.args && this.args.length > 0) {
            s +=
                '(' +
                this.args
                    .map(function(arg) {
                        return arg.toString();
                    })
                    .join(', ') +
                ')';
        }
        if (this.as) s += ' AS ' + this.as;
        return s;
    };
//yy.CreateDatabase.prototype.compile = returnUndefined;
    yy.CreateDatabase.prototype.execute = function(databaseid, params, cb) {
        var args;
        if (this.args && this.args.length > 0) {
            args = this.args.map(function(arg) {

                return new Function('params,alasql', 'var y;return ' + arg.toJS())(params, alasql);
            });
        }
        if (this.engineid) {
            var res = alasql.engines[this.engineid].createDatabase(
                this.databaseid,
                this.args,
                this.ifnotexists,
                this.as,
                cb
            );
            return res;
        } else {
            var dbid = this.databaseid;
            if (alasql.databases[dbid]) {
                throw new Error("Database '" + dbid + "' already exists");
            }
            var a = new alasql.Database(dbid);
            var res = 1;
            if (cb) return cb(res);
            return res;
        }
    };

// CREATE DATABASE databaseid
    yy.AttachDatabase = function(params) {
        return yy.extend(this, params);
    };
    yy.AttachDatabase.prototype.toString = function(args) {
        var s = 'ATTACH';
        if (this.engineid) s += ' ' + this.engineid;
        s += ' DATABASE' + ' ' + this.databaseid;
        // TODO add params
        if (args) {
            s += '(';
            if (args.length > 0) {
                s += args
                    .map(function(arg) {
                        return arg.toString();
                    })
                    .join(', ');
            }
            s += ')';
        }
        if (this.as) s += ' AS' + ' ' + this.as;
        return s;
    };
//yy.CreateDatabase.prototype.compile = returnUndefined;
    yy.AttachDatabase.prototype.execute = function(databaseid, params, cb) {
        if (!alasql.engines[this.engineid]) {
            throw new Error('Engine "' + this.engineid + '" is not defined.');
        }
        var res = alasql.engines[this.engineid].attachDatabase(
            this.databaseid,
            this.as,
            this.args,
            params,
            cb
        );
        return res;
    };

// CREATE DATABASE databaseid
    yy.DetachDatabase = function(params) {
        return yy.extend(this, params);
    };
    yy.DetachDatabase.prototype.toString = function() {
        var s = 'DETACH';
        s += ' DATABASE' + ' ' + this.databaseid;
        return s;
    };
//yy.CreateDatabase.prototype.compile = returnUndefined;
    yy.DetachDatabase.prototype.execute = function(databaseid, params, cb) {
        if (!alasql.databases[this.databaseid].engineid) {
            throw new Error(
                'Cannot detach database "' + this.engineid + '", because it was not attached.'
            );
        }
        var res;

        var dbid = this.databaseid;

        if (dbid === alasql.DEFAULTDATABASEID) {
            throw new Error('Drop of default database is prohibited');
        }

        if (!alasql.databases[dbid]) {
            if (!this.ifexists) {
                throw new Error("Database '" + dbid + "' does not exist");
            } else {
                res = 0;
            }
        } else {
            delete alasql.databases[dbid];
            if (dbid === alasql.useid) {
                alasql.use();
            }
            res = 1;
        }
        if (cb) cb(res);
        return res;
        //	var res = alasql.engines[this.engineid].attachDatabase(this.databaseid, this.as, cb);
        //	return res;
    };

// USE DATABSE databaseid
// USE databaseid
    yy.UseDatabase = function(params) {
        return yy.extend(this, params);
    };
    yy.UseDatabase.prototype.toString = function() {
        return 'USE' + ' ' + 'DATABASE' + ' ' + this.databaseid;
    };
//yy.UseDatabase.prototype.compile = returnUndefined;
    yy.UseDatabase.prototype.execute = function(databaseid, params, cb) {
        var dbid = this.databaseid;
        if (!alasql.databases[dbid]) {
            throw new Error("Database '" + dbid + "' does not exist");
        }
        alasql.use(dbid);
        var res = 1;
        if (cb) cb(res);
        return res;
    };

// DROP DATABASE databaseid
    yy.DropDatabase = function(params) {
        return yy.extend(this, params);
    };
    yy.DropDatabase.prototype.toString = function() {
        var s = 'DROP';
        if (this.ifexists) s += ' IF EXISTS';
        s += ' DATABASE ' + this.databaseid;
        return s;
    };
//yy.DropDatabase.prototype.compile = returnUndefined;
    yy.DropDatabase.prototype.execute = function(databaseid, params, cb) {
        if (this.engineid) {
            return alasql.engines[this.engineid].dropDatabase(this.databaseid, this.ifexists, cb);
        }
        var res;

        var dbid = this.databaseid;

        if (dbid === alasql.DEFAULTDATABASEID) {
            throw new Error('Drop of default database is prohibited');
        }
        if (!alasql.databases[dbid]) {
            if (!this.ifexists) {
                throw new Error("Database '" + dbid + "' does not exist");
            } else {
                res = 0;
            }
        } else {
            if (alasql.databases[dbid].engineid) {
                throw new Error(
                    "Cannot drop database '" + dbid + "', because it is attached. Detach it."
                );
            }

            delete alasql.databases[dbid];
            if (dbid === alasql.useid) {
                alasql.use();
            }
            res = 1;
        }
        if (cb) cb(res);
        return res;
    };

    /*
     //
     // SET for Alasql.js
     // Date: 01.12.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Declare = function(params) {
        return yy.extend(this, params);
    };
    yy.Declare.prototype.toString = function() {
        var s = 'DECLARE ';
        if (this.declares && this.declares.length > 0) {
            s = this.declares
                .map(function(declare) {
                    var s = '';
                    s += '@' + declare.variable + ' ';
                    s += declare.dbtypeid;
                    if (this.dbsize) {
                        s += '(' + this.dbsize;
                        if (this.dbprecision) {
                            s += ',' + this.dbprecision;
                        }
                        s += ')';
                    }
                    if (declare.expression) {
                        s += ' = ' + declare.expression.toString();
                    }
                    return s;
                })
                .join(',');
        }
        return s;
    };

    yy.Declare.prototype.execute = function(databaseid, params, cb) {
        var res = 1;
        if (this.declares && this.declares.length > 0) {
            this.declares.map(function(declare) {
                var dbtypeid = declare.dbtypeid;
                if (!alasql.fn[dbtypeid]) {
                    dbtypeid = dbtypeid.toUpperCase();
                }
                alasql.declares[declare.variable] = {
                    dbtypeid: dbtypeid,
                    dbsize: declare.dbsize,
                    dbprecision: declare.dbprecision,
                };

                // Set value
                if (declare.expression) {

                    alasql.vars[declare.variable] = new Function(
                        'params,alasql',
                        'return ' + declare.expression.toJS('({})', '', null)
                    )(params, alasql);
                    if (alasql.declares[declare.variable]) {
                        alasql.vars[declare.variable] = alasql.stdfn.CONVERT(
                            alasql.vars[declare.variable],
                            alasql.declares[declare.variable]
                        );
                    }
                }
            });
        }
        if (cb) {
            res = cb(res);
        }
        return res;
    };

    /*
     //
     // SHOW for Alasql.js
     // Date: 19.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.ShowDatabases = function(params) {
        return yy.extend(this, params);
    };
    yy.ShowDatabases.prototype.toString = function() {
        var s = 'SHOW DATABASES';
        if (this.like) s += 'LIKE ' + this.like.toString();
        return s;
    };
    yy.ShowDatabases.prototype.execute = function(databaseid, params, cb) {
        if (this.engineid) {
            return alasql.engines[this.engineid].showDatabases(this.like, cb);
        } else {
            var self = this;
            var res = [];
            for (var dbid in alasql.databases) {
                res.push({databaseid: dbid});
            }
            if (self.like && res && res.length > 0) {
                res = res.filter(function(d) {
                    //				return d.databaseid.match(new RegExp((self.like.value||'').replace(/\%/g,'.*').replace(/\?|_/g,'.'),'g'));
                    return alasql.utils.like(self.like.value, d.databaseid);
                });
            }
            if (cb) cb(res);
            return res;
        }
    };

    yy.ShowTables = function(params) {
        return yy.extend(this, params);
    };
    yy.ShowTables.prototype.toString = function() {
        var s = 'SHOW TABLES';
        if (this.databaseid) s += ' FROM ' + this.databaseid;
        if (this.like) s += ' LIKE ' + this.like.toString();
        return s;
    };
    yy.ShowTables.prototype.execute = function(databaseid, params, cb) {
        var db = alasql.databases[this.databaseid || databaseid];

        var self = this;
        var res = [];
        for (var tableid in db.tables) {
            res.push({tableid: tableid});
        }
        if (self.like && res && res.length > 0) {
            res = res.filter(function(d) {
                //return d.tableid.match(new RegExp((self.like.value||'').replace(/\%/g,'.*').replace(/\?|_/g,'.'),'g'));
                return alasql.utils.like(self.like.value, d.tableid);
            });
        }
        if (cb) cb(res);
        return res;
    };

    yy.ShowColumns = function(params) {
        return yy.extend(this, params);
    };
    yy.ShowColumns.prototype.toString = function() {
        var s = 'SHOW COLUMNS';
        if (this.table.tableid) s += ' FROM ' + this.table.tableid;
        if (this.databaseid) s += ' FROM ' + this.databaseid;
        return s;
    };

    yy.ShowColumns.prototype.execute = function(databaseid, params, cb) {
        var db = alasql.databases[this.databaseid || databaseid];
        var table = db.tables[this.table.tableid];

        if (table && table.columns) {
            var res = table.columns.map(function(col) {
                return {columnid: col.columnid, dbtypeid: col.dbtypeid, dbsize: col.dbsize};
            });
            if (cb) cb(res);
            return res;
        } else {
            if (cb) cb([]);
            return [];
        }
    };

    yy.ShowIndex = function(params) {
        return yy.extend(this, params);
    };
    yy.ShowIndex.prototype.toString = function() {
        var s = 'SHOW INDEX';
        if (this.table.tableid) s += ' FROM ' + this.table.tableid;
        if (this.databaseid) s += ' FROM ' + this.databaseid;
        return s;
    };
    yy.ShowIndex.prototype.execute = function(databaseid, params, cb) {
        var db = alasql.databases[this.databaseid || databaseid];
        var table = db.tables[this.table.tableid];
        var res = [];
        if (table && table.indices) {
            for (var ind in table.indices) {
                res.push({hh: ind, len: Object.keys(table.indices[ind]).length});
            }
        }

        if (cb) cb(res);
        return res;
    };

    yy.ShowCreateTable = function(params) {
        return yy.extend(this, params);
    };
    yy.ShowCreateTable.prototype.toString = function() {
        var s = 'SHOW CREATE TABLE ' + this.table.tableid;
        if (this.databaseid) s += ' FROM ' + this.databaseid;
        return s;
    };
    yy.ShowCreateTable.prototype.execute = function(databaseid) {
        var db = alasql.databases[this.databaseid || databaseid];
        var table = db.tables[this.table.tableid];
        if (table) {
            var s = 'CREATE TABLE ' + this.table.tableid + ' (';
            var ss = [];
            if (table.columns) {
                table.columns.forEach(function(col) {
                    var a = col.columnid + ' ' + col.dbtypeid;
                    if (col.dbsize) a += '(' + col.dbsize + ')';
                    if (col.primarykey) a += ' PRIMARY KEY';
                    // TODO extend
                    ss.push(a);
                });
                s += ss.join(', ');
            }
            s += ')';
            return s;
        } else {
            throw new Error('There is no such table "' + this.table.tableid + '"');
        }
    };

    /*
     //
     // SET for Alasql.js
     // Date: 01.12.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.SetVariable = function(params) {
        return yy.extend(this, params);
    };
    yy.SetVariable.prototype.toString = function() {
        var s = 'SET ';
        if (typeof this.value != 'undefined')
            s += this.variable.toUpperCase() + ' ' + (this.value ? 'ON' : 'OFF');
        if (this.expression) s += this.method + this.variable + ' = ' + this.expression.toString();
        return s;
    };

    yy.SetVariable.prototype.execute = function(databaseid, params, cb) {

        if (typeof this.value != 'undefined') {
            var val = this.value;
            if (val == 'ON') val = true;
            else if (val == 'OFF') val = false;
            //		if(this.method == '@') {
            alasql.options[this.variable] = val;
            //		} else {
            //			params[this.variable] = val;
            //		}
        } else if (this.expression) {
            if (this.exists) {
                this.existsfn = this.exists.map(function(ex) {
                    var nq = ex.compile(databaseid);
                    if (nq.query && !nq.query.modifier) nq.query.modifier = 'RECORDSET';
                    return nq;
                    //				return ex.compile(databaseid);
                    // TODO Include modifier
                });
            }
            if (this.queries) {
                this.queriesfn = this.queries.map(function(q) {
                    var nq = q.compile(databaseid);
                    if (nq.query && !nq.query.modifier) nq.query.modifier = 'RECORDSET';
                    return nq;
                    // TODO Include modifier
                });
            }

            var res = new Function(
                'params,alasql',
                'return ' + this.expression.toJS('({})', '', null)
            ).bind(this)(params, alasql);
            if (alasql.declares[this.variable]) {
                res = alasql.stdfn.CONVERT(res, alasql.declares[this.variable]);
            }
            if (this.props && this.props.length > 0) {
                if (this.method == '@') {
                    var fs = "alasql.vars['" + this.variable + "']";
                } else {
                    var fs = "params['" + this.variable + "']";
                }
                fs += this.props
                    .map(function(prop) {
                        if (typeof prop == 'string') {
                            return "['" + prop + "']";
                        } else if (typeof prop == 'number') {
                            return '[' + prop + ']';
                        } else {

                            return '[' + prop.toJS() + ']';
                            //				} else {

                            //					throw new Error('Wrong SET property');
                        }
                    })
                    .join();

                new Function('value,params,alasql', 'var y;' + fs + '=value')(res, params, alasql);
            } else {
                if (this.method == '@') {
                    alasql.vars[this.variable] = res;
                } else {
                    params[this.variable] = res;
                }
            }
        }
        var res = 1;
        if (cb) res = cb(res);
        return res;
    };

// Console functions

    /* global alasql, yy */

    alasql.test = function(name, times, fn) {
        if (arguments.length === 0) {
            alasql.log(alasql.con.results);
            return;
        }

        var tm = Date.now();

        if (arguments.length === 1) {
            fn();
            alasql.con.log(Date.now() - tm);
            return;
        }

        if (arguments.length === 2) {
            fn = times;
            times = 1;
        }

        for (var i = 0; i < times; i++) {
            fn();
        }
        alasql.con.results[name] = Date.now() - tm;
    };

// Console
// alasql.log = function(sql, params) {

// };

    /* global alasql, yy, utils */

// Console
    alasql.log = function(sql, params) {
        var olduseid = alasql.useid;
        var target = alasql.options.logtarget;
        // For node other
        if (utils.isNode) {
            target = 'console';
        }

        var res;
        if (typeof sql === 'string') {
            res = alasql(sql, params);
        } else {
            res = sql;
        }

        // For Node and console.output
        if (target === 'console' || utils.isNode) {
            if (typeof sql === 'string' && alasql.options.logprompt) {
                console.log(olduseid + '>', sql);
            }

            if (Array.isArray(res)) {
                if (console.table) {
                    // For Chrome and other consoles
                    console.table(res);
                } else {
                    // Add print procedure
                    console.log(JSONtoString(res));
                }
            } else {
                console.log(JSONtoString(res));
            }
        } else {
            var el;
            if (target === 'output') {
                el = document.getElementsByTagName('output')[0];
            } else {
                if (typeof target === 'string') {
                    el = document.getElementById(target);
                } else {
                    // in case of DOM
                    el = target;
                }
            }

            var s = '';

            if (typeof sql === 'string' && alasql.options.logprompt) {
                //			s += '<p>'+olduseid+'&gt;&nbsp;'+alasql.pretty(sql)+'</p>';
                s += '<pre><code>' + alasql.pretty(sql) + '</code></pre>';
            }

            if (Array.isArray(res)) {
                if (res.length === 0) {
                    s += '<p>[ ]</p>';
                } else if (typeof res[0] !== 'object' || Array.isArray(res[0])) {
                    for (var i = 0, ilen = res.length; i < ilen; i++) {
                        s += '<p>' + loghtml(res[i]) + '</p>';
                    }
                } else {
                    s += loghtml(res);
                }
            } else {
                s += loghtml(res);
            }
            el.innerHTML += s;
        }
    };

    alasql.clear = function() {
        var target = alasql.options.logtarget;
        // For node other

        if (utils.isNode || utils.isMeteorServer) {
            if (console.clear) {
                console.clear();
            }
        } else {
            var el;
            if (target === 'output') {
                el = document.getElementsByTagName('output')[0];
            } else {
                if (typeof target === 'string') {
                    el = document.getElementById(target);
                } else {
                    // in case of DOM
                    el = target;
                }
            }
            el.innerHTML = '';
        }
    };

    alasql.write = function(s) {

        var target = alasql.options.logtarget;
        // For node other
        if (utils.isNode || utils.isMeteorServer) {
            if (console.log) {
                console.log(s);
            }
        } else {
            var el;
            if (target === 'output') {
                el = document.getElementsByTagName('output')[0];
            } else {
                if (typeof target === 'string') {
                    el = document.getElementById(target);
                } else {
                    // in case of DOM
                    el = target;
                }
            }
            el.innerHTML += s;
        }
    };

    function loghtml(res) {

        var s = '';
        if (res === undefined) {
            s += 'undefined';
        } else if (Array.isArray(res)) {
            s += '<style>';
            s += 'table {border:1px black solid; border-collapse: collapse; border-spacing: 0px;}';
            s += 'td,th {border:1px black solid; padding-left:5px; padding-right:5px}';
            s += 'th {background-color: #EEE}';
            s += '</style>';
            s += '<table>';
            var cols = [];
            for (var colid in res[0]) {
                cols.push(colid);
            }
            s += '<tr><th>#';
            cols.forEach(function(colid) {
                s += '<th>' + colid;
            });
            for (var i = 0, ilen = res.length; i < ilen; i++) {
                s += '<tr><th>' + (i + 1);
                cols.forEach(function(colid) {
                    s += '<td> ';
                    if (res[i][colid] == +res[i][colid]) {
                        // jshint ignore:line
                        s += '<div style="text-align:right">';
                        if (typeof res[i][colid] === 'undefined') {
                            s += 'NULL';
                        } else {
                            s += res[i][colid];
                        }
                        s += '</div>';
                    } else {
                        if (typeof res[i][colid] === 'undefined') {
                            s += 'NULL';
                        } else if (typeof res[i][colid] === 'string') {
                            s += res[i][colid];
                        } else {
                            s += JSONtoString(res[i][colid]);
                        }
                        //					s += res[i][colid];
                    }
                });
            }

            s += '</table>';
        } else {
            s += '<p>' + JSONtoString(res) + '</p>';
        }
        // if() {}

        // 		if(typeof res == 'object') {
        // 			s += '<p>'+JSON.stringify(res)+'</p>';
        // 		} else {
        // 		}
        return s;
    }

    function scrollTo(element, to, duration) {
        if (duration <= 0) {
            return;
        }
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;

        setTimeout(function() {
            if (element.scrollTop === to) {
                return;
            }
            element.scrollTop = element.scrollTop + perTick;
            scrollTo(element, to, duration - 10);
        }, 10);
    }

    alasql.prompt = function(el, useidel, firstsql) {
        if (utils.isNode) {
            throw new Error('The prompt not realized for Node.js');
        }

        var prompti = 0;

        if (typeof el === 'string') {
            el = document.getElementById(el);
        }

        if (typeof useidel === 'string') {
            useidel = document.getElementById(useidel);
        }

        useidel.textContent = alasql.useid;

        if (firstsql) {
            alasql.prompthistory.push(firstsql);
            prompti = alasql.prompthistory.length;
            try {
                var tm = Date.now();
                alasql.log(firstsql);
                alasql.write('<p style="color:blue">' + (Date.now() - tm) + ' ms</p>');
            } catch (err) {
                alasql.write('<p>' + olduseid + '&gt;&nbsp;<b>' + sql + '</b></p>');
                alasql.write('<p style="color:red">' + err + '<p>');
            }
        }

        var y = el.getBoundingClientRect().top + document.getElementsByTagName('body')[0].scrollTop;
        scrollTo(document.getElementsByTagName('body')[0], y, 500);

        el.onkeydown = function(event) {
            if (event.which === 13) {
                var sql = el.value;
                var olduseid = alasql.useid;
                el.value = '';
                alasql.prompthistory.push(sql);
                prompti = alasql.prompthistory.length;
                try {
                    var tm = Date.now();
                    alasql.log(sql);
                    alasql.write('<p style="color:blue">' + (Date.now() - tm) + ' ms</p>');
                } catch (err) {
                    alasql.write('<p>' + olduseid + '&gt;&nbsp;' + alasql.pretty(sql, false) + '</p>');
                    alasql.write('<p style="color:red">' + err + '<p>');
                }
                el.focus();

                useidel.textContent = alasql.useid;
                var y =
                    el.getBoundingClientRect().top + document.getElementsByTagName('body')[0].scrollTop;
                scrollTo(document.getElementsByTagName('body')[0], y, 500);
            } else if (event.which === 38) {
                prompti--;
                if (prompti < 0) {
                    prompti = 0;
                }
                if (alasql.prompthistory[prompti]) {
                    el.value = alasql.prompthistory[prompti];
                    event.preventDefault();
                }
            } else if (event.which === 40) {
                prompti++;
                if (prompti >= alasql.prompthistory.length) {
                    prompti = alasql.prompthistory.length;
                    el.value = '';
                } else if (alasql.prompthistory[prompti]) {
                    el.value = alasql.prompthistory[prompti];
                    event.preventDefault();
                }
            }
        };
    };

    /*
     //
     // Commit for Alasql.js
     // Date: 01.12.2014
     // (c) 2014, Andrey Gershun
     //
     */
    yy.BeginTransaction = function(params) {
        return yy.extend(this, params);
    };
    yy.BeginTransaction.prototype.toString = function() {
        return 'BEGIN TRANSACTION';
    };

    yy.BeginTransaction.prototype.execute = function(databaseid, params, cb) {
        var res = 1;
        if (alasql.databases[databaseid].engineid) {
            return alasql.engines[alasql.databases[alasql.useid].engineid].begin(databaseid, cb);
        } else {
            // alasql commit!!!
        }
        if (cb) cb(res);
        return res;
    };

    yy.CommitTransaction = function(params) {
        return yy.extend(this, params);
    };
    yy.CommitTransaction.prototype.toString = function() {
        return 'COMMIT TRANSACTION';
    };

    yy.CommitTransaction.prototype.execute = function(databaseid, params, cb) {
        var res = 1;
        if (alasql.databases[databaseid].engineid) {
            return alasql.engines[alasql.databases[alasql.useid].engineid].commit(databaseid, cb);
        } else {
            // alasql commit!!!
        }
        if (cb) cb(res);
        return res;
    };

    yy.RollbackTransaction = function(params) {
        return yy.extend(this, params);
    };
    yy.RollbackTransaction.prototype.toString = function() {
        return 'ROLLBACK TRANSACTION';
    };

    yy.RollbackTransaction.prototype.execute = function(databaseid, params, cb) {
        var res = 1;
        if (alasql.databases[databaseid].engineid) {
            return alasql.engines[alasql.databases[databaseid].engineid].rollback(databaseid, cb);
        } else {
            // alasql commit!!!
        }
        if (cb) cb(res);
        return res;
    };

    if (alasql.options.tsql) {
        //
        // Check tables and views
        // IF OBJECT_ID('dbo.Employees') IS NOT NULL
        //   DROP TABLE dbo.Employees;
        // IF OBJECT_ID('dbo.VSortedOrders', 'V') IS NOT NULL
        //   DROP VIEW dbo.VSortedOrders;

        alasql.stdfn.OBJECT_ID = function(name, type) {
            if (typeof type == 'undefined') type = 'T';
            type = type.toUpperCase();

            var sname = name.split('.');
            var dbid = alasql.useid;
            var objname = sname[0];
            if (sname.length == 2) {
                dbid = sname[0];
                objname = sname[1];
            }

            var tables = alasql.databases[dbid].tables;
            dbid = alasql.databases[dbid].databaseid;
            for (var tableid in tables) {
                if (tableid == objname) {
                    // TODO: What OBJECT_ID actually returns

                    if (tables[tableid].view && type == 'V') return dbid + '.' + tableid;
                    if (!tables[tableid].view && type == 'T') return dbid + '.' + tableid;
                    return undefined;
                }
            }

            return undefined;
        };
    }

    if (alasql.options.mysql) {
    }

    if (alasql.options.mysql || alasql.options.sqlite) {
        // Pseudo INFORMATION_SCHEMA function
        alasql.from.INFORMATION_SCHEMA = function(filename, opts, cb, idx, query) {
            if (filename == 'VIEWS' || filename == 'TABLES') {
                var res = [];
                for (var databaseid in alasql.databases) {
                    var tables = alasql.databases[databaseid].tables;
                    for (var tableid in tables) {
                        if (
                            (tables[tableid].view && filename == 'VIEWS') ||
                            (!tables[tableid].view && filename == 'TABLES')
                        ) {
                            res.push({TABLE_CATALOG: databaseid, TABLE_NAME: tableid});
                        }
                    }
                }
                if (cb) res = cb(res, idx, query);
                return res;
            }
            throw new Error('Unknown INFORMATION_SCHEMA table');
        };
    }

    if (alasql.options.postgres) {
    }

    if (alasql.options.oracle) {
    }

    if (alasql.options.sqlite) {
    }

//
// into functions
//
// (c) 2014 Andrey Gershun
//

    alasql.into.SQL = function(filename, opts, data, columns, cb) {
        var res;
        if (typeof filename === 'object') {
            opts = filename;
            filename = undefined;
        }
        var opt = {};
        alasql.utils.extend(opt, opts);
        if (typeof opt.tableid === 'undefined') {
            throw new Error('Table for INSERT TO is not defined.');
        }

        var s = '';
        if (columns.length === 0) {
            if (typeof data[0] === 'object') {
                columns = Object.keys(data[0]).map(function(columnid) {
                    return {columnid: columnid};
                });
            } else {
                // What should I do?
                // columns = [{columnid:"_"}];
            }
        }

        for (var i = 0, ilen = data.length; i < ilen; i++) {
            s += 'INSERT INTO ' + opts.tableid + '(';
            s += columns
                .map(function(col) {
                    return col.columnid;
                })
                .join(',');
            s += ') VALUES (';
            s += columns.map(function(col) {
                var val = data[i][col.columnid];
                if (col.typeid) {
                    if (
                        col.typeid === 'STRING' ||
                        col.typeid === 'VARCHAR' ||
                        col.typeid === 'NVARCHAR' ||
                        col.typeid === 'CHAR' ||
                        col.typeid === 'NCHAR'
                    ) {
                        val = "'" + escapeqq(val) + "'";
                    }
                } else {
                    if (typeof val == 'string') {
                        val = "'" + escapeqq(val) + "'";
                    }
                }
                return val;
            });
            s += ');\n';
        }
        //	if(filename === '') {
        //		res = s;
        //	} else {
        //		res = data.length;
        filename = alasql.utils.autoExtFilename(filename, 'sql', opts);
        res = alasql.utils.saveFile(filename, s);
        if (cb) {
            res = cb(res);
        }
        return res;
    };

    alasql.into.HTML = function(selector, opts, data, columns, cb) {
        var res = 1;
        if (typeof exports !== 'object') {
            var opt = {headers: true};
            alasql.utils.extend(opt, opts);

            var sel = document.querySelector(selector);
            if (!sel) {
                throw new Error('Selected HTML element is not found');
            }

            if (columns.length === 0) {
                if (typeof data[0] === 'object') {
                    columns = Object.keys(data[0]).map(function(columnid) {
                        return {columnid: columnid};
                    });
                } else {
                    // What should I do?
                    // columns = [{columnid:"_"}];
                }
            }

            var tbe = document.createElement('table');
            var thead = document.createElement('thead');
            tbe.appendChild(thead);
            if (opt.headers) {
                var tre = document.createElement('tr');
                for (var i = 0; i < columns.length; i++) {
                    var the = document.createElement('th');
                    the.textContent = columns[i].columnid;
                    tre.appendChild(the);
                }
                thead.appendChild(tre);
            }

            var tbody = document.createElement('tbody');
            tbe.appendChild(tbody);
            for (var j = 0; j < data.length; j++) {
                var tre = document.createElement('tr');
                for (var i = 0; i < columns.length; i++) {
                    var the = document.createElement('td');
                    the.textContent = data[j][columns[i].columnid];
                    tre.appendChild(the);
                }
                tbody.appendChild(tre);
            }
            alasql.utils.domEmptyChildren(sel);

            sel.appendChild(tbe);
        }
        if (cb) {
            res = cb(res);
        }
        return res;
    };

    alasql.into.JSON = function(filename, opts, data, columns, cb) {
        var res = 1;
        if (typeof filename === 'object') {
            opts = filename;
            filename = undefined;
        }
        var s = JSON.stringify(data);

        filename = alasql.utils.autoExtFilename(filename, 'json', opts);
        res = alasql.utils.saveFile(filename, s);
        if (cb) {
            res = cb(res);
        }
        return res;
    };

    alasql.into.TXT = function(filename, opts, data, columns, cb) {
        // If columns is empty
        if (columns.length === 0 && data.length > 0) {
            columns = Object.keys(data[0]).map(function(columnid) {
                return {columnid: columnid};
            });
        }
        // If one parameter
        if (typeof filename === 'object') {
            opts = filename;
            filename = undefined;
        }

        var res = data.length;
        var s = '';
        if (data.length > 0) {
            var key = columns[0].columnid;
            s += data
                .map(function(d) {
                    return d[key];
                })
                .join('\n');
        }

        //	 } else {
        //		if(utils.isNode) {
        //			process.stdout.write(s);
        //		} else {

        //		};
        //	 }
        filename = alasql.utils.autoExtFilename(filename, 'txt', opts);
        res = alasql.utils.saveFile(filename, s);
        if (cb) {
            res = cb(res);
        }
        return res;
    };

    alasql.into.TAB = alasql.into.TSV = function(filename, opts, data, columns, cb) {
        var opt = {};
        alasql.utils.extend(opt, opts);
        opt.separator = '\t';
        filename = alasql.utils.autoExtFilename(filename, 'tab', opts);
        opt.autoExt = false;
        return alasql.into.CSV(filename, opt, data, columns, cb);
    };

    alasql.into.CSV = function(filename, opts, data, columns, cb) {
        if (columns.length === 0 && data.length > 0) {
            columns = Object.keys(data[0]).map(function(columnid) {
                return {columnid: columnid};
            });
        }
        if (typeof filename === 'object') {
            opts = filename;
            filename = undefined;
        }

        var opt = {headers: true};
        //opt.separator = ',';
        opt.separator = ';';
        opt.quote = '"';

        opt.utf8Bom = true;
        if (opts && !opts.headers && typeof opts.headers !== 'undefined') {
            opt.utf8Bom = false;
        }

        alasql.utils.extend(opt, opts);
        var res = data.length;
        var s = opt.utf8Bom ? '\ufeff' : '';
        if (opt.headers) {
            s +=
                opt.quote +
                columns
                    .map(function(col) {
                        return col.columnid.trim();
                    })
                    .join(opt.quote + opt.separator + opt.quote) +
                opt.quote +
                '\r\n';
        }

        data.forEach(function(d) {
            s +=
                columns
                    .map(function(col) {
                        var s = d[col.columnid];
                        // escape the character wherever it appears in the field
                        if (opt.quote !== '') {
                            s = (s + '').replace(
                                new RegExp('\\' + opt.quote, 'g'),
                                opt.quote + opt.quote
                            );
                        }
                        //			if((s+"").indexOf(opt.separator) > -1 || (s+"").indexOf(opt.quote) > -1) s = opt.quote + s + opt.quote;

                        //Excel 2013 needs quotes around strings - thanks for _not_ complying with RFC for CSV
                        if (+s != s) {
                            // jshint ignore:line
                            s = opt.quote + s + opt.quote;
                        }

                        return s;
                    })
                    .join(opt.separator) + '\r\n';
        });

        filename = alasql.utils.autoExtFilename(filename, 'csv', opts);
        res = alasql.utils.saveFile(filename, s, null, {disableAutoBom: true});
        if (cb) {
            res = cb(res);
        }
        return res;
    };

//
// 831xl.js - Coloring Excel
// 18.04.2015
// Generate XLS file with colors and styles
// with Excel

    alasql.into.XLS = function(filename, opts, data, columns, cb) {
        // If filename is not defined then output to the result
        if (typeof filename == 'object') {
            opts = filename;
            filename = undefined;
        }

        // Set sheets
        var sheets = {};
        if (opts && opts.sheets) {
            sheets = opts.sheets;
        }

        // Default sheet
        var sheet = {headers: true};
        if (typeof sheets['Sheet1'] != 'undefined') {
            sheet = sheets[0];
        } else {
            if (typeof opts != 'undefined') {
                sheet = opts;
            }
        }

        // Set sheet name and default is 'Sheet1'
        if (typeof sheet.sheetid == 'undefined') {
            sheet.sheetid = 'Sheet1';
        }

        var s = toHTML();

        // File is ready to save
        filename = alasql.utils.autoExtFilename(filename, 'xls', opts);
        var res = alasql.utils.saveFile(filename, s);
        if (cb) res = cb(res);
        return res;

        function toHTML() {
            // Generate prologue
            var s =
                '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" \
		xmlns="http://www.w3.org/TR/REC-html40"><head> \
		<meta charset="utf-8" /> \
		<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets> ';

            // Worksheets
            s +=
                ' <x:ExcelWorksheet><x:Name>' +
                sheet.sheetid +
                '</x:Name><x:WorksheetOptions><x:DisplayGridlines/>     </x:WorksheetOptions> \
		</x:ExcelWorksheet>';

            s += '</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>';

            // Generate body
            s += '<body';
            if (typeof sheet.style != 'undefined') {
                s += ' style="';
                if (typeof sheet.style == 'function') {
                    s += sheet.style(sheet);
                } else {
                    s += sheet.style;
                }
                s += '"';
            }
            s += '>';
            s += '<table>';
            if (typeof sheet.caption != 'undefined') {
                var caption = sheet.caption;
                if (typeof caption == 'string') {
                    caption = {title: caption};
                }
                s += '<caption';
                if (typeof caption.style != 'undefined') {
                    s += ' style="';
                    if (typeof caption.style == 'function') {
                        s += caption.style(sheet, caption);
                    } else {
                        s += caption.style;
                    }
                    s += '" ';
                }
                s += '>';
                s += caption.title;
                s += '</caption>';
            }

            // Columns

            //		var columns = [];

            // If columns defined in sheet, then take them
            if (typeof sheet.columns != 'undefined') {
                columns = sheet.columns;
            } else {
                // Autogenerate columns if they are passed as parameters
                if (columns.length == 0 && data.length > 0) {
                    if (typeof data[0] == 'object') {
                        if (Array.isArray(data[0])) {
                            columns = data[0].map(function(d, columnidx) {
                                return {columnid: columnidx};
                            });
                        } else {
                            columns = Object.keys(data[0]).map(function(columnid) {
                                return {columnid: columnid};
                            });
                        }
                    }
                }
            }

            // Prepare columns
            columns.forEach(function(column, columnidx) {
                if (typeof sheet.column != 'undefined') {
                    extend(column, sheet.column);
                }

                if (typeof column.width == 'undefined') {
                    if (sheet.column && sheet.column.width != 'undefined') {
                        column.width = sheet.column.width;
                    } else {
                        column.width = '120px';
                    }
                }
                if (typeof column.width == 'number') column.width = column.width + 'px';
                if (typeof column.columnid == 'undefined') column.columnid = columnidx;
                if (typeof column.title == 'undefined') column.title = '' + column.columnid.trim();
                if (sheet.headers && Array.isArray(sheet.headers))
                    column.title = sheet.headers[columnidx];
            });

            // Set columns widths
            s += '<colgroups>';
            columns.forEach(function(column) {
                s += '<col style="width: ' + column.width + '"></col>';
            });
            s += '</colgroups>';

            // Headers
            if (sheet.headers) {
                s += '<thead>';
                s += '<tr>';

                // TODO: Skip columns to body

                // Headers
                columns.forEach(function(column, columnidx) {
                    s += '<th ';
                    // Column style
                    if (typeof column.style != 'undefined') {
                        s += ' style="';
                        if (typeof column.style == 'function') {
                            s += column.style(sheet, column, columnidx);
                        } else {
                            s += column.style;
                        }
                        s += '" ';
                    }
                    s += '>';

                    // Column title
                    if (typeof column.title != 'undefined') {
                        if (typeof column.title == 'function') {
                            s += column.title(sheet, column, columnidx);
                        } else {
                            s += column.title;
                        }
                    }
                    s += '</th>';
                });

                s += '</tr>';
                s += '</thead>';
            }

            s += '<tbody>';

            // TODO: Skip lines between header and body

            if (data && data.length > 0) {
                // TODO: Skip columns to body

                // Loop over data rows
                data.forEach(function(row, rowidx) {
                    // Limit number of rows on the sheet
                    if (rowidx > sheet.limit) return;
                    // Create row
                    s += '<tr';

                    var srow = {};
                    extend(srow, sheet.row);
                    if (sheet.rows && sheet.rows[rowidx]) {
                        extend(srow, sheet.rows[rowidx]);
                    }
                    // Row style fromdefault sheet
                    if (typeof srow != 'undefined') {
                        if (typeof srow.style != 'undefined') {
                            s += ' style="';
                            if (typeof srow.style == 'function') {
                                s += srow.style(sheet, row, rowidx);
                            } else {
                                s += srow.style;
                            }
                            s += '" ';
                        }
                    }
                    s += '>';
                    // Loop over columns
                    columns.forEach(function(column, columnidx) {
                        // Parameters
                        var cell = {};
                        extend(cell, sheet.cell);
                        extend(cell, srow.cell);
                        if (typeof sheet.column != 'undefined') {
                            extend(cell, sheet.column.cell);
                        }
                        extend(cell, column.cell);
                        if (sheet.cells && sheet.cells[rowidx] && sheet.cells[rowidx][columnidx]) {
                            extend(cell, sheet.cells[rowidx][columnidx]);
                        }

                        // Create value
                        var value = row[column.columnid];
                        if (typeof cell.value == 'function') {
                            value = cell.value(value, sheet, row, column, cell, rowidx, columnidx);
                        }

                        // Define cell type
                        var typeid = cell.typeid;
                        if (typeof typeid == 'function') {
                            typeid = typeid(value, sheet, row, column, cell, rowidx, columnidx);
                        }

                        if (typeof typeid == 'undefined') {
                            if (typeof value == 'number') typeid = 'number';
                            else if (typeof value == 'string') typeid = 'string';
                            else if (typeof value == 'boolean') typeid = 'boolean';
                            else if (typeof value == 'object') {
                                if (value instanceof Date) typeid = 'date';
                            }
                        }

                        var typestyle = '';

                        if (typeid == 'money') {
                            typestyle =
                                'mso-number-format:"\\#\\,\\#\\#0\\\\ _р_\\.";white-space:normal;';
                        } else if (typeid == 'number') {
                            typestyle = ' ';
                        } else if (typeid == 'date') {
                            typestyle = 'mso-number-format:"Short Date";';
                        } else {
                            // FOr other types is saved
                            if (opts.types && opts.types[typeid] && opts.types[typeid].typestyle) {
                                typestyle = opts.types[typeid].typestyle;
                            }
                        }

                        // TODO Replace with extend...
                        typestyle = typestyle || 'mso-number-format:"\\@";'; // Default type style

                        s += "<td style='" + typestyle + "' ";
                        if (typeof cell.style != 'undefined') {
                            s += ' style="';
                            if (typeof cell.style == 'function') {
                                s += cell.style(value, sheet, row, column, rowidx, columnidx);
                            } else {
                                s += cell.style;
                            }
                            s += '" ';
                        }
                        s += '>';

                        // TODO Replace with extend...
                        var format = cell.format;
                        if (typeof value == 'undefined') {
                            s += '';
                        } else if (typeof format != 'undefined') {
                            if (typeof format == 'function') {
                                s += format(value);
                            } else if (typeof format == 'string') {
                                s += value; // TODO - add string format
                            } else {
                                throw new Error('Unknown format type. Should be function or string');
                            }
                        } else {
                            if (typeid == 'number' || typeid == 'date') {
                                s += value.toString();
                            } else if (typeid == 'money') {
                                s += (+value).toFixed(2);
                            } else {
                                s += value;
                            }
                        }
                        s += '</td>';
                    });

                    s += '</tr>';
                });
            }

            s += '</tbody>';

            // Generate epilogue
            s += '</table>';
            s += '</body>';
            s += '</html>';

            return s;
        }

        // Style function
        function style(a) {
            var s = ' style="';
            if (a && typeof a.style != 'undefined') {
                s += a.style + ';';
            }
            s += '" ';
            return s;
        }
    };

    alasql.into.XLSXML = function(filename, opts, data, columns, cb) {
        opts = opts || {};

        // If filename is not defined then output to the result
        if (typeof filename == 'object') {
            opts = filename;
            filename = undefined;
        }

        // Set sheets
        var sheets = {};
        var sheetsdata;
        var sheetscolumns;
        if (opts && opts.sheets) {
            sheets = opts.sheets;
            // data and columns are already an array for the sheets
            sheetsdata = data;
            sheetscolumns = columns;
        } else {
            sheets.Sheet1 = opts;
            // wrapd ata and columns array for single sheet
            sheetsdata = [data];
            sheetscolumns = [columns];
        }

        // File is ready to save
        filename = alasql.utils.autoExtFilename(filename, 'xls', opts);
        var res = alasql.utils.saveFile(filename, toXML());
        if (cb) res = cb(res);
        return res;

        function toXML() {
            var s1 =
                '<?xml version="1.0"?> \
		<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" \
		 xmlns:o="urn:schemas-microsoft-com:office:office" \
		 xmlns:x="urn:schemas-microsoft-com:office:excel" \
		 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" \
		 xmlns:html="http://www.w3.org/TR/REC-html40"> \
		 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"> \
		 </DocumentProperties> \
		 <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office"> \
		  <AllowPNG/> \
		 </OfficeDocumentSettings> \
		 <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"> \
		  <ActiveSheet>0</ActiveSheet> \
		 </ExcelWorkbook> \
		 <Styles> \
		  <Style ss:ID="Default" ss:Name="Normal"> \
		   <Alignment ss:Vertical="Bottom"/> \
		   <Borders/> \
		   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="12" ss:Color="#000000"/> \
		   <Interior/> \
		   <NumberFormat/> \
		   <Protection/> \
		  </Style>';

            var s2 = ''; // for styles

            var s3 = ' </Styles>';

            var styles = {}; // hash based storage for styles
            var stylesn = 62; // First style

            // Generate style
            function hstyle(st) {
                // Prepare string
                var s = '';
                for (var key in st) {
                    s += '<' + key;
                    for (var attr in st[key]) {
                        s += ' ';
                        if (attr.substr(0, 2) == 'x:') {
                            s += attr;
                        } else {
                            s += 'ss:';
                        }
                        s += attr + '="' + st[key][attr] + '"';
                    }
                    s += '/>';
                }

                var hh = hash(s);
                // Store in hash
                if (styles[hh]) {
                } else {
                    styles[hh] = {styleid: stylesn};
                    s2 += '<Style ss:ID="s' + stylesn + '">';
                    s2 += s;
                    s2 += '</Style>';
                    stylesn++;
                }
                return 's' + styles[hh].styleid;
            }

            function values(obj) {
                try {
                    return Object.values(obj);
                } catch (e) {
                    // support for older runtimes
                    return Object.keys(obj).map(function(e) {
                        return obj[e];
                    });
                }
            }

            var sheetidx = 0;
            for (var sheetid in sheets) {
                var sheet = sheets[sheetid];
                var idx = typeof sheet.dataidx != 'undefined' ? sheet.dataidx : sheetidx++;
                var data = values(sheetsdata[idx]);
                // If columns defined in sheet, then take them
                var columns = undefined;
                if (typeof sheet.columns != 'undefined') {
                    columns = sheet.columns;
                } else {
                    // Autogenerate columns if they are passed as parameters
                    columns = sheetscolumns[idx];
                    if (columns === undefined || (columns.length == 0 && data.length > 0)) {
                        if (typeof data[0] == 'object') {
                            if (Array.isArray(data[0])) {
                                columns = data[0].map(function(d, columnidx) {
                                    return {columnid: columnidx};
                                });
                            } else {
                                columns = Object.keys(data[0]).map(function(columnid) {
                                    return {columnid: columnid};
                                });
                            }
                        }
                    }
                }

                // Prepare columns
                columns.forEach(function(column, columnidx) {
                    if (typeof sheet.column != 'undefined') {
                        extend(column, sheet.column);
                    }

                    if (typeof column.width == 'undefined') {
                        if (sheet.column && typeof sheet.column.width != 'undefined') {
                            column.width = sheet.column.width;
                        } else {
                            column.width = 120;
                        }
                    }
                    if (typeof column.width == 'number') column.width = column.width;
                    if (typeof column.columnid == 'undefined') column.columnid = columnidx;
                    if (typeof column.title == 'undefined') column.title = '' + column.columnid.trim();
                    if (sheet.headers && Array.isArray(sheet.headers))
                        column.title = sheet.headers[columnidx];
                });

                // Header
                s3 +=
                    '<Worksheet ss:Name="' +
                    sheetid +
                    '"> \
	  			<Table ss:ExpandedColumnCount="' +
                    columns.length +
                    '" ss:ExpandedRowCount="' +
                    ((sheet.headers ? 1 : 0) + Math.min(data.length, sheet.limit || data.length)) +
                    '" x:FullColumns="1" \
	   			x:FullRows="1" ss:DefaultColumnWidth="65" ss:DefaultRowHeight="15">';

                columns.forEach(function(column, columnidx) {
                    s3 +=
                        '<Column ss:Index="' +
                        (columnidx + 1) +
                        '" ss:AutoFitWidth="0" ss:Width="' +
                        column.width +
                        '"/>';
                });

                // Headers
                if (sheet.headers) {
                    s3 += '<Row ss:AutoFitHeight="0">';

                    // TODO: Skip columns to body

                    // Headers
                    columns.forEach(function(column, columnidx) {
                        s3 += '<Cell ';

                        if (typeof column.style != 'undefined') {
                            var st = {};
                            if (typeof column.style == 'function') {
                                extend(st, column.style(sheet, column, columnidx));
                            } else {
                                extend(st, column.style);
                            }
                            s3 += 'ss:StyleID="' + hstyle(st) + '"';
                        }

                        s3 += '><Data ss:Type="String">';

                        // Column title
                        if (typeof column.title != 'undefined') {
                            if (typeof column.title == 'function') {
                                s3 += column.title(sheet, column, columnidx);
                            } else {
                                s3 += column.title;
                            }
                        }
                        s3 += '</Data></Cell>';
                    });

                    s3 += '</Row>';
                }

                // Data
                if (data && data.length > 0) {
                    // Loop over data rows
                    data.forEach(function(row, rowidx) {
                        // Limit number of rows on the sheet
                        if (rowidx > sheet.limit) return;

                        // Extend row properties
                        var srow = {};
                        extend(srow, sheet.row);
                        if (sheet.rows && sheet.rows[rowidx]) {
                            extend(srow, sheet.rows[rowidx]);
                        }

                        s3 += '<Row ';

                        // Row style fromdefault sheet
                        if (typeof srow != 'undefined') {
                            var st = {};
                            if (typeof srow.style != 'undefined') {
                                if (typeof srow.style == 'function') {
                                    extend(st, srow.style(sheet, row, rowidx));
                                } else {
                                    extend(st, srow.style);
                                }
                                s3 += 'ss:StyleID="' + hstyle(st) + '"';
                            }
                        }

                        s3 += '>'; //'ss:AutoFitHeight="0">'

                        // Data
                        columns.forEach(function(column, columnidx) {
                            // Parameters
                            var cell = {};
                            extend(cell, sheet.cell);
                            extend(cell, srow.cell);
                            if (typeof sheet.column != 'undefined') {
                                extend(cell, sheet.column.cell);
                            }
                            extend(cell, column.cell);
                            if (sheet.cells && sheet.cells[rowidx] && sheet.cells[rowidx][columnidx]) {
                                extend(cell, sheet.cells[rowidx][columnidx]);
                            }

                            // Create value
                            var value = row[column.columnid];
                            if (typeof cell.value == 'function') {
                                value = cell.value(value, sheet, row, column, cell, rowidx, columnidx);
                            }

                            // Define cell type
                            var typeid = cell.typeid;
                            if (typeof typeid == 'function') {
                                typeid = typeid(value, sheet, row, column, cell, rowidx, columnidx);
                            }

                            if (typeof typeid == 'undefined') {
                                if (typeof value == 'number') typeid = 'number';
                                else if (typeof value == 'string') typeid = 'string';
                                else if (typeof value == 'boolean') typeid = 'boolean';
                                else if (typeof value == 'object') {
                                    if (value instanceof Date) typeid = 'date';
                                }
                            }

                            var Type = 'String';
                            if (typeid == 'number') Type = 'Number';
                            else if (typeid == 'date') Type = 'Date';
                            // TODO: What else?

                            // Prepare Data types styles
                            var typestyle = '';

                            if (typeid == 'money') {
                                typestyle =
                                    'mso-number-format:"\\#\\,\\#\\#0\\\\ _р_\\.";white-space:normal;';
                            } else if (typeid == 'number') {
                                typestyle = ' ';
                            } else if (typeid == 'date') {
                                typestyle = 'mso-number-format:"Short Date";';
                            } else {
                                // For other types is saved
                                if (opts.types && opts.types[typeid] && opts.types[typeid].typestyle) {
                                    typestyle = opts.types[typeid].typestyle;
                                }
                            }

                            // TODO Replace with extend...
                            typestyle = typestyle || 'mso-number-format:"\\@";'; // Default type style

                            s3 += '<Cell ';

                            // Row style fromdefault sheet
                            var st = {};
                            if (typeof cell.style != 'undefined') {
                                if (typeof cell.style == 'function') {
                                    extend(
                                        st,
                                        cell.style(value, sheet, row, column, rowidx, columnidx)
                                    );
                                } else {
                                    extend(st, cell.style);
                                }
                                s3 += 'ss:StyleID="' + hstyle(st) + '"';
                            }

                            s3 += '>';

                            s3 += '<Data ss:Type="' + Type + '">';

                            // TODO Replace with extend...
                            var format = cell.format;
                            if (typeof value == 'undefined') {
                                s3 += '';
                            } else if (typeof format != 'undefined') {
                                if (typeof format == 'function') {
                                    s3 += format(value);
                                } else if (typeof format == 'string') {
                                    s3 += value; // TODO - add string format
                                } else {
                                    throw new Error(
                                        'Unknown format type. Should be function or string'
                                    );
                                }
                            } else {
                                if (typeid == 'number' || typeid == 'date') {
                                    s3 += value.toString();
                                } else if (typeid == 'money') {
                                    s3 += (+value).toFixed(2);
                                } else {
                                    s3 += value;
                                }
                            }

                            //			    		s3 += row[column.columnid];
                            s3 += '</Data></Cell>';
                        });

                        s3 += '</Row>';
                    });
                }
                // Finish
                s3 += '</Table></Worksheet>';
            }

            s3 += '</Workbook>';

            return s1 + s2 + s3;
        }
    };

    /**
     Export to XLSX function
     @function
     @param {string|object} filename Filename or options
     @param {object|undefined} opts Options or undefined
     @param {array} data Data
     @param {array} columns Columns
     @parab {callback} cb Callback function
     @return {number} Number of files processed
     */

    alasql.into.XLSX = function(filename, opts, data, columns, cb) {
        /** @type {number} result */
        var res = 1;

        if (deepEqual(columns, [{columnid: '_'}])) {
            data = data.map(function(dat) {
                return dat._;
            });
            columns = undefined;
            //		res = [{_:1}];
        } else {
            //		data = data1;
        }

        filename = alasql.utils.autoExtFilename(filename, 'xlsx', opts);

        var XLSX = getXLSX();

        /* If called without filename, use opts */
        if (typeof filename == 'object') {
            opts = filename;
            filename = undefined;
        }

        /** @type {object} Workbook */
        var wb = {SheetNames: [], Sheets: {}};

        // ToDo: check if cb must be treated differently here
        if (opts.sourcefilename) {
            alasql.utils.loadBinaryFile(opts.sourcefilename, !!cb, function(data) {
                wb = XLSX.read(data, {type: 'binary'});
                doExport();
            });
        } else {
            doExport();
        }

        /* Return result */
        if (cb) res = cb(res);
        return res;

        /**
         Export workbook
         @function
         */
        function doExport() {
            /*
             If opts is array of arrays then this is a
             multisheet workboook, else it is a singlesheet
             */
            if (typeof opts == 'object' && Array.isArray(opts)) {
                if (data && data.length > 0) {
                    data.forEach(function(dat, idx) {
                        prepareSheet(opts[idx], dat, undefined, idx + 1);
                    });
                }
            } else {
                prepareSheet(opts, data, columns, 1);
            }

            saveWorkbook(cb);
        }

        /**
         Prepare sheet
         @params {object} opts
         @params {array|object} data
         @params {array} columns Columns
         */
        function prepareSheet(opts, data, columns, idx) {
            /** Default options for sheet */
            var opt = {sheetid: 'Sheet ' + idx, headers: true};
            alasql.utils.extend(opt, opts);

            var dataLength = Object.keys(data).length;

            // Generate columns if they are not defined
            if ((!columns || columns.length == 0) && dataLength > 0) {
                columns = Object.keys(data[0]).map(function(columnid) {
                    return {columnid: columnid};
                });
            }

            var cells = {};

            if (wb.SheetNames.indexOf(opt.sheetid) > -1) {
                cells = wb.Sheets[opt.sheetid];
            } else {
                wb.SheetNames.push(opt.sheetid);
                wb.Sheets[opt.sheetid] = {};
                cells = wb.Sheets[opt.sheetid];
            }

            var range = 'A1';
            if (opt.range) range = opt.range;

            var col0 = alasql.utils.xlscn(range.match(/[A-Z]+/)[0]);
            var row0 = +range.match(/[0-9]+/)[0] - 1;

            if (wb.Sheets[opt.sheetid]['!ref']) {
                var rangem = wb.Sheets[opt.sheetid]['!ref'];
                var colm = alasql.utils.xlscn(rangem.match(/[A-Z]+/)[0]);
                var rowm = +rangem.match(/[0-9]+/)[0] - 1;
            } else {
                var colm = 1,
                    rowm = 1;
            }
            var colmax = Math.max(col0 + columns.length, colm);
            var rowmax = Math.max(row0 + dataLength + 2, rowm);

            var i = row0 + 1;

            wb.Sheets[opt.sheetid]['!ref'] = 'A1:' + alasql.utils.xlsnc(colmax) + rowmax;
            //		var i = 1;

            if (opt.headers) {
                columns.forEach(function(col, idx) {
                    cells[alasql.utils.xlsnc(col0 + idx) + '' + i] = {v: col.columnid.trim()};
                });
                i++;
            }

            for (var j = 0; j < dataLength; j++) {
                columns.forEach(function(col, idx) {
                    var cell = {v: data[j][col.columnid]};
                    if (typeof data[j][col.columnid] == 'number') {
                        cell.t = 'n';
                    } else if (typeof data[j][col.columnid] == 'string') {
                        cell.t = 's';
                    } else if (typeof data[j][col.columnid] == 'boolean') {
                        cell.t = 'b';
                    } else if (typeof data[j][col.columnid] == 'object') {
                        if (data[j][col.columnid] instanceof Date) {
                            cell.t = 'd';
                        }
                    }
                    cells[alasql.utils.xlsnc(col0 + idx) + '' + i] = cell;
                });
                i++;
            }
        }

        /**
         Save Workbook
         @params {array} wb Workbook
         @params {callback} cb Callback
         */
        function saveWorkbook(cb) {

            var XLSX;

            if (typeof filename == 'undefined') {
                res = wb;
            } else {
                XLSX = getXLSX();

                if (utils.isNode || utils.isMeteorServer) {
                    XLSX.writeFile(wb, filename);
                } else {
                    var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
                    var wbout = XLSX.write(wb, wopts);

                    function s2ab(s) {
                        var buf = new ArrayBuffer(s.length);
                        var view = new Uint8Array(buf);
                        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
                        return buf;
                    }

                    /* the saveAs call downloads a file on the local machine */
                    //				saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), '"'+filename+'"')
                    //				saveAs(new Blob([s2ab(wbout)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}), filename)
                    //				saveAs(new Blob([s2ab(wbout)],{type:"application/vnd.ms-excel"}), '"'+filename+'"');
                    if (isIE() == 9) {
                        throw new Error(
                            'Cannot save XLSX files in IE9. Please use XLS() export function'
                        );
                        //					var URI = 'data:text/plain;charset=utf-8,';

                        /** @todo Check if this code is required */

                        //					alert('ie9');
                    } else {
                        saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), filename);
                    }
                }
            }

        }
    };

    /*
     //
     // FROM functions Alasql.js
     // Date: 11.12.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /**
     Meteor
     */

    /* global alasql Tabletop document Event */

    alasql.from.METEOR = function(filename, opts, cb, idx, query) {
        var res = filename.find(opts).fetch();
        if (cb) {
            res = cb(res, idx, query);
        }
        return res;
    };

    /**
     Google Spreadsheet reader
     */
    alasql.from.TABLETOP = function(key, opts, cb, idx, query) {
        var res = [];

        var opt = {headers: true, simpleSheet: true, key: key};
        alasql.utils.extend(opt, opts);
        opt.callback = function(data) {
            res = data;
            if (cb) {
                res = cb(res, idx, query);
            }
        };

        Tabletop.init(opt);
        return null;
    };

    alasql.from.HTML = function(selector, opts, cb, idx, query) {
        var opt = {};
        alasql.utils.extend(opt, opts);

        var sel = document.querySelector(selector);
        if (!sel && sel.tagName !== 'TABLE') {
            throw new Error('Selected HTML element is not a TABLE');
        }

        var res = [];
        var headers = opt.headers;

        if (headers && !Array.isArray(headers)) {
            headers = [];
            var ths = sel.querySelector('thead tr').children;
            for (var i = 0; i < ths.length; i++) {
                if (
                    !(ths.item(i).style && ths.item(i).style.display === 'none' && opt.skipdisplaynone)
                ) {
                    headers.push(ths.item(i).textContent);
                } else {
                    headers.push(undefined);
                }
            }
        }

        var trs = sel.querySelectorAll('tbody tr');

        for (var j = 0; j < trs.length; j++) {
            var tds = trs.item(j).children;
            var r = {};
            for (i = 0; i < tds.length; i++) {
                if (
                    !(tds.item(i).style && tds.item(i).style.display === 'none' && opt.skipdisplaynone)
                ) {
                    if (headers) {
                        r[headers[i]] = tds.item(i).textContent;
                    } else {
                        r[i] = tds.item(i).textContent;

                    }
                }
            }
            res.push(r);
        }

        if (cb) {
            res = cb(res, idx, query);
        }
        return res;
    };

    alasql.from.RANGE = function(start, finish, cb, idx, query) {
        var res = [];
        for (var i = start; i <= finish; i++) {
            res.push(i);
        }
        //	res = new alasql.Recordset({data:res,columns:{columnid:'_'}});
        if (cb) {
            res = cb(res, idx, query);
        }
        return res;
    };

// Read data from any file
    alasql.from.FILE = function(filename, opts, cb, idx, query) {
        var fname;
        if (typeof filename === 'string') {
            fname = filename;
        } else if (filename instanceof Event) {
            fname = filename.target.files[0].name;
        } else {
            throw new Error('Wrong usage of FILE() function');
        }

        var parts = fname.split('.');

        var ext = parts[parts.length - 1].toUpperCase();

        if (alasql.from[ext]) {

            return alasql.from[ext](filename, opts, cb, idx, query);
        } else {
            throw new Error('Cannot recognize file type for loading');
        }
    };

// Read JSON file

    alasql.from.JSON = function(filename, opts, cb, idx, query) {
        var res;

        filename = alasql.utils.autoExtFilename(filename, 'json', opts);
        alasql.utils.loadFile(filename, !!cb, function(data) {

            //		res = [{a:1}];
            res = JSON.parse(data);
            if (cb) {
                res = cb(res, idx, query);
            }
        });
        return res;
    };

    alasql.from.TXT = function(filename, opts, cb, idx, query) {
        var res;
        filename = alasql.utils.autoExtFilename(filename, 'txt', opts);
        alasql.utils.loadFile(filename, !!cb, function(data) {
            res = data.split(/\r?\n/);

            // Remove last line if empty
            if (res[res.length - 1] === '') {
                res.pop();
            }
            for (var i = 0, ilen = res.length; i < ilen; i++) {
                // Please avoid '===' here
                if (res[i] == +res[i]) {
                    // eslint:ignore
                    // jshint ignore:line
                    res[i] = +res[i];
                }
                res[i] = [res[i]];
            }
            if (cb) {
                res = cb(res, idx, query);
            }
        });
        return res;
    };

    alasql.from.TAB = alasql.from.TSV = function(filename, opts, cb, idx, query) {
        opts = opts || {};
        opts.separator = '\t';
        filename = alasql.utils.autoExtFilename(filename, 'tab', opts);
        opts.autoext = false;
        return alasql.from.CSV(filename, opts, cb, idx, query);
    };

    alasql.from.CSV = function(contents, opts, cb, idx, query) {
        var opt = {
            separator: ',',
            quote: '"',
            headers: true,
        };
        alasql.utils.extend(opt, opts);
        var res;
        var hs = [];
        function parseText(text) {
            var delimiterCode = opt.separator.charCodeAt(0);
            var quoteCode = opt.quote.charCodeAt(0);

            var EOL = {},
                EOF = {},
                rows = [],
                N = text.length,
                I = 0,
                n = 0,
                t,
                eol;
            function token() {
                if (I >= N) {
                    return EOF;
                }
                if (eol) {
                    return (eol = false, EOL);
                }
                var j = I;
                if (text.charCodeAt(j) === quoteCode) {
                    var i = j;
                    while (i++ < N) {
                        if (text.charCodeAt(i) === quoteCode) {
                            if (text.charCodeAt(i + 1) !== quoteCode) {
                                break;
                            }
                            ++i;
                        }
                    }
                    I = i + 2;
                    var c = text.charCodeAt(i + 1);
                    if (c === 13) {
                        eol = true;
                        if (text.charCodeAt(i + 2) === 10) {
                            ++I;
                        }
                    } else if (c === 10) {
                        eol = true;
                    }
                    return text.substring(j + 1, i).replace(/""/g, '"');
                }
                while (I < N) {
                    var c = text.charCodeAt(I++),
                        k = 1;
                    if (c === 10) {
                        eol = true;
                    } else if (c === 13) {
                        eol = true;
                        if (text.charCodeAt(I) === 10) {
                            ++I;
                            ++k;
                        }
                    } else if (c !== delimiterCode) {
                        continue;
                    }
                    return text.substring(j, I - k);
                }
                return text.substring(j);
            }

            while ((t = token()) !== EOF) {
                var a = [];
                while (t !== EOL && t !== EOF) {
                    a.push(t.trim());
                    t = token();
                }

                if (opt.headers) {
                    if (n === 0) {
                        if (typeof opt.headers === 'boolean') {
                            hs = a;
                        } else if (Array.isArray(opt.headers)) {
                            hs = opt.headers;
                            var r = {};
                            hs.forEach(function(h, idx) {
                                r[h] = a[idx];
                                // Please avoid === here
                                if (
                                    typeof r[h] !== 'undefined' &&
                                    r[h].length !== 0 &&
                                    r[h].trim() == +r[h]
                                ) {
                                    // jshint ignore:line
                                    r[h] = +r[h];
                                }
                            });
                            rows.push(r);
                        }
                    } else {
                        var r = {};
                        hs.forEach(function(h, idx) {
                            r[h] = a[idx];
                            if (
                                typeof r[h] !== 'undefined' &&
                                r[h].length !== 0 &&
                                r[h].trim() == +r[h]
                            ) {
                                // jshint ignore:line
                                r[h] = +r[h];
                            }
                        });
                        rows.push(r);
                    }
                    n++;
                } else {
                    rows.push(a);
                }
            }

            res = rows;

            if (opt.headers) {
                if (query && query.sources && query.sources[idx]) {
                    var columns = (query.sources[idx].columns = []);
                    hs.forEach(function(h) {
                        columns.push({columnid: h});
                    });
                }
            }

            if (cb) {
                res = cb(res, idx, query);
            }
        }
        if (new RegExp('\n').test(contents)) {
            parseText(contents);
        } else {
            contents = alasql.utils.autoExtFilename(contents, 'csv', opts);
            alasql.utils.loadFile(contents, !!cb, parseText, query.cb);
        }
        return res;
    };

    function XLSXLSX(X, filename, opts, cb, idx, query) {
        var opt = {};
        opts = opts || {};
        alasql.utils.extend(opt, opts);
        if (typeof opt.headers === 'undefined') {
            opt.headers = true;
        }
        var res;

        /**
         * see https://github.com/SheetJS/js-xlsx/blob/5ae6b1965bfe3764656a96f536b356cd1586fec7/README.md
         * for example of using readAsArrayBuffer under `Parsing Workbooks`
         */
        function fixdata(data) {
            var o = '',
                l = 0,
                w = 10240;
            for (; l < data.byteLength / w; ++l)
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
            return o;
        }
        function getHeaderText(text) {
            // if casesensitive option is set to false and there is a text value return lowercase value of text
            if (text && alasql.options.casesensitive === false) {
                return text.toLowerCase();
            } else {
                return text;
            }
        }
        filename = alasql.utils.autoExtFilename(filename, 'xls', opts);
        alasql.utils.loadBinaryFile(
            filename,
            !!cb,
            function(data) {
                //	function processData(data) {
                if (data instanceof ArrayBuffer) {
                    var arr = fixdata(data);
                    var workbook = X.read(btoa(arr), {type: 'base64'});
                } else {
                    var workbook = X.read(data, {type: 'binary'});
                }

                var sheetid;
                if (typeof opt.sheetid === 'undefined') {
                    sheetid = workbook.SheetNames[0];
                } else if (typeof opt.sheetid === 'number') {
                    sheetid = workbook.SheetNames[opt.sheetid];
                } else {
                    sheetid = opt.sheetid;
                }
                var range;
                var res = [];
                if (typeof opt.range === 'undefined') {
                    range = workbook.Sheets[sheetid]['!ref'];
                } else {
                    range = opt.range;
                    if (workbook.Sheets[sheetid][range]) {
                        range = workbook.Sheets[sheetid][range];
                    }
                }
                // if range has some value then data is present in the current sheet
                // else current sheet is empty
                if (range) {
                    var rg = range.split(':');
                    var col0 = rg[0].match(/[A-Z]+/)[0];
                    var row0 = +rg[0].match(/[0-9]+/)[0];
                    var col1 = rg[1].match(/[A-Z]+/)[0];
                    var row1 = +rg[1].match(/[0-9]+/)[0];

                    var hh = {};
                    var xlscnCol0 = alasql.utils.xlscn(col0);
                    var xlscnCol1 = alasql.utils.xlscn(col1);
                    for (var j = xlscnCol0; j <= xlscnCol1; j++) {
                        var col = alasql.utils.xlsnc(j);
                        if (opt.headers) {
                            if (workbook.Sheets[sheetid][col + '' + row0]) {
                                hh[col] = getHeaderText(workbook.Sheets[sheetid][col + '' + row0].v);
                            } else {
                                hh[col] = getHeaderText(col);
                            }
                        } else {
                            hh[col] = col;
                        }
                    }
                    if (opt.headers) {
                        row0++;
                    }
                    for (var i = row0; i <= row1; i++) {
                        var row = {};
                        for (var j = xlscnCol0; j <= xlscnCol1; j++) {
                            var col = alasql.utils.xlsnc(j);
                            if (workbook.Sheets[sheetid][col + '' + i]) {
                                row[hh[col]] = workbook.Sheets[sheetid][col + '' + i].v;
                            }
                        }
                        res.push(row);
                    }
                } else {
                    res.push([]);
                }

                // Remove last empty line (issue #548)
                if (
                    res.length > 0 &&
                    res[res.length - 1] &&
                    Object.keys(res[res.length - 1]).length == 0
                ) {
                    res.pop();
                }

                if (cb) {
                    res = cb(res, idx, query);
                }
            },
            function(err) {
                throw err;
            }
        );

        return res;
    }

    alasql.from.XLS = function(filename, opts, cb, idx, query) {
        opts = opts || {};
        filename = alasql.utils.autoExtFilename(filename, 'xls', opts);
        opts.autoExt = false;
        return XLSXLSX(getXLSX(), filename, opts, cb, idx, query);
    };

    alasql.from.XLSX = function(filename, opts, cb, idx, query) {
        opts = opts || {};
        filename = alasql.utils.autoExtFilename(filename, 'xlsx', opts);
        opts.autoExt = false;
        return XLSXLSX(getXLSX(), filename, opts, cb, idx, query);
    };

    alasql.from.ODS = function(filename, opts, cb, idx, query) {
        opts = opts || {};
        filename = alasql.utils.autoExtFilename(filename, 'ods', opts);
        opts.autoExt = false;
        return XLSXLSX(getXLSX(), filename, opts, cb, idx, query);
    };

    alasql.from.XML = function(filename, opts, cb, idx, query) {
        var res;

        alasql.utils.loadFile(filename, !!cb, function(data) {

            //    res = [{a:1}];

            res = xmlparse(data).root;

            if (cb) res = cb(res, idx, query);
        });
        return res;
    };

    /**
     * Parse the given string of `xml`.
     *
     * @param {String} xml
     * @return {Object}
     * @api public
     */

    function xmlparse(xml) {
        xml = xml.trim();

        // strip comments
        xml = xml.replace(/<!--[\s\S]*?-->/g, '');

        return document();

        /**
         * XML document.
         */

        function document() {
            return {
                declaration: declaration(),
                root: tag(),
            };
        }

        /**
         * Declaration.
         */

        function declaration() {
            var m = match(/^<\?xml\s*/);
            if (!m) return;

            // tag
            var node = {
                attributes: {},
            };

            // attributes
            while (!(eos() || is('?>'))) {
                var attr = attribute();
                if (!attr) return node;
                node.attributes[attr.name] = attr.value;
            }

            match(/\?>\s*/);

            return node;
        }

        /**
         * Tag.
         */

        function tag() {
            var m = match(/^<([\w-:.]+)\s*/);
            if (!m) return;

            // name
            var node = {
                name: m[1],
                attributes: {},
                children: [],
            };

            // attributes
            while (!(eos() || is('>') || is('?>') || is('/>'))) {
                var attr = attribute();
                if (!attr) return node;
                node.attributes[attr.name] = attr.value;
            }

            // self closing tag
            if (match(/^\s*\/>\s*/)) {
                return node;
            }

            match(/\??>\s*/);

            // content
            node.content = content();

            // children
            var child;
            while ((child = tag())) {
                node.children.push(child);
            }

            // closing
            match(/^<\/[\w-:.]+>\s*/);

            return node;
        }

        /**
         * Text content.
         */

        function content() {
            var m = match(/^([^<]*)/);
            if (m) return m[1];
            return '';
        }

        /**
         * Attribute.
         */

        function attribute() {
            var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
            if (!m) return;
            return {name: m[1], value: strip(m[2])};
        }

        /**
         * Strip quotes from `val`.
         */

        function strip(val) {
            return val.replace(/^['"]|['"]$/g, '');
        }

        /**
         * Match `re` and advance the string.
         */

        function match(re) {
            var m = xml.match(re);
            if (!m) return;
            xml = xml.slice(m[0].length);
            return m;
        }

        /**
         * End-of-source.
         */

        function eos() {
            return 0 == xml.length;
        }

        /**
         * Check for `prefix`.
         */

        function is(prefix) {
            return 0 == xml.indexOf(prefix);
        }
    }

    alasql.from.GEXF = function(filename, opts, cb, idx, query) {
        var res;
        alasql('SEARCH FROM XML(' + filename + ')', [], function(data) {
            res = data;

            if (cb) res = cb(res);
        });
        return res;
    };

    /*
     //
     // HELP for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* globals: alasql, yy */

    /**
     Print statement
     @class
     @param {object} params Initial setup properties
     */

    /* global alasql, yy */

    yy.Print = function(params) {
        return yy.extend(this, params);
    };

    /**
     Generate SQL string
     @this Print statement object
     */
    yy.Print.prototype.toString = function() {
        var s = 'PRINT';
        if (this.statement) s += ' ' + this.statement.toString();
        return s;
    };

    /**
     Print result of select statement or expression
     @param {string} databaseid Database identificator
     @param {object} params Query parameters
     @param {statement-callback} cb Callback function
     @this Print statement object
     */
    yy.Print.prototype.execute = function(databaseid, params, cb) {

        var self = this;
        var res = 1;

        alasql.precompile(this, databaseid, params); /** @todo Change from alasql to this */

        if (this.exprs && this.exprs.length > 0) {
            var rs = this.exprs.map(function(expr) {

                var exprfn = new Function(
                    'params,alasql,p',
                    'var y;return ' + expr.toJS('({})', '', null)
                ).bind(self);
                var r = exprfn(params, alasql);
                return JSONtoString(r);
            });
            console.log.apply(console, rs);
        } else if (this.select) {
            var r = this.select.execute(databaseid, params);
            console.log(JSONtoString(r));
        } else {
            console.log();
        }

        if (cb) res = cb(res);
        return res;
    };

    /*
     //
     // HELP for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Source = function(params) {
        return yy.extend(this, params);
    };
    yy.Source.prototype.toString = function() {
        var s = 'SOURCE';
        if (this.url) s += " '" + this.url + " '";
        return s;
    };

// SOURCE FILE
    yy.Source.prototype.execute = function(databaseid, params, cb) {

        var res;
        loadFile(
            this.url,
            !!cb,
            function(data) {

                //		res = 1;
                res = alasql(data);
                if (cb) res = cb(res);
                return res;
            },
            function(err) {
                throw err;
            }
        );
        return res;
    };

    /*
     //
     // HELP for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    /* global alasql, yy */

    yy.Require = function(params) {
        return yy.extend(this, params);
    };
    yy.Require.prototype.toString = function() {
        var s = 'REQUIRE';
        if (this.paths && this.paths.length > 0) {
            s += this.paths
                .map(function(path) {
                    return path.toString();
                })
                .join(',');
        }
        if (this.plugins && this.plugins.length > 0) {
            s += this.plugins
                .map(function(plugin) {
                    return plugin.toUpperCase();
                })
                .join(',');
        }
        return s;
    };

    /**
     Attach plug-in for Alasql
     */
    yy.Require.prototype.execute = function(databaseid, params, cb) {
        var self = this;
        var res = 0;
        var ss = '';

        if (this.paths && this.paths.length > 0) {
            this.paths.forEach(function(path) {
                loadFile(path.value, !!cb, function(data) {
                    res++;

                    ss += data;
                    if (res < self.paths.length) return;

                    new Function('params,alasql', ss)(params, alasql);
                    if (cb) res = cb(res);
                });
            });
        } else if (this.plugins && this.plugins.length > 0) {
            this.plugins.forEach(function(plugin) {
                // If plugin is not loaded already
                if (!alasql.plugins[plugin]) {
                    loadFile(alasql.path + '/alasql-' + plugin.toLowerCase() + '.js', !!cb, function(
                        data
                    ) {
                        // Execute all plugins at the same time
                        res++;
                        ss += data;
                        if (res < self.plugins.length) return;

                        new Function('params,alasql', ss)(params, alasql);
                        alasql.plugins[plugin] = true; // Plugin is loaded
                        if (cb) res = cb(res);
                    });
                }
            });
        } else {
            if (cb) res = cb(res);
        }
        return res;
    };

    /*
     //
     // HELP for Alasql.js
     // Date: 03.11.2014
     // (c) 2014, Andrey Gershun
     //
     */

    yy.Assert = function(params) {
        return yy.extend(this, params);
    };
    yy.Source.prototype.toString = function() {
        var s = 'ASSERT';
        if (this.value) s += ' ' + JSON.stringify(this.value);
        return s;
    };

// SOURCE FILE
    yy.Assert.prototype.execute = function(databaseid) {

        if (!deepEqual(alasql.res, this.value)) {
            //		if(this.message) {
            //			throw this.
            //		} else {
            throw new Error(
                (this.message || 'Assert wrong') +
                ': ' +
                JSON.stringify(alasql.res) +
                ' == ' +
                JSON.stringify(this.value)
            );
            //		}
        }
        return 1;
    };

//
// 91websql.js
// WebSQL database support
// (c) 2014, Andrey Gershun
//

    var WEBSQL = (alasql.engines.WEBSQL = function() {});

    WEBSQL.createDatabase = function(wdbid, args, dbid, cb) {
        var res = 1;
        var wdb = openDatabase(wdbid, args[0], args[1], args[2]);
        if (this.dbid) {
            var db = alasql.createDatabase(this.dbid);
            db.engineid = 'WEBSQL';
            db.wdbid = wdbid;
            sb.wdb = db;
        }
        if (!wdb) {
            throw new Error('Cannot create WebSQL database "' + databaseid + '"');
        }
        if (cb) cb(res);
        return res;
    };

    WEBSQL.dropDatabase = function(databaseid) {
        throw new Error('This is impossible to drop WebSQL database.');
    };

    WEBSQL.attachDatabase = function(databaseid, dbid, args, params, cb) {
        var res = 1;
        if (alasql.databases[dbid]) {
            throw new Error('Unable to attach database as "' + dbid + '" because it already exists');
        }
        alasqlopenDatabase(databaseid, args[0], args[1], args[2]);
        return res;
    };

//
// 91indexeddb.js
// AlaSQL IndexedDB module
// Date: 18.04.2015
// (c) Andrey Gershun
//

    /* global alasql, yy, utils*/

    var IDB = (alasql.engines.INDEXEDDB = function() {
        '';
    });

    if (utils.hasIndexedDB) {
        // For Chrome it work normally, for Firefox - simple shim
        if (typeof utils.global.indexedDB.webkitGetDatabaseNames == 'function') {
            IDB.getDatabaseNames = utils.global.indexedDB.webkitGetDatabaseNames.bind(
                utils.global.indexedDB
            );
        } else {
            IDB.getDatabaseNames = function() {
                var request = {};
                var result = {
                    contains: function(name) {
                        return true; // Always return true
                    },
                    notsupported: true,
                };
                setTimeout(function() {
                    var event = {target: {result: result}};
                    request.onsuccess(event);
                }, 0);
                return request;
            };
            IDB.getDatabaseNamesNotSupported = true;
        }
    }

//
// SHOW DATABASES
// work only in chrome
//
    IDB.showDatabases = function(like, cb) {

        var request = IDB.getDatabaseNames();
        request.onsuccess = function(event) {
            var dblist = event.target.result;
            if (IDB.getDatabaseNamesNotSupported) {
                throw new Error('SHOW DATABASE is not supported in this browser');
            }
            var res = [];
            if (like) {
                var relike = new RegExp(like.value.replace(/\%/g, '.*'), 'g');
            }
            for (var i = 0; i < dblist.length; i++) {
                if (!like || dblist[i].match(relike)) {
                    res.push({databaseid: dblist[i]});
                }
            }
            cb(res);
        };
    };

    IDB.createDatabase = function(ixdbid, args, ifnotexists, dbid, cb) {

        var indexedDB = utils.global.indexedDB;
        if (ifnotexists) {
            var request2 = indexedDB.open(ixdbid, 1);
            request2.onsuccess = function(event) {
                event.target.result.close();
                if (cb) cb(1);
            };
        } else {
            var request1 = indexedDB.open(ixdbid, 1);
            request1.onupgradeneeded = function(e) {

                e.target.transaction.abort();
            };
            request1.onsuccess = function(e) {

                if (ifnotexists) {
                    if (cb) cb(0);
                } else {
                    throw new Error(
                        'IndexedDB: Cannot create new database "' +
                        ixdbid +
                        '" because it already exists'
                    );
                }
            };
        }

    };

    IDB.createDatabase = function(ixdbid, args, ifnotexists, dbid, cb) {
        var indexedDB = utils.global.indexedDB;
        if (IDB.getDatabaseNamesNotSupported) {
            // Hack for Firefox
            if (ifnotexists) {

                var dbExists = true;
                var request2 = indexedDB.open(ixdbid);

                request2.onupgradeneeded = function(e) {

                    dbExists = false;
                    //			    e.target.transaction.abort();
                    //			    cb(0);
                };
                request2.onsuccess = function(event) {

                    event.target.result.close();
                    if (dbExists) {
                        if (cb) cb(0);
                    } else {
                        if (cb) cb(1);
                    }
                };
            } else {

                var request1 = indexedDB.open(ixdbid);
                request1.onupgradeneeded = function(e) {
                    e.target.transaction.abort();
                };
                request1.onabort = function(event) {
                    if (cb) cb(1);
                };
                request1.onsuccess = function(event) {
                    event.target.result.close();
                    throw new Error(
                        'IndexedDB: Cannot create new database "' +
                        ixdbid +
                        '" because it already exists'
                    );
                    //				cb(0);
                };
            }
        } else {
            var request1 = IDB.getDatabaseNames();
            request1.onsuccess = function(event) {
                var dblist = event.target.result;
                if (dblist.contains(ixdbid)) {
                    if (ifnotexists) {
                        if (cb) cb(0);
                        return;
                    } else {
                        throw new Error(
                            'IndexedDB: Cannot create new database "' +
                            ixdbid +
                            '" because it already exists'
                        );
                    }
                }

                var request2 = indexedDB.open(ixdbid, 1);
                request2.onsuccess = function(event) {
                    event.target.result.close();
                    if (cb) cb(1);
                };
            };
        }
    };

    IDB.dropDatabase = function(ixdbid, ifexists, cb) {
        var indexedDB = utils.global.indexedDB;
        var request1 = IDB.getDatabaseNames();
        request1.onsuccess = function(event) {
            var dblist = event.target.result;
            if (!dblist.contains(ixdbid)) {
                if (ifexists) {
                    if (cb) cb(0);
                    return;
                } else {
                    throw new Error(
                        'IndexedDB: Cannot drop new database "' + ixdbid + '" because it does not exist'
                    );
                }
            }
            var request2 = indexedDB.deleteDatabase(ixdbid);
            request2.onsuccess = function(event) {

                if (cb) cb(1);
            };
        };
    };

    IDB.attachDatabase = function(ixdbid, dbid, args, params, cb) {
        if (!utils.hasIndexedDB) {
            throw new Error('The current browser does not support IndexedDB');
        }
        var indexedDB = utils.global.indexedDB;
        var request1 = IDB.getDatabaseNames();
        request1.onsuccess = function(event) {
            var dblist = event.target.result;
            if (!dblist.contains(ixdbid)) {
                throw new Error(
                    'IndexedDB: Cannot attach database "' + ixdbid + '" because it does not exist'
                );
            }
            var request2 = indexedDB.open(ixdbid);
            request2.onsuccess = function(event) {
                var ixdb = event.target.result;
                var db = new alasql.Database(dbid || ixdbid);
                db.engineid = 'INDEXEDDB';
                db.ixdbid = ixdbid;
                db.tables = [];
                var tblist = ixdb.objectStoreNames;
                for (var i = 0; i < tblist.length; i++) {
                    db.tables[tblist[i]] = {};
                }

                event.target.result.close();
                if (cb) cb(1);
            };
        };
    };

    IDB.createTable = function(databaseid, tableid, ifnotexists, cb) {
        var indexedDB = utils.global.indexedDB;

        var ixdbid = alasql.databases[databaseid].ixdbid;

        var request1 = IDB.getDatabaseNames();
        request1.onsuccess = function(event__) {
            var dblist = event__.target.result;
            if (!dblist.contains(ixdbid)) {
                throw new Error(
                    'IndexedDB: Cannot create table in database "' +
                    ixdbid +
                    '" because it does not exist'
                );
            }
            var request2 = indexedDB.open(ixdbid);
            request2.onversionchange = function(event_) {

                event_.target.result.close();
            };
            request2.onsuccess = function(event_) {
                var version = event_.target.result.version;
                event_.target.result.close();

                var request3 = indexedDB.open(ixdbid, version + 1);
                request3.onupgradeneeded = function(event) {
                    var ixdb = event.target.result;

                    var store = ixdb.createObjectStore(tableid, {autoIncrement: true});

                };
                request3.onsuccess = function(event) {

                    event.target.result.close();
                    if (cb) cb(1);
                };
                request3.onerror = function(event) {
                    throw event;

                };
                request3.onblocked = function(event) {
                    throw new Error(
                        'Cannot create table "' +
                        tableid +
                        '" because database "' +
                        databaseid +
                        '"  is blocked'
                    );

                };
            };
        };
    };

    IDB.dropTable = function(databaseid, tableid, ifexists, cb) {
        var indexedDB = utils.global.indexedDB;
        var ixdbid = alasql.databases[databaseid].ixdbid;

        var request1 = IDB.getDatabaseNames();
        request1.onsuccess = function(event) {
            var dblist = event.target.result;

            if (!dblist.contains(ixdbid)) {
                throw new Error(
                    'IndexedDB: Cannot drop table in database "' +
                    ixdbid +
                    '" because it does not exist'
                );
            }

            var request2 = indexedDB.open(ixdbid);
            request2.onversionchange = function(event) {
                event.target.result.close();
            };

            request2.onsuccess = function(event) {
                var version = event.target.result.version;
                event.target.result.close();

                var request3 = indexedDB.open(ixdbid, version + 1);
                request3.onupgradeneeded = function(event) {
                    var ixdb = event.target.result;
                    if (ixdb.objectStoreNames.contains(tableid)) {
                        ixdb.deleteObjectStore(tableid);
                        delete alasql.databases[databaseid].tables[tableid];
                    } else {
                        if (!ifexists) {
                            throw new Error(
                                'IndexedDB: Cannot drop table "' +
                                tableid +
                                '" because it does not exist'
                            );
                        }
                    }
                    //				var store = ixdb.createObjectStore(tableid);

                };
                request3.onsuccess = function(event) {

                    event.target.result.close();
                    if (cb) cb(1);
                };
                request3.onerror = function(event) {

                    throw event;
                };
                request3.onblocked = function(event) {
                    throw new Error(
                        'Cannot drop table "' +
                        tableid +
                        '" because database "' +
                        databaseid +
                        '" is blocked'
                    );

                };
            };
        };
    };

    IDB.intoTable = function(databaseid, tableid, value, columns, cb) {

        // console.trace();

        var indexedDB = utils.global.indexedDB;
        var ixdbid = alasql.databases[databaseid].ixdbid;
        var request1 = indexedDB.open(ixdbid);
        request1.onsuccess = function(event) {
            var ixdb = event.target.result;
            var tx = ixdb.transaction([tableid], 'readwrite');
            var tb = tx.objectStore(tableid);

            for (var i = 0, ilen = value.length; i < ilen; i++) {
                tb.add(value[i]);
            }
            tx.oncomplete = function() {
                ixdb.close();

                if (cb) cb(ilen);
            };
        };

    };

    IDB.fromTable = function(databaseid, tableid, cb, idx, query) {

        // console.trace();
        var indexedDB = utils.global.indexedDB;
        var ixdbid = alasql.databases[databaseid].ixdbid;
        var request = indexedDB.open(ixdbid);
        request.onsuccess = function(event) {
            var res = [];
            var ixdb = event.target.result;

            var tx = ixdb.transaction([tableid]);
            var store = tx.objectStore(tableid);
            var cur = store.openCursor();

            cur.onblocked = function(event) {

            };
            cur.onerror = function(event) {

            };
            cur.onsuccess = function(event) {

                var cursor = event.target.result;

                if (cursor) {
                    res.push(cursor.value);
                    cursor["continue"]();
                } else {

                    ixdb.close();
                    if (cb) cb(res, idx, query);
                }
            };
        };
    };

    IDB.deleteFromTable = function(databaseid, tableid, wherefn, params, cb) {

        // console.trace();
        var indexedDB = utils.global.indexedDB;
        var ixdbid = alasql.databases[databaseid].ixdbid;
        var request = indexedDB.open(ixdbid);
        request.onsuccess = function(event) {
            var res = [];
            var ixdb = event.target.result;

            var tx = ixdb.transaction([tableid], 'readwrite');
            var store = tx.objectStore(tableid);
            var cur = store.openCursor();
            var num = 0;

            cur.onblocked = function(event) {

            };
            cur.onerror = function(event) {

            };
            cur.onsuccess = function(event) {

                var cursor = event.target.result;

                if (cursor) {
                    if (!wherefn || wherefn(cursor.value, params)) {

                        cursor["delete"]();
                        num++;
                    }
                    cursor["continue"]();
                } else {

                    ixdb.close();
                    if (cb) cb(num);
                }
            };
        };
    };

    IDB.updateTable = function(databaseid, tableid, assignfn, wherefn, params, cb) {

        // console.trace();
        var indexedDB = utils.global.indexedDB;
        var ixdbid = alasql.databases[databaseid].ixdbid;
        var request = indexedDB.open(ixdbid);
        request.onsuccess = function(event) {
            var res = [];
            var ixdb = event.target.result;

            var tx = ixdb.transaction([tableid], 'readwrite');
            var store = tx.objectStore(tableid);
            var cur = store.openCursor();
            var num = 0;

            cur.onblocked = function(event) {

            };
            cur.onerror = function(event) {

            };
            cur.onsuccess = function(event) {

                var cursor = event.target.result;

                if (cursor) {
                    if (!wherefn || wherefn(cursor.value, params)) {

                        var r = cursor.value;
                        assignfn(r, params);

                        cursor.update(r);
                        num++;
                    }
                    cursor["continue"]();
                } else {

                    ixdb.close();
                    if (cb) cb(num);
                }
            };
        };
    };

//
// 91localstorage.js
// localStorage and DOM-Storage engine
// Date: 09.12.2014
// (c) Andrey Gershun
//

    /* global alasql, yy, localStorage*/

    var LS = (alasql.engines.LOCALSTORAGE = function() {});

    /**
     Read data from localStorage with security breaks
     @param key {string} Address in localStorage
     @return {object} JSON object
     */
    LS.get = function(key) {
        var s = localStorage.getItem(key);
        if (typeof s === 'undefined') return;
        var v;
        try {
            v = JSON.parse(s);
        } catch (err) {
            throw new Error('Cannot parse JSON object from localStorage' + s);
        }
        return v;
    };

    /**
     Store data into localStorage with security breaks
     @param key {string} Address in localStorage
     @return {object} JSON object
     */
    LS.set = function(key, value) {
        if (typeof value === 'undefined') localStorage.removeItem(key);
        else localStorage.setItem(key, JSON.stringify(value));
    };

    /**
     Store table structure and data into localStorage
     @param databaseid {string} AlaSQL database id (not external localStorage)
     @param tableid {string} Table name
     @return Nothing
     */
    LS.storeTable = function(databaseid, tableid) {
        var db = alasql.databases[databaseid];
        var table = db.tables[tableid];
        // Create empty structure for table
        var tbl = {};
        tbl.columns = table.columns;
        tbl.data = table.data;
        tbl.identities = table.identities;
        // TODO: May be add indexes, objects and other fields?
        LS.set(db.lsdbid + '.' + tableid, tbl);
    };

    /**
     Restore table structure and data
     @param databaseid {string} AlaSQL database id (not external localStorage)
     @param tableid {string} Table name
     @return Nothing
     */
    LS.restoreTable = function(databaseid, tableid) {
        var db = alasql.databases[databaseid];
        var tbl = LS.get(db.lsdbid + '.' + tableid);
        var table = new alasql.Table();
        for (var f in tbl) {
            table[f] = tbl[f];
        }
        db.tables[tableid] = table;
        table.indexColumns();
        // We need to add other things here
        return table;
    };

    /**
     Remove table from localStorage
     @param databaseid {string} AlaSQL database id (not external localStorage)
     @param tableid {string} Table name
     */

    LS.removeTable = function(databaseid, tableid) {
        var db = alasql.databases[databaseid];
        localStorage.removeItem(db.lsdbid + '.' + tableid);
    };

    /**
     Create database in localStorage
     @param lsdbid {string} localStorage database id
     @param args {array} List of parameters (not used in localStorage)
     @param ifnotexists {boolean} Check if database does not exist
     @param databaseid {string} AlaSQL database id (not external localStorage)
     @param cb {function} Callback
     */

    LS.createDatabase = function(lsdbid, args, ifnotexists, databaseid, cb) {
        var res = 1;
        var ls = LS.get('alasql'); // Read list of all databases
        if (!(ifnotexists && ls && ls.databases && ls.databases[lsdbid])) {
            if (!ls) ls = {databases: {}}; // Empty record
            if (ls.databases && ls.databases[lsdbid]) {
                throw new Error(
                    'localStorage: Cannot create new database "' +
                    lsdbid +
                    '" because it already exists'
                );
            }
            ls.databases[lsdbid] = true;
            LS.set('alasql', ls);
            LS.set(lsdbid, {databaseid: lsdbid, tables: {}}); // Create database record
        } else {
            res = 0;
        }
        if (cb) res = cb(res);
        return res;
    };

    /**
     Drop external database
     @param lsdbid {string} localStorage database id
     @param ifexists {boolean} Check if database exists
     @param cb {function} Callback
     */
    LS.dropDatabase = function(lsdbid, ifexists, cb) {
        var res = 1;
        var ls = LS.get('alasql');
        if (!(ifexists && ls && ls.databases && !ls.databases[lsdbid])) {
            // 1. Remove record from 'alasql' record
            if (!ls) {
                if (!ifexists) {
                    throw new Error('There is no any AlaSQL databases in localStorage');
                } else {
                    return cb ? cb(0) : 0;
                }
            }

            if (ls.databases && !ls.databases[lsdbid]) {
                throw new Error(
                    'localStorage: Cannot drop database "' +
                    lsdbid +
                    '" because there is no such database'
                );
            }
            delete ls.databases[lsdbid];
            LS.set('alasql', ls);

            // 2. Remove tables definitions
            var db = LS.get(lsdbid);
            for (var tableid in db.tables) {
                localStorage.removeItem(lsdbid + '.' + tableid);
            }

            // 3. Remove database definition
            localStorage.removeItem(lsdbid);
        } else {
            res = 0;
        }
        if (cb) res = cb(res);
        return res;
    };

    /**
     Attach existing localStorage database to AlaSQL database
     @param lsdibid {string} localStorage database id
     @param
     */

    LS.attachDatabase = function(lsdbid, databaseid, args, params, cb) {
        var res = 1;
        if (alasql.databases[databaseid]) {
            throw new Error(
                'Unable to attach database as "' + databaseid + '" because it already exists'
            );
        }
        if (!databaseid) databaseid = lsdbid;
        var db = new alasql.Database(databaseid);
        db.engineid = 'LOCALSTORAGE';
        db.lsdbid = lsdbid;
        db.tables = LS.get(lsdbid).tables;
        // IF AUTOABORT IS OFF then copy data to memory
        if (!alasql.options.autocommit) {
            if (db.tables) {
                for (var tbid in db.tables) {
                    LS.restoreTable(databaseid, tbid);
                    //				db.tables[tbid].data = LS.get(db.lsdbid+'.'+tbid);
                }
            }
        }
        if (cb) res = cb(res);
        return res;
    };

    /**
     Show list of databases from localStorage
     @param like {string} Mathing pattern
     @param cb {function} Callback
     */
    LS.showDatabases = function(like, cb) {
        var res = [];
        var ls = LS.get('alasql');
        if (like) {
            // TODO: If we have a special function for LIKE patterns?
            var relike = new RegExp(like.value.replace(/%/g, '.*'), 'g');
        }
        if (ls && ls.databases) {
            for (var dbid in ls.databases) {
                res.push({databaseid: dbid});
            }
            if (like && res && res.length > 0) {
                res = res.filter(function(d) {
                    return d.databaseid.match(relike);
                });
            }
        }
        if (cb) res = cb(res);
        return res;
    };

    /**
     Create table in localStorage database
     @param databaseid {string} AlaSQL database id
     @param tableid {string} Table id
     @param ifnotexists {boolean} If not exists flag
     @param cb {function} Callback
     */

    LS.createTable = function(databaseid, tableid, ifnotexists, cb) {
        var res = 1;
        var lsdbid = alasql.databases[databaseid].lsdbid;
        var tb = LS.get(lsdbid + '.' + tableid);
        // Check if such record exists
        if (tb && !ifnotexists) {
            throw new Error(
                'Table "' + tableid + '" alsready exists in localStorage database "' + lsdbid + '"'
            );
        }
        var lsdb = LS.get(lsdbid);
        var table = alasql.databases[databaseid].tables[tableid];

        // TODO: Check if required
        lsdb.tables[tableid] = true;

        LS.set(lsdbid, lsdb);
        LS.storeTable(databaseid, tableid);

        if (cb) res = cb(res);
        return res;
    };

    /**
     Empty table and reset identities
     @param databaseid {string} AlaSQL database id (not external localStorage)
     @param tableid {string} Table name
     @param ifexists {boolean} If exists flag
     @param cb {function} Callback
     @return 1 on success
     */
    LS.truncateTable = function(databaseid, tableid, ifexists, cb) {
        var res = 1;
        var lsdbid = alasql.databases[databaseid].lsdbid;
        var lsdb;
        if (alasql.options.autocommit) {
            lsdb = LS.get(lsdbid);
        } else {
            lsdb = alasql.databases[databaseid];
        }

        if (!ifexists && !lsdb.tables[tableid]) {
            throw new Error(
                'Cannot truncate table "' + tableid + '" in localStorage, because it does not exist'
            );
        }

        //load table
        var tbl = LS.restoreTable(databaseid, tableid);

        //clear data from table
        tbl.data = [];
        //TODO reset all identities
        //but identities are not working on LOCALSTORAGE
        //See test 607 for details

        //store table
        LS.storeTable(databaseid, tableid);

        if (cb) res = cb(res);
        return res;
    };

    /**
     Create table in localStorage database
     @param databaseid {string} AlaSQL database id
     @param tableid {string} Table id
     @param ifexists {boolean} If exists flag
     @param cb {function} Callback
     */

    LS.dropTable = function(databaseid, tableid, ifexists, cb) {
        var res = 1;
        var lsdbid = alasql.databases[databaseid].lsdbid;
        var lsdb;

        if (alasql.options.autocommit) {
            lsdb = LS.get(lsdbid);
        } else {
            lsdb = alasql.databases[databaseid];
        }
        if (!ifexists && !lsdb.tables[tableid]) {
            throw new Error(
                'Cannot drop table "' + tableid + '" in localStorage, because it does not exist'
            );
        }
        delete lsdb.tables[tableid];
        LS.set(lsdbid, lsdb);
        //	localStorage.removeItem(lsdbid+'.'+tableid);
        LS.removeTable(databaseid, tableid);
        if (cb) res = cb(res);
        return res;
    };

    /**
     Read all data from table
     */

    LS.fromTable = function(databaseid, tableid, cb, idx, query) {

        var lsdbid = alasql.databases[databaseid].lsdbid;
        //	var res = LS.get(lsdbid+'.'+tableid);

        var res = LS.restoreTable(databaseid, tableid).data;

        if (cb) res = cb(res, idx, query);
        return res;
    };

    /**
     Insert data into the table
     @param databaseid {string} Database id
     @param tableid {string} Table id
     @param value {array} Array of values
     @param columns {array} Columns (not used)
     @param cb {function} Callback
     */

    LS.intoTable = function(databaseid, tableid, value, columns, cb) {

        var lsdbid = alasql.databases[databaseid].lsdbid;
        var res = value.length;
        //	var tb = LS.get(lsdbid+'.'+tableid);
        var tb = LS.restoreTable(databaseid, tableid);
        for (var columnid in tb.identities) {
            var ident = tb.identities[columnid];

            for (var index in value) {
                value[index][columnid] = ident.value;
                ident.value += ident.step;
            }
        }
        if (!tb.data) tb.data = [];
        tb.data = tb.data.concat(value);
        //	LS.set(lsdbid+'.'+tableid, tb);
        LS.storeTable(databaseid, tableid);

        if (cb) res = cb(res);

        return res;
    };

    /**
     Laad data from table
     */
    LS.loadTableData = function(databaseid, tableid) {
        var db = alasql.databases[databaseid];
        var lsdbid = alasql.databases[databaseid].lsdbid;
        LS.restoreTable(databaseid, tableid);
        //	db.tables[tableid].data = LS.get(lsdbid+'.'+tableid);
    };

    /**
     Save data to the table
     */

    LS.saveTableData = function(databaseid, tableid) {
        var db = alasql.databases[databaseid];
        var lsdbid = alasql.databases[databaseid].lsdbid;
        LS.storeTable(lsdbid, tableid);
        //	LS.set(lsdbid+'.'+tableid,db.tables[tableid].data);
        db.tables[tableid].data = undefined;
    };

    /**
     Commit
     */

    LS.commit = function(databaseid, cb) {

        var db = alasql.databases[databaseid];
        var lsdbid = alasql.databases[databaseid].lsdbid;
        var lsdb = {databaseid: lsdbid, tables: {}};
        if (db.tables) {
            for (var tbid in db.tables) {
                // TODO: Question - do we need this line
                lsdb.tables[tbid] = true;
                LS.storeTable(databaseid, tbid);
                //			LS.set(lsdbid+'.'+tbid, db.tables[tbid].data);
            }
        }
        LS.set(lsdbid, lsdb);
        return cb ? cb(1) : 1;
    };

    /**
     Alias BEGIN = COMMIT
     */
    LS.begin = LS.commit;

    /**
     ROLLBACK
     */

    LS.rollback = function(databaseid, cb) {
        // This does not work and should be fixed
        // Plus test 151 and 231

        return;

        var db = alasql.databases[databaseid];
        db.dbversion++;

        var lsdbid = alasql.databases[databaseid].lsdbid;
        var lsdb = LS.get(lsdbid);
        //	if(!alasql.options.autocommit) {

        delete alasql.databases[databaseid];
        alasql.databases[databaseid] = new alasql.Database(databaseid);
        extend(alasql.databases[databaseid], lsdb);
        alasql.databases[databaseid].databaseid = databaseid;
        alasql.databases[databaseid].engineid = 'LOCALSTORAGE';

        if (lsdb.tables) {
            for (var tbid in lsdb.tables) {
                //				var tb = new alasql.Table({columns: db.tables[tbid].columns});
                //				extend(tb,lsdb.tables[tbid]);
                //				lsdb.tables[tbid] = true;

                //				if(!alasql.options.autocommit) {

                //					lsdb.tables[tbid].data = LS.get(db.lsdbid+'.'+tbid);
                LS.restoreTable(databaseid, tbid);
                //				}
                //				lsdb.tables[tbid].indexColumns();

                // index columns
                // convert types
            }
        }
        //	}

    };

//
// 91websql.js
// WebSQL database support
// (c) 2014, Andrey Gershun
//

    var SQLITE = (alasql.engines.SQLITE = function() {});

    SQLITE.createDatabase = function(wdbid, args, ifnotexists, dbid, cb) {
        throw new Error('Connot create SQLITE database in memory. Attach it.');
    };

    SQLITE.dropDatabase = function(databaseid) {
        throw new Error('This is impossible to drop SQLite database. Detach it.');
    };

    SQLITE.attachDatabase = function(sqldbid, dbid, args, params, cb) {
        var res = 1;
        if (alasql.databases[dbid]) {
            throw new Error('Unable to attach database as "' + dbid + '" because it already exists');
        }

        if ((args[0] && args[0] instanceof yy.StringValue) || args[0] instanceof yy.ParamValue) {
            if (args[0] instanceof yy.StringValue) {
                var value = args[0].value;
            } else if (args[0] instanceof yy.ParamValue) {
                var value = params[args[0].param];
            }
            alasql.utils.loadBinaryFile(
                value,
                true,
                function(data) {
                    var db = new alasql.Database(dbid || sqldbid);
                    db.engineid = 'SQLITE';
                    db.sqldbid = sqldbid;
                    var sqldb = (db.sqldb = new SQL.Database(data));
                    db.tables = [];
                    var tables = sqldb.exec("SELECT * FROM sqlite_master WHERE type='table'")[0].values;

                    tables.forEach(function(tbl) {
                        db.tables[tbl[1]] = {};
                        var columns = (db.tables[tbl[1]].columns = []);
                        var ast = alasql.parse(tbl[4]);

                        var coldefs = ast.statements[0].columns;
                        if (coldefs && coldefs.length > 0) {
                            coldefs.forEach(function(cd) {
                                columns.push(cd);
                            });
                        }
                    });

                    cb(1);
                },
                function(err) {
                    throw new Error('Cannot open SQLite database file "' + args[0].value + '"');
                }
            );
            return res;
        } else {
            throw new Error('Cannot attach SQLite database without a file');
        }

        return res;
    };

    SQLITE.fromTable = function(databaseid, tableid, cb, idx, query) {
        var data = alasql.databases[databaseid].sqldb.exec('SELECT * FROM ' + tableid);
        var columns = (query.sources[idx].columns = []);
        if (data[0].columns.length > 0) {
            data[0].columns.forEach(function(columnid) {
                columns.push({columnid: columnid});
            });
        }

        var res = [];
        if (data[0].values.length > 0) {
            data[0].values.forEach(function(d) {
                var r = {};
                columns.forEach(function(col, idx) {
                    r[col.columnid] = d[idx];
                });
                res.push(r);
            });
        }
        if (cb) cb(res, idx, query);
    };

    SQLITE.intoTable = function(databaseid, tableid, value, columns, cb) {
        var sqldb = alasql.databases[databaseid].sqldb;
        for (var i = 0, ilen = value.length; i < ilen; i++) {
            var s = 'INSERT INTO ' + tableid + ' (';
            var d = value[i];
            var keys = Object.keys(d);
            s += keys.join(',');
            s += ') VALUES (';
            s += keys
                .map(function(k) {
                    v = d[k];
                    if (typeof v == 'string') v = "'" + v + "'";
                    return v;
                })
                .join(',');
            s += ')';
            sqldb.exec(s);
        }
        var res = ilen;
        if (cb) cb(res);
        return res;
    };

//
// 91localstorage.js
// localStorage and DOM-Storage engine
// Date: 09.12.2014
// (c) Andrey Gershun
//

    var FS = (alasql.engines.FILESTORAGE = alasql.engines.FILE = function() {});

    FS.createDatabase = function(fsdbid, args, ifnotexists, dbid, cb) {

        var res = 1;
        var filename = args[0].value;

        alasql.utils.fileExists(filename, function(fex) {

            if (fex) {
                if (ifnotexists) {
                    res = 0;
                    if (cb) res = cb(res);
                    return res;
                } else {
                    throw new Error('Cannot create new database file, because it already exists');
                }
            } else {
                var data = {tables: {}};
                alasql.utils.saveFile(filename, JSON.stringify(data), function(data) {
                    if (cb) res = cb(res);
                });
            }
        });
        return res;
    };

    FS.dropDatabase = function(fsdbid, ifexists, cb) {
        var res;
        var filename = fsdbid.value;

        alasql.utils.fileExists(filename, function(fex) {
            if (fex) {
                res = 1;
                alasql.utils.deleteFile(filename, function() {
                    res = 1;
                    if (cb) res = cb(res);
                });
            } else {
                if (!ifexists) {
                    throw new Error('Cannot drop database file, because it does not exist');
                }
                res = 0;
                if (cb) res = cb(res);
            }
        });
        return res;
    };

    FS.attachDatabase = function(fsdbid, dbid, args, params, cb) {

        var res = 1;
        if (alasql.databases[dbid]) {
            throw new Error('Unable to attach database as "' + dbid + '" because it already exists');
        }
        var db = new alasql.Database(dbid || fsdbid);
        db.engineid = 'FILESTORAGE';
        //	db.fsdbid = fsdbid;
        db.filename = args[0].value;
        loadFile(db.filename, !!cb, function(s) {
            try {
                db.data = JSON.parse(s);
            } catch (err) {
                throw new Error('Data in FileStorage database are corrupted');
            }
            db.tables = db.data.tables;
            // IF AUTOCOMMIT IS OFF then copy data to memory
            if (!alasql.options.autocommit) {
                if (db.tables) {
                    for (var tbid in db.tables) {
                        db.tables[tbid].data = db.data[tbid];
                    }
                }
            }
            if (cb) res = cb(res);
        });
        return res;
    };

    FS.createTable = function(databaseid, tableid, ifnotexists, cb) {
        var db = alasql.databases[databaseid];
        var tb = db.data[tableid];
        var res = 1;

        if (tb && !ifnotexists) {
            throw new Error('Table "' + tableid + '" alsready exists in the database "' + fsdbid + '"');
        }
        var table = alasql.databases[databaseid].tables[tableid];
        db.data.tables[tableid] = {columns: table.columns};
        db.data[tableid] = [];

        FS.updateFile(databaseid);

        if (cb) cb(res);
        return res;
    };

    FS.updateFile = function(databaseid) {

        var db = alasql.databases[databaseid];
        if (db.issaving) {
            db.postsave = true;
            return;
        }
        db.issaving = true;
        db.postsave = false;
        alasql.utils.saveFile(db.filename, JSON.stringify(db.data), function() {
            db.issaving = false;

            if (db.postsave) {
                setTimeout(function() {
                    FS.updateFile(databaseid);
                }, 50); // TODO Test with different timeout parameters
            }
        });
    };

    FS.dropTable = function(databaseid, tableid, ifexists, cb) {
        var res = 1;
        var db = alasql.databases[databaseid];
        if (!ifexists && !db.tables[tableid]) {
            throw new Error(
                'Cannot drop table "' + tableid + '" in fileStorage, because it does not exist'
            );
        }
        delete db.tables[tableid];
        delete db.data.tables[tableid];
        delete db.data[tableid];
        FS.updateFile(databaseid);
        if (cb) cb(res);
        return res;
    };

    FS.fromTable = function(databaseid, tableid, cb, idx, query) {

        var db = alasql.databases[databaseid];
        var res = db.data[tableid];
        if (cb) res = cb(res, idx, query);
        return res;
    };

    FS.intoTable = function(databaseid, tableid, value, columns, cb) {
        var db = alasql.databases[databaseid];
        var res = value.length;
        var tb = db.data[tableid];
        if (!tb) tb = [];
        db.data[tableid] = tb.concat(value);
        FS.updateFile(databaseid);
        if (cb) cb(res);
        return res;
    };

    FS.loadTableData = function(databaseid, tableid) {
        var db = alasql.databases[databaseid];
        db.tables[tableid].data = db.data[tableid];
    };

    FS.saveTableData = function(databaseid, tableid) {
        var db = alasql.databases[databaseid];
        db.data[tableid] = db.tables[tableid].data;
        db.tables[tableid].data = null;
        FS.updateFile(databaseid);
    };

    FS.commit = function(databaseid, cb) {

        var db = alasql.databases[databaseid];
        var fsdb = {tables: {}};
        if (db.tables) {
            for (var tbid in db.tables) {
                db.data.tables[tbid] = {columns: db.tables[tbid].columns};
                db.data[tbid] = db.tables[tbid].data;
            }
        }
        FS.updateFile(databaseid);
        return cb ? cb(1) : 1;
    };

    FS.begin = FS.commit;

    FS.rollback = function(databaseid, cb) {
        var res = 1;
        var db = alasql.databases[databaseid];
        db.dbversion++;

        //	var lsdbid = alasql.databases[databaseid].lsdbid;
        //	lsdb = LS.get(lsdbid);
        wait();
        function wait() {
            setTimeout(function() {
                if (db.issaving) {
                    return wait();
                } else {
                    alasql.loadFile(db.filename, !!cb, function(data) {
                        db.data = data;
                        db.tables = {};
                        for (var tbid in db.data.tables) {
                            var tb = new alasql.Table({columns: db.data.tables[tbid].columns});
                            extend(tb, db.data.tables[tbid]);
                            db.tables[tbid] = tb;
                            if (!alasql.options.autocommit) {
                                db.tables[tbid].data = db.data[tbid];
                            }
                            db.tables[tbid].indexColumns();

                            // index columns
                            // convert types
                        }

                        delete alasql.databases[databaseid];
                        alasql.databases[databaseid] = new alasql.Database(databaseid);
                        extend(alasql.databases[databaseid], db);
                        alasql.databases[databaseid].engineid = 'FILESTORAGE';
                        alasql.databases[databaseid].filename = db.filename;

                        if (cb) res = cb(res);
                        // Todo: check why no return
                    });
                }
            }, 100);
        }

        //	 if(!alasql.options.autocommit) {

    };

    if(utils.isBrowser && !utils.isWebWorker) {

        alasql = alasql || false;

        if (!alasql) {
            throw new Error('alasql was not found');
        }

        alasql.worker = function() {
            throw new Error('Can find webworker in this enviroment');
        };

        if (typeof Worker !== 'undefined') {
            alasql.worker = function(path, paths, cb) {
                //	var path;
                if (path === true) {
                    path = undefined;
                }

                if (typeof path === 'undefined') {
                    var sc = document.getElementsByTagName('script');
                    for (var i = 0; i < sc.length; i++) {
                        if (sc[i].src.substr(-16).toLowerCase() === 'alasql-worker.js') {
                            path = sc[i].src.substr(0, sc[i].src.length - 16) + 'alasql.js';
                            break;
                        } else if (sc[i].src.substr(-20).toLowerCase() === 'alasql-worker.min.js') {
                            path = sc[i].src.substr(0, sc[i].src.length - 20) + 'alasql.min.js';
                            break;
                        } else if (sc[i].src.substr(-9).toLowerCase() === 'alasql.js') {
                            path = sc[i].src;
                            break;
                        } else if (sc[i].src.substr(-13).toLowerCase() === 'alasql.min.js') {
                            path = sc[i].src.substr(0, sc[i].src.length - 13) + 'alasql.min.js';
                            break;
                        }
                    }
                }

                if (typeof path === 'undefined') {
                    throw new Error('Path to alasql.js is not specified');
                } else if (path !== false) {
                    var js = "importScripts('";
                    js += path;
                    js +=
                        "');self.onmessage = function(event) {" +
                        'alasql(event.data.sql,event.data.params, function(data){' +
                        'postMessage({id:event.data.id, data:data});});}';

                    var blob = new Blob([js], {type: 'text/plain'});
                    alasql.webworker = new Worker(URL.createObjectURL(blob));

                    alasql.webworker.onmessage = function(event) {
                        var id = event.data.id;

                        alasql.buffer[id](event.data.data);
                        delete alasql.buffer[id];
                    };

                    alasql.webworker.onerror = function(e) {
                        throw e;
                    };

                    if (arguments.length > 1) {
                        var sql =
                            'REQUIRE ' +
                            paths
                                .map(function(p) {
                                    return '"' + p + '"';
                                })
                                .join(',');
                        alasql(sql, [], cb);
                    }
                } else if (path === false) {
                    delete alasql.webworker;
                    return;
                }
            };
        }

        /* FileSaver.js
         * A saveAs() FileSaver implementation.
         * 1.3.2
         * 2016-06-16 18:25:19
         *
         * By Eli Grey, http://eligrey.com
         * License: MIT
         *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
         */

        /*global self */
        /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

        /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

        var saveAs =
            saveAs ||
            (function(view) {
                'use strict';
                // IE <10 is explicitly unsupported
                if (
                    typeof view === 'undefined' ||
                    (typeof navigator !== 'undefined' && /MSIE [1-9]\./.test(navigator.userAgent))
                ) {
                    return;
                }
                var doc = view.document,
                    // only get URL when necessary in case Blob.js hasn't overridden it yet
                    get_URL = function() {
                        return view.URL || view.webkitURL || view;
                    },
                    save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a'),
                    can_use_save_link = 'download' in save_link,
                    click = function(node) {
                        var event = new MouseEvent('click');
                        node.dispatchEvent(event);
                    },
                    is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
                    is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
                    throw_outside = function(ex) {
                        (view.setImmediate || view.setTimeout)(function() {
                            throw ex;
                        }, 0);
                    },
                    force_saveable_type = 'application/octet-stream',
                    // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
                    arbitrary_revoke_timeout = 1000 * 40, // in ms
                    revoke = function(file) {
                        var revoker = function() {
                            if (typeof file === 'string') {
                                // file is an object URL
                                get_URL().revokeObjectURL(file);
                            } else {
                                // file is a File
                                file.remove();
                            }
                        };
                        setTimeout(revoker, arbitrary_revoke_timeout);
                    },
                    dispatch = function(filesaver, event_types, event) {
                        event_types = [].concat(event_types);
                        var i = event_types.length;
                        while (i--) {
                            var listener = filesaver['on' + event_types[i]];
                            if (typeof listener === 'function') {
                                try {
                                    listener.call(filesaver, event || filesaver);
                                } catch (ex) {
                                    throw_outside(ex);
                                }
                            }
                        }
                    },
                    auto_bom = function(blob) {
                        // prepend BOM for UTF-8 XML and text/* types (including HTML)
                        // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
                        if (
                            /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
                                blob.type
                            )
                        ) {
                            return new Blob([String.fromCharCode(0xfeff), blob], {type: blob.type});
                        }
                        return blob;
                    },
                    FileSaver = function(blob, name, no_auto_bom) {
                        if (!no_auto_bom) {
                            blob = auto_bom(blob);
                        }
                        // First try a.download, then web filesystem, then object URLs
                        var filesaver = this,
                            type = blob.type,
                            force = type === force_saveable_type,
                            object_url,
                            dispatch_all = function() {
                                dispatch(filesaver, 'writestart progress write writeend'.split(' '));
                            },
                            // on any filesys errors revert to saving with object URLs
                            fs_error = function() {
                                if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                                    // Safari doesn't allow downloading of blob urls
                                    var reader = new FileReader();
                                    reader.onloadend = function() {
                                        var url = is_chrome_ios
                                            ? reader.result
                                            : reader.result.replace(
                                            /^data:[^;]*;/,
                                            'data:attachment/file;'
                                        );
                                        var popup = view.open(url, '_blank');
                                        if (!popup) view.location.href = url;
                                        url = undefined; // release reference before dispatching
                                        filesaver.readyState = filesaver.DONE;
                                        dispatch_all();
                                    };
                                    reader.readAsDataURL(blob);
                                    filesaver.readyState = filesaver.INIT;
                                    return;
                                }
                                // don't create more object URLs than needed
                                if (!object_url) {
                                    object_url = get_URL().createObjectURL(blob);
                                }
                                if (force) {
                                    view.location.href = object_url;
                                } else {
                                    var opened = view.open(object_url, '_blank');
                                    if (!opened) {
                                        // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                                        view.location.href = object_url;
                                    }
                                }
                                filesaver.readyState = filesaver.DONE;
                                dispatch_all();
                                revoke(object_url);
                            };
                        filesaver.readyState = filesaver.INIT;

                        if (can_use_save_link) {
                            object_url = get_URL().createObjectURL(blob);
                            setTimeout(function() {
                                save_link.href = object_url;
                                save_link.download = name;
                                click(save_link);
                                dispatch_all();
                                revoke(object_url);
                                filesaver.readyState = filesaver.DONE;
                            });
                            return;
                        }

                        fs_error();
                    },
                    FS_proto = FileSaver.prototype,
                    saveAs = function(blob, name, no_auto_bom) {
                        return new FileSaver(blob, name || blob.name || 'download', no_auto_bom);
                    };
                // IE 10+ (native saveAs)
                if (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob) {
                    return function(blob, name, no_auto_bom) {
                        name = name || blob.name || 'download';

                        if (!no_auto_bom) {
                            blob = auto_bom(blob);
                        }
                        return navigator.msSaveOrOpenBlob(blob, name);
                    };
                }

                FS_proto.abort = function() {};
                FS_proto.readyState = FS_proto.INIT = 0;
                FS_proto.WRITING = 1;
                FS_proto.DONE = 2;

                FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;

                return saveAs;
            })(
                (typeof self !== 'undefined' && self) ||
                (typeof window !== 'undefined' && window) ||
                this.content
            );
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

        if (typeof module !== 'undefined' && module.exports) {
            module.exports.saveAs = saveAs;
        } else if (typeof define !== 'undefined' && define !== null && define.amd !== null) {
            define('FileSaver.js', function() {
                return saveAs;
            });
        }

        /* eslint-disable */

        /*
         //
         // Last part of Alasql.js
         // Date: 03.11.2014
         // (c) 2014, Andrey Gershun
         //
         */

// This is a final part of Alasql

//*only-for-browser/*
        if(utils.isCordova || utils.isMeteorServer || utils.isNode ){
            console.warn('It looks like you are using the browser version of AlaSQL. Please use the alasql.fs.js file instead.')
        }
//*/

// FileSaveAs
        alasql.utils.saveAs = saveAs;

    };

// Create default database
    new Database("alasql");

// Set default database
    alasql.use("alasql");

    return alasql;
}));