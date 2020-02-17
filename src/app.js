/* global window */
import React, { Component } from "react";
import MapGL from "react-map-gl";
import { MapStylePicker } from "./controls";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// Easing function
import d3 from "d3-ease";

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
      },
      recentTracks: [],
      selectedTrack: ""
  };

  componentDidMount () {
      window.addEventListener("resize", this._resize);
      this._resize();
      this.fetchRecentTracks();
  }

  componentWillUnmount () {
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

  fetchRecentTracks = () => {
      let dataArr = [];
      fetch("https://envirocar.org/auth-proxy/api/tracks/?limit=20", {
          method: "GET",
          headers: {
              Authorization: "Basic QXNlbFBlaXJpczpJc2lwYXRoYW5hOQ=="
          }
      })
          .then(res => {
              return res.json();
          })
          .then(resData => {
              this.setState({ recentTracks: resData.tracks });
          })
          .catch(err => {
              console.log(err);
          });
  };

  fetchMeasurementsOfSelectedTrack = () => {
      fetch(
          "https://envirocar.org/auth-proxy/api/tracks/" +
        this.state.selectedTrack +
        "/measurements",
          {
              method: "GET",
              headers: {
                  Authorization: "Basic QXNlbFBlaXJpczpJc2lwYXRoYW5hOQ=="
              }
          }
      )
          .then(res => {
              return res.json();
          })
          .then(data => console.log(data))
          .catch(err => {
              console.log(err);
          });
  };

  handleChange = event => {
      this.setState(
          {
              selectedTrack: event.target.value
          },
          () => {
              this.fetchMeasurementsOfSelectedTrack();
          }
      );
  };

  render () {
      const recentTracks = { ...this.props };
      return (
          <div>
              <Grid container>
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
                      />
                  </Grid>
                  <Grid item lg={3} sm={3} md={3}>
                      <div style={{ margin: "20px" }}>
                          <div style={{ fontFamily: "Montserrat", fontSize: "1.4" }}>
                The most recent 20 tracks are available in the follwoing
                dropdown.
                          </div>
                          <FormControl variant="outlined" style={{ width: "100%" }}>
                              <Select
                                  onChange={this.handleChange}
                                  style={{ fontFamily: "Montserrat" }}
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  value={this.state.selectedTrack}
                              >
                                  {this.state.recentTracks.map((current, index) => {
                                      return (
                                          <MenuItem value={current.id} key={index}>
                                              {current.id}
                                          </MenuItem>
                                      );
                                  })}
                              </Select>
                          </FormControl>
                      </div>
                  </Grid>
              </Grid>
          </div>
      );
  }
}
