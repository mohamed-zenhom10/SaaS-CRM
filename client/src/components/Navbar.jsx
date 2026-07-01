/* eslint-disable react-hooks/exhaustive-deps */
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
import { API_RUL } from "../api/api";
import SearchData from "./SearchData";
import Notifications from "./Notifications";

const Navbar = () => {
  const [serach, setSearch] = useState("");

  const [serachData, setSearchData] = useState([]);

  const [userData, setUserData] = useState();

  const [displaySearch, setDisplaySearch] = useState(false);

  const [loading, setIsLoading] = useState(false);

  const [openNotifications, setOpenNotifications] = useState(false);

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

  useEffect(() => {
    if (!serach.trim()) {
      setSearchData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const handleSearch = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_RUL}/api/v1/clients?keyword=${serach}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        console.log("Number of Values => ", data.data.length);
        console.log("Search Data => ", data.data);
        if (data?.data) {
          setSearchData(data?.data);
        } else {
          setSearchData([]);
        }
        console.log("State =>", serachData);
      } catch (error) {
        setSearchData([]);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    handleSearch();
  }, [serach]);

  return (
    <header className="header">
      <div className={`input ${displaySearch ? "display" : ""}`}>
        <IoSearchSharp />
        <input
          type="text"
          placeholder="Search for clients..."
          value={serach}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={`search-result ${serach.length > 0 ? "display" : ""}`}>
          {loading ? (
            <p className="searching">Searching...</p>
          ) : serachData.length > 0 ? (
            serachData.map((item) => <SearchData data={item} key={item._id} />)
          ) : (
            <p
              className={`no-data-matches ${serach.length > 0 ? "display" : ""}`}
            >
              No Data Matches...
            </p>
          )}
        </div>
      </div>
      <div className="data">
        <div className="icons">
          <div className="icon notifications">
            <FaBell onClick={() => setOpenNotifications(!openNotifications)} />
            {openNotifications ? <Notifications /> : <></>}
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
              src={`${userData?.profileImage ? `${API_RUL}/images/${userData.profileImage}` : default_user_img}`}
              alt="user image"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
