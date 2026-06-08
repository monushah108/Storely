import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { Store } from "./store/index.js";

const client_id = process.env.CLIENT_ID;
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={client_id}>
    <Provider store={Store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>,
);
