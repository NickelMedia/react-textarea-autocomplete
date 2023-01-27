import React from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import emoji from "@jukben/emoji-search";

// import '@webscopeio/react-textarea-autocomplete/style.css'
import "../style.css";

type ItemProps = {
  entity: {
    char: string,
    name: string
  }
};

const Item = ({ entity: { name } }: ItemProps) => (
  <div>{`${name}`}</div>
);

type LoadingProps = {
  data: Array<{ name: string, char: string }>
};

const Loading = ({ data }: LoadingProps) => <div>Loading</div>;

class App extends React.Component {
  state = {
    optionsCaretStart: false,
    caretPosition: 0,
    movePopupAsYouType: false,
    text: "",
    minChar: 0,
    optionsCaret: "start",
    actualTokenInProvider: "",
    showSecondTextarea: false,
    renderToBody: false
  };

  _handleOptionsCaretEnd = () => {
    this.setState(() => ({
      optionsCaret: "end"
    }));
  };

  _handleOptionsCaretNext = () => {
    this.setState(() => ({
      optionsCaret: "next"
    }));
  };

  _handleOptionsCaretStart = () => {
    this.setState(() => ({
      optionsCaret: "start"
    }));
  };

  _handleShowSecondTextarea = () => {
    this.setState(({ showSecondTextarea }) => ({
      showSecondTextarea: !showSecondTextarea
    }));
  };

  _handleMovePopupAsYouType = () => {
    this.setState(({ movePopupAsYouType }) => ({
      movePopupAsYouType: !movePopupAsYouType
    }));
  };

  _handleRenderToBody = () => {
    this.setState(({ renderToBody }) => ({
      renderToBody: !renderToBody
    }));
  };

  _onChangeHandle = ({ target: { value } }) => {
    this.setState({
      text: value
    });
  };

  _changeValueTo = () => {
    this.setState({
      text: ":troph"
    });
  };

  _onCaretPositionChangeHandle = (position: number) => {
    this.setState({
      caretPosition: position
    });
  };

  _handleMinChar = ({ target: { value } }) => {
    this.setState({
      minChar: +value
    });
  };

  _setCaretPosition = () => {
    this.rtaRef.setCaretPosition(1);
  };

  _getCaretPosition = () => {
    alert(this.rtaRef.getCaretPosition());
  };

  _outputCaretEnd = (item, trigger) => ({
    text: item.char,
    caretPosition: "end"
  });

  _outputCaretStart = item => ({ text: item.char, caretPosition: "start" });

  _outputCaretNext = item => ({ text: item.char, caretPosition: "next" });

  _getSelectionPosition = () => {
    alert(JSON.stringify(this.rtaRef.getSelectionPosition()));
  };

  _getSelectedText = () => {
    alert(this.rtaRef.getSelectedText());
  };

  /**
   * it's the same as _outputCaretNext
   */
  _outputCaretDefault = item => item.char;

  _focus = () => {
    this.textareaRef.focus();
  };

  render() {
    const {
      optionsCaret,
      caretPosition,
      movePopupAsYouType,
      actualTokenInProvider,
      showSecondTextarea,
      text,
      minChar,
      renderToBody
    } = this.state;
    const data = [
      { name: "ID" },
      { name: "name" },
      { name: "someProperty"}
    ];

    const chars = [];
    const varsData = [];
    const trigger = {};

    data.map((tag) => {
      chars.push(tag.name[0].toLowerCase());
      const obj = {
          name: `${tag.name}`
      };
      varsData.push(obj);
  });

  const uniqueChars = [...new Set(chars)];

    for (const char of uniqueChars) {
        trigger[':'] = {
            dataProvider: () => {
                const filtered = varsData.filter((f) =>
                    f.name.toLowerCase().startsWith(`${char}`)
                );
                return filtered;
            },
            component: Item,
            output: (tag) => `${tag.name}`
        };
            }
    return (
      <div>
        <ReactTextareaAutocomplete
          className="one"
          // onKeyDown={e => {
          //   console.log(`pressed "${e.key}"`);
          // }}
          // ref={ref => {
          //   this.rtaRef = ref;
          // }}
          // innerRef={ref => {
          //   this.textareaRef = ref;
          // }}
          loadingComponent={Loading}
          style={{
            padding: 5
          }}
          containerStyle={{
            marginTop: 20,
            width: 500,
            height: 100,
            margin: "20px auto"
          }}
          // movePopupAsYouType={movePopupAsYouType}
          // onCaretPositionChange={this._onCaretPositionChangeHandle}
          // onItemHighlighted={info => {
          //   // save highlighted item to window; use it later in E2E tests
          //   window.__lastHighlightedItem = info;
          // }}
          // onItemSelected={info => {
          //   // save selected item to window; use it later in E2E tests
          //   window.__lastSelectedItem = info;
          // }}
          minChar={minChar}
          value={text}
          onChange={this._onChangeHandle}
          // renderToBody={renderToBody}
          tabOrEnter={true}
          trigger={trigger}
        />
      </div>
    );
  }
}

export default App;
