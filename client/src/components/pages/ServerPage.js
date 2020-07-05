import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Settings from '../../settings';

class ServerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numFiles: 0,
      done: false,
      uploadLoading: false
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
    const self = this;//for use insode of the fetch callback function
    this.setState({ uploadLoading: true });

    //the uploadIgnore part
    let uploadIgnore = document.getElementById('uploadignore').value;
    uploadData.append('uploadignore', uploadIgnore);

    //the static dir part
    let staticDir = document.getElementById('staticDir').value;
    uploadData.append('staticDir', staticDir);

    //add files
    for (let i = 0; i < this.filesRef.files.length; i++) {
      uploadData.append(this.filesRef.files[i].name, this.filesRef.files[i]);
    }

    fetch(Settings.host+'/server/'+this.props.server.SUBID+'/uploadApp', {
      method: 'POST',
      body: uploadData
    })
    .then(response => response.body)
    .then(body => {
      const reader = body.getReader();
      // console.log('got a readable stream');
      //read from stream
      reader.read().then(function processStream({ done, value }) {
        // console.log('done:', done);
        if (done) {
          self.setState({ uploadLoading: false });
          return;
          // return console.log('stream is done');
        }

        //decode stream and console log the result
        const messages = new TextDecoder("utf-8").decode(value);
        //console.log(messages[i]);
        const textarea = document.getElementById('loadingText');
        textarea.value += messages;
        textarea.scrollTop = textarea.scrollHeight;
        // console.log(messages);
        return reader.read().then(processStream);
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  filesChange(e) {
    this.setState({numFiles: e.target.files.length});
  }

  restartServer() {
    fetch(Settings.host+'/server/'+this.props.server.SUBID+'/restart', {
      method: 'POST'
    })
    .then(res => {
      this.setState({ done: true });
    })
    .catch(err => {
      console.log(err);
    });
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
            {this.state.uploadLoading ?
              <textarea id="loadingText" defaultValue={"Loading...\n"}></textarea>

              :

              <form onSubmit={(e) => {e.preventDefault();this.uploadApp()}}>
                <input onChange={(e)=>this.filesChange(e)} ref={(ref) => this.filesRef = ref} type="file" multiple webkitdirectory="true" directory="true" style={{display: 'none'}}/>
                <button className="button" onClick={(e) => {e.preventDefault();this.filesRef.click()}}>Upload Your project folder...</button>
                <p>Selected files: {this.state.numFiles}</p>

                <p style={{marginBottom: 0}}>Ignore these files/folders (similar to a .gitignore):</p>
                <textarea placeholder="" defaultValue={"node_modules\npackage-lock.json\n.git"} style={{display: 'block', margin: '10px 0'}} id="uploadignore"></textarea>

                <p>Static path: <input type="text" placeholder="N/A" defaultValue={"public/static"} id="staticDir" /></p>

                <button className="button" type="submit">Submit</button>
              </form>
            }
          </div>

          <h2>Interact with server</h2>
          <div>
            <div style={{marginBottom: '10px'}}><Link to={"/server/ssh/"+this.props.server.SUBID} className="button">Enter Terminal</Link></div>
            <div><button className="button" onClick={() => this.restartServer()}>Restart Server</button></div>
          </div>

          <h2>Be careful - there's no going back</h2>
          <button onClick={() => this.delete()} className="button red-back">Delete Server</button>
        </div>
      </React.Fragment>
    );
  }
}

export default ServerPage;
