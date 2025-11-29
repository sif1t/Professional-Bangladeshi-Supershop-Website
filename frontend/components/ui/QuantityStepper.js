import { FiMinus, FiPlus } from 'react-icons/fi';

export default function QuantityStepper({ quantity, onQuantityChange, min = 1, max = 99 }) {
    const handleDecrement = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrement = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value) || min;
        if (value >= min && value <= max) {
            onQuantityChange(value);
        }
    };

    return (
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
            <button
                onClick={handleDecrement}
                disabled={quantity <= min}
                className="px-3 py-2 hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
                <FiMinus size={16} />
            </button>
            <input
                type="number"
                value={quantity}
                onChange={handleChange}
                min={min}
                max={max}
                className="w-16 text-center border-x border-gray-300 py-2 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
                onClick={handleIncrement}
                disabled={quantity >= max}
                className="px-3 py-2 hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
                <FiPlus size={16} />
            </button>
        </div>
    );
}
