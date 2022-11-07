import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSearchParams } from "react-router-dom";
import { linkDiscord, linkGithub } from "./urls";
import { Footer } from "../../components/Footer";

import { useAddSubsciptionMutation } from "../../shared/queries";

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className=" bg-slate-50 pt-48 pb-10">
        <div className="container mx-auto">
          <div className="flex justify-between">
            <div className="w-full text-center">
              <h2
                className="text-4xl font-bold leading-snug text-gray-700 mb-10 wow fadeInUp"
                data-wow-delay="1s"
              >
                {t("LandingPage.headline")}
              </h2>
            </div>
          </div>
        </div>
        <div className="container text-center py-20  mx-auto">
          <div className="flex justify-center mx-3">
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
              <h4
                className="mb-3 section-heading wow fadeInUp"
                data-wow-delay="0.3s"
              >
                {t<string>("LandingPage.sub_title")}
              </h4>
              <p
                className="mb-4 text-gray-600 leading-loose text-sm wow fadeInUp"
                data-wow-delay="0.6s"
              >
                {t<string>("LandingPage.about_us_p1")}
                <a className="text-sky-600" href={linkDiscord}>
                  Discord
                </a>{" "}
                {t("LandingPage.or")}
                <a className="text-sky-600" href={linkGithub}>
                  Github
                </a>
                {t<string>("LandingPage.about_us_p2")}
              </p>
              <SubscriptionForm />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

const SubscriptionForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    mutate: addSubscription,
    isLoading,
    error,
    isSuccess,
  } = useAddSubsciptionMutation();

  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const source = searchParams.get("source") || undefined;
    await addSubscription({ email, source });
  };

  return (
    <form>
      <input
        value={email}
        type="email"
        className="w-full mb-5 bg-white border border-blue-300 rounded-full px-5 py-3 duration-300 focus:border-blue-600 outline-none text-center"
        name="email"
        placeholder={t("LandingPage.emailPlaceHolder")}
        onChange={(e) => setEmail(e.target.value)}
      />
      {isSuccess && (
        <p className="text-green-600">{t("LandingPage.subscriptionSuccess")}</p>
      )}
      {!!error && (
        <p className="text-red-600">
          {error.status === 409 && t("LandingPage.alreadySubscribed")}
          {error.status === 403 && t("LandingPage.emailNotValid")}
          {error.status >= 500 && t("shered.serverError")}
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="border-0 bg-blue-600 text-white rounded-full px-6 h-12 duration-300 hover:opacity-75"
      >
        {t<string>("LandingPage.subscribe")}
      </button>
    </form>
  );
};
