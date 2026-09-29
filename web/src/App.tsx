import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import CollectionPage from "./pages/CollectionPage";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import StatsPage from "./pages/StatsPage";


function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/items/:itemId"
          element={<ItemDetailPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/collection"
            element={<CollectionPage />}
          />
          <Route path="/stats" element={<StatsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}


export default App;