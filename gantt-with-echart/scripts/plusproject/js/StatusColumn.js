//状态列
PlusProject.StatusColumn = function (optons) {
    return mini.copyTo({
        name: "Status",
        width: 60,
        header: '<div class="mini-gantt-taskstatus"></div>',
        formatDate: function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },
        renderer: function (e) {
            var record = e.record;
            var s = "";
            if (record.PercentComplete == 100) {
                var t = record.Finish ? "任务完成于 " + this.formatDate(record.Finish) : "";
                s += '<div class="mini-gantt-finished" title="' + t + '"></div>';
            }
            if (record.Summary && record.FixedDate) {
            
                var t = "此任务固定日期，从开始日期 " + this.formatDate(record.Start)
                        + " 到完成日期 " + this.formatDate(record.Finish);
                s += '<div class="mini-gantt-constraint3" title=\'' + t + '\'></div>';
            } else if (record.ConstraintType >= 2 && mini.isDate(record.ConstraintDate)) {
                var ct = mini.Gantt.ConstraintType[record.ConstraintType];
                if(ct){
                    var ctype = ct.Name;
                    var t = "此任务有 "+ct.Name+" 的限制，限制日期 " + this.formatDate(record.ConstraintDate);
                    s += '<div class="mini-gantt-constraint' + record.ConstraintType + '" title=\'' + t + '\'></div>';
                }
            }
            if (record.Milestone) {
                s += '<div class="mini-gantt-milestone-red" title="里程碑"></div>';
            }
            if (record.Notes) {
                var t = '备注：' + record.Notes;
                s += '<div class="mini-gantt-notes" title="' + t + '"></div>';
            }
            if (record.Conflict == 1) {
                var t = "此任务排程有冲突，如有必要，请适当调整";
                s += '<div class="mini-gantt-conflict" title="' + t + '"></div>';
            }

            //如果有新的任务状态图标显示, 请参考以上代码实现之......

            return s;
        }
    }, optons);
}