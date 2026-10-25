import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ListingPage from "./pages/ListingPage";
import CreatePage from "./pages/CreatePage";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ListingPage />} />
        <Route path="new" element={<CreatePage />} />
        <Route path="edit/:id" element={<CreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
