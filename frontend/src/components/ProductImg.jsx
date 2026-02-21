import React, { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images }) => {
    const [mainImg, setMainImg] = useState(
        images?.length ? images[0].url : ""
    );

    return (
        <div className="relative">
            {/* Main Image */}
            <Zoom>
                <img
                    src={mainImg}
                    alt=""
                    className="w-full h-[350px] object-cover"
                />
            </Zoom>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images?.map((img, index) => (
                    <img
                        key={index}
                        src={img.url}
                        onClick={() => setMainImg(img.url)}
                        className="w-14 h-14 rounded-lg border-2 border-white shadow-md cursor-pointer object-cover"
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductImg;