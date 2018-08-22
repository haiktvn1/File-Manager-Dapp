import React, { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import { convertToMB } from "../common";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import config from "../config";

export default class MyAppBar extends Component {
  state = {
    anchorEl: null
  };

  render() {
    var styles = {
      flex: {
        flexGrow: 1
      },
      menuButton: {
        marginLeft: -12,
        marginRight: 20
      },
      bar: {
        backgroundColor:'transparent'
      }
    };
    return (
      <AppBar position="static" style={styles.bar}>
        <Toolbar>
          <IconButton
            style={styles.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="title" style={styles.flex}>
            {config.uportAppName}
          </Typography>
          <Typography variant="headline">
            {convertToMB(this.props.used_space) +
              "/" +
              convertToMB(this.props.total_size) +
              "MB"}
          </Typography>
          <div>
            <IconButton
              aria-owns="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={e => this.setState({ anchorEl: e.currentTarget })}
            >
              <Avatar alt="Remy Sharp" src={this.props.avatar} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={this.state.anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={this.state.anchorEl !== null}
              onClose={() => this.setState({ anchorEl: null })}
            >
              <MenuItem onClick={this.props.onClickLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

MyAppBar.propTypes = {
  used_space: PropTypes.number,
  total_space: PropTypes.number,
  avatar: PropTypes.string,
  onClickLogout: PropTypes.func
};

MyAppBar.defaultProps = {
  used_space: 0,
  total_space: 0,
  avatar:
    "https://www.esparkinfo.com/wp-content/uploads/2016/08/default-avatar.png",
  onClickLogout: () => {}
};
