import { useState } from 'react';
import Image from 'next/image';

export default function ImageZoom({ src, alt, className = '' }) {
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
            className={`relative overflow-hidden cursor-crosshair ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-200 ease-out"
                style={{
                    transform: isZoomed
                        ? `scale(2) translate(${(50 - position.x) / 2}%, ${(50 - position.y) / 2}%)`
                        : 'scale(1)',
                }}
            />
        </div>
    );
}
