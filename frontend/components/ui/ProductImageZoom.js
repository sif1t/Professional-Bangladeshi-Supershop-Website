import { useState } from 'react';
import Image from 'next/image';

export default function ProductImageZoom({ src, alt }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    return (
        <div
            className="relative aspect-square bg-white overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Original Image */}
            <Image
                src={src}
                alt={alt}
                fill
                className="object-contain transition-opacity duration-200"
                style={{
                    opacity: isZoomed ? 0.5 : 1,
                }}
            />

            {/* Zoomed Image (follows mouse) */}
            {isZoomed && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `${position.x}% ${position.y}%`,
                    }}
                />
            )}

            {/* Zoom Indicator */}
            {isZoomed && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded-full pointer-events-none">
                    🔍 Zoomed 2.5x
                </div>
            )}
        </div>
    );
}
