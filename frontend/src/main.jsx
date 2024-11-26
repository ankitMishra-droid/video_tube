import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { ThemeProvider } from "./components/theme-provider";
import PageNotFound from "./components/PageNotFound";
import MyChannel from "./components/channels/MyChannel";
import ChannelVideos from "./components/channels/ChannelVideos";
import Tweets from "./components/channels/Tweets";
import VideoPlaylist from "./components/channels/VideoPlaylist";
import About from "./components/channels/About";
import ChannelSubscribed from "./components/channels/ChannelSubscribed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/channel/:userName",
        element: <MyChannel />,
        children: [
          {
            path: "/channel/:userName",
            element: <ChannelVideos />
          },
          {
            path: "/channel/:userName/tweets",
            element: <Tweets />
          },
          {
            path: "/channel/:userName/playlist",
            element: <VideoPlaylist />
          },
          {
            path: "/channel/:userName/about",
            element: <About />
          },
          {
            path: "/channel/:userName//subscribed",
            element: <ChannelSubscribed />
          }
        ]
      }
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
