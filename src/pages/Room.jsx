import React, { Component } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { SERVER_ENDPOINT } from "../constants";
import socketIOClient from "socket.io-client";
import { withRouter } from "../App";
import { toast } from "react-toastify";

const relativeTime = require("dayjs/plugin/relativeTime");

let socket;
class Room extends Component {
  state = {
    message: "",
    messages: [],
    userName: this.props.params.user,
    roomName: this.props.params.name,
  };

  getMessages = async () => {
    console.log("Getting Messages");
    var roomName = this.state.roomName;
    const url = `${SERVER_ENDPOINT}/chat/messages/${roomName}`;
    const res = await axios.get(url);

    if (res.data.statusCode !== 200) {
      return;
    }

    let messages = res.data.data.map((e) => {
      return e;
    });

    this.setState({
      messages: messages,
    });
  };

  componentWillUnmount() {
    console.log("Component Unmounted", this);
    socket.disconnect();
    socket.close();
  }

  componentDidMount() {
    console.log("Component Mounted", this);

    this.getMessages();

    socket = socketIOClient(SERVER_ENDPOINT);

    socket.on("reconnect", (data) => {
      console.log("Reconnecting user", data);
    });

    socket.on("reconnect-attempt", (attempt) => {
      console.log("Reconnection Attempt", attempt);
    });

    socket.on("connect", (data) => {
      console.log("Connection established", data);
      socket.emit("setData", {
        message: "Set Data Values",
        data: {
          userName: this.state.userName,
          roomName: this.state.roomName,
        },
      });
    });

    socket.on("error", (data) => {
      console.log("Error Data Received", data);
      var { errorLevel } = data;
      if (errorLevel === "Fatal") {
        this.props.navigate("/");
        toast.error("Please re-connect to the room");
      }
    });
    socket.on("event", (data) => {
      console.log("Event Received", data);
      if (data.action === "Refresh") {
        this.getMessages();
      } else if (data.action === "disconnect") {
        socket.close();
      }
    });
  }

  sendMessage = async (message) => {
    const url = `${SERVER_ENDPOINT}/chat/addMessage`;
    if (message.message === null || message.message.length === 0) {
      return toast.error("Message is empty");
    }

    const body = {
      message: message,
      roomName: this.state.roomName,
    };
    var res = await axios.post(url, body);
    if (res.statusCode === 404) {
      this.props.history.push("/");
    }
    const messages = res.data.data.map((e) => e);
    this.setState({ messages: messages, message: "" });
  };

  getMessageComponent = () => {
    var items = [];

    var inActiveClass = "list-group-item ";
    const len = this.state.messages.length;

    for (let i = 0; i < len; i++) {
      const message = this.state.messages[i];
      items.push(
        <li
          key={message.messageDate}
          className={
            // i === 0
            message.name === this.state.userName
              ? inActiveClass.concat("bg-info text-white")
              : inActiveClass
          }
        >
          <div className="d-flex flex-row mb-2  ">
            <div className="pe-1">{message.name}</div>
            <div className="">
              {this.getTimeComponent(
                message,
                message.name === this.state.userName
              )}
            </div>
          </div>

          <div className="fs-5 mb-1">{message.message}</div>
        </li>
      );
    }
    return items;
  };

  getTimeComponent = (message, latest) => {
    dayjs.extend(relativeTime);
    var res = `  ●  ${dayjs(message.messageDate).fromNow(true)} ago `;

    const className = latest ? "text-white" : "text-secondary";
    return <div className={className}>{res}</div>;
  };

  render() {
    return (
      <div>
        <div className="container bg-info bg-opacity-10 border border-info rounded text-dark fw-bold mx-auto my-4 p-4">
          <br />

          <h1 id="welcomeText" className="display-5 fw-semibold">
            Welcome to
            <span className="fw-bold text-info">
              {" " + this.state.roomName}
            </span>
          </h1>
          <p className="fw-normal text-secondary m-0">
            This is a collaborative room, write your message and send it to the
            other users in the room.
            <br />
            Note: Refreshing the page will make you exit the room immediately.
          </p>

          <br />
          <textarea
            id="message"
            className="form-control p-2"
            value={this.state.message}
            onChange={(e) => {
              this.setState({ message: e.target.value });
            }}
            placeholder="Your Message Here"
          ></textarea>
          <br />
          <button
            onClick={() =>
              this.sendMessage({
                name: this.state.userName,
                message: this.state.message,
              })
            }
            className="btn btn-info text-white me-2"
          >
            Send Message
          </button>
          <Link
            to="/"
            onClick={() => {
              this.sendMessage({
                name: this.state.userName,
                message: `${this.state.userName} left the room.`,
              });
            }}
          >
            <button className="btn btn-danger">Exit Room</button>
          </Link>
        </div>

        <ul id="messages" className="list-group container mx-auto">
          {this.getMessageComponent()}
        </ul>

        <div style={{ height: 50 }}></div>
      </div>
    );
  }
}

export default withRouter(Room);
