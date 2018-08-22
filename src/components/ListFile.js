import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CloudDownload from "@material-ui/icons/CloudDownload";
import { ipfsHashToLink } from "../ipfs";

export default class ListFile extends Component {
  openLink(file) {
    window.open(ipfsHashToLink(file), "_blank");
  }

  render() {
    return (
      <List component="nav">
        {this.props.listFile.map(file => (
          <ListItem key={file} button>
            <ListItemIcon onClick={() => this.openLink(file)}>
              <CloudDownload />
            </ListItemIcon>
            <ListItemText primary={file} />
          </ListItem>
        ))}
      </List>
    );
  }
}

ListFile.propTypes = {
  listFile: PropTypes.array
};

ListFile.defaultProps = {
  listFile: []
};
