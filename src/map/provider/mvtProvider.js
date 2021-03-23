import * as Cesium from 'cesium';
import ol from 'openlayers/dist/ol-debug';

function createMapboxStreetsV6Style() {
  const fill = new ol.style.Fill({ color: '' });
  const stroke = new ol.style.Stroke({ color: '', width: 1 });
  const polygon = new ol.style.Style({ fill });
  const strokedPolygon = new ol.style.Style({ fill, stroke });
  const line = new ol.style.Style({ stroke });
  const text = new ol.style.Style({
    text: new ol.style.Text({
      text: '', fill, stroke,
    }),
  });
  const iconCache = {};
  function getIcon(iconName) {
    let icon = iconCache[iconName];
    if (!icon) {
      icon = new ol.style.Style({
        image: new ol.style.Icon({
          src: `https://cdn.rawgit.com/mapbox/maki/master/icons/${iconName}-15.svg`,
          imgSize: [15, 15],
        }),
      });
      iconCache[iconName] = icon;
    }
    return icon;
  }
  const styles = [];
  return function (feature, resolution) {
    let length = 0;
    const layer = feature.get('layer');
    const cls = feature.get('class');
    const type = feature.get('type');
    const scalerank = feature.get('scalerank');
    const labelrank = feature.get('labelrank');
    const adminLevel = feature.get('admin_level');
    const maritime = feature.get('maritime');
    const disputed = feature.get('disputed');
    const maki = feature.get('maki');
    const geom = feature.getGeometry().getType();
    if (layer === 'landuse' && cls === 'park') {
      fill.setColor('#d8e8c8');
      styles[length++] = polygon;
    } else if (layer === 'landuse' && cls === 'cemetery') {
      fill.setColor('#e0e4dd');
      styles[length++] = polygon;
    } else if (layer === 'landuse' && cls === 'hospital') {
      fill.setColor('#fde');
      styles[length++] = polygon;
    } else if (layer === 'landuse' && cls === 'school') {
      fill.setColor('#f0e8f8');
      styles[length++] = polygon;
    } else if (layer === 'landuse' && cls === 'wood') {
      fill.setColor('rgb(233,238,223)');
      styles[length++] = polygon;
    } else if (layer === 'waterway'
      && cls !== 'river' && cls !== 'stream' && cls !== 'canal') {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'waterway' && cls === 'river') {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'waterway' && (cls === 'stream'
      || cls === 'canal')) {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'water') {
      fill.setColor('#a0c8f0');
      styles[length++] = polygon;
    } else if (layer === 'aeroway' && geom === 'Polygon') {
      fill.setColor('rgb(242,239,235)');
      styles[length++] = polygon;
    } else if (layer === 'aeroway' && geom === 'LineString'
      && resolution <= 76.43702828517625) {
      stroke.setColor('#f0ede9');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'building') {
      fill.setColor('#f2eae2');
      stroke.setColor('#dfdbd7');
      stroke.setWidth(1);
      styles[length++] = strokedPolygon;
    } else if (layer === 'tunnel' && cls === 'motorway_link') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'tunnel' && cls === 'service') {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'tunnel'
      && (cls === 'street' || cls === 'street_limited')) {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'tunnel' && cls === 'main'
      && resolution <= 1222.99245256282) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'tunnel' && cls === 'motorway') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'tunnel' && cls === 'path') {
      stroke.setColor('#cba');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'tunnel' && cls === 'major_rail') {
      stroke.setColor('#bbb');
      stroke.setWidth(2);
      styles[length++] = line;
    } else if (layer === 'road' && cls === 'motorway_link') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'road' && (cls === 'street'
      || cls === 'street_limited') && geom === 'LineString') {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'road' && cls === 'main'
      && resolution <= 1222.99245256282) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'road' && cls === 'motorway'
      && resolution <= 4891.96981025128) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'road' && cls === 'path') {
      stroke.setColor('#cba');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'road' && cls === 'major_rail') {
      stroke.setColor('#bbb');
      stroke.setWidth(2);
      styles[length++] = line;
    } else if (layer === 'bridge' && cls === 'motorway_link') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'bridge' && cls === 'motorway') {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'bridge' && cls === 'service') {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'bridge'
      && (cls === 'street' || cls === 'street_limited')) {
      stroke.setColor('#cfcdca');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'bridge' && cls === 'main'
      && resolution <= 1222.99245256282) {
      stroke.setColor('#e9ac77');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'bridge' && cls === 'path') {
      stroke.setColor('#cba');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'bridge' && cls === 'major_rail') {
      stroke.setColor('#bbb');
      stroke.setWidth(2);
      styles[length++] = line;
    } else if (layer === 'admin' && adminLevel >= 3 && maritime === 0) {
      stroke.setColor('#9e9cab');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'admin' && adminLevel === 2
      && disputed === 0 && maritime === 0) {
      stroke.setColor('#9e9cab');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'admin' && adminLevel === 2
      && disputed === 1 && maritime === 0) {
      stroke.setColor('#9e9cab');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'admin' && adminLevel >= 3 && maritime === 1) {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'admin' && adminLevel === 2 && maritime === 1) {
      stroke.setColor('#a0c8f0');
      stroke.setWidth(1);
      styles[length++] = line;
    } else if (layer === 'country_label' && scalerank === 1) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 11px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length++] = text;
    } else if (layer === 'country_label' && scalerank === 2
      && resolution <= 19567.87924100512) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 10px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length++] = text;
    } else if (layer === 'country_label' && scalerank === 3
      && resolution <= 9783.93962050256) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 9px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length++] = text;
    } else if (layer === 'country_label' && scalerank === 4
      && resolution <= 4891.96981025128) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 8px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#334');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(2);
      styles[length++] = text;
    } else if (layer === 'marine_label' && labelrank === 1
      && geom === 'Point') {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont(
        'italic 11px "Open Sans", "Arial Unicode MS"',
      );
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'marine_label' && labelrank === 2
      && geom === 'Point') {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont(
        'italic 11px "Open Sans", "Arial Unicode MS"',
      );
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'marine_label' && labelrank === 3
      && geom === 'Point') {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont(
        'italic 10px "Open Sans", "Arial Unicode MS"',
      );
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'marine_label' && labelrank === 4
      && geom === 'Point') {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont(
        'italic 9px "Open Sans", "Arial Unicode MS"',
      );
      fill.setColor('#74aee9');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'place_label' && type === 'city'
      && resolution <= 1222.99245256282) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('11px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#333');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'place_label' && type === 'town'
      && resolution <= 305.748113140705) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('9px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#333');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'place_label' && type === 'village'
      && resolution <= 38.21851414258813) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('8px "Open Sans", "Arial Unicode MS"');
      fill.setColor('#333');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'place_label'
      && resolution <= 19.109257071294063 && (type === 'hamlet'
        || type === 'suburb' || type === 'neighbourhood')) {
      text.getText().setText(feature.get('name_en'));
      text.getText().setFont('bold 9px "Arial Narrow"');
      fill.setColor('#633');
      stroke.setColor('rgba(255,255,255,0.8)');
      stroke.setWidth(1);
      styles[length++] = text;
    } else if (layer === 'poi_label' && resolution <= 19.109257071294063
      && scalerank === 1 && maki !== 'marker') {
      styles[length++] = getIcon(maki);
    } else if (layer === 'poi_label' && resolution <= 9.554628535647032
      && scalerank === 2 && maki !== 'marker') {
      styles[length++] = getIcon(maki);
    } else if (layer === 'poi_label' && resolution <= 4.777314267823516
      && scalerank === 3 && maki !== 'marker') {
      styles[length++] = getIcon(maki);
    } else if (layer === 'poi_label' && resolution <= 2.388657133911758
      && scalerank === 4 && maki !== 'marker') {
      styles[length++] = getIcon(maki);
    } else if (layer === 'poi_label' && resolution <= 1.194328566955879
      && scalerank >= 5 && maki !== 'marker') {
      styles[length++] = getIcon(maki);
    }
    styles.length = length;
    return styles;
  };
}

