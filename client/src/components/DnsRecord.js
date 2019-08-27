import React from 'react';

class DnsRecord extends React.Component {
  //deletes the dns record in cloudflare
  deleteRecord() {
    fetch('http://localhost:3000/zone/'+this.props.record.zone_id+"/removedns/"+this.props.record.id, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(res => {
      this.props.refresh();
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <div className="cell">{this.props.record.type}</div>
        <div className="cell">{this.props.record.name}</div>
        <div className="cell">{this.props.record.content}</div>
        <button onClick={this.deleteRecord.bind(this)} className="button">Delete</button>
      </div>
    );
  }
}

export default DnsRecord;
