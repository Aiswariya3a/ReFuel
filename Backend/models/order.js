import mongoose from "mongoose";
import fetch from "node-fetch";

const orderSchema = mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  },
  fuel: {
    petrol: {
      price: { type: Number },
      quantity: { type: Number },
    },
    diesel: {
      price: { type: Number },
      quantity: { type: Number },
    },
  },
  method: {
    cash: { type: Number },
    online: {
      transactionID: { type: String },
      status: { type: String },
      amount: { type: Number },
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there is a User model
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station", // Assuming there is a Station model
  },
  isCanceled: {
    status: { type: Boolean },
  },
  isAccepted: {
    status: { type: Boolean },
  },
  isDelivered: {
    status: { type: Boolean },
    message: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre('save', async function (next) {
  if (this.isModified('location')) {
      const { lat, lng } = this.location;
      const address = await fetchAddress(lat, lng);
      this.location.address = address;
  }
  next();
});

const fetchAddress = async (lat, lng) => {
  try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name;
  } catch (error) {
      console.error("Error fetching address: ", error);
      return null;
  }
};

export default mongoose.model("Orders", orderSchema);
