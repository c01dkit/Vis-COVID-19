// 数据
var xAxisTime = []; //时间轴
var china_data = []; //中国累计确诊
var us_data = []; //美国累计确诊

// 加入数据后删除此循环
for (var i = 0; i < 100; i++) {
    xAxisTime.push('Date' + i);
    china_data.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
    us_data.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
}

var right3 = echarts.init(document.getElementById('right3')); //初始化

option = {
    title: {
        text: 'China vs US for Cumulative Cases',
        top: 220,
        left: 80,
        align: 'left',
        textStyle: {
            color: '#d6d6d6',
            fontSize: 15
        },
    },
    legend: {
        data: ['CHINA', 'US'],
        show: true,
        top: 15,
        align: 'left',
        textStyle: {
            color: '#9e9e9e',
            fontSize: 12
        },
    },

    toolbox: {
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    tooltip: {},
    xAxis: {
        data: xAxisTime,
        splitLine: {
            show: false
        },
        axisLabel: {
            color: "#9e9e9e",
            align: 'bottom'
        }
    },
    yAxis: {
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dotted' //'solid', 'dashed', 'dotted
            },
            color: ['#222222', '#9e9e9e']
        },
        axisLabel: {
            color: "#9e9e9e"
        }
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
    }, {
        start: 0,
        end: 10,
        // handleIcon: url(".pics/china_logo.png"),
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        },
        fillerColor: 'rgba(0, 0, 0, 0.1)', // 拖动条的颜色
        borderColor: "none",
        //backgroundColor: 'rgba(120, 120, 120, 1)',
        //showDetail: false
    }],
    series: [{
        name: 'CHINA',
        type: 'bar',
        color: 'red',

        data: china_data,
        animationDelay: function(idx) {
            return idx * 10;
        }
    }, {
        name: 'US',
        type: 'bar',
        color: '#1d3c95',
        data: us_data,
        animationDelay: function(idx) {
            return idx * 10 + 100;
        }
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function(idx) {
        return idx * 5;
    }
};

right3.setOption(option);