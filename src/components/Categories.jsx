import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
  const { navigate } = useAppContext();

  if (!categories || categories.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No categories available.
      </p>
    );
  }

  return (
    <div id="collections-section" className="mt-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <p className="text-2xl font-medium md:text-3xl">Collections</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 mt-6">
        {categories.map((category, index) => {
          if (!category?.path) return null;

          const path = category.path.toLowerCase();

          return (
            <div
              key={index}
              id="scale"
              className="group flex flex-col items-center justify-center cursor-pointer gap-2 py-5 px-3 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              style={{ backgroundColor: category.bgColor || '#fff' }}
              onClick={() => {
                if (!path) return;
                navigate(`/products/${path}`);
                scrollTo(0, 0);
              }}
            >
              {category.image && (
                <img
                  src={category.image}
                  alt={category.text || path}
                  className="group-hover:scale-110 transition-transform duration-300 max-w-28 h-20"
                />
              )}
              <p className="font-medium text-sm text-center">
                {category.text || path}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;

