// import React from 'react';
// import axios from 'axios';

// const Checkout = () => {

//   const handlePayment = async () =>{
//     const data = {
//       name: "John Doe",
//       mobileNumber:1234567890,
//       amount:100,
//     }
//     try {
//       const response = await axios.post('http://localhost:8000/create-order', data)
//       console.log(response.data)
//       window.location.href = response.data.url
//     } catch (error) {
//       console.log("error in payment", error)
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold mb-4">Checkout</h1>
//       <button
//       onClick={handlePayment}
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//       >
//         Pay Now
//       </button>
//     </div>
//   );
// }; 
// export default Checkout;








// import React, { useState } from 'react';
// import axios from 'axios';

// const Checkout = () => {
//   const [formData, setFormData] = useState({
//     name: 'Shuhbham Ghumare',
//     mobileNumber: '7766994855',
//     amount: '100',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handlePayment = async () => {
//     const data = {
//       name: formData.name,
//       mobileNumber: formData.mobileNumber,
//       amount: parseFloat(formData.amount),
//     };

//     try {
//       const response = await axios.post('http://localhost:8000/create-order', data);
//       console.log(response.data);
//       window.location.href = response.data.url;
//     } catch (error) {
//       console.error('Error in payment:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2" htmlFor="name">
//           Name
//         </label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Enter your name"
//           className="px-4 py-2 border rounded-lg w-64"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2" htmlFor="mobileNumber">
//           Mobile Number
//         </label>
//         <input
//           type="text"
//           id="mobileNumber"
//           name="mobileNumber"
//           value={formData.mobileNumber}
//           onChange={handleChange}
//           placeholder="Enter your mobile number"
//           className="px-4 py-2 border rounded-lg w-64"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2" htmlFor="amount">
//           Amount
//         </label>
//         <input
//           type="text"
//           id="amount"
//           name="amount"
//           value={formData.amount}
//           onChange={handleChange}
//           placeholder="Enter the amount"
//           className="px-4 py-2 border rounded-lg w-64"
//         />
//       </div>

//       <button
//         onClick={handlePayment}
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//       >
//         Pay Now
//       </button>
//     </div>
//   );
// };

// export default Checkout;


import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaMoneyBillWave } from 'react-icons/fa';
import logo from './assets/paymentgatewaylogo.webp'; // Adjust the path based on your project structure

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    amount: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    const { name, mobileNumber, amount } = formData;
    if (!name.trim()) return 'Name is required.';
    if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber))
      return 'Enter a valid 10-digit mobile number.';
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0)
      return 'Enter a valid amount greater than zero.';
    return null;
  };

  const handlePayment = async () => {
    setError('');
    setSuccessMessage('');
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const data = {
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      amount: parseFloat(formData.amount),
    };

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8070/create-order', data);
      setSuccessMessage('Redirecting to payment gateway...');
      window.location.href = response.data.url;
    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error('Error in payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="h-16 mx-auto mb-4"
        />
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Checkout
        </h1>

        {/* Error/Success Messages */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

        {/* Input Fields */}
        <div className="relative mb-4">
          <FaUser className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="relative mb-4">
          <FaPhone className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="relative mb-4">
          <FaMoneyBillWave className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter the amount"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handlePayment}
          className={`w-full py-2 text-white rounded-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} transition`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
