import React from 'react';
import Server from './Server';
import Zone from './Zone';
import { Link } from 'react-router-dom';

class HomeScreen extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     servers: [],
  //     zones: []
  //   }
  // }

  componentDidMount() {
    this.props.refresh();
  }

  render() {
    // this.props.refresh();

    return (
      <React.Fragment>

        <h1>VPS Manager</h1>

        <div id="servers">
          <h2>Servers</h2>
          {this.props.servers.map(server => (
            <Link key={server.SUBID} className="no-decoration" to={"/server/"+server.SUBID}>
              <Server info={server} />
            </Link>
          ))}

          <div>
            <Link className="no-decoration" to="/addServer">
              <Server custom title="Add a server" body="Choose server options" />
            </Link>
          </div>
        </div>

        <div id="zones">
        <h2>Zones</h2>
        {this.props.zones.map(zone => (
          <Link key={zone.id} className="no-decoration" to={"/zone/"+zone.id}>
            <Zone info={zone} />
          </Link>
        ))}
        <div>
          <Link className="no-decoration" to="/addZone">
            <Zone custom title="Add a zone" body="Configure zone" />
          </Link>
        </div>
        </div>

      </React.Fragment>
    );
  }
}

export default HomeScreen;
