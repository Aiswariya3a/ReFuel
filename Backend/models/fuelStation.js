import mongoose from "mongoose";
import fetch from "node-fetch";

const fuelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
    },
    phone: {
        type: Number,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    quantity: {
        petrol: {
            price: { type: Number },
            quantity: { type: Number }
        },
        diesel: {
            price: { type: Number },
            quantity: { type: Number }
        }
    }
});

// Middleware to fetch address before saving
fuelSchema.pre('save', async function (next) {
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

export default mongoose.model("Station", fuelSchema);
