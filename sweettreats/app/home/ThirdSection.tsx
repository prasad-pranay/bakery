'use client';

import { useEffect, useState } from 'react';

interface ProductValue {
    text: string;
    bg: string;
    count: number | string;
    icons: React.ReactNode;
}

interface ProductMarqueeProps {
    thirdPartValue: Record<string, ProductValue>;
    title?: string;
    interval?: number;
}

interface ProductItem {
    name: string;
    text: string;
    bg: string;
    count: number | string;
    icons: React.ReactNode;
}




function ProductCard({ product }: { product: ProductItem }) {
    return (
        <div
            className="
flex shrink-0 items-center justify-center gap-2
rounded-full border border-black/[0.04]
px-4 py-2.5 sm:px-5 sm:py-3
font-title text-sm sm:text-base
shadow-[0_4px_10px_rgba(0,0,0,0.06)]
"
            style={{
                color: product.text,
                backgroundColor: product.bg,
            }}
        >
            {product.icons}
            <span className="whitespace-nowrap">{product.name}</span>


            <span
                className="
      flex min-h-6 min-w-6 items-center
      justify-center rounded-full px-2
      py-0.5 text-xs tracking-wider text-white
    "
                style={{ backgroundColor: product.text }}
            >
                {product.count}
            </span>
        </div>


    );
}

function ProductRow({
    products,
    interval,
    direction = 'left',
    delay = 0,
}: {
    products: ProductItem[];
    interval: number;
    direction?: 'left' | 'right';
    delay?: number;
}) {
    const [offset, setOffset] = useState(0);
    const [entering, setEntering] = useState(false);

    useEffect(() => {
        if (products.length <= 3) return;


        const timer = window.setInterval(() => {
            setEntering(true);

            // Allow the outgoing cards to slide away before replacing them.
            window.setTimeout(() => {
                setOffset((current) => (current + 1) % products.length);
                setEntering(false);
            }, 450);
        }, interval);

        return () => window.clearInterval(timer);


    }, [products.length, interval]);

    const visibleProducts = Array.from({ length: 3 }, (_, index) => {
        const productIndex =
            (offset + index) % products.length;


        return products[productIndex];


    });

    return (
        <div
            className="grid grid-cols-3 gap-2 sm:gap-4"
            style={{ animationDelay: `${delay}ms` }}
        >
            {visibleProducts.map((product, index) => (
                <div
                    key={`${product.name}-${offset}-${index}`}
                    className={`             flex min-w-0 justify-center
            transition-all duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${entering
                            ? direction === 'left'
                                ? '-translate-x-8 opacity-0'
                                : 'translate-x-8 opacity-0'
                            : 'translate-x-0 opacity-100'
                        }
          `}
                    style={{
                        transitionDelay: `${index * 45}ms`,
                    }}
                > <ProductCard product={product} /> </div>
            ))} </div>
    );
}

