var map = echarts.init(document.getElementById('map'));//初始化			
var COLORS = ["#ffffff", "#faebd2", "#e9a188", "#d56355", "#bb3937", "#772526", "#480f10"];//图例里的颜色
var dataList=[//数据
			    {name:"China",value:100},
			    {name:"United States",value:1000},
			]
			
	var option={//配置项（名称）
		
				tooltip: {//提示框组件
						formatter:function(params,ticket, callback){//提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
							return params.seriesName+'<br />'+params.name+'：'+params.value
						}//数据格式化
					},
				backgroundColor:'#eeeeee',//背景色
				visualMap: {//visualMap 是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
					type: 'piecewise',//分段型视觉映射组件
					orient: 'horizontal',//方向

					left: 'left',//位置
					top: 'bottom',//位置
	
                    pieces: [
                        //自定义『分段式视觉映射组件』的每一段的范围，以及每一段的文字，以及每一段的特别的样式。
                        { value: 0, color: COLORS[0]},
                        { min: 1, max: 9, color: COLORS[1] },
                        { min: 10, max: 99, color: COLORS[2]},
                        { min: 100, max: 499, color: COLORS[3]},
                        { min: 500, max: 999, color: COLORS[4]},
                        { min: 1000, max: 10000, color: COLORS[5]}, 
                        { min: 10000, color: COLORS[6]}],
					inRange: {
						color:COLORS //取值范围的颜色
					},
					
					show:true//图注
				},
				geo: {//地理坐标系组件用于地图的绘制
					map: 'world',
                    roam: true,//开启缩放与平移
					zoom:1.23,//视角缩放比例
					label: {
						normal: {
							show: false,//默认不显示文本
							fontSize:'10',
							color: 'rgba(0,0,0,0.7)'
						}
					},
					itemStyle: {
						normal:{
							borderColor: 'rgba(0, 0, 0, 0.2)'
						},
						emphasis:{
							areaColor: '#F3B329',//鼠标选择区域颜色
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							shadowBlur: 20,
							borderWidth: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				},
				series : [//系列列表。（图表）
					{
						name: '疫情人数',
						type: 'map',//图表类型
                        geoIndex: 0,
						data:dataList//图表的数据
					}
				]
			}
map.setOption(option);//用配置项配置（动词）echarts