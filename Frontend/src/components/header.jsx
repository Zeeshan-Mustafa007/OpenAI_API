import React from "react";

const Header = () => {
    return (
        <div className="header draggable no-draggable-children sticky top-0 p-3 flex items-center justify-between z-20 h-header-height font-semibold bg-token-main-surface-primary pointer-events-none [view-transition-name:var(--vt-page-header)] select-none *:pointer-events-auto motion-safe:transition max-md:hidden @[84rem]/thread:absolute @[84rem]/thread:start-0 @[84rem]/thread:end-0 @[84rem]/thread:bg-transparent @[84rem]/thread:shadow-none! [box-shadow:var(--sharp-edge-top-shadow)]">
            Header
        </div>
    );
};

export default Header;
