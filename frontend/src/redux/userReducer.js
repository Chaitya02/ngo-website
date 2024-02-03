const initialState = { user: '' };
const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export default userReducer;
