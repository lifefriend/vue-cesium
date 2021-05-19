import * as Cesium from 'cesium';

class AnimationWall {
  constructor(viewer) {
    this.viewer = viewer;
  }

  add(positions) {
    const maximumHeights = Array(positions.length / 2).fill(600);
    const minimumHeights = Array(positions.length / 2).fill(60);
    positions = Cesium.Cartesian3.fromDegreesArray(positions);

    const dayMaximumHeights = Array(minimumHeights.length).fill(600);

    this.viewer.entities.add({
      wall: {
        positions,
        maximumHeights: new Cesium.CallbackProperty(() => {
          for (let i = 0; i < minimumHeights.length; i++) {
            dayMaximumHeights[i] += maximumHeights[i] * 0.004;
            if (dayMaximumHeights[i] > maximumHeights[i]) {
              dayMaximumHeights[i] = minimumHeights[i];
            }
          }
          return dayMaximumHeights;
        }, false),
        minimumHeights,
        material: new Cesium.Color(1, 0, 0, 0.8),
      },
    });
  }
}
export default AnimationWall;
