// 全局变量
// worldmap
const oneDay = 24 * 3600 * 1000;
const base = +new Date(2020, 2, 1);
var fileName = "./data/2020-2-1.json"
var previousProgressBarValue = null
var previousSelector = null
var globalData = null
var dataList = [ //数据

]

// drawContrast
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

// countrycases
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
    { country: '美国', data: 223 },
    { country: '中国', data: 312 },
    { country: '法国', data: 178 },
    { country: '日本', data: 398 },
    { country: '韩国', data: 280 },
    { country: '俄罗斯', data: 112 },
    { country: '冰岛', data: 332 },
    { country: '西班牙', data: 99 },
]

// functions
function drawMap() {
    var map = echarts.init(document.getElementById('map')); //初始化
    var COLORS = ["#eeeeee", "#faebd2", "#FFDEAD", "#FF7F50", "#FF4500", "#FF0000", "#CD0000"]; //图例里的颜色
    var option = { //配置项（名称）

        tooltip: { //提示框组件
            formatter: function(params, ticket, callback) { //提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
                    return params.seriesName + '<br />' + params.name + '：' + params.value
                } //数据格式化
        },

        backgroundColor: '#030f19', //背景色
        visualMap: { //visualMap 是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
            type: 'piecewise', //分段型视觉映射组件
            orient: 'horizontal', //方向

            left: 'left', //位置
            top: 'bottom', //位置
            textStyle: {
                color: '#d6d6d6'
            },
            pieces: [
                { value: 0, color: COLORS[0] },
                { min: 1, max: 9, color: COLORS[1] },
                { min: 10, max: 99, color: COLORS[2] },
                { min: 100, max: 499, color: COLORS[3] },
                { min: 500, max: 999, color: COLORS[4] },
                { min: 1000, max: 10000, color: COLORS[5] },
                { min: 10000, color: COLORS[6] }
            ],
            inRange: {
                color: COLORS //取值范围的颜色
            },

            show: true //图注
        },
        geo: { //地理坐标系组件用于地图的绘制
            map: 'world',
            roam: true, //开启缩放与平移
            zoom: 1.23, //视角缩放比例
            scaleLimit: {
                min: 1.2,
                max: 7,
            },
            label: {
                normal: {
                    show: false, //默认不显示文本
                    fontSize: '10',
                    color: 'rgba(0,0,0,0.7)'
                }

            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    areaColor: '#eeeeee'
                },
                emphasis: {
                    areaColor: '#F3B329', //鼠标选择区域颜色
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: '#eeeeee'
                }
            }
        },
        series: [ //系列列表。（图表）
            {
                name: '疫情人数',
                type: 'map', //图表类型
                geoIndex: 0,
                data: dataList //图表的数据
            }
        ]
    }
    map.setOption(option); //用配置项配置（动词）echarts
}


$(document).ready(function() {
    refreshAll("2020-2-1", "total_diagnosed");
    setInterval(checkIfUpdated, 200)
})

function checkIfUpdated() {
    let needUpdate = false;
    const dateDisp = parseInt($("#progress").val())
    if (dateDisp !== previousProgressBarValue || previousProgressBarValue == null) {
        previousProgressBarValue = dateDisp
        needUpdate = true
    }
    const selector = $("select  option:selected").val();
    if (selector !== previousSelector || previousSelector == null) {
        previousSelector = selector
        needUpdate = true
    }
    if (needUpdate) {
        const now = new Date(base + oneDay * dateDisp);
        const name = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');
        refreshAll(name, selector)
    }
}

function updateLeftPanel(param) {
    if (previousSelector === "new_diagnosed") {
        $("#globaldata").text(globalData.new_diagnosed)
        $("#gloabaltype").text(param + " 全球新增确诊")
    } else if (previousSelector === "total_diagnosed") { // 加载累计确诊病例数据
        $("#globaldata").text(globalData.total_diagnosed)
        $("#gloabaltype").text(param + " 全球累计确诊")
    } else if (previousSelector === "total_death") { // 加载累计死亡病例数据
        $("#globaldata").text(globalData.total_death)
        $("#gloabaltype").text(param + " 全球累计死亡")
    } else if (previousSelector === "new_death") { // 加载新增死亡病例数据
        $("#globaldata").text(globalData.new_death)
        $("#gloabaltype").text(param + " 全球新增死亡")
    } else if (previousSelector === "total_healed") { // 加载累计治愈数据
        $("#globaldata").text(globalData.total_healed)
        $("#gloabaltype").text(param + " 全球累计治愈")
    } else if (previousSelector === "still_healing") { // 加载仍处于治疗阶段数据
        $("#globaldata").text(globalData.still_healing)
        $("#gloabaltype").text(param + " 全球仍在治愈")
    } else if (previousSelector === "seriously_ill") { // 加载病危数据
        $("#globaldata").text(globalData.seriously_ill)
        $("#gloabaltype").text(param + " 全球重症病例")
    }
}



