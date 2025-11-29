import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, variant, quantity = 1) => {
        const existingItem = cart.find(
            (item) => item.productId === product._id && item.variant === variant.name
        );

        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.productId === product._id && item.variant === variant.name
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            );
            toast.success('Cart updated!');
        } else {
            setCart([
                ...cart,
                {
                    productId: product._id,
                    name: product.name,
                    slug: product.slug,
                    image: product.images[0],
                    variant: variant.name,
                    price: variant.salePrice || variant.price,
                    quantity,
                },
            ]);
            toast.success('Added to cart!');
        }
    };

    const removeFromCart = (productId, variant) => {
        setCart(cart.filter((item) => !(item.productId === productId && item.variant === variant)));
        toast.info('Removed from cart');
    };

    const updateQuantity = (productId, variant, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, variant);
            return;
        }

        setCart(
            cart.map((item) =>
                item.productId === productId && item.variant === variant
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        toast.info('Cart cleared');
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
