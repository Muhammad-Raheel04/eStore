import React from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/ProductCard';
import TopFilterBar from '@/components/TopFilterBar';
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
import { useLocation } from 'react-router-dom';
const Products = () => {
    const products = useSelector(store => store.product?.products) || [];
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [priceRange, setPriceRange] = useState([0, 999999]);
    const [sortOrder, setSortOrder] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [typeDefs, setTypeDefs] = useState([]);
    const dispatch = useDispatch();
    const location = useLocation();
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
    const getTypes = async () => {
        try {
            const res = await API.get('types');
            if (res.data?.success) {
                setTypeDefs(res.data.types || []);
            }
        } catch (error) {
            console.log(error);
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

        if (typeFilter !== "All") {
            filtered = filtered.filter(p => p.type === typeFilter);
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]);
        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }

        dispatch(setProducts(filtered))
    }, [sortOrder, allProducts, search, category, typeFilter, priceRange, dispatch])
    useEffect(() => {
        getAllProducts();
        getTypes();
    }, []);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryFromURL = params.get("category");
        const typeFromURL = params.get("type");

        if (typeFromURL) setTypeFilter(typeFromURL);
        if (categoryFromURL) setCategory(categoryFromURL);
        if (typeFromURL && !categoryFromURL) setCategory("All");
    }, [location.search]);
    return (
        <div className='pt-10 pb-10 px-4 '>
            <div className="text-center mb-12 mt-4 bg-gray-200 px-4 py-6">

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.35em] uppercase text-gray-900">
                    Collection
                </h1>

                <div className="w-12 h-[1px] bg-black mx-auto mt-6"></div>

                <p className="mt-6 text-gray-500 text-sm tracking-wide max-w-md mx-auto font-light">
                    Discover timeless pieces crafted with precision and elegance.
                </p>

            </div>
            <div className='max-w-7xl mx-auto flex flex-col gap-6'>

                {/* Desktop-only top filter bar */}
                <div className="hidden lg:block">
                    <TopFilterBar
                        category={category}
                        setCategory={setCategory}
                        type={typeFilter}
                        setType={setTypeFilter}
                        typeDefs={typeDefs}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        search={search}
                        setSearch={setSearch}
                        resetFilters={() => {
                            setSearch("");
                            setCategory("All");
                            setTypeFilter("All");
                            setPriceRange([0, 999999]);
                            getTypes();
                        }}
                    />
                </div>

                {/* Mobile: Filter toggle */}
                <div className="lg:hidden flex justify-between items-centergap-3 mb-4">
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="flex items-center gap-2 bg-white text-black border-1 border-black px-4 py-2 "
                    >
                        <Menu size={18} /> Filters
                    </button>
                    <div >
                        <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-[200px]  border-1 border-black py-5 rounded-none">
                                <SelectValue className="text-black" placeholder="Sort by price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem className="text-black" value="lowToHigh">Price: Low to High</SelectItem>
                                    <SelectItem className="text-black" value="highToLow">Price: High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Desktop sidebar removed as per request */}

                {/* Mobile Bottom Sheet Filter */}
                <div
                    className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${showSidebar ? "visible" : "invisible"
                        }`}
                >
                    {/* Overlay */}
                    <div
                        onClick={() => setShowSidebar(false)}
                        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showSidebar ? "opacity-100" : "opacity-0"
                            }`}
                    />

                    {/* Bottom Sheet */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl transform transition-transform duration-300 ${showSidebar ? "translate-y-0" : "translate-y-full"
                            }`}
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Filters</h2>
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto pr-2">
                            <FilterSidebar
                                search={search}
                                setSearch={setSearch}
                                category={category}
                                setCategory={setCategory}
                                type={typeFilter}
                                setType={setTypeFilter}
                                typeDefs={typeDefs}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                onFilterApply={() => setShowSidebar(false)}
                            />
                        </div>
                    </div>
                </div>


                <div className="flex-1">
                    {/* Products Grid */}
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16'>
                        {products.filter(Boolean).map((product) => (
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