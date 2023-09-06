import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Main_page from "./pages/Main_page";
import All_hospital from "./pages/All_hospital";
import Blood_donators from "./pages/Blood_donators";
import Admin from "./Admin_page/Admin";
import Admin_login_page from "./Admin_page/Admin_login_page";
import About from "./pages/About";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main_page />} />
          <Route path="/Hospitals" element={<All_hospital />} />
          <Route path="/Blood_donators" element={<Blood_donators />} />
          <Route path="/Admin_Activity" element={<Admin />} />
          <Route path="/Admin26" element={<Admin_login_page />} />
          <Route path="/About" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
