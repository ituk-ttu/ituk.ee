import Nortal from "./images/sponsorid/nortal_logo_positive.png";
import NetGroup from "./images/sponsorid/NetGroup_Logo.png";

const Sponsorid = () => {
  return (
    <div className="sponsorid" id="sponsorid">
      <div className="container">
        <h2>Sponsorid</h2>
        <span className="line"></span>
        <div class="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2  ">
          <div class="col-span-1  justif-center p-6">
            <img src={Nortal} alt="" />
          </div>
          <div class="col-span-1  justif-center p-6">
            <img src={NetGroup} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsorid;
