import React from 'react';
import { Link, Redirect } from 'react-router-dom';

class AddServer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plans: [],
      oses: [],
      regions: [],
      selectedPlan: -1,
      selectedOs: -1,
      selectedRegion: -1,
      label: '',
      done: false
    }
  }

  getPlanList() {
    fetch('http://localhost:3000/server/plans')
    .then(res => res.json())
    .then(res => {
      //convert object to array
      let keys = Object.keys(res);
      let plans = [];
      for (let i = 0; i < keys.length; i++) {
        plans.push(res[keys[i]]);
      }
      this.setState({plans: plans, selectedPlan: plans[0].VPSPLANID});
    })
    .catch(err => {
      console.log(err);
    });
  }

  getOsList() {
    fetch('http://localhost:3000/server/oses')
    .then(res => res.json())
    .then(res => {
      let keys = Object.keys(res);
      let oses = [];
      for (let i = 0; i < keys.length; i++) {
        oses.push(res[keys[i]]);
      }
      this.setState({oses: oses, selectedOs: oses[0].OSID});
    })
    .catch(err => {
      console.log(err);
    });
  }

  getRegionList() {
    fetch('http://localhost:3000/server/regions')
    .then(res => res.json())
    .then(res => {
      let keys = Object.keys(res);
      let regions = [];
      for (let i = 0; i < keys.length; i++) {
        regions.push(res[keys[i]]);
      }
      this.setState({regions: regions, selectedRegion: regions[0].DCID});
    })
    .catch(err => {
      console.log(err);
    })
  }

  createServer() {
    fetch('http://localhost:3000/server/create', {
      method: 'POST',
      body: JSON.stringify({
        VPSPLANID: this.state.selectedPlan,
        OSID: this.state.selectedOs,
        DCID: this.state.selectedRegion,
        label: this.state.label
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

  componentDidMount() {
    this.getPlanList();
    this.getOsList();
    this.getRegionList();
  }

  render() {
    if (this.state.plans.length === 0 || this.state.oses.length === 0 || this.state.regions.length === 0) return <h1>Loading...</h1>
    if (this.state.done) return <Redirect to="/" />

    return (
      <React.Fragment>
        <h1>Add a Server</h1>

        <div className="content-box">
          <Link className="button" to="/">Back</Link>

          <form style={{marginTop: '10px'}} onSubmit={(e) => {e.preventDefault();this.createServer()}}>
            <select value={this.state.selectedPlan} onChange={(e)=>this.setState({selectedPlan: e.target.value})}>
              {this.state.plans.map(plan => <option key={plan.VPSPLANID} value={plan.VPSPLANID}>{"$"+plan.price_per_month}</option>)}
            </select>

            <select value={this.state.selectedOs} onChange={(e)=>this.setState({selectedOs: e.target.value})}>
              {this.state.oses.map(os => <option key={os.OSID} value={os.OSID}>{os.name}</option>)}
            </select>

            <select value={this.state.selectedRegion} onChange={(e)=>this.setState({selectedRegion: e.target.value})}>
              {this.state.regions.map(region => <option key={region.DCID} value={region.DCID}>{region.name}</option>)}
            </select>

            <input placeholder="Server Label" value={this.state.label} onChange={(e)=>this.setState({label: e.target.value})}/>

            <button className="button" type="submit">Submit</button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default AddServer;
