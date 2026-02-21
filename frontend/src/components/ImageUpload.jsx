import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

const ImageUpload = ({ productData, setProductData }) => {
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
    return (
        <div className="grid gap-2">
            <Label>Product Images</Label>
            <Input type='file' id="file-upload" className="" accept="image/*" multiple onChange={handleFiles}/>
            <Button variant='outline'>
                <label htmlFor='file-upload' className='cursor-pointer'>Upload Images</label>
            </Button>

            {/**/}
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