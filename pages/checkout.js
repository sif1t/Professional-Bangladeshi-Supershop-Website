import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import { formatPrice, deliverySlots, paymentMethods } from '../lib/utils';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated, addAddress } = useAuth();
    const { cart, getCartTotal, clearCart } = useCart();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 1: Shipping Address
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: 'Dhaka',
        area: '',
        zipCode: '',
    });

    // Step 2: Delivery Slot
    const [selectedSlot, setSelectedSlot] = useState('');

    // Step 3: Payment Method
    const [selectedPayment, setSelectedPayment] = useState('Cash on Delivery');

    // Contact Number
    const [contactNumber, setContactNumber] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
        }
        if (cart.length === 0) {
            router.push('/cart');
        }
    }, [isAuthenticated, cart, router]);

    useEffect(() => {
        if (user?.mobile) {
            setContactNumber(user.mobile);
        }
        if (user?.addresses && user.addresses.length > 0) {
            const defaultAddress = user.addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress._id);
            } else {
                setSelectedAddressId(user.addresses[0]._id);
            }
        }
    }, [user]);

    const subtotal = getCartTotal();
    const deliveryFee = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + deliveryFee;

    const handleAddNewAddress = async () => {
        if (!newAddress.addressLine1 || !newAddress.area) {
            toast.error('Please fill in all required fields');
            return;
        }

        const result = await addAddress(newAddress);
        if (result.success) {
            toast.success('Address added successfully');
            setShowAddressForm(false);
            setNewAddress({
                addressLine1: '',
                addressLine2: '',
                city: 'Dhaka',
                area: '',
                zipCode: '',
            });
        } else {
            toast.error(result.message);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error('Please select a shipping address');
            return;
        }
        if (!selectedSlot) {
            toast.error('Please select a delivery slot');
            return;
        }
        if (!contactNumber) {
            toast.error('Please provide a contact number');
            return;
        }

        const selectedAddress = user.addresses.find(addr => addr._id === selectedAddressId);

        setLoading(true);
        try {
            const orderData = {
                products: cart.map(item => ({
                    productId: item.productId,
                    variant: item.variant,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    addressLine1: selectedAddress.addressLine1,
                    addressLine2: selectedAddress.addressLine2,
                    city: selectedAddress.city,
                    area: selectedAddress.area,
                    zipCode: selectedAddress.zipCode,
                },
                contactNumber,
                paymentMethod: selectedPayment,
                deliverySlot: selectedSlot,
            };

            const { data } = await api.post('/orders', orderData);

            if (data.success) {
                clearCart();
                toast.success('Order placed successfully!');
                router.push(`/account/orders/${data.order._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || cart.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="container-custom max-w-5xl">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {step > s ? <FiCheck /> : s}
                                </div>
                                {s < 4 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs sm:text-sm">
                        <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-600'}>
                            Address
                        </span>
                        <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-600'}>
                            Delivery
                        </span>
                        <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-600'}>
                            Payment
                        </span>
                        <span className={step >= 4 ? 'text-primary-600 font-medium' : 'text-gray-600'}>
                            Review
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            {/* Step 1: Shipping Address */}
                            {step === 1 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

                                    {/* Existing Addresses */}
                                    {user.addresses && user.addresses.length > 0 && (
                                        <div className="space-y-3 mb-4">
                                            {user.addresses.map((address) => (
                                                <label
                                                    key={address._id}
                                                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === address._id
                                                            ? 'border-primary-600 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        checked={selectedAddressId === address._id}
                                                        onChange={() => setSelectedAddressId(address._id)}
                                                        className="mr-3"
                                                    />
                                                    <div className="inline-block">
                                                        <div className="font-medium">{address.addressLine1}</div>
                                                        {address.addressLine2 && (
                                                            <div className="text-sm text-gray-600">{address.addressLine2}</div>
                                                        )}
                                                        <div className="text-sm text-gray-600">
                                                            {address.area}, {address.city} {address.zipCode}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add New Address */}
                                    {!showAddressForm ? (
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="btn-secondary w-full"
                                        >
                                            + Add New Address
                                        </button>
                                    ) : (
                                        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                            <h3 className="font-semibold">New Address</h3>
                                            <input
                                                type="text"
                                                placeholder="Address Line 1 *"
                                                value={newAddress.addressLine1}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, addressLine1: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address Line 2"
                                                value={newAddress.addressLine2}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, addressLine2: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <select
                                                    value={newAddress.city}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, city: e.target.value })
                                                    }
                                                    className="input-field"
                                                >
                                                    <option>Dhaka</option>
                                                    <option>Chittagong</option>
                                                    <option>Sylhet</option>
                                                    <option>Rajshahi</option>
                                                    <option>Khulna</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Area *"
                                                    value={newAddress.area}
                                                    onChange={(e) =>
                                                        setNewAddress({ ...newAddress, area: e.target.value })
                                                    }
                                                    className="input-field"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Zip Code"
                                                value={newAddress.zipCode}
                                                onChange={(e) =>
                                                    setNewAddress({ ...newAddress, zipCode: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={handleAddNewAddress} className="btn-primary flex-1">
                                                    Save Address
                                                </button>
                                                <button
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="btn-outline flex-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!selectedAddressId}
                                        className="btn-primary w-full mt-6"
                                    >
                                        Continue to Delivery
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Delivery Slot */}
                            {step === 2 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Select Delivery Slot</h2>
                                    <div className="space-y-3 mb-6">
                                        {deliverySlots.map((slot) => (
                                            <label
                                                key={slot.value}
                                                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedSlot === slot.value
                                                        ? 'border-primary-600 bg-primary-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="slot"
                                                    value={slot.value}
                                                    checked={selectedSlot === slot.value}
                                                    onChange={(e) => setSelectedSlot(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <span className="font-medium">{slot.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(1)} className="btn-outline flex-1">
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            disabled={!selectedSlot}
                                            className="btn-primary flex-1"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment Method */}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                                    <div className="space-y-3 mb-6">
                                        {paymentMethods.map((method) => (
                                            <label
                                                key={method.value}
                                                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedPayment === method.value
                                                        ? 'border-primary-600 bg-primary-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method.value}
                                                    checked={selectedPayment === method.value}
                                                    onChange={(e) => setSelectedPayment(e.target.value)}
                                                    className="mr-3"
                                                />
                                                <span className="text-2xl mr-2">{method.icon}</span>
                                                <span className="font-medium">{method.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(2)} className="btn-outline flex-1">
                                            Back
                                        </button>
                                        <button onClick={() => setStep(4)} className="btn-primary flex-1">
                                            Review Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Order Review */}
                            {step === 4 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Review Your Order</h2>

                                    {/* Contact Number */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">
                                            Contact Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            className="input-field"
                                            placeholder="01XXXXXXXXX"
                                        />
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3">Order Items</h3>
                                        <div className="space-y-2">
                                            {cart.map((item) => (
                                                <div
                                                    key={`${item.productId}-${item.variant}`}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span>
                                                        {item.name} ({item.variant}) x {item.quantity}
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                                        <div className="flex justify-between">
                                            <span>Delivery Address:</span>
                                            <span className="font-medium">
                                                {user.addresses.find(a => a._id === selectedAddressId)?.area}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Delivery Slot:</span>
                                            <span className="font-medium">
                                                {deliverySlots.find(s => s.value === selectedSlot)?.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment Method:</span>
                                            <span className="font-medium">{selectedPayment}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(3)} className="btn-outline flex-1">
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="btn-primary flex-1"
                                        >
                                            {loading ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-medium">
                                        {deliveryFee === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            formatPrice(deliveryFee)
                                        )}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
