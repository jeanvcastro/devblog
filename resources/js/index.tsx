import * as ReactDOM from "react-dom/client";
import App from "./app";

const rootElement = document.getElementById("app");

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}
