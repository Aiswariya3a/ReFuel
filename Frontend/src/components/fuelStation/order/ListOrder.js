import { useEffect, useState } from "react";
import SimpleMap from "../../map/Simple";
import { getDistance } from "geolib";
import { Navigate, useNavigate } from "react-router-dom";
import authService from "../../../services/auth.service";
import OrderPreview from "../../modal/OrderPreview";
import { toast } from "react-toastify";

function ListOrder({ order, setLoading }) {
  const { location, fuel, isAccepted, isCanceled, isDelivered, method, userId, _id, createdAt } = order;
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
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
  };

  const cancelOrder = async () => {
    try {
      await authService.cancelOrder(_id).then(
        (response) => {
          toast.error(response.data.message);
          setLoading(true);
        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deliveryOrder = async () => {
    try {
      await authService.deliveryOrder(_id).then(
        (response) => {
          toast.success(response.data.message);
          setLoading(true);
        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const acceptOrder = async () => {
    try {
      await authService.acceptOrder(_id).then(
        (response) => {
          toast.info(response.data.message);
          setLoading(true);
        },
        (error) => {
          console.log(error.response);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const renderedUserInfo = userInfo ? (
    <>
      <p className="text-grey-dark font-thin text-sm leading-normal text-white">
      <b> Name: </b>{userInfo.name}
      </p>
      <p className="text-grey-dark font-thin text-sm leading-normal text-white">
      <b>Mobile No: </b>{userInfo.phone}
      </p>
      <p className="text-grey-dark font-thin text-sm leading-normal text-white">
        <b>Delivery Address: </b> {location.address}
      </p>
      
      <p className="text-grey-dark font-thin text-sm leading-normal text-white">
    <b>Ordered Date :</b> {new Date(createdAt).toLocaleDateString()}
    <br /> 
    <b>Ordered Time :</b> {new Date(createdAt).toLocaleTimeString()}
  </p>
    </>
  ) : null;

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
      <div className="text-sm font-semibold">
        <p className={`${isAccepted.status && !isDelivered.status ? " text-[#32CD32] font-bold" : "hidden"}`}>
          Status: On The Way
        </p>
        <p className={`${isCanceled.status ? " text-red-900 font-bold" : "hidden"}`}>
          Status: Canceled
        </p>
        <p className={`${isDelivered.status ? " text-[#32CD32] font-bold" : "hidden"}`}>
          Status: Delivered
        </p>
      </div>
    </>
  );

  return (
    <div className={`shadow-lg gap-3 rounded m-8 p-8 flex ${(isAccepted.status) ? " text-white" : ""} bg-gray-800`}>
      <div className="w-full lg: md: flex flex-col gap-3">
        {renderedUserInfo}
        {renderedOrderInfo}
        <button
          className={`bg-transparent border-[#fe6f2b] hover:border-transparent hover:bg-[#fe6f2b] font-bold text-white py-1 border rounded`}
          onClick={() => {
            setShowModal(true);
          }}
        >
          View
        </button>
        {showModal && (
          <OrderPreview
            order={order}
            userInfo={userInfo}
            setOnClose={setShowModal}
            setOnDelivery={() => {
              deliveryOrder();
              setShowModal(false);
            }}
            setOnCancel={() => {
              cancelOrder();
              setShowModal(false);
            }}
            setOnApply={() => {
              acceptOrder();
              setShowModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ListOrder;
