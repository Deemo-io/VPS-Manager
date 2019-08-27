import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import AddZone from './components/AddZone';
import ZonePage from './components/ZonePage';
import ServerPage from './components/ServerPage';
import AddServer from './components/AddServer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      servers: [],
      zones: []
    }
  }

  //update cloudflare zones
  getZones() {
    fetch('http://localhost:3000/zones')
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
    fetch('http://localhost:3000/servers')
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
  }

  render() {

    return (
      <BrowserRouter>
        <Route path="/" exact render={(props) => <HomeScreen {...props}
          refresh={this.componentDidMount.bind(this)}
          servers={this.state.servers}
          zones={this.state.zones} />} />

        <Route path="/zone/:zoneid" render={props => <ZonePage {...props}
          zone={this.state.zones.find(zone => zone.id === props.match.params.zoneid)} />} />

        <Route path="/addZone" component={AddZone} />

        <Route path="/server/:serverid" render={props => <ServerPage {...props}
          server={this.state.servers.find(server => server.SUBID === props.match.params.serverid)} />} />

        <Route path="/addServer" component={AddServer} />
      </BrowserRouter>
    );
  }
}

export default App;
