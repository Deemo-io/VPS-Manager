import React from 'react';
import { Link, Redirect } from 'react-router-dom';

class ServerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numFiles: 0,
      done: false
    }

    this.filesRef = React.createRef();
  }

  //delete the server who's page we're on
  delete() {
    fetch('http://localhost:3000/server/destroy', {
      method: 'POST',
      body: JSON.stringify({
        SUBID: this.props.server.SUBID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      this.setState({done: true});
    })
    .catch(err => {
      console.log(err);
    });
  }

  uploadApp() {
    let files = new FormData();
    for (let i = 0; i < this.filesRef.files.length; i++) {
      files.append(this.filesRef.files[i].name, this.filesRef.files[i]);
    }

    fetch('http://localhost:3000/server/'+this.props.server.SUBID+'/uploadApp', {
      method: 'POST',
      body: files
    });
  }

  filesChange(e) {
    this.setState({numFiles: e.target.files.length});
  }

  render() {
    if (!this.props.server) return <h1>Loading...</h1>
    if (this.state.done) return <Redirect to="/" />

    return (
      <React.Fragment>
        <h1>View/Edit Server "{this.props.server.label}"</h1>

        <div className="content-box">
          <Link className="button" to='/'>Back</Link>

          <p>IP address: {this.props.server.main_ip}</p>
          <p>OS: {this.props.server.os}</p>
          <p>Status: {this.props.server.status}</p>
          <p>Default password: {this.props.server.default_password}</p>
          <p>ID: {this.props.server.SUBID}</p>
          <p>Server state: {this.props.server.server_state}</p>
          <p>Power status: {this.props.server.power_status}</p>

          <h2>Upload your project</h2>
          <div>
            <form onSubmit={(e) => {e.preventDefault();this.uploadApp()}}>
              <input onChange={(e)=>this.filesChange(e)} ref={(ref) => this.filesRef = ref} type="file" multiple webkitdirectory="true" directory="true" style={{display: 'none'}}/>
              <button className="button" onClick={(e) => {e.preventDefault();this.filesRef.click()}}>Upload package.json</button>

              <button style={{marginLeft: '10px'}} className="button" type="submit">Submit</button>
            </form>
            <p>Selected files: {this.state.numFiles}</p>
          </div>

          <h2>Be careful - there's no going back</h2>
          <button onClick={() => this.delete()} className="button red-back">Delete Server</button>
        </div>
      </React.Fragment>
    );
  }
}

export default ServerPage;
