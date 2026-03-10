import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

const TopFilterBar = ({
    category,
    setCategory,
    type,
    setType,
    typeDefs,
    sortOrder,
    setSortOrder,
    search,
    setSearch,
    priceRange,
    setPriceRange,
    resetFilters
}) => {

    const showCategory = type && type !== "All";
    const types = ["All", ...(Array.isArray(typeDefs) ? typeDefs.map(t => t.type) : [])];
    const categories = showCategory
        ? ["All", ...(typeDefs?.find(t => t.type === type)?.categories || [])]
        : [];

    const handleTypeChange = (val) => {
        setType(val);
        setCategory("All");
    };

    return (
        <div className="w-full border-y bg-white py-4 px-4 flex items-center gap-4">

            <div className="flex flex-wrap items-center gap-4 flex-1">

                {/* Search */}
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 min-w-[220px] bg-white rounded-md border-gray-200 border"
                />

                {/* Type */}
                <Select onValueChange={handleTypeChange} value={type}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="TYPE" />
                    </SelectTrigger>
                    <SelectContent>
                        {types.map((item, index) => (
                            <SelectItem key={index} value={item}>
                                {item === "All"
                                    ? "Types"
                                    : item.charAt(0).toUpperCase() + item.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Category */}
                {showCategory && categories.length > 0 && (
                    <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="CATEGORY" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((item, index) => (
                                <SelectItem key={index} value={item}>
                                    {item === "All"
                                        ? "Categories"
                                        : item.charAt(0).toUpperCase() + item.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Price */}
                <Select
                    onValueChange={(val) => {
                        if (val === "0-1000") setPriceRange([0, 1000]);
                        if (val === "1000-3000") setPriceRange([1000, 3000]);
                        if (val === "3000-999999") setPriceRange([3000, 999999]);
                        if (val === "PRICE") setPriceRange([0, 999999]);
                    }}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="PRICE" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PRICE">Price</SelectItem>
                        <SelectItem value="0-1000">0 - 1000</SelectItem>
                        <SelectItem value="1000-3000">1000 - 3000</SelectItem>
                        <SelectItem value="3000-999999">3000+</SelectItem>
                    </SelectContent>
                </Select>

            </div>


            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4 ml-auto">

                {/* Sort */}
                <Select onValueChange={(value) => setSortOrder(value)} value={sortOrder}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                            <SelectItem value="highToLow">Price: High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Reset */}
                <Button
                    onClick={resetFilters}
                    className="bg-black px-4 py-2 text-white font-normal border border-gray-200 rounded-md hover:bg-white hover:text-black"
                >
                    Reset Filter
                </Button>

            </div>

        </div>
    );
};

export default TopFilterBar;
