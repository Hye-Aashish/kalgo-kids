import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import { Link, useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cart, settings, checkout, showNotify } = useShop();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        country: '',
        zipCode: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRazorpayPayment = async (e) => {
        e.preventDefault();
        
        if (formData.fullName.trim().length < 2) {
            showNotify('Please enter your full name!', 'error');
            return;
        }

        if (paymentMethod === 'COD') {
            setIsProcessing(true);
            const result = await checkout(formData, { paymentMethod: 'COD', paymentStatus: 'Pending' });
            setIsProcessing(false);
            if (result) setOrderSuccess(result.id);
            return;
        }

        // Razorpay flow
        setIsProcessing(true);
        try {
            const { data: order } = await axios.post('http://localhost:5000/api/create-razorpay-order', {
                amount: total,
                currency: 'INR'
            });

            const options = {
                key: settings.razorpayKeyId || 'rzp_test_YOUR_KEY_HERE', // Fallback or from settings
                amount: order.amount,
                currency: order.currency,
                name: settings.brandName || "KALGO Kids",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response) {
                    const result = await checkout(formData, { 
                        paymentMethod: 'Online', 
                        paymentStatus: 'Paid',
                        razorpay_payment_id: response.razorpay_payment_id 
                    });
                    if (result) setOrderSuccess(result.id);
                    setIsProcessing(false);
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email
                },
                theme: {
                    color: "#FFA500"
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            showNotify('Payment initialization failed!', 'error');
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <>
                <BackgroundElements />
                <Header />
                <div className="checkout-success-container">
                    <div className="polaroid-card floating-slow" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem' }}>
                        <div className="masking-tape tape-1"></div>
                        <h2 className="section-title styled-type text-center">Yippee! 🎉</h2>
                        <div className="text-center handwritten-style" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                            <p>Thank you, {formData.fullName}!</p>
                            <p>Your order <strong>{orderSuccess}</strong> is being prepared with lots of love.</p>
                            <p style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.7 }}>Payment Method: {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}</p>
                            <div className="scribble scribble-star floating-fast" style={{ position: 'relative', margin: '1rem auto' }}></div>
                        </div>
                        <div className="text-center">
                            <Link to="/" className="btn btn-pill btn-primary scribble-shadow">Back to Adventures</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (cart.length === 0) {
        return (
            <>
                <BackgroundElements />
                <Header />
                <div style={{ padding: '10rem 5%', textAlign: 'center' }}>
                    <h2 className="section-title styled-type">Your cart is empty</h2>
                    <p className="handwritten-style" style={{ fontSize: '1.5rem' }}>Add some products to it!</p>
                    <Link to="/products" className="btn btn-pill btn-primary scribble-shadow" style={{ marginTop: '2rem' }}>Go Shopping</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <BackgroundElements />
            <Header />
            
            <section className="checkout-page">
                <h2 className="section-title styled-type">Final <span className="marker-highlight text-yellow">Step</span></h2>
                
                <div className="checkout-layout">
                    {/* Form Section */}
                    <div className="checkout-form-box glass-card">
                        <form onSubmit={handleRazorpayPayment}>
                            <div className="form-section">
                                <h3 className="handwritten-style">Shipping Details</h3>
                                <div className="input-group">
                                    <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} />
                                    <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
                                </div>
                                <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleChange} />
                                <div className="input-group">
                                    <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} />
                                    <input type="text" name="zipCode" placeholder="Zip Code" required value={formData.zipCode} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-section" style={{ marginTop: '2rem' }}>
                                <h3 className="handwritten-style">Payment Method</h3>
                                <div className="payment-options">
                                    <label className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}>
                                        <input type="radio" name="paymentOption" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                        <span>💵 Cash on Delivery</span>
                                    </label>
                                    <label className={`payment-option ${paymentMethod === 'Online' ? 'active' : ''}`}>
                                        <input type="radio" name="paymentOption" value="Online" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} />
                                        <span>💳 Pay Online (Razorpay)</span>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className={`btn btn-pill btn-primary btn-large scribble-shadow w-full ${isProcessing ? 'loading' : ''}`} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : (paymentMethod === 'COD' ? 'Place Order' : 'Pay & Order')}
                            </button>
                        </form>
                    </div>

                    {/* Summary Section */}
                    <div className="checkout-summary">
                        <div className="polaroid-card titled-card">
                            <div className="masking-tape tape-2"></div>
                            <h3 className="handwritten-style">Order Summary</h3>
                            <div className="summary-items">
                                {cart.map(item => (
                                    <div key={item._id} className="summary-item">
                                        <span>{item.title} (x{item.qty})</span>
                                        <span>{settings.currency}{(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-calc">
                                <div className="calc-line">
                                    <span>Subtotal</span>
                                    <span>{settings.currency}{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="calc-line">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free!' : settings.currency + shipping.toFixed(2)}</span>
                                </div>
                                <div className="calc-line total-line">
                                    <span>Total</span>
                                    <span>{settings.currency}{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="scribble scribble-burst floating-fast scribble-pos-bottom"></div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                .checkout-layout {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 3rem;
                    align-items: start;
                }
                .form-section input {
                    width: 100%;
                    padding: 1rem;
                    border: 3px solid #e2e8f0;
                    border-radius: 16px;
                    margin-bottom: 1rem;
                    font-family: var(--font-body);
                    font-weight: 700;
                    background: #fff;
                    outline: none;
                    transition: all 0.25s;
                    color: var(--clr-blue);
                }
                .form-section input:focus {
                    border-color: var(--clr-orange);
                    box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.1);
                }
                .form-section input::placeholder {
                    color: #cbd5e1;
                    font-weight: 600;
                }
                .input-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-family: var(--font-hand);
                    font-size: 1.2rem;
                }
                .summary-calc {
                    border-top: 2px dashed var(--clr-blue);
                    margin-top: 1rem;
                    padding-top: 1rem;
                }
                .calc-line {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }
                .calc-line.total-line {
                    font-weight: 900;
                    color: var(--clr-orange);
                    font-size: 1.5rem;
                }
                .w-full { width: 100%; margin-top: 2rem; }
                .loading { 
                    background: #94a3b8 !important; 
                    cursor: wait !important; 
                    animation: pulse 1.5s infinite; 
                }
                .payment-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .payment-option {
                    border: 3px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 1.5rem 1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-weight: 800;
                    transition: all 0.2s;
                    color: var(--clr-blue);
                }
                .payment-option input {
                    display: none;
                }
                .payment-option:hover {
                    border-color: var(--clr-sky);
                    background: #f8fafc;
                }
                .payment-option.active {
                    border-color: var(--clr-orange);
                    background: #fff;
                    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.1);
                    transform: translateY(-2px);
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @media (max-width: 900px) {
                    .checkout-layout {
                        grid-template-columns: 1fr;
                    }
                    .checkout-summary {
                        order: -1;
                    }
                }
            `}</style>
        </>
    );
}
