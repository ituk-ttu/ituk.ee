import React from "react";

const FacebookLink: React.FC = () => {
  return (
    <a
      href="https://www.facebook.com/ituk.taltech/"
      target="_self"
      aria-label="ITÜK Facebook"
      className="w-12 h-12 justify-center items-center flex transform transition-transform duration-150 hover:scale-125"
    >
      <svg
        aria-label="Facebook logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        fill="#EEEEEE"
      >
        <path
          id="facebook"
          d="M24 0C10.8 0 0 10.8193 0 24.1446C0 36.1928 8.78399 46.1928 20.256 48V31.1325H14.16V24.1446H20.256V18.8193C20.256 12.7711 23.832 9.44578 29.328 9.44578C31.944 9.44578 34.68 9.90338 34.68 9.90338V15.8551H31.656C28.68 15.8551 27.744 17.7106 27.744 19.6142V24.1443H34.416L33.336 31.1322H27.744V48C33.3993 47.1031 38.5492 44.206 42.2637 39.8313C45.9782 35.4569 48.0129 29.893 47.9999 24.1446C47.9999 10.8193 37.2 0 24 0Z"
        />
      </svg>
    </a>
  );
};

export default FacebookLink;
