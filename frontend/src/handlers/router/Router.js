import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}></Route>
    </Routes>
  );
}
