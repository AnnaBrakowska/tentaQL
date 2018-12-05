const React = require("react");
import { connect } from "react-redux";
import { Button, Icon, Input } from "semantic-ui-react";
import { Component } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { codeMirrorUpdate } from "../actions/textBoxActions";
import Clipboard from "react-clipboard.js";

import "codemirror/addon/hint/show-hint";
import "codemirror/addon/lint/lint";
import "codemirror-graphql/hint";
import "codemirror-graphql/lint";
import "codemirror-graphql/mode";

class TextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div id="textContainer">
              <Button onClick={this.props.connectionHandler} id="connectButton" animated='fade'>
              <Button.Content onClick={this.props.connectionHandler} visible>Connect</Button.Content>
              <Button.Content onClick={this.props.connectionHandler} hidden><Icon id="newURL" name="database" onClick={this.props.connectionHandler} /></Button.Content>
            </Button>
            <Input
              onChange={this.props.searchBarHandler}
              value={this.props.url}
              id="navbar"
              placeholder="To setup additional databases, please enter the URL ..."
            />
              <Button.Group className="buttonColl">
              
              <Button
                  onClick={this.props.switchTab}
                  className={`wrapperButton ${this.props.hiddenButtons}`}
                  id="schemaTabButton"
                >
                View Schema
                </Button>
                <Button.Or text="or" className={`wrapperButton ${this.props.hiddenButtons}`}/>
              <Button
                  onClick={this.props.switchTab}
                  className={`wrapperButton ${this.props.hiddenButtons}`}
                  id="resolversTabButton"
                >
                View Resolvers
                </Button>
                <Button
                  onClick={this.props.downloadZip}
                  className="wrapperButton"
                  animated="fade"
                  onMouseDown={e => e.preventDefault()}
                >
                  <Button.Content id="Original" visible>
                    Download Original Zip
                  </Button.Content>
                  <Button.Content id="Original" hidden>
                    <Icon id="Original" name="download" />
                  </Button.Content>
                </Button>
                <Button.Or text="or" />
                <Button id="Updates" className="wrapperButton" animated="fade">
                  <Button.Content visible>
                    Download Edited Zip
                  </Button.Content>
                  <Button.Content
                    onClick={this.props.downloadZip}
                    id="Updates"
                    hidden
                  >
                    &nbsp;Are you sure?
                  </Button.Content>
                </Button>
                <Button id="Reset" onClick={this.props.resetTab} className={`wrapperButton ${this.props.hiddenButtons}`} onMouseDown={e => e.preventDefault()} animated="fade">
                  <Button.Content id="Reset" visible>
                    Reset Tab
                  </Button.Content>
                  <Button.Content id="TabReset" hidden>
                    <Icon id="TabReset" name="redo" />
                  </Button.Content>
                </Button>
                <Button.Or text="or" />
                <Button onClick={this.props.resetAll} id="ResetAll" className="wrapperButton" onMouseDown={e => e.preventDefault()} animated="fade">
                  <Button.Content id="Original" visible>
                    Reset All
                  </Button.Content>
                  <Button.Content id="Original" hidden>
                    <Icon id="AllReset" name="history" />
                  </Button.Content>
                </Button>
              </Button.Group>
            
              <Clipboard
          className="clipboard"
          component="a"
          button-href="#"
          data-clipboard-text={String(this.props.currentTabText).replace(/λ/g, "\n")}
        >
          <Button animated>
            <Button.Content visible>Copy Tab</Button.Content>
            <Button.Content hidden>
              <Icon name="copy outline" />
            </Button.Content>
          </Button>
        </Clipboard>
              <CodeMirror
                  className="codeeditor"
                  value={this.props.currentTabText}
                  options={{
                    // mode: 'javascript',
                    lineSeparator: `λ`,
                    lineWrapping: false,
                    lineNumbers: true,
                    readOnly: false,
                    autoCursor: true,
                    autoScroll: true,
                  }}
                  cursor={this.state.currentPosition}
                  onChange={(editor, metadata, value) => {
                    let regex = /\S/g;
                    let found = metadata.text[0].match(regex);
                    let metaCopy = metadata['to'];
                    if (metadata.origin === "+delete") {
                      metaCopy['ch'] -= metadata.removed[0].length;
                    } else if (metadata.origin === "+input" && found === null) {
                      if (metaCopy.text[0] === " ") {
                        metaCopy['ch'] += 1;
                      } else {
                        metaCopy['line'] += 1;
                      }
                    } else {
                      metaCopy['ch'] += 1;
                    }

                    this.setState({currentPosition: metaCopy});
                    this.props.dispatch(
                      codeMirrorUpdate(value)
                    );
                  }}
                />

            <div className="wrapper">
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentTabText: state.currentTabText,
    url: state.search_url,
    hiddenButtons: state.hiddenButtons
  };
};

export default connect(mapStateToProps)(TextBox);
