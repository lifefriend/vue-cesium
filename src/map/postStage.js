import * as Cesium from 'cesium';

export default class PostStageMangner {
  constructor(viewer) {
    this.viewer = viewer;
    this.rainPostStage = null;
  }

  clear() {
    if (this.rainPostStage) {
      this.viewer.scene.postProcessStages.remove(this.rainPostStage);
      this.rainPostStage = null;
    }
  }

  show() {
    /* eslint-disable */
     // 下雨效果
     const fs = 'uniform sampler2D colorTexture;\n    varying vec2 v_textureCoordinates;\n                    \n     float hash(float x){\n    return fract(sin(x*133.3)*13.13);\n    }\n                 \n     void main(void){\n    \n float time = czm_frameNumber / 120.0;\n                    vec2 resolution = czm_viewport.zw;\n                    \n                    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n                    vec3 c=vec3(.6,.7,.8);\n                    \n                    float a=-.4;\n                    float si=sin(a),co=cos(a);\n                    uv*=mat2(co,-si,si,co);\n                    uv*=length(uv+vec2(0,4.9))*.3+1.;\n                    \n                    float v=1.-sin(hash(floor(uv.x*100.))*2.);\n                    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n                    c*=v*b; \n                    \n                    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n                    }\n                    ';
     /* eslint-enable */
    const postStage = new Cesium.PostProcessStage({
      fragmentShader: fs,
      uniforms: {
        highlight() {
          return new Cesium.Color(1.0, 1.0, 1.0, 0.5);
        },
      },
    });
    this.rainPostStage = this.viewer.scene.postProcessStages.add(postStage);
  }
}
