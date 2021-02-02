import ACTION_TYPES from "./types";

import * as zeplinService from "../../services/zeplin";

const getActions = dispatch => ({
  async getZeplinUser() {
    const zeplinUser = await zeplinService.fetchCurrentUser();
    console.log(zeplinUser)
    dispatch({
      type: ACTION_TYPES.GET_ZEPLIN_USER,
      zeplinUser
    });
  },
});

export { getActions };
