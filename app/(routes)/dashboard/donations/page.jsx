"use client";
import React from "react";
import Chat from "../Chatbot/Chat";
import { charityList } from "./_components/organisations";
import "./_components/donations.css";

function Donations() {
  const [search, setSearch] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState("");
  const searchPlaceholder = "Find your crew... and drop the cash on what's worth!";
  const [letter, setLetter] = React.useState(0);

  React.useEffect(() => {
    if (letter < searchPlaceholder.length) {
      const typingInterval = setTimeout(() => {
        setPlaceholder(searchPlaceholder.slice(0, letter + 1));
        setLetter(letter + 1);
      }, 100);
      return () => clearTimeout(typingInterval);
    }
  }, [letter]);

  const listCharities = charityList
    .filter((charity) => charity.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleInformation = (charity) => window.open(charity.infoURL, "_blank");
  const handleDonate = (charity) => window.open(charity.donateURL, "_blank");

  return (
    <>
      <div className="p-10">
        <h2 className="font-bold text-3xl">Donations</h2>
        <div>
          {/* create a search bar */}
          <div className="my-4">
            <input
              type="text"
              placeholder={placeholder}
              className="p-2 bg-white text-black border border-gray-300 rounded-md w-full typing-placeholder"
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
              <div key={i} className="charity">
                <h1 className="font-bold text-xl">{charity.name}</h1>
                <p className="my-2">{charity.description}</p>
                <div className="flex space-x-4">
                  <button onClick={() => handleInformation(charity)} className="button info-button">
                    👀 Check It Out for More Information
                  </button>
                  <button onClick={() => handleDonate(charity)} className="button donate-button">
                    💸 Drop Some Love and Donate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Chat />
    </>
  );
}

export default Donations;
