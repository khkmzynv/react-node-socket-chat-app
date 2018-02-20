import React from "react";
import io from "socket.io-client";
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  Grid,
  Paper,
  Snackbar,
  Toolbar,
  TextField,
  Typography,
} from 'material-ui';

import style from '../style/index.module.scss'

export default class ChatRoom extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      snack: null,
      message: '',
      messages: [],
      users: [ props.username ],
    };
    // eslint-disable-next-line no-restricted-globals
    this.socket = io(`${location.hostname}:5000`, { query: `username=${props.username}` });

  }

  componentDidMount() {
    this.socket.on('GET_ACTIVE_USERS', data => {
      this.setState({ users: data });

      this.socket.on('USER_CONNECTED', data => {
        this.setState({ snack: `${data} connected`, users: [ ...this.state.users, data ] });
      });

      this.socket.on('USER_DISCONNECTED', data => {
        this.setState({ snack: `${data} disconnected`, users: this.state.users.filter(user => user !== data) });
      });

    });

    this.socket.on('RECEIVE_MESSAGE', data => {
        this.addMessage(data);
    });

  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  getAvatar = (name) => (
    <Avatar title={name} className={style.avatar}>
      {(name.slice(0, 1) + name.slice(-1)).toUpperCase()}
    </Avatar>
  )

  sendMessage = event => {
    event.preventDefault();
    if (this.state.message) {
      this.socket.emit('SEND_MESSAGE', {
        author: this.props.username,
        content: this.state.message
      });
      this.setState({message: ''});
    }
  }

  addMessage = data => this.setState({messages: [...this.state.messages, data]});

  handleType = event => this.setState({ message: event.target.value})

  handleSnackClose = event => this.setState({ snack: null })

  render(){
    return (
      <div className={style.chatroom}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" style={{ flexGrow: 1 }}>
              Real-Time Chat
            </Typography>
            <Button color="contrast" onClick={this.props.logOut}>logout</Button>
          </Toolbar>
        </AppBar>
        <div className={style.main}>
        <Grid item xs={12} sm={8}>
          <Paper>
          {
            this.state.users.map((user, index) => {
              const isCurrentUser = user === this.props.username;
              return (
                <Chip
                  label={user}
                  avatar={this.getAvatar(user)}
                  classes={{
                    root: `${style.message} ${isCurrentUser ? style.myMessage : ''}`,
                  }}
                  key={index}
                />
            );
            })
          }
          </Paper>
          <Paper className={style.messages}>
            {
              this.state.messages.map((message, index) =>{
                const { author, content } = message;
                const isCurrentUser = author === this.props.username;

                return (
                  <Chip
                    label={<div><b>{author}:</b> {content}</div>}
                    avatar={this.getAvatar(author)}
                    classes={{
                      root: `${style.message} ${isCurrentUser ? style.myMessage : ''}`,
                      label: style.label
                    }}
                    key={index}
                  />
                );
              })
            }
          </Paper>
          <div className={style.footer}>
            <TextField
              label="Message"
              value={this.state.message}
              className={style.textField}
              onChange={this.handleType}
            />
            <Button raised color="primary" onClick={this.sendMessage}>
              Send
            </Button>
          </div>
        </Grid>
      </div>
      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={!!this.state.snack}
          onClose={this.handleSnackClose}
          message={this.state.snack}
        />
    </div>
    );
  }
}
