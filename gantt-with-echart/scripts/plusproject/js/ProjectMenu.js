var ProjectMenu = function () {
    ProjectMenu.superclass.constructor.call(this);

}

mini.extend(ProjectMenu, mini.Menu, {
    _create: function () {
        ProjectMenu.superclass._create.call(this);

        var menuItems = [
            { type: "menuitem", iconCls: "icon-goto", text: mini.Gantt.Goto_Text, name: "goto" },
            '-',
            { type: "menuitem", iconCls: "icon-upgrade", text: mini.Gantt.UpGrade_Text, name: "upgrade" },
            { type: "menuitem", iconCls: "icon-downgrade", text: mini.Gantt.DownGrade_Text, name: "downgrade" },
            '-',
            { type: "menuitem", iconCls: "icon-add", text: mini.Gantt.Add_Text, name: "add" },
            { type: "menuitem", iconCls: "icon-edit", text: mini.Gantt.Edit_Text, name: "edit" },
            { type: "menuitem", iconCls: "icon-remove", text: mini.Gantt.Remove_Text, name: "remove" },
        //            { type: "menuitem", text: "aaa",
        //                menu: [
        //                        { type: "menuitem", text: "bbb", name: "bbb" },
        //                        { type: "menuitem", text: "ccc" }
        //                    ]
        //            },
            '-',
            { type: "menuitem", iconCls: "icon-zoomin", text: mini.Gantt.ZoomIn_Text, name: "zoomin" },
            { type: "menuitem", iconCls: "icon-zoomout", text: mini.Gantt.ZoomOut_Text, name: "zoomout" }
        ];
        this.setItems(menuItems);


        this.goto = mini.getbyName("goto", this);
        this.zoomIn = mini.getbyName("zoomin", this);
        this.zoomOut = mini.getbyName("zoomout", this);

        this.upgrade = mini.getbyName("upgrade", this);
        this.downgrade = mini.getbyName("downgrade", this);
        this.add = mini.getbyName("add", this);
        this.edit = mini.getbyName("edit", this);
        this.remove = mini.getbyName("remove", this);

        this.goto.on("click", this.__OnGoto, this);
        this.zoomIn.on("click", this.__OnZoomIn, this);
        this.zoomOut.on("click", this.__OnZoomOut, this);
        this.upgrade.on("click", this.__OnUpgrade, this);
        this.downgrade.on("click", this.__OnDowngrade, this);
        this.add.on("click", this.__OnAdd, this);
        this.edit.on("click", this.__OnEdit, this);
        this.remove.on("click", this.__OnRemove, this);
    },
    __OnGoto: function (e) {
        var gantt = this.owner;
        var task = gantt.getSelected();
        if (task) {
            gantt.scrollIntoView(task);
        }
    },
    __OnZoomIn: function (e) {
        var gantt = this.owner;
        gantt.zoomIn();
    },
    __OnZoomOut: function (e) {
        var gantt = this.owner;
        gantt.zoomOut();
    },
    __OnUpgrade: function (e) {
        var gantt = this.owner;
        var task = gantt.getSelected();
        if (task) {
            gantt.upgradeTask(task);
        }
    },
    __OnDowngrade: function (e) {
        var gantt = this.owner;
        var task = gantt.getSelected();
        if (task) {
            gantt.downgradeTask(task);
        }
    },
    __OnAdd: function (e) {
        var gantt = this.owner;
        var targetTask = gantt.getSelected();
        var task = gantt.newTask();

        //加到选中任务之前        
        gantt.addTask(task, "before", targetTask);

        //        task.Start = null;            //新增时如果不想设置任务日期
        //        task.Finish = null;

        //加到子任务
        //gantt.addTask(task, "append", targetTask);

        //加到最后一行任务
        //gantt.addTask(task);
    },
    __OnEdit: function (e) {
        var gantt = this.owner;
        var task = gantt.getSelected();
        if (task) {

        }
    },
    __OnRemove: function (e) {
        var gantt = this.owner;
        var task = gantt.getSelected();
        if (task) {
            if (confirm("确定删除任务 \"" + task.Name + "\" ？")) {
                gantt.removeTask(task);
            }
        } else {
            alert("请选择要删除的任务");
        }
    }

});