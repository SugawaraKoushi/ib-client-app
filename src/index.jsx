import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import axios from "axios";
import Root from "./components/Root";
import "./index.css";
import Lab1 from "./components/Lab1";
import Lab2 from "./components/Lab2";
import Lab3 from "./components/Lab3";
import Lab4 from "./components/Lab4";
import Lab5 from "./components/Lab5";


axios.defaults.baseURL = "http://localhost:8080/api";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { path: "/lab1", element: <Lab1 /> },
            { path: "/lab2", element: <Lab2 /> },
            { path: "/lab3", element: <Lab3 /> },
            { path: "/lab4", element: <Lab4 /> },
            { path: "/lab5", element: <Lab5 /> },
        ],
    },
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
