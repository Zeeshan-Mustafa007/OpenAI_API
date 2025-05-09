import React from "react";
import sidebar_icon from "../assets/svgs/sidebar_icon.svg";
import newChat_icon from "../assets/svgs/newChat_icon.svg";

const Header = () => {
    const handleNewChat = () => {
        
        console.log("New chat created");
    };
    return (
        <div className="Header text-white flex sticky top-0 z-20 font-semibold">
            <div className="flex mx-3 my-2">
                <button type="button" className="Sidebar_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg">
                    <img
                        src={sidebar_icon}
                        alt="Sidebar Icon"
                        className="w-[24px] h-[24px]"
                    />
                    <div className="absolute w-fit text-nowrap bottom-[-40px] left-[50px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                        Open Sidebar
                    </div>
                </button>
                <button onClick={handleNewChat} type="button" className="NewChat_Icon relative group hover:cursor-pointer hover:bg-bg-tertiary p-2 rounded-lg">
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
        </div>
    );
};

export default Header;
