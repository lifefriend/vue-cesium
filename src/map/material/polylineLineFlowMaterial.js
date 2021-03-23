import * as Cesium from 'cesium';
import materialPng from './polylineLineFlowMaterial.png';

export class LineFlowMaterialProperty {
  constructor(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = (new Date()).getTime();
    this.init();
  }

  init() {
    Cesium.Material.LineFlowLinkType = 'LineFlowLink';
    Cesium.Material.LineFlowLinkImage = materialPng;// 图片
    Cesium.Material.LineFlowLinkSource = 'czm_material czm_getMaterial(czm_materialInput materialInput)\n'
    + '{\n'
    + '      czm_material material = czm_getDefaultMaterial(materialInput);\n'
    + '      vec2 st = repeat * materialInput.st;\n'
    + '      vec4 colorImage = texture2D(image, vec2(fract((axisY?st.t:st.s) - time), st.t));\n'
    + '      if(color.a == 0.0)\n'
    + '      {\n'
    + '          material.alpha = colorImage.a;\n'
    + '          material.diffuse = colorImage.rgb;\n'
    + '      }\n'
    + '      else\n'
    + '      {\n'
    + '          material.alpha = colorImage.a * color.a;\n'
    + '          material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n'
    + '      }\n'
    + '      return material;\n'
    + '}';
    Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlowLinkType, {
      fabric: {
        type: Cesium.Material.LineFlowLinkType,
        uniforms: {
          color: new Cesium.Color(1, 0, 0, 1),
          image: Cesium.Material.LineFlowLinkImage,
          time: 0,
          repeat: new Cesium.Cartesian2(1, 1),
          axisY: false,
        },
        source: Cesium.Material.LineFlowLinkSource,
      },
      translucent() {
        return true;
      },
    });
  }

  getType() {
    return 'LineFlowLink';
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.LineFlowLinkImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
  }

  equals(other) {
    return this === other || (other instanceof LineFlowMaterialProperty && Cesium.Property.equals(this._color, other._color));
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }
}
Object.defineProperties(LineFlowMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
});
