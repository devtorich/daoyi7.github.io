using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class project_services_print : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int length = Request.TotalBytes;
        byte[] buffer = Request.BinaryRead(length);

        String saveFileName = "plusgantt.jpg";
        Response.ContentType = "application/octet-stream";
        Response.ContentEncoding = System.Text.Encoding.UTF8;
        Response.AppendHeader("Content-Disposition", "attachment; filename=" + saveFileName);
        Response.Clear();
        Response.BinaryWrite(buffer);
    }
}