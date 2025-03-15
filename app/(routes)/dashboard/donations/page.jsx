"use client";
import React from "react";
import Chat from "../Chatbot/Chat";
import { charityList } from "./organisations";

function donations() {
  const [search, setSearch] = React.useState("");

  return (
    <>
      <div className="p-10">
        <h2 className="font-bold text-3xl">Donations</h2>
        <div>
          {/* create a search bar */}
          <div className="my-4">
            <input
              type="text"
              placeholder="Search organisations"
              className="p-2 bg-white text-black border border-gray-300 rounded-md w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/*
          list of charities and organisations with the following information in a coloumn:
            - name
            - description of organisation / charity
            - button to donate
          */}
        </div>
      </div>
      <Chat />
    </>
  );
}

export default donations;
