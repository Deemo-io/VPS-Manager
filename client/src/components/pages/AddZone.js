import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Settings from '../../settings';

class AddZone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      domain: '',
      done: false
    }
  }

  addZone() {
    fetch(Settings.host+'/createZone', {
      method: 'POST',
      body: JSON.stringify({
        domain: this.state.domain
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({done: true});
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    if (this.state.done) return <Redirect to="/" />

    return (
      <React.Fragment>
        <h1>Add a Zone</h1>
        <div className="content-box">
          <Link to="/" className="button">back</Link>
          <form style={{marginTop: '10px'}} onSubmit={(e) => {e.preventDefault(); this.addZone()}}>
            <input placeholder="Name" value={this.state.domain}
            onChange={(e) => this.setState({domain:e.target.value})} />

            <button onClick={() => {}} className="button">
              Submit
            </button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default AddZone;