export default function MVTProvider(options) {
  options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
  this._tilingScheme = Cesium.defined(options.tilingScheme) ? options.tilingScheme : new Cesium.WebMercatorTilingScheme({ ellipsoid: options.ellipsoid });
  this._tileWidth = Cesium.defaultValue(options.tileWidth, 512);
  this._tileHeight = Cesium.defaultValue(options.tileHeight, 512);
  this._readyPromise = Cesium.when.resolve(true);
  this._ol = ol;
  this._mvtParser = new this._ol.format.MVT();
  this._styleFun = Cesium.defined(options.styleFun) ? options.styleFun : createMapboxStreetsV6Style;
  this._key = Cesium.defaultValue(options.key, '');
  this._url = Cesium.defaultValue(options.url, 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}');

  const sw = this._tilingScheme._rectangleSouthwestInMeters;
  const ne = this._tilingScheme._rectangleNortheastInMeters;
  const mapExtent = [sw.x, sw.y, ne.x, ne.y];
  this._resolutions = ol.tilegrid.resolutionsFromExtent(mapExtent, 22, this._tileWidth);
  this._pixelRatio = 1;
  this._transform = [0.125, 0, 0, 0.125, 0, 0];
  this._replays = ['Default', 'Image', 'Polygon', 'LineString', 'Text'];

  this._tileQueue = new Cesium.TileReplacementQueue();
  this._cacheSize = 1000;
}

