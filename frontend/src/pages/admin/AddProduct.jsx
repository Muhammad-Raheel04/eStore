import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import API from '@/utils/API'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'


const AddProduct = () => {
  const { products } = useSelector(store => store.product);
  const accessToken = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prev) => ({
      ...prev,
      productImg: files
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
    formData.append("brand", productData.brand);

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
          brand: "",
          category: ""
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
    <div className="pl-[300px] py-10 pr-20 mx-auto px-4 bg-gray-100">
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
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder="Ex-apple"
                  required />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  type="text"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  placeholder="Ex-mobile"
                  required />
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
              className='w-full bg-pink-600 cursor-pointer' type='submit'>
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