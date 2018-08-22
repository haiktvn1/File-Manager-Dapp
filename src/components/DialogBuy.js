import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class DialogBuy extends Component {
  state = {
    eth: "0"
  };

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Buy storage</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deposit more ETH to have more space!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="ETH"
            type="number"
            value={this.state.eth}
            onChange={event => this.setState({ eth: event.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.props.handleClose();
              this.props.handleBuy(this.state.eth);
            }}
            color="primary"
          >
            Buy
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogBuy.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleBuy: PropTypes.func
};

DialogBuy.defaultProps = {
  open: false,
  handleClose: () => {},
  handleBuy: eth => {}
};
