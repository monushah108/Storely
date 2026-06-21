import { configureStore } from "@reduxjs/toolkit";
import { FileApiSlice } from "./slices/Flieslice.js";
import { UserApiSlice } from "./slices/UserSlice.js";
import { adminApiSlice } from "./slices/AdminSlice.js";

export const Store = configureStore({
  reducer: {
    [FileApiSlice.reducerPath]: FileApiSlice.reducer,
    [UserApiSlice.reducerPath]: UserApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      FileApiSlice.middleware,
      UserApiSlice.middleware,
      adminApiSlice.middleware,
    );
  },
});
