import React from "react";
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import style from '../style/index.module.scss'

export default class Login extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      name: ''
    };
  }

  handleChange = event => this.setState({ name: event.target.value });
  logIn = () => this.state.name && this.props.logIn(this.state.name);

  render(){
    return (
      <div className={style.login}>
        <TextField
          label="Name"
          margin="normal"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <Button raised color="primary" onClick={this.logIn}>
          Start Chatting
        </Button>
      </div>
    );
  }
}
