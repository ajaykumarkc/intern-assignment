import React from 'react';
import { DisplayStarRating } from './StarRating';

const FoodCard = ({ item }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-700">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover"/>
      <div className="p-5">
        <h3 className="font-semibold text-xl text-white mb-1 truncate" title={item.name}>
          {item.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 h-10 overflow-hidden text-ellipsis">
          {item.description}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-lg text-red-500">${item.price.toFixed(2)}</span>
          <div className="flex items-center">
            <DisplayStarRating value={Math.round(item.rating)} />
            <span className="ml-1.5 text-sm text-gray-400">({item.rating.toFixed(1)})</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          <span className="font-medium text-gray-300">{item.category}</span> • {item.deliveryTime}
        </div>
        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard; 