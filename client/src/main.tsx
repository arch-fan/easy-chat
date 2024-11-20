import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Chat from "./pages/chat.tsx";
import Index from "./pages/index.tsx";
import { Route } from "wouter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Route path="/" component={Index} />
    <Route path="/chat" component={Chat} />
  </StrictMode>
);
