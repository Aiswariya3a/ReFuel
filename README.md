# ReFuel: Fuel Station Delivery App (MERN Stack)
The ReFuel app is a comprehensive application developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It is designed to simplify and optimize the process of fuel delivery for fuel station owners and customers.

## Features
- **User Registration and Authentication**: Users can create accounts, log in securely, and manage their profile information.
- **Fuel Station Management**: Fuel station owners can register their stations, update fuel availability, pricing, and manage delivery schedules.
- **Fuel Ordering**: Customers can browse registered fuel stations, view fuel availability, pricing, and place orders for fuel delivery.
- **Secure Payment Integration**: Integration with secure payment gateways enables customers to make online payments for their fuel orders.
- **Real-time Order Tracking**: Customers can track the status of their fuel orders in real-time, from confirmation to dispatch and delivery.

## Prerequisites
- Node.js and npm installed on the local machine.
- MongoDB database set up and running.

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ReFuel.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ReFuel/Fuel-station-main
   ```
3. Install dependencies for the backend:
   ```bash
   cd Backend
   npm install
   ```
4. Set up environment variables for the backend:
   - Create a `.env` file in the `Backend` directory.
   - Add the necessary environment variables, such as database connection details and secret keys. Refer to `.env.example` for the required variables.

5. Start the backend server:
   ```bash
   npm run start
   ```
6. Open a new terminal and navigate to the project directory:
   ```bash
   cd ../Frontend
   ```
7. Install dependencies for the frontend:
   ```bash
   npm install
   ```

8. Start the frontend:
   ```bash
   npm start
   ```
10. Open your web browser and access the application at [http://localhost:3000](http://localhost:3000).

## License
This project is licensed under the MIT License. By contributing to this project, you agree to license your contributions under the same license.
