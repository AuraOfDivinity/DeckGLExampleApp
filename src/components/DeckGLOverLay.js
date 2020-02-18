import React, { Component } from "react";
import DeckGL from "deck.gl";
import { PathLayer, LineLayer } from "@deck.gl/layers";

export default class DeckGLOverlay extends Component {
  render() {
    if (!this.props.layerData) {
      return null;
    }

    const layerData = this.props.layerData;

    const pathLayer = new PathLayer({
      id: "path-layer",
      data: layerData,
      pickable: true,
      getPath: d => d.path,
      getColor: d => d.color,
      getWidth: d => 4,
      widthMinPixels: 4
    });

    return <DeckGL {...this.props.viewport} layers={[pathLayer]} />;
  }
}
