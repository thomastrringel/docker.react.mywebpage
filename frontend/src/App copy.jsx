// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import ContainerA from "./containers/ContainerA";
import ContainerB from "./containers/ContainerB";
import ContainerC from "./containers/ContainerC";
import ContainerD from "./containers/ContainerD";
import ContainerE from "./containers/ContainerE";
import ContainerF from "./containers/ContainerF";
import ContainerG from "./containers/ContainerG";
import ContainerH from "./containers/ContainerH";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ContainerA />} />
          <Route path="a" element={<ContainerA />} />
          <Route path="b" element={<ContainerB />} />
          <Route path="c" element={<ContainerC />} />
          <Route path="d" element={<ContainerD />} />
          <Route path="e" element={<ContainerE />} />
          <Route path="f" element={<ContainerF />} />
          <Route path="g" element={<ContainerG />} />
          <Route path="h" element={<ContainerH />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
