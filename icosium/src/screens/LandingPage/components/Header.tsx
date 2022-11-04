import React from "react";
import { linkGithub } from "../urls";
import imgLogo from "../../../assets/logo-rectangle.webp";
export const Header = () => (
  <header className="relative">
    <div className="navigation bg-white fixed top-0 left-0 w-full z-30 duration-300 shadow">
      <div className="container mx-auto">
        <nav className="navbar navbar-expand-lg flex justify-between items-center relative duration-300">
          <a
            className="navbar-brand flex flex-row content-center w-20 items-center"
            href="/"
          >
            <img src={imgLogo} alt="Logo" className="m-5" />{" "}
            <span className="text-lg font-extrabold">IOPRODZ</span>
          </a>
          <div className=" top-100 left-0 mt-full bg-white z-20 px-5 py-3  ">
            <ul className="navbar-nav mr-auto justify-end items-center lg:flex">
              <li className="nav-item">
                <a
                  className="page-scroll active"
                  href={linkGithub}
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </header>
);
