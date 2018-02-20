import React, { Component } from 'react';
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";

import style from './style/index.module.scss'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: ''
    };
  }

  logIn = username => this.setState({ username });
  logOut = () => this.setState({ username: '' });

  render() {
    return (
      <div className={style.container}>
      {
        this.state.username
        ? <ChatRoom username={this.state.username} logOut={this.logOut} />
        : <Login logIn={this.logIn} />
      }
      </div>
    );
  }
}

export default App;
