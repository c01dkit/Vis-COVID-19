var right2 = echarts.init(document.getElementById('right1')); //初始化

var COLORS = ["#eeeeee", "#faebd2", "#FFDEAD", "#FF7F50", "#FF4500", "#FF0000", "#CD0000"]; //图例里的颜色

function getVirtulData(year) {
    year = year || '2020';
    var date = +echarts.number.parseDate(year + '-02-01');
    var end = +echarts.number.parseDate(year + '-06-29');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
        data.push([
            echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 10000)
        ]);
    }
    return data;
}


// option = {
//     tooltip: {
//         position: 'top',
//         formatter: function(p) {
//             var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
//             return format + ': ' + p.data[1];
//         }
//     },
//     visualMap: {
//         min: 0,
//         max: 1000,
//         calculable: true,
//         orient: 'vertical',
//         left: '120',
//         top: 'center',
//         inRange: {
//             color: COLORS //取值范围的颜色
//         },
//     },

//     calendar: [{
//         top: 5,
//         left: 10,
//         bottom: 5,
//         orient: 'vertical',
//         range: ["2020-02-01", "2020-6-29"],
//         color: '#d6d6d6'
//     }],

//     series: [{
//         type: 'heatmap',
//         coordinateSystem: 'calendar',
//         calendarIndex: 0,
//         data: getVirtulData(2020)
//     }]
// };

var data = getVirtulData(2020);
option = {


    title: {
        top: 0,
        text: 'Total Cases',
        left: 'center',
        textStyle: {
            color: '#d6d6d6'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '30',
        left: '100',
        data: ['Cases', 'Top 12'],
        textStyle: {
            color: '#d6d6d6'
        }
    },
    calendar: [{
        top: 40,
        buttom: 10,
        left: 'center',
        orient: 'vertical',
        range: ['2020-02-02', '2020-06-29'],
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 2,
                type: 'solid'
            }
        },
        itemStyle: {
            color: '#222222',
            borderWidth: 1,
            borderColor: '#111'
        }

    }],
    series: [{
            name: 'Cases',
            type: 'scatter',
            coordinateSystem: 'calendar',
            data: data,
            symbolSize: function(val) {
                return val[1] / 500;
            },
            itemStyle: {
                color: '#ddb926',
                shadowBlur: 0,
                shadowColor: '#eee'
            }
        },
        {
            name: 'Top 10',
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            data: data.sort(function(a, b) {
                return b[1] - a[1];
            }).slice(0, 10),
            symbolSize: function(val) {
                return val[1] / 500;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
                color: '#f4e925',
                shadowBlur: 10,
                shadowColor: '#333'
            },
            zlevel: 1
        }
    ]
};

right2.setOption(option);