export default function ProductMarquee({
    thirdPartValue,
    title = 'Products we bake here daily—',
    interval = 1500,
}: ProductMarqueeProps) {
    const products: ProductItem[] = Object.entries(thirdPartValue).map(
        ([name, value]) => ({
            name,
            ...value,
        }),
    );

    if (products.length === 0) return null;

    // Top row starts with the first three items.
    const firstRow = products;

    // Bottom row starts with the last three items.
    const lastThree = products.slice(-3);

    // Continue through the rest of the list after the last three.
    const secondRow = [...lastThree, ...products.slice(0, -3)];

    return (<section
        className="
     grid w-full grid-cols-1 items-center
     gap-8 py-10
     lg:grid-cols-[minmax(290px,0.8fr)_minmax(0,1.6fr)]
     lg:gap-10
   "
    > <div>


            <h2
                className="
        whitespace-wrap font-title
        text-4xl leading-tight
        text-[#372321]
        sm:text-5xl lg:text-6xl relative
      "
            >
                {title}

                {/* <svg viewBox="0 -37.5 122.88 122.88" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" className='absolute top-1/2 left-1/2 -translate-1/2 opacity-3 w-full stroke-[1px] fill-none stroke-black'>
                    <path d="M4.98 27.65H29.7c2.16 0 4.01 1.39 4.7 3.33h20.28l-.76-4.02A1.65 1.65 0 0 1 55.54 25h65.68a1.662 1.662 0 0 1 1.57 2.2l-2.69 10.18c-.77 2.93-2.07 5.69-4.02 7.63-1.76 1.76-4.02 2.86-6.84 2.86h-42.5c-2.88 0-5.26-1.13-7.09-2.96-1.95-1.95-3.24-4.69-3.79-7.65l-.56-2.96H34.4c-.69 1.93-2.54 3.33-4.7 3.33H4.98C2.25 37.62 0 35.38 0 32.64s2.24-4.99 4.98-4.99M104.49.48c.65-.65 1.7-.65 2.34 0s.65 1.7 0 2.34c-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44-.46.79-1.47 1.06-2.26.6a1.65 1.65 0 0 1-.6-2.26c1.83-3.18.68-5.34-.33-7.23-1.46-2.72-2.72-5.07.59-8.39m-12.32 0c.65-.65 1.7-.65 2.34 0s.65 1.7 0 2.34c-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44-.46.79-1.47 1.06-2.26.6a1.65 1.65 0 0 1-.6-2.26c1.83-3.18.68-5.34-.33-7.23-1.46-2.72-2.72-5.07.59-8.39m-12.31 0c.65-.65 1.7-.65 2.34 0 .65.65.65 1.7 0 2.34-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44-.46.79-1.47 1.06-2.26.6a1.65 1.65 0 0 1-.6-2.26c1.83-3.18.68-5.34-.33-7.23-1.47-2.72-2.73-5.07.59-8.39m-12.32 0c.65-.65 1.7-.65 2.34 0 .65.65.65 1.7 0 2.34-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44-.46.79-1.47 1.06-2.26.6s-1.06-1.47-.6-2.26c1.83-3.18.68-5.34-.33-7.23-1.46-2.72-2.72-5.07.59-8.39m49.37 36.05 2.17-8.22H57.54l1.57 8.34c.44 2.32 1.42 4.45 2.89 5.92 1.23 1.23 2.83 1.99 4.75 1.99h42.5c1.85 0 3.33-.73 4.5-1.89 1.5-1.51 2.53-3.73 3.16-6.14" style={{ "fillRule": "evenodd", "clipRule": "evenodd" }} />
                </svg> */}
                <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 opacity-10">
                    <svg
                        viewBox="0 -37.5 122.88 122.88"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlSpace="preserve"
                        className="w-full fill-none stroke-black stroke-[1px]"
                    >
                        {/* Cup */}
                        <path
                            d="M4.98 27.65H29.7c2.16 0 4.01 1.39 4.7 3.33h20.28l-.76-4.02A1.65 1.65 0 0 1 55.54 25h65.68a1.662 1.662 0 0 1 1.57 2.2l-2.69 10.18c-.77 2.93-2.07 5.69-4.02 7.63-1.76 1.76-4.02 2.86-6.84 2.86h-42.5c-2.88 0-5.26-1.13-7.09-2.96-1.95-1.95-3.24-4.69-3.79-7.65l-.56-2.96H34.4c-.69 1.93-2.54 3.33-4.7 3.33H4.98C2.25 37.62 0 35.38 0 32.64s2.24-4.99 4.98-4.99M119.23 36.53l2.17-8.22H57.54l1.57 8.34c.44 2.32 1.42 4.45 2.89 5.92 1.23 1.23 2.83 1.99 4.75 1.99h42.5c1.85 0 3.33-.73 4.5-1.89 1.5-1.51 2.53-3.73 3.16-6.14"
                            fill="none"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        />

                        {/* Steam 1 */}
                        <path
                            className="steam steam-1"
                            d="M67.54.48c.65-.65 1.7-.65 2.34 0s.65 1.7 0 2.34c-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44"
                        />

                        {/* Steam 2 */}
                        <path
                            className="steam steam-2"
                            d="M79.86.48c.65-.65 1.7-.65 2.34 0s.65 1.7 0 2.34c-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44"
                        />

                        {/* Steam 3 */}
                        <path
                            className="steam steam-3"
                            d="M92.17.48c.65-.65 1.7-.65 2.34 0s.65 1.7 0 2.34c-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44"
                        />

                        {/* Steam 4 */}
                        <path
                            className="steam steam-4"
                            d="M104.49.48c.65-.65 1.7-.65 2.34 0s.65 1.7 0 2.34c-1.58 1.58-.86 2.93-.02 4.5 1.41 2.64 3.04 5.67.28 10.44"
                        />
                    </svg>

                    <style>{`
        .steam {
            transform-box: fill-box;
            transform-origin: center bottom;
            animation: steam 2.8s ease-in-out infinite;
        }

        .steam-1 {
            animation-delay: 0s;
        }

        .steam-2 {
            animation-delay: 0.45s;
        }

        .steam-3 {
            animation-delay: 0.9s;
        }

        .steam-4 {
            animation-delay: 1.35s;
        }

        @keyframes steam {
            0% {
                opacity: 0;
                transform: translateY(5px) translateX(0) scaleY(0.85)
                    rotate(-2deg);
            }

            20% {
                opacity: 0.65;
            }

            50% {
                opacity: 0.45;
                transform: translateY(-3px) translateX(2px) scaleY(1)
                    rotate(3deg);
            }

            75% {
                opacity: 0.25;
                transform: translateY(-7px) translateX(-2px) scaleY(1.05)
                    rotate(-3deg);
            }

            100% {
                opacity: 0;
                transform: translateY(-12px) translateX(1px) scaleY(1.1)
                    rotate(2deg);
            }
        }
    `}</style>
                </div>
            </h2>
        </div>

        <div
            className="
      relative min-w-0 space-y-10
      overflow-hidden 
    "
        >
            {/* Left fade */}
            <div
                className="
        pointer-events-none absolute
        inset-y-0 left-0 z-10 w-5
        bg-gradient-to-r
        from-[#f8f4f0] to-transparent
        sm:w-10
      "
            />

            {/* Right fade */}
            <div
                className="
        pointer-events-none absolute
        inset-y-0 right-0 z-10 w-5
        bg-gradient-to-l
        from-[#f8f4f0] to-transparent
        sm:w-10
      "
            />

            {/* Top row: first three cards initially */}
            <ProductRow
                products={firstRow}
                interval={interval}
                direction="left"
            />

            {/* Bottom row: last three cards initially */}
            <ProductRow
                products={secondRow}
                interval={interval + 350}
                direction="right"
                delay={175}
            />
        </div>
    </section>


    );
}
