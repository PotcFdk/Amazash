!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t,n){var o=n(1),r=n(2);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var i={insert:"head",singleton:!1};o(r,i);e.exports=r.locals||{}},function(e,t,n){"use strict";var o,r=function(){return void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o},i=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),a=[];function c(e){for(var t=-1,n=0;n<a.length;n++)if(a[n].identifier===e){t=n;break}return t}function u(e,t){for(var n={},o=[],r=0;r<e.length;r++){var i=e[r],u=t.base?i[0]+t.base:i[0],s=n[u]||0,l="".concat(u," ").concat(s);n[u]=s+1;var d=c(l),f={css:i[1],media:i[2],sourceMap:i[3]};-1!==d?(a[d].references++,a[d].updater(f)):a.push({identifier:l,updater:g(f,t),references:1}),o.push(l)}return o}function s(e){var t=document.createElement("style"),o=e.attributes||{};if(void 0===o.nonce){var r=n.nc;r&&(o.nonce=r)}if(Object.keys(o).forEach((function(e){t.setAttribute(e,o[e])})),"function"==typeof e.insert)e.insert(t);else{var a=i(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var l,d=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function f(e,t,n,o){var r=n?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(e.styleSheet)e.styleSheet.cssText=d(t,r);else{var i=document.createTextNode(r),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function p(e,t,n){var o=n.css,r=n.media,i=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),i&&btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}var m=null,v=0;function g(e,t){var n,o,r;if(t.singleton){var i=v++;n=m||(m=s(t)),o=f.bind(null,n,i,!1),r=f.bind(null,n,i,!0)}else n=s(t),o=p.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=r());var n=u(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var o=0;o<n.length;o++){var r=c(n[o]);a[r].references--}for(var i=u(e,t),s=0;s<n.length;s++){var l=c(n[s]);0===a[l].references&&(a[l].updater(),a.splice(l,1))}n=i}}}},function(e,t,n){(t=n(3)(!1)).push([e.i,'body{\n\tfont: 62.5% "Trebuchet MS", sans-serif;\n\tmargin: 50px;\n}\n.container1 {\n\tposition: absolute;\n\ttop: 10%;\n\tleft: 0;\n\theight: 80%;\n\twidth: 100%;\n\ttext-align: center;\n}\n.textinput {\n\twidth: 20em;\n\tfont-size: x-large;\n}\nbutton {\n\tmargin-top: 2em;\n}\n.demoHeaders {\n\tmargin-top: 2em;\n}\n#dialog-link {\n\tpadding: .4em 1em .4em 20px;\n\ttext-decoration: none;\n\tposition: relative;\n}\n#dialog-link span.ui-icon {\n\tmargin: 0 5px 0 0;\n\tposition: absolute;\n\tleft: .2em;\n\ttop: 50%;\n\tmargin-top: -8px;\n}\n#icons {\n\tmargin: 0;\n\tpadding: 0;\n}\n#icons li {\n\tmargin: 2px;\n\tposition: relative;\n\tpadding: 4px 0;\n\tcursor: pointer;\n\tfloat: left;\n\tlist-style: none;\n}\n#icons span.ui-icon {\n\tfloat: left;\n\tmargin: 0 4px;\n}\n.fakewindowcontain .ui-widget-overlay {\n\tposition: absolute;\n}\nselect {\n\twidth: 200px;\n}\n#result {\n\tdisplay: block;\n\tmargin-top: 2vw;\n\tfont-size: x-large;\n}\n#result_calculation {\n\tfont-size: large;\n\twhite-space: pre;\n}',""]),e.exports=t},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var r=(a=o,c=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),u="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(u," */")),i=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(e," */")}));return[n].concat(i).concat([r]).join("\n")}var a,c,u;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,o){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var c=0;c<e.length;c++){var u=[].concat(e[c]);o&&r[u[0]]||(n&&(u[2]?u[2]="".concat(n," and ").concat(u[2]):u[2]=n),t.push(u))}},t}},function(e,t,n){"use strict";n.r(t);n(0);const o=(e,t,n)=>.97*(e*t+n),r=(e,t,n)=>.995*(e*t+n),i=()=>{const e=Number(document.getElementById("ooa-price").value),t=Number(document.getElementById("ooa-shipping").value),n=Number(document.getElementById("a-price").value),i=Number(document.getElementById("a-shipping").value),a=((e,t,n,o)=>{const r=(-.03*o+-.995*t+o)/(-.97*n-.005*e+e);return isFinite(r)?r:void 0})(e,t,n,i)||0,c=Math.ceil(a);document.getElementById("result").textContent=a>1?r(c,e,t)<o(c,n,i)?"It makes sense to buy outside Amazon when quantity >= "+c:"It makes sense to buy on Amazon when quantity >= "+c:r(1,e,t)<o(1,n,i)?"With these parameters, it always makes sense to buy outside of Amazon.":"With these parameters, it always makes sense to buy on Amazon.",((e,t,n,i,a)=>{document.getElementById("result_calculation").textContent=`With quantity = ${a}:\r\nPrice outside Amazon: ${r(a,e,t).toFixed(2)} = (${a}*${e} + ${t}) - 0.5 % cashback\r\nPrice on Amazon: ${o(a,n,i).toFixed(2)} = (${a}*${n} + ${i}) - 3 % cashback`})(e,t,n,i,Math.max(c,1))};document.getElementById("reset").addEventListener("click",e=>{e.preventDefault(),Array.from(document.getElementsByTagName("input")).forEach(e=>e.value="")}),document.getElementById("ooa-price").addEventListener("input",i),document.getElementById("ooa-shipping").addEventListener("input",i),document.getElementById("a-price").addEventListener("input",i),document.getElementById("a-shipping").addEventListener("input",i),window.onload=i}]);