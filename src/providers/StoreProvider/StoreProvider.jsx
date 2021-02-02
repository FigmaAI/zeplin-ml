import React, { createContext, useContext, useReducer } from "react";

import reducer from "./reducer";
import { getActions } from "./actions";
import { getSelectors } from "./selectors";

const initialState = {
  zeplinUser: null
};

const StateContext = createContext();

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectors = getSelectors(state);
  const actions = getActions(dispatch);

  return (
    <StateContext.Provider
      value={{ state, dispatch, actions, selectors }}
      children={children}
    />
  );
};

const useStore = () => useContext(StateContext);

export { StoreProvider, useStore };
