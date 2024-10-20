// @flow

import React from "react";

import Listeners, { KEY_CODES } from "./listener";
import Item from "./Item";
import type { ListProps, ListState } from "./types";

export default class List extends React.Component<ListProps, ListState> {
  state: ListState = {
    selectedItem: null,
    isMounted: false,
    itemSelected: false,
  };

  cachedIdOfItems: Map<Object | string, string> = new Map();

  componentDidMount() {
    this.listeners.push(
      Listeners.add([KEY_CODES.DOWN, KEY_CODES.UP], this.scroll),
      Listeners.add([KEY_CODES.ENTER, KEY_CODES.TAB], this.onPressEnter)
    );
  }

  componentDidUpdate({ values: oldValues }: ListProps) {
    const { values } = this.props;
    const oldValuesSerialized = oldValues
      .map((val) => this.getId(val))
      .join("");
    const newValuesSerialized = values.map((val) => this.getId(val)).join("");

    if (oldValuesSerialized !== newValuesSerialized && values && values[0]) {
      this.selectItem(values[0]);
    }
  }

  componentWillUnmount() {
    let listener;
    while (this.listeners.length) {
      listener = this.listeners.pop();
      Listeners.remove(listener);
    }
  }

  onMouseClick = () => {
    const { values } = this.props;
    this.modifyText(values[this.getPositionInList()]);
    this.props.onPressEnter();
  };

  onPressEnter = (e: SyntheticEvent<*>) => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    const { values, tabOrEnter } = this.props;
    const { itemSelected } = this.state;

    if (
      tabOrEnter &&
      (e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.TAB)
    ) {
      this.modifyText(values[this.getPositionInList()]);
    } else if (!tabOrEnter && itemSelected) {
      this.modifyText(values[this.getPositionInList()]);
      this.setState({ itemSelected: false });
    }

    this.props.onPressEnter();
  };

  getPositionInList = () => {
    const { values } = this.props;
    const { selectedItem } = this.state;

    if (!selectedItem) return 0;

    return values.findIndex((a) => this.getId(a) === this.getId(selectedItem));
  };

  getId = (item: Object | string): string => {
    if (this.cachedIdOfItems.has(item)) {
      // $FlowFixMe
      return this.cachedIdOfItems.get(item);
    }

    const textToReplace = this.props.getTextToReplace(item);

    const computeId = (): string => {
      if (textToReplace) {
        if (textToReplace.key) {
          return textToReplace.key;
        }

        if (typeof item === "string" || !item.key) {
          return textToReplace.text;
        }
      }

      if (!item.key) {
        throw new Error(
          `Item ${JSON.stringify(item)} has to have defined "key" property`
        );
      }

      // $FlowFixMe
      return item.key;
    };

    const id = computeId();

    this.cachedIdOfItems.set(item, id);

    return id;
  };

  props: ListProps;

  listeners: Array<number> = [];

  itemsRef: {
    [key: string]: HTMLDivElement,
  } = {};

  modifyText = (value: Object | string) => {
    if (!value) return;

    const { onSelect } = this.props;
    onSelect(value);
  };

  selectItem = (item: Object | string, keyboard: boolean = false) => {
    const { onItemHighlighted } = this.props;

    if (this.state.selectedItem === item) return;
    this.setState({ selectedItem: item }, () => {
      // this.modifyText(item)
      onItemHighlighted(item);

      if (keyboard) {
        this.setState({ itemSelected: true });
        this.props.dropdownScroll(this.itemsRef[this.getId(item)]);
      }
    });
  };

  scroll = (e: KeyboardEvent) => {
    e.preventDefault();

    const { values } = this.props;
    const { isMounted } = this.state;
    const code = e.keyCode || e.which;

    const oldPosition = this.getPositionInList();
    let newPosition;

    switch (code) {
      case KEY_CODES.DOWN:
        newPosition = oldPosition + 1;
        break;
      case KEY_CODES.UP:
        newPosition = oldPosition - 1;
        break;
      default:
        newPosition = oldPosition;
        break;
    }

    if (!isMounted) {
      newPosition = 0;
      this.setState({ isMounted: !isMounted });
    } else {
      newPosition =
        ((newPosition % values.length) + values.length) % values.length; // eslint-disable-line
    }

    this.selectItem(
      values[newPosition],
      [KEY_CODES.DOWN, KEY_CODES.UP].includes(code)
    );
  };

  isSelected = (item: Object | string): boolean => {
    const { selectedItem } = this.state;

    if (!selectedItem) return false;

    return this.getId(selectedItem) === this.getId(item);
  };

  render() {
    const {
      values,
      component,
      style,
      itemClassName,
      className,
      itemStyle,
    } = this.props;

    return (
      <ul className={`rta__list ${className || ""}`} style={style}>
        {values.map((item) => (
          <Item
            key={this.getId(item)}
            innerRef={(ref) => {
              this.itemsRef[this.getId(item)] = ref;
            }}
            selected={this.isSelected(item)}
            item={item}
            className={itemClassName}
            style={itemStyle}
            onClickHandler={this.onMouseClick}
            onKeyDownHandler={this.onPressEnter}
            onSelectHandler={this.selectItem}
            component={component}
          />
        ))}
      </ul>
    );
  }
}
