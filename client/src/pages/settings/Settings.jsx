// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Settings.css";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { useContext } from "react";
import { ThemeContext } from "../../context/themeContext";

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = (th) => {
    setTheme(th);
  };

  return (
    <section className="settings">
      <div className="container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your personal preferences and workspace configuration.</p>
        </div>
        <div className="settings-container">
          <div className="apearance">
            <h3>Dark Mode</h3>
            <p>
              Switch between light and dark themes for the entire workspace.
            </p>
            <div className="buttons">
              <button
                className={`theme-btn light ${theme == "light" ? "active" : ""}`}
                onClick={() => handleThemeChange("light")}
              >
                <div className="icon">
                  <CiLight />
                </div>
                <p>Light Mode</p>
              </button>
              <button
                className={`theme-btn dark ${theme == "dark" ? "active" : ""}`}
                onClick={() => handleThemeChange("dark")}
              >
                <div className="icon">
                  <CiDark />
                </div>
                <p>Dark Mode</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
