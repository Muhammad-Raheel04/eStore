import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TopFilterBar = ({
    category,
    setCategory,
    brand,
    setBrand,
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
                className="bg-pink-600 text-white"
            >
                Reset Filter
            </Button>
        </div>
    );
};

export default TopFilterBar;
