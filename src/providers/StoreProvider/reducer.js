import ACTION_TYPES from "./types";

const reducers = {
  loadZeplinUser(state, { zeplinUser }) {
    return {
      ...state,
      zeplinUser
    };
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_ZEPLIN_USER:
      return reducers.loadZeplinUser(state, action);
    default:
      return state;
  }
};

export default reducer;
