require([
"esri/map",
"dojo/_base/lang",
"dojo/json",
"esri/config",
"esri/tasks/GeometryService",
"esri/tasks/AreasAndLengthsParameters",
"dojo/dom-class",
"esri/dijit/Popup",
"esri/dijit/PopupTemplate",
"esri/toolbars/draw",
"esri/symbols/SimpleFillSymbol",
"esri/geometry/Point",
"dojo/on", "dojo/dom",
"dojo/_base/Color",
"esri/dijit/Scalebar",
"esri/dijit/InfoWindowLite",
"esri/dijit/InfoWindow",
"dojo/dom-construct",
"esri/symbols/SimpleMarkerSymbol",
"esri/symbols/PictureMarkerSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/graphic",
"dojo/dom-style",
"dojo/query",
"esri/layers/GraphicsLayer",
"dojox/widget/ColorPicker",
"esri/layers/CSVLayer",
"esri/Color",
"esri/renderers/SimpleRenderer",
"esri/InfoTemplate",
"esri/urlUtils",
"esri/geometry/scaleUtils",
"esri/dijit/HomeButton",
"esri/tasks/RouteTask",
], function AspproMap(
Map, lang, json, esriConfig, GeometryService, AreasAndLengthsParameters, domClass, Popup, PopupTemplate,
Draw, SimpleFillSymbol, Point, on, dom, Color, Scalebar, InfoWindowLite, InfoWindow, domConstruct,
SimpleMarkerSymbol, PictureMarkerSymbol, SimpleLineSymbol, Graphic, domStyle, query, GraphicsLayer,
arrayUtils, ColorPicker, CSVLayer, SimpleRenderer, InfoTemplate, urlUtils, scaleUtils, HomeButton, RouteTask
) {

        //esriConfig.defaults.map.slider = { right:"50px", bottom:"50px", width:"200px", height:null };
        var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl); //动态地图地址
        //var layer = new esri.layers.ArcGISTiledMapServiceLayer(mapServiceUrl);

        //地图缩放级别 一般不需要修改 可以增加删除
        var mylods = [
                    { "level": 0, "resolution": 0.703125, "scale": 295497593.05875003 },
                    { "level": 1, "resolution": 0.3515625, "scale": 147748796.52937502 },
                    { "level": 2, "resolution": 0.17578125, "scale": 73874398.264687508 },
                    { "level": 3, "resolution": 0.087890625, "scale": 36937199.132343754 },
                    { "level": 4, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                    { "level": 5, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                    { "level": 6, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                    { "level": 7, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                    { "level": 8, "resolution": 0.00274658203125, "scale": 1154287.472885742 },
                    { "level": 9, "resolution": 0.001373291015625, "scale": 577143.736442871 },
                    { "level": 10, "resolution": 0.0006866455078125, "scale": 288571.8682214355 },
                    { "level": 11, "resolution": 0.0003433227539, "scale": 144285.9341107178 },
                    { "level": 12, "resolution": 0.0001716613769, "scale": 72142.96705535888 },
                    { "level": 13, "resolution": 0.0000858306884, "scale": 36071.48352767944 },
                    { "level": 14, "resolution": 0.0000429153442, "scale": 9017.870881919859 },
                    { "level": 15, "resolution": 0.0000214576721, "scale": 4508.93544095993 },
                    { "level": 16, "resolution": 0.0000107288360, "scale": 2254.467720479965 },
                    { "level": 17, "resolution": 0.0000053644180, "scale": 1127.233860239982 },
                    { "level": 18, "resolution": 0.0000026822090, "scale": 563.6169301199912 },
                    { "level": 19, "resolution": 0.0000013411045, "scale": 281.8084650599956 }
        ];
        var startExtent;
        require(["esri/SpatialReference", "esri/geometry/Extent"], function (SpatialReference, Extent) {
            startExtent = new Extent(106.6543, 34.7099, 107.7474, 34.1017, new SpatialReference({ wkid: 4326 }));
        }
                );
        /*
        urlUtils.addProxyRule({
            urlPrefix: "route.arcgis.com",  
            proxyUrl: "/sproxy/"
            });
            */

        if (isUseProxy) {
            esri.config.defaults.io.proxyUrl = myProxyUrl;
            esri.config.defaults.io.alwaysUseProxy = isAlwaysUseProxy;
        }



        /*
        urlUtils.addProxyRule({
            urlPrefix: "http://192.168.0.106:6088",  
            proxyUrl: "http:////proxy.ashx"
            });
            */
        //esri.addProxyRule({urlPrefix: "http://route.arcgis.com", proxyUrl:"http:////proxy.ashx”});

        //http://192.168.0.106:6088/proxy.ashx
        //esriConfig.defaults.map.slider = { right:"10px", top:"200px"}; //, width:"200px", height:null 
        map = new Map("map", {
            //center: [ 109.18354,38.17994 ],
            //nav:true,
            slider: true,
            //sliderOrientation: "vertical", //horizontal,vertical
            sliderPosition: "bottom-right", //bottom-left //top-right
            sliderStyle: "small", //large small
            extent: startExtent,
            logo: false,
            lods: mylods, //动态图需要设置 瓦片图不需要设置 否则不可见
            zoom: 6,
            minZoom: 2
        });

        map.addLayer(layer); //将地图加入到地图中

        if (routedLine) {
            //routeTask = new RouteTask(routeServiceURL); //初始化路由服务    
        }

        //地图比例尺工具
        var scalebar = new Scalebar({
            map: map,
            scalebarStyle: "line",       //"ruler",
            scalebarUnit: "metric" //"dual","english","metric"
        });

        //设置地图默认初始化位置
        var location = new esri.geometry.Point(107.2015, 34.3426, map.spatialReference)
        map.centerAndZoom(location, 9);

        dicsymbol = new Array(); //图元样式字典

        //初始化样式信息
        closeSymbol1 = new PictureMarkerSymbol("img/map/carTrackClose1.png", 22, 28);
        closeSymbol2 = new PictureMarkerSymbol("img/map/carTrackClose2.png", 22, 28);
        closeSymbol3 = new PictureMarkerSymbol("img/map/carTrackClose3.png", 22, 28);
        carNOBKSymbol = new PictureMarkerSymbol("img/map/carbkdef.png", 152, 30);
        carNOBKSymbolSel = new PictureMarkerSymbol("img/map/carbksel.png", 152, 30);


        //默认地图样式 api中不需要关注
        defaultsymbol = new PictureMarkerSymbol("img/camera.png", 16, 16);
        psymbol = new PictureMarkerSymbol("img/camera.png", 16, 16);
        pselsymbol = new PictureMarkerSymbol("img/camera_go.png", 16, 16);
        selectzonesymbol = new esri.symbol.SimpleFillSymbol(
                    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(
                        esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                        new dojo.Color([0, 0, 255]),
                        2
                    ),
                    new dojo.Color([255, 0, 255, 0.25])
                    );
        defaultzonesymbol = new esri.symbol.SimpleFillSymbol(
                    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(
                        esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                        new dojo.Color([255, 0, 0]),
                        2
                    ),
                    new dojo.Color([255, 255, 0, 0.25])
                );
        defaultlinesymbol = new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                new dojo.Color([0, 0, 255]),
                2
            );


        //卡口样式默认样式
        commonSymbol_1 = new PictureMarkerSymbol("img/map/点位-小-1.png", 16, 21); //默认
        commonSymbol_2 = new PictureMarkerSymbol("img/map/点位-小-2.png", 16, 21); //鼠标滑过
        commonSymbol_3 = new PictureMarkerSymbol("img/map/点位-小-3.png", 16, 21); //鼠标点击后

        //卡口样式选择样式
        selectedSymbol_1 = new PictureMarkerSymbol("img/map/点位-中-1.png", 32, 45); //默认
        selectedSymbol_2 = new PictureMarkerSymbol("img/map/点位-中-2.png", 32, 45); //鼠标滑过
        selectedSymbol_3 = new PictureMarkerSymbol("img/map/点位-中-3.png", 32, 45); //鼠标点击

        //轨迹点样式
        selTrackPointSymbol_1 = new PictureMarkerSymbol("img/map/路径-点位-中-1.png", 32, 45); //默认
        selTrackPointSymbol_2 = new PictureMarkerSymbol("img/map/路径-点位-中-2.png", 32, 45); //默认
        selTrackPointSymbol_3 = new PictureMarkerSymbol("img/map/路径-点位-中-3.png", 32, 45); //默认

        //初始化颜色字典
        dicColors = new Array(new Color([69, 187, 255, 0.8]), new Color([25, 237, 170, 0.8]), new Color([209, 143, 255, 0.8]), new Color([166, 223, 11, 0.8]));
        dicCarNOColors = new Array(new Color([69, 187, 255]), new Color([25, 237, 170]), new Color([209, 143, 255]), new Color([166, 223, 11]));
        selTracLineColor = new Color([255, 84, 0]); //选中的线颜色
        selCarNoColor = new Color([255, 255, 255]); //选中的车牌颜色

        trackLineLayer = new GraphicsLayer("TrackLineLayer");    //轨迹图层
        trackPointLayer = new GraphicsLayer("TrackPointLayer");   //轨迹点图层
        historyPointLayer = new GraphicsLayer("HistoryPointLayer");

        var bayonetInfoTemplate = new esri.InfoTemplate();
        bayonetInfoTemplate.setTitle("<b>${name}</b>"); //"<b>${name}</b>"

        var strTableTimes = "";
        strTableTimes += "<table class=\"l-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
        strTableTimes += "<tr><th>属性</th><th>值</th></tr>"
        strTableTimes += "<tr><td>编号</td><td>${id}</td></tr>";
        strTableTimes += "<tr><td>代号</td><td>${code}</td></tr>";
        strTableTimes += "<tr><td>名称</td><td>${name}</td></tr>";
        strTableTimes += "<tr><td>IP</td><td>${ipaddress}</td></tr>";
        strTableTimes += "<tr><td>状态</td><td>${state}</td></tr>";
        strTableTimes += "<tr><td>描述</td><td>${desc}</td></tr>";
        strTableTimes += "</table>"

        bayonetInfoTemplate.setContent("<span>" + strTableTimes + "</span>");

        //bayonetInfoTemplate.setContent("<span>编号:${id}</span></br><span>代号:${code}</span></br><span>名称:${name}</span></br><span>IP:${ipaddress}</span></br><span>状态:${state}</span></br><span>描述:${desc}</span></br><img src=\"img/rosette.png\"  alt=\"${name}\" />");
        bayonetLayer = new GraphicsLayer("BayonetLayer", { infoTemplate: bayonetInfoTemplate });       //卡口图层 

        //鼠标移动到图元上触发API
        bayonetLayer.on("mouse-over", function (evt) {
            //var message="名称:"+evt.graphic.attributes["name"];
            //alert(evt.graphic.attributes["name"]);
            //showToolTip(evt,evt.graphic.attributes["name"]);

            if (bayonetSelected(evt.graphic)) {
                //选中状态
                evt.graphic.setSymbol(selectedSymbol_2);
            }
            else {
                //未选中状态
                evt.graphic.setSymbol(commonSymbol_2);
            }
            bayonetLayer.redraw();
            callcshar("PointMouseAbove", evt.graphic.attributes["id"]);
        });
        //鼠标离开图元 触发api
        bayonetLayer.on("mouse-out", function (evt) {
            //hideToolTip();
            if (bayonetSelected(evt.graphic)) {
                //选中状态
                if (evt.graphic == graphicSelected) {
                    evt.graphic.setSymbol(selectedSymbol_3);
                }
                else {
                    evt.graphic.setSymbol(selectedSymbol_1);
                }
            }
            else {
                //未选中状态
                if (evt.graphic == graphicSelected) {
                    evt.graphic.setSymbol(commonSymbol_3);
                }
                else {
                    evt.graphic.setSymbol(commonSymbol_1);
                }
            }

            bayonetLayer.redraw();
            callcshar("PointMouseLeave", evt.graphic.attributes["id"]);
        });

        bayonetLayer.on("mouse-down", function (evt) {
            //hideToolTip();
            graphicSelected = evt.graphic;
            //evt.graphic.Symbol=commonSymbol_3;

            if (bayonetSelected(evt.graphic)) {
                //选中状态
                evt.graphic.setSymbol(selectedSymbol_3);

            }
            else {
                //未选中状态
                evt.graphic.setSymbol(commonSymbol_3);
            }

            for (var i = 0; i < bayonetLayer.graphics.length; i++) {
                if (bayonetLayer.graphics[i] == evt.graphic) {

                }
                else {
                    if (bayonetSelected(bayonetLayer.graphics[i])) {
                        bayonetLayer.graphics[i].setSymbol(selectedSymbol_1);
                    }
                    else {
                        bayonetLayer.graphics[i].setSymbol(commonSymbol_1);
                    }
                }
            }
            evt.graphic.show();
            bayonetLayer.redraw();
        });

        trackPointLayer.on("mouse-over", function (evt) {
            if (evt.graphic.attributes["canclose"] == 1) {
                evt.graphic.setSymbol(closeSymbol2.setOffset(145, 0));
            }
            else {
                if (evt.graphic.attributes["type"] == "tkpoint") {
                    evt.graphic.setSymbol(selTrackPointSymbol_2);
                }

            }
            //evt.graphic.setSymbol(commonSymbol_1);
            trackPointLayer.redraw();
        });

        trackPointLayer.on("mouse-out", function (evt) {
            if (evt.graphic.attributes["canclose"] == 1) {
                evt.graphic.setSymbol(closeSymbol1.setOffset(145, 0));
            }
            else {
                if (evt.graphic.attributes["type"] == "tkpoint") {
                    evt.graphic.setSymbol(selTrackPointSymbol_1);
                }
            }
            trackPointLayer.redraw();
        });

        trackPointLayer.on("mouse-up", function (evt) {
            if (evt.graphic.attributes["canclose"] == 1) {
                evt.graphic.setSymbol(closeSymbol1.setOffset(145, 0));
            }
            else {
                if (evt.graphic.attributes["type"] == "tkpoint") {
                    evt.graphic.setSymbol(selTrackPointSymbol_1);
                }

            }
        });

        trackLineLayer.on("mouse-down", function (evt) {
            if (evt.graphic.attributes["type"] == "line") {
                SelectTrackLine(evt.graphic.attributes["id"]); //点击的是线路则高亮线路 高亮线路
            }

        })

        trackPointLayer.on("mouse-down", function (evt) {
            //gpoint.attributes["id"]=1;
            //gpoint.attributes["canclose"]=1;
            if (evt.graphic.attributes["canclose"] == 1) {
                evt.graphic.setSymbol(closeSymbol3.setOffset(145, 0));

                /*删除老方法
                for(var j=trackLineLayer.graphics.length-1;j>=0;j--)
                {
                    if(trackLineLayer.graphics[j].attributes["id"]==evt.graphic.attributes["id"])
                    {
                        trackLineLayer.remove(trackLineLayer.graphics[j])
                    }        
                }
                
                for(var j=trackPointLayer.graphics.length-1;j>=0;j--)
                {
                    if(trackPointLayer.graphics[j].attributes["id"]==evt.graphic.attributes["id"])
                    {
                        trackPointLayer.remove(trackPointLayer.graphics[j])
                    }        
                }
                */

                //删除新方法
                ResetSetColorIndex(evt.graphic.attributes["id"]); //清除颜色占用供其他使用
                var trackid = evt.graphic.attributes["id"];
                if (trackid) {
                    DelTrack(trackid);
                }

                //ar colorIndex=GetColorIndex("ccc");
                //alert(colorIndex);
            }
            else {


                if (evt.graphic.attributes["type"] == "tkpoint") {
                    evt.graphic.setSymbol(selTrackPointSymbol_3);
                    //liyafei 需要调用c#接口进行数据传输哦
                    //evt.graphic.attributes["name"]="调用c#传回";

                    //evt.graphic.attributes["times"]=arrTimes;
                    //evt.graphic.setInfoTemplate(template);

                    //map.infoWindow.show();
                    //alert("hello");
                }
                else {
                    SelectTrackLine(evt.graphic.attributes["id"]); //高亮线路
                }

                //evt.graphic.show();
                //trackPointLayer.remove(evt.graphic);
                //trackLineLayer.add(evt.graphic);
                //SelectTrackLine("99");
            }
        })

        bayonetLayer.on("mouse-up", function (evt) {
            //hideToolTip();
            //evt.graphic.setSymbol(commonSymbol_1);
            //bayonetLayer.redraw();
        });

        trackLineLayer.on("mouse-down", function (evt) {
            evt.graphic.show();
        })

        map.addLayer(trackLineLayer);
        map.addLayer(bayonetLayer);
        map.addLayer(trackPointLayer);
        map.addLayer(historyPointLayer);

        dojo.connect(map, "onLoad", createToolbar); // 绑定加载事件  

        popupOptions = {
            "markerSymbol": new SimpleMarkerSymbol("circle", 20, null, new Color([0, 0, 0, 0.25])),
            "marginLeft": "20",
            "marginTop": "20"
        };

        //地图加载完毕初始化地图和选择图元工具
        map.on("load", mapLoaded);
        function mapLoaded() {
            createGraphicsMenu(); //初始化选择框右键
            createMapMenu(); //初始化地图右键
        }

        //鼠标移动时在地图左下角显示x(纵坐标),y(横坐标)值
        map.on("mouse-move", mapMouseMove);
        function mapMouseMove(mapEvent) {
            try {
                var pt = mapEvent.mapPoint;
                dom.byId("currentxy").innerText = "X:" + pt.x.toFixed(4) + " Y:" + pt.y.toFixed(4);
            }
            catch (err)
            { }
        }

        //创建地图工具栏
        function createToolbar(themap) {
            toolbar = new esri.toolbars.Draw(map);  // esri.toolbars.Draw(map, options)  创建选择工具
            dojo.connect(toolbar, "onDrawEnd", addToMap);   // 绘制完成触发  选择工具

            distancetool = new esri.toolbars.Draw(map);//创建绘图工具
            distancetool.on("draw-end", lang.hitch(map, getAreaAndLength)); //测距工具绘图完毕
        }

        //GeometryService 创建地理服务（需要在arcgis开启此项服务）
        var geometryService = new GeometryService(geoServiceURL);
        geometryService.on("areas-and-lengths-complete", outputAreaAndsLength); //测量面积结束事件
        //geometryService.on("onLengthsComplete", outputDistance);
        dojo.connect(geometryService, "onLengthsComplete", outputDistance);//测量长度结束事件

        var dtype = 0; // 1 测面积 其他 测距
        function getAreaAndLength(evtObj) {
            var map = this;
            var geometry = evtObj.geometry; //取得当前几何体体
            distancetool.deactivate();
            map.showZoomSlider();
            var graphic;
            if (geometry.type == "polyline") {
                //测距
                dtype = 0;

                //将几何体添加到地图
                graphic = map.graphics.add(new Graphic(geometry, defaultlinesymbol));

                //设置测量参数 测量长度
                var lengthParams = new esri.tasks.LengthsParameters();
                lengthParams.polylines = [geometry];
                lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
                lengthParams.geodesic = true;
                geometryService.lengths(lengthParams);

            }
            else {
                //测量面积
                dtype = 1;

                //将几何体添加到地图
                graphic = map.graphics.add(new Graphic(geometry,
                    new SimpleFillSymbol()));

                //设置测量参数 测量面积
                var areasAndLengthParams = new AreasAndLengthsParameters();
                areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER;
                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;
                areasAndLengthParams.calculationType = "geodesic";
                geometryService.simplify([geometry],
                    function (simplifiedGeometries) {
                        areasAndLengthParams.polygons = simplifiedGeometries;
                        geometryService.areasAndLengths(areasAndLengthParams);
                    });
            }
        }

        //输出面积函数
        function outputAreaAndsLength(evtObj) {
            //取得测量结果
            var result = evtObj.result;
            if (dtype == 1) {
                //输出面积
                var r;
                if (result.areas[0] > 1000000) {
                    r = (result.areas[0] / 1000000).toFixed(2) + "平方千米";
                }
                else {
                    r = result.areas[0].toFixed(2) + "平方米";
                }
                alert(r);
            }
            else {
                //无用
                alert(result.lengths[0].toFixed(2) + "米");
            }
            //distancetool.deactivate();
        }

        //取得测量长度结果
        function outputDistance(result) {
            var r;
            if (result.lengths[0] > 1000) {
                r = (result.lengths[0] / 1000).toFixed(2) + "千米";
            }
            else {
                r = result.lengths[0].toFixed(2) + "米";
            }
            alert(r);
            //distancetool.deactivate();
        }

        //将选择框几何体添加到地图中
        function addToMap(geometry) {
            toolbar.deactivate();  // 关闭工具栏并激活地图导航.  
            map.showZoomSlider();  //在地图上显示的缩放滑块  
            // 判断几何图形的类型 
            var graphic = new esri.Graphic(geometry,
                defaultzonesymbol, { "id": selzoneindex });
            var sid = selzoneindex;
            //选中
            var icout = 0;
            var itemsstring = "";

            var graphics = bayonetLayer.graphics;
            for (var i = 0; i < graphics.length; i++) {
                if (graphic.geometry.contains(graphics[i].geometry)) {

                    var bFind = false;
                    for (var j = 0; j < selectedGraphics.length; j++) {
                        if (graphics[i].attributes["id"] == selectedGraphics[j].attributes["id"]) {
                            bFind = true;
                            break;
                        }
                    }
                    if (!bFind) {
                        icout++;
                        selectedGraphics.push(graphics[i]);

                        if (graphics[i] == graphicSelected) {
                            graphics[i].setSymbol(selectedSymbol_3);
                        }
                        else {
                            graphics[i].setSymbol(selectedSymbol_1);
                        }

                        if (itemsstring.length == 0) {
                            itemsstring = "{\"id\":\"" + graphics[i].attributes["id"] + "\"}";
                        }
                        else {
                            itemsstring += ",{\"id\":\"" + graphics[i].attributes["id"] + "\"}";
                        }
                    }

                    //currentlayer.redraw();

                    /*
                    //判断在其他区域中不存在
                    var bfind=false;
                    for(var j=0;j<map.graphics.graphics.length;j++)
                    {
                        var gtemp=map.graphics.graphics[j];
                        if(gtemp.attributes)
                        {
                            if(graphic.attributes["id"]!=gtemp.attributes["id"]
                                &&gtemp.geometry.contains(graphics[i].geometry))
                            {
                            bfind=true;
                            break;
                            }                
                        }   
                    }
                    //未被其他区域选中
                    if(!bfind)
                    {
                        icout++;
                        selectedGraphics.push(graphics[i]);  
    
                        if( graphics[i]==graphicSelected)
                        {
                            graphics[i].setSymbol(selectedSymbol_3); 
                        }
                        else
                        {
                            graphics[i].setSymbol(selectedSymbol_1);                        
                        }
                            
                        if(itemsstring.length==0)
                        {
                            itemsstring="{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                        }
                        else
                        {
                            itemsstring+=",{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                        }
                        //currentlayer.redraw();
                        bayonetLayer.redraw();        
                    } 
                    */
                }
            }
            if (icout > 0) {
                bayonetLayer.redraw();
                //map.graphics.add(graphic);
                selzoneindex++;
                //HightlightZone(1);
                var SeletItems = "{\"items\":[" + itemsstring + "]}";
                callcshar("PointSelected", SeletItems);//调用外部
                //callcshar("ZoneSelected", sid);//调用外部
                //DeleteZone(9);
            }
        }
        //矩形选择
        on(dom.byId("extent"), "click", function () {
            distancetool.deactivate();
            toolbar.activate(esri.toolbars.Draw.EXTENT);
            map.hideZoomSlider();
        });
        /*
        //多边形
        on(dom.byId("polygon"), "click", function(){ 
            distancetool.deactivate();
            toolbar.activate(esri.toolbars.Draw.POLYGON);
            map.hideZoomSlider();
        }); 
        */
        //手绘多面体
        on(dom.byId("handdraw"), "click", function () {
            distancetool.deactivate();
            toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
            map.hideZoomSlider();
        });
        //圆形
        on(dom.byId("circle"), "click", function () {
            distancetool.deactivate();
            toolbar.activate(esri.toolbars.Draw.CIRCLE);
            map.hideZoomSlider();
        });
        /*
        //椭圆
        on(dom.byId("ellipse"), "click", function(){
            distancetool.deactivate();
            toolbar.activate(esri.toolbars.Draw.ELLIPSE);
            map.hideZoomSlider();
        });
        */

        /* 
        //清除所有选项
        on(dom.byId("clearall"), "click", function(){
            toolbar.deactivate();
            distancetool.deactivate();
            ClearSelectedPoint(); //清除所有选择
        });
        */

        //测距
        on(dom.byId("distance"), "click", function () {
            toolbar.deactivate();
            distancetool.activate(esri.toolbars.Draw.POLYLINE);
            map.hideZoomSlider();
        });

        /*
        //测面积
        on(dom.byId("area"), "click", function(){  
            toolbar.deactivate();
            distancetool.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
            map.hideZoomSlider();
        });
        */

        //打印
        on(dom.byId("print"), "click", function () {
            callcshar("MapPrint", null);
        });

        //全屏
        on(dom.byId("fullscreen"), "click", function () {
            callcshar("FullScreen", null);
        });

        /*
        //显示鹰眼地图
        ShowOverviewMap();
        */

        /*
        //显示 home按钮
        var home = new esri.dijit.HomeButton({
            map: map
            }, "HomeButton");
            home.startup();
        */
        callcshar("MapLoadCompleted", null);

        //document.getElementById("map_graphics_layer").style('display: none;');

        //调用测试接口
        //if (showTestData) {
        //    Tests();
        //}
    });
