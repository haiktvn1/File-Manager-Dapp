
import React from "react";

import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Snackbar from "@material-ui/core/Snackbar";

import Loading from "../components/Loading";
import DialogBuy from "../components/DialogBuy";
import ListFile from "../components/ListFile";
import MyAppBar from "../components/MyAppBar";

import { getUserProfile, storeUserProfile } from "../user";
import browserHistory from "../browserHistory";
import * as mnid from "mnid";
import FileManagerContract from "../file_namager_contract";
import waitForMined from "../waitForMined";
import ipfs from "../ipfs";
import { web3 } from "../uport";
import { watermarkImage } from "../watermark"
var Jimp = require("jimp");
var watermark = require("watermarkjs");
var ListpHash = [];
class App extends React.Component {
  state = {
    open_dialog_buy: false,
    is_loading: false,
    user_profile: null,
    used_space: 0,
    total_size: 0,
    listFile: [],
    errorMessage: ""
  };

  constructor(props) {
    super(props);

    this.uploadFile = this.uploadFile.bind(this);
    this.buyData = this.buyData.bind(this);
    this.loadSpaceFromSmartContract = this.loadSpaceFromSmartContract.bind(
      this
    );
  }

  componentWillMount() {
    let user_profile = getUserProfile();
    if (!user_profile) {
      browserHistory.replace("/");
    } else {
        if(user_profile.avatar == null)
            {
                user_profile.avatar = "https://www.esparkinfo.com/wp-content/uploads/2016/08/default-avatar.png";
            }
      this.setState({ user_profile }, () => {
        this.loadSpaceFromSmartContract();
        this.loadFiles();
      });
    }
  }

  loadSpaceFromSmartContract() {
    if (!this.state.user_profile.address) {
      return this.logout();
    }
     let address = mnid.decode(this.state.user_profile.address).address;
     console.log("loadSpaceFromSmartContract", address);
    FileManagerContract.getTotalSize(address, (error, total_size) => {
        console.log("total_size", total_size);
        
      if (error) {
        return this.setState({ errorMessage: error.toString() });
      }
      this.setState({ total_size });
    });

    FileManagerContract.getSpaceUsed(address, (error, used_space) => {
        console.log("used_space", used_space);
      if (error) {
        return this.setState({ errorMessage: error.toString() });
      }
      this.setState({ used_space });
    });
  }

  loadFiles() {
    let address = mnid.decode(this.state.user_profile.address).address;
    FileManagerContract.getFile(address, (error, listFile) => {
      if (error) {
        return this.setState({ errorMessage: error.toString() });
      }
      console.log(listFile);
      if (listFile !== "") {
        this.setState({ listFile: listFile.match(/.{1,46}/g) });
      }
    });
  }

  logout() {
    storeUserProfile();
    browserHistory.replace("/");
  }

  uploadFile(e) {
    let files = e.target.files;
    if (files.length <= 0) {
      return;
    }
    let file = files[0];

//---------------------------------------------------------watermark----------------------------------------------
    var linkhash = watermarkImage(file, 'https://ipfs.io/ipfs/Qmck5a3WNVvKkg7fdhthN1gjTApmDsCFmxusv2N61hbVYx')
//---------------------------------------
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result);
      this.setState({ is_loading: true });
//---------------------------------------------------------check pHash-------------------------------------------------
    var self = this;

