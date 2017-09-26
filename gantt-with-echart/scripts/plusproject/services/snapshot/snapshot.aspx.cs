using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Diagnostics;

public partial class scripts_plusproject_services_snapshot : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        String imgType = Request["type"];
        if (String.IsNullOrEmpty(imgType)) imgType = "png";

        String filePath = CreateHTML();
        //String filePath = "test.html";
        String imgPath = CreateIMG(filePath, imgType);

        //Test.File.Delete(filePath);

        //DownLoadFile(imgPath, imgType);
        Response.Redirect(imgPath);

        //Response.Write(imgPath);
    }
    public void DownLoadFile(String filePath, String imgType)
    {

        //Response.ContentType = "application/x-zip-compressed";
        Response.AddHeader("Content-Disposition", "attachment;filename=gantt." + imgType);
        Response.TransmitFile(filePath);
    }
    public String CreateIMG(String file, String imgType)
    {
        String path = MapPath("") + "\\";

        //删除所有之前的图片
        //Test.File.DeleteAllFiles(path + "images/");

        String imgPath = "images/snapshot_" + DateTime.Now.Ticks + "." + imgType;

        Process process = new Process();
        ProcessStartInfo startInfo = new ProcessStartInfo();
        startInfo.WindowStyle = ProcessWindowStyle.Hidden;
        startInfo.FileName = "cmd.exe";
        startInfo.WorkingDirectory = path;
        startInfo.Arguments = "/c phantomjs snapshot.js " + file + " " + imgPath;
        startInfo.CreateNoWindow = true;
        process.StartInfo = startInfo;
        process.Start();

        process.WaitForExit();

        return imgPath;
    }
    public String CreateHTML()
    {
        //1)生成html
        String html = Request["html"];
        String width = Request["width"];
        String height = Request["height"];

        String filename = "snapshot_" + DateTime.Now.Ticks + ".html";
        String path = MapPath("") + "\\";
        Test.File.Write(path + filename, html);

        return path + filename;
    }
}