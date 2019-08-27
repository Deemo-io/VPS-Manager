import React from 'react';

class Server extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: '#FFF'
    }
  }

  render() {
    //for the status div, green if good, yellow if booting up or restarting
    let statusColor = "#EF3";
    if (!this.props.custom && this.props.info.status === 'active' &&
        this.props.info.power_status === 'running' &&
        this.props.info.server_state === "ok") statusColor = "#3C3";

    return (
      <div className="server-box"
      style={{backgroundColor: this.state.backgroundColor, cursor: 'pointer'}}
      onMouseOver={() => this.setState({backgroundColor: 'rgba(0,0,0,0.2)'})}
      onMouseOut={() => this.setState({backgroundColor: '#FFF'})}>

        <h3 style={this.props.custom ? {fontWeight: 'normal'} : undefined}>
          {this.props.custom ? this.props.title : this.props.info.label}
        </h3>
        <p>ip: <i>{this.props.custom ? this.props.body : this.props.info.main_ip}</i></p>

        {this.props.custom ? null :
          <div style={{float: 'right', backgroundColor: statusColor, width: '25px', height: '25px'}}></div> }
      </div>
    );
  }
}

export default Server;
