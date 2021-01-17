// 全局变量与状态保存
const oneDay = 24 * 3600 * 1000; // 24h毫秒数 用于计算日期偏移
const base = +new Date(2020, 2, 1);

var fileName = "./data/2020-2-1.json"; // 预加载文件
var previousProgressBarValue = null; // 置空进度条数值
var previousSelector = null; // 置空下拉列表值
const caseType = ['累计确诊', '新增确诊', '累计死亡', '新增死亡', '累计治愈', '仍在治疗', '重症病例']
const caseTypeEN = ['total_diagnosed', 'new_diagnosed', 'total_death', 'new_death', 'total_healed', 'still_healing', 'seriously_ill']
    // 左上全球数据
var globalData = null; // 置空左上全球数据


// 左下国家对比图
const maxNum = 5; // 设定最大排名数目
let countryCasesType = "----";
var countryCasesDataX = [];
var countryCasesDataY = [];

// 中部地图数据
var mapDataList = [] // 置空中间地图数据

// 右上雷达图
var radarDataList = [] // 置空右上雷达图数据
var radarCountryName = "未选择"
var radarMaxValue = [] // 右上雷达图最大值限定

// 右下中美对比
const contrastTitle = '中美对比'
var contrastXAxisTime = []; //时间轴
var semaphore = 0; // 采用异步加载 定时器检查完成后重载
var china_data = []; //中国累计确诊
var us_data = []; //美国累计确诊


for (let i = 0; i < 144; i++) {
    let now = new Date(base + oneDay * i);
    const timeName = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');
    contrastXAxisTime.push(timeName.replaceAll("-", "/"));
}

function checkIfUpdated(compulsory) {

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
    if (needUpdate || compulsory) {
        const now = new Date(base + oneDay * dateDisp);
        const name = [now.getFullYear(), now.getMonth(), now.getDate()].join('-');
        refreshAll(name, selector)
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
        mapDataList.splice(0, mapDataList.length);
        countryCasesDataY.splice(0, countryCasesDataY.length);
        countryCasesDataX.splice(0, countryCasesDataX.length);
        radarDataList.splice(0, radarDataList.length);
        for (let i = 0; i < caseTypeEN.length; i++) {
            if (selector === caseTypeEN[i]) {
                let j = 0;
                for (item of finalSets) {
                    let tempName = item.region;
                    let tempValue = eval("item." + caseTypeEN[i]);
                    // 更新中部全球地图
                    mapDataList.push({ name: tempName, value: tempValue });
                    // 更新左下国家排名图
                    j++;
                    if (j < maxNum && j > 1) { // 跳过全球数据
                        countryCasesDataX.push(tempValue);
                        countryCasesDataY.push(tempName);
                    }
                    // 更新右上雷达图
                    if (tempName === radarCountryName) {
                        radarDataList.push([
                                eval("item." + caseTypeEN[0]),
                                eval("item." + caseTypeEN[1]),
                                eval("item." + caseTypeEN[2]),
                                eval("item." + caseTypeEN[3]),
                                eval("item." + caseTypeEN[4]),
                                eval("item." + caseTypeEN[5]),
                                eval("item." + caseTypeEN[6]),
                            ])
                            //TODO: 这里雷达图的最大值姑且这样用了。 最大值怎么确定合适呢？ 而且雷达图如果堆叠的话需要请求多个json，数据源还需要处理。

                        radarMaxValue.push([
                            eval("item." + caseTypeEN[0]) + 200,
                            eval("item." + caseTypeEN[1]) + 200,
                            eval("item." + caseTypeEN[2]) + 200,
                            eval("item." + caseTypeEN[3]) + 200,
                            eval("item." + caseTypeEN[4]) + 200,
                            eval("item." + caseTypeEN[5]) + 200,
                            eval("item." + caseTypeEN[6]) + 200,
                        ])
                    }
                }
                break;
            }
        }
        updateTextBySelector(dateName)
        drawMiddleMap()
        drawRightTopRadar()
        drawLeftBottomCountryCases()
    });


    $.get("./data/China.json").done(function(dataSet) {
        let finalSets = dataSet.inner_value;
        console.log("load China")
        china_data.splice(0, china_data.length)
        for (i of finalSets) {
            china_data.push(eval("i." + previousSelector))
        }
        semaphore += 1;
        if (semaphore === 2) {
            semaphore = 0;
            drawRightBottomContrast()
        }
    })

    $.get("./data/America.json").fail(function(dataSet) {
        let resultData = eval("(" + dataSet.responseText + ")");
        let finalSets = resultData.inner_value;
        // let finalSets = dataSet.inner_value;
        console.log("load us")
        us_data.splice(0, us_data.length)
        for (i of finalSets) {
            us_data.push(eval("i." + previousSelector))
        }
        semaphore += 1;
        if (semaphore === 2) {
            semaphore = 0;
            drawRightBottomContrast()
        }
    })
}

// 根据下拉框重绘所有文字部分
function updateTextBySelector(param) {
    for (var i = 0; i < caseTypeEN.length; i++) {
        if (previousSelector === caseTypeEN[i]) {
            $("#globaldata").text(eval("globalData." + caseTypeEN[i]))
            $("#gloabaltype").text(param + " 全球" + caseType[i])
            countryCasesType = caseType[i]
            break
        }
    }
}

