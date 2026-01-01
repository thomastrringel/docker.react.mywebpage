// src/pages/Dashboard.jsx

import { useOutletContext } from "react-router-dom";
import ContainerA from "../containers/ContainerA";
import ContainerE from "../containers/ContainerE";

export default function Dashboard() {
  const { showE, setShowE, selectedTicker, setSelectedTicker } =
    useOutletContext();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dashboard</h1>

      {/* Container A */}
      <ContainerA
        onSelectTicker={(ticker) => {
          setSelectedTicker(ticker);
          setShowE(true); // E automatisch öffnen
        }}
      />

      {/* Container E */}
      {showE && <ContainerE ticker={selectedTicker} />}
    </div>
  );
}
