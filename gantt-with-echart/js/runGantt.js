const log = console.log.bind(console)

// 按钮
const fBackBtn = document.querySelector("#fBackBtn") //快退
const backBtn = document.querySelector("#backBtn") //后退
const beginBtn = document.querySelector("#beginBtn") //开始按钮
const pauseBtn = document.querySelector("#pauseBtn") //暂停
const stopBtn = document.querySelector("#stopBtn") //停止
//const forwardBtn = document.querySelector("#forwardBtn") //前进
const fForwardBtn = document.querySelector("#fForwardBtn") //快进
const todayBtn = document.querySelector("#todayBtn") //查看今天
const timeChooseInput = document.querySelector("#timeChooseInput") // 日期选择框
let g = 0
let e = 0
let timer = null


// 获取JSON
const data = $.ajax({
    type: 'GET',
    url: 'http://10.20.0.118:8042/getDailyCost.php',
    async: false,
})
const dataEchart = JSON.parse(data.responseText)
const LEN = dataEchart.data.length

// 定义甘特图始末日期
const startDateGantt = '2016-12-09T08:00:00'
const FinishDateGantt = '2017-12-02T15:00:00'

// 计算开始日期
const startDateFN = new Date(dataEchart.data[0].SGRQ)
const startDate = new Date(startDateFN - ((startDateFN.getHours() * 60 * 60 * 1000) + (startDateFN.getMinutes() * 60 * 1000) + (startDateFN.getSeconds() * 1000)))
const finishDateFN = new Date(dataEchart.data[LEN - 1].SGRQ)
const finishDate = new Date(finishDateFN - ((finishDateFN.getHours() * 60 * 60 * 1000) + (finishDateFN.getMinutes() * 60 * 1000) + (finishDateFN.getSeconds() * 1000)))
//开始日期是所给日期的前一个月，x轴原点为前一个月
const oneDay = 24 * 60 * 60 * 1000 //一天的毫秒数
const oneMonth = 31
const beginDate = new Date(+startDate - oneDay * 30)

// 遍历每天的金额
let yBCWP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //提前定义折线图节点数组
let yBCWS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //提前定义折线图节点数组
let yACWP = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //提前定义折线图节点数组
let yAllBCWP = [0]
let yAllBCWS = [0]
let yAllACWP = [0]

for (let i = 0; i < LEN; i++) {
    yBCWP.push(dataEchart.data[i].BCWP)
    yBCWS.push(dataEchart.data[i].BCWS)
    yACWP.push(dataEchart.data[i].ACWP)
}

// 求总和
yAllBCWP = yBCWP.reduce(function(a, b) {
    var c = a.length === 0 ? 0 : a[a.length - 1];
    a.push(parseInt(c) + parseInt(b))

    return a
}, [])

yAllBCWS = yBCWS.reduce(function(a, b) {
    var c = a.length === 0 ? 0 : a[a.length - 1];
    a.push(parseInt(c) + parseInt(b))

    return a
}, [])

yAllACWP = yACWP.reduce(function(a, b) {
    var c = a.length === 0 ? 0 : a[a.length - 1];
    a.push(parseInt(c) + parseInt(b))

    return a
}, [])

// ehcart
const dom = document.getElementById("container")
dom.style.width = "100%"
dom.style.height = "250px"

// ehcart自适应窗口
const myChart = echarts.init(dom)
const app = {}
option = null
window.addEventListener("resize", function() {
    myChart.resize()
})


let yData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //提前定义折线图节点数组
    yDataB = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //提前定义折线图节点数组
    yDataC = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //提前定义折线图节点数组
    yAll = [0], //折线图节点和
    yAllB = [0], //折线图节点和
    yAllC = [0], //折线图节点和
    yDataSort = [], //折线图节点和集
    yDataSortB = [], //折线图节点和集
    yDataSortC = [], //折线图节点和集
    xCoord = [], //横坐标
    yCoord, //纵坐标
    runName = "时间线", //运动竖线的文字内容
    endName = "终点线", //终点竖线的文字内容
    runPos = "bottom", //运动竖线的文字位置
    endPos = "top", //终点竖线的文字位置
    tdyPos = "bottom", //今天竖线的文字位置
    runColor = "red", //运动竖线的颜色
    endColor = "green", //终点竖线的颜色
    tdyColor = "#32ceff", //今天竖线的颜色
    runW = 2, //运动竖线的宽
    endW = 2, //终点竖线的宽
    tdyW = 2, //今天竖线的宽度
    hourTime = 3600, //一小时的时间（秒数）
    dayTime = 86400, //一天的事件（秒数）
    speed = dayTime, //定义运动竖线按什么速度走（一天或者一小时）
    time = 1000; // 定时器间隔时间

