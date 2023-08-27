import React, { useState } from "react";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIComponents/Backdrop";

const MainNavigation = () => {
  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);
  const setBurgerMenu = (e) => {
    setMobileNavIsOpen((prevState) => !prevState);
  };
  return (
    <>
      {mobileNavIsOpen && <Backdrop onClick={setBurgerMenu} />}
      {mobileNavIsOpen && (
        <SideDrawer show={mobileNavIsOpen}>
          <span className="closeSideDrawer" onClick={setBurgerMenu}>
            X
          </span>
          <nav
            class="main-navigation__drawer-nav"
            style={mobileNavIsOpen ? { display: "block" } : { display: "none" }}
          >
            <NavLinks />
          </nav>
        </SideDrawer>
      )}
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={setBurgerMenu}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Share Your Place</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
