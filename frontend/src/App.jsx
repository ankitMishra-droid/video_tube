import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { healthCheck } from "./fetchDetails/healthCheck";
import { getCurrentUser } from "./fetchDetails/getCurrentUser";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    healthCheck().then(() => {
      getCurrentUser(dispatch).then(() => {
        setLoading(false);
      });
    });
    setInterval(() => {
      healthCheck();
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsSidebarOpen(true);
    } else if(location.pathname === "/" && window.innerWidth < 767) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false)
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full overflow-y-auto bg-black text-white">
        <div className="flex flex-col items-center justify-center mt-64">
          <span>Loading...</span>
          <h1 className="text-3xl text-center mt-8 font-semibold">
            Please wait...
          </h1>
          <h1 className="text-xl text-center mt-4">
            Refresh the page if it takes too long
          </h1>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-full">
      <ToastContainer
        position="top-right"
        theme="dark"
        draggable
        autoClose={2000}
        hideProgressBar
      />
      <Header setIsSidebarIsOpen={setIsSidebarOpen} />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out mt-[115px] ${
          isSidebarOpen
            ? "ml-0 md:ml-64 px-3 py-2 2xl:container 2xl:mx-auto"
            : "ml-0 px-2 sm:px-6 2xl:container sm:mx-auto 2xl:px-2"
        }`}
      >
        <Outlet />
      </main>
    </main>
  );
}

export default App;
