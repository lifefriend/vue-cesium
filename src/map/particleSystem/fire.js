import * as Cesium from 'cesium'
import fireImage from './images/fire.png'

// 火焰粒子
export default class Fire {
  constructor (viewer) {
    this.viewer = viewer
    this.style = this.getDefaultStyle()
  }

  start (xyz) {
    const { x, y, z = 0 } = xyz || {}
    this.particleSystem = this.createParticleSystem({ x, y, z })
    this.viewer.scene.primitives.add(this.particleSystem)
  }

  // 创建粒子对象
  createParticleSystem ({ x, y, z }) {
    return new Cesium.ParticleSystem({
      image: this.style.fireImage,
      startColor: new Cesium.Color(1, 1, 1, 1), // 粒子出生时的颜色
      endColor: new Cesium.Color(0.5, 0, 0, 0), // 当粒子死亡时的颜色
      startScale: this.style.startScale, // 粒子出生时的比例，相对于原始大小
      endScale: this.style.endScale, // 粒子在死亡时的比例
      minimumParticleLife: this.style.minimumParticleLife, // 设置粒子寿命的可能持续时间的最小界限（以秒为单位），粒子的实际寿命将随机生成
      maximumParticleLife: this.style.maximumParticleLife, // 设置粒子寿命的可能持续时间的最大界限（以秒为单位），粒子的实际寿命将随机生成
      minimumSpeed: this.style.minimumSpeed, // 设置以米/秒为单位的最小界限，超过该最小界限，随机选择粒子的实际速度。
      maximumSpeed: this.style.maximumSpeed, // 设置以米/秒为单位的最大界限，超过该最大界限，随机选择粒子的实际速度。
      emissionRate: this.style.emissionRate, // 每秒发射的粒子数
      imageSize: new Cesium.Cartesian2(this.style.particleSize, this.style.particleSize), // 如果设置该属性，将会覆盖 minimumImageSize和maximumImageSize属性，以像素为单位缩放image的大小
      lifetime: 16.0, // 多长时间的粒子系统将以秒为单位发射粒子
      loop: true,
      emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)), // 此系统的粒子发射器  共有 圆形、锥体、球体、长方体 ( BoxEmitter,CircleEmitter,ConeEmitter,SphereEmitter ) 几类
      sizeInMeters: true,
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(x, y, z)) // 4x4转换矩阵，可将粒子系统从模型转换为世界坐标
    })
  }

  // 移除
  remove () {
    this.viewer.scene.primitives.remove(this.particleSystem) // 删除粒子对象
  }

  updateStyle (style) {
    style = style || this.style
    this.particleSystem.startScale = style.startScale
    this.particleSystem.endScale = style.endScale
    this.particleSystem.minimumParticleLife = style.minimumParticleLife
    this.particleSystem.maximumParticleLife = style.maximumParticleLife
    this.particleSystem.minimumSpeed = style.minimumSpeed
    this.particleSystem.maximumSpeed = style.maximumSpeed
    this.particleSystem.imageSize = new Cesium.Cartesian2(style.particleSize, style.particleSize)
    this.particleSystem.emissionRate = style.emissionRate
  }

  // 默认样式信息
  getDefaultStyle () {
    return {
      fireImage,
      startScale: 3,
      endScale: 1.5,
      minimumParticleLife: 1.5,
      maximumParticleLife: 1.8,
      minimumSpeed: 7,
      maximumSpeed: 9,
      particleSize: 2,
      emissionRate: 200
    }
  }
}
