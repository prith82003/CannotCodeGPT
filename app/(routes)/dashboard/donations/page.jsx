"use client";
import React from "react";
import Chat from "../Chatbot/Chat";
import { charityList } from "./organisations";

function donations() {
  const [search, setSearch] = React.useState("");

  const listCharities = charityList
    .filter((charity) => charity.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleDonate = (charity) => window.open(charity.url, "_blank");

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
          <div className="max-h-96 overflow-y-auto">
            {listCharities.map((charity, i) => (
              <div key={i} className="m-4 ml-0 p-4 border rounded-md">
                <h1 className="font-bold text-xl">{charity.name}</h1>
                <p className="my-2">{charity.description}</p>
                <button
                  onClick={() => handleDonate(charity)}
                  className="bg-pink-400 text-white py-2 px-4 border solid rounded-md"
                >
                  Donate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Chat />
    </>
  );
}

export default donations;
