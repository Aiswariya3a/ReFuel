import LoginLight from "../../../assets/images/loginLight.jpg";
import { useEffect, useState } from "react";
import AuthService from "../../../services/auth.service";
import { useNavigate } from "react-router-dom";
import ListOrderHistory from "./ListOrderHistory";

function OrderHistory() {
  const [orders, setOrders] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState(null);
  const [showPending, setShowPending] = useState(true);
  const [showDelivered, setShowDelivered] = useState(true);
  const [showCanceled, setShowCanceled] = useState(true);
  const [showAccepted, setShowAccepted] = useState(true);
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const getOrders = async () => {
    try {
      const response = await AuthService.getUserOrders(user.userId);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (orders) {
      filterOrders();
    }
  }, [orders, showPending, showDelivered, showCanceled, showAccepted]);

  const filterOrders = () => {
    const filtered = orders.filter(order => {
      const { isAccepted, isDelivered, isCanceled } = order;
      if (showPending && !isAccepted.status && !isDelivered.status && !isCanceled.status) {
        return true;
      }
      if (showAccepted && isAccepted.status) {
        return true;
      }
      if (showDelivered && isDelivered.status) {
        return true;
      }
      if (showCanceled && isCanceled.status) {
        return true;
      }
      return false;
    });
    setFilteredOrders(filtered);
  };

  const renderedOrders = filteredOrders
    ? filteredOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((element) => (
          <ListOrderHistory key={element._id} order={element} setLoading={setLoading} />
        ))
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="bg-cover bg-center text-white py-10"
        style={{ backgroundImage: `linear-gradient(45deg,rgba(0,0,0, 0.75),rgba(0,0,0, 0.75)),url(${LoginLight})` }}
      >
        <h1 className="text-center text-4xl font-semibold">Past Orders</h1>
        <div className="flex justify-center space-x-4 mt-4">
        <Checkbox label="Accepted" checked={showAccepted} onChange={() => setShowAccepted(!showAccepted)} />
          <Checkbox label="Pending" checked={showPending} onChange={() => setShowPending(!showPending)} />
          <Checkbox label="Delivered" checked={showDelivered} onChange={() => setShowDelivered(!showDelivered)} />
          <Checkbox label="Canceled" checked={showCanceled} onChange={() => setShowCanceled(!showCanceled)} />
        </div>
      </div>
      <div className="container mx-auto py-8 px-4">
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : renderedOrders ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderedOrders}
          </div>
        ) : (
          <div className="text-center text-black text-[34px]">No orders found.</div>
        )}
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center text-lg">
      <input type="checkbox" checked={checked} onChange={onChange} className="mr-2" />
      {label}
    </label>
  );
}

export default OrderHistory;
