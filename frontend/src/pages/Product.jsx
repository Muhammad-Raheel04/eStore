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
import { useState ,useEffect} from 'react';
import { toast } from 'sonner';
import API from '@/utils/API';
const Products = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading,setLoading]=useState(false);
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await API.get(`http://localhost:8000/api/v1/product/getallproducts`);
            if (res.data.success) {
                setAllProducts(res.data.products);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);
    return (
        <div className='pt-20 pb-10'>
            <div className='max-w-7xl mx-auto flex gap-7'>
                {/* sidebar */}
                <FilterSidebar />
                {/* Main product section */}
                <div className="flex flex-col flex-1">
                    <div className='flex justify-end mb-4'>
                        <Select>
                            <SelectTrigger className="w-[180px]">
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
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
                        {
                            allProducts.map((product) => {
                                return <ProductCard key={product._id} product={product} loading={loading}/>;
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;