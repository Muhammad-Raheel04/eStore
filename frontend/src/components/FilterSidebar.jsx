import React from 'react'
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

const FilterSidebar = ({ search, setSearch, category, setCategory, type, setType, typeDefs, setPriceRange, priceRange, onFilterApply }) => {
  const Types = ["All", ...(Array.isArray(typeDefs) ? typeDefs.map(t => t.type) : [])];
  const UniqueCategory = type && type !== "All"
    ? ["All", ...(typeDefs?.find(t => t.type === type)?.categories || [])]
    : ["All"];
  const handleCategoryClick = (val) => {
    setCategory(val)
    onFilterApply?.()
  }

  const handleTypeClick = (val) => {
    setType(val);
    setCategory("All");
    onFilterApply?.();
  }
  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]])
      // onFilterApply?.();
    }
  }

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value])
      // onFilterApply?.();
    }
  }

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setType("All");
    setPriceRange([0, 999999])
    onFilterApply?.();
  }
  return (
    <div className="
 bg-gray-100 
  mt-5 
  p-4 
  rounded-md 
  w-full 
  md:w-64 
  md:mt-10 
  md:sticky 
  md:top-24
">
      {/* Search */}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="bg-white p-2 rounded-md border-gray-400 border-2 w-full" />

      {/* Category */}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {UniqueCategory.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={category === item}
              onChange={() => handleCategoryClick(item)}
              id={`category-${index}`} />
            <Label htmlFor={`category-${index}`}>{item === "All" ? "Categories" : item}</Label>
          </div>
        ))}
      </div>

      {/* Type */}
      <h1 className="mt-5 font-semibold text-xl">Type</h1>
      <div className="flex flex-col gap-2 mt-3">
        {Types.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              checked={type === item}
              onChange={() => handleTypeClick(item)}
              id={`type-${index}`} />
            <Label htmlFor={`type-${index}`}>{item === "All" ? "Types" : item.charAt(0).toUpperCase() + item.slice(1)}</Label>
          </div>
        ))}
      </div>
      {/* price range */}
      <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
      <div className='flex flex-col gap-2'>
        <label>
          Price Range: Rs{priceRange[0]} - {priceRange[1]}
        </label>
        <div className="flex gap-2 items-center">
          <input type="number" min="0" max="5000" value={priceRange[0]} onChange={handleMinChange} className="w-20 p-1 border border-gray-300 rounded" />
          <input type="number" min="0" max="999999" value={priceRange[1]} onChange={handleMaxChange} className="w-20 p-1 border border-gray-300 rounded" />
        </div>
        <div>
          <input type="range" min="0" value={priceRange[0]} onChange={handleMinChange} max="5000" step="100" className='w-full' />
          <input type="range" min="0" value={priceRange[1]} onChange={handleMaxChange} max="999999" step="100" className='w-full' />
        </div>
        {/* Reset button */}
        <Button onClick={resetFilters} className="bg-white text-black border border-black hover:bg-black hover:text-white mt-5 cursor-pointer w-full" >Reset Filter</Button>
      </div>
    </div>
  );
}

export default FilterSidebar;
