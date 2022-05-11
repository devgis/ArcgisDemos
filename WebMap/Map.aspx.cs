using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Map : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //if(Request.QueryString["test"]!=null&&
        if (!string.IsNullOrEmpty((Request.QueryString["test"] == null) ? string.Empty : Request.QueryString["test"].ToString()))
        {
            //Response.Output.Write("<script type=\"text / javascript\">InitMethod();</script>");

            //Response.Output.Write("<script type=\"text / javascript\">aspobje.ShowMessage(\"hello boy\");</script>");

            Page.ClientScript.RegisterStartupScript(this.GetType(), "", "aspobje.InitMap()", true);
            Page.ClientScript.RegisterStartupScript(this.GetType(), "", "aspobje.ShowMessage('hello boy')", true);
            //Page.ClientScript.RegisterStartupScript(this.GetType(), "", "InitMethod()", true);
        }
    }
}