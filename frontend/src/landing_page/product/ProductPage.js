import React from "react";
import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

import OpenAccount from "../OpenAccount";
import Navbar from "../Navbar";
import Footer from "../Footer";

function ProductPage() {
  return (
    <>
      <Hero />
      <LeftSection
        imageURL="media/kite.png"
        productName="Kite"
        productDescription="Our ultra-fast flagship trading platform with streaming market data, adavanced charts, an elegant UI, and more. Enjoy teh Kite experience seamlessly on your Android and iOS devices"
        tryDemo=""
        learnMore=""
        googlePlay=""
        appstore=""
      />
      <RightSection 
        imageURL="media/console.png"
        productName="Console"
        productDescription="The central dashboards for your Stackpliot account. Gain insights into you trades and inbvestment with in-depth reports and visualisation"
        learnMore=""
        />
      <LeftSection
        imageURL="media/coin.png"
        productName="Coin"
        productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices"
        tryDemo=""
        learnMore=""
        googlePlay=""
        appstore=""
      />
      <RightSection
      imageURL="media/kite.png"
        productName="Kite Connect API"
        productDescription="Build powerful trading platforms and experience with our super simple HTTP/JSON APIs. If you are a stratup build your investment app and showcase it to our clientbase."
        learnMore=""
      />
      <LeftSection
        imageURL="media/varsity.png"
        productName="Varsity mobile"
        productDescription="An easy to grasp, collection of stock market leassons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn onn the go."
        tryDemo=""
        learnMore=""
        googlePlay=""
        appstore=""
      />
      <p className="text-center mt-5 why frontends">Want to know more about our technology stack? Check out of StockPilot</p>
      <Universe
      />
    </>
  );
}

export default ProductPage;