function refreshAll(dateName, selector) {
    if (dateName !== null) {
        fileName = "./data/" + dateName + ".json";
    }
    $.get(fileName).fail(function(dataSet) {
        let resultData = eval("(" + dataSet.responseText + ")");
        let finalSets = resultData.inner_value;
        globalData = finalSets[0];
        dataList.splice(0, dataList.length);
        if (selector === "new_diagnosed") { // 加载新增确诊病例数据
            for (item of finalSets) {
                dataList.push({ name: item.region, value: item.new_diagnosed });
            }
        } else if (selector === "total_diagnosed") { // 加载累计确诊病例数据
            for (item of finalSets) {
                dataList.push({ name: item.region, value: item.total_diagnosed });
            }
        } else if (selector === "total_death") { // 加载累计死亡病例数据
            for (item of finalSets) {
                dataList.push({ name: item.region, value: item.total_death });
            }
        } else if (selector === "new_death") { // 加载新增死亡病例数据
            for (item of finalSets) {
                dataList.push({ name: item.region, value: item.new_death });
            }
        } else if (selector === "total_healed") { // 加载累计治愈数据
            for (item of finalSets) {
                dataList.push({ name: item.region, value: item.total_healed });
            }
        } else if (selector === "still_healing") { // 加载仍处于治疗阶段数据
            for (item of finalSets) {
                dataList.push({ name: item.region, value: item.still_healing });
            }
        } else if (selector === "seriously_ill") { // 加载病危数据
            for (item of finalSets) {
                dataList.push({ name: item.region, value: item.seriously_ill });
            }
        }
        drawMap()
        drawContrast()
        drawRadar()
        drawCountryCases()
        updateLeftPanel(dateName)
    });
}


function drawContrast() {

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
}


