(this["webpackJsonpvps-manager"]=this["webpackJsonpvps-manager"]||[]).push([[0],{47:function(e,t,n){e.exports=n(89)},52:function(e,t,n){},86:function(e,t){},89:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(44),s=n.n(o),l=(n(52),n(2)),c=n(3),i=n(5),u=n(4),h=n(7),m=n(1),d=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={backgroundColor:"#FFF"},a}return Object(c.a)(n,[{key:"render",value:function(){var e=this,t="#EF3";return this.props.custom||"active"!==this.props.info.status||"running"!==this.props.info.power_status||"ok"!==this.props.info.server_state||(t="#3C3"),r.a.createElement("div",{className:"server-box",style:{backgroundColor:this.state.backgroundColor,cursor:"pointer"},onMouseOver:function(){return e.setState({backgroundColor:"rgba(0,0,0,0.2)"})},onMouseOut:function(){return e.setState({backgroundColor:"#FFF"})}},r.a.createElement("h3",{style:this.props.custom?{fontWeight:"normal"}:void 0},this.props.custom?this.props.title:this.props.info.label),r.a.createElement("p",null,"ip: ",r.a.createElement("i",null,this.props.custom?this.props.body:this.props.info.main_ip)),this.props.custom?null:r.a.createElement("div",{style:{float:"right",backgroundColor:t,width:"25px",height:"25px"}}))}}]),n}(r.a.Component),p=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={backgroundColor:"#FFF"},a}return Object(c.a)(n,[{key:"render",value:function(){var e=this,t="#3C3";return this.props.custom||"active"===this.props.info.status||(t="#EF3"),r.a.createElement("div",{className:"zone-box",style:{backgroundColor:this.state.backgroundColor,cursor:"pointer"},onMouseOver:function(){return e.setState({backgroundColor:"rgba(0,0,0,0.2)"})},onMouseOut:function(){return e.setState({backgroundColor:"#FFF"})}},r.a.createElement("h3",{style:this.props.custom?{fontWeight:"normal"}:void 0},this.props.custom?this.props.title:this.props.info.name),r.a.createElement("p",null,r.a.createElement("i",null,this.props.custom?this.props.body:this.props.info.id)),this.props.custom?null:r.a.createElement("div",{style:{float:"right",backgroundColor:t,width:"25px",height:"25px"}}))}}]),n}(r.a.Component),f=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.props.refresh()}},{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"VPS Manager"),r.a.createElement("div",{id:"servers"},r.a.createElement("h2",null,"Servers"),this.props.servers.map((function(e){return r.a.createElement(h.b,{key:e.SUBID,className:"no-decoration",to:"/server/"+e.SUBID},r.a.createElement(d,{info:e}))})),r.a.createElement("div",null,r.a.createElement(h.b,{className:"no-decoration",to:"/addServer"},r.a.createElement(d,{custom:!0,title:"Add a server",body:"Choose server options"})))),r.a.createElement("div",{id:"zones"},r.a.createElement("h2",null,"Zones"),this.props.zones.map((function(e){return r.a.createElement(h.b,{key:e.id,className:"no-decoration",to:"/zone/"+e.id},r.a.createElement(p,{info:e}))})),r.a.createElement("div",null,r.a.createElement(h.b,{className:"no-decoration",to:"/addZone"},r.a.createElement(p,{custom:!0,title:"Add a zone",body:"Configure zone"})))))}}]),n}(r.a.Component),v="http://localhost:3000",g="ws://localhost:3000",b=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={domain:"",done:!1},a}return Object(c.a)(n,[{key:"addZone",value:function(){var e=this;fetch(v+"/createZone",{method:"POST",body:JSON.stringify({domain:this.state.domain}),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(t){console.log(t),e.setState({done:!0})})).catch((function(e){console.log(e)}))}},{key:"render",value:function(){var e=this;return this.state.done?r.a.createElement(m.a,{to:"/"}):r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"Add a Zone"),r.a.createElement("div",{className:"content-box"},r.a.createElement(h.b,{to:"/",className:"button"},"back"),r.a.createElement("form",{style:{marginTop:"10px"},onSubmit:function(t){t.preventDefault(),e.addZone()}},r.a.createElement("input",{placeholder:"Name",value:this.state.domain,onChange:function(t){return e.setState({domain:t.target.value})}}),r.a.createElement("button",{onClick:function(){},className:"button"},"Submit"))))}}]),n}(r.a.Component),E=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"deleteRecord",value:function(){var e=this;fetch("http://localhost:3000/zone/"+this.props.record.zone_id+"/removedns/"+this.props.record.id,{method:"POST"}).then((function(e){return e.json()})).then((function(t){e.props.refresh()})).catch((function(e){console.log(e)}))}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("div",{className:"cell"},this.props.record.type),r.a.createElement("div",{className:"cell"},this.props.record.name),r.a.createElement("div",{className:"cell"},this.props.record.content),r.a.createElement("button",{onClick:this.deleteRecord.bind(this),className:"button"},"Delete"))}}]),n}(r.a.Component),y=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={dns:[],done:!1,type:"",name:"",content:""},a}return Object(c.a)(n,[{key:"delete",value:function(){var e=this;fetch(v+"/zone/"+this.props.zone.id+"/deleteZone",{method:"POST"}).then((function(e){return e.json()})).then((function(t){e.setState({done:!0})})).catch((function(e){console.log(e)}))}},{key:"addDnsRecord",value:function(){var e=this;fetch(v+"/zone/"+this.props.match.params.zoneid+"/adddns",{method:"POST",body:JSON.stringify({type:this.state.type,name:this.state.name,content:this.state.content}),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(t){e.refreshDnsRecords()})).catch((function(e){console.log(e)})),this.setState({type:"",name:"",content:""})}},{key:"refreshDnsRecords",value:function(){var e=this;fetch(v+"/zone/"+this.props.match.params.zoneid+"/getDns").then((function(e){return e.json()})).then((function(t){e.setState({dns:t.result})})).catch((function(e){console.log(e)}))}},{key:"componentDidMount",value:function(){this.refreshDnsRecords()}},{key:"render",value:function(){var e=this;return this.state.done?r.a.createElement(m.a,{to:"/"}):this.props.zone?r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,'View/Edit Zone "',this.props.zone.name,'"'),r.a.createElement("div",{className:"content-box"},r.a.createElement(h.b,{to:"/",className:"button"},"back"),r.a.createElement("p",null,"Status: ",this.props.zone.status),r.a.createElement("p",{style:{lineHeight:.2}},"Name servers:"),this.props.zone.name_servers.map((function(e,t){return r.a.createElement("p",{key:e,style:{lineHeight:.2}},e)})),r.a.createElement("h2",null,"DNS Records"),this.state.dns.map((function(t){return r.a.createElement(E,{refresh:function(){return e.refreshDnsRecords()},key:t.id,record:t})})),r.a.createElement("h3",null,"Add Record"),r.a.createElement("form",{onSubmit:function(t){t.preventDefault(),e.addDnsRecord()}},r.a.createElement("input",{value:this.state.type,onChange:function(t){return e.setState({type:t.target.value})},placeholder:"Type"}),r.a.createElement("input",{value:this.state.name,onChange:function(t){return e.setState({name:t.target.value})},placeholder:"Name"}),r.a.createElement("input",{value:this.state.content,onChange:function(t){return e.setState({content:t.target.value})},placeholder:"Content"}),r.a.createElement("button",{type:"submit",className:"button"},"Submit")),r.a.createElement("h2",null,"Be careful - there's no going back"),r.a.createElement("button",{className:"button red-back",onClick:function(){return e.delete()}},"Delete Zone"))):r.a.createElement("h1",null,"Loading...")}}]),n}(r.a.Component),S=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={numFiles:0,done:!1,uploadLoading:!1},a.filesRef=r.a.createRef(),a}return Object(c.a)(n,[{key:"delete",value:function(){var e=this;fetch(v+"/server/destroy",{method:"POST",body:JSON.stringify({SUBID:this.props.server.SUBID}),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(t){e.setState({done:!0})})).catch((function(e){console.log(e)}))}},{key:"uploadApp",value:function(){var e=new FormData,t=this;this.setState({uploadLoading:!0});var n=document.getElementById("uploadignore").value;e.append("uploadignore",n);var a=document.getElementById("staticDir").value;e.append("staticDir",a);for(var r=0;r<this.filesRef.files.length;r++)e.append(this.filesRef.files[r].name,this.filesRef.files[r]);fetch(v+"/server/"+this.props.server.SUBID+"/uploadApp",{method:"POST",body:e}).then((function(e){return e.body})).then((function(e){var n=e.getReader();n.read().then((function e(a){var r=a.done,o=a.value;if(!r){var s=new TextDecoder("utf-8").decode(o),l=document.getElementById("loadingText");return l.value+=s,l.scrollTop=l.scrollHeight,n.read().then(e)}t.setState({uploadLoading:!1})}))})).catch((function(e){console.log(e)}))}},{key:"filesChange",value:function(e){this.setState({numFiles:e.target.files.length})}},{key:"restartServer",value:function(){var e=this;fetch(v+"/server/"+this.props.server.SUBID+"/restart",{method:"POST"}).then((function(t){e.setState({done:!0})})).catch((function(e){console.log(e)}))}},{key:"render",value:function(){var e=this;return this.props.server?this.state.done?r.a.createElement(m.a,{to:"/"}):r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,'View/Edit Server "',this.props.server.label,'"'),r.a.createElement("div",{className:"content-box"},r.a.createElement(h.b,{className:"button",to:"/"},"Back"),r.a.createElement("h2",null,"Server Info"),r.a.createElement("p",null,"IP address: ",this.props.server.main_ip),r.a.createElement("p",null,"OS: ",this.props.server.os),r.a.createElement("p",null,"Status: ",this.props.server.status),r.a.createElement("p",null,"Default password: ",this.props.server.default_password),r.a.createElement("p",null,"ID: ",this.props.server.SUBID),r.a.createElement("p",null,"Server state: ",this.props.server.server_state),r.a.createElement("p",null,"Power status: ",this.props.server.power_status),r.a.createElement("h2",null,"Upload your project"),r.a.createElement("div",null,this.state.uploadLoading?r.a.createElement("textarea",{id:"loadingText",defaultValue:"Loading...\n"}):r.a.createElement("form",{onSubmit:function(t){t.preventDefault(),e.uploadApp()}},r.a.createElement("input",{onChange:function(t){return e.filesChange(t)},ref:function(t){return e.filesRef=t},type:"file",multiple:!0,webkitdirectory:"true",directory:"true",style:{display:"none"}}),r.a.createElement("button",{className:"button",onClick:function(t){t.preventDefault(),e.filesRef.click()}},"Upload Your project folder..."),r.a.createElement("p",null,"Selected files: ",this.state.numFiles),r.a.createElement("p",{style:{marginBottom:0}},"Ignore these files/folders (similar to a .gitignore):"),r.a.createElement("textarea",{placeholder:"",defaultValue:"node_modules\npackage-lock.json\n.git",style:{display:"block",margin:"10px 0"},id:"uploadignore"}),r.a.createElement("p",null,"Static path: ",r.a.createElement("input",{type:"text",placeholder:"N/A",defaultValue:"public/static",id:"staticDir"})),r.a.createElement("button",{className:"button",type:"submit"},"Submit"))),r.a.createElement("h2",null,"Interact with server"),r.a.createElement("div",null,r.a.createElement("div",{style:{marginBottom:"10px"}},r.a.createElement(h.b,{to:"/server/ssh/"+this.props.server.SUBID,className:"button"},"Enter Terminal")),r.a.createElement("div",null,r.a.createElement("button",{className:"button",onClick:function(){return e.restartServer()}},"Restart Server"))),r.a.createElement("h2",null,"Be careful - there's no going back"),r.a.createElement("button",{onClick:function(){return e.delete()},className:"button red-back"},"Delete Server"))):r.a.createElement("h1",null,"Loading...")}}]),n}(r.a.Component),k=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={plans:[],oses:[],regions:[],selectedPlan:-1,selectedOs:-1,selectedRegion:-1,label:"",done:!1},a}return Object(c.a)(n,[{key:"getPlanList",value:function(){var e=this;fetch(v+"/server/plans").then((function(e){return e.json()})).then((function(t){for(var n=Object.keys(t),a=[],r=0;r<n.length;r++)a.push(t[n[r]]);e.setState({plans:a,selectedPlan:a[0].VPSPLANID})})).catch((function(e){console.log(e)}))}},{key:"getOsList",value:function(){var e=this;fetch(v+"/server/oses").then((function(e){return e.json()})).then((function(t){for(var n=Object.keys(t),a=[],r=0;r<n.length;r++)a.push(t[n[r]]);e.setState({oses:a,selectedOs:a[0].OSID})})).catch((function(e){console.log(e)}))}},{key:"getRegionList",value:function(){var e=this;fetch(v+"/server/regions").then((function(e){return e.json()})).then((function(t){for(var n=Object.keys(t),a=[],r=0;r<n.length;r++)a.push(t[n[r]]);e.setState({regions:a,selectedRegion:a[0].DCID})})).catch((function(e){console.log(e)}))}},{key:"createServer",value:function(){var e=this;fetch(v+"/server/create",{method:"POST",body:JSON.stringify({VPSPLANID:this.state.selectedPlan,OSID:this.state.selectedOs,DCID:this.state.selectedRegion,label:this.state.label}),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(t){e.setState({done:!0})})).catch((function(e){console.log(e)}))}},{key:"componentDidMount",value:function(){this.getPlanList(),this.getOsList(),this.getRegionList()}},{key:"render",value:function(){var e=this;return 0===this.state.plans.length||0===this.state.oses.length||0===this.state.regions.length?r.a.createElement("h1",null,"Loading..."):this.state.done?r.a.createElement(m.a,{to:"/"}):r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"Add a Server"),r.a.createElement("div",{className:"content-box"},r.a.createElement(h.b,{className:"button",to:"/"},"Back"),r.a.createElement("form",{style:{marginTop:"10px"},onSubmit:function(t){t.preventDefault(),e.createServer()}},r.a.createElement("select",{value:this.state.selectedPlan,onChange:function(t){return e.setState({selectedPlan:t.target.value})}},this.state.plans.map((function(e){return r.a.createElement("option",{key:e.VPSPLANID,value:e.VPSPLANID},"$"+e.price_per_month)}))),r.a.createElement("select",{value:this.state.selectedOs,onChange:function(t){return e.setState({selectedOs:t.target.value})}},this.state.oses.map((function(e){return r.a.createElement("option",{key:e.OSID,value:e.OSID},e.name)}))),r.a.createElement("select",{value:this.state.selectedRegion,onChange:function(t){return e.setState({selectedRegion:t.target.value})}},this.state.regions.map((function(e){return r.a.createElement("option",{key:e.DCID,value:e.DCID},e.name)}))),r.a.createElement("input",{placeholder:"Server Label",value:this.state.label,onChange:function(t){return e.setState({label:t.target.value})}}),r.a.createElement("button",{className:"button",type:"submit"},"Submit"))))}}]),n}(r.a.Component),O=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"componentDidMount",value:function(){document.getElementById("command").focus()}},{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",null,"Terminal Page"),r.a.createElement("div",{className:"content-box"},r.a.createElement(h.b,{to:"/server/"+this.props.match.params.serverid,className:"button"},"Back"),r.a.createElement("textarea",{id:"output",style:{width:"100%",height:"500px",margin:"10px 0",padding:"0"}}),r.a.createElement("form",{onSubmit:this.props.sendCommand},r.a.createElement("input",{type:"text",id:"command",placeholder:"Command...",style:{width:"100%",margin:"0",padding:"0"}})),r.a.createElement("p",{style:this.props.loading?null:{display:"none"}},"Loading...")))}}]),n}(r.a.Component),j=n(46),C=n.n(j),D=function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={servers:[],zones:[],socket:null,sshLoading:!1},a}return Object(c.a)(n,[{key:"getZones",value:function(){var e=this;fetch(v+"/zones").then((function(e){return e.json()})).then((function(t){e.setState({zones:t.result})})).catch((function(e){console.log(e)}))}},{key:"getServers",value:function(){var e=this;fetch(v+"/servers").then((function(e){return e.json()})).then((function(t){for(var n=Object.keys(t),a=[],r=0;r<n.length;r++)a.push(t[n[r]]);e.setState({servers:a})})).catch((function(e){console.log(e)}))}},{key:"componentDidMount",value:function(){var e=this;this.getServers(),this.getZones();var t=C()(g);this.setState({socket:t}),t.on("sshResp",(function(t){var n=JSON.parse(t);if(n.message){if(n.error)return void(document.getElementById("output").value="ERROR: "+n.message);var a=document.getElementById("output");a.value+=n.message,a.scrollTop=a.scrollHeight}else n.finished&&(document.getElementById("output").value+="\n",e.setState({sshLoading:!1}))})),t.on("uploadResp",(function(e){var t=JSON.parse(e);t.message&&console.log(t.message)}))}},{key:"getServerFromUrl",value:function(e){var t=e.indexOf("/server/ssh/");if(-1===t)return null;var n=e.indexOf("#");return-1===n&&(n=e.indexOf("?")),-1===n&&(n=e.length),e.slice(t+12,n)}},{key:"sendSshCommand",value:function(e){e.preventDefault();var t=this.getServerFromUrl(window.location.href);this.state.socket&&t&&(this.setState({sshLoading:!0}),this.state.socket.emit("ssh",JSON.stringify({server:t,command:document.getElementById("command").value})))}},{key:"render",value:function(){var e=this;return r.a.createElement(h.a,null,r.a.createElement(m.d,null,r.a.createElement(m.b,{path:"/",exact:!0,render:function(t){return r.a.createElement(f,Object.assign({},t,{refresh:e.componentDidMount.bind(e),servers:e.state.servers,zones:e.state.zones}))}}),r.a.createElement(m.b,{path:"/zone/:zoneid",render:function(t){return r.a.createElement(y,Object.assign({},t,{zone:e.state.zones.find((function(e){return e.id===t.match.params.zoneid}))}))}}),r.a.createElement(m.b,{path:"/addZone",component:b}),r.a.createElement(m.b,{path:"/server/ssh/:serverid",render:function(t){return r.a.createElement(O,Object.assign({},t,{server:e.state.servers.find((function(e){return e.SUBID===t.match.params.serverid})),loading:e.state.sshLoading,sendCommand:e.sendSshCommand.bind(e)}))}}),r.a.createElement(m.b,{path:"/server/:serverid",render:function(t){return r.a.createElement(S,Object.assign({},t,{loading:e.state.uploadLoading,server:e.state.servers.find((function(e){return e.SUBID===t.match.params.serverid}))}))}}),r.a.createElement(m.b,{path:"/addServer",component:k})))}}]),n}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[47,1,2]]]);
//# sourceMappingURL=main.6dc271e4.chunk.js.map