    Jimp.read(buffer).then(image1 => {
        var check = true;
        for(var i = 0; i < ListpHash.length; i++){
            console.log("this is phash of index: " + i);
            var distance = Jimp.distance(image1, ListpHash[i]);
            var diff = Jimp.diff(image1, ListpHash[i]);
            console.log("distance: " + distance);
            console.log("pixel difference: " + diff.percent);
            if (distance < 0.15 || diff.percent < 0.08) {
                console.log("match");
                self.setState({ is_loading: false });
                check = false;
                return self.setState({ errorMessage: "Copyrighted! " });
            }else {
                console.log("not match");
            } 
        }
//-----------------------------------------------------end check pHash-------------------------------------------------
    if (check){
        ListpHash.push(image1);
//-----------------------------------------------------IPFS--------------------------------------------------------- 
        ipfs.add(buffer, (err, ipfsHash) => {
            if (err) {
            self.setState({ is_loading: false });
                return self.setState({ errorMessage: err.toString() });
            }
            self.setState({ is_loading: false });
            // check file exist
            if (self.state.listFile.includes(ipfsHash[0].hash)) {
              return self.setState({ errorMessage: "File was exist in your purchase history! " });
            }
            FileManagerContract.uploadFile(
                file.size,
                ipfsHash[0].hash,
                file.name,
                (err, txHash) => {
                    console.log(err, txHash);
                    if (err) {
                        return;
                    }
                self.setState({ is_loading: true });
                waitForMined(txHash)
                .then(txResponse => {
                    let listFile = self.state.listFile;
                    listFile.push(ipfsHash[0].hash);
                    self.setState({
                        is_loading: false,
                        listFile
                    });
                    self.loadSpaceFromSmartContract();
                    console.log(txResponse);
                    })
                .catch(err => self.setState({ is_loading: false }));
                });
                // ListpHash.push(image1);
                console.log("Upload completed..................."); 
        });
//-----------------------------------------------end IPFS--------------------------------------------------------------

    }
    }).catch(err => console.error(err))
    }
}

  buyData(eth) {
    let value = web3.toWei(eth, "ether");
    FileManagerContract.buyData(
      {
        value: value
      },
      (error, txHash) => {
        console.log(error, txHash);
        if (error) {
          return;
        }

        this.setState({ is_loading: true });

        waitForMined(txHash)
          .then(txResponse => {
            this.setState({ is_loading: false });
            this.loadSpaceFromSmartContract();
            console.log(txResponse);
          })
          .catch(err => this.setState({ is_loading: false }));
      }
    );
  }

  render() {
    var styles = {
      flex: {
        flexGrow: 1
      },
      uploadButton: {
        margin: 10,
        verticalAlign: "middle"
      },
      uploadInput: {
        cursor: "pointer",
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: "100%",
        opacity: 0
      },
      rightIcon: {
        marginLeft: 10
      },
      backGround: {
        minHeight: "100vh",
        backgroundColor: "#339966",
        backgroundImage: "url(https://ipfs.io/ipfs/QmVkLPd69iXFXMZ3fKA5Zz7W1nJByZW3S8Kiup3UBuBaGT)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      },
    };

    return (
      <div style = {styles.backGround}>
        <Loading show={this.state.is_loading} />
        <MyAppBar
          avatar={this.state.user_profile.avatar.uri}
          used_space={
            this.state.used_space ? this.state.used_space.toNumber() : 0
          }
          total_size={
            this.state.total_size ? this.state.total_size.toNumber() : 0
          }
          onClickLogout={this.logout}
        />
        <div>
          <Button
            variant="contained"
            color="default"
            style={styles.uploadButton}
          >
            Upload
            <CloudUploadIcon style={styles.rightIcon} />
            <input
              type="file"
              style={styles.uploadInput}
              onChange={this.uploadFile}
            />
          </Button>
          <Button
            variant="contained"
            color="default"
            style={styles.uploadButton}
            onClick={() => this.setState({ open_dialog_buy: true })}
          >
            Buy more storage
            <CloudUploadIcon style={styles.rightIcon} />
          </Button>
        </div>

        <ListFile listFile={this.state.listFile}  />

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.errorMessage !== ""}
          onClose={() => this.setState({ errorMessage: "" })}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.errorMessage}</span>}
        />

        <DialogBuy
          open={this.state.open_dialog_buy}
          handleClose={() => this.setState({ open_dialog_buy: false })}
          handleBuy={this.buyData}
        />

        <div id="container"> hahahahahaaaaa </div>

      </div>
    );
  }
}

export default App;
