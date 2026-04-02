import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';

const NavTreeItem = ({ item, depth = 0, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const Icon = item.icon;

  return (
    <div className="flex flex-col">
      <div 
        className={`flex items-center justify-between group transition-all duration-300 ${
          depth === 0 ? 'text-lg font-light tracking-widest uppercase' : 'text-sm font-light tracking-wider'
        } ${isExpanded ? 'text-[#e8d87f]' : 'text-gray-800 hover:text-[#e8d87f]'}`}
      >
        <div className="flex items-center gap-4 flex-1">
          {Icon && <Icon className={`w-5 h-5 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />}
          
          {item.path && !hasChildren ? (
            <Link 
              to={item.path} 
              className="flex-1 py-2"
              onClick={() => onNavigate && onNavigate()}
            >
              {item.name}
            </Link>
          ) : (
            <button 
              onClick={handleToggle}
              className="flex-1 text-left py-2"
            >
              {item.name}
            </button>
          )}
        </div>

        {hasChildren && (
          <button 
            onClick={handleToggle}
            className="p-2 transition-transform duration-300"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Children container with smooth transition */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100 mt-2 ml-4 border-l border-gray-100 pl-4' : 'max-h-0 opacity-0'
        }`}
      >
        {hasChildren && item.children.map((child, idx) => (
          <NavTreeItem 
            key={idx} 
            item={child} 
            depth={depth + 1} 
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};

const NavTree = ({ data, onNavigate }) => {
  return (
    <div className="flex flex-col gap-6">
      {data.map((item, idx) => (
        <NavTreeItem 
          key={idx} 
          item={item} 
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
};

export default NavTree;
