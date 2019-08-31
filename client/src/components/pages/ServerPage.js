import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Settings from '../../settings';

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
    fetch(Settings.host+'/server/destroy', {
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
    let uploadData = new FormData();

    //the uploadIgnore part
    let uploadIgnore = document.getElementById('uploadignore').value;
    uploadData.append('uploadignore', uploadIgnore);

    //add files
    for (let i = 0; i < this.filesRef.files.length; i++) {
      uploadData.append(this.filesRef.files[i].name, this.filesRef.files[i]);
    }

    fetch(Settings.host+'/server/'+this.props.server.SUBID+'/uploadApp', {
      method: 'POST',
      body: uploadData
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

          <h2>Server Info</h2>
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
              <button className="button" onClick={(e) => {e.preventDefault();this.filesRef.click()}}>Upload Your project folder...</button>
              <p>Selected files: {this.state.numFiles}</p>

              <p style={{marginBottom: 0}}>Ignore these files/folders (similar to a .gitignore):</p>
              <textarea placeholder="" defaultValue={"node_modules\npackage-lock.json"} style={{display: 'block', margin: '10px 0'}} id="uploadignore"></textarea>

              <button className="button" type="submit">Submit</button>
            </form>
          </div>

          <h2>Interact with server</h2>
          <div>
            <Link to={"/server/ssh/"+this.props.server.SUBID} className="button">Enter Terminal</Link>
          </div>

          <h2>Be careful - there's no going back</h2>
          <button onClick={() => this.delete()} className="button red-back">Delete Server</button>
        </div>
      </React.Fragment>
    );
  }
}

export default ServerPage;