// 横坐标日期集合
for (var i = 0; i < 31; i++) {
    var now = new Date(+beginDate + oneDay * i); //开始日期加i天
    var xItem = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'); //取日期节点坐横坐标
    xCoord.push(xItem);
}

function runGantt() {

    //折线图节点数字求和
    // yAll = yData.reduce(function(sum, value) {
    //     return sum + value
    // })
    // yAllB = yDataB.reduce(function(sum, value) {
    //     return sum + value
    // })
    // yAllC = yDataC.reduce(function(sum, value) {
    //     return sum + value
    // })
    //
    // //折线图节点数字求和 数组
    // yDataSort = yData.reduce(function(sum, value) {
    //     var all = sum.length === 0 ? 0 : sum[sum.length - 1];
    //     sum.push(all + value)
    //     return sum
    // }, [])
    // yDataSortB = yDataB.reduce(function(sum, value) {
    //     var all = sum.length === 0 ? 0 : sum[sum.length - 1];
    //     sum.push(all + value)
    //     return sum
    // }, [])
    // yDataSortC = yDataC.reduce(function(sum, value) {
    //     var all = sum.length === 0 ? 0 : sum[sum.length - 1];
    //     sum.push(all + value)
    //     return sum
    // }, [])
    //
    // //纵坐标重点max值
    // yCoord = Math.ceil(yAll * 1.15)

    option = {
        title: {
            text: '黑沙洲水道航道整治二期工程',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            // formatter: '{a} <br/>{b} : {c}',
            axisPointer: {
                type: 'line',
            },
        },
        legend: {
            right: '2%',
            top: '8%',
            data: ['BCWP', 'BCWS', 'ACWP']
        },
        xAxis: {
            type: 'category',
            name: '日期',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            data: xCoord,
        },
        yAxis: {
            type: 'value',
            name: '总金额（万元）',
            min: 0,
            max: yCoord,
            splitLine: {
                show: false
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [{
                name: 'BCWP',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#FFAF00' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                },
                markLine: {
                    silent: true,
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'red' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FFAF00' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                    data: [
                        [{
                            coord: [xCoord.length-1, 0],
                            symbol: 'none'
                        }, {
                            coord: [xCoord.length-1, yAllBCWP[xCoord.length-1]],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, yAllBCWP[xCoord.length-1]],
                            symbol: 'none'
                        }, {
                            coord: [xCoord.length-1, yAllBCWP[xCoord.length-1]],
                            symbol: 'none'
                        }],
                    ]
                },
                markPoint: {
                    silent: true,
                    symbol: 'circle',
                    symbolSize: 9,
                    label: {
                        normal: {
                            offset: [-15, -15],
                            textStyle: {
                                color: '#000'
                            },
                        },
                    },
                    itemStyle: {
                        normal: {
                            type: 'solid',
                            borderColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'red' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FFAF00' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            borderWidth: 1,
                            color: '#fff'
                        }
                    },
                    data: [{
                        coord: [xCoord.length-1, yAllBCWP[xCoord.length-1]]
                    }]
                },
                data: yAllBCWP
            },
            {
                name: 'BCWS',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#97baf3' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#3fa7dc' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                },
                markLine: {
                    silent: true,
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#97baf3' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#3fa7dc' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                    data: [
                        [{
                            coord: [xCoord.length-1, 0],
                            symbol: 'none'
                        }, {
                            coord: [xCoord.length-1, yAllBCWS[xCoord.length-1]],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, yAllBCWS[xCoord.length-1]],
                            symbol: 'none'
                        }, {
                            coord: [xCoord.length-1, yAllBCWS[xCoord.length-1]],
                            symbol: 'none'
                        }],
                    ]
                },
                markPoint: {
                    silent: true,
                    symbol: 'circle',
                    symbolSize: 9,
                    label: {
                        normal: {
                            offset: [-15, -15],
                            textStyle: {
                                color: '#000'
                            },
                        },
                    },
                    itemStyle: {
                        normal: {
                            type: 'solid',
                            borderColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#97baf3' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#3fa7dc' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            borderWidth: 1,
                            color: '#fff'
                        }
                    },
                    data: [{
                        coord: [xCoord.length-1, yAllBCWS[xCoord.length-1]]
                    }]
                },
                data: yAllBCWS
            },
            {
                name: 'ACWP',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#a5efb6' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#28a745' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                },
                markLine: {
                    silent: true,
                    lineStyle: {
                        normal: {
                            type: 'solid',
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#a5efb6' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28a745' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                        }
                    },
                    data: [
                        [{
                            coord: [xCoord.length-1, 0],
                            symbol: 'none'
                        }, {
                            coord: [xCoord.length-1, yAllACWP[xCoord.length-1]],
                            symbol: 'none'
                        }],
                        [{
                            coord: [0, yAllACWP[xCoord.length-1]],
                            symbol: 'none'
                        }, {
                            coord: [xCoord.length-1, yAllACWP[xCoord.length-1]],
                            symbol: 'none'
                        }],
                    ]
                },
                markPoint: {
                    silent: true,
                    symbol: 'circle',
                    symbolSize: 9,
                    label: {
                        normal: {
                            offset: [-15, -15],
                            textStyle: {
                                color: '#000'
                            },
                        },
                    },
                    itemStyle: {
                        normal: {
                            type: 'solid',
                            borderColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#a5efb6' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28a745' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            borderWidth: 1,
                            color: '#fff'
                        }
                    },
                    data: [{
                        coord: [xCoord.length-1, yAllACWP[xCoord.length-1]]
                    }]
                },
                data: yAllACWP
            },
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true)
    }

    // 前进运动函数
    function fwGantt() {

        let timeChooseInputValueArray = timeChooseInput.value.split(' ')
        let timeChooseInputPlaceholderArray = timeChooseInput.placeholder.split(' ')

        valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : new Date(timeChooseInputPlaceholderArray[0])
        valueFinish = timeChooseInputValueArray[2] ? new Date(timeChooseInputValueArray[2]) : new Date(timeChooseInputPlaceholderArray[2])

        //甘特图部分
        g = g + 1
        //  开始运动
        var runDate = new Date((valueStart / 1000 + speed * g) * 1000)
        project.setTimeLines([{
                date: valueFinish,
                text: endName,
                position: endPos,
                style: "width:" + endW + "px;background:" + endColor + ";"
            },
            {
                date: runDate,
                text: runName,
                position: runPos,
                style: "width:" + runW + "px;background:" + runColor + ";"
            }
        ]);
        project.scrollToDate(runDate)
        //echarts部分
        e = e + 1

        let yAllBCWPCrd = yAllBCWP.slice(e, e+oneMonth)
        let yAllBCWSCrd = yAllBCWS.slice(e, e+oneMonth)
        let yAllACWPCrd = yAllACWP.slice(e, e+oneMonth)

        var newDay = new Date(+beginDate + oneDay * (30 + e)) //生成一个月后新的一天
        var moreDay = [newDay.getFullYear(), newDay.getMonth() + 1, newDay.getDate()].join('-')

        xCoord.shift() //去掉日期数组的第一个值
        xCoord.push(moreDay) //把新的日期加到数组里去


        option = {
            title: {
                text: '黑沙洲水道航道整治二期工程',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                },
            },
            legend: {
                right: '2%',
                top: '8%',
                data: ['BCWP', 'BCWS', 'ACWP']
            },
            xAxis: {
                type: 'category',
                name: '时间',
                boundaryGap: false,
                splitLine: {
                    show: false
                },
                data: xCoord,
            },
            yAxis: {
                type: 'value',
                name: '总金额',
                min: 0,
                max: yCoord,
                splitLine: {
                    show: false
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            series: [{
                    name: 'BCWP',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'red' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#FFAF00' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    markLine: {
                        silent: true,
                        lineStyle: {
                            normal: {
                                type: 'dashed',
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#FFAF00' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        },
                        data: [
                            [{
                                coord: [xCoord.length-1, 0],
                                symbol: 'none'
                            }, {
                                coord: [xCoord.length-1, yAllBCWPCrd[xCoord.length-1]],
                                symbol: 'none'
                            }],
                            [{
                                coord: [0, yAllBCWPCrd[xCoord.length-1]],
                                symbol: 'none'
                            }, {
                                coord: [xCoord.length-1, yAllBCWPCrd[xCoord.length-1]],
                                symbol: 'none'
                            }],
                        ]
                    },
                    markPoint: {
                        silent: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            normal: {
                                offset: [-15, -15],
                                textStyle: {
                                    color: '#000'
                                },
                            },
                        },
                        itemStyle: {
                            normal: {
                                type: 'solid',
                                show: true,
                                borderColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'red' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#FFAF00' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                color: '#fff'
                            }
                        },
                        data: [{
                            coord: [xCoord.length-1, yAllBCWPCrd[xCoord.length-1]]
                        }]
                    },
                    data: yAllBCWPCrd
                },
                {
                    name: 'BCWS',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#97baf3' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#3fa7dc' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    markLine: {
                        silent: true,
                        lineStyle: {
                            normal: {
                                type: 'dashed',
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#97baf3' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#3fa7dc' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        },
                        data: [
                            [{
                                coord: [xCoord.length-1, 0],
                                symbol: 'none'
                            }, {
                                coord: [xCoord.length-1, yAllBCWSCrd[xCoord.length-1]],
                                symbol: 'none'
                            }],
                            [{
                                coord: [0, yAllBCWSCrd[xCoord.length-1]],
                                symbol: 'none'
                            }, {
                                coord: [xCoord.length-1, yAllBCWSCrd[xCoord.length-1]],
                                symbol: 'none'
                            }],
                        ]
                    },
                    markPoint: {
                        silent: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            normal: {
                                offset: [-15, -15],
                                textStyle: {
                                    color: '#000'
                                },
                            },
                        },
                        itemStyle: {
                            normal: {
                                type: 'solid',
                                show: true,
                                borderColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#97baf3' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#3fa7dc' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                color: '#fff'
                            }
                        },
                        data: [{
                            coord: [xCoord.length-1, yAllBCWSCrd[xCoord.length-1]]
                        }]
                    },
                    data: yAllBCWSCrd
                },
                {
                    name: 'ACWP',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: '#a5efb6' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#28a745' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    markLine: {
                        silent: true,
                        lineStyle: {
                            normal: {
                                type: 'dashed',
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#a5efb6' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#28a745' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                            }
                        },
                        data: [
                            [{
                                coord: [xCoord.length-1, 0],
                                symbol: 'none'
                            }, {
                                coord: [xCoord.length-1, yAllACWPCrd[xCoord.length-1]],
                                symbol: 'none'
                            }],
                            [{
                                coord: [0, yAllACWPCrd[xCoord.length-1]],
                                symbol: 'none'
                            }, {
                                coord: [xCoord.length-1, yAllACWPCrd[xCoord.length-1]],
                                symbol: 'none'
                            }],
                        ]
                    },
                    markPoint: {
                        silent: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            normal: {
                                offset: [-15, -15],
                                textStyle: {
                                    color: '#000'
                                },
                            },
                        },
                        itemStyle: {
                            normal: {
                                type: 'solid',
                                show: true,
                                borderColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: '#a5efb6' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: '#28a745' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                color: '#fff'
                            }
                        },
                        data: [{
                            coord: [xCoord.length-1, yAllACWPCrd[xCoord.length-1]]
                        }]
                    },
                    data: yAllACWPCrd
                }
            ]
        }

        if (option && typeof option === "object") {
            myChart.setOption(option, true)
        }

        if (runDate / 1000 >= valueFinish / 1000) {
            clearInterval(timer)
        }
    }

    // 后退运动函数
    function bkGantt() {

        let timeChooseInputValueArray = timeChooseInput.value.split(' ')
        let timeChooseInputPlaceholderArray = timeChooseInput.placeholder.split(' ')

        valueStart = timeChooseInputValueArray[0] ? new Date(timeChooseInputValueArray[0]) : new Date(timeChooseInputPlaceholderArray[0])
        valueFinish = timeChooseInputValueArray[2] ? new Date(timeChooseInputValueArray[2]) : new Date(timeChooseInputPlaceholderArray[2])

        //甘特图部分
        g = g - 1
        //  开始运动
        var runDate = new Date((valueStart / 1000 + speed * g) * 1000)
        project.setTimeLines([{
                date: valueFinish,
                text: endName,
                position: endPos,
                style: "width:" + endW + "px;background:" + endColor + ";"
            },
            {
                date: runDate,
                text: runName,
                position: runPos,
                style: "width:" + runW + "px;background:" + runColor + ";"
            }
        ]);
        project.scrollToDate(runDate)



        if (runDate / 1000 <= valueStart / 1000) {
            clearInterval(timer)
        }
    }

    /**
        运动计时器函数
        开始函数
    **/
    function startGantt() {
        clearInterval(timer)
        timer = setInterval(fwGantt, time)
    }

    // 停止函数
    function pauseGantt() {
        clearInterval(timer)
    }

    // 快退按钮事件
    fBackBtn.onclick = function() {
        clearInterval(timer)
        timer = setInterval(bkGantt, time / 2)
    }

    // 后退按钮事件
    backBtn.onclick = function() {
        clearInterval(timer)
        timer = setInterval(bkGantt, time)
    }

    // 开始按钮事件
    beginBtn.onclick = function() {
        startGantt()
    }

    // 暂停按钮事件
    pauseBtn.onclick = function() {
        pauseGantt()
    }

    // 停止按钮事件
    stopBtn.onclick = function() {
        clearInterval(timer)
        g = 0

        project.setTimeLines([{
            date: startDate,
            text: ' ',
            position: runPos,
            style: "width:" + tdyW + "px;background:transparent;"
        }])
    }

    // 前进按钮事件
    // forwardBtn.onclick = function() {
    //
    // }

    // 快进按钮事件
    fForwardBtn.onclick = function() {
        clearInterval(timer)
        timer = setInterval(fwGantt, time / 2)
    }

    // 查看今天事件
    todayBtn.onclick = function() {
        let today = new Date()

        todayText = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

        project.setTimeLines([{
            date: today,
            text: todayText,
            position: runPos,
            style: "width:" + tdyW + "px;background:" + tdyColor + ";"
        }])
        project.scrollToDate(today)
    }
}

runGantt()
