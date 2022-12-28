import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Chat from "./pages/Chat";
import Room from "./pages/Room";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/chat/:name/:user",
    // path: "/chat",
    element: <Room />,
  },
  {
    path: "/",
    element: <Chat />,
    // children: [
    //   {
    //     path: "chat/name=:name&user=:user",
    //     element: <Room />,
    //   },
    // ],
    // errorElement: <ErrorPage />,
  },

  {
    path: "*",
    element: <h1>Error Occured</h1>,
  },
  // {
  //   path: "contacts/:contactId",
  //   element: <Contact />,
  // },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position={toast.POSITION.BOTTOM_CENTER} autoClose={4000} />
  </React.StrictMode>
);

reportWebVitals();
