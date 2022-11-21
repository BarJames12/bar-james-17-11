import React from "react";
import Home from "../home/Home";
import Favorite from "../favorite/Favorite";
import { Route, Routes } from "react-router-dom";

function Main() {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorite" element={<Favorite />} />
        </Routes>
      </div>
    </div>
  );
}

export default Main;
