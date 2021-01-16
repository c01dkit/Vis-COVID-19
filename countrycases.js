var country = ["美国", "中国", "法国", "日本", "韩国", "俄罗斯", "冰岛", "西班牙"];
var data = [223, 312, 178, 398, 280, 112, 332, 99];
var data_x = [];
var data_y = [];
var i = 0;
while (country[i] && data[i]) {
    data_x.push(data[i]);
    data_y.push(country[i] + ' ' + data[i]);
    i++;
}


var data = [
    ["国家", "累计确诊"],
    ["美国", 223],
    ["中国", 312],
    ["法国", 178],
    ["日本", 398],
    ["韩国", 280],
    ["俄罗斯", 112],
    ["冰岛", 332],
    ["西班牙", 99],
]


var left2 = echarts.init(document.getElementById('left2'));

var option = {
    "color": '#f02512',

    "dataset": {
        "source": data,
    },

    "grid": {
        "width": '85%',
        "left": '8%',
        "right": 40,
        "bottom": 30,
        "top": "10%",
        // "containLabel": true
    },

    "xAxis": [{
        "data": data_x,
        "show": true,
        "type": 'value',
        "name": 'Count',
        "position": 'bottom',
        "filterMode": "none",

    }],
    "yAxis": [{
        "data": data_y,
        "type": "category",
        //"name": "Country",
        //是否反向坐标轴    
        "inverse": true,
        "axisLabel": {
            "color": "#fff",
            "fontSize": 14,
            "fontWeight": "normal",
            "align": 'left',
            "padding": [-80, 0, 0, 10]
        },

        "show": true,
        "splitLine": {
            "show": false,
        },
        "axisTick": {
            "show": false,
        },
        "axisLine": {
            "show": false
        }
    }],
    "toolbox": {
        feature: {
            magicType: {
                type: ['tiled']
            },
            dataView: {
                //backgroundColor: '#222222'
            },
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    "tooltip": {
        "show": false,
        // "trigger": "axis",
        // "axisPointer": {
        //     "type": "shadow"
        // },
    },
    "legend": {
        "show": true,
        "type": "scroll",
        "top": 15,
        "left": "center",
        "textStyle": {
            "color": '#d6d6d6',
            fontSize: 14
        },

    },

    // bar & item
    "series": [{
        "type": "bar",
        "name": "Cases by Country",
        "data": data_x,
        "itemStyle": {
            "barBorderRadius": 8
        },
        "barGap": "50%",
        barCateGoryGap: 20,
        // "stack": "total",
        "label": {
            "color": "#fff",
            "fontSize": 14,
            //"position": [0, '-20'],
            "fontWeight": "normal",
            "show": true,

        },
        /*
        formatter: function(params) {
            str = params.data
            return str
        }, 
        //https://blog.csdn.net/u010976347/article/details/81390107
        */
        "barWidth": 20,
        "animation": true
    }],
    "title": {
        "show": false,
    },
    // 滚动条
    "dataZoom": [{
        type: 'slider',
        show: true,
        "filterMode": "empty",
        "disabled": false,
        yAxisIndex: 0,
        // top: '25%',
        right: '0%',
        // bottom: '15%',
        width: 10,
        start: 0,
        end: 50,
        handleSize: '0', // 滑动条的 左右2个滑动小块的大小
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        textStyle: {
            color: "#fff"
        },
        throttle: 100, //设置触发视图刷新的频率。单位为毫秒（ms）
        zoomLock: false, //是否锁定选择区域（或叫做数据窗口）的大小。如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
        fillerColor: '#787878', // 拖动条的颜色
        borderColor: "none",
        backgroundColor: 'rgba(120, 120, 120, 0.3)',
        moveOnMouseMove: true,
        zoomOnMouseWheel: true,
        showDetail: false // 即拖拽时候是否显示详细数值信息 默认true
    }, ],
}
left2.setOption(option);