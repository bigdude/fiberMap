window.onload = function () {
	allMapFunc.main();
}	

var allMapFunc = {
		//版权信息
		copyright: {
			id : 0.1,
			content : "snomis",
		},

		//地图对象
		map: null,

		//marker 的图形对象
		markerIcon: null,

		//图上显示的不可拖拽标注的集合
		markerCollection: [],
		//图上显示的可拖拽标注的集合
		dragMarkerCollection: [],
		//图上显示的连线的集合
		polyLineCollection: [],
		//主操作函数
		main: function () {
			this.initMap();
		},

		initMap: function () {
			//初始化地图
			this.map = new BMap.Map("container");
			var point = new BMap.Point(119.976, 30.544);
			this.map.centerAndZoom(point, 17);
			//this.map.setDefaultCursor("url('01.cur')");        //设置地图默认的鼠标指针样式   
        	//this.map.setDraggingCursor("url('03.cur')");         //设置地图拖拽时的鼠标指针样式  

			//添加控件
			this.addControl();

			//添加右键菜单
			this.addContextMenu(this.map);

			//添加标注
			this.addMarker({
				x: 119.976, 
				y: 30.544,
				drag: true,
			});

			var line = [new BMap.Point(119.976, 30.544), new BMap.Point(120, 31), new BMap.Point(121, 30), new BMap.Point(122, 33),]
			this.addPolyLine(line);

		},

		//添加控件
		addControl: function () {
			//支持鼠标滚轮缩放
			this.map.enableScrollWheelZoom();
			//平移地图控件
			this.map.addControl(new BMap.NavigationControl());
			//缩略地图控件
			this.map.addControl(new BMap.OverviewMapControl());
			//比例尺控件
			var scaleOpts = {offset: new BMap.Size(90, 40)};    
			this.map.addControl(new BMap.ScaleControl(scaleOpts));
			//地图类型控件
			this.map.addControl(new BMap.MapTypeControl());
			//版权信息控件
			//var CopyrightControl = new BMap.CopyrightControl;
			//this.map.addControl(CopyrightControl.addCopyright(this.copyright));
			
			//定位控件
			//var geoOpts = {
			//	anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
			//	offset: new BMap.Size(50, 50)};
			//this.map.addControl(new BMap.GeolocationControl(geoOpts));
		},

		//添加右键菜单
		addContextMenu: function (map) {
			var contextMenu = new BMap.ContextMenu();
			contextMenu.addItem(new BMap.MenuItem(("显示坐标"), this.showLocation.bind(this)));
			contextMenu.addSeparator();  //添加右键菜单的分割线  
			contextMenu.addItem(new BMap.MenuItem(("显示坐标"), this.showLocation.bind(this)));
			contextMenu.addSeparator();
			contextMenu.addItem(new BMap.MenuItem(("显示坐标"), this.showLocation.bind(this)));
			contextMenu.addSeparator();
			//menu.addSeparator(); 
			map.addContextMenu(contextMenu);
		},

		//右击显示地图坐标位置
		showLocation: function (e) {
			var lat = e.lat || 0;
			var lng = e.lng || 0;
			var pointer = new BMap.Point(lng, lat);
			this.openInfoWindow(pointer, ('(' + lng + ',' + lat + ')'), 'location', 220 ,60);
		},

		/*添加标注
			参数 param：
			* x 经度 num
			* y 纬度 num
			* img 标注图片路径 string
			* width 图片宽 num
			* height 图片高 num
			* drag 标注是否拖动 boolean
			* dragFunc 拖动函数 function
		*/
		addMarker: function (param) {
			var x = param.x || 0;
			var y = param.y || 0; 
			var ifDrag = param.drag || false;
			var width = param.width || 23;
			var height = param.height || 25;
			var markerIcon = this.markerIcon;
			var point = new BMap.Point(x, y);
			if(param.img) {
				var markerIcon = new BMap.Icon(param.img, new BMap.Size(width, height),{
					//指定标注所指的位置偏移，距离图片左上角位置
					offset: new BMap.Size(10, 25),
					//指定图片显示的偏移量
					imageOffset: new BMap.Size(0, -5)
				});
				var marker = new BMap.Marker(point, {icon: markerIcon});
			} else {
				var marker = new BMap.Marker(point);
			}
			this.map.addOverlay(marker);
			//点击marker显示坐标值
			marker.addEventListener('click', this.showMarkerInfo);

			if(ifDrag) {
				marker.enableDragging();
				if(param.dragFunc) {    
					marker.addEventListener("dragend", param.dragFunc);
				}
				this.dragMarkerCollection.push(marker);
			} else {
				this.markerCollection.push(marker);
			}
		},

		showMarkerInfo: function (e) {
			var lat = e.target.wm.lat || 0;
			var lng = e.target.wm.lng || 0;
			var opts = {
				width: 220,
				height: 60,
				title: '坐标'
			};
			var pointer = new BMap.Point(lng, lat);
			var infoWindow = new BMap.InfoWindow('(' + lng + ',' + lat + ')', opts);
			this.map.openInfoWindow(infoWindow, pointer);
		},

		/*绘制折线
			* pointer 连接点的坐标 Array(BMap.Point)
		*/
		addPolyLine: function (pointer) {
			var polyline = new BMap.Polyline(pointer,{strokeColor:"rgb(255,0,0)", strokeWeight:6, strokeOpacity:0.9});
			this.map.addOverlay(polyline);
			this.polyLineCollection.push(polyline);
		},

		//删除指定覆盖物
		removeMarker: function(Element) {
			this.map.removeOverlay(Element);
			Element.dispose();
		},

		//删除所有覆盖物
		removeAllOverLay: function () {
			clearOverlays();
		},
		/*信息窗口
			* pointer 地图坐标对象 new BMap.Point(x, y)
			* info 显示信息 string
			* title 文本标题 string
		*/
		openInfoWindow: function (pointer, info, title, boxWidth, boxHeight) {
			var boxWidth = boxWidth || 220;
			var boxHeight = boxHeight || 60;
			var title = title || '';
			var opts = {
				width: boxWidth,
				height: boxHeight,
				title: title
			};
			var infoWindow = new BMap.InfoWindow(info, opts);
			this.map.openInfoWindow(infoWindow, pointer);
		},
		
}

