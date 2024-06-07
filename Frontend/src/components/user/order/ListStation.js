import {useEffect, useState } from "react";
// import SimpleMap from "../../map/Simple";
import PreviewModal from "../../modal/PreviewModal";
// import { getDistance } from "geolib";
import { Navigate, useNavigate } from "react-router-dom";

function ListStation({ station }) {
  const { location, name, quantity,distance } = station;
  const [showModal, setShowModal] = useState(false);
  const [Address, setAddress] = useState("");
  const navigate = useNavigate();

  return (
    <div className="shadow-lg rounded m-8 p-8 flex bg-gray-800">
      <div className="w-full lg:md:2/3 flex flex-col gap-3">
    <h3 className=" text-center text-2xl font-semibold text-orange-500">{name}</h3>
    <hr></hr>
    <p className="text-gray-300 font-normal text-lg leading-normal">
      <span className="text-white font-semibold">Petrol Rate: ₹ {quantity.petrol.price}<br /></span>
      <span className="text-white font-semibold">Volume:</span> {quantity.petrol.quantity} liters available
    </p>
    <p className="text-gray-300 font-normal text-lg leading-normal">
      <span className="text-white font-semibold">Diesel Rate: ₹ {quantity.diesel.price}<br /></span>
      <span className="text-white font-semibold">Volume:</span> {quantity.diesel.quantity} liters available
    </p>
    <p className="text-gray-300 font-normal text-lg leading-normal">
      <span className="text-white font-semibold">Address:</span> {location.address}
    </p>
    <p className="text-gray-300 font-normal text-lg leading-normal">
      <span className="text-white font-semibold">Distance From Your Location:</span> {distance} KM
    </p>
        <div className="card-footer bg-transparent p-4 flex items-center justify-center mt-auto">
        <button
          className="bg-transparent hover:bg-[#fe6f2b] border-[#fe6f2b] font-bold text-white py-1 border hover:border-transparent rounded w-full"
          onClick={() => setShowModal(true)}
        >
          View
        </button>
      </div>
        {
            showModal?
            <PreviewModal content={station} setOnCancel={setShowModal} setOnSubmit={
              (id)=>{
                navigate(`/user/bookOrder/${id}`)
              }
            }/>
            :null
        }
      </div>
    </div>
  );
}
export default ListStation;
