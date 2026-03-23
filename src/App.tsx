import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MarketingHomepage from "./MarketingHomepage";
import IntelligenceWorkspace from "./IntelligenceWorkspace";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingHomepage />} />
        <Route path="/workspace" element={<IntelligenceWorkspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
