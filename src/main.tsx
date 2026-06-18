import ReactDOM from "react-dom/client";
import "./styles/main.css";
import "./index.css";
import { App } from "./App";
import { AppProviders } from "./components/layout/AppProviders";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <AppProviders>
    <App />
  </AppProviders>
);
