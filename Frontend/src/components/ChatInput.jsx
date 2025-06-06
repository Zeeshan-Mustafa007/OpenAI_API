import React, { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import submit_icon from "../assets/svgs/submit_icon.svg";

const ChatInput = ({
    text,
    setText,
    image,
    setImage,
    file,
    setFile,
    onSubmit,
    webSearch,
    setWebSearch,
    loading,
}) => {
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const handleFileRemove = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input value
        }
    };

    const handleImageRemove = () => {
        setImage(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = ""; // Clear the image input value
        }
    };

    const handleFileChange = (e) => {
        console.log("File Uploaded");
        setFile(e.target.files[0]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the input value after setting the file
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        if (imageInputRef.current) {
            imageInputRef.current.value = ""; // Reset the input value after setting the image
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="ChatInput max-w-[90%]  md:max-w-[70%] lg:max-w-[57%]  w-full bg-bg-secondary border border-bg-tertiary py-2 mb-8 rounded-3xl"
        >
            <div className="flex flex-col rounded-3xl">
                {/* Displaying the input file and image names */}
                {(image || file) && (
                    <div className="flex items-center gap-1 px-4 py-2">
                        <div>
                            {file && (
                                <div className="flex items-center justify-between gap-1 px-4 py-2 text-text-secondary bg-bg-tertiary rounded-3xl">
                                    <span className="text-sm font-semibold">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleFileRemove}
                                        className="text-text-tertiary hover:text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            width="20"
                                            height="20"
                                        >
                                            <path d="M12 10.586l4.95-4.95a1 1 0 011.415 1.415L13.414 12l4.95 4.95a1 1 0 01-1.415 1.415L12 13.414l-4.95 4.95a1 1 0 01-1.415-1.415L10.586 12l-4.95-4.95a1 1 0 011.415-1.415L12 10.586z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            {image && (
                                <div className="flex items-center justify-between gap-1 px-4 py-2 text-text-secondary bg-bg-tertiary rounded-3xl">
                                    <span className="text-sm font-semibold">
                                        {image.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="text-text-tertiary hover:text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            width="20"
                                            height="20"
                                        >
                                            <path d="M12 10.586l4.95-4.95a1 1 0 011.415 1.415L13.414 12l4.95 4.95a1 1 0 01-1.415 1.415L12 13.414l-4.95 4.95a1 1 0 01-1.415-1.415L10.586 12l-4.95-4.95a1 1 0 011.415-1.415L12 10.586z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Textarea for user input */}
                <div>
                    <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={
                            webSearch ? "Search the web" : "Ask anything"
                        }
                        className="w-full flex-grow resize-none text-text-secondary rounded-xl px-4 py-2 focus:outline-none placeholder-text-tertiary"
                    />
                </div>

                <div className="flex items-center justify-between px-4">
                    {/* Upload Buttons */}
                    <div className="flex justify-center gap-2">
                        <div className="flex items-center relative group">
                            <label
                                className={`flex items-center text-gray-400 hover:text-white  ${
                                    webSearch
                                        ? "opacity-50 cursor-not-allowed "
                                        : "cursor-pointer"
                                } `}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="20"
                                    height="20"
                                >
                                    <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" />
                                    <path d="M20 5h-3.17l-1.41-1.41A2 2 0 0013.83 3h-3.66a2 2 0 00-1.59.59L7.17 5H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2zm0 12H4V7h3.17l1.41-1.41c.18-.18.43-.29.68-.29h3.66c.25 0 .5.11.68.29L16.83 7H20v10z" />
                                </svg>
                                <input
                                    disabled={webSearch}
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            {webSearch ? (
                                <div className="absolute w-fit text-nowrap bottom-[-40px] left-[50px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Disabled in Search mode
                                </div>
                            ) : (
                                <div className="absolute w-fit text-nowrap bottom-[-40px] left-[15px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Add photos
                                </div>
                            )}
                        </div>
                        <div className="flex items-center relative group">
                            <label
                                className={`flex items-center text-text-tertiary hover:text-white  ${
                                    webSearch
                                        ? "opacity-50 cursor-not-allowed "
                                        : "cursor-pointer"
                                } `}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="20"
                                    height="20"
                                >
                                    <path d="M16.5 6.5v9a4.5 4.5 0 01-9 0v-9a3 3 0 016 0v8.25a1.75 1.75 0 01-3.5 0v-8h-1.5v8a3.25 3.25 0 006.5 0V6.5a4.5 4.5 0 00-9 0v9a6 6 0 0012 0v-9h-1.5z" />
                                </svg>
                                <input
                                    disabled={webSearch}
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {webSearch ? (
                                <div className="absolute w-fit text-nowrap bottom-[-40px] left-[50px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Disabled in Search mode
                                </div>
                            ) : (
                                <div className="absolute w-fit text-nowrap bottom-[-40px] left-[15px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Add files
                                </div>
                            )}
                        </div>
                        <div className="flex items-center relative group">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setWebSearch(!webSearch);
                                }}
                                disabled={loading || image || file}
                                type="button"
                                className={`flex h-full min-w-8 items-center gap-1 justify-center px-2 py-1 rounded-full border ${
                                    webSearch === true
                                        ? "border-white text-white"
                                        : "text-text-tertiary border-bg-tertiary"
                                } ${
                                    image || file
                                        ? "opacity-50 cursor-not-allowed "
                                        : "cursor-pointer"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9851 4.00291C11.9933 4.00046 11.9982 4.00006 11.9996 4C12.001 4.00006 12.0067 4.00046 12.0149 4.00291C12.0256 4.00615 12.047 4.01416 12.079 4.03356C12.2092 4.11248 12.4258 4.32444 12.675 4.77696C12.9161 5.21453 13.1479 5.8046 13.3486 6.53263C13.6852 7.75315 13.9156 9.29169 13.981 11H10.019C10.0844 9.29169 10.3148 7.75315 10.6514 6.53263C10.8521 5.8046 11.0839 5.21453 11.325 4.77696C11.5742 4.32444 11.7908 4.11248 11.921 4.03356C11.953 4.01416 11.9744 4.00615 11.9851 4.00291ZM8.01766 11C8.08396 9.13314 8.33431 7.41167 8.72334 6.00094C8.87366 5.45584 9.04762 4.94639 9.24523 4.48694C6.48462 5.49946 4.43722 7.9901 4.06189 11H8.01766ZM4.06189 13H8.01766C8.09487 15.1737 8.42177 17.1555 8.93 18.6802C9.02641 18.9694 9.13134 19.2483 9.24522 19.5131C6.48461 18.5005 4.43722 16.0099 4.06189 13ZM10.019 13H13.981C13.9045 14.9972 13.6027 16.7574 13.1726 18.0477C12.9206 18.8038 12.6425 19.3436 12.3823 19.6737C12.2545 19.8359 12.1506 19.9225 12.0814 19.9649C12.0485 19.9852 12.0264 19.9935 12.0153 19.9969C12.0049 20.0001 11.9999 20 11.9999 20C11.9999 20 11.9948 20 11.9847 19.9969C11.9736 19.9935 11.9515 19.9852 11.9186 19.9649C11.8494 19.9225 11.7455 19.8359 11.6177 19.6737C11.3575 19.3436 11.0794 18.8038 10.8274 18.0477C10.3973 16.7574 10.0955 14.9972 10.019 13ZM15.9823 13C15.9051 15.1737 15.5782 17.1555 15.07 18.6802C14.9736 18.9694 14.8687 19.2483 14.7548 19.5131C17.5154 18.5005 19.5628 16.0099 19.9381 13H15.9823ZM19.9381 11C19.5628 7.99009 17.5154 5.49946 14.7548 4.48694C14.9524 4.94639 15.1263 5.45584 15.2767 6.00094C15.6657 7.41167 15.916 9.13314 15.9823 11H19.9381Z"
                                    ></path>
                                </svg>
                                <span className="">Search</span>
                            </button>
                            {image || file ? (
                                <div className="absolute w-fit text-nowrap bottom-[-40px] left-[50px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Search disabled for attachments
                                </div>
                            ) : (
                                <div className="absolute w-fit text-nowrap bottom-[-40px] left-[50px] transform -translate-x-1/2 mb-2 hidden group-hover:block group-hover:!opacity-100 bg-black text-white text-[12px] px-2 py-1 rounded">
                                    Search the web
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Send Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || (!text && !image && !file)}
                            className="bg-white hover:opacity-75 px-2 py-2 rounded-full disabled:opacity-50 cursor-pointer"
                        >
                            <img
                                src={submit_icon}
                                alt="Submit"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ChatInput;
