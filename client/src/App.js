import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomeScreen from './components/pages/HomeScreen';
import AddZone from './components/pages/AddZone';
import ZonePage from './components/pages/ZonePage';
import ServerPage from './components/pages/ServerPage';
import AddServer from './components/pages/AddServer';
import SshPage from './components/pages/SshPage';
import Settings from './settings';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      servers: [],
      zones: [],
      socket: null,
      sshLoading: false
    }
  }

  //update cloudflare zones
  getZones() {
    fetch(Settings.host+'/zones')
    .then(res => res.json())
    .then(zones => {

      this.setState({zones: zones.result});
    })
    .catch(err => {
      console.log(err);
    });
  }

  //updates the 'servers' state
  getServers() {
    fetch(Settings.host+'/servers')
    .then(res => res.json())
    .then(servers => {
      //convert from object to array
      const keys = Object.keys(servers);
      const serversArray = [];
      for (let i = 0; i < keys.length; i++) {
        serversArray.push(servers[keys[i]]);
      }
      //put servers array in state
      this.setState({servers: serversArray});
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    //get all servers in Vultr
    this.getServers();
    this.getZones();

    //establish a socket.io connection
    const socket = io(Settings.websocketHost);
    this.setState({ socket: socket });

    //listener for ssh responses
    socket.on('sshResp', (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.message) {
        if (parsedData.error) {
          document.getElementById('output').value = "ERROR: " + parsedData.message;
          return;
        }

        // document.getElementById('output').value += parsedData.message;
        const textarea = document.getElementById('output');
        textarea.value += parsedData.message;
        textarea.scrollTop = textarea.scrollHeight;
      }
      else if (parsedData.finished) {
        document.getElementById('output').value += "\n";
        // this.setState({ loading: false });
        this.setState({ sshLoading: false });
      }
    });
  }

  getServerFromUrl(url) {
  	let startIndex = url.indexOf('/server/ssh/');
  	if (startIndex === -1) return null;

  	let endIndex = url.indexOf('#');
  	if (endIndex === -1) endIndex = url.indexOf('?')
  	if (endIndex === -1) endIndex = url.length;

  	return url.slice(startIndex+12,endIndex);
  }

  sendSshCommand(e) {
    e.preventDefault();

    //get server id, error checking and the like
    const serverId = this.getServerFromUrl(window.location.href);
    if (!this.state.socket) return;
    if (!serverId) return;

    //set loading to true and send the command
    this.setState({ sshLoading: true });
    this.state.socket.emit('ssh', JSON.stringify({
      server: serverId,
      command: document.getElementById('command').value
    }));
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact render={(props) => <HomeScreen {...props}
            refresh={this.componentDidMount.bind(this)}
            servers={this.state.servers}
            zones={this.state.zones} />} />

          <Route path="/zone/:zoneid" render={props => <ZonePage {...props}
            zone={this.state.zones.find(zone => zone.id === props.match.params.zoneid)} />} />

          <Route path="/addZone" component={AddZone} />

          <Route path="/server/ssh/:serverid" render={props => <SshPage {...props}
            server={this.state.servers.find(server => server.SUBID === props.match.params.serverid)}
            socket={this.state.socket}
            loading={this.state.sshLoading}
            sendCommand={this.sendSshCommand.bind(this)}/>} />

          <Route path="/server/:serverid" render={props => <ServerPage {...props}
            server={this.state.servers.find(server => server.SUBID === props.match.params.serverid)} />} />

          <Route path="/addServer" component={AddServer} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
