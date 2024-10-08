import * as Cesium from 'cesium';
import { LineFlowMaterialProperty } from './material/polylineLineFlowMaterial';
import { PolylineTrailLinkMaterialProperty } from './material/polylineTrailLinkMaterial';
import { getLinkedPointList } from './utils/common';
import WaterPolygon from './shader/WaterPolygon';
import water from './material/water.jpg';
import p0 from './images/p0.jpg';
import p1 from './images/p1.jpg';
import p2 from './images/p2.png';
import p3 from './images/p3.jpg';

// 流向动态线
export function addAnimationLine(from, to, viewer) {
  const e = Cesium.Cartesian3.fromDegrees(from.x, from.y, 1);
  // 绘制起点
  viewer.entities.add({
    name: from.name,
    position: e,
    point: {
      pixelSize: 10,
      color: new Cesium.Color(0.3, 0.79, 1, 0.9),
    },
  });
  for (let index = 0; index < to.length; index++) {
    const o = to[index];
    const t = Cesium.Cartesian3.fromDegrees(o.x, o.y, 1);
    // 绘制(流动)曲线
    viewer.entities.add({
      name: o.name,
      polyline: {
        positions: getLinkedPointList(e, t, 4e4, 100),
        width: 2,
        material: new LineFlowMaterialProperty(new Cesium.Color(1, 0.79, 0.15, 1), 2e3),
      },
    });
    // 绘制终点
    viewer.entities.add({
      name: o.name,
      position: t,
      point: {
        pixelSize: 8,
        color: new Cesium.Color(1, 201 / 255, 38 / 255, 1),
      },
    });
  }
}

// 流向动态直线
export function addAnimationStraightLine(coordinates, viewer) {
  if (coordinates instanceof Array) {
    const positions = [].concat.apply([], coordinates);
    const material = new PolylineTrailLinkMaterialProperty();
    viewer.entities.add(
      new Cesium.Entity({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(positions),
          width: 5,
          clampToGround: true,
          material,
        },
      }),
    );
  } else {
    console.warn('参数错误');
  }
}

// 水纹
export function addWaterAnimation(coordinates, viewer) {
  const primitive = new Cesium.Primitive({
    show: true,
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArrayHeights(coordinates),
        ),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        extrudedHeight: 0, // 只显示水面
        height: 0,
      }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      aboveGround: true,
      material: new Cesium.Material({
        fabric: {
          type: 'Water',
          uniforms: {
            normalMap: water,
            frequency: 100.0,
            animationSpeed: 0.01,
            amplitude: 10.0,
          },
        },
      }),
      // 水透明化
      fragmentShaderSource:
        'varying vec3 v_positionMC;\n'
        + 'varying vec3 v_positionEC;\n'
        + 'varying vec2 v_st;\n'
        + 'void main()\n'
        + '{\n'
        + 'czm_materialInput materialInput;\n'
        + 'vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n'
        + '#ifdef FACE_FORWARD\n'
        + 'normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n'
        + '#endif\n'
        + 'materialInput.s = v_st.s;\n'
        + 'materialInput.st = v_st;\n'
        + 'materialInput.str = vec3(v_st, 0.0);\n'
        + 'materialInput.normalEC = normalEC;\n'
        + 'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n'
        + 'vec3 positionToEyeEC = -v_positionEC;\n'
        + 'materialInput.positionToEyeEC = positionToEyeEC;\n'
        + 'czm_material material = czm_getMaterial(materialInput);\n'
        + '#ifdef FLAT\n'
        + 'gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n'
        + '#else\n'
        + 'gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n'
        + 'gl_FragColor.a=0.85;\n'
        + '#endif\n'
        + '}\n',
    }),
  });
  viewer.scene.primitives.add(primitive);
}

// 水纹2
export function addWaterAnimation2(coordinates, viewer) {
  const positions = Cesium.Cartesian3.fromDegreesArrayHeights(coordinates);
  const polygon = new WaterPolygon({
    positions,
  });
  viewer.scene.primitives.add(polygon.primitive);
}

