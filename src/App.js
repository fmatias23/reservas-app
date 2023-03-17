import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Show from "./pages/Show";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Login from "./pages/LoginForm";
import { AuthProvider } from "./context/AuthContext";

import { Auth } from "./component/Auth";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Auth>
                  <Show />
                </Auth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
