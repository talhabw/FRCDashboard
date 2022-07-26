function drawTicks(ctx, tickColor, centerX, centerY, size, textRadius) {
  ctx.beginPath()
  ctx.strokeStyle = tickColor
  ctx.fillStyle = tickColor
  ctx.lineWidth = 2

  for (let i = 0; i < 16; i++) {
    let angle = (i / 16) * (2 * Math.PI)
    ctx.moveTo(centerX + size * Math.cos(angle), centerY + size * Math.sin(angle))
    ctx.lineTo(centerX + size * 0.8 * Math.cos(angle), centerY + size * 0.8 * Math.sin(angle))
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.lineWidth = 3

  for (let i = 0; i < 4; i++) {
    let angle = (i / 4) * (2 * Math.PI)
    ctx.moveTo(centerX + size * Math.cos(angle), centerY + size * Math.sin(angle))
    ctx.lineTo(centerX + size * 0.7 * Math.cos(angle), centerY + size * 0.7 * Math.sin(angle))
    ctx.stroke()
  }

  ctx.fillText('0°', centerX, centerY - textRadius)
  ctx.fillText('90°', centerX + textRadius, centerY)
  ctx.fillText('180°', centerX, centerY + textRadius)
  ctx.fillText('270°', centerX - textRadius, centerY)
  ctx.stroke()

  ctx.fillText('45°', centerX + textRadius * Math.cos(Math.PI / 4), centerY - textRadius * Math.sin(Math.PI / 4))
  ctx.fillText('135°', centerX + textRadius * Math.cos(Math.PI / 4), centerY + textRadius * Math.sin(Math.PI / 4))
  ctx.fillText('225°', centerX - textRadius * Math.cos(Math.PI / 4), centerY + textRadius * Math.sin(Math.PI / 4))
  ctx.fillText('315°', centerX - textRadius * Math.cos(Math.PI / 4), centerY - textRadius * Math.sin(Math.PI / 4))
  ctx.stroke()
}

function drawArrow(ctx, centerX, centerY, size, angle, upArrowColor, downArrowColor) {
  let arrowWidth = size * 0.2

  ctx.translate(centerX, centerY)
  ctx.rotate(angle * Math.PI / 180)

  ctx.strokeWidth = 1
  ctx.strokeStyle = upArrowColor
  ctx.fillStyle = upArrowColor

  ctx.beginPath()
  ctx.moveTo(arrowWidth / 2, 0)
  ctx.lineTo(arrowWidth / 2, -size * 0.7)
  ctx.lineTo(0, -size * 0.9)
  ctx.lineTo(-arrowWidth / 2, -size * 0.7)
  ctx.lineTo(-arrowWidth / 2, 0)
  ctx.lineTo(arrowWidth / 2, 0)

  ctx.stroke()
  ctx.fill()

  ctx.strokeWidth = 1
  ctx.strokeStyle = downArrowColor
  ctx.fillStyle = downArrowColor

  ctx.beginPath()
  ctx.moveTo(arrowWidth / 2, 0)
  ctx.lineTo(arrowWidth / 2, size * 0.7)
  ctx.lineTo(0, size * 0.9)
  ctx.lineTo(-arrowWidth / 2, size * 0.7)
  ctx.lineTo(-arrowWidth / 2, 0)
  ctx.lineTo(arrowWidth / 2, 0)

  ctx.stroke()
  ctx.fill()

  ctx.strokeStyle = '#000000'
  ctx.fillStyle = '#000000'

  ctx.beginPath()
  ctx.arc(0, 0, arrowWidth / 2 + 0.1, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

function drawCompass(canvasID, angle) {
  let canvas = document.querySelector(`#${canvasID}`)
  let ctx = canvas.getContext('2d')

  canvas.width = 200
  canvas.height = 200

  let width = canvas.offsetWidth
  let height = canvas.offsetHeight
  let centerX = width / 2
  let centerY = height / 2

  let size = 0
  let textRadius = 0

  if (width > height) {
    size = centerX * 0.7
    textRadius = centerX * 0.85
  } else {
    size = centerY * 0.7
    textRadius = centerY * 0.85
  }

  let tickColor = '#ffffff'
  let upArrowColor = '#65bc47'
  let downArrowColor = '#cccccc'

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '15px sans-serif'


  ctx.clearRect(0, 0, width, height)
  drawTicks(ctx, tickColor, centerX, centerY, size, textRadius)
  drawArrow(ctx, centerX, centerY, size, angle, upArrowColor, downArrowColor)
}