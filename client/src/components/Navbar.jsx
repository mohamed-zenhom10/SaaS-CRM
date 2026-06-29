/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import default_user_img from "../assets/images/default-user.jpg";
import { FaBars } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { success } from "../assets/utils/Toasts";

const Navbar = () => {
  const [serach, setSearch] = useState("");

  const [userData, setUserData] = useState();

  const [displaySearch, setDisplaySearch] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    success("User logged out successfully");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);
  return (
    <header className="header">
      <div className={`input ${displaySearch ? "display" : ""}`}>
        <IoSearchSharp />
        <input
          type="text"
          placeholder="Search..."
          value={serach}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="data">
        <div className="icons">
          <div className="icon">
            <FaBell />
          </div>
          <div className="icon">
            <IoSettings />
          </div>
          <div className="icon">
            <MdOutlineLogout onClick={logout} />
          </div>
          <div className="icon bar">
            <FaBars onClick={() => setDisplaySearch(!displaySearch)} />
          </div>
        </div>
        <div className="user">
          <div className="user-data">
            <h3>{userData?.name}</h3>
            <p>{userData?.title}</p>
          </div>
          <div className="user-img">
            <img
              src={`${userData?.profileImage ? `http://localhost:5000/images/${userData.profileImage}` : default_user_img}`}
              alt="user image"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
