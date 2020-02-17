/* global window */
import React, { Component } from "react";
import MapGL from "react-map-gl";
import { MapStylePicker } from "./controls";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

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

  handleChange = () => {};

  render() {
    return (
      <div>
        <Grid container spacing={10}>
          <Paper color="red"></Paper>
          <Grid item lg={9} sm={9} md={9}>
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
          <Grid item lg={3} sm={3} md={3}>
            <div style={{ fontFamily: "Montserrat", fontSize: "1.3" }}>
              The most recent 20 tracks are available in the follwoing dropdown.
            </div>
            <FormControl variant="outlined" style={{ width: "100%" }}>
              <Select
                native
                onChange={this.handleChange("age")}
                inputProps={{
                  name: "age",
                  id: "outlined-age-native-simple"
                }}
              >
                <option value="" />
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    );
  }
}
