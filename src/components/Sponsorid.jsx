import Nortal from "./images/sponsorid/nortal_logo_positive.png";
import NetGroup from "./images/sponsorid/NetGroup_Logo.png";
import McKinsey from "./images/sponsorid/McK.png";

const Sponsorid = () => {
  return (
    <div className="sponsorid m-2" id="sponsorid">
      <div className="container">
        <h2>Koostööpartnerid</h2>
        <span className="line"></span>
        <div class=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-3  self-center p-2 pt-10 pb-10">
          <div class="transform transition duration-500 hover:scale-105 col-span-1 justify-center p-6">
            <a href="https://nortal.com/">
              <img src={Nortal} alt="" />
            </a>
          </div>
          <div class="transform transition duration-500 hover:scale-105 col-span-1 justify-center ">
            <a href="https://netgroup.com/">
              <img src={NetGroup} alt="" />
            </a>
          </div>
          <div class="transform transition duration-500 hover:scale-105 col-span-1 justify-center p-6 pt-8">
            <a href="https://www.mckinsey.com/fi/overview">
              <img src={McKinsey} alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsorid;
