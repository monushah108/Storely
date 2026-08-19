import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { Store } from "./store/index.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { Toaster } from "sonner";

const client_id = import.meta.env.VITE_CLIENT_ID;
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={client_id}>
    <Provider store={Store}>
      <ErrorBoundary>
        <App />
        <Toaster position="top-center" richColors />
      </ErrorBoundary>
    </Provider>
  </GoogleOAuthProvider>,
);
