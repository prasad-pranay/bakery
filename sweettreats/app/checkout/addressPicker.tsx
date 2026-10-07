"use client";

import {
    LocateFixed,
    MapPin,
    Search,
    Loader2,
    Check,
} from "lucide-react";
import { useRef, useState } from "react";
import LocationMap from "./LocationMap";

export type SelectedAddress = {
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
};

type SearchResult = {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    address?: {
        house_number?: string;
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        postcode?: string;
        country?: string;
    };
};

type Props = {
    value: SelectedAddress | null;
    onChange: (address: SelectedAddress) => void;
};

const DEFAULT_POSITION: [number, number] = [
    28.4595,
    77.0266,
];

function getCity(address?: SearchResult["address"]) {
    return (
        address?.city ||
        address?.town ||
        address?.village ||
        address?.suburb ||
        ""
    );
}

function formatAddress(result: SearchResult) {
    const address = result.address;

    if (!address) {
        return result.display_name;
    }

    const parts = [
        address.house_number,
        address.road,
        address.neighbourhood,
        address.suburb,
    ].filter(Boolean);

    return parts.length > 0
        ? parts.join(", ")
        : result.display_name;
}

export default function AddressPicker({
    value,
    onChange,
}: Props) {
    const [position, setPosition] = useState<
        [number, number]
    >(
        value
            ? [value.latitude, value.longitude]
            : DEFAULT_POSITION
    );

    const [query, setQuery] = useState("");

    const [results, setResults] = useState<
        SearchResult[]
    >([]);

    const [searching, setSearching] = useState(false);

    const [locating, setLocating] = useState(false);

    const [reverseLoading, setReverseLoading] =
        useState(false);

    const [error, setError] = useState("");

    const reverseRequestTime = useRef(0);

    async function searchAddress() {
        const trimmed = query.trim();

        if (!trimmed) return;

        try {
            setSearching(true);
            setError("");
            setResults([]);

            const params = new URLSearchParams({
                q: trimmed,
                format: "jsonv2",
                addressdetails: "1",
                limit: "5",
                countrycodes: "in",
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to search this address."
                );
            }

            const data =
                (await response.json()) as SearchResult[];

            setResults(data);

            if (data.length === 0) {
                setError(
                    "No matching places found. Try a nearby area, street or landmark."
                );
            }
        } catch {
            setError(
                "We couldn't search that location. Please try again."
            );
        } finally {
            setSearching(false);
        }
    }

    function selectSearchResult(result: SearchResult) {
        const latitude = Number(result.lat);
        const longitude = Number(result.lon);

        const nextPosition: [
            number,
            number
        ] = [latitude, longitude];

        setPosition(nextPosition);
        setResults([]);
        setQuery("");

        onChange({
            address: formatAddress(result),
            city: getCity(result.address),
            postalCode: result.address?.postcode || "",
            latitude,
            longitude,
        });
    }

    function getCurrentLocation() {
        if (!navigator.geolocation) {
            setError(
                "Location services aren't supported by this browser."
            );
            return;
        }

        setLocating(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            async (location) => {
                const latitude =
                    location.coords.latitude;

                const longitude =
                    location.coords.longitude;

                const nextPosition: [
                    number,
                    number
                ] = [latitude, longitude];

                setPosition(nextPosition);

                await reverseGeocode(
                    latitude,
                    longitude
                );

                setLocating(false);
            },
            () => {
                setLocating(false);

                setError(
                    "We couldn't access your location. Please allow location access and try again."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    }

    async function reverseGeocode(
        latitude: number,
        longitude: number
    ) {
        const now = Date.now();

        const elapsed =
            now - reverseRequestTime.current;

        if (elapsed < 1100) {
            await new Promise((resolve) =>
                setTimeout(
                    resolve,
                    1100 - elapsed
                )
            );
        }

        reverseRequestTime.current = Date.now();

        try {
            setReverseLoading(true);
            setError("");

            const params = new URLSearchParams({
                lat: latitude.toString(),
                lon: longitude.toString(),
                format: "jsonv2",
                addressdetails: "1",
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            const result =
                (await response.json()) as SearchResult;

            onChange({
                address: formatAddress(result),
                city: getCity(result.address),
                postalCode:
                    result.address?.postcode || "",
                latitude,
                longitude,
            });
        } catch {
            setError(
                "We couldn't identify this exact location."
            );
        } finally {
            setReverseLoading(false);
        }
    }

    async function handleMapMove(
        latitude: number,
        longitude: number
    ) {
        setPosition([latitude, longitude]);

        await reverseGeocode(
            latitude,
            longitude
        );
    }

    return (
        <div className="space-y-4">
            {/* SEARCH */}

            <div>
                <div
                    className="
                        flex
                        overflow-hidden
                        rounded-[15px]
                        border
                        border-[#321714]/10
                        bg-[#FCF9F3]
                        transition-colors
                        focus-within:border-[#321714]/25
                    "
                >
                    <div className="flex flex-1 items-center gap-2.5 px-4">
                        <Search
                            className="h-4 w-4 shrink-0 text-[#321714]/35"
                            strokeWidth={1.8}
                        />

                        <input
                            value={query}
                            onChange={(event) => {
                                setQuery(
                                    event.target.value
                                );
                                setError("");
                            }}
                            onKeyDown={(event) => {
                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    event.preventDefault();
                                    searchAddress();
                                }
                            }}
                            placeholder="Search your street, area or landmark"
                            className="
                                h-[48px]
                                min-w-0
                                flex-1
                                bg-transparent
                                text-[11px]
                                text-[#321714]
                                outline-none
                                placeholder:text-[#321714]/30
                            "
                        />
                    </div>

                    <button
                        type="button"
                        onClick={searchAddress}
                        disabled={
                            searching ||
                            !query.trim()
                        }
                        className="
                            m-1
                            flex
                            min-w-[82px]
                            items-center
                            justify-center
                            gap-2
                            rounded-[11px]
                            bg-[#321714]
                            px-3
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.1em]
                            text-[#FFF9E8]
                            transition-all
                            hover:bg-[#4A2420]
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        {searching ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <>
                                Search
                                <Search className="h-3 w-3" />
                            </>
                        )}
                    </button>
                </div>

                {/* SEARCH RESULTS */}

                {results.length > 0 && (
                    <div
                        className="
                            mt-2
                            overflow-hidden
                            rounded-[15px]
                            border
                            border-[#321714]/10
                            bg-[#FCF9F3]
                            shadow-[0_15px_40px_rgba(50,23,20,0.08)]
                        "
                    >
                        {results.map((result) => (
                            <button
                                key={result.place_id}
                                type="button"
                                onClick={() =>
                                    selectSearchResult(
                                        result
                                    )
                                }
                                className="
                                    flex
                                    w-full
                                    items-start
                                    gap-3
                                    border-b
                                    border-[#321714]/[0.06]
                                    px-4
                                    py-3.5
                                    text-left
                                    transition-colors
                                    last:border-b-0
                                    hover:bg-[#FFF9E8]
                                "
                            >
                                <MapPin
                                    className="
                                        mt-0.5
                                        h-3.5
                                        w-3.5
                                        shrink-0
                                        text-[#321714]/45
                                    "
                                    strokeWidth={1.8}
                                />

                                <span className="min-w-0">
                                    <span
                                        className="
                                            block
                                            text-[10px]
                                            font-semibold
                                            leading-relaxed
                                            text-[#321714]
                                        "
                                    >
                                        {formatAddress(
                                            result
                                        )}
                                    </span>

                                    <span
                                        className="
                                            mt-1
                                            block
                                            truncate
                                            text-[8px]
                                            leading-relaxed
                                            text-[#321714]/40
                                        "
                                    >
                                        {
                                            result.display_name
                                        }
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {error && (
                    <p className="mt-2 px-1 text-[9px] text-red-700/70">
                        {error}
                    </p>
                )}
            </div>

            {/* CURRENT LOCATION */}

            <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locating}
                className="
                    flex
                    items-center
                    gap-2
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.1em]
                    text-[#321714]/55
                    transition-colors
                    hover:text-[#321714]
                    disabled:opacity-40
                "
            >
                {locating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <LocateFixed
                        className="h-3.5 w-3.5"
                        strokeWidth={1.8}
                    />
                )}

                {locating
                    ? "Finding your location..."
                    : "Use my current location"}
            </button>

            {/* MAP */}

            <LocationMap
                position={position}
                onMove={handleMapMove}
            />

            {/* MAP STATUS */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-[14px]
                    border
                    border-[#321714]/[0.07]
                    bg-[#FCF9F3]
                    px-4
                    py-3
                "
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#FFF9E8]
                        "
                    >
                        {reverseLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#321714]/50" />
                        ) : (
                            <MapPin
                                className="h-3.5 w-3.5 text-[#321714]/55"
                                strokeWidth={1.8}
                            />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#321714]/35">
                            Delivery address
                        </p>

                        <p className="mt-0.5 truncate text-[10px] font-medium text-[#321714]">
                            {reverseLoading
                                ? "Finding this location..."
                                : value?.address ||
                                  "Move the map to choose an address"}
                        </p>
                    </div>
                </div>

                {value && !reverseLoading && (
                    <Check
                        className="h-4 w-4 shrink-0 text-[#5B7D46]"
                        strokeWidth={2}
                    />
                )}
            </div>

            {/* LOCATION DETAILS */}

            {value && (
                <div className="grid grid-cols-2 gap-3">
                    <div
                        className="
                            rounded-[14px]
                            border
                            border-[#321714]/[0.07]
                            bg-[#FCF9F3]
                            px-4
                            py-3
                        "
                    >
                        <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#321714]/30">
                            City
                        </p>

                        <p className="mt-1 text-[10px] font-medium">
                            {value.city || "—"}
                        </p>
                    </div>

                    <div
                        className="
                            rounded-[14px]
                            border
                            border-[#321714]/[0.07]
                            bg-[#FCF9F3]
                            px-4
                            py-3
                        "
                    >
                        <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#321714]/30">
                            Postal code
                        </p>

                        <p className="mt-1 text-[10px] font-medium">
                            {value.postalCode || "—"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}