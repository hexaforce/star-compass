export default class StarCompass {
  constructor(canvas, color = 'rgba(0, 200, 200, 0.8)', indicator = 'rgba(200, 0, 0, 0.8)') {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d', { antialias: true })
    this.radius = this.canvas.width / 2
    this.color = color
    this.indicator = indicator

    this.currentAngle = 0

    const dpr = window.devicePixelRatio || 1
    const logicalWidth = this.radius * 2
    const logicalHeight = this.radius * 2
    this.canvas.width = logicalWidth * dpr
    this.canvas.height = logicalHeight * dpr
    this.canvas.style.width = `${logicalWidth}px`
    this.canvas.style.height = `${logicalHeight}px`
    this.ctx.scale(dpr, dpr)
    this.center = {
      x: logicalWidth / 2,
      y: logicalHeight / 2,
    }

    this.ctx.imageSmoothingEnabled = true
    this.ctx.imageSmoothingQuality = 'high'

    this.ctx.fillStyle = this.color
    this.ctx.strokeStyle = this.color
    this.drawRotatedStars(this.currentAngle)
  }

  drawRotatedStars(angle) {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)

    this.ctx.save()
    this.ctx.translate(this.center.x, this.center.y)
    this.ctx.rotate((angle * Math.PI) / 180)
    this.ctx.translate(-this.center.x, -this.center.y)

    this.drawOuterTicks()
    this.draw4PointedStar(this.radius * 0.875, this.radius * 0.17, 0)
    this.draw4PointedStar(this.radius * 0.55, this.radius * 0.1, Math.PI / 4)

    this.ctx.restore()

    this.ctx.save()
    const triangleSize = this.radius * 0.05
    const triangleTop = this.center.y - this.radius * 0.95

    this.ctx.fillStyle = this.indicator
    this.ctx.strokeStyle = this.indicator
    this.drawAndClear([
      { x: this.center.x, y: triangleTop + triangleSize * 1.8 },
      { x: this.center.x - triangleSize, y: triangleTop },
      { x: this.center.x + triangleSize, y: triangleTop },
    ])
    this.ctx.fill()
    this.ctx.restore()
  }

  drawOuterTicks() {
    const smallTickLength = this.radius / 40
    const mediumTickLength = smallTickLength * 2.5
    const outerRadius = this.radius * 0.7
    const labelRadius = this.radius * 0.8

    this.drawCircle(this.radius * 0.685, this.radius / 40)
    this.drawCircle(this.radius * 0.585, this.radius / 150)
    this.drawCircle(this.radius * 0.485, this.radius / 60)
    this.drawCircle(this.radius * 0.39, this.radius / 120)
    this.drawCircle(this.radius * 0.365, this.radius / 180)

    this.drawDots(this.radius * 0.44, 24, this.radius * 0.01)

    this.drawTicks(outerRadius, smallTickLength, mediumTickLength, labelRadius)

    const mainDirections = [
      { angle: 0, text: 'N' },
      { angle: 90, text: 'E' },
      { angle: 180, text: 'S' },
      { angle: 270, text: 'W' },
    ].forEach((dir) => {
      const angleRad = ((dir.angle - 90) * Math.PI) / 180
      const radius = this.radius * 0.925
      const x = this.center.x + radius * Math.cos(angleRad)
      const y = this.center.y + radius * Math.sin(angleRad)

      const font = this.radius / 6
      this.ctx.save()
      this.ctx.font = `bold ${font}px Arial`
      const textWidth = this.ctx.measureText(dir.text).width
      const textHeight = font
      const padding = font * 0.3
      const bgWidth = textWidth + padding * 2
      const bgHeight = textHeight + padding * 2

      this.ctx.translate(x, y)
      this.ctx.rotate(angleRad + Math.PI / 2)
      this.ctx.globalCompositeOperation = 'destination-out'
      this.ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight)
      this.ctx.globalCompositeOperation = 'source-over'
      this.ctx.fillStyle = 'transparent'
      this.ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight)
      this.ctx.fillStyle = this.color
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(dir.text, 0, 0)
      this.ctx.restore()
    })
    const interDirections = [
      { angle: 45, text: 'NE' },
      { angle: 135, text: 'SE' },
      { angle: 225, text: 'SW' },
      { angle: 315, text: 'NW' },
    ].forEach((dir) => {
      const angleRad = ((dir.angle - 90) * Math.PI) / 180
      const radius = this.radius * 0.58
      const x = this.center.x + radius * Math.cos(angleRad)
      const y = this.center.y + radius * Math.sin(angleRad)

      const font = this.radius / 13
      this.ctx.save()
      this.ctx.font = `bold ${font}px Arial`
      const textWidth = this.ctx.measureText(dir.text).width
      const textHeight = font
      const padding = font * 0.3
      const bgWidth = textWidth + padding * 2
      const bgHeight = textHeight + padding * 2

      this.ctx.translate(x, y)
      this.ctx.rotate(angleRad + Math.PI / 2)
      this.ctx.globalCompositeOperation = 'destination-out'
      this.ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight)
      this.ctx.globalCompositeOperation = 'source-over'
      this.ctx.fillStyle = 'transparent'
      this.ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight)
      this.ctx.fillStyle = this.color
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(dir.text, 0, 0)
      this.ctx.restore()
    })
  }

  drawCircle(radius, lineWidth) {
    this.ctx.beginPath()
    this.ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2)
    this.ctx.lineWidth = lineWidth
    this.ctx.stroke()
  }

  drawDots(circleRadius, dotCount, dotRadius) {
    for (let i = 0; i < dotCount; i++) {
      const angle = (i * 2 * Math.PI) / dotCount
      const x = this.center.x + circleRadius * Math.cos(angle)
      const y = this.center.y + circleRadius * Math.sin(angle)
      this.ctx.beginPath()
      this.ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  drawTicks(outerRadius, smallTickLength, mediumTickLength, labelRadius) {
    this.ctx.lineWidth = 0.5
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `${this.radius / 14}px Arial`

    for (let i = 0; i < 360; i += 1) {
      const angleRad = ((i - 90) * Math.PI) / 180
      const cos = Math.cos(angleRad)
      const sin = Math.sin(angleRad)

      let tickLength = smallTickLength
      if (i % 5 === 0) tickLength = mediumTickLength

      this.ctx.beginPath()
      this.ctx.moveTo(this.center.x + outerRadius * cos, this.center.y + outerRadius * sin)
      this.ctx.lineTo(this.center.x + (outerRadius + tickLength) * cos, this.center.y + (outerRadius + tickLength) * sin)
      this.ctx.stroke()

      if (i % 15 === 0 && i % 90 !== 0) {
        this.drawAngleLabel(i, angleRad, labelRadius)
      }
    }

    for (let i = 0; i < 360; i += 45) {
      const angleRad = ((i - 90) * Math.PI) / 180
      if ([45, 135, 225, 315].includes(i)) {
        this.ctx.lineWidth = this.radius / 140
        this.drawTriangle(angleRad)
      }
    }
  }

  drawAngleLabel(angle, angleRad, labelRadius) {
    this.ctx.save()
    this.ctx.translate(this.center.x + labelRadius * Math.cos(angleRad), this.center.y + labelRadius * Math.sin(angleRad))
    this.ctx.rotate(angleRad + Math.PI / 2)
    this.ctx.lineWidth = this.radius / 1000
    this.ctx.fillText(angle, 0, 0)
    this.ctx.restore()
  }

  drawAndClear(pathPoints) {
    this.ctx.beginPath()
    this.ctx.moveTo(pathPoints[0].x, pathPoints[0].y)
    for (let i = 1; i < pathPoints.length; i++) {
      this.ctx.lineTo(pathPoints[i].x, pathPoints[i].y)
    }
    this.ctx.closePath()

    this.ctx.save()
    this.ctx.clip()

    const xCoords = pathPoints.map((p) => p.x)
    const yCoords = pathPoints.map((p) => p.y)

    const minX = Math.min(...xCoords)
    const minY = Math.min(...yCoords)
    const maxX = Math.max(...xCoords)
    const maxY = Math.max(...yCoords)

    this.ctx.clearRect(minX, minY, maxX - minX, maxY - minY)
    this.ctx.restore()

    this.ctx.stroke()
  }

  drawTriangle(angle) {
    const outerRadius = this.radius * 0.765
    const triangleSize = this.radius / 45

    const tipX = this.center.x + outerRadius * Math.cos(angle)
    const tipY = this.center.y + outerRadius * Math.sin(angle)

    const baseRadius = outerRadius - triangleSize * 3
    const baseAngle1 = angle - Math.PI / 65
    const baseAngle2 = angle + Math.PI / 65

    const baseX1 = this.center.x + baseRadius * Math.cos(baseAngle1)
    const baseY1 = this.center.y + baseRadius * Math.sin(baseAngle1)
    const baseX2 = this.center.x + baseRadius * Math.cos(baseAngle2)
    const baseY2 = this.center.y + baseRadius * Math.sin(baseAngle2)

    this.drawAndClear([
      { x: tipX, y: tipY },
      { x: baseX1, y: baseY1 },
      { x: baseX2, y: baseY2 },
    ])
  }

  draw4PointedStar(outerRadius, innerRadius, rotationAngle) {
    const spikes = 4
    this.ctx.lineWidth = this.radius / 170

    for (let i = 0; i < spikes; i++) {
      const outerAngle = (i * 2 * Math.PI) / spikes - Math.PI / 2 + rotationAngle
      const outerX = this.center.x + outerRadius * Math.cos(outerAngle)
      const outerY = this.center.y + outerRadius * Math.sin(outerAngle)

      const ratio = rotationAngle === 0 ? 0.915 : 0.716

      for (let j = -1; j <= 1; j += 2) {
        const innerAngle = outerAngle + (j * Math.PI) / spikes
        const innerX = this.center.x + innerRadius * Math.cos(innerAngle)
        const innerY = this.center.y + innerRadius * Math.sin(innerAngle)

        const shortenedX = outerX + (innerX - outerX) * ratio
        const shortenedY = outerY + (innerY - outerY) * ratio

        this.drawAndClear([
          { x: this.center.x, y: this.center.y },
          { x: outerX, y: outerY },
          { x: shortenedX, y: shortenedY },
        ])
        if (j !== -1) {
          this.ctx.fill()
        }
      }
    }
  }

  animateTo(angle, duration = 10) {
    const startAngle = this.currentAngle
    const diffAngle = (angle - startAngle + 360) % 360
    const finalAngle = startAngle + (diffAngle > 180 ? diffAngle - 360 : diffAngle)
    const startTime = performance.now()

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1)
      const easedProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress)
      this.currentAngle = startAngle + (finalAngle - startAngle) * easedProgress
      this.drawRotatedStars(this.currentAngle % 360)
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }
}
