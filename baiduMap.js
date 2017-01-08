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

		//移动鼠标是否显示L经纬度
		ifShowLoLabel: false,
		//移动鼠标显示经纬度的标签
		LocationLabel: null,
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

			//地图添加右键菜单
			this.addMapContextMenu(this.map);

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

			//显示经纬度
			this.addLocationIcon();
		},

		//自定义显示经纬度控件
		addLocationIcon: function () {
			var This = this;
			function ZoomControl() {
				this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;    
    			this.defaultOffset = new BMap.Size(30, 30);    
			}
			ZoomControl.prototype = new BMap.Control();
			ZoomControl.prototype.initialize = function(map){    
				// 创建一个DOM元素   
				 var div = document.createElement("div");
				 var img = new Image();
				 img.src = "./images/locationIcon.png";
				 div.appendChild(img);         
				 // 设置样式
				 img.style.display = "block";
				 img.style.position = "relative";
				 img.style.width = "25px";
				 img.style.height = "50px";
				 img.style.top = "0px";
				 div.style.width = "25px";
				 div.style.height = "25px";
				 div.style.boxShadow = "rgba(0,0,0,0.34902) 2px 2px 3px";
				 div.style.overflow = "hidden"; 
				 div.style.cursor = "pointer";    
				 div.style.border = "1px solid gray";
				 div.style.borderRadius = "4px";    
				 div.style.backgroundColor = "rgb(255,255,255)";    
				 // 绑定事件，点击一次放大两级    
				 div.onclick = function(e){  
				 	if(This.ifShowLoLabel) {
				 		img.style.top = "0px";
				 		This.ifShowLoLabel = false;
				 		This.alwaysShowLocation();
				 	} else {
				 		img.style.top = "-25px";
				 		This.ifShowLoLabel = true;
				 		This.alwaysShowLocation();
				 	}
				 }; 
				 // 添加DOM元素到地图中   
				 map.getContainer().appendChild(div);    
				 // 将DOM元素返回  
				 return div;    
			}
			var showIcon = new ZoomControl();
			this.map.addControl(showIcon);
		},

		//添加地图右键菜单
		addMapContextMenu: function (map) {
			var contextMenu = new BMap.ContextMenu();
			contextMenu.addItem(new BMap.MenuItem(("显示坐标"), this.showLocation.bind(this)));
			contextMenu.addSeparator();  //添加右键菜单的分割线  
			contextMenu.addItem(new BMap.MenuItem(("开始画线"), this.showLocation.bind(this)));
			contextMenu.addItem(new BMap.MenuItem(("画线"), this.showLocation.bind(this)));
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

		//鼠标上添加显示坐标标签
		alwaysShowLocation: function (show) {
			var This = this;
			this.map.removeOverlay(This.LocationLabel);
			this.LocationLabel = new BMap.Label("");
			this.LocationLabel.setStyle({color: "black", border: "1px solid black"});
			this.LocationLabel.setOffset(new BMap.Size(-10,-20));
			this.map.addOverlay(this.LocationLabel);
			showFun = function(e) {
				var lng = e.point.lng;
				var lat = e.point.lat;
				var showStr = lng + ',' + lat;
				This.LocationLabel.setPosition(new BMap.Point(lng, lat));
				This.LocationLabel.setContent(showStr);
				if(!This.ifShowLoLabel){
					This.map.removeOverlay(This.LocationLabel);
					This.map.removeEventListener('mousemove', showFun);
				}
			}
			if(this.ifShowLoLabel) {
				this.map.addEventListener('mousemove', showFun);
			} 
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
			//添加marker右键菜单
			this.addMarkerContextMenu(marker);

			if(ifDrag) {
				marker.enableDragging();
				marker.ifDrag = true;
				if(param.dragFunc) {    
					marker.addEventListener("dragend", param.dragFunc);
				}
				this.dragMarkerCollection.push(marker);
			} else {
				marker.ifDrag = false;
				this.markerCollection.push(marker);
			}
		},

		//添加marker右键菜单
		addMarkerContextMenu: function (marker) {
			var contextMenu = new BMap.ContextMenu();
			contextMenu.addItem(new BMap.MenuItem(("查看坐标"), this.showLocation.bind(this)));
			contextMenu.addSeparator();  //添加右键菜单的分割线  
			contextMenu.addItem(new BMap.MenuItem(("删除"), this.removeMarker.bind(marker)));
			//menu.addSeparator(); 
			marker.addContextMenu(contextMenu);
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
		removeMarker: function(e) {
			var map = allMapFunc.map;
			var markerCollection = allMapFunc.markerCollection;
			var dragMarkerCollection = allMapFunc.dragMarkerCollection;
			map.removeOverlay(this);
			if(this.ifDrag){
				var index = dragMarkerCollection.indexOf(this, dragMarkerCollection.length-1);
				dragMarkerCollection.splice(index,1);
			} else {
				var index = markerCollection.indexOf(this, markerCollection.length-1);
				markerCollection.splice(index,1);
			}
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

