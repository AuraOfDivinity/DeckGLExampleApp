import React, { Component } from 'react';
import DeckGL from 'deck.gl';
import { PathLayer, LineLayer, GeoJsonLayer } from '@deck.gl/layers';

export default class DeckGLOverlay extends Component {
  render() {
    if (!this.props.layerData) {
      return null;
    }

    const layerData = this.props.layerData;
    const measurements = this.props.measurements;

    let layers = [];

    measurements.forEach((element, index) => {
      let layer = new GeoJsonLayer({
        id: 'layer' + index,
        data: element,
        pickable: true,
        stroked: false,
        filled: true,
        extruded: true,
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: [89, 255, 247],
        getLineColor: [89, 255, 247],
        getRadius: 100,
        getElevation: 30
      });

      layers.push(layer);
    });

    const pathLayer = new PathLayer({
      id: 'path-layer',
      data: layerData,
      pickable: true,
      getPath: d => d.path,
      getColor: d => d.color,
      getWidth: d => 4,
      widthMinPixels: 4
    });

    return <DeckGL {...this.props.viewport} layers={layers} />;
  }
}
