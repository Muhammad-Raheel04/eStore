import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Bold, Edit, Search, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImageUpload from '@/components/ImageUpload'
import API from '@/utils/API'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
const quillModules = {
    toolbar: [
        ['bold', 'italic'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
        [{ 'table': true }]
    ]
};
const AdminProduct = () => {
    const { products } = useSelector((store) => store.product)
    const [editProduct, setEditProduct] = useState(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const accessToken = localStorage.getItem('accessToken');
    const dispatch = useDispatch();
    const [typeDefs, setTypeDefs] = useState([]);
    const fetchAll = async () => {
        try {
            const res = await API.get('product/getallproducts');
            if (res.data?.success) {
                dispatch(setProducts(res.data.products));
            }
        } catch (err) {
            console.log(err);
        }
    };
    const fetchTypes = async () => {
        try {
            const res = await API.get('types');
            if (res.data?.success) {
                setTypeDefs(res.data.types || []);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchAll();
        fetchTypes();
    }, [dispatch]);
    let filteredProducts = products.filter((product) => {
        return (
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.type || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    });

    if (sortOrder === 'lowToHigh') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
    }
    if (sortOrder === 'highToLow') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
    }
    if (sortOrder === 'categoryAsc') {
        filteredProducts = [...filteredProducts].sort((a, b) =>
            (a.category || '').localeCompare(b.category || '')
        )
    }

    if (sortOrder === 'categoryDesc') {
        filteredProducts = [...filteredProducts].sort((a, b) =>
            (b.category || '').localeCompare(a.category || '')
        )
    }

    if (sortOrder === 'typeAsc') {
        filteredProducts = [...filteredProducts].sort((a, b) =>
            (a.type || '').localeCompare(b.type || '')
        )
    }

    if (sortOrder === 'typeDesc') {
        filteredProducts = [...filteredProducts].sort((a, b) =>
            (b.type || '').localeCompare(a.type || '')
        )
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setEditProduct((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSave = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("productName", editProduct.productName)
        formData.append("productDesc", editProduct.productDesc)
        formData.append("productPrice", editProduct.productPrice)
        formData.append("category", editProduct.category)
        formData.append("featured", editProduct.featured)
        if (editProduct.type) {
            formData.append("type", editProduct.type)
        }

        const existingImages = editProduct.productImg
            .filter((img) => !(img instanceof File) && img.public_id)
            .map((img) => img.public_id)

        formData.append("existingImages", JSON.stringify(existingImages))

        editProduct.productImg
            .filter((img) => img instanceof File)
            .forEach((file) => {
                formData.append("files", file)
            })

        try {
            const res = await API.put(`/product/update/${editProduct._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.success) {
                toast.success("Product updated Successfully");
                await fetchAll();
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const deleteProductHandler = async (productId) => {
        try {
            const res = await API.delete(`/product/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                await fetchAll();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
            <div className='flex justify-between'>
                <div className='relative bg-white rounded-lg'>
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Product by name, type or category..."
                        className='w-[400px] items-center' />
                    <Search className='absolute right-3 top-1.5 text-gray-500' />
                </div>
            </div>
            <Select onValueChange={(value) => setSortOrder(value)}>
                <SelectTrigger className='w-[200px] bg-white'>
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                    <SelectItem value="highToLow">Price: High to Low</SelectItem>

                    <SelectItem value="categoryAsc">Category: A - Z</SelectItem>
                    <SelectItem value="categoryDesc">Category: Z - A</SelectItem>

                    <SelectItem value="typeAsc">Type: A - Z</SelectItem>
                    <SelectItem value="typeDesc">Type: Z - A</SelectItem>
                </SelectContent>
            </Select>
            {
                filteredProducts.filter(Boolean).map((product) => {
                    return (
                        <Card key={product._id} className="px-4">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <img src={product.productImg && product.productImg.length > 0 ? product.productImg[0].url : ''} alt="" className="w-25 h-25" />
                                    <div className="flex flex-col">
                                        <h1 className="font-bold w-96 text-gray-700">{product?.productName}</h1>
                                        {product.featured && <span className="text-[10px] bg-[#e8d87f] text-black px-2 py-0.5 rounded-full w-fit font-bold uppercase tracking-wider">Featured</span>}
                                    </div>
                                    <div className="font-semibold text-black">Category {product?.category}</div>
                                    <div className="font-semibold text-black">Type <bold>{product?.type}</bold></div>
                                </div>
                                <div className="font-semibold text-gray-800 px-2">{product?.productPrice}</div>
                                <div className="flex gap-3">

                                    <Dialog open={open} onOpenChange={setOpen}>

                                        <DialogTrigger asChild>
                                            <Edit onClick={() => { setOpen(true), setEditProduct(product) }} className="text-green-500 cursor-pointer" />
                                        </DialogTrigger>

                                        <DialogContent className='sm:max-w[625px] max-h-[650px] overflow-y-scroll'>
                                            <DialogHeader>
                                                <DialogTitle>Edit Product</DialogTitle>
                                                <DialogDescription>
                                                    Make changes to your product here. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-2">
                                                <div className="grid gap-2">
                                                    <Label>Product name</Label>
                                                    <Input
                                                        value={editProduct?.productName}
                                                        onChange={handleChange}
                                                        type='text'
                                                        name="productName"
                                                        placeholder='Ex-Iphone'
                                                        required />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Price</Label>
                                                    <Input
                                                        value={editProduct?.productPrice}
                                                        onChange={handleChange}
                                                        name="productPrice"
                                                        type='number'
                                                        required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Type</Label>
                                                        <Select value={editProduct?.type || 'unisex'} onValueChange={(val) => setEditProduct(prev => ({ ...prev, type: val, category: "" }))}>
                                                            <SelectTrigger className="w-full bg-white">
                                                                <SelectValue placeholder="Select Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {typeDefs.map(t => (
                                                                    <SelectItem key={t.type} value={t.type}>{t.type.charAt(0).toUpperCase() + t.type.slice(1)}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Category</Label>
                                                        <Select value={editProduct?.category || ''} onValueChange={(val) => setEditProduct(prev => ({ ...prev, category: val }))}>
                                                            <SelectTrigger className="w-full bg-white">
                                                                <SelectValue placeholder="Select Category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {(typeDefs.find(td => td.type === (editProduct?.type || 'unisex'))?.categories || [])
                                                                    .map(c => (
                                                                        <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 py-2">
                                                    <input
                                                        type="checkbox"
                                                        id="featured"
                                                        checked={editProduct?.featured || false}
                                                        onChange={(e) => setEditProduct(prev => ({ ...prev, featured: e.target.checked }))}
                                                        className="w-4 h-4 cursor-pointer"
                                                    />
                                                    <Label htmlFor="featured" className="cursor-pointer">Mark as Featured Product</Label>
                                                </div>
                                                <div className='grid gap-2'>
                                                    <div className='flex items-center'>
                                                        <Label>
                                                            Description
                                                        </Label>
                                                    </div>
                                                    <div className="h-48 overflow-y-auto">
                                                        <ReactQuill
                                                            modules={quillModules}
                                                            value={editProduct?.productDesc || ''}
                                                            onChange={(value) =>
                                                                setEditProduct(prev => ({ ...prev, productDesc: value }))
                                                            }
                                                            placeholder="Enter brief description of product..."
                                                        />
                                                    </div>
                                                </div>
                                                <ImageUpload
                                                    productData={editProduct} setProductData={setEditProduct} />
                                            </div>

                                            <DialogFooter className='mt-4'>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button onClick={handleSave} type="submit">Save changes</Button>
                                            </DialogFooter>

                                        </DialogContent>

                                    </Dialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Trash2 className="text-red-500 cursor-pointer" />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </div>
                            </div>
                        </Card>
                    )
                })
            }
        </div>

    )

}

export default AdminProduct
