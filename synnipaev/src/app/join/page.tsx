"use client";

import Button from "@/components/button";

const handleButtonClick = () => {
    console.log("Button clicked!");
}

export default function Join() {
    return(
        <div style={{padding: "20px"}}>
            <Button type="tertiary" ><h1 className="button-text">Lorem Ipsum</h1></Button>
        </div>
    );
}