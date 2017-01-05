/*添加版权信息
		var copyright = {
			id : 0.1,
			content : "snomis",
		};
		*/
		var map = new BMap.Map("container");
		var point = new BMap.Point(119.976, 30.544);
		map.centerAndZoom(point, 18);
		map.enableScrollWheelZoom();
		//平移地图控件
		map.addControl(new BMap.NavigationControl());
		//缩略地图控件
		map.addControl(new BMap.OverviewMapControl());
		//比例尺控件
		var scaleOpts = {offset: new BMap.Size(50, 50)}    
		map.addControl(new BMap.ScaleControl(scaleOpts));
		//地图类型控件
		map.addControl(new BMap.MapTypeControl());
		//版权信息控件
		//var CopyrightControl = new BMap.CopyrightControl;
		//map.addControl(CopyrightControl.addCopyright(copyright));
		
		//定位控件
		//var geoOpts = {
		//	anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		//	offset: new BMap.Size(50, 50)};
		//map.addControl(new BMap.GeolocationControl(geoOpts));

		