import React, { Component } from "react";
import axios from "axios";
import { SERVER_ENDPOINT } from "../constants";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { withRouter } from "../App";

class Chat extends Component {
  state = {
    roomName: "",
    userName: "",
  };

  /* 
   * If you don't use the fat arrow syntax the functions are not binded.
   * Otherwise you may use the function by binding it with the context like this:
   ?  `this.setRoomName.bind(this)`
  */

  setRoomName = (roomName) => {
    this.setState({ roomName: roomName });
  };

  setUserName = (userName) => {
    this.setState({ userName: userName });
  };

  joinRoom = async () => {
    const { userName, roomName } = this.state;

    const url = `${SERVER_ENDPOINT}/chat/join`;
    const res = await axios.post(url, { userName, roomName });

    console.log(res, this);
    if (res.data.statusCode === 200) {
     return this.props.navigate(
        `/chat/${this.state.roomName}/${this.state.userName}`
      );
    } else {
      toast.warning(res.data.message);
    }
  };

  validateFields = async () => {
    if (this.state.userName.length > 0 && this.state.roomName.length > 0) {
      return await this.joinRoom(); 
    }
    toast.error("Please enter the username to continue", {});
  };

  render() {
    console.log(this);
    return (
      <div className="container-fluid bg-dark h-100 py-5 d-flex">
        <div className="text-secondary my-auto mx-auto text-center ">
          <h1 className="display-5 fw-bold text-white">
            Join a Room to continue
          </h1>
          <div className="col-lg-12 mx-auto">
            <p className="text-monospace">
              If room with the given name doesn't exist, it will be created.
            </p>

            <div className="row g-3 p-3">
              <div className="col">
                <input
                  type="text"
                  value={this.state.userName}
                  onChange={(e) => this.setUserName(e.target.value)}
                  className="form-control"
                  placeholder="Username"
                  aria-label="Username"
                ></input>
              </div>
              <div className="col">
                <input
                  type="text"
                  value={this.state.roomName}
                  onChange={(e) => this.setRoomName(e.target.value)}
                  className="form-control"
                  placeholder="Room Name"
                  aria-label="Room Name"
                ></input>
              </div>
            </div>

            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <Link onClick={this.validateFields}>
                <button
                  type="button"
                  className="btn btn-outline-info btn-lg px-4 me-sm-3 fw-bold"
                >
                  Join Room
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Chat);