function drawRadar() {
    var radar = echarts.init(document.getElementById('right12')); //初始化

    // Schema:
    // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
    var dataBJ = [
        [55, 9, 56, 0.46, 18, 6, 1],
        [25, 11, 21, 0.65, 34, 9, 2],
        [56, 7, 63, 0.3, 14, 5, 3],
        [33, 7, 29, 0.33, 16, 6, 4],
        [42, 24, 44, 0.76, 40, 16, 5],
        [82, 58, 90, 1.77, 68, 33, 6],
        [74, 49, 77, 1.46, 48, 27, 7],
        [78, 55, 80, 1.29, 59, 29, 8],
        [267, 216, 280, 4.8, 108, 64, 9],
        [185, 127, 216, 2.52, 61, 27, 10],
        [39, 19, 38, 0.57, 31, 15, 11],
        [41, 11, 40, 0.43, 21, 7, 12],
        [64, 38, 74, 1.04, 46, 22, 13],
        [108, 79, 120, 1.7, 75, 41, 14],
        [108, 63, 116, 1.48, 44, 26, 15],
        [33, 6, 29, 0.34, 13, 5, 16],
        [94, 66, 110, 1.54, 62, 31, 17],
        [186, 142, 192, 3.88, 93, 79, 18],
        [57, 31, 54, 0.96, 32, 14, 19],
        [22, 8, 17, 0.48, 23, 10, 20],
        [39, 15, 36, 0.61, 29, 13, 21],
        [94, 69, 114, 2.08, 73, 39, 22],
        [99, 73, 110, 2.43, 76, 48, 23],
        [31, 12, 30, 0.5, 32, 16, 24],
        [42, 27, 43, 1, 53, 22, 25],
        [154, 117, 157, 3.05, 92, 58, 26],
        [234, 185, 230, 4.09, 123, 69, 27],
        [160, 120, 186, 2.77, 91, 50, 28],
        [134, 96, 165, 2.76, 83, 41, 29],
        [52, 24, 60, 1.03, 50, 21, 30],
        [46, 5, 49, 0.28, 10, 6, 31]
    ];

    var dataGZ = [
        [26, 37, 27, 1.163, 27, 13, 1],
        [85, 62, 71, 1.195, 60, 8, 2],
        [78, 38, 74, 1.363, 37, 7, 3],
        [21, 21, 36, 0.634, 40, 9, 4],
        [41, 42, 46, 0.915, 81, 13, 5],
        [56, 52, 69, 1.067, 92, 16, 6],
        [64, 30, 28, 0.924, 51, 2, 7],
        [55, 48, 74, 1.236, 75, 26, 8],
        [76, 85, 113, 1.237, 114, 27, 9],
        [91, 81, 104, 1.041, 56, 40, 10],
        [84, 39, 60, 0.964, 25, 11, 11],
        [64, 51, 101, 0.862, 58, 23, 12],
        [70, 69, 120, 1.198, 65, 36, 13],
        [77, 105, 178, 2.549, 64, 16, 14],
        [109, 68, 87, 0.996, 74, 29, 15],
        [73, 68, 97, 0.905, 51, 34, 16],
        [54, 27, 47, 0.592, 53, 12, 17],
        [51, 61, 97, 0.811, 65, 19, 18],
        [91, 71, 121, 1.374, 43, 18, 19],
        [73, 102, 182, 2.787, 44, 19, 20],
        [73, 50, 76, 0.717, 31, 20, 21],
        [84, 94, 140, 2.238, 68, 18, 22],
        [93, 77, 104, 1.165, 53, 7, 23],
        [99, 130, 227, 3.97, 55, 15, 24],
        [146, 84, 139, 1.094, 40, 17, 25],
        [113, 108, 137, 1.481, 48, 15, 26],
        [81, 48, 62, 1.619, 26, 3, 27],
        [56, 48, 68, 1.336, 37, 9, 28],
        [82, 92, 174, 3.29, 0, 13, 29],
        [106, 116, 188, 3.628, 101, 16, 30],
        [118, 50, 0, 1.383, 76, 11, 31]
    ];

    var dataSH = [
        [91, 45, 125, 0.82, 34, 23, 1],
        [65, 27, 78, 0.86, 45, 29, 2],
        [83, 60, 84, 1.09, 73, 27, 3],
        [109, 81, 121, 1.28, 68, 51, 4],
        [106, 77, 114, 1.07, 55, 51, 5],
        [109, 81, 121, 1.28, 68, 51, 6],
        [106, 77, 114, 1.07, 55, 51, 7],
        [89, 65, 78, 0.86, 51, 26, 8],
        [53, 33, 47, 0.64, 50, 17, 9],
        [80, 55, 80, 1.01, 75, 24, 10],
        [117, 81, 124, 1.03, 45, 24, 11],
        [99, 71, 142, 1.1, 62, 42, 12],
        [95, 69, 130, 1.28, 74, 50, 13],
        [116, 87, 131, 1.47, 84, 40, 14],
        [108, 80, 121, 1.3, 85, 37, 15],
        [134, 83, 167, 1.16, 57, 43, 16],
        [79, 43, 107, 1.05, 59, 37, 17],
        [71, 46, 89, 0.86, 64, 25, 18],
        [97, 71, 113, 1.17, 88, 31, 19],
        [84, 57, 91, 0.85, 55, 31, 20],
        [87, 63, 101, 0.9, 56, 41, 21],
        [104, 77, 119, 1.09, 73, 48, 22],
        [87, 62, 100, 1, 72, 28, 23],
        [168, 128, 172, 1.49, 97, 56, 24],
        [65, 45, 51, 0.74, 39, 17, 25],
        [39, 24, 38, 0.61, 47, 17, 26],
        [39, 24, 39, 0.59, 50, 19, 27],
        [93, 68, 96, 1.05, 79, 29, 28],
        [188, 143, 197, 1.66, 99, 51, 29],
        [174, 131, 174, 1.55, 108, 50, 30],
        [187, 143, 201, 1.39, 89, 53, 31]
    ];

    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.5
        }
    };

    option = {
        backgroundColor: '#222222',
        title: {
            text: 'Single Country',
            left: 10,
            top: 10,
            textStyle: {
                color: '#696969',
                fontSize: 15
            }
        },
        legend: {
            bottom: 5,
            data: ['China', 'US', 'Korea'],
            itemGap: 20,
            textStyle: {
                color: '#d6d6d6',
                fontSize: 12
            },
            // selectedMode: 'single'
        },
        // visualMap: {
        //     show: true,
        //     min: 0,
        //     max: 20,
        //     dimension: 6,
        //     inRange: {
        //         colorLightness: [0.5, 0.8]
        //     }
        // },
        radar: {
            indicator: [
                { name: 'NC', max: 300 },
                { name: 'CC', max: 300 },
                { name: 'ND', max: 300 },
                { name: 'CD', max: 5 },
                { name: 'UT', max: 200 },
                { name: 'CR', max: 100 }
            ],
            shape: 'circle',
            splitNumber: 5,
            name: {
                textStyle: {
                    color: 'rgb(238, 197, 102)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                        'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                        'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(238, 197, 102, 0.5)'
                }
            }
        },
        series: [{
                name: 'China',
                type: 'radar',
                lineStyle: lineStyle,
                data: dataBJ,
                symbol: 'none',
                itemStyle: {
                    color: '#F9713C'
                },
                areaStyle: {
                    opacity: 0.1
                }
            },
            {
                name: 'US',
                type: 'radar',
                lineStyle: lineStyle,
                data: dataSH,
                symbol: 'none',
                itemStyle: {
                    color: '#B3E4A1'
                },
                areaStyle: {
                    opacity: 0.05
                }
            },
            {
                name: 'Korea',
                type: 'radar',
                lineStyle: lineStyle,
                data: dataGZ,
                symbol: 'none',
                itemStyle: {
                    color: 'rgb(238, 197, 102)'
                },
                areaStyle: {
                    opacity: 0.05
                }
            }
        ]
    };

    radar.setOption(option);
}

function drawCountryCases() {
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
            "show": false,
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
            // "data": data_x,
            "data": data_x.sort(function(a, b) {
                return b - a;
            }),
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
                str = params.data.data + params.country
                return str
            },
            */
            //https://blog.csdn.net/u010976347/article/details/81390107

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
}