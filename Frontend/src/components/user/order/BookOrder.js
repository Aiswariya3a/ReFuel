import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../../services/auth.service";
import LoginLight from "../../../assets/images/loginLight.jpg";
import Modal from "../../modal/Modal";
import { getDistance } from "geolib";
import { BsFuelPump } from "react-icons/bs";
import BookPreview from "../../modal/BookPreview";
import { toast } from "react-toastify";

function BookOrder() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // State for user's current location
  const [petrolQuantity, setPetrolQuantity] = useState(0);
  const [petrolPrice, setPetrolPrice] = useState(0);
  const [dieselQuantity, setDieselQuantity] = useState(0);
  const [dieselPrice, setDieselPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionData, setTransactionData] = useState(null);
  const [method, setMethod] = useState();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const getResponse = async () => {
    try {
      await authService.getFuelStationByID(id).then(
        (response) => {
          console.log(response);
          setStation(response.data);
        },
        (error) => {
          console.log(error.response.data.message);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getUserResponse = async () => {
    try {
      await authService.getUserInfo(user.userId).then(
        (response) => {
          console.log(response);
          setUserInfo(response.data);
        },
        (error) => {
          console.log(error.response.data.message);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
    console.log(user);
  }, [user]);

  useEffect(() => {
    console.log(transactionData);
    if (transactionData) {
      if (transactionData.msg === "Success") {
        const updatedMethod = {
          online: {
            ...method.online,
            transactionID: transactionData.paymentId,
            status: "success",
          },
        };
        postOrder(updatedMethod);
        setMethod(updatedMethod);
      } else {
        toast.error(transactionData.msg);
      }
      setTransactionData(null);
    }
  }, [transactionData]);

  useEffect(() => {
    getResponse();
    setMethod({
      cash: totalPrice,
    });
  }, []);

  useEffect(() => {
    if (petrolQuantity !== "" && station) {
      return setPetrolPrice(petrolQuantity * station.quantity.petrol.price);
    }
    setPetrolQuantity(0);
  }, [petrolQuantity]);

  useEffect(() => {
    if (dieselQuantity !== "" && station) {
      return setDieselPrice(dieselQuantity * station.quantity.diesel.price);
    }
    setDieselQuantity(0);
  }, [dieselQuantity]);

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { latitude, longitude };
          setUserLocation(currentLocation);
          setLocation(currentLocation);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const proceedOrder = (e) => {
    e.preventDefault();
    setShowOrderModal(false);
    if (method.online) {
      authService.displayRazorpay(totalPrice, setTransactionData);
    } else {
      postOrder(method);
    }
  };

  const postOrder = async (method) => {
    const fuel = {};

    if (petrolQuantity) {
      const petrol = {
        price: petrolPrice,
        quantity: petrolQuantity,
      };
      fuel.petrol = petrol;
    }
    if (dieselPrice) {
      const diesel = {
        price: dieselPrice,
        quantity: dieselQuantity,
      };
      fuel.diesel = diesel;
    }
    try {
      await authService.postOrder(user.userId, id, location, fuel, method).then(
        (response) => {
          if (response.data.order) {
            toast.success("Order Placed Successfully");
            navigate("/user/");
            return;
          }
          toast.warning("Some Issue Detected");
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onHandleSubmit = (e) => {
    e.preventDefault();
  };

  const renderedInfo = station ? (
    <div className="text-white p-6 text-center flex flex-col items-center gap-6 whitespace-pre-wrap font-sans">
      <div className="flex flex-col items-center mb-6 animate-fadeIn">
        <div className="flex flex-row gap-3 items-center justify-center mb-4">
          <BsFuelPump className="text-[#fe6f2b] text-[54px] animate-pulse" />
          <h1 className="text-center text-[54px] font-bold">{station.name}</h1>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row items-center gap-2">
            <label className="text-[24px] font-semibold underline decoration-[#fe6f2b]">
              Petrol:
            </label>
            <p className="text-[24px] font-thin">
              {station.quantity.petrol.price} ₹/L (Total Quantity:{" "}
              {station.quantity.petrol.quantity} L)
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <label className="text-[24px] font-semibold underline decoration-[#fe6f2b]">
              Diesel:
            </label>
            <p className="text-[24px] font-thin">
              {station.quantity.diesel.price} ₹/L (Total Quantity:{" "}
              {station.quantity.diesel.quantity} L)
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 text-[18px] italic animate-fadeInSlow">
        <p>Open 24/7 for your convenience.</p>
        <p>Providing the best quality fuel at competitive prices.</p>
        <p>
          Located at the heart of the city, easily accessible from all
          directions.
        </p>
      </div>
    </div>
  ) : null;
  return (
    <div
      className="w-screen min-h-screen flex flex-col justify-around items-center lg:flex-row"
      style={{
        backgroundImage: `linear-gradient(45deg,rgba(0,0,0, 0.75),rgba(0,0,0, 0.75)),url(${LoginLight})`,
        backgroundPosition: `50% 50%`,
        backgroundSize: `cover`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-white p-6 text-center flex flex-col items-center gap-6 whitespace-break-spaces font-sans">
        {renderedInfo}
      </div>
      <div className="flex flex-col text-white justify-evenly items-center gap-5 lg:w-[30%] bg-[#282828] p-8 rounded-lg shadow-lg">
        <div className="header mb-6">
          <h1 className="text-center text-[36px] font-bold">Book Order</h1>
        </div>
        <form className="w-full" onSubmit={onHandleSubmit}>
          <div className="mb-6">
            <label
              className="block text-white font-bold mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <button
              className="w-full bg-transparent hover:bg-[#F59337] font-semibold hover:text-white py-2 px-4 border border-[#fe6f2b] hover:border-transparent text-white rounded"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(!showModal);
              }}
            >
              Show Map
            </button>
            {showModal ? (
              <Modal
                setOnCancel={() => {
                  setShowModal(false);
                }}
                setOnSubmit={(pointer) => {
                  setLocation(pointer);
                  setShowModal(false);
                }}
              />
            ) : null}
          </div>
          <div className="mb-6">
            <label className="block text-white font-bold mb-2" htmlFor="petrol">
              Petrol Quantity&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;Price
            </label>
            <div className="flex flex-row gap-4">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="petrol-quantity"
                type="number"
                onChange={(e) => {
                  if (e.target.value > station.quantity.petrol.quantity) {
                    toast.warning("Quantity Not Available");
                  } else {
                    setPetrolQuantity(e.target.value);
                  }
                }}
                value={petrolQuantity}
                placeholder="Quantity"
              />
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus
                :border-purple-500"
                id="petrol-price"
                type="number"
                readOnly
                onChange={(e) => {
                  setPetrolPrice(e.target.value);
                }}
                value={petrolPrice}
                placeholder="Price"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-white font-bold mb-2" htmlFor="diesel">
              Diesel Quantity&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;Price
            </label>
            <div className="flex flex-row gap-4">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="diesel-quantity"
                type="number"
                onChange={(e) => {
                  if (e.target.value > station.quantity.diesel.quantity) {
                    toast.warning("Quantity Not Available");
                  } else {
                    setDieselQuantity(e.target.value);
                  }
                }}
                value={dieselQuantity}
                placeholder="Quantity"
              />
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="diesel-price"
                type="number"
                readOnly
                value={dieselPrice}
                placeholder="Price"
              />
            </div>
          </div>
          <div className="actions flex flex-col gap-4">
          <button
              className="bg-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                if (!location) {
                  return toast.warning("Please Fill In address");
                }
                if (petrolQuantity || dieselQuantity) {
                  setShowOrderModal(!showOrderModal);
                } else {
                  toast.warning("Please Fill In some Quantity");
                }
              }}
            >
              Order
            </button>
            <button
              className="bg-transparent border border-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                navigate("../");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
        {showOrderModal ? (
          <BookPreview
            address={location}
            method={method}
            totalPrice={totalPrice}
            setTotalPrice={setTotalPrice}
            setMethod={setMethod}
            order={station}
            user={userInfo}
            petrolPrice={petrolPrice}
            petrolQuantity={petrolQuantity}
            dieselQuantity={dieselQuantity}
            dieselPrice={dieselPrice}
            setOnCancel={setShowOrderModal}
            setOnProceed={proceedOrder}
          />
        ) : null}
      </div>
    </div>
  );
}

export default BookOrder;
