import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage.js";
import PageNotFound from "./pages/NotFound/PageNotFound.js";
import LoginForm from "./components/LoginForm/LoginForm.js";
import AuthPage from "./pages/AuthPage/AuthPage.js";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route exact path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
