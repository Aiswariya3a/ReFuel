import { useEffect, useState } from "react";
import SimpleMap from "../../map/Simple";
import { getDistance } from "geolib";
import { Navigate, useNavigate } from "react-router-dom";
import authService from "../../../services/auth.service";
import OrderPreview from "../../modal/OrderPreview";

function ListOrderHistory({ order,setLoading }) {
  const { location, fuel, isAccepted,isCanceled,isDelivered,method,userId,_id, createdAt} = order;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    getUserInfo();
  },[])
  
  const [userInfo,setUserInfo] = useState(null);
  const getUserInfo = async () =>{
    try {
      await authService.getUserInfo(userId).then(
        (response) => {
            setUserInfo(response.data);
        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }


  const cancelOrder = async () =>{
    try {
      await authService.cancelOrder(_id).then(
        (response) => {
            alert(response.data.message)
            setLoading(true);
        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  const deliveryOrder = async () =>{
    try {
      await authService.deliveryOrder(_id).then(
        (response) => {
            alert(response.data.message)
            setLoading(true);

        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  const acceptOrder = async () =>{
    try {
      await authService.acceptOrder(_id).then(
        (response) => {
            alert(response.data.message)
            setLoading(true);
        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  const renderedUserInfo = (userInfo)?   
    <>
    <p className="text-grey-dark font-thin text-sm leading-normal text-white">
    Name : {userInfo.name}
  <br />
   Email : {userInfo.email}
  </p>
  <p className="text-grey-dark font-thin text-sm leading-normal text-white">
    <br />
    Mobile No : {userInfo.phone}
  </p>
  <p className="text-grey-dark font-thin text-sm leading-normal text-white">
        <b>Delivery Address: </b> {location.address}
      </p>
  <p className="text-grey-dark font-thin text-sm leading-normal text-white">
    <br />
    Ordered Date : {new Date(createdAt).toLocaleDateString()}
    <br /> 
    Ordered Time : {new Date(createdAt).toLocaleTimeString()}
  </p>
  <p className="text-grey-dark font-thin text-sm leading-normal text-white">
  </p>
  </>
  :null

  const renderedOrderInfo = ( 
    <>
<div className="place-self-start">
        {fuel.petrol && (
          <div className="text-sm text-white font-semibold">
            <p>Petrol:</p>
            <p className="text-sm font-thin">
              {fuel.petrol.price} ₹/L (Quantity: {fuel.petrol.quantity} L)
            </p>
          </div>
        )}
        <br />
        {fuel.diesel && (
          <div className="text-sm text-white font-semibold">
            <p>Diesel:</p>
            <p className="text-sm font-thin">
              {fuel.diesel.price} ₹/L (Quantity: {fuel.diesel.quantity} L)
            </p>
          </div>
        )}
 <div className="text-sm text-white font-semibold">
            <b className="font-bold">Cost:&nbsp;  </b> <span className="text-[18px]">₹ {method.cash ? method.cash : method.online.amount}</span>
        </div>
</div>
<p className={` ${(!isAccepted.status && !isDelivered.status && !isCanceled.status)? " text-yellow-500 font-bold ": "hidden" }`}>
                      Status : Pending
                  </p>
<p className={` ${(isAccepted.status && !isDelivered.status)? " text-[#32CD32] font-bold ": "hidden" }`}>
                      Status : On The Way
                  </p>
                  <p className={` ${(isCanceled.status)? " text-red-900 font-bold ": "hidden" }`}>
                      Status : Canceled
                  </p>
                  <p className={` ${(isDelivered.status)? " text-[#32CD32] font-bold ": "hidden" }`}>
                      Status : Delivered
</p>
</>
  );

  return (
    <div className="shadow-lg gap-3  rounded m-8 p-8 flex bg-gray-800">
      <div className="w-full lg: md: flex flex-col gap-3 ">
        <h3 className="text-orange text-xl font-semibold text-white">{""}</h3>
       {renderedUserInfo}
       {renderedOrderInfo}
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
            <OrderPreview order={order} disable={true} userInfo={userInfo} setOnClose={setShowModal} setOnDelivery={()=>{
                deliveryOrder()
                setShowModal(false)
            }}  
            setOnCancel={()=>{
                cancelOrder()
                setShowModal(false)
            }} 
            setOnApply={
              ()=>{
                acceptOrder()
                setShowModal(false)
              }
            }/>
            :null
        }
      </div>
    </div>
  );
}
export default ListOrderHistory;
