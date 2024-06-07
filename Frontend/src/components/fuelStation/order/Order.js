import LoginLight from "../../../assets/images/loginLight.jpg";
import { useEffect, useState } from "react";
import AuthService from "../../../services/auth.service";
import { useNavigate } from "react-router-dom";
import ListOrder from "./ListOrder";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { toast } from "react-toastify";

function Order() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  const fuelStation = AuthService.getCurrentFuelStation();
  const [loading, setLoading] = useState(true);
  const [countOnWayOrders, setCountOnWayOrders] = useState(0);
  const [showPending, setShowPending] = useState(true);
  const [showAccepted, setShowAccepted] = useState(true);

  useEffect(() => {
    if (!fuelStation) {
      navigate('/home');
    }
    console.log("FuelStation", fuelStation.stationId);
  }, [fuelStation, navigate]);

  const getOrders = async () => {
    try {
      await AuthService.getOrders(fuelStation.stationId).then(
        (response) => {
          console.log(response);
          setOrders(response.data);
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
    setCountOnWayOrders(0);
  }, []);

  useEffect(() => {
    getOrders();
    setLoading(false);
  }, [loading]);

  const incrementCount = () => {
    setCountOnWayOrders(countOnWayOrders + 1);
  };

  const filteredOrders = orders
    ? orders.filter((order) => {
        const { isAccepted, isCanceled, isDelivered } = order;
        if (isCanceled.status || isDelivered.status) {
          return false;
        }
        if (showPending && !isAccepted.status) {
          return true;
        }
        if (showAccepted && isAccepted.status) {
          return true;
        }
        return false;
      })
    : [];

  const renderedOrders = filteredOrders.map((order) => (
    <ListOrder key={order.id} order={order} setLoading={setLoading} />
  ));

  const renderedIcon = countOnWayOrders ? (
    <TbTruckDelivery className="" />
  ) : (
    <AiOutlineShoppingCart className="text-white" />
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="bg-cover bg-center text-white py-10"
        style={{
          backgroundImage: `linear-gradient(45deg,rgba(0,0,0, 0.75),rgba(0,0,0, 0.75)),url(${LoginLight})`,
        }}
      >
        <h1 className="text-center text-4xl font-semibold">User Orders</h1>
      </div>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center mb-4">
          <label className="mx-2">
            <input
              type="checkbox"
              checked={showPending}
              onChange={(e) => setShowPending(e.target.checked)}
            />
            <span className="ml-2">Show Pending Orders</span>
          </label>
          <label className="mx-2">
            <input
              type="checkbox"
              checked={showAccepted}
              onChange={(e) => setShowAccepted(e.target.checked)}
            />
            <span className="ml-2">Show Accepted Orders</span>
          </label>
        </div>
        {loading ? (
          <div className="text-center text-black">Loading...</div>
        ) : renderedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderedOrders}
          </div>
        ) : (
          <div className="text-center text-black">No Orders found.</div>
        )}
      </div>
    </div>
  );
}

export default Order;
