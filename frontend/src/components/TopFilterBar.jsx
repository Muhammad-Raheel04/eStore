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
    brand,
    setBrand,
    sortOrder,
    setSortOrder,
    search,
    setSearch, 
    priceRange,
    setPriceRange,
    allProducts,
    resetFilters,
}) => {
    const categories = ["All", ...new Set(allProducts.map(p => p.category))];
    const brands = ["All", ...new Set(allProducts.map(p => p.brand))];
    return (
        <div className="w-full border-y bg-white py-4 px-4 flex flex-wrap gap-4 items-center justify-between">

            <div className="flex flex-wrap gap-4">

                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-[220px] bg-white rounded-md border-gray-200 border " />
                {/* Category */}
                <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="CATEGORY" />
                    </SelectTrigger>
                    <SelectContent>

                        {categories.map((item, index) => {
                            const label = item === "All" ? "Categories" : item;
                            return (
                                <SelectItem key={index} value={item}>
                                    {label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

                {/* Brand */}
                <Select onValueChange={setBrand} value={brand}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="BRAND" />
                    </SelectTrigger>
                    <SelectContent>
                        {brands.map((item, index) => {
                            const label = item === "All" ? "Brands" : item;
                            return (
                                <SelectItem key={index} value={item}>
                                    {label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

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

            {/* Reset Button */}
            <Button
                onClick={resetFilters}
                className="bg-white  !p-2 text-black !font-normal border border-gray-200 rounded-md hover:text-white"
            >
                Reset Filter
            </Button>
            {/* Right Side - Sort */}
            <div>
                <Select onValueChange={(value) => setSortOrder(value)} value={sortOrder}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Sort by price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                            <SelectItem value="highToLow">Price: High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default TopFilterBar;
