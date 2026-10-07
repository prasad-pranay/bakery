"use client";

import { useEffect, useState } from "react";
import BlobButton from "../component/ordernow";
import { ChevronRight } from "lucide-react";

type Card = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    img: string;
    color: string;
};

const cards: Card[] = [
    {
        id: "a",
        title: "Bake the cookies",
        subtitle: "Premium bread\nand cookies made\nfrom scratch",
        description: "We are literally obsessed with giving more of what you love",
        image: "/hero-card.png",
        img: "/hero-0.png",
        color: "#20a9ea",
    },
    {
        id: "b",
        title: "Fresh every day",
        subtitle: "Freshly baked\nwith love\nand patience",
        description: "Everything is made fresh so every bite feels special",
        image: "/hero-card-1.png",
        img: "/hero-1.png",
        color: "#fdda27",
    },
    {
        id: "c",
        title: "Sweet moments",
        subtitle: "Little treats\nfor your\nbig moments",
        description: "Because life's best moments deserve something delicious",
        image: "/hero-card-2.png",
        img: "/hero-2.png",
        color: "#fe6b2f",
    },
    {
        id: "d",
        title: "Made from scratch",
        subtitle: "Simple ingredients\nhonest baking\nbeautiful results",
        description: "Nothing complicated. Just really good baking",
        image: "/hero-card-3.png",
        img: "/hero-3.png",
        color: "#2f8753",
    },
];

const AUTO_PLAY_TIME = 4000;

export default function HeroCards() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % cards.length);
        }, AUTO_PLAY_TIME);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full overflow-hidden py-10">
            <div className="flex h-[520px] w-full gap-3">
                {cards.map((card, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <HeroCard
                            key={card.id}
                            card={card}
                            active={isActive}
                            onClick={() => setActiveIndex(index)}
                            color={card.color}
                            img={card.img}
                        />
                    );
                })}
            </div>
        </div>
    );
}

type HeroCardProps = {
    card: Card;
    active: boolean;
    onClick: () => void;
    color: string;
    img: string;
};

function HeroCard({ card, active, onClick, color, img }: HeroCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        relative h-full shrink-0 overflow-hidden
        rounded-[50px]
        bg-white
        cursor-pointer
        transition-[width]
        duration-1000
        shadow-[0_4px_5px_rgba(0,0,0,0.06)]
        ease-[cubic-bezier(0.77,0,0.175,1)]
        ${active ? "w-[calc(100%-280px)]" : "w-[80px]"}
        `}
        // ${active ? "w-[calc(100%-99px)]" : "w-full"}
        >
            {/* Collapsed card */}
            <div
                className={`
          absolute inset-0 flex flex-col items-center justify-between
          transition-opacity duration-500
          py-5
          ${active ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
            >
                <img src={`${img}`} alt="" className="w-full" />
                <p
                    className="
            whitespace-nowrap
            uppercase tracking-wider
            font-title
            font-bold
            text-xl
            [writing-mode:vertical-rl]
            rotate-180
          "
                >
                    {card.title}
                </p>
                <p style={{ background: color }} className="shadow-[0_4px_10px_rgba(0,0,0,0.06)] p-2.5 rounded-full text-white"><ChevronRight strokeWidth={3} size={20} /></p>
            </div>

            {/* Expanded content */}
            <div
                className={`
          absolute inset-0
          px-10 py-10
          transition-opacity
          duration-700
          ${active ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
            >
                {/* Heading */}
                <div className="relative">
                    <p className="absolute bg-[#267847] text-white px-3 py-1 rounded-full top-1/2 -translate-y-1/2 left-50 -rotate-10 text-xs uppercase font-title tracking-wide">Tasty</p>
                    <p className="absolute bg-[#FF6E2E] text-white px-3 py-1 rounded-full top-1/2 -translate-y-1/2 right-10 text-xs uppercase font-title tracking-wide">Crunchy</p>
                    <h2 className="uppercase font-title font-extrabold text-8xl text-center w-full tracking-wider">{card.title} </h2>
                </div>

                <div className="flex mt-[-35px] items-center justify-around">
                    {/* Description */}
                    <div className="w-max flex flex-col gap-4">
                        <div className="uppercase font-sub-title font-thin text-4xl mt-20 relative max-w-120">
                            {card.subtitle}
                            <p className="flex items-center gap-1 absolute bottom-0 right-0 w-max bg-[#17A7E4] text-white text-sm rotate-10 tracking-wider px-2  py-1 rounded-full">
                                <span className="p-0.5 bg-[#004A72] rounded-full" />
                                Fresh
                            </p>
                        </div>
                        <p className="max-w-xs font-text text-sm font-medium mt-3">{card.description}</p>
                        <div className="flex gap-2 mt-10">
                            {/* <button className="uppercase">Order Now</button> */}
                            <BlobButton className="uppercase font-title text-sm flex gap-2 items-center tracking-wider">
                                <span className="p-1 bg-white rounded-full" />
                                Order Now
                            </BlobButton>
                            <button className="uppercase font-title text-sm flex gap-1 items-center">Cooking blog <ChevronRight strokeWidth={3} size={15} /></button>
                        </div>
                    </div>
                    <div className="w-max row-span-2">
                        <img src={card.image} alt="" className="w-120" />
                    </div>
                </div>
            </div>
        </div>
    );
}