// 加载白模(自定义渲染)
export function add3DTiles(url, viewer) {
  const tileset1 = new Cesium.Cesium3DTileset({
    url,
    // 控制切片视角显示的数量，可调整性能
    maximumScreenSpaceError: 2,
    maximumNumberOfLoadedTiles: 100000,
  });
  tileset1.readyPromise.then((tileset) => {
    viewer.scene.primitives.add(tileset);
    const r = tileset.boundingSphere.radius;
    const boundingSphere = new Cesium.BoundingSphere(tileset.boundingSphere.center, r * 0.125);
    viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    tileset.style = new Cesium.Cesium3DTileStyle({
      color: 'vec4(0, 0.5, 1.0,1)',
    });
    // 注入 shader
    tileset.tileVisible.addEventListener((tile) => {
      const { content } = tile;
      const { featuresLength } = content;
      for (let i = 0; i < featuresLength; i += 2) {
        const feature = content.getFeature(i);
        const model = feature.content._model;

        if (model && model._sourcePrograms && model._rendererResources) {
          Object.keys(model._sourcePrograms).forEach((key) => {
            const program = model._sourcePrograms[key];
            const fragmentShader = model._rendererResources.sourceShaders[program.fragmentShader];
            let vPosition = '';
            if (fragmentShader.indexOf(' v_positionEC;') !== -1) {
              vPosition = 'v_positionEC';
            } else if (fragmentShader.indexOf(' v_pos;') !== -1) {
              vPosition = 'v_pos';
            }
            const color = `vec4(${feature.color.toString()})`;

            // 自定义着色器
            model._rendererResources.sourceShaders[program.fragmentShader] = ` 
              varying vec3 ${vPosition};// 相机坐标系的模型坐标
              void main(void){
                /* 渐变效果 */
                vec4 v_helsing_position = czm_inverseModelView * vec4(${vPosition},1);// 解算出模型坐标
                float stc_pl = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                float stc_sd = v_helsing_position.z / 60.0 + sin(stc_pl) * 0.1;
                gl_FragColor = ${color};// 基础蓝色
                gl_FragColor *= vec4(stc_sd, stc_sd, stc_sd, 1.0);// 按模型高度进行颜色变暗处理
                /* 扫描线 */
                float glowRange = 360.0; // 光环的移动范围(高度)，最高到360米
                float stc_a13 = fract(czm_frameNumber / 360.0);// 计算当前着色器的时间，帧率/（6*60），即时间放慢6倍
                float stc_h = clamp(v_helsing_position.z / glowRange, 0.0, 1.0);
                stc_a13 = abs(stc_a13 - 0.5) * 2.0;
                float stc_diff = step(0.005, abs(stc_h - stc_a13));// 根据时间来计算颜色差异
                gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - stc_diff);// 原有颜色加上颜色差异值提高亮度
              }
            `;
          });
          // 让系统重新编译着色器
          model._shouldRegenerateShaders = true;
        }
      }
    });
  });
}

let postProcessStage = null;
export function removeAnimation(viewer) {
  if (!postProcessStage) return;
  viewer.scene.postProcessStages.remove(postProcessStage);
  postProcessStage = null;
}
export function animation1(viewer) {
  removeAnimation(viewer);
  viewer.scene.postProcessStages.fxaa.enabled = true;
  const fragmentShaderSource = `
          uniform sampler2D colorTexture;
          varying vec2 v_textureCoordinates;

          vec3 palette( float t ) {
              vec3 a = vec3(0.5, 0.5, 0.5);
              vec3 b = vec3(0.5, 0.5, 0.5);
              vec3 c = vec3(1.0, 1.0, 1.0);
              vec3 d = vec3(0.263,0.416,0.557);

              return a + b*cos( 6.28318*(c*t+d) );
          }

          void main()
          {
              vec2 iResolution = czm_viewport.zw;
              float iTime = czm_frameNumber*0.008;

              vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
              vec2 uv0 = uv;
              vec3 finalColor = vec3(0.0);
              for (float i = 0.0; i < 4.0; i++) {
                  uv = fract(uv * 1.5) - 0.5;
                  float d = length(uv) * exp(-length(uv0));
                  vec3 col = palette(length(uv0) + i*.4 + iTime*.4);
                  d = sin(d*8. + iTime)/8.;
                  d = abs(d);
                  d = pow(0.01 / d, 1.2);
                  finalColor += col * d;
              }
              gl_FragColor = vec4(finalColor, 1.0);
              // 场景颜色
              vec4 sceneColor = texture2D(colorTexture, v_textureCoordinates);
              // 颜色混合-混合场景颜色和当前效果的颜色
              gl_FragColor = mix(gl_FragColor,sceneColor,0.9);
  }`;

  postProcessStage = viewer.scene.postProcessStages.add(
    new Cesium.PostProcessStage({
      fragmentShader: fragmentShaderSource,
      uniforms: {
        // fogColor: Cesium.Color.BLACK,
      },
    }),
  );
}

export function animation2() {
  // TODO
}
