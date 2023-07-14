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
    const { text } = this.state;
    const data = [
      { name: "id stuff" },
      { name: "idiots"},
      { name: "idiots sticks"},
      { name: "importants stuff"},
      { name: "name plate" },
      { name: "some property"},
      { name: "san fransico"},
      { name: "property value"}
    ];

    const chars = [];
    const varsData = [];
    const triggers = {};

    data.map((tag) => {
      chars.push(tag.name[0].toLowerCase());
      const obj = {
          name: `${tag.name}`
      };
      varsData.push(obj);
  });

  const uniqueChars = [...new Set(chars)];

    for (const char of uniqueChars) {
        triggers[char] = {
            dataProvider: () => {
              const value = text !== '' && text.charAt(0) === char ? text : char;
                const filtered = varsData.filter((f) =>
                    f.name.toLowerCase().startsWith(`${value}`)
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
          textAreaComponent='input'
          minChar={0}
          value={text}
          // tabOrEnter={true}
          onChange={this._onChangeHandle}
          trigger={triggers}
          // trigger={{
          //   "{": {
          //     dataProvider: (d) => {
          //       const filtered = varsData.filter((f) =>
          //           f.name.toLowerCase().startsWith(d)
          //       );
          //       return filtered;
          //   },
          //     component: Item,
          //     output: (tag) => `{{${tag.name}}}`,
          //   }
          // }}
        />
      </div>
    );
  }
}

export default App;
