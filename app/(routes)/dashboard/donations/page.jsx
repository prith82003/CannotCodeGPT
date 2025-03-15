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
