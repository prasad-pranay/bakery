'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import BlobButton from '../component/ordernow';

const storyItems = [
    {
        id: '01',
        label: 'OUR CRAFT',
        navTitle: 'Made by hand',
        eyebrow: 'A LITTLE MORE HUMAN',
        title: 'Made by hand, from scratch, with love.',
        description:
            'Good things take time. Every detail is thoughtfully considered, every ingredient has a purpose, and every creation carries a little piece of the hands that made it.',
        image: '/card1.png',
        imageAlt: 'Handcrafted creations made with care',
        buttonLabel: 'Discover our craft',
        imageNote: '01 / THE ART OF MAKING',
    },
    {
        id: '02',
        label: 'OUR PHILOSOPHY',
        navTitle: 'Quality first',
        eyebrow: 'NOTHING WITHOUT A REASON',
        title: 'Thoughtfully chosen. Never ordinary.',
        description:
            'We believe the little things make all the difference. From the ingredients we select to the details you notice, quality is never an afterthought.',
        image: '/card2.jpg',
        imageAlt: 'Carefully selected ingredients and materials',
        buttonLabel: 'Our philosophy',
        imageNote: '02 / THE THOUGHT BEHIND IT',
    },
    {
        id: '03',
        label: 'OUR PROMISE',
        navTitle: 'Fresh every day',
        eyebrow: 'MADE FOR THE MOMENT',
        title: 'A little joy, made fresh every day.',
        description:
            'Our process is rooted in care, consistency, and the simple pleasure of doing things well. Because the things you love should always feel special.',
        image: '/card3.png',
        imageAlt: 'Freshly prepared creations ready to enjoy',
        buttonLabel: 'Explore the collection',
        imageNote: '03 / THE JOY IN EVERY DETAIL',
    },
];

