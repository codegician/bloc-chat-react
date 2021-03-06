import React, { Component } from 'react';
import { Button, Form, FormControl} from 'react-bootstrap';

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentMessage: ''
    };
  }

   formatTime(date) {
     var date = new Date(date);
     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     var year = date.getFullYear();
     var month = months[date.getMonth()];
     var day = date.getDate();
     var hours = date.getHours();
     var minutes = date.getMinutes();
     var ampm = hours >= 12 ? 'pm' : 'am';
     hours = hours % 12;
     hours = hours ? hours : 12; // the hour '0' should be '12'
     minutes = minutes < 10 ? '0'+ minutes : minutes;
     var strTime = month + '/' + day + '/' + year + ' @ ' + hours + ':' + minutes + ' ' + ampm;
     return strTime;
  }

  handleChange(e) {
    this.setState({ currentMessage: e.target.value })
  }

  keyPress(e) {
    if (e.keyCode === 13 ) {
      this.sendMessage(e);
    }
  }

  sendMessage(e) {
    e.preventDefault();
    this.props.messagesRef.push({
      content: this.state.currentMessage,
      username: this.props.username,
      roomId: this.props.activeRoomKey,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
    });
    this.setState({currentMessage: ''});
    this.setState({ show: false });
  }

  showNewMessageform() {
    if (this.props.activeRoom !== null) {
      return <Form inline id="new-message-form">
        <FormControl
          id="new-message-text"
          type="text"
          placeholder="type message"
          value={ this.state.currentMessage }
          onChange={ (e) => this.handleChange(e) }
          onKeyDown={ (e) => this.keyPress(e)}
        />
        <Button id="send-message" bsStyle="success" onClick={ (e) => this.sendMessage(e) }>Send</Button>
      </Form>
    }
  }

   render() {
     return (
       <section className="message-list">
        <h2 className="active-room">{this.props.activeRoom}</h2>
        <div className="message-container">
        {
          this.props.messages.filter( message => message.roomId == this.props.activeRoomKey).map( message =>
            <div className="message" key={message.key}>
              <p className="message-username">{message.username}</p>
              <p className="message-content">{message.content}</p>
              <p className="message-time">{this.formatTime(message.sentAt)}</p>
            </div>
        )}
        </div>
        <div className='footer'>
        <footer id="new-message-footer">
          {this.showNewMessageform()}
        </footer>
        </div>
       </section>
     )
   }

}

export default MessageList;
