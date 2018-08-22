import React, { Component } from "react";
import { Router, Route } from "react-router";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import browserHistory from "./browserHistory";
import HomeScreen from "./Login";
import AppScreen from "./main/App";

class App extends Component {
  render() {
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: "#f06292",
          light: "#ff5c8d",
          dark: "#a00037"
        },
        secondary: {
          main: "#f06292",
          light: "#ff94c2",
          dark: "#ba2d65"
        }
      }
    });
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <div>
            <Route exact path="/" component={HomeScreen} />
            <Route exact path="/app" component={AppScreen} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
