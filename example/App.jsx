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

    return (
      <div>
        <div>
          <input
            data-test="caretStart"
            name="caret"
            value="start"
            type="radio"
            checked={this.state.optionsCaret === "start"}
            onChange={this._handleOptionsCaretStart}
          />
          <label htmlFor="caretStart">Place caret before word</label>

          <input
            data-test="caretEnd"
            name="caret"
            value="end"
            type="radio"
            checked={this.state.optionsCaret === "end"}
            onChange={this._handleOptionsCaretEnd}
          />
          <label htmlFor="caretEnd">Place caret after word</label>

          <input
            data-test="caretNext"
            name="caret"
            value="next"
            type="radio"
            checked={this.state.optionsCaret === "next"}
            onChange={this._handleOptionsCaretNext}
          />
          <label htmlFor="caretNext">Place caret after word with a space</label>
        </div>
        <div>
          <label>
            <input
              data-test="showSecondTextarea"
              type="checkbox"
              defaultChecked={showSecondTextarea}
              onChange={this._handleShowSecondTextarea}
            />
            Show second textarea
          </label>
        </div>
        <div>
          <label>
            <input
              data-test="movePopupAsYouType"
              type="checkbox"
              defaultChecked={movePopupAsYouType}
              onChange={this._handleMovePopupAsYouType}
            />
            Move popup as you type
          </label>
        </div>
        <div>
          <label>
            <input
              data-test="renderToBody"
              type="checkbox"
              defaultChecked={renderToBody}
              onChange={this._handleRenderToBody}
            />
            Render autocomplete to body
          </label>
        </div>
        <div>
          <label>
            <input
              data-test="minChar"
              type="number"
              value={minChar}
              onChange={this._handleMinChar}
            />
            Minimal characters typed to trigger autocomplete
          </label>
        </div>
        <div>
          Actual caret position:{" "}
          <span data-test="actualCaretPosition">{caretPosition}</span>
        </div>
        <button data-test="setCaretPosition" onClick={this._setCaretPosition}>
          setCaretPosition(1);
        </button>
        <button data-test="getCaretPosition" onClick={this._getCaretPosition}>
          getCaretPosition();
        </button>
        <button
          data-test="getSelectionPosition"
          onClick={this._getSelectionPosition}
        >
          getSelectionPosition();
        </button>
        <button data-test="getSelectedText" onClick={this._getSelectedText}>
          getSelectedText();
        </button>
        <button data-test="focus" onClick={this._focus}>
          Focus the textarea
        </button>
        <button data-test="changeValueTo" onClick={this._changeValueTo}>
          Change value to ":troph"
        </button>
        <button data-test="dummy">dummy</button>
        <div>
          Actual token in "[" provider:{" "}
          <span data-test="actualToken">{actualTokenInProvider}</span>
        </div>
        <ReactTextareaAutocomplete
          className="one"
          onKeyDown={e => {
            console.log(`pressed "${e.key}"`);
          }}
          ref={ref => {
            this.rtaRef = ref;
          }}
          innerRef={ref => {
            this.textareaRef = ref;
          }}
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
          movePopupAsYouType={movePopupAsYouType}
          onCaretPositionChange={this._onCaretPositionChangeHandle}
          onItemHighlighted={info => {
            // save highlighted item to window; use it later in E2E tests
            window.__lastHighlightedItem = info;
          }}
          onItemSelected={info => {
            // save selected item to window; use it later in E2E tests
            window.__lastSelectedItem = info;
          }}
          minChar={minChar}
          value={text}
          onChange={this._onChangeHandle}
          renderToBody={renderToBody}
          // tabOrEnter={true}
          trigger={{
            ":": {
              dataProvider: token => [
                { name: "ID" },
                { name: "name" },
                { name: "someProperty"}
              ],
              component: Item,
              output: (value) => `${value.name}`
            }
          }}
        />
      </div>
    );
  }
}

export default App;
