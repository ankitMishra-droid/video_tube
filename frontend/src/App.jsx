import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { healthCheck } from "./fetchDetails/healthCheck";
import { getCurrentUser } from "./fetchDetails/getCurrentUser";
import SideBarNav from "./components/SideBarNav";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  if (loading) {
    return (
      <>
        <div className="h-screen w-full  overflow-y-auto bg-[#000000] text-white">
          <div className="flex flex-col items-center justify-center mt-64">
            <span>loading...</span>
            <h1 className="text-3xl text-center mt-8 font-semibold">
              Please wait...
            </h1>
            <h1 className="text-xl text-center mt-4">
              Refresh the page if it takes too long
            </h1>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <main className="h-screen w-full">
        <ToastContainer
          position="top-right"
          theme="dark"
          draggable
          autoClose={2000}
          hideProgressBar
        />
        <div className="">
          <SideBarNav setIsSidebarIsOpen={setIsSidebarOpen} />
        </div>
        <Header />
        <main
          className={`px-3 py-2 flex-1 transition-all delay-0 ${
            isSidebarOpen ? "p-3 ml-0 md:ml-64" : "ml-0 2xl:container sm:mx-auto px-2"
          }`}
        >
          <Outlet />
        </main>
      </main>
    </>
  );
}

export default App;
