const log = console.log.bind(console)
const w = window.innerWidth
const h = window.innerHeight
const c = document.querySelector('#canvas') // 获取canvas
const CclientRect = c.getBoundingClientRect() // 获取canvas的各种坐标值
let ctx = c.getContext('2d') // 实例化一个2dcanvas
c.width = w - 80 // 设置宽高
c.height = h
let d = false // 初始化鼠标按下事件 初始时为false
let lIndex = 0  // 计算直线情况下的点击数
let drawX // 初始画鼠标按下的起始点
let drawY

let color = '#fff'

let circlePointArr = []

// 勾股定理
function triangle(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

function draw() {
  c.onmousedown = (e) => {
    if ($('.pen').hasClass('active')) {
      d = true

      drawX = e.pageX - CclientRect.x
      drawY = e.pageY - CclientRect.y

      ctx.beginPath()
      ctx.moveTo(drawX, drawY)
    } else if ($('.note').hasClass('active')) {
      d = true

      if (d) {
        drawX = e.pageX - CclientRect.x
        drawY = e.pageY - CclientRect.y

        const noteBox = '<div class="note-box" style="left:'+ drawX +'px;top:'+ drawY +'px;"><textarea fcon="true" rows="6" cols="25"></textarea></div>'

        $('body').append(noteBox)

        const txtarea = document.querySelector('.note-box').querySelector('textarea')

        txtarea.focus()

        txtarea.onfocus = function () {
          this.setAttribute('fcon', 'true')
        }
        txtarea.onblur = function () {
          this.setAttribute('fcon', 'false')
        }
      }
    } else if ($('.line').hasClass('active')) {
      lIndex++
      d = true

      if (lIndex == 1) {
        drawX = e.pageX - CclientRect.x
        drawY = e.pageY - CclientRect.y

        ctx.beginPath()
        ctx.moveTo(drawX, drawY)
      } else if (lIndex == 2) {
        drawX = e.pageX - CclientRect.x
        drawY = e.pageY - CclientRect.y

        log(lIndex)
        ctx.lineTo(drawX, drawY)
        ctx.closePath()
        ctx.lineWidth = 5
        ctx.strokeStyle = color
        ctx.stroke()

        d = false
        lIndex = 0
      }
    } else if ($('.eraser').hasClass('active')) {
      d = true

      drawX = e.pageX - CclientRect.x
      drawY = e.pageY - CclientRect.y

      ctx.beginPath()
      ctx.moveTo(drawX, drawY)
    } else if ($('.circle').hasClass('active')) {
      d = true

      circlePointArr = []
    } else if ($('.square').hasClass('active')) {
      d = true

      circlePointArr = []
    }
  }

  c.onmouseup = (e) => {
    d = false

    if ($('.pen').hasClass('active')) {
      ctx.closePath()
    }else if ($('.eraser').hasClass('active')) {
      ctx.closePath()
    } else if ($('.circle').hasClass('active')) {
      const len = circlePointArr.length

      if (len > 0) {
        ctx.beginPath()
        ctx.arc(
          circlePointArr[0].x,
          circlePointArr[0].y,
          triangle(
            circlePointArr[len - 1].x - circlePointArr[0].x,
            circlePointArr[len - 1].y - circlePointArr[0].y,
          ),
          0,
          Math.PI * 2,
          true)
        ctx.closePath()
        ctx.lineWidth = 5
        ctx.strokeStyle = color
        ctx.stroke()
      }

      // circleAddLine(e)

      circlePointArr = []

    } else if ($('.square').hasClass('active')) {
      const len = circlePointArr.length
      const beginX = circlePointArr[0].x
      const beginY = circlePointArr[0].y
      const squareW = circlePointArr[len - 1].x - beginX
      const squareH = circlePointArr[len - 1].y - beginY

      ctx.beginPath()
      ctx.moveTo(beginX - squareW, beginY - squareH)
      ctx.lineTo(beginX - squareW, beginY + squareH)
      ctx.lineTo(beginX + squareW, beginY + squareH)
      ctx.lineTo(beginX + squareW, beginY - squareH)
      ctx.lineTo(beginX - squareW, beginY - squareH)
      ctx.closePath()
      ctx.lineWidth = 5
      ctx.strokeStyle = color
      ctx.stroke()

      // squareAddLine(e)

      circlePointArr = []

    }
  }

  c.onmousemove = (e) => {
    if ($('.pen').hasClass('active')) {
      if (d) {
        ctx.lineTo(e.pageX - CclientRect.x, e.pageY - CclientRect.y)
        ctx.lineWidth = 5
        ctx.strokeStyle = color
        ctx.stroke()
      }
    }else if ($('.eraser').hasClass('active')) {
      if (d) {
        ctx.clearRect(e.pageX - CclientRect.x, e.pageY - CclientRect.y, 20, 20)
      }
    } else if ($('.circle').hasClass('active')) {
      if (d) {
        circlePointArr.push({
          x: e.pageX,
          y: e.pageY,
        })

        const len = circlePointArr.length

        ctx.beginPath()
        ctx.arc(
          circlePointArr[0].x,
          circlePointArr[0].y,
          triangle(
            circlePointArr[len - 1].x - circlePointArr[0].x,
            circlePointArr[len - 1].y - circlePointArr[0].y,
          ),
          0,
          Math.PI * 2,
          true)
        ctx.closePath()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
        ctx.stroke()

        if (len > 1) {
          clearCircle(circlePointArr[0].x, circlePointArr[0].y, triangle(
            circlePointArr[len - 2].x - circlePointArr[0].x,
            circlePointArr[len - 2].y - circlePointArr[0].y,
          ))
        }
      }
    } else if ($('.square').hasClass('active')) {
      if (d) {
        circlePointArr.push({
          x: e.pageX,
          y: e.pageY,
        })

        const len = circlePointArr.length
        const beginX = circlePointArr[0].x
        const beginY = circlePointArr[0].y
        const squareW = circlePointArr[len - 1].x - beginX
        const squareH = circlePointArr[len - 1].y - beginY

        ctx.beginPath()
        ctx.moveTo(beginX - squareW, beginY - squareH)
        ctx.lineTo(beginX - squareW, beginY + squareH)
        ctx.lineTo(beginX + squareW, beginY + squareH)
        ctx.lineTo(beginX + squareW, beginY - squareH)
        ctx.lineTo(beginX - squareW, beginY - squareH)
        ctx.closePath()
        ctx.lineWidth = 1
        ctx.strokeStyle = color
        ctx.stroke()

        ctx.clearRect(beginX - squareW, beginY - squareH, squareW * 2, squareH * 2)
      }
    }
  }
}

$('.tool').click(function() {
  if ($(this).hasClass('active')) {
    $(this).removeClass('active')
  } else {
    $(this).addClass('active').siblings().removeClass('active')

    draw()
  }
})

$('.restart').click(function () {
  d = false
  ctx.clearRect(0, 0, c.width, c.height)
})

function clearCircle (x,y,r) {
	for (let i=0; i< Math.round(Math.PI * r); i++){
		let angle = (i / Math.round(Math.PI * r)) * 360;
		ctx.clearRect(x, y, Math.sin(angle * (Math.PI / 180)) * r , Math.cos(angle * (Math.PI / 180)) * r);
	}
}

function circleAddLine(e) {
  let beginX = circlePointArr[0].x
  let beginY = circlePointArr[0].y
  let r = triangle(
    e.pageX - beginX,
    e.pageY - beginY
  )

  if (beginX + r + 150 > c.width) {
    ctx.beginPath()
    ctx.moveTo(beginX - r, beginY)
    ctx.lineTo(beginX - r - 50, beginY + 50)
    ctx.lineTo(beginX - r - 150, beginY + 50)
    ctx.strokeStyle = color
    ctx.stroke()
  } else if (beginY + 50 > c.height) {
    ctx.beginPath()
    ctx.moveTo(beginX + r, beginY)
    ctx.lineTo(beginX + r + 50, beginY - 50)
    ctx.lineTo(beginX + r + 150, beginY - 50)
    ctx.strokeStyle = color
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(beginX + r, beginY)
    ctx.lineTo(beginX + r + 50, beginY + 50)
    ctx.lineTo(beginX + r + 150, beginY + 50)
    ctx.strokeStyle = color
    ctx.stroke()
  }

  // log(e)
  // ctx.beginPath()
  // ctx.moveTo(e.pageX, e.pageY)
  // ctx.lineTo(e.pageX + 200, e.pageY + 30)
  // ctx.strokeStyle = color
  // ctx.stroke()
  //
  // c.onmousedown = (e) => {
  //   // d = false
  //   console.log(d)
  // }
}

function squareAddLine(e) {
  let w = e.pageX - circlePointArr[0].x
  let h = e.pageY - circlePointArr[0].y


  if (e.pageX + 50 > c.width) {
    ctx.beginPath()
    ctx.moveTo(e.pageX - w * 2, e.pageY)
    ctx.lineTo(e.pageX - w - 50, e.pageY + 50)
    ctx.lineTo(e.pageX - w - 150, e.pageY + 50)
    ctx.strokeStyle = color
    ctx.stroke()
  } else if (e.pageY + 50 > c.height) {
    ctx.beginPath()
    ctx.moveTo(e.pageX, e.pageY - h * 2)
    ctx.lineTo(e.pageX + 50, e.pageY - h * 2 - 50)
    ctx.lineTo(e.pageX + 150, e.pageY - h * 2 - 50)
    ctx.strokeStyle = color
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(e.pageX, e.pageY)
    ctx.lineTo(e.pageX + 50, e.pageY + 50)
    ctx.lineTo(e.pageX + 150, e.pageY + 50)
    ctx.strokeStyle = color
    ctx.stroke()
  }
}

window.onmousemove = (e) => {
  if (e.pageX > c.width || e.pageX < 0 || e.pageY > c.height || e.pageY < 0) {
    d = false

    return false
  }
}

document.onkeydown = (e) => {
  if(e.keyCode == 13 && e.ctrlKey) {
    if (e.target.value.trim() && e.target.getAttribute('fcon')==='true') {
      e.target.setAttribute('readonly', 'readonly')
    }
  }
}

draw()
