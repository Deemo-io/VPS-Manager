import React from 'react';
import { Link } from 'react-router-dom';

class SshPage extends React.Component {
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

          <form onSubmit={this.props.sendCommand}>
            <input type="text" id="command" placeholder="Command..." style={{width: '100%', margin: '0', padding: '0'}} />
          </form>
          <p style={this.props.loading ? null : {display: 'none'}}>Loading...</p>
        </div>
      </React.Fragment>
    );
  }
}

export default SshPage;
