const React = require("react");
const ReactDOM = require("react-dom");
import { Provider } from 'react-redux';
import store from './store';
import { Component } from "react";
import { ModalExampleDimmer } from "./components/Modal.js";
import { searchUpdate } from './actions/searchActions';
import { zipFiles } from './actions/zipActions';
import { resetTab } from './actions/textBoxActions';
import { resetAll } from './actions/textBoxActions';
import { currentSearch } from './actions/searchActions';
import { saveData } from './actions/searchActions';
import { switchTab } from './actions/textBoxActions';

import Navbar from "./components/Navbar";
import TextBox from "./components/TextBox";
require("./index.css");

require("../codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: true,
      placeholder: "Enter Your Database URL Here...",
    };
    this.connectionHandler = this.connectionHandler.bind(this);
    this.searchBarHandler = this.searchBarHandler.bind(this);
    this.downloadZip = this.downloadZip.bind(this);
    this.resetTab = this.resetTab.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.switchTab = this.switchTab.bind(this);
  }

  searchBarHandler(event) {
    event.preventDefault();
    store.dispatch(searchUpdate(event.target.value, event.target.id));
    this.setState({ url: event.target.value });
  }

  switchTab(event) {
    event.preventDefault();
    store.dispatch(switchTab(event.target.id));
    this.setState({currentPosition: {ch: 1, line: 1}});
  }

  downloadZip(event) {
    event.preventDefault();
    store.dispatch(zipFiles(event.target.id));
  }

  resetTab(event) {
    event.preventDefault();
    store.dispatch(resetTab());
  }

  resetAll(event) {
    event.preventDefault();
    store.dispatch(resetAll());
  }

  connectionHandler(event) {
    event.preventDefault();
    store.dispatch(currentSearch());
    let credentials = {
      url: this.state.url
    };
    if (this.state.url === '') {
      this.setState({placeholder: "Please input a valid database URL", })
    } else {
    fetch("http://localhost:8080/db", {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: "POST",
      body: JSON.stringify(credentials)
    })
      .then(res => {
        this.setState({persistedURL: this.state.url})
        fetch("http://localhost:8080/db/all")
          .then(res => {
            return res.json();
          })
          .then(res => {
            let replaced = res.frontEnd.replace(/\r\n/g, "λ");
            store.dispatch(saveData(res));
            this.setState({modal: false, url: ""});
          });
      })
      .catch(err => {
        console.log(err);
      });
    }
    
  }

  render() {
    return (
      <Provider store={store}>
      <div>
      <div id="background-wrap">
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x1"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x2"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x3"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x4"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x5"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x6"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x7"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x8"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x9"></img>
            <img src="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/graphql.svg" className="bubble x10"></img>
        </div>
        <ModalExampleDimmer
          data={this.state}
          connectionHandler={this.connectionHandler}
          searchBarHandler={this.searchBarHandler}
          placeholder={this.state.placeholder}
        />
        {/* <Navbar searchBarHandler={this.searchBarHandler} connectionHandler={this.connectionHandler}/> */}
        <TextBox
          className="textbox"
          downloadZip={this.downloadZip}
          resetTab={this.resetTab}
          switchTab={this.switchTab}
          resetAll={this.resetAll}
          searchBarHandler={this.searchBarHandler}
          connectionHandler={this.connectionHandler}
        />
        </div>
      
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
