import React from "react";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string; // Allow className prop
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClick,
  className = "",
}) => {
  return (
    <button
      aria-label="Hamburger Menu"
      className={`w-[32px] h-[32px] flex flex-col justify-between items-center relative ${className}`} // Add className here
      onClick={onClick}
    >
      {/* Top bar */}
      <div
        className={[
          "w-[32px] h-[4px] bg-light transition-all duration-150 ease-in-out",
          isOpen ? "rotate-45 translate-y-[14px] w-[40px]" : "",
        ].join(" ")}
      ></div>
      {/* Middle bar */}
      <div
        className={[
          "w-[32px] h-[4px] bg-light transition-all duration-150 ease-in-out",
          isOpen ? "opacity-0" : "",
        ].join(" ")}
      ></div>
      {/* Bottom bar */}
      <div
        className={[
          "w-[32px] h-[4px] bg-light transition-all duration-150 ease-in-out",
          isOpen ? "-rotate-45 -translate-y-[14px] w-[40px]" : "",
        ].join(" ")}
      ></div>
    </button>
  );
};

export default HamburgerMenu;
