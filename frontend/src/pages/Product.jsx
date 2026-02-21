import React from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import API from '@/utils/API';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/redux/productSlice';
import { Menu } from 'lucide-react';
const Products = () => {
    const { products } = useSelector(store => store.product);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [brand, setBrand] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 999999]);
    const [sortOrder, setSortOrder] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const dispatch = useDispatch();
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await API.get(`product/getallproducts`);
            if (res.data.success) {
                setAllProducts(res.data.products);
                dispatch(setProducts(res.data.products));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts];

        if (search.trim() !== "") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()));
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category);
        }

        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand);
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]);
        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }

        dispatch(setProducts(filtered))
    }, [sortOrder, allProducts, search, category, brand, priceRange, dispatch])
    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className='pt-20 pb-10 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-6'>

                {/* Mobile Filter Button */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl"
                    >
                        <Menu size={18} /> Filters
                    </button>

                    <Select onValueChange={(value) => setSortOrder(value)}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="lowToHigh">Low → High</SelectItem>
                                <SelectItem value="highToLow">High → Low</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sidebar Desktop */}
                <div className="hidden lg:block w-[260px]">
                    <FilterSidebar
                        search={search}
                        setSearch={setSearch}
                        brand={brand}
                        setBrand={setBrand}
                        category={category}
                        setCategory={setCategory}
                        allProducts={allProducts}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />
                </div>

                {/* Mobile Sidebar Drawer */}
                {showSidebar && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex">
                        <div className="bg-white w-[280px] p-5">
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="mb-4 text-pink-600 font-bold"
                            >
                                ❌ Close
                            </button>
                            <FilterSidebar
                                search={search}
                                setSearch={setSearch}
                                brand={brand}
                                setBrand={setBrand}
                                category={category}
                                setCategory={setCategory}
                                allProducts={allProducts}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                            />
                        </div>
                    </div>
                )}

                {/* Products */}
                <div className="flex-1">
                    <div className='hidden lg:flex justify-end mb-4'>
                        <Select onValueChange={(value) => setSortOrder(value)}>
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

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 '>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                loading={loading}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;