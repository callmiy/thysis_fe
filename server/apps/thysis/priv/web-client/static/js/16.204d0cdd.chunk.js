(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{594:function(e,t,n){},626:function(e,t,n){"use strict";n.r(t);var a=n(27),r=n(23),c=n(64),o=n(68),u=n(66),l=n(65),s=n(67),i=n(0),m=n(335),d=n(332),v=n(619),g=n(633),p=(n(594),n(348)),E=n(12),f=n(342),b=n(354),O=function(e){function t(){var e,n;Object(c.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(u.a)(this,(e=Object(l.a)(t)).call.apply(e,[this].concat(r)))).renderMainOrLoading=function(){var e=n.props,t=e.loading,a=e.quote,r=e.error;return r?i.createElement("div",{className:"{`${classes.sourceMain} ${classes.errorContainer}`}"},r.message):t||!a?i.createElement(m.a,{inverted:!0,className:"{`${classes.sourceMain}`}",active:!0},i.createElement(d.a,{size:"medium"},"Loading..")):i.createElement("div",{className:"main"},i.createElement("div",{className:"quote-text"},a.text),i.createElement("hr",null),i.createElement("div",{className:"date"},"Date: ",a.date),i.createElement("div",{className:"page-start"},"Page start: ",a.pageStart," "),i.createElement("div",{className:"page-end"},"Page End: ",a.pageEnd," "),i.createElement("div",{className:"volume"},"Volume: ",a.volume," "),i.createElement("div",{className:"extras"},"Extras: ",a.extras," "),i.createElement("hr",null),a.source&&i.createElement(g.a,{to:Object(E.m)(a.source.id),className:"quote-text"},Object(f.b)(a.source)),a.tags&&i.createElement("div",null,i.createElement("h4",null,"Tags"),i.createElement(v.a,{divided:!0},a.tags.map(n.renderTag))))},n.renderTag=function(e){if(e){var t=e.id,n=e.text;return i.createElement(v.a.Item,{as:g.a,to:Object(E.n)(t),key:t,className:"quote-text"},i.createElement("div",null,n))}},n}return Object(s.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){Object(E.o)("Quote")}},{key:"componentWillUnmount",value:function(){Object(E.o)()}},{key:"render",value:function(){return i.createElement(b.a,null,i.createElement("div",{className:"quote-route"},i.createElement(p.a,{title:"Quote",showSideBarTrigger:!0}),this.renderMainOrLoading()))}}]),t}(i.Component),j=n(7),N=n(8),h=n.n(N),q=n(138);function x(){var e=Object(j.a)(["\n  fragment QuoteFullFrag on Quote {\n    id\n    text\n    date\n    extras\n    issue\n    pageStart\n    pageEnd\n    volume\n    source {\n      ...SourceForDisplayFrag\n    }\n    tags {\n      id\n      text\n    }\n  }\n\n  ","\n"]);return x=function(){return e},e}var w=h()(x(),q.a);function y(){var e=Object(j.a)(["\n  query QuoteFull($quote: GetQuoteInput!) {\n    quote(quote: $quote) {\n      ...QuoteFullFrag\n    }\n  }\n\n  ","\n"]);return y=function(){return e},e}var F=h()(y(),w),Q=Object(r.e)(F,{props:function(e){var t=e.data;return Object(a.a)({},t)},options:function(e){return{variables:{quote:{id:e.match.params.id}}}}});t.default=Object(r.d)(r.f,Q)(O)}}]);
//# sourceMappingURL=16.204d0cdd.chunk.js.map