/* 数据格式演示
var aqiSourceData = {
"北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
}
};
*/

var radioObj = document.getElementsByName('gra-time');
var cityObj = document.getElementById("city-select");

var weekChartData={};
var monthChartData={};

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
var y = dat.getFullYear();
var m = dat.getMonth() + 1;
m = m < 10 ? '0' + m : m;
var d = dat.getDate();
d = d < 10 ? '0' + d : d;
return y + '-' + m + '-' + d;
}



function randomBuildData(seed) {
	var returnData = {};
	var dat = new Date("2016-01-01");
	var datStr = ''
	for (var i = 1; i < 92; i++) {//i是92是因为是三个月，蠢哭
	    datStr = getDateStr(dat);
	    //返回对象数组 math.ceil  向上取整 random返回0-1
	    returnData[datStr] = Math.ceil(Math.random() * seed);
	    dat.setDate(dat.getDate() + 1);
	}
	return returnData;
}

var aqiSourceData = {
"北京": randomBuildData(500),
"上海": randomBuildData(300),
"广州": randomBuildData(200),
"深圳": randomBuildData(100),
"成都": randomBuildData(300),
"西安": randomBuildData(500),
"福州": randomBuildData(100),
"厦门": randomBuildData(100),
"沈阳": randomBuildData(500)
};


// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
nowSelectCity: -1,
nowGraTime: "day"
}

/**
   * 渲染图表
   */
function renderChart() {
	var str="";
	var wrapObj = document.getElementsByClassName("aqi-chart-wrap")[0];
	wrapObj.innerHTML="<div class='title'>"+cityObj[cityObj.selectedIndex].value+"的空气质量柱状图"+"</div>";
	if(pageState.nowGraTime=='day'){
		for(var data in chartData){
			
			str+="<div class='box day'>"
			str+="<div class='bar' style='height:"+ chartData[data] +"px;width:100%;background-color:"+getRandomColor()+";bottom:0;'></div>";
			str+="</div>"
		}
		wrapObj.innerHTML = str;
	}
	
	if(pageState.nowGraTime=='week'){
		for(var data in weekChartData){
			str+="<div class='box week'>"
			str+="<div class='bar' style='height:"+ weekChartData[data] +"px;width:100%;background-color:"+getRandomColor()+";bottom:0;'></div>";
			str+="</div>"
		}
		wrapObj.innerHTML = str;
	}
	
	if(pageState.nowGraTime=='month'){
		for(var data in monthChartData){
			console.log(data+":"+monthChartData[data]);
			str+="<div class='box month'>"
			str+="<div class='bar' style='height:"+ monthChartData[data] +"px;width:100%;background-color:"+getRandomColor()+";bottom:0;'></div>";
			str+="</div>"
		}
		wrapObj.innerHTML = str;
	}
	
	

	
}

/**
   * 日、周、月的radio事件点击时的处理函数
   */
function graTimeChange() {
// 确定是否选项发生了变化
	for(var i = 0;i < radioObj.length;i++){
		if(radioObj[i].checked){
			if(radioObj[i].value != pageState.nowGraTime){
				// 设置对应数据
				pageState.nowGraTime = radioObj[i].value;
				initAqiChartData();
				// 调用图表渲染函数
				renderChart();
			}	
		}
}
			

}

/**
   * select发生变化时的处理函数
   */	
function citySelectChange() {
	var value = cityObj[cityObj.selectedIndex].value;
	// 确定是否选项发生了变化 
	if(pageState.nowSelectCity!=cityObj.selectedIndex){
	// 设置对应数据
		chartData = aqiSourceData[value];
		pageState.nowSelectCity = cityObj.selectedIndex;
		initAqiChartData();
		renderChart();
	}

}

/**
   * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
   */
function initGraTimeForm() {
	for(var i = 0;i<radioObj.length;i++){
		radioObj[i].addEventListener("click",function(){
			graTimeChange();	
		});
	}

}

/**
   * 初始化城市Select下拉选择框中的选项
   */
function initCitySelector() {
// 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	for(var i in aqiSourceData){
			cityObj.options.add(new Option(i));
	}
// 给select设置事件，当选项发生变化时调用函数citySelectChange
cityObj.onchange = citySelectChange;

}

/**
   * 初始化图表需要的数据格式
   */
function initAqiChartData() {
// 将原始的源数据处理成图表需要的数据格式
// 处理好的数据存到 chartData 中

var weekValueSum = 0;
var weekValueAverage = 0;

var monthValueSum = 0;
var monthValueAverage = 0;

	switch(pageState.nowGraTime){
		case "day":	
				var value = cityObj[cityObj.selectedIndex].value;
				chartData = aqiSourceData[value];
				break;
		case "week":
	
				var daySum = 0,weekSum = 0;
				for(var date in chartData){
					daySum++;
					weekValueSum = weekValueSum+chartData[date];
					if(daySum==7){
						weekSum++;
						weekValueAverage = Math.floor(weekValueSum/7);
						weekChartData[weekSum]=weekValueAverage;
						daySum=0;
						weekValueSum=0;
					}
				}
				break;
		case "month":
				var daySum = 0,monthSum = 0;
				for(var date in chartData){
					daySum++;
					monthValueSum = monthValueSum+chartData[date];
					if(daySum==30){
						monthSum++;
						monthValueAverage = Math.floor(monthValueSum/30);
						monthChartData[monthSum]=monthValueAverage;
						daySum=0;
						monthValueSum=0;
					}
				}
				break;
}
	
}


function getRandomColor(){ 
	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); 
} 

/**
   * 初始化函数
   */
function init() {

initGraTimeForm()
initCitySelector();
initAqiChartData();
renderChart();
}

init();

