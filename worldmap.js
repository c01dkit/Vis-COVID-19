var dataList = [ //数据
	{ name: "中国", value: 100 },
	{ name: "美国", value: 100000 },
	{ name: "巴西", value: 1 },
	{ name: "法国", value: 10 },
	{ name: "印度", value: 10000 },
	{ name: "格兰陵岛", value: 10 },
	{ name: "俄罗斯", value: 500 },
]
drawMap();
function drawMap() {
	var map = echarts.init(document.getElementById('map'));//初始化
	// var COLORS = ["#ffffff", "#faebd2", "#e9a188", "#d56355", "#bb3937", "#772526", "#480f10"];//图例里的颜色
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
			scaleLimit:{
				min:1.2,
				max:7,
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
	map.setOption(option);//用配置项配置（动词）echarts
}


$(document).ready(function (){
	$("#title").click(function (){
		getDataListByDate("2020-2-1")
	})
})

function progressBarChnge() {
	const param = parseInt($("#progress").val())
	var base = +new Date(2020, 2, 1);
	var oneDay = 24 * 3600 * 1000;
	var now = new Date(base + oneDay*param)
	var name = [now.getFullYear(), now.getMonth(), now.getDate()].join('-')
	getDataListByDate(name)
	console.log(name)
}

function getDataListByDate(param){
	const file = "./data/" + param + ".json";
	$.get(file).fail(function (dataSet){
		let resultData = eval("(" + dataSet.responseText + ")");
		// console.log(resultData);
		let finalSets = resultData.inner_value;
		dataList.splice(0,dataList.length);
		for (item of finalSets){
			dataList.push({name:item.region,value:item.total_diagnosed})
		}
	});
	drawMap()
}
