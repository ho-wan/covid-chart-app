const initialState = {
  data: null,
};

// @ts-ignore
export const chartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TODO":
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};
