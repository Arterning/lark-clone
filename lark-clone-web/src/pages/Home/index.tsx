import React, { useEffect, useState } from "react";
import { Quote } from "../../types/Quote";

interface IHomePageProps {}

const HomePage: React.FC<IHomePageProps> = (props) => {
  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "60%",
      }}
    >
      <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
      
    </div>
  );
};

export default HomePage;
