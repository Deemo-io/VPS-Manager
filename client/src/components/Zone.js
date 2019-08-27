import React from 'react';

class Zone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: '#FFF'
    }
  }

  render() {
    //for the status div, green if good, yellow if pending
    let statusColor = "#3C3";
    if (!this.props.custom && this.props.info.status !== 'active') statusColor = "#EF3";

    return (
      <div className="zone-box"
      style={{backgroundColor: this.state.backgroundColor, cursor: 'pointer'}}
      onMouseOver={() => this.setState({backgroundColor: 'rgba(0,0,0,0.2)'})}
      onMouseOut={() => this.setState({backgroundColor: '#FFF'})}>

        <h3 style={this.props.custom ? {fontWeight: 'normal'} : undefined}>
          {this.props.custom ? this.props.title : this.props.info.name}
        </h3>
        <p><i>{this.props.custom ? this.props.body : this.props.info.id}</i></p>

        {this.props.custom ? null :
          <div style={{float: 'right', backgroundColor: statusColor, width: '25px', height: '25px'}}></div> }
      </div>
    );
  }
}

export default Zone;
