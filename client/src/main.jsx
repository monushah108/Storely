import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { Store } from "./store/index.js";

const client_id =
  "389965029020-2c71sgd5bku35i957c5al69uh1hb39pv.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={client_id}>
    <Provider store={Store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>,
);
