<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Map.aspx.cs" Inherits="Map" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no">
        <title>地图服务</title>
        <link rel="stylesheet" href="http://192.168.0.106:6088/3.9/js/dojo/dijit/themes/claro/claro.css"> 
        <link rel="stylesheet" href="http://192.168.0.106:6088/3.9/js/esri/css/esri.css">
        <link rel="stylesheet" href="css/popup.css">
        <link rel="stylesheet" href="css/tablestyle.css">
        <link rel="stylesheet" href="css/bubble-tooltip.css" media="screen">
        <link rel="stylesheet" href="css/my.css">
        <script>var dojoConfig = {   
            parseOnLoad: true   // 解析加载  
        };</script>
        <script src="http://192.168.0.106:6088/3.9/init.js"></script>
        <script type="text/javascript" src="js/AspproMap.js"></script>

    </head>
    <body class="claro" style="font-size: 0.75em;">
        <form id="mapform" runat="server">
            <script type="text/javascript">
                aspobje = new AspproMap();
                //function InitMethod()
                //{
                //    aspobje.InitMethod();
                //}
                //InitMethod();
                //aspobje.InitMethod();
                //aspobje.ShowMessage("hello boy");
            </script>
            <div id="map">
                <div id="map_window"/>
                <div id="map_ctrl" class="map_ct">  
                <a class="vip-uc-a" id="circle"></a>
                <a class="vip-uc-b" id="extent"></a>
                <a class="vip-uc-c" id="handdraw"></a>
                <a class="vip-uc-d" id="distance"></a>
                <a class="vip-uc-e" id="print"></a>
                <a class="vip-uc-f" id="fullscreen"></a>
                </div>
                <div id="HomeButton"/>
            </div>
            <div id="currentxy"/>
            <div id="bubble_tooltip">
                <div class="bubble_top"><span></span></div>
                <div class="bubble_middle"><span id="bubble_tooltip_content"></span></div>
                <div class="bubble_bottom"></div>
            </div>
        </form>
    </body>
</html>