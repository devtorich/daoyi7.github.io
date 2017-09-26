using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;

public partial class project_services_save : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {        
        String projectJSON = Request["project"];

        Hashtable dataProject = (Hashtable)PluSoft.Utils.JSON.Decode(projectJSON);

        /*如果传递了其他自定义参数，可以这样获取：
         
         String myField = Request["myField"];
         
         */

        String projectUID = DBProject.SaveProject(dataProject);
        
        Response.Write(projectUID);
    }
}