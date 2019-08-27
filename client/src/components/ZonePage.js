import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import DnsRecord from './DnsRecord';

class ZonePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dns: [],
      done: false,
      type: '',
      name: '',
      content: ''
    }
  }

  //this deletes the whole zone
  delete() {
    fetch('http://localhost:3000/zone/'+this.props.zone.id+'/deleteZone', {
      method: 'POST'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({ done: true });
    })
    .catch(err => {
      console.log(err);
    });
  }

  //this adds a dns record
  addDnsRecord() {
    fetch('http://localhost:3000/zone/'+this.props.match.params.zoneid+'/adddns', {
      method: 'POST',
      body: JSON.stringify({
        type: this.state.type,
        name: this.state.name,
        content: this.state.content
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      this.refreshDnsRecords();
    })
    .catch(err => {
      console.log(err);
    });

    this.setState({type: '', name: '', content: ''});
  }

  refreshDnsRecords() {
    fetch('http://localhost:3000/zone/'+this.props.match.params.zoneid+'/getDns')
    .then(res => res.json())
    .then(res => {
      this.setState({dns: res.result});
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.refreshDnsRecords();
  }

  render() {
    if (this.state.done) return <Redirect to="/" />
    if (!this.props.zone) return <h1>Loading...</h1>;

    return (
      <React.Fragment>
        <h1>View/Edit Zone "{this.props.zone.name}"</h1>
        <div className="content-box">
          <Link to="/" className="button">back</Link>
          <p>Status: {this.props.zone.status}</p>
          <p style={{lineHeight: 0.2}}>Name servers:</p>
          {this.props.zone.name_servers.map((url, i) => (
            <p key={url} style={{lineHeight: 0.2}}>{url}</p>
          ))}

          <h2>DNS Records</h2>
          {this.state.dns.map(record => <DnsRecord refresh={()=>this.refreshDnsRecords()} key={record.id} record={record} /> )}
          <h3>Add Record</h3>
          <form onSubmit={(e)=>{e.preventDefault();this.addDnsRecord()}}>
            <input value={this.state.type}
            onChange={(e)=>this.setState({type: e.target.value})} placeholder="Type" />
            <input value={this.state.name}
            onChange={(e)=>this.setState({name: e.target.value})} placeholder="Name" />
            <input value={this.state.content}
            onChange={(e)=>this.setState({content: e.target.value})} placeholder="Content" />
            <button type="submit" className="button">Submit</button>
          </form>

          <h2>Be careful - there's no going back</h2>
          <button className="button red-back" onClick={()=>this.delete()}>Delete Zone</button>
        </div>
      </React.Fragment>
    )
  }
}

export default ZonePage;
