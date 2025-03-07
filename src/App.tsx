// Import React hooks and routing components.
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// Import pages to be rendered by routes.
import Home from "./pages/Home";
import About from "./pages/About";
import Discussions from "./pages/Discussions";
import Notifications from "./pages/Notifications";
// Import Material UI components for theme switching.
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
// Import global CSS.
import "./App.css";

// Define the props for the Navbar component.
interface NavbarProps {
  toggleTheme: () => void; // Function to toggle between light and dark themes.
  theme: "light" | "dark"; // Current theme mode.
}

// Navbar component renders the navigation menu and a theme switch.
function Navbar({ toggleTheme, theme }: NavbarProps) {
  return (
    <nav className="navbar">
      <ul>
        {/* Navigation links for the application. */}
        <li><Link to="/">RMS</Link></li>
        <li><Link to="/discussions">Discussions</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      {/* Theme switch control using Material UI Switch component. */}
      <FormControlLabel
        control={
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            color="primary"
          />
        }
        label={theme === "light" ? "Dark Mode" : "Light Mode"}
      />
    </nav>
  );
}

// Main App component sets up routing and theme management.
function App() {
  // Initialize theme state from localStorage; default to "light" if not set.
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // Update the document's data-theme attribute and persist the theme in localStorage.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme between light and dark modes.
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Router>
      {/* Render the Navbar with the current theme and toggle function. */}
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      {/* Container for main page content rendered by routes. */}
      <div className="container">
        <Routes>
          {/* Define routes for different pages. */}
          <Route path="/" element={<Home />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      
      {/* Footer section with copyright notice. */}
      <footer className="footer">
        <p>© 2025 Research Management System. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
