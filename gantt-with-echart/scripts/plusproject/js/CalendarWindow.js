
CalendarWindow = function () {

    CalendarWindow.superclass.constructor.call(this);
    //this.setUrl(url);    
    this.initControls();
    this.initEvents();
}
mini.extend(CalendarWindow, mini.Window, {
    title: "项目日历",
    width: 430,
    height: 467,
    showModal: true,
    showFooter: true,
    //bodyStyle: "padding:0;",
    initControls: function () {
        //        this.setButtons([
        //            { name: "ok", text: "确定", width: 60 },
        //            { name: "cancel", text: "取消", width: 60, style: "margin-left:10px;" }
        //        ]);
        //        this.buttons.setStyle("height:40px;padding-top:8px;");

        var footerEl = this.getFooterEl();
        mini.setStyle(footerEl, "padding:8px;padding-right:10px;text-align:right;");
        footerEl.innerHTML = '<a name="ok" class="mini-button" width="60" style="margin-right:10px;">确定</a> <a name="cancel" class="mini-button" width="60">取消</a>';


        //view
        var bodyEl = this.getBodyEl();
        bodyEl.innerHTML =
            '<div style="padding-bottom:5px;">当前日历：<input id="cwin_calendars" class="mini-combobox" valueField="UID" textField="Name"/></div>  ' +
            '<div style="height:190px;overflow:hidden;"><div style="float:left;width:150px;">图例：</div>' +
                '<div style="float:right;">' +
                    '<div id="cwin_calendar" class="mini-calendar" showFooter="false" height="170" ></div>' +
                '</div><div style="clear:both;overflow:hidden;width:0px;height:0px;"></div>' +
            '</div>' +
            '<div class="mini-tabs" activeIndex="0" bodyStyle="padding:0;">' +
                '<div title="例外日期">' +
                    '<div property="toolbar" id="cwin_bar" class="mini-toolbar" style="border-width:0;border-bottom-width:1px;" >' +
                        '<a id="cwin_add" class="mini-button" plain="true">增加</a>' +
                        '<a id="cwin_del" class="mini-button" plain="true">删除</a>' +
                    '</div>' +
                    '<div id="cwin_exceptions" class="mini-supergrid" style="width:100%;height:108px;" borderStyle="border:0;">' +
                        '<div property="columns">' +
                            '<div type="checkboxcolumn" trueValue="1" falseValue="0" field="DayWorking" width="60">工作日</div>' +
                            '<div field="Name" width="120" editor="{type: \'textbox\'}">例外名称</div>' +
                            '<div name="from" field="FromDate" >开始日期<input property="editor" id="cwin_fromdate" class="mini-datepicker" allowInput="false" /></div>' +
                            '<div name="to" field="ToDate" >完成日期<input property="editor" id="cwin_todate" class="mini-datepicker" allowInput="false"/></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div title="工作周">' +
                    '<div id="cwin_weekdays" class="mini-supergrid" style="width:100%;height:143px;" borderStyle="border:0;">' +
                        '<div property="columns">' +
                            '<div type="checkboxcolumn" trueValue="1" falseValue="0" field="DayWorking" width="60">工作日</div>' +
                            '<div field="DayType" width="150" headerAlign="center" align="center">星期</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ;
        mini.parse(this.el);

        //获取控件对象
        this.ok = mini.getbyName("ok", this);
        this.cancel = mini.getbyName("cancel", this);
        this.addEx = mini.get("cwin_add");
        this.delEx = mini.get("cwin_del");

        this.CalendarsCombo = mini.get("cwin_calendars");
        this.Exceptions = mini.get("cwin_exceptions");
        this.WeekDays = mini.get("cwin_weekdays");


        //////////////////////////////////////////////////
        this.CalendarsCombo.on("valuechanged", function (e) {
            this.selectCalendar(this.CalendarsCombo.value);
        }, this);

        this.WeekDays.on("drawcell", function (e) {
            if (e.field == "DayType") {
                e.cellHtml = mini.getLongWeek(e.value - 1);
            }
        });
        this.WeekDays.on("cellcommitedit", function (e) {
            if (e.field == "DayWorking") {
                //确保工作周必须有一天是工作日
                var working = false;
                var WeekDays = this.getData();
                for (var i = 0, l = WeekDays.length; i < l; i++) {
                    var weekday = WeekDays[i];
                    if (weekday == e.record) continue;
                    if (weekday.DayWorking == 1) {
                        working = true;
                        break;
                    }
                }
                if (working == false) {
                    alert("工作周必须有一天是工作日");
                    e.cancel = true;
                }
            }
        });
        this.Exceptions.on("drawcell", function (e) {
            if (e.field == "FromDate" || e.field == "ToDate") {
                var ex = e.record;
                if (ex.TimePeriod) {
                    e.cellHtml = mini.formatDate(ex.TimePeriod[e.field], "yyyy-MM-dd");
                } else {
                    e.cellHtml = "";
                }
            }
        });
        this.Exceptions.on("cellbeginedit", function (e) {
            if (e.field == "FromDate" || e.field == "ToDate") {
                var ex = e.record;
                if (ex.TimePeriod) {
                    e.value = ex.TimePeriod[e.field];
                } else {
                    e.value = null;
                }
            }
        });
        this.Exceptions.on("cellcommitedit", function (e) {
            if (e.field == "FromDate" || e.field == "ToDate") {
                e.cancel = true;

                var ex = e.record;
                if (!ex.TimePeriod) {
                    ex.TimePeriod = {};
                }
                if (e.field == "FromDate" && e.value) {
                    if (ex.TimePeriod.ToDate && ex.TimePeriod.ToDate < e.value) {
                        alert("例外开始日期不能大于例外结束日期");
                        return;
                    }
                }
                if (e.field == "ToDate" && e.value) {
                    if (ex.TimePeriod.FromDate && ex.TimePeriod.FromDate > e.value) {
                        alert("例外开始日期不能大于例外结束日期");
                        return;
                    }
                }
                if (String(ex.TimePeriod[e.field]) == String(e.value)) return;
                ex.TimePeriod[e.field] = e.value;
                this.refresh();

            }
        });
        this.addEx.on("click", function (e) {
            var ex = {
                DayWorking: 0,
                DayType: 0,
                Name: ""
            };
            this.Exceptions.addRow(ex);
        }, this);
        this.delEx.on("click", function (e) {
        
            this.Exceptions.removeSelected();
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
        this.on("closableclick", function (e) {
            e.cancel = true;
            var ret = true;
            if (this.callback) ret = this.callback('close');
            if (ret !== false) {
                this.hide();
            }
        }, this);
    },
    initEvents: function () {

    },
    getCalendar: function (calendarUID) {
        for (var i = 0, l = this.Calendars.length; i < l; i++) {
            var c = this.Calendars[i];
            if (c.UID == calendarUID) return c;
        }
    },
    markCalenar: function () {
        if (!this.selectedCalendar) return;
        var calendar = this.selectedCalendar;
        calendar.WeekDays = this.WeekDays.getData();
        calendar.Exceptions = this.Exceptions.getData();
    },
    selectCalendar: function (calendarUID) {
        var c = this.getCalendar(calendarUID);
        if (!c) return;

        this.markCalenar();
        var calendar = this.selectedCalendar = this.getCalendar(calendarUID);

        //        for (var i = 0, l = calendar.Exceptions.length; i < l; i++) {
        //            var ex = calendar.Exceptions[i];
        //            ex.TimePeriod.FromDate;
        //            ex.TimePeriod.ToDate;
        //        }

        mini.sort(calendar.WeekDays, function (a, b) {
            return a.DayType - b.DayType;
        });
        //        if (mini.locale == 'zh_CN') {
        //            var o = calendar.WeekDays.removeAt(0);
        //            calendar.WeekDays.push(o);
        //        }

        //this.
        this.Exceptions.setData(calendar.Exceptions);
        this.WeekDays.setData(calendar.WeekDays);
    },
    setData: function (calendars, project, callback) {

        this.callback = callback;
        var dataProject = project.getData();
        var startDate = dataProject.StartDate;
        var calendarUID = dataProject.CalendarUID;

        this.Calendars = mini.clone(calendars);
        this.selectCalendar(calendarUID);

        this.CalendarsCombo.setData(calendars);
        this.CalendarsCombo.setValue(calendarUID);

        //设置日期默认选择是项目开始日期，方便操作

        var fromColumn = this.Exceptions.getColumn("from");
        var toColumn = this.Exceptions.getColumn("to");
        fromColumn.editor.setViewDate(startDate);
        toColumn.editor.setViewDate(startDate);
    },
    getData: function () {
        this.markCalenar();
        for (var i = 0, l = this.Calendars.length; i < l; i++) {
            var c = this.Calendars[i];
            var Exceptions = c.Exceptions;
            for (var j = Exceptions.length - 1; j >= 0; j--) {
                var ex = Exceptions[j];
                if (!ex.TimePeriod || !ex.TimePeriod.FromDate || !ex.TimePeriod.ToDate
                    || (ex.TimePeriod.FromDate > ex.TimePeriod.ToDate)
                    ) {
                    Exceptions.removeAt(j);
                    continue;
                }
                ex.TimePeriod.FromDate = mini.clearTime(ex.TimePeriod.FromDate);
                ex.TimePeriod.ToDate = mini.maxTime(ex.TimePeriod.ToDate);
            }
        }

        return this.Calendars;
    }
});