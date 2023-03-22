import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Show from "./pages/Show";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import ReservaFinalizada from "./pages/ReservaFinalizadas";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Show />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/reservaFinalizada" element={<ReservaFinalizada />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
