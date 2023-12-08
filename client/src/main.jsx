import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ContextProviders from "./context/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProviders>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </ContextProviders>
  </BrowserRouter>
);
