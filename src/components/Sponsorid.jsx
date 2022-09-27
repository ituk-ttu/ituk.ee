import Nortal from "./images/sponsorid/nortal_logo_positive.png";
import NetGroup from "./images/sponsorid/NetGroup_Logo.png";

const Sponsorid = () => {
  return (
    <div className="sponsorid pb-20" id="sponsorid">
      <div className="container">
        <h2>Sponsorid</h2>
        <span className="line"></span>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-3  self-center ">
          <div class="col-span-1 justify-center p-6">
            <a href="https://nortal.com/">
              <img src={Nortal} alt="" />
            </a>
          </div>
          <div class="col-span-1 justify-center">
            <a href="https://netgroup.com/">
              <img src={NetGroup} alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsorid;
