import React, { useRef } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

const ImageUpload = ({ productData, setProductData }) => {
    const fileInputRef=useRef(null);
    const handleFiles = (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length) {
            setProductData((prev) => ({
                ...prev,
                productImg: [...prev.productImg, ...files]
            }))
        } else {
            return
        }
    }
    const removeImage = (index) => {
        setProductData((prev) => {
            const updatedImages = prev.productImg.filter((_, i) => i !== index);
            return { ...prev, productImg: updatedImages };
        });

        if(fileInputRef.current){
            fileInputRef.current.value="";
        }
    }
    return (
        <div className="grid gap-2">
            <Label>Product Images</Label>
            <Input type='file' id="file-upload" className="" accept="image/*" multiple onChange={handleFiles} ref={fileInputRef}/>
            <Button variant='outline'>
                <label htmlFor='file-upload' className='cursor-pointer'>Upload Images</label>
            </Button>

            {/* image Preview */}
            {
                productData.productImg.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
                        {
                            productData.productImg.map((file, idx) => {
                                // check if file is already a file (from input) or a DB object/string
                                let preview;

                                if (file instanceof File) {
                                    preview = URL.createObjectURL(file);
                                } else if (typeof file === 'string') {
                                    preview = file;
                                } else if (file?.url) {
                                    preview = file.url;
                                } else {
                                    return null;
                                }

                                return (
                                    <Card key={idx} className="relative group overflow-hidden">
                                        <CardContent className="p-2">
                                            <img
                                                src={preview}
                                                alt={`Product preview ${idx + 1}`}
                                                width={200}
                                                height={200}
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                            {/* remove button */}
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-black/5 text-black p-1 rounded-full opacity-40 group-hover:opacity-100 transition"
                                                size={14}
                                            >
                                                X
                                            </button>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ImageUpload