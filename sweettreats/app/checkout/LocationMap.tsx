"use client";

import { useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";

type Props = {
    position: [number, number];
    onMove: (latitude: number, longitude: number) => void;
};

/**
 * Moves the map only when the position was changed
 * externally, for example:
 *
 * - address search
 * - current location
 *
 * It does NOT react to normal map movement.
 */
function MapController({
    position,
}: {
    position: [number, number];
}) {
    const map = useMap();

    const previousPosition = useRef<[number, number] | null>(null);

    useEffect(() => {
        if (!previousPosition.current) {
            previousPosition.current = position;
            return;
        }

        const [previousLat, previousLng] = previousPosition.current;
        const [latitude, longitude] = position;

        const hasChanged =
            Math.abs(previousLat - latitude) > 0.0001 ||
            Math.abs(previousLng - longitude) > 0.0001;

        if (!hasChanged) {
            return;
        }

        previousPosition.current = position;

        const currentCenter = map.getCenter();

        const mapAlreadyAtPosition =
            Math.abs(currentCenter.lat - latitude) < 0.0001 &&
            Math.abs(currentCenter.lng - longitude) < 0.0001;

        if (mapAlreadyAtPosition) {
            return;
        }

        map.flyTo(position, map.getZoom(), {
            duration: 0.6,
        });
    }, [map, position]);

    return null;
}

/**
 * Detects when the user finishes moving the map.
 *
 * We use "moveend" rather than "move" so we don't
 * send a reverse-geocoding request for every tiny
 * movement.
 */
function MapMovementHandler({
    onMove,
}: {
    onMove: (latitude: number, longitude: number) => void;
}) {
    useMapEvents({
        moveend(event) {
            const map = event.target;
            const center = map.getCenter();

            onMove(center.lat, center.lng);
        },
    });

    return null;
}

export default function LocationMap({
    position,
    onMove,
}: Props) {
    return (
        <div
            className="
                relative
                h-[280px]
                w-full
                overflow-hidden
                rounded-[22px]
                border
                border-[#321714]/10
                bg-[#EDE8DE]
            "
        >
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={true}
                zoomControl={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController position={position} />

                <MapMovementHandler onMove={onMove} />
            </MapContainer>

            {/* CENTER PIN */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    z-[1000]
                    -translate-x-1/2
                    -translate-y-full
                "
            >
                <div className="relative flex flex-col items-center">
                    {/* PIN */}
                    <div
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border-[3px]
                            border-white
                            bg-[#321714]
                            shadow-[0_8px_25px_rgba(50,23,20,0.25)]
                        "
                    >
                        <div
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-[#FFD91A]
                            "
                        />
                    </div>

                    {/* PIN POINT */}
                    <div
                        className="
                            absolute
                            bottom-[-4px]
                            h-3
                            w-3
                            rotate-45
                            bg-[#321714]
                        "
                    />
                </div>
            </div>

            {/* PIN SHADOW */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    z-[999]
                    h-3
                    w-3
                    -translate-x-1/2
                    translate-y-[7px]
                    rounded-full
                    bg-black/20
                    blur-[3px]
                "
            />

            {/* MAP INSTRUCTION */}
            <div
                className="
                    pointer-events-none
                    absolute
                    bottom-3
                    left-3
                    z-[1000]
                    rounded-full
                    bg-white/90
                    px-2.5
                    py-1
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[#321714]/45
                    shadow-sm
                    backdrop-blur-md
                "
            >
                Move map to adjust
            </div>
        </div>
    );
}

// "use client";

// import { useEffect, useRef } from "react";
// import {
//     MapContainer,
//     TileLayer,
//     useMap,
//     useMapEvents,
// } from "react-leaflet";

// type Props = {
//     position: [number, number];
//     onMove: (latitude: number, longitude: number) => void;
// };

// /*
//  * Moves the map only when the position was changed
//  * externally, for example:
//  *
//  * - address search
//  * - current location
//  *
//  * It does NOT react to normal map movement.
//  */
// function MapController({
//     position,
// }: {
//     position: [number, number];
// }) {
//     const map = useMap();

//     const previousPosition = useRef<
//         [number, number] | null
//     >(null);

//     useEffect(() => {
//         if (!previousPosition.current) {
//             previousPosition.current = position;
//             return;
//         }

//         const [previousLat, previousLng] =
//             previousPosition.current;

//         const [latitude, longitude] = position;

//         const hasChanged =
//             Math.abs(previousLat - latitude) >
//                 0.0001 ||
//             Math.abs(previousLng - longitude) >
//                 0.0001;

//         if (!hasChanged) {
//             return;
//         }

//         previousPosition.current = position;

//         const currentCenter = map.getCenter();

//         const mapAlreadyAtPosition =
//             Math.abs(
//                 currentCenter.lat - latitude
//             ) < 0.0001 &&
//             Math.abs(
//                 currentCenter.lng - longitude
//             ) < 0.0001;

//         if (mapAlreadyAtPosition) {
//             return;
//         }

//         map.flyTo(position, map.getZoom(), {
//             duration: 0.6,
//         });
//     }, [map, position]);

//     return null;
// }

// /*
//  * Detects when the user finishes moving the map.
//  *
//  * We use "moveend" rather than "move" so we don't
//  * send a reverse-geocoding request for every tiny
//  * movement.
//  */
// function MapMovementHandler({
//     onMove,
// }: {
//     onMove: (
//         latitude: number,
//         longitude: number
//     ) => void;
// }) {
//     useMapEvents({
//         moveend(event:any) {
//             const map = event.target;

//             const center = map.getCenter();

//             onMove(
//                 center.lat,
//                 center.lng
//             );
//         },
//     });

//     return null;
// }

// export default function LocationMap({
//     position,
//     onMove,
// }: Props) {
//     return (
//         <div
//             className="
//                 relative
//                 h-[280px]
//                 w-full
//                 overflow-hidden
//                 rounded-[22px]
//                 border
//                 border-[#321714]/10
//                 bg-[#EDE8DE]
//             "
//         >
//             <MapContainer
//                 center={position}
//                 zoom={15}
//                 scrollWheelZoom={true}
//                 zoomControl={false}
//                 className="h-full w-full"
//             >
//                 <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
//                     url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />

//                 <MapController
//                     position={position}
//                 />

//                 <MapMovementHandler
//                     onMove={onMove}
//                 />
//             </MapContainer>

//             {/* CENTER PIN */}

//             <div
//                 className="
//                     pointer-events-none
//                     absolute
//                     left-1/2
//                     top-1/2
//                     z-[1000]
//                     -translate-x-1/2
//                     -translate-y-full
//                 "
//             >
//                 <div className="relative flex flex-col items-center">
//                     {/* PIN */}

//                     <div
//                         className="
//                             relative
//                             flex
//                             h-10
//                             w-10
//                             items-center
//                             justify-center
//                             rounded-full
//                             border-[3px]
//                             border-white
//                             bg-[#321714]
//                             shadow-[0_8px_25px_rgba(50,23,20,0.25)]
//                         "
//                     >
//                         <div
//                             className="
//                                 h-2.5
//                                 w-2.5
//                                 rounded-full
//                                 bg-[#FFD91A]
//                             "
//                         />
//                     </div>

//                     {/* PIN POINT */}

//                     <div
//                         className="
//                             absolute
//                             bottom-[-4px]
//                             h-3
//                             w-3
//                             rotate-45
//                             bg-[#321714]
//                         "
//                     />
//                 </div>
//             </div>

//             {/* PIN SHADOW */}

//             <div
//                 className="
//                     pointer-events-none
//                     absolute
//                     left-1/2
//                     top-1/2
//                     z-[999]
//                     h-3
//                     w-3
//                     -translate-x-1/2
//                     translate-y-[7px]
//                     rounded-full
//                     bg-black/20
//                     blur-[3px]
//                 "
//             />

//             {/* MAP INSTRUCTION */}

//             <div
//                 className="
//                     pointer-events-none
//                     absolute
//                     bottom-3
//                     left-3
//                     z-[1000]
//                     rounded-full
//                     bg-white/90
//                     px-2.5
//                     py-1
//                     text-[7px]
//                     font-semibold
//                     uppercase
//                     tracking-[0.08em]
//                     text-[#321714]/45
//                     shadow-sm
//                     backdrop-blur-md
//                 "
//             >
//                 Move map to adjust
//             </div>
//         </div>
//     );
// }

