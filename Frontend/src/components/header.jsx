import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import sidebar_icon from "../assets/svgs/sidebar_icon.svg";
import newChat_icon from "../assets/svgs/newChat_icon.svg";
import google_icon from "../assets/svgs/google_icon.svg";
import { autoGoogleLogin, googleLogin } from "../services/backendRequests";

const Header = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        picture: "",
        isAvailable: false,
    });

    useEffect(() => {
        autoLogin();
    }, []);

    const handleNewChat = () => {
        console.log("New chat created");
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async ({ code }) => {
            const userInfo = await googleLogin(code);
            setUserData({
                name: userInfo?.name,
                email: userInfo?.email,
                picture: userInfo?.picture,
                isAvailable: true,
            });
            sessionStorage.setItem("userID", userInfo.id);
        },
        flow: "auth-code",
    });

    const autoLogin = async () => {
        const id = sessionStorage.getItem("userID");
        if (id) {
            const userInfo = await autoGoogleLogin(id);
            setUserData({
                name: userInfo?.name,
                email: userInfo?.email,
                picture: userInfo?.picture,
                isAvailable: true,
            });

            sessionStorage.setItem("userID", userInfo.id);
        } else {
            handleGoogleLogin();
        }
    };

    const handleLogout = () => {
        setUserData({
            name: "",
            email: "",
            picture: "",
            isAvailable: false,
        });
        sessionStorage.removeItem("userID");
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
            <div className="login  flex justify-center items-center mx-10">
                <div className="google-login">
                    {userData.isAvailable ? (
                        <div className="flex gap-1 justify-center items-center">
                            {userData.picture &&
                            userData.picture.trim() !== "" ? (
                                <img
                                    src={userData.picture}
                                    alt="Pic"
                                    className="w-[24px] h-[24px] rounded-full"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = google_icon;
                                    }}
                                />
                            ) : (
                                <div className="flex justify-center items-center w-[24px] h-[24px] rounded-full bg-white">
                                    <img
                                        src={google_icon}
                                        alt="Pic"
                                        className="w-[24px] h-[24px]"
                                    />
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer"
                            >
                                {userData.name}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                className="cursor-pointer flex h-full min-w-8 items-center gap-1 justify-center px-3 py-1 rounded-full border border-bg-tertiary hover:bg-bg-tertiary transition-all duration-200 text-white font-semibold"
                                title="Log in with Google"
                            >
                                Log in
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
