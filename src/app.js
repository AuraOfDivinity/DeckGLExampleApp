/* global window */
import React, { Component } from "react";
import MapGL from "react-map-gl";
import { MapStylePicker } from "./controls";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

export default class App extends Component {
  state = {
    style: "mapbox://styles/mapbox/dark-v9",
    viewport: {
      width: "100%",
      height: window.innerHeight,
      longitude: 7.6261,
      latitude: 51.9607,
      zoom: 11,
      maxZoom: 16
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resize);
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  _onViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _resize = () => {
    this._onViewportChange({
      width: "100%",
      height: window.innerHeight
    });
  };

  render() {
    return (
      <div>
        <Grid container spacing={10}>
          <Paper color="red"></Paper>
          <Grid item lg={9}>
            <MapStylePicker
              onStyleChange={this.onStyleChange}
              currentStyle={this.state.style}
            />
            <MapGL
              {...this.state.viewport}
              mapStyle={this.state.style}
              onViewportChange={viewport => this._onViewportChange(viewport)}
              mapboxApiAccessToken={
                "pk.eyJ1IjoiYXVyYW9mZGl2aW5pdHkiLCJhIjoiY2s2bng4bGIzMTI4NTNscDZodGE4YzZvcyJ9.EUzx63KUHzjzzm1PJFfRPg"
              }
            ></MapGL>
          </Grid>
          <Grid item lg={3}></Grid>
        </Grid>
      </div>
    );
  }
}
