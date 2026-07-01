/* eslint-disable no-unused-vars */
import React from "react";

const SearchData = ({ data }) => {
  return (
    <div className="search-data">
      <p>Name: {data?.name}</p>
      <p>Email: {data?.email}</p>
      <p>Status: {data?.status}</p>
    </div>
  );
};

export default SearchData;
