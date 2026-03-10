import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import API from '@/utils/API'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// types and categories will be fetched from backend


const AddProduct = () => {
  const { products } = useSelector(store => store.product);
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [typeDefs, setTypeDefs] = useState([]); // [{type, categories: []}]
  const [newType, setNewType] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    category: "",
    type: "men"
  });

  const loadTypes = async () => {
    try {
      const res = await API.get('types');
      if (res.data?.success) {
        setTypeDefs(res.data.types || []);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create FormData object
    const formData = new FormData();

    // Append text fields
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("type", productData.type);

    // Check if productImg exists and has length
    if (!productData.productImg || productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    // Append images
    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);
      const res = await API.post('product', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Fixed template literal
        }
      });
      console.log(res);

      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]))
        toast.success("Product added successfully!");
        // Reset form after successful submission
        setProductData({
          productName: "",
          productPrice: 0,
          productDesc: "",
          productImg: [],
          category: "",
          type: "men"
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="pl-[300px] pr-20 mx-auto px-4 bg-gray-100">
      <Card className="w-full my-20">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="Product Name"
                required />
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                placeholder=""
                required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={productData.type} onValueChange={(val) => setProductData(prev => ({ ...prev, type: val, category: "" }))}>
                  <SelectTrigger className="w-full">
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
                <Select value={productData.category} onValueChange={(val)=> setProductData(prev=>({...prev, category: val}))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(typeDefs.find(t=>t.type===productData.type)?.categories || []).map(c => (
                      <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))} 
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Admin Controls for managing Types & Categories */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Add New Type</Label>
                <div className="flex gap-2">
                  <Input value={newType} onChange={(e)=>setNewType(e.target.value)} placeholder="e.g. pets" />
                  <Button onClick={async ()=>{
                    try{
                      await API.post('type', { type: newType }, { headers: { Authorization: `Bearer ${accessToken}` }});
                      setNewType(""); 
                      await loadTypes();
                      toast.success("Type added");
                    }catch(e){ toast.error(e.response?.data?.message || "Failed to add type"); }
                  }}>Add</Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Delete Type</Label>
                <div className="flex gap-2">
                  <Select value={productData.type} onValueChange={(val)=> setProductData(prev=>({...prev, type: val, category: ""}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeDefs.map(t => (
                        <SelectItem key={t.type} value={t.type}>{t.type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" onClick={async ()=>{
                    try{
                      await API.delete(`type/${productData.type}`, { headers: { Authorization: `Bearer ${accessToken}` }});
                      await loadTypes();
                      setProductData(prev=>({...prev, type: "men", category: ""}));
                      toast.success("Type deleted");
                    }catch(e){ toast.error(e.response?.data?.message || "Failed to delete type"); }
                  }}>Delete</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Add Category to Selected Type</Label>
                <div className="flex gap-2">
                  <Input value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="e.g. sneakers" />
                  <Button onClick={async ()=>{
                    try{
                      await API.post('category', { type: productData.type, category: newCategory }, { headers: { Authorization: `Bearer ${accessToken}` }});
                      setNewCategory(""); 
                      await loadTypes();
                      toast.success("Category added");
                    }catch(e){ toast.error(e.response?.data?.message || "Failed to add category"); }
                  }}>Add</Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Delete Category from Selected Type</Label>
                <div className="flex gap-2">
                  <Select value={productData.category} onValueChange={(val)=> setProductData(prev=>({...prev, category: val}))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(typeDefs.find(t=>t.type===productData.type)?.categories || []).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" onClick={async ()=>{
                    try{
                      await API.delete(`category/${productData.type}/${productData.category}`, { headers: { Authorization: `Bearer ${accessToken}` }});
                      await loadTypes();
                      setProductData(prev=>({...prev, category: ""}));
                      toast.success("Category deleted");
                    }catch(e){ toast.error(e.response?.data?.message || "Failed to delete category"); }
                  }}>Delete</Button>
                </div>
              </div>
            </div>

            

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label>Description</Label>
              </div>
              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                placeholder="Enter brief description of product">
              </Textarea>
            </div>
            <ImageUpload productData={productData} setProductData={setProductData} />
          </div>
          <CardFooter className='flex-col gap-2'>
            <Button
              disabled={loading}
              onClick={submitHandler}
              className='w-full bg-white text-black border border-black hover:bg-black hover:text-white cursor-pointer mt-4' type='submit'>
              {
                loading ? <span className='flex gap-l items-center'><Loader className='animate-spin' /></span> : "Add Product"
              }
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProduct
