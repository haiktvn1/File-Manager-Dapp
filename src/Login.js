import React from "react";
import Button from "@material-ui/core/Button";
import { uport } from "./uport";
import browserHistory from "./browserHistory";
import { storeUserProfile } from "./user";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.connectUport = this.connectUport.bind(this);
  }

  connectUport() {
    uport
      .requestCredentials({
        requested: ["name", "phone", "country", "avatar"],
        notifications: true
      })
      .then(credentials => {
        storeUserProfile(credentials);
        browserHistory.push("/app");
        console.log(credentials);
      });
  }

  render() {
    var styles = {
      background: {
        minHeight: "100vh",
        backgroundColor: "#339966",
        backgroundImage: "url(https://ipfs.io/ipfs/QmPXdDYiAMxYYrmSNorqCYkUR4nXnQJn3f2qxmxCrWXC1k)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      },
      content: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center"
      },
      title: {
        color: "#fffd",
        fontSize: 35,
        fontWeight: 200,
        lineHeight: 1.5,
        textAlign: "center"
      },
      subtitle: {
        color: "#fff9",
        fontSize: 18,
        fontWeight: 200,
        lineHeight: 1.5,
        textAlign: "center"
      },
      loginButton: {
        color: "#fffc",
        backgroundColor: "#003300",
        marginTop: 5
      },
      owner: {
        color: "#fff6",
        fontSize: "10",
        lineHeight: "1.5",
        fontWeight: "200",
        textAlign: "down",
        position: "absolute",
        bottom: 20,
        left: 20,
      }
    };
    return (
      <div style={styles.background}>
        <div style={styles.owner}>
          <div>15520186 - Nguyễn Hoàng Hải</div>
          <div>15520281 - Bùi Bảo Hưng</div>
        </div>
        <div style={styles.content}>
          <div style={styles.title}> File Manager Dapp</div>
          <div style={styles.subtitle}>Uport, IPFS, Oraclize</div>
          <Button onClick={this.connectUport} style={styles.loginButton}>
            LOGIN
          </Button>
        </div>
      </div>
    );
  }
}

export default Login;
