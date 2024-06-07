import React, { useEffect, useState } from "react";
import ListStation from "./ListStation";
import LoginLight from "../../../assets/images/loginLight.jpg";
import AuthService from "../../../services/auth.service";
import { getDistance } from "geolib";

function Order() {
  const [pointer, setPointer] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const user = AuthService.getCurrentUser();
  const [error, setError] = useState(null);
  const [searchDistance, setSearchDistance] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const [currentAddress, setCurrentAddress] = useState("");

  const getResponse = async () => {
    try {
      const response = await AuthService.getFuelStation();
      setStations(response.data.stations);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
    try {
      await AuthService.getUserInfo(user.userId).then(
        (response) => {
          setName(response.data.name);
        },
        (error) => {
          console.error(error.response.data.message);
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPointer({ lat: latitude, lng: longitude });
          fetchAddress(latitude, longitude); // Pass coordinates directly
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pointer) {
      getResponse();
    }
  }, [pointer]);

  useEffect(() => {
    let filtered = stations;

    if (searchDistance && pointer) {
      filtered = filtered.filter((station) => {
        const distance = getDistance(
          { latitude: station.location.lat, longitude: station.location.lng },
          { latitude: pointer.lat, longitude: pointer.lng }
        ) / 1000;
        return distance <= searchDistance;
      });
    }

    if (searchName) {
      filtered = filtered.filter((station) =>
        station.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredStations(filtered);
  }, [searchDistance, searchName, pointer, stations]);

  const handleSearchDistanceChange = (e) => {
    setSearchDistance(e.target.value);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      setCurrentAddress(data.display_name);
    } catch (error) {
      console.log("Error fetching address: ", error);
    }
  };

  const renderedStations = filteredStations.map((station) => {
    const distance =
      pointer &&
      getDistance(
        { latitude: station.location.lat, longitude: station.location.lng },
        { latitude: pointer.lat, longitude: pointer.lng }
      ) / 1000;
    return <ListStation key={station.id} station={{ ...station, distance }} />;
  });

  return (
    <div className="flex flex-col min-h-screen">
  <div
    className="bg-cover bg-center text-white py-10"
    style={{ backgroundImage: `linear-gradient(45deg,rgba(0,0,0, 0.75),rgba(0,0,0, 0.75)),url(${LoginLight})` }}
  >
    <h1 className="text-center text-4xl font-semibold">Orders</h1>
    <br />
    <div className="text-black flex justify-center space-x-4 mt-4">
      <input
        type="text"
        placeholder="Station Name"
        value={searchName}
        onChange={handleSearchNameChange}
        className="p-2 rounded"
      />
      <input
        type="number"
        placeholder="Distance (km)"
        value={searchDistance}
        onChange={handleSearchDistanceChange}
        className="p-2 rounded"
      />
      <button
        onClick={() => setFilteredStations(filteredStations)}
        className="p-2 bg-orange-500 text-white rounded"
      >
        Search
      </button>
    </div>
  </div>

  <div className="container mx-auto py-8 px-4">
    {loading ? (
      <div className="text-center text-black text-lg font-medium">Loading...</div>
    ) : (
      <>
        <div className="text-center text-black text-lg mb-4">
          {"Hey, " + name.split(" ")[0]}, you are currently located at {currentAddress || "Fetching address..."}
        </div>
        {renderedStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderedStations}
          </div>
        ) : (
          <div className="text-center text-black text-lg">No stations found.</div>
        )}
      </>
    )}
  </div>
</div>

  );
}

export default Order;
