import React, { useEffect, useState } from 'react';

const Loading = () => {
    // State to track when the component has loaded
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Set the isLoaded state to true after the component has mounted
        setIsLoaded(true);
    }, []);

    return (
        <div
            className={`flex justify-center items-center w-32 h-32 ${isLoaded ? 'animate-rotate' : ''}`}
        >
            <svg
                aria-label="Laeb..."
                width="170"
                height="170"
                viewBox="0 0 170 170"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M35 35V135H135V35H35ZM48 56.9999L87.0293 79.5332V86.4668L48 109V93.3984L66.0137 83L48 72.5996V56.9999ZM87.0293 109H122V122H87.0293V109Z"
                    fill="#EEEEEE"
                />
            </svg>
        </div>
    );
};

export default Loading;