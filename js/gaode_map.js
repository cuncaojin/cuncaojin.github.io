var map, geolocation;
var hotel = "锦伦商务酒店";
var myIconStyles = ['red', 'darkblue', 'orchid', 'green', 'gray', 'salmon', 'pink'];
// 标记
var marker;

window.init = function() {
	//加载地图，调用浏览器定位服务
	var map = new AMap.Map('container', {
		resizeEnable: true,
		zoom: 14,
		center: [116.437911, 33.930480]
		// center: [116.438201, 33.930508]

	});

	// 省市区级别条
	AMap.plugin(['AMap.ToolBar'], function() {
		map.addControl(new AMap.ToolBar({
			map: map
		}));
	});
	AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
		initPage(SimpleMarker);
	});

	function initPage(SimpleMarker) {
		//内置的样式
		var iconStyles = SimpleMarker.getBuiltInIconStyles('fresh');
		var iconIdx = 0;
		var marker = new SimpleMarker({
			iconTheme: 'fresh',
			iconStyle: myIconStyles[iconIdx],
			iconLabel: {
				innerHTML: '<b>' + hotel.charAt(iconIdx) + '</b>',
				style: {
					color: '#fff',
					fontSize: '120%',
					marginTop: '2px'
				}
			},
			map: map,
			position: map.getCenter(),
			label: {
				content: '<div style="text-align:center;">锦伦<br/>&nbsp;&nbsp;商务酒店&nbsp;&nbsp;</div>',
				offset: new AMap.Pixel(30, 26),
			},

		});

		function switchIcon() {
			iconIdx = (++iconIdx) % hotel.length;
			marker.setIconStyle(myIconStyles[iconIdx]);
			marker.setIconLabel({
				innerHTML: '<b>' + hotel.charAt(iconIdx) + '</b>'
			});
		}
		setInterval(switchIcon, 700);
	}

	//缩放级别按钮
	AMap.event.addDomListener(document.getElementById('setCenter'), 'click', function() {
		// 设置缩放级别和中心点
		map.setZoomAndCenter(8, [116.438201, 33.930508]);
		// 在新中心点添加 marker 
		//				marker = new AMap.Marker({
		//						map: map,
		//						position: [116.438201, 33.930508]
		//					});
	});
	AMap.event.addDomListener(document.getElementById('setCenter2'), 'click', function() {
		map.setZoomAndCenter(14, [116.438201, 33.930508]);
	});
	AMap.event.addDomListener(document.getElementById('setCenter3'), 'click', function() {
		map.setZoomAndCenter(18, [116.438201, 33.930508]);
	});

	// 定位
	map.plugin('AMap.Geolocation', function() {
		geolocation = new AMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			buttonPosition: 'RB',
			buttonOffset: new AMap.Pixel(10, 200)
		});
		map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	});

}

//解析定位结果
function onComplete(data) {
	var str = ['定位成功'];
	str.push('经度：' + data.position.getLng());
	str.push('纬度：' + data.position.getLat());
	if(data.accuracy) {
		str.push('精度：' + data.accuracy + ' 米');
	} //如为IP精确定位结果则没有精度信息
	str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
	document.getElementById('tip').innerHTML = str.join('<br>');
}
//解析定位错误信息
function onError(data) {
	document.getElementById('tip').innerHTML = '定位失败';
}

/**
 * 返回一批网格排列的经纬度
 * @param  {AMap.LngLat} center 网格中心
 * @param  {number} colNum 列数
 * @param  {number} size  总数
 * @param  {number} cellX  横向间距
 * @param  {number} cellY  竖向间距
 * @return {Array}  返回经纬度数组
 */
function getGridLngLats(center, colNum, size, cellX, cellY) {
	var pxCenter = map.lnglatToPixel(center);
	var rowNum = Math.ceil(size / colNum);
	var startX = pxCenter.getX(),
		startY = pxCenter.getY();
	cellX = cellX || 70;
	cellY = cellY || 70;
	var lngLats = [];
	for(var r = 0; r < rowNum; r++) {
		for(var c = 0; c < colNum; c++) {
			var x = startX + (c - (colNum - 1) / 2) * (cellX);
			var y = startY + (r - (rowNum - 1) / 2) * (cellY);
			lngLats.push(map.pixelToLngLat(new AMap.Pixel(x, y)));
			if(lngLats.length >= size) {
				break;
			}
		}
	}
	return lngLats;
};