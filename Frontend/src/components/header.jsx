import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import sidebar_icon from "../assets/svgs/sidebar_icon.svg";
import newChat_icon from "../assets/svgs/newChat_icon.svg";
import { googleLogin } from "../services/backendRequests";

const Header = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        pic: "",
        isAvailable: false,
    });

    const handleNewChat = () => {
        console.log("New chat created");
    };
    return (
        <div className="Header text-white flex justify-between font-semibold">
            <div className="flex mx-3 my-2">
                <button
                    type="button"
                    className="Sidebar_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg"
                >
                    <img
                        src={sidebar_icon}
                        alt="Sidebar Icon"
                        className="w-[24px] h-[24px]"
                    />
                    <div className="absolute w-fit text-nowrap bottom-[-40px] left-[50px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                        Open Sidebar
                    </div>
                </button>
                <button
                    onClick={handleNewChat}
                    type="button"
                    className="NewChat_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg"
                >
                    <img
                        src={newChat_icon}
                        alt="New Chat Icon"
                        className="w-[24px] h-[24px]"
                    />
                    <div className="absolute w-fit text-nowrap bottom-[-40px] left-[15px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                        New Chat
                    </div>
                </button>
            </div>
            <div className="login  flex justify-center items-center mx-3">
                <div className="google-login">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            // console.log(credentialResponse);
                            // console.log(
                            //     jwtDecode(credentialResponse.credential)
                            // );
                            const response = await googleLogin(
                                credentialResponse
                            );
                            console.log("Back with login response.");
                            console.log(response);
                        }}
                        onError={() => {
                            console.log("Login Failed");
                        }}
                        type="icon"
                        theme="filled_black"
                        shape="circle"
                        ux_mode="popup"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
