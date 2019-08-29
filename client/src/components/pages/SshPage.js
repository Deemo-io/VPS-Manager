import React from 'react';
import { Link } from 'react-router-dom';
import Settings from '../../settings';

class SshPage extends React.Component {
  sendCommand(e) {
    e.preventDefault();

    fetch(Settings.host+'/server/'+this.props.match.params.serverid+'/ssh', {
      method: 'POST',
      body: JSON.stringify({
        command: document.getElementById('command').value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      const textarea = document.getElementById('output');
      textarea.value += res.output;
      textarea.scrollTop = textarea.scrollHeight;
      document.getElementById('command').value = "";
    })
    .catch(err => {
      console.log(err);
    })
  }

  componentDidMount() {
    document.getElementById('command').focus();
  }

  render() {
    return (
      <React.Fragment>
        <h1>Terminal Page</h1>

        <div className="content-box">
          <Link to={"/server/"+this.props.match.params.serverid} className="button">Back</Link>

          <textarea id="output" style={{width: '100%', height: '500px', margin: '10px 0', padding: '0'}}></textarea>

          <form onSubmit={(e) => this.sendCommand(e)}>
            <input type="text" id="command" placeholder="Command..." style={{width: '100%', margin: '0', padding: '0'}} />
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default SshPage;