Object.defineProperties(MVTProvider.prototype, {
  proxy: {
    get() {
      return undefined;
    },
  },

  tileWidth: {
    get() {
      return this._tileWidth;
    },
  },

  tileHeight: {
    get() {
      return this._tileHeight;
    },
  },

  maximumLevel: {
    get() {
      return undefined;
    },
  },

  minimumLevel: {
    get() {
      return undefined;
    },
  },

  tilingScheme: {
    get() {
      return this._tilingScheme;
    },
  },

  rectangle: {
    get() {
      return this._tilingScheme.rectangle;
    },
  },

  tileDiscardPolicy: {
    get() {
      return undefined;
    },
  },

  errorEvent: {
    get() {
      return this._errorEvent;
    },
  },

  ready: {
    get() {
      return true;
    },
  },

  readyPromise: {
    get() {
      return this._readyPromise;
    },
  },

  credit: {
    get() {
      return undefined;
    },
  },

  hasAlphaChannel: {
    get() {
      return true;
    },
  },
});

MVTProvider.prototype.getTileCredits = function () {
  return undefined;
};

function findTileInQueue(x, y, level, tileQueue) {
  let item = tileQueue.head;
  while (item !== undefined && !(item.xMvt === x && item.yMvt === y && item.zMvt === level)) {
    item = item.replacementNext;
  }
  return item;
}

function remove(tileReplacementQueue, item) {
  const previous = item.replacementPrevious;
  const next = item.replacementNext;

  if (item === tileReplacementQueue._lastBeforeStartOfFrame) {
    tileReplacementQueue._lastBeforeStartOfFrame = next;
  }

  if (item === tileReplacementQueue.head) {
    tileReplacementQueue.head = next;
  } else {
    previous.replacementNext = next;
  }

  if (item === tileReplacementQueue.tail) {
    tileReplacementQueue.tail = previous;
  } else {
    next.replacementPrevious = previous;
  }

  item.replacementPrevious = undefined;
  item.replacementNext = undefined;

  --tileReplacementQueue.count;
}

function trimTiles(tileQueue, maximumTiles) {
  let tileToTrim = tileQueue.tail;
  while (tileQueue.count > maximumTiles
    && Cesium.defined(tileToTrim)) {
    const previous = tileToTrim.replacementPrevious;
    remove(tileQueue, tileToTrim);
    tileToTrim = null;
    tileToTrim = previous;
  }
}

MVTProvider.prototype.requestImage = function (x, y, level) {
  const cacheTile = findTileInQueue(x, y, level, this._tileQueue);
  if (cacheTile !== undefined) {
    return cacheTile;
  }

  const that = this;
  let url = this._url;
  url = url.replace('{x}', x).replace('{y}', y).replace('{z}', level).replace('{k}', this._key);
  (function (x, y, z) {
    const resource = Cesium.Resource.createIfNeeded(url);
    return resource.fetchArrayBuffer().then((arrayBuffer) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const vectorContext = canvas.getContext('2d');

      const features = that._mvtParser.readFeatures(arrayBuffer);

      const styleFun = that._styleFun();

      const extent = [0, 0, 4096, 4096];
      let _replayGroup = new ol.render.canvas.ReplayGroup(0, extent, 8, true, 100);
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const styles = styleFun(features[i], that._resolutions[level]);
        for (let j = 0; j < styles.length; j++) {
          ol.renderer.vector.renderFeature_(_replayGroup, feature, styles[j], 16);
        }
      }
      _replayGroup.finish();

      _replayGroup.replay(vectorContext, that._pixelRatio, that._transform, 0, {}, that._replays, true);
      if (that._tileQueue.count > that._cacheSize) {
        trimTiles(that._tileQueue, that._cacheSize / 2);
      }

      canvas.xMvt = x;
      canvas.yMvt = y;
      canvas.zMvt = z;
      that._tileQueue.markTileRendered(canvas);
      _replayGroup = null;
      return canvas;
    }).otherwise(() => {
    });
  }(x, y, level));
};

MVTProvider.prototype.pickFeatures = function () {
  return undefined;
};