export default function BrandStoryAccordion() {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeItem = storyItems[activeIndex];

    const handleAction = () => {
        // Replace this with your desired route or action.
        // Example: router.push('/collections');
        console.log('Selected:', activeItem.buttonLabel);
    };

    return (<section
        className="
     relative my-12 mb-20 w-full overflow-hidden
     rounded-2xl sm:rounded-3xl
     bg-[#372321] text-[#F8F0E5]
   "
        aria-label="Our story"
    >
        {/* Subtle background decoration */} <div
            aria-hidden="true"
            className="
       pointer-events-none absolute -right-28 -top-32
       h-80 w-80 rounded-full
       border border-white/[0.06]
     "
        />


        <div
            aria-hidden="true"
            className="
      pointer-events-none absolute -right-12 -top-16
      h-64 w-64 rounded-full
      border border-white/[0.05]
    "
        />

        <div className="relative px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            {/* Section heading */}
            {/* <div
                className="
        mb-8 flex flex-col gap-4
        sm:mb-10 sm:flex-row sm:items-end
        sm:justify-between sm:gap-8
      "
            >
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <span className="h-px w-8 bg-[#D8AD83]" />

                        <p
                            className="
              font-text text-[10px] font-medium
              uppercase tracking-[0.25em]
              text-[#D8AD83] sm:text-xs
            "
                        >
                            THE WAY WE DO THINGS
                        </p>
                    </div>

                    <h2
                        className="
            max-w-2xl font-title
            text-3xl leading-[1.1]
            tracking-tight sm:text-4xl
            md:text-5xl lg:text-6xl
          "
                    >
                        There&apos;s a story
                        <br className="hidden sm:block" /> in every detail.
                    </h2>
                </div>

                <p
                    className="
          max-w-xs font-text text-sm
          leading-6 text-[#D6C5BA]
          sm:text-base
        "
                >
                    A little about what we believe, how we work, and why we care.
                </p>
            </div> */}

            {/* Main accordion layout */}
            <div
                className="
        grid grid-cols-1 gap-7
        lg:grid-cols-[0.72fr_2.28fr]
        lg:gap-10 xl:gap-14
      "
            >
                {/* LEFT: Vertical accordion navigation */}
                <div
                    className="
          flex flex-col
          lg:min-h-[470px]
        "
                >
                    {/* Mobile step selector */}
                    <div
                        className="
            grid grid-cols-3 gap-2
            lg:hidden
          "
                        role="group"
                        aria-label="Choose a story"
                    >
                        {storyItems.map((item, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {setActiveIndex(index)}}
                                    aria-pressed={isActive}
                                    className={`
                  flex min-h-[76px] flex-col
                  items-start justify-between gap-3
                  rounded-xl border p-3 text-left
                  transition-colors duration-300
                  ${isActive
                                            ? 'border-[#D8AD83]/50 bg-[#F8F0E5]/[0.08]'
                                            : 'border-white/10 bg-transparent hover:bg-white/[0.04]'
                                        }
                `}
                                >
                                    <span
                                        className={`
                    font-text text-[10px] tracking-widest
                    ${isActive
                                                ? 'text-[#D8AD83]'
                                                : 'text-[#9F8A7F]'
                                            }
                  `}
                                    >
                                        {item.id}
                                    </span>

                                    <span
                                        className={`
                    text-xs font-medium
                    ${isActive
                                                ? 'text-[#F8F0E5]'
                                                : 'text-[#B5A39A]'
                                            }
                  `}
                                    >
                                        {item.navTitle}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Desktop vertical accordion */}
                    <div
                        className="hidden flex-1 lg:flex lg:flex-col"
                        aria-label="Story sections"
                    >
                        {storyItems.map((item, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    aria-expanded={isActive}
                                    aria-controls="brand-story-panel"
                                    className="
                  group relative flex w-full
                  flex-1 items-start gap-4
                  border-b border-white/10
                  py-7 text-left
                  transition-colors duration-300
                  first:pt-3
                  last:border-b-0
                "
                                >
                                    {/* Active indicator */}
                                    <div
                                        className="
                    relative mt-1 flex h-8 w-8
                    shrink-0 items-center justify-center
                  "
                                    >
                                        <span
                                            className={`
                      absolute inset-0 rounded-full
                      border transition-all duration-300
                      ${isActive
                                                    ? 'scale-100 border-[#D8AD83]/60 bg-[#D8AD83]/10'
                                                    : 'scale-75 border-white/20 group-hover:scale-90 group-hover:border-white/40'
                                                }
                    `}
                                        />

                                        <span
                                            className={`
                      relative font-text text-[10px]
                      transition-colors duration-300
                      ${isActive
                                                    ? 'text-[#E8BE99]'
                                                    : 'text-[#A38D81] group-hover:text-white'
                                                }
                    `}
                                        >
                                            {item.id}
                                        </span>
                                    </div>

                                    {/* Accordion title and expandable description */}
                                    <div className="min-w-0 flex-1 pt-1">
                                        <p
                                            className={`
                      mb-2 font-text text-[10px]
                      uppercase tracking-[0.18em]
                      transition-colors duration-300
                      ${isActive
                                                    ? 'text-[#D8AD83]'
                                                    : 'text-[#9F8A7F]'
                                                }
                    `}
                                        >
                                            {item.label}
                                        </p>

                                        <h3
                                            className={`
                      font-title text-xl
                      transition-colors duration-300
                      xl:text-2xl
                      ${isActive
                                                    ? 'text-[#F8F0E5]'
                                                    : 'text-[#B5A39A] group-hover:text-[#F8F0E5]'
                                                }
                    `}
                                        >
                                            {item.navTitle}
                                        </h3>

                                        <div
                                            className={`
                      grid transition-[grid-template-rows,opacity,margin]
                      duration-300 ease-out
                      ${isActive
                                                    ? 'mt-3 grid-rows-[1fr] opacity-100'
                                                    : 'mt-0 grid-rows-[0fr] opacity-0'
                                                }
                    `}
                                        >
                                            <div className="overflow-hidden">
                                                <p
                                                    className="
                          max-w-[220px] font-text
                          text-xs leading-5
                          text-[#C2AEA2]
                        "
                                                >
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <span
                                        className={`
                    mt-2 flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-full transition-all duration-300
                    ${isActive
                                                ? 'rotate-0 bg-[#D8AD83] text-[#372321]'
                                                : '-rotate-45 text-[#A38D81] group-hover:rotate-0 group-hover:text-white'
                                            }
                  `}
                                    >
                                        <ArrowUpRight size={16} />
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Desktop navigation footer */}
                    {/* <div
                        className="
            mt-auto hidden items-center gap-3
            pt-6 lg:flex
          "
                    >
                        <span className="font-text text-xs text-[#9F8A7F]">
                            EXPLORE THE DETAILS
                        </span>

                        <div className="h-px flex-1 bg-white/10" />
                    </div> */}
                </div>

                {/* RIGHT: Active image and content */}
                <div
                    id="brand-story-panel"
                    className="
          grid min-w-0 grid-cols-1
          overflow-hidden rounded-2xl
          border border-white/[0.08]
          bg-[#45302B]
          md:grid-cols-[1.05fr_0.95fr]
        "
                    aria-live="polite"
                >
                    {/* Image panel */}
                    <div
                        key={`image-${activeItem.id}`}
                        className="
            story-image-enter relative
            min-h-[260px] overflow-hidden
            bg-[#2D1D1A]
            sm:min-h-[330px]
            md:min-h-[430px]
          "
                    >
                        <img
                            src={activeItem.image}
                            alt={activeItem.imageAlt}
                            className="
              absolute inset-0 h-full w-full
              object-cover
              transition-transform duration-700
              ease-out hover:scale-[1.03]
            "
                        />

                        {/* Image overlay */}
                        <div
                            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t
              from-[#211512]/70 via-transparent
              to-[#211512]/10
            "
                        />

                        {/* Image label */}
                        <div
                            className="
              absolute bottom-0 left-0 right-0
              flex items-center justify-between
              gap-3 p-4 sm:p-6
            "
                        >
                            <span
                                className="
                font-text text-[9px]
                uppercase tracking-[0.2em]
                text-white/85 sm:text-[10px]
              "
                            >
                                {activeItem.imageNote}
                            </span>

                            <span
                                className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full border border-white/30
                bg-white/10 text-white backdrop-blur-md
              "
                                aria-hidden="true"
                            >
                                <ArrowUpRight size={17} />
                            </span>
                        </div>
                    </div>

                    {/* Text panel */}
                    <div
                        key={`content-${activeItem.id}`}
                        className="
            story-content-enter
            flex flex-col justify-center
            px-5 py-7 sm:px-8 sm:py-9
            lg:px-8 lg:py-10 xl:px-10
          "
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <span className="h-px w-7 bg-[#D8AD83]" />

                            <span
                                className="
                font-text text-[10px]
                uppercase tracking-[0.2em]
                text-[#D8AD83]
              "
                            >
                                {activeItem.eyebrow}
                            </span>
                        </div>

                        <h3
                            className="
              max-w-md font-title
              text-3xl leading-[1.08]
              tracking-tight
              sm:text-4xl
              lg:text-3xl
              xl:text-4xl
              2xl:text-5xl
            "
                        >
                            {activeItem.title}
                        </h3>

                        <p
                            className="
              mt-5 max-w-md font-text
              text-sm leading-7
              text-[#D6C5BA]
              sm:mt-6 sm:text-base sm:leading-7
            "
                        >
                            {activeItem.description}
                        </p>

                        {/* CTA */}
                        {/* <div className="mt-7 sm:mt-9">
                            <BlobButton
                                // onClick={handleAction}
                                className="
                flex w-fit items-center
                gap-3 uppercase tracking-wider
                font-title text-xs sm:text-sm
              "
                            >
                                <span
                                    className="
                  flex h-6 w-6 items-center
                  justify-center rounded-full
                  bg-white text-[#372321]
                "
                                >
                                    <ArrowRight size={13} />
                                </span>

                                {activeItem.buttonLabel}
                            </BlobButton>
                        </div> */}

                        {/* Progress indicator */}
                        <div className="mt-9 border-t border-white/10 pt-5 sm:mt-12">
                            <div className="mb-3 flex items-center justify-between">
                                <span
                                    className="
                  font-text text-[9px]
                  uppercase tracking-[0.18em]
                  text-[#A38D81]
                "
                                >
                                    OUR STORY
                                </span>

                                <span className="font-text text-xs text-[#D8AD83]">
                                    {activeItem.id}
                                    <span className="text-[#8F786D]"> / 03</span>
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {storyItems.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setActiveIndex(index)}
                                        aria-label={`Show story ${item.id}: ${item.navTitle}`}
                                        aria-current={
                                            activeIndex === index ? 'step' : undefined
                                        }
                                        className="
                    group h-1.5 flex-1 overflow-hidden
                    rounded-full bg-white/10
                  "
                                    >
                                        <span
                                            className={`
                      block h-full rounded-full
                      transition-all duration-500
                      ${activeIndex === index
                                                    ? 'w-full bg-[#D8AD83]'
                                                    : 'w-0 bg-[#D8AD83]'
                                                }
                    `}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>


    );
}
