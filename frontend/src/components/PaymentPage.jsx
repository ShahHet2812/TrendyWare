import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: 'rzp_test_R5T2Xrss5YrsOl',
      amount: 100, // Amount in paise (e.g., 100 paise = 1 INR)
      currency: 'INR',
      name: 'TrendyWare',
      description: 'Test Transaction',
      handler: function (response) {
        alert('Payment successful!');
        navigate('/shop');
      },
      prefill: {
        name: 'Test User',
        email: 'test.user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: '#F8F8F8',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontFamily: "'Lora', serif", marginBottom: '2rem' }}>Processing Payment...</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", color: '#666', marginBottom: '2rem' }}>
          Please wait while we redirect you to the payment gateway.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;