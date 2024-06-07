// Define the latitude and longitude coordinates
const latitude = 11.29153871258358; // Example latitude
const longitude = 77.07513426896186; // Example longitude

// Construct the URL for the reverse geocoding API
const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

// Make a GET request to the API endpoint
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Extract the address components from the response
    const address = data.display_name;
    console.log("Address:", address);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