// 重绘左下国家对比图
function drawLeftBottomCountryCases() {
    var left2 = echarts.init(document.getElementById('left2'));
    var option = {
        color: '#f02512',
        grid: {
            width: '85%',
            left: '8%',
            right: 40,
            bottom: 30,
            top: "10%",
            // "containLabel": true
        },

        xAxis: [{
            data: countryCasesDataX,
            show: false,
            type: 'value',
            name: 'Count',
            position: 'bottom',
            filterMode: "none",

        }],
        yAxis: [{
            data: countryCasesDataY,
            type: "category",
            //"name": "Country",
            //是否反向坐标轴
            inverse: true,
            axisLabel: {
                color: "#fff",
                fontSize: 14,
                fontWeight: "normal",
                align: 'left',
                padding: [-80, 0, 0, 10]
            },

            show: true,
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false
            }
        }],
        toolbox: {
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
        tooltip: {
            show: false,
            // "trigger": "axis",
            // "axisPointer": {
            //     "type": "shadow"
            // },
        },
        legend: {
            show: true,
            type: "scroll",
            top: 15,
            left: "center",
            textStyle: {
                color: '#d6d6d6',
                fontSize: 14
            },

        },

        // bar & item
        series: [{

            type: "bar",
            name: countryCasesType,
            // "data": data_x,
            data: countryCasesDataX.sort(function(a, b) {
                return b - a;
            }),
            itemStyle: {
                "barBorderRadius": 8
            },

            barGap: "50%",
            barCateGoryGap: 20,
            // "stack": "total",
            label: {
                color: "#fff",
                fontSize: 14,
                //"position": [0, '-20'],
                fontWeight: "normal",
                show: true,

            },

            /*
            formatter: function(params) {
                str = params.data.data + params.country
                return str
            },
            */
            //https://blog.csdn.net/u010976347/article/details/81390107

            barWidth: 20,
            animation: true
        }],
        title: {
            show: false,
        },
        // 滚动条

        dataZoom: [{
            type: 'slider',
            show: true,
            filterMode: "empty",
            disabled: false,
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

// 重绘中部地图
function drawMiddleMap() {
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
        toolbox: {
            feature: {
                magicType: {
                    type: ['tiled']
                }
            }
        },
        series: [ //系列列表。（图表）
            {
                name: '疫情人数',
                type: 'map', //图表类型
                geoIndex: 0,
                data: mapDataList //图表的数据
            }
        ]
    }
    map.setOption(option); //用配置项配置（动词）echarts
    map.on('click', function(param) {
        radarCountryName = param.name
        checkIfUpdated(true)
    })
}

// 重绘右上雷达图
function drawRightTopRadar() {
    var radar = echarts.init(document.getElementById('right12')); //初始化

    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.5
        }
    };

    option = {
        backgroundColor: '#222222',
        title: {
            text: radarCountryName,
            left: 10,
            top: 10,
            textStyle: {
                color: '#696969',
                fontSize: 15
            }
        },
        legend: {
            bottom: 5,
            data: [radarCountryName],
            itemGap: 20,
            textStyle: {
                color: '#d6d6d6',
                fontSize: 12
            },
        },
        radar: {
            indicator: [
                { name: caseType[0], max: radarMaxValue[0] },
                { name: caseType[1], max: radarMaxValue[1] },
                { name: caseType[2], max: radarMaxValue[2] },
                { name: caseType[3], max: radarMaxValue[3] },
                { name: caseType[4], max: radarMaxValue[4] },
                { name: caseType[5], max: radarMaxValue[5] },
                { name: caseType[6], max: radarMaxValue[6] },
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
        tooltip: {

        },
        series: [{
                name: radarCountryName,
                type: 'radar',
                lineStyle: lineStyle,
                data: radarDataList,
                symbol: 'none',
                itemStyle: {
                    color: '#F9713C'
                },
                areaStyle: {
                    opacity: 0.1
                }
            },

        ]
    };

    radar.setOption(option);
}

// 重绘右下中美对比图
function drawRightBottomContrast() {

    var right3 = echarts.init(document.getElementById('right3')); //初始化

    option = {
        title: {
            text: contrastTitle,
            top: 220,
            left: 80,
            align: 'left',
            textStyle: {
                color: '#d6d6d6',
                fontSize: 15
            },
        },
        legend: {
            data: ['中国', '美国'],
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
            data: contrastXAxisTime,
            splitLine: {
                show: false
            },
            axisLabel: {
                color: "#9e9e9e",
                align: 'bottom',
            }
        },
        grid: {
            x: 80,
            y: 60,
            x2: 40,
            y2: 60,
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
            name: '中国',
            type: 'bar',
            color: 'red',

            data: china_data,
            animationDelay: function(idx) {
                return idx * 10;
            }
        }, {
            name: '美国',
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

$(document).ready(function() {
    refreshAll("2020-2-1", caseTypeEN[0])
    setInterval(checkIfUpdated, 200)
})