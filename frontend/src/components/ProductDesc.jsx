import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import API from "@/utils/API";
import { toast } from "sonner";
import { setCart, setCartOpen } from "@/redux/productSlice";
import { ChevronDown } from "lucide-react";

// Parsing logic for structured accordion sections
const parseDescription = (desc) => {
    if (!desc) return [];

    const sections = [];
    let currentSection = { title: "Description", content: "" };

    const isHTML = /<[a-z][\s\S]*>/i.test(desc);

    if (isHTML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(desc, "text/html");
        const nodes = Array.from(doc.body.childNodes);

        nodes.forEach((node) => {
            if (node.nodeType === 1) { // ELEMENT_NODE
                const strong = node.querySelector("strong");
                const isHeading =
                    node.tagName === "P" &&
                    strong &&
                    node.textContent.trim() === strong.textContent.trim();

                if (isHeading) {
                    if (currentSection.content.trim()) {
                        sections.push(currentSection);
                    }
                    currentSection = { title: node.textContent.trim(), content: "" };
                } else {
                    currentSection.content += node.outerHTML;
                }
            } else if (node.nodeType === 3) { // TEXT_NODE
                if (node.textContent.trim()) {
                    currentSection.content += node.textContent;
                }
            }
        });
    } else {
        const parts = desc.split(/\n\n+/);
        parts.forEach((part) => {
            const trimmed = part.trim();
            if (!trimmed) return;

            const isHeading = trimmed.length < 40 && !trimmed.includes("\n");

            if (isHeading) {
                if (currentSection.content.trim()) {
                    sections.push(currentSection);
                }
                currentSection = { title: trimmed, content: "" };
            } else {
                currentSection.content += `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
            }
        });
    }

    if (currentSection.content.trim()) {
        sections.push(currentSection);
    }

    return sections;
};

// Reusable AccordionSection sub-component
const AccordionSection = ({ title, content, isOpenInitially = false }) => {
    const [isOpen, setIsOpen] = useState(isOpenInitially);

    return (
        <div className="border-t border-gray-200 last:border-b w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left group transition-all duration-300"
            >
                <span className="text-base font-medium text-gray-800 uppercase tracking-[0.15em] group-hover:text-gray-500 transition-colors duration-300">
                    {title}
                </span>
                <ChevronDown
                    className={`text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""
                        }`}
                    size={18}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1200px] opacity-100 pb-6" : "max-h-0 opacity-0"
                    }`}
            >
                <div
                    className="prose prose-sm max-w-none w-full text-gray-600
                               prose-p:leading-relaxed prose-p:my-2
                               prose-ul:list-disc prose-ul:pl-5 prose-li:my-1
                               prose-strong:text-gray-900 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};

const ProductDesc = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem("accessToken");
    const [quantity, setQuantity] = useState(1);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (product?.productDesc) {
            setSections(parseDescription(product.productDesc));
        }
    }, [product?.productDesc]);

    const addToCart = async () => {
        try {
            const config = accessToken
                ? { headers: { Authorization: `Bearer ${accessToken}` } }
                : {};

            const res = await API.post(
                "cart/add",
                { productId: product._id, quantity },
                config
            );

            if (res.data.success) {
                toast.success("Added to bag");
                dispatch(setCart(res.data.cart));
                dispatch(setCartOpen(true));
            }
        } catch (error) {
            toast.error("Failed to add product");
        }
    };

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            await addToCart();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="font-sans text-[#1a1a1a] space-y-6 md:space-y-8 pb-4">

                {/* Category */}
                <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#b08d57]">
                    <span className="w-5 h-[1px] bg-[#b08d57]/50 hidden md:block"></span>
                    {product?.category}
                    <span className="w-5 h-[1px] bg-[#b08d57]/50"></span>
                </div>

                {/* Title */}
                <h1 className="font-serif text-[26px] md:text-[34px] font-light leading-tight text-center md:text-left">
                    {product?.productName}
                </h1>

                {/* Price */}
                <div className="flex items-end gap-2 justify-center md:justify-start">
                    <span className="text-xs text-gray-400 tracking-wide">Rs.</span>
                    <span className="font-serif text-2xl md:text-3xl">
                        {product?.productPrice?.toLocaleString()}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* Structured Accordion Sections */}
                <div >
                    {sections.map((section, idx) => (
                        <AccordionSection
                            key={idx}
                            title={section.title}
                            content={section.content}
                            isOpenInitially={idx === 0}
                        />
                    ))}
                </div>

                {/* Quantity Section */}
                <div className="space-y-3 pt-4">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400">
                        Quantity
                    </p>

                    <div className="flex items-center justify-between md:justify-start md:gap-10">

                        {/* Stepper */}
                        <div className="flex border border-gray-200 bg-[#faf9f7]">
                            <button
                                onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                                className="w-10 h-10 text-sm hover:bg-black hover:text-white transition"
                            >
                                −
                            </button>

                            <div className="w-12 h-10 flex items-center justify-center font-serif text-lg border-x border-gray-200">
                                {quantity}
                            </div>

                            <button
                                onClick={() => setQuantity((p) => p + 1)}
                                className="w-10 h-10 text-sm hover:bg-black hover:text-white transition"
                            >
                                +
                            </button>
                        </div>

                        {/* Total */}
                        <p className="font-serif text-sm text-gray-500">
                            Total{" "}
                            <span className="text-black font-medium ml-1">
                                Rs. {(product?.productPrice * quantity)?.toLocaleString()}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:block mt-8">
                    <button
                        onClick={handleAddToCart}
                        disabled={loading}
                        className="
      w-full
      bg-black text-white
      hover:bg-[#e8d87f] hover:text-black
      border border-black
      py-4
      flex items-center justify-center gap-3
      uppercase tracking-[0.2em] text-[10px]
      font-light
      transition-all duration-300
      disabled:opacity-60
    "
                    >
                        {loading ? (
                            <span className="animate-pulse">Adding...</span>
                        ) : (
                            <>
                                <span>Add to Bag</span>
                                <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                                <span className="font-serif text-[13px] tracking-normal">
                                    Rs. {(product?.productPrice * quantity)?.toLocaleString()}
                                </span>
                            </>
                        )}
                    </button>

                    {/* Trust Row */}
                    <div className="flex gap-6 mt-4 text-[10px] uppercase tracking-wide text-gray-400">
                        <span>Secure Checkout</span>
                        <span>Easy Returns</span>
                        <span>Fast Dispatch</span>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-4 md:hidden">
                <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="w-full h-12 bg-black text-white uppercase tracking-[0.2em] text-[11px]"
                >
                    {loading
                        ? "Processing..."
                        : `Add to Bag • Rs. ${(product?.productPrice * quantity)?.toLocaleString()}`}
                </button>
            </div>
        </>
    );
};

export default ProductDesc;