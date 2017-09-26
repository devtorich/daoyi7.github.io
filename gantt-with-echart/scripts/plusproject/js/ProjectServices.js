/* 标准方法：加载、保存、调试项目，弹出任务面板、日历面板。
-----------------------------------------------------------------------------*/

var ServicesPath = mini_JSPath + "../plusproject/services/";    //Ajax交互路径（根据实际项目部署路径，需要修改）

var LoadProjectUrl = ServicesPath + 'load.aspx';
var SaveProjectUrl = ServicesPath + 'save.aspx';


function doSetProjectData(project, dataProject) {
    if (project.showProjectTask) {

        var root = { Name: dataProject.Name, isProject: true };
        root.children = dataProject.Tasks;

        dataProject.Tasks = [root];

        project.loadData(dataProject);

        //如果是将项目作为顶级父任务，则需要处理下数据联动

        project.orderProject();

    } else {
        project.loadData(dataProject);
    }
}
function doGetProjectData(project) {
    var dataProject = project.getData();
    dataProject.RemovedTasks = project.getRemovedTasks();
    
    if (project.showProjectTask) {

        var Tasks = dataProject.Tasks;

        var root = Tasks[0];
        if (root && root.isProject) {       //如果第一条任务是项目任务，则克隆一个新项目数据

            dataProject.Tasks = [];
            var clone = mini.clone(dataProject);
            dataProject.Tasks = Tasks;      //还原原始数据

            dataProject = clone;            
            dataProject.Tasks = root.children;
        }
    }

    return dataProject;
}


function LoadProject(params, project, callback) {
    if (typeof params != "object") params = { projectuid: params };

    project.loading();
    $.ajax({
        url: LoadProjectUrl,
        data: params,
        cache: false,
        success: function (text) {
            var dataProject = mini.decode(text);

            doSetProjectData(project, dataProject);

            //project.orderProject();

            //加载时自动排程，如果有变动，需要提示
//            if (project.isChanged()) {
//                alert("项目数据加载时自动调整");
//            }

            //
            if (callback) callback(project);
            project.unmask();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("加载失败, 错误码：" + textStatus);
            project.unmask();
        }
    });
}

function SaveProject(project, callback, params) {
    
    var dataProject = doGetProjectData(project);

    var json = mini.encode(dataProject);

    project.mask("数据保存中，请稍后...");

    if (!params) params = {};
    params.project = json;

    $.ajax({
        url: SaveProjectUrl,
        type: "post",
        data: params,
        success: function (text) {
            alert("保存成功,项目UID：" + text);
            project.acceptChanges();
            if (callback) callback(project);
            project.unmask();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("保存失败, 错误码：" + textStatus);
            project.unmask();
        }
    });
}

function TrackProject(project) {

//    var list = project.getTaskList();
//    list.forEach(function (o) {
//        delete o._id;
//        delete o._uid;
//        delete o._pid;
//        delete o._level;
//        delete o._x;
//        delete o._state;
//    });

    var dataProject = project.getData();
    var json = mini.encode(dataProject);
    document.write(json);
    //把生成的项目JSON数据发送给技术支持人员，方便技术人员进行调试定位项目问题
}

function LoadJSONProject(url, project, callback) {
    project.loading();
    $.ajax({
        url: url,
        cache: false,
        success: function (text) {
            var dataProject = mini.decode(text);
            
            doSetProjectData(project, dataProject);

            if (callback) callback(project);
            project.unmask();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("加载失败, 错误码：" + textStatus);
            project.unmask();
        }
    });
}

//创建任务面板

var taskWindow = null;

function ShowTaskWindow(project, tabName) {
    var task = project.getSelected();
    if (task) {
        if (!taskWindow) {
            taskWindow = new TaskWindow();
        }
        taskWindow.setTitle("编辑任务");
        taskWindow.show();
        taskWindow.setData(task, project,
            function (action) {
                
                if (action == 'ok') {
                    try {
                        var taskData = taskWindow.getData();
                        project.updateTask(task, taskData);
                    } catch (ex) {
                        alert("error:"+ex.message);
                        return false;
                    }
                }
            }
        );
            if (tabName) {
                taskWindow.activeTab(tabName);
            }
    } else {
        alert("请先选择任务");
    }
}

//日历面板

var calendarWindow = null;

function ShowCalendarWindow(project) {
    if (!calendarWindow) {
        calendarWindow = new CalendarWindow();
    }
    calendarWindow.show();
    calendarWindow.setData(project.getCalendars(), project,
        function (action) {
            if (action == "ok") {

                var calendars = calendarWindow.getData();
                var calendarUID = calendarWindow.CalendarsCombo.getValue();

                project.beginUpdate();
                project.setCalendars(calendars);
                project.setCalendarUID(calendarUID);
                project.endUpdate();
            }
        }
    );
}
