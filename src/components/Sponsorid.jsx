import Nortal from "./images/sponsorid/nortal_logo_positive.png";
import NetGroup from "./images/sponsorid/NetGroup_Logo.png";

const Sponsorid = () => {
  return (
    <div className="sponsorid m-2" id="sponsorid">
     
        <h2>Koostööpartnerid</h2>
        <span className="line"></span>
        <div className="container">
     
  
<div class="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
  <div class="-m-1 flex flex-wrap md:-m-2 place-items-center ">
    
    
    <div class="flex w-1/2 flex-wrap object-center ">
      <div class="w-full p-1 md:p-2 transform transition duration-500 hover:scale-105">
        <a href="https://nortal.com/">
        <img
          alt="gallery"
          class=" object-cover object-center"
          src={Nortal} />
          </a>
      </div>
    </div>

    <div class="flex w-1/2 flex-wrap">
      <div class="w-full p-1 md:p-2 transform transition duration-500 hover:scale-105">
      <a href="https://netgroup.com/">
        <img
          alt="gallery"
          class="block h-full w-full  object-cover object-center"
          src={NetGroup} />
        </a>
      </div>
</div>
</div>
</div>
</div>
</div>
  );
};

export default Sponsorid;
