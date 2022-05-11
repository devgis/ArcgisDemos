using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WebMap.Controllers
{
    public class MapController : Controller
    {
        // GET: Map
        public ActionResult Index()
        {
            StringBuilder jsStringBuilder = new StringBuilder();
            ////jsStringBuilder.AppendLine(string.Empty);

            jsStringBuilder.Append("require([\"asppro/AspproHelper\", \"dojo/domReady!\"], function(AspproHelper) {");
            jsStringBuilder.Append("    console.log(\"调用开始------------------------------\" + new Date());");

            #region //初始化参数
            Object jsonObject = new {
                MapServiceURL = System.Web.Configuration.WebConfigurationManager.AppSettings["MapServiceURL"].ToString(),
                GeoServiceURL = System.Web.Configuration.WebConfigurationManager.AppSettings["GeoServiceURL"].ToString(),
                RouteServiceURL = System.Web.Configuration.WebConfigurationManager.AppSettings["RouteServiceURL"].ToString(),
                ProxyUrl = "/Proxy.ashx",
                UseProxy = true,
                RoutedLine=true
            };
            jsStringBuilder.AppendFormat("AspproHelper.InitConfig({0});", JsonConvert.SerializeObject(jsonObject));
            #endregion


            jsStringBuilder.Append("    AspproHelper.InitMap();"); //初始化地图
            jsStringBuilder.Append("    AspproHelper.Tests(); "); //初始化测试数据
            jsStringBuilder.Append("    console.log(\"调用结束------------------------------\" + new Date());");
            jsStringBuilder.Append("});");

            
            ////JObject jo = (JObject)JsonConvert.DeserializeObject(jsStringBuilder.ToString());

            //jsStringBuilder.AppendLine("aspobje.InitMap();");

            ////MapServiceURL GeoServiceURL  RouteServiceURL

            ////this.SetMapServiceUrl
            ////System.Web.Configuration.WebConfigurationManager.AppSettings[keyName].ToString();
            ////ViewBag.Myjs = jsStringBuilder.ToString(); //"aspobje.InitMap()"; //"<script>aspobje.InitMap();</script>";
            //// Response.Write("<script>aspobje.InitMap();</script>");

            ViewBag.MYJS = jsStringBuilder.ToString();
            ////ViewBag.A = System.Web.Configuration.WebConfigurationManager.AppSettings["MapServiceURL"].ToString();
            return View();
        }
    }
}