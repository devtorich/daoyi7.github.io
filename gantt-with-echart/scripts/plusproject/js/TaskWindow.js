
TaskWindow = function () {
    TaskWindow.superclass.constructor.call(this);    
    this.initControls();
    this.initEvents();
}
mini.extend(TaskWindow, mini.Window, {
    url: mini_JSPath + "../plusproject/js/TaskWindow.html",
    width: 580,
    height: 380,
    showFooter: true,
    showModal: true,
    initControls: function () {
        //body        
        var bodyEl = this.getBodyEl();
        mini.update(this.url, bodyEl);

        //footer buttons
        var footerEl = this.getFooterEl();
        mini.setStyle(footerEl, "padding:8px;padding-right:10px;text-align:right;");
        footerEl.innerHTML = '<a name="ok" class="mini-button" width="60" style="margin-right:10px;">确定</a> <a name="cancel" class="mini-button" width="60">取消</a>';
        mini.parse(footerEl);

        //获取控件对象

        this.ok = mini.getbyName("ok", this);
        this.cancel = mini.getbyName("cancel", this);

        this.addLink = mini.get("twin_linkadd");
        this.delLink = mini.get("twin_linkdel");
        this.addRes = mini.get("twin_resadd");
        this.delRes = mini.get("twin_resdel");

        this.Name = mini.get("twin_name");
        this.Principal = mini.get("twin_principal");
        this.PercentComplete = mini.get("twin_percentcomplete");
        this.Department = mini.get("twin_department");
        this.Duration = mini.get("twin_duration");
        this.Work = mini.get("twin_work");
        this.Start = mini.get("twin_start");
        this.Finish = mini.get("twin_finish");
        this.ActualStart = mini.get("twin_actualstart");
        this.ActualFinish = mini.get("twin_actualfinish");
        this.PredecessorLink = mini.get("twin_linkgrid");
        this.Assignments = mini.get("twin_resgrid");
        this.ConstraintType = mini.get("twin_constrainttype");
        this.ConstraintDate = mini.get("twin_constraintdate");
        this.FixedDate = mini.get("twin_fixeddate");
        this.Milestone = mini.get("twin_milestone");
        this.Critical2 = mini.get("twin_critical2");
        this.WBS = mini.get("twin_wbs");
        this.Notes = mini.get("twin_notes");
    },
    initEvents: function () {
        //绑定事件处理函数        

        //////////////////////////////
        this.Department.on('ValueChanged', function () {
            this.Principal.setData(this.getPrincipalsByDepartment(this.Department.getValue()));
            this.Principal.setValue('');
        }, this);
        /////////////////////////////
        this.Duration.on("valuechanged", function (e) {
            if (this.dateChangedAction != null) return;

            this.dateChangedAction = "duration";
            var start = this.Start.getValue();
            var duration = this.Duration.getValue();
            if (start) {
                var date = this.project.getFinishByCalendar(start, duration);
                this.Finish.setValue(date);
            }
            this.dateChangedAction = null;

        }, this);
        this.Start.on("valuechanged", function (e) {
            if (this.dateChangedAction != null) return;

            this.dateChangedAction = "start";
            var start = this.Start.getValue();
            var duration = this.Duration.getValue();
            if (start) {
                var date = this.project.getFinishByCalendar(start, duration);
                this.Finish.setValue(date);
            }
            this.dateChangedAction = null;
        }, this);
        this.Finish.on("valuechanged", function (e) {
            if (this.dateChangedAction != null) return;

            this.dateChangedAction = "finish";
            var finish = this.Finish.getValue();
            var start = this.Start.getValue();
            if (finish && start) {
                if (start > finish) {
                    start = finish;
                    this.Start.setValue(start);
                }
                var duration = this.project.getDurationByCalendar(start, finish);
                this.Duration.setValue(duration);
            }
            this.dateChangedAction = null;
        }, this);

        ////////////////////////////
        this.addLink.on("click", function (e) {
            var link = {
                Type: 1,
                LinkLag: 0
            };
            this.PredecessorLink.addRow(link);
        }, this);
        this.delLink.on("click", function (e) {
            this.PredecessorLink.removeSelected();
        }, this);
        this.PredecessorLink.on("drawcell", function (e) {
            var link = e.record, field = e.field;
            var preTask = this.getTaskByUID(link.PredecessorUID) || {};
            if (field == "PredecessorID") {
                e.cellHtml = preTask.ID;
            }
            if (field == "PredecessorName") {
                e.cellHtml = preTask.Name;
            }
            if (field == "Type") {
                var linkType = mini.Gantt.PredecessorLinkType[e.value];
                e.cellHtml = linkType.Name;
            }
            if (field == "LinkLag") {
                e.cellHtml = e.value + "天";
            }
        }, this);
        this.PredecessorLink.on("cellbeginedit", function (e) {
            var link = e.record, field = e.field;
            var preTask = this.getTaskByUID(link.PredecessorUID) || {};
            if (e.field == "PredecessorID") {
                e.value = preTask.ID || "";
            }
            if (e.field == "Type") {
                e.editor.setData(mini.Gantt.PredecessorLinkType);
            }
        }, this);
        this.PredecessorLink.on("cellcommitedit", function (e) {

            if (e.field == "PredecessorID") {
                //e.editor.setData(mini.Gantt.PredecessorLinkType);
                e.cancel = true;

                var task = this.getTaskByID(e.value);
                if (task) {
                    e.sender.updateRow(e.record, "PredecessorUID", task.UID);
                } else {
                    e.sender.updateRow(e.record, "PredecessorUID", "");
                }
            }
        }, this);
        /////////////////////////////////
        this.addRes.on("click", function (e) {
            var align = {
                Units: 100
            };
            this.Assignments.addRow(align);
        }, this);
        this.delRes.on("click", function (e) {
            this.Assignments.removeSelected();
        }, this);
        this.Assignments.on("drawcell", function (e) {
            var ass = e.record, field = e.field;
            var re = this.getResourceByUID(ass.ResourceUID) || {};
            if (field == "ResourceUID") {
                e.cellHtml = re.Name;
            }
            if (field == "Units") {
                e.cellHtml = e.value + "%";
            }
        }, this);
        this.Assignments.on("cellbeginedit", function (e) {
            if (e.field == "ResourceUID") {
                e.editor.setData(this.getResources());
            }
        }, this);
        //////////////////////////
        this.FixedDate.on("checkedchanged", function (e) {
            this.editEnabled();
        }, this);
        //////////////////////////
        this.ok.on("click", function (e) {
            var ret = true;
            if (this.callback) ret = this.callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this.cancel.on("click", function (e) {
            var ret = true;
            if (this.callback) ret = this.callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);

        this.on("beforebuttonclick", function (e) {
            if (e.name == "close") {
                e.cancel = true;
                var ret = true;
                if (this.callback) ret = this.callback('close');
                if (ret !== false) {
                    this.hide();
                }
            }
        }, this);
    },
    //如果是摘要任务, 并且不固定工期, 则禁止摘要任务操作日期(开始/完成/工期)
    editEnabled: function () {
        this.Duration.enable();
        this.Start.enable();
        this.Finish.enable();
        this.ConstraintType.enable();
        this.ConstraintDate.enable();
        this.FixedDate.disable();

        if (this.__TaskSummary) {
            this.FixedDate.enable();

            if (this.FixedDate.getChecked()) {
                this.ConstraintType.disable();
                this.ConstraintDate.disable();
            } else {
                this.Duration.disable(true);
                this.Start.disable(true);
                this.Finish.disable(true);
            }
        }
    },
    activeTab: function (tabName) {
        var tabs = mini.get("twin_tabs");
        var tab = tabs.getTab(tabName);
        if (tab) {
            tabs.activeTab(tab);
        }
    },
    setData: function (task, project, callback) {
//        var tabs = mini.get("twin_tabs");
//        var tab = tabs.getTab("adv");
//        tabs.updateTab(tab, { visible: false });  //可根据用户权限和操作场景，动态显示和隐藏tab
        //        
        this.callback = callback;

        this.project = project;
        this.dataProject = project.getData();

        //部门、负责人
        this.Department.setData(this.getDepartments());
        this.Department.setValue(task.Department);
        this.Principal.setData(this.getPrincipalsByDepartment(this.Department.getValue()));
        this.Principal.setValue(task.Principal);

        //常规
        this.Name.setValue(task.Name);
        this.PercentComplete.setValue(task.PercentComplete);
        this.Work.setValue(task.Work);

        //日期
        this.dateChangedAction = "no";
        this.Duration.setValue(task.Duration);
        this.Start.setValue(task.Start);
        this.Finish.setValue(task.Finish);
        this.ActualStart.setValue(task.ActualStart);
        this.ActualFinish.setValue(task.ActualFinish);
        this.dateChangedAction = null;

        //高级
        var ctypes = mini.Gantt.ConstraintType.clone();
        if (task.Summary) {
            for (var i = ctypes.length - 1; i >= 0; i--) {
                var ct = ctypes[i];
                if (ct.ID != 0 && ct.ID != 4 && ct.ID != 7) {
                    ctypes.removeAt(i);
                }
            }
        }
        this.ConstraintType.setData(ctypes);
        this.ConstraintType.setValue(task.ConstraintType);
        this.ConstraintDate.setValue(task.ConstraintDate);
        this.FixedDate.setChecked(task.FixedDate == 1);
        this.Milestone.setChecked(task.Milestone == 1);
        this.Critical2.setChecked(task.Critical2 == 1);
        this.WBS.setValue(task.WBS);

        //前置任务、资源分配
        this.PredecessorLink.setData(mini.clone(task.PredecessorLink) || []);
        this.Assignments.setData(mini.clone(task.Assignments) || []);

        this.Notes.setValue(task.Notes);

        //保存初始化的任务开始日期(点击"确定", 判断此值是否变化, 如果变化, 且没有设置任务限制, 则自动设置任务限制)
        this.__TaskStart = task.Start ? new Date(task.Start.getTime()) : null;
        this.__TaskSummary = task.Summary == 1;

        //控件可操作性处理  
        this.editEnabled();

        //设置日期选择框的显示日期为项目开始日期，方便操作
        var startDate = this.dataProject.StartDate;
        this.Start.setViewDate(startDate);
        this.Finish.setViewDate(startDate);
        this.ConstraintDate.setViewDate(startDate);
        this.ActualStart.setViewDate(startDate);
        this.ActualFinish.setViewDate(startDate);
    },
    getData: function () {

        var task = {
            DateChangeAction: this.DateChangeAction,

            Name: this.Name.getValue(),
            Department: this.Department.getValue(),
            Principal: this.Principal.getValue(),

            PercentComplete: this.PercentComplete.getValue(),
            Duration: this.Duration.getValue(),
            Work: this.Work.getValue(),

            Start: this.Start.getValue(),
            Finish: this.Finish.getValue(),

            ActualStart: this.ActualStart.getValue(),
            ActualFinish: this.ActualFinish.getValue(),

            ConstraintType: this.ConstraintType.getValue(),
            ConstraintDate: this.ConstraintDate.getValue(),
            Notes: this.Notes.getValue(),
            WBS: this.WBS.getValue(),

            FixedDate: this.FixedDate.getChecked() ? 1 : 0,
            Milestone: this.Milestone.getChecked() ? 1 : 0,
            Critical2: this.Critical2.getChecked() ? 1 : 0
        };

        //资源分配
        task.Assignments = mini.clone(this.Assignments.getData());
        //前置任务
        task.PredecessorLink = mini.clone(this.PredecessorLink.getData());

        //日期范围
        if (task.Start) { //开始日期是:   00:00:00
            var d = task.Start;
            task.Start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
        if (task.Finish) {//完成日期是:   23:23:59
            var d = task.Finish;
            task.Finish = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        }

        //任务限制
        if (task.ConstraintType == 0 || task.ConstraintType == 1) {
            task.ConstraintDate = null;

            if ((!this.__TaskStart && task.Start) || (this.__TaskStart && task.Start && this.__TaskStart.getTime() != task.Start.getTime())) {
                task.ConstraintType = 4;    //不得早于...开始
                task.ConstraintDate = new Date(task.Start.getTime());
            }
        }
        else if (!task.ConstraintDate) {
            if (task.ConstraintType == 2 || task.ConstraintType == 4 || task.ConstraintType == 5) task.ConstraintDate = new Date(task.Start.getTime());
            if (task.ConstraintType == 3 || task.ConstraintType == 6 || task.ConstraintType == 7) task.ConstraintDate = new Date(task.Finish.getTime());
        }

        return task;
    },
    /////////////////////
    getResources: function () {
        var data = this.dataProject.Resources || []
        return data;
    },
    getDepartments: function () {
        var data = this.dataProject.Departments || []
        return data;
    },
    getPrincipals: function () {
        var data = this.dataProject.Principals || []
        return data;
    },
    getPrincipalsByDepartment: function (dept) {
        var psAll = this.getPrincipals();
        var ps = [];
        for (var i = 0, l = psAll.length; i < l; i++) {
            var p = psAll[i];
            if (p.Department == dept) {
                ps.push(p);
            }
        }
        return ps;
    },
    getTaskByID: function (taskID) {
        return this.project.getTaskByID(taskID);
    },
    getTaskByUID: function (taskUID) {
        return this.project.getTask(taskUID);
    },
    getResourceByUID: function (reUID) {
        return this.project.getResource(reUID);
    }
});