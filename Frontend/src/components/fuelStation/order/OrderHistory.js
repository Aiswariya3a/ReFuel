import LoginLight from "../../../assets/images/loginLight.jpg";
import { useEffect, useState } from "react";
import SimpleMap from "../../map/Simple";
import AuthService from "../../../services/auth.service";
import { getDistance } from "geolib";
import { useNavigate } from "react-router-dom";
import ListStation from "../../user/order/ListStation";
import ListOrderHistory from "./ListOrderHistory";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "react-toastify";
function OrderHistory(){
    const [orders,setOrders] = useState(null);
    const navigate = useNavigate();
    const fuelStation = AuthService.getCurrentFuelStation();
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
      if(!fuelStation){
          navigate('/home')
      }
      console.log("FuelStation",fuelStation.stationId)
    },[fuelStation])
    
    const getOrders = async () =>{
        try {
          await AuthService.getOrders(fuelStation.stationId).then(
            (response) => {
                console.log(response)
                setOrders(response.data)
            },
            (error) => {
              console.log(error.response.data.message);
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    useEffect(()=>{
        getOrders()
        setLoading(false);
    },[loading])
    
    const renderedOrders = (orders)?orders.filter((element)=>{
      const {isAccepted,isCanceled,isDelivered} = element;
      console.log(element)
      if(isCanceled.status && isAccepted.status){
        return null;
      }
      return element
    }).map((element)=>{
      const {isAccepted,isCanceled,isDelivered} = element;
      return(
          <ListOrderHistory order={element} setLoading={setLoading}/>
      )
  }):null


    return(
      <div className="flex flex-col min-h-screen">
      <div
        className="bg-cover bg-center text-white py-10"
        style={{ backgroundImage: `linear-gradient(45deg,rgba(0,0,0, 0.75),rgba(0,0,0, 0.75)),url(${LoginLight})` }}
      >
        <div className="text-white p-3 text-center text-[54px] flex flex-row justify-center items-center gap-3  whitespace-break-spaces font-sans  lg:text-[96px] md:text-[74px] ">
          <AiOutlineShoppingCart className="text-white"/>
        <h1 className="text-center text-4xl font-semibold">Past Orders</h1>
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
    )
}
export default OrderHistory;