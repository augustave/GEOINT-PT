import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MarketingHomepage from "./MarketingHomepage";
import IntelligenceWorkspace from "./IntelligenceWorkspace";
import WorkspaceQaPage from "./workspace/WorkspaceQaPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingHomepage />} />
        <Route path="/workspace" element={<IntelligenceWorkspace />} />
        {import.meta.env.DEV ? <Route path="/workspace/qa" element={<WorkspaceQaPage />} /> : null}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
