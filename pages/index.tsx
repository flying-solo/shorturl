import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import { IoIosCopy } from "react-icons/io";
import { ProgressBar } from "react-loader-spinner";
import { urlValidate } from "../util/validate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [shortUrl, setShortUrl] = useState(undefined);
  const [fetching, setFetching] = useState(false);

  const handleCopy = () => {
    toast("✅ URL Copied !!");
  };

  const handleSubmit = () => {
    urlValidate
      .validate({ url })
      .then((res) => {
        setFetching(true);
        axios
          .post("/api/shorten", { url })
          .then((result) => {
            setShortUrl(result.data);
            setFetching(false);
            setUrl("");
          })
          .catch((err) => {
            console.log("Error -> index.tsx -> post", err);
            setFetching(false);
          });
      })
      .catch((err) => {
        toast.error(err.errors[0]);
        setUrlError(err.errors[0]);
        setFetching(false);
      });
  };

  return (
    <>
      <Head>
        <title>URL Shortner</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen flex flex-col justify-end items-center backgroundGradient">
        <div className="h-full md:h-[90%] w-full md:w-[80%] flex flex-col items-start justify-start gap-12">
          <div className="font-bold text-[2rem] lg:text-[2.5rem] mt-[9rem] md:mt-[50px] text-transparent text-8xl bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 md:px-0">
            Shorten Your Url
          </div>
          <div className="mt-[60px] flex flex-col items-start md:flex-row md:items-center gap-5 px-3">
            <div className="flex gap-4">
              <input
                type="text"
                value={url}
                placeholder="Enter your Link"
                className="text-white outline-none md:px-5 py-2 bg-transparent border-b-2 border-b-gray-300 text-sm md:text-md shadow-sm placeholder-[#c4c4c4] w-[70vw] md:w-[50vw]"
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError("");
                }}
              />
            </div>
            <button
              disabled={urlError !== ""}
              className={`${
                urlError !== ""
                  ? "bg-red-500 hover:cursor-not-allowed opacity-70 border-2 border-gray-200"
                  : "border-2 border-gray-200"
              } text-white px-3 md:px-5 py-2 font-semibold text-sm md:text-lg`}
              onClick={handleSubmit}
            >
              Shorten
            </button>
          </div>
          {/* <div className="text-red-400 text-xl font-semibold">{urlError}</div> */}
          <div className="mt-[70px] bg-transparent py-2 text-pink-600 font-medium hover:cursor-pointer px-3 md:px-0">
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            {fetching ? (
              <ProgressBar
                height="80"
                width="80"
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass="progress-bar-wrapper"
                borderColor="#d1d5db"
                barColor="#bf2674"
              />
            ) : shortUrl ? (
              <div
                className="flex gap-4 items-center text-lg"
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl);
                  handleCopy();
                }}
              >
                {shortUrl} <IoIosCopy className="text-pink-600" />
              </div>
            ) : (
              <div className="text-lg font-bold">
                Short URL will appear here
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
