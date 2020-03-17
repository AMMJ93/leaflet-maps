// c3 = require('c3')
//
// class BarChart {
//
//     constructor(chartspace, data) {
//         this.chartspace = chartspace;
//         this.createChart();
//         this.jsondata = data;
//         this.chart = null;
//     }
//     createChart() {
//         this.chart = c3.generate({
//             bindto: this.chartspace,
//             padding: {
//                 bottom: 10
//             },
//             data: {
//                 json: this.jsondata,
//                 // colors: this.colorDict,
//                 type: 'bar',
//                 keys: {
//                     x: Object.keys(this.jsondata),
//                     value: Object.values(this.jsondata),
//                 }
//             },
//             bar: {
//                 width: {
//                     ratio: 0.5 // this makes bar width 50% of length between ticks
//                 }
//                 // or
//                 //width: 100 // this makes bar width 100px
//             },
//             title: {
//                 text: "BarChart C3"
//             },
//             legend: {
//                 position: 'bottom'
//             },
//         });
//     }
// }