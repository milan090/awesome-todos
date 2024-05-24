import React from "react";
import ReactDOM from "react-dom/client";
import "@radix-ui/themes/styles.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "@radix-ui/themes";
import { TasksProvider } from "./store/TaskContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Theme>
      <TasksProvider>
        <App />
      </TasksProvider>
    </Theme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
