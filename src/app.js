/* global window */
import React, { Component } from 'react';
import MapGL, { LinearInterpolator, FlyToInterpolator } from 'react-map-gl';
import { MapStylePicker } from './controls';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DeckGL from 'deck.gl';
import { PathLayer } from '@deck.gl/layers';
import DeckGLOverlay from './components/DeckGLOverLay';

// Easing function
import { easeCubic } from 'd3-ease';

export default class App extends Component {
  state = {
    style: 'mapbox://styles/mapbox/dark-v9',
    viewport: {
      width: '100%',
      height: window.innerHeight,
      longitude: 7.6261,
      latitude: 51.9607,
      zoom: 11,
      maxZoom: 16
    },
    recentTracks: [],
    selectedTrack: '',
    measurements: []
  };

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    this.fetchRecentTracks();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
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
      width: '100%',
      height: window.innerHeight
    });
  };

  fetchRecentTracks = () => {
    let dataArr = [];
    fetch(
      'https://envirocar.org/api/stable/tracks?bbox=7.0,51.1,7.3,52.0&limit=20',
      {
        method: 'GET',
        headers: {
          Authorization: 'Basic QXNlbFBlaXJpczpJc2lwYXRoYW5hOQ=='
        }
      }
    )
      .then(res => {
        return res.json();
      })
      .then(resData => {
        this.setState({ recentTracks: resData.tracks }, this.fetchMeasurements);
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchMeasurementsOfSelectedTrack = () => {
    fetch(
      'https://envirocar.org/auth-proxy/api/tracks/' +
        this.state.selectedTrack +
        '/measurements',
      {
        method: 'GET',
        headers: {
          Authorization: 'Basic QXNlbFBlaXJpczpJc2lwYXRoYW5hOQ=='
        }
      }
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        const paths = [];
        const timestamps = [];
        const layers = [];

        // Focus animation

        const focusLongitude = data.features[0].geometry.coordinates[0];
        const focusLatitude = data.features[0].geometry.coordinates[1];

        const viewport = {
          ...this.state.viewport,
          longitude: focusLongitude,
          latitude: focusLatitude,
          zoom: 11,
          pitch: 30,
          transitionDuration: 2500,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: easeCubic
        };

        // Setting up the data object required for TripsLayer

        data.features.forEach((item, index) => {
          paths.push(item.geometry.coordinates);
          timestamps.push(100 * index + 2500);
        });

        let layerData = [{ path: paths, name: 'Track', color: [255, 0, 0] }];

        this.setState({ viewport, layerData: layerData });
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchMeasurements = () => {
    let recentTracks = this.state.recentTracks;
    let measurements = [];

    recentTracks.forEach(element => {
      fetch(
        `https://envirocar.org/api/stable/tracks/${element.id}/measurements`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Basic QXNlbFBlaXJpczpJc2lwYXRoYW5hOQ=='
          }
        }
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          measurements.push(data);
        });
    });
    this.setState({ measurements: measurements });
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

  render() {
    const { viewport, layers } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item lg={9} sm={9} md={9}>
            <MapStylePicker
              onStyleChange={this.onStyleChange}
              currentStyle={this.state.style}
            />
            <MapGL
              {...viewport}
              mapStyle={this.state.style}
              onViewportChange={viewport => this._onViewportChange(viewport)}
              mapboxApiAccessToken={
                'pk.eyJ1IjoiYXVyYW9mZGl2aW5pdHkiLCJhIjoiY2s2bng4bGIzMTI4NTNscDZodGE4YzZvcyJ9.EUzx63KUHzjzzm1PJFfRPg'
              }
            >
              <DeckGLOverlay
                viewport={this.state.viewport}
                layerData={this.state.layerData}
                measurements={this.state.measurements}
              ></DeckGLOverlay>
            </MapGL>
          </Grid>
          <Grid item lg={3} sm={3} md={3}>
            <div style={{ margin: '20px' }}>
              <div style={{ fontFamily: 'Montserrat', fontSize: '1.4' }}>
                The most recent 20 tracks are available in the follwoing
                dropdown.
              </div>
              <FormControl variant='outlined' style={{ width: '100%' }}>
                <Select
                  onChange={this.handleChange}
                  style={{ fontFamily: 'Montserrat' }}
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
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
