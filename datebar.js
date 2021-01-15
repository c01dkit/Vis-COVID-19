var base = +new Date(2020, 2, 1);
var oneDay = 24 * 3600 * 1000;
var date = [];

//var data = [Math.random() * 300];

for (var i = 1; i < 2000; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    //data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}


var progress = echarts.init(document.getElementById('progress'));

var option = {

    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {

    },

    dataZoom: [{
        type: 'slider',
        start: 10,
        end: 20,

    }, {
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        },
        fillerColor: '#222222', // 拖动条的颜色
        borderWidth: 10,
        borderColor: "black",
        backgroundColor: 'rgba(120, 120, 120, 0.3)',

    }],
}


progress.setOption(option);