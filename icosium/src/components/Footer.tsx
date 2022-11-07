import React from "react";
import { useTranslation } from "react-i18next";
import {
  linkGithub,
  linkDiscord,
  linkYoutube,
  linkfacebook,
} from "../screens/LandingPage/urls";
import Discord from "./discord";
import Facebook from "./facebook";
import Github from "./github";
import Youtube from "./youtube";
export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 py-16">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center">
          <div
            className="w-full wow fadeInUp text-center"
            data-wow-delay="0.8s"
          >
            <div className="mx-3 mb-8">
              <h3 className="font-bold text-xl text-white mb-5">
                {t("LandingPage.find_us")}
              </h3>
              <ul className="social-icons flex justify-center">
                <li className="mx-2">
                  <a
                    href={linkGithub}
                    className="footer-icon hover:bg-indigo-600"
                  >
                    <Github />
                  </a>
                </li>
                <li className="mx-2">
                  <a
                    href={linkDiscord}
                    className="footer-icon hover:bg-red-500"
                  >
                    <Discord />
                  </a>
                </li>
                <li className="mx-2">
                  <a
                    href={linkYoutube}
                    className="footer-icon hover:bg-blue-400"
                  >
                    <Youtube />
                  </a>
                </li>
                <li className="mx-2">
                  <a
                    href={linkfacebook}
                    className="footer-icon hover:bg-indigo-500"
                  >
                    <Facebook />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
