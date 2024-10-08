import Navbar from "./Components/NavBar";
import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-gray-200">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
