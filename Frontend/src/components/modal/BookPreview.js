import { useEffect, useState } from "react";
import { BsFuelPump } from "react-icons/bs";
import { getDistance } from "geolib";

function BookPreview({
  order,
  setOnCancel,
  setOnProceed,
  totalPrice,
  setTotalPrice,
  method,
  setMethod,
  petrolPrice,
  petrolQuantity,
  dieselPrice,
  dieselQuantity,
  address,
}) {
  const [currentAddress, setCurrentAddress] = useState("");
  const deliveryCharge = 30;
  const { location, name } = order;

  const distance = parseInt(
    getDistance(
      { latitude: location.lat, longitude: location.lng },
      { latitude: address.lat, longitude: address.lng }
    ) / 1000
  );

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      setCurrentAddress(data.display_name);
    } catch (error) {
      console.log("Error fetching address: ", error);
    }
  };

  const [totalDeliveryCharge, setTotalDeliveryCharge] = useState(
    distance * deliveryCharge
  );

  useEffect(() => {
    setTotalPrice(petrolPrice + dieselPrice + totalDeliveryCharge);
  }, [petrolPrice, dieselPrice, totalDeliveryCharge, setTotalPrice]);

  useEffect(() => {
    setMethod({
      cash: Math.round(totalPrice),
    });
  }, [totalPrice, setMethod]);

  useEffect(() => {
    fetchAddress(address.lat, address.lng);
  }, [address]);

  return (
    <>
      <div className="flex justify-center items-center h-full lg:my-10 md:my-10 overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full h-[100%] mx-auto max-w-3xl">
          <div className="border-0 lg:h-[90%] md:h-[100%] rounded-lg shadow-lg flex flex-col w-full bg-white outline-none overflow-scroll focus:outline-none">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 rounded-t">
              <h2 className="text-3xl font-semibold text-[#fe6f2b]">
                Bill
              </h2>
              <button
                className="text-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={() => setOnCancel(false)}
              >
                Close
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <div className="mb-4 flex items-center gap-2">
                <BsFuelPump className="text-[#fe6f2b] text-[36px]" />
                <h3 className="text-[36px] font-bold text-black">
                  {name}
                </h3>
              </div>
              <div className="border border-gray-300 p-4 rounded-md mb-4">
  <div className="flex">
    <div className="w-1/2 pr-4">
      <div className="mb-2">
        <h4 className="text-[20px] text-black font-semibold">Petrol</h4>
        <p className="text-[20px] text-black font-thin">
          Total:  ₹ {Math.round(petrolPrice)} (Quantity: {petrolQuantity} L)
        </p>
      </div>
      <div className="mb-2">
        <h4 className="text-[20px] text-black font-semibold">Diesel</h4>
        <p className="text-[20px] text-black font-thin">
          Total:  ₹ {Math.round(dieselPrice)}  (Quantity: {dieselQuantity} L)
        </p>
      </div>
      <div className="mb-2">
        
          <p className="text-[20px] text-black font-semibold">
          Delivery Charge:  ₹ {totalDeliveryCharge}
        </p>
        <p className="text-[20px] text-black font-thin">
          Total Distance: {distance} km <br /></p>
        <h4 className="text-black font-semibold">
          --&gt; Delivery Charge ({deliveryCharge} ₹/km)
        </h4>
      </div>
      <br></br>
      <div className="mb-2">
        <span className="text-[30px] text-black font-bold"> Total: ₹ {Math.round(totalPrice)}  </span>
      </div>
    </div>
    <div className="w-1/2 pl-4 border-l border-gray-300">
      <div className="mb-2">
        <h4 className="text-[20px] text-black font-semibold">From Location</h4>
        <p className="text-[20px] text-black font-thin">{location.address}</p>
      </div>
      <div className="mb-2">
        <h4 className="text-[20px] text-black font-semibold">To Location</h4>
        <p className="text-[20px] text-black font-thin">{currentAddress}</p>
      </div>
    </div>
  </div>
</div>

              <div className="mt-4">
                <h4 className="text-[24px] text-[#fe6f2b] font-bold mb-2">
                  Payment Method
                </h4>
                <div className="flex gap-4">
                <div className="flex flex-1 items-center pl-4 border rounded border-[#F59337]">
    <input
      checked={method.cash ? true : false}
      id="cash"
      type="radio"
      value="cash"
      name="method"
      onChange={(e) => {
        if (e.target.checked) {
          setMethod({
            cash: Math.round(totalPrice),
          });
        }
      }}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-[#F59337] focus:ring-blue-500"
    />
    <label
      htmlFor="cash"
      className="w-full py-2 ml-2 text-sm font-medium text-gray-900"
    >
      Cash
    </label>
  </div>

  <div className="flex flex-1 items-center pl-4 border rounded border-[#F59337]">
    <input
      id="online"
      type="radio"
      value="online"
      checked={method.online ? true : false}
      name="method"
      onChange={(e) => {
        if (e.target.checked) {
          setMethod({
            online: {
              amount: Math.round(totalPrice),
            },
          });
        }
      }}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-[#F59337] focus:ring-blue-500"
    />
    <label
      htmlFor="online"
      className="w-full py-2 ml-2 text-sm font-medium text-gray-900"
    >
      Online
    </label>
  </div>
  </div>
  
              </div>
            </div>
            <div className="flex items-center justify-center p-6 border-t border-gray-200 rounded-b">
              <button
                className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 w-full"
                type="button"
                onClick={(e) => setOnProceed(e)}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default BookPreview;
