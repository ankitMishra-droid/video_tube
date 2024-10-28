import { createBrowserRouter } from "react-router-dom";
import App from '../App.jsx'
import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import Login from "../pages/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />
      }
    ],
  },
]);

export default router;