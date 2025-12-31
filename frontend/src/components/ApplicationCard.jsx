import React from 'react';
import { MapPin, Calendar, DollarSign, ExternalLink, Star } from 'lucide-react';

const getCurrencySymbol = (currency) => {
  const symbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': '$',
    'AUD': '$',
    'INR': '₹',
    'CNY': '¥',
    'JPY': '¥'
  };
  return symbols[currency] || '$';
};

const ApplicationCard = ({ app, onSelect }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl hover:border-blue-500/50 transition-all group relative overflow-hidden">
      {(app["Is Favorite"] === true || app["Is Favorite"] === "TRUE") && (
        <div className="absolute top-0 right-0 p-4">
          <Star size={20} className="text-yellow-500 fill-yellow-500" />
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div className="cursor-pointer" onClick={onSelect}>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {app["School Name"]}
          </h3>
          <p className="text-gray-400 text-sm">{app["Program Title"]}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-yellow-500 font-bold">{app["Calculated Rank"]}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Rank Score</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-300 text-sm">
          <MapPin size={16} className="mr-2 text-gray-500" />
          {app["Location"]}
        </div>
        <div className="flex items-center text-gray-300 text-sm">
          <Calendar size={16} className="mr-2 text-gray-500" />
          Deadline: {app["Application Deadline"]}
        </div>
        <div className="flex items-center text-gray-300 text-sm">
          <DollarSign size={16} className="mr-2 text-gray-500" />
          Cost: {getCurrencySymbol(app["Currency"])}{app["Tuition Cost"]}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-gray-800/50 p-2 rounded-lg">
          <div className="text-[10px] text-gray-500 uppercase">Fit Score</div>
          <div className="text-blue-400 font-bold">{app["Fit Score"]}/10</div>
        </div>
        <div className="bg-gray-800/50 p-2 rounded-lg">
          <div className="text-[10px] text-gray-500 uppercase">Status</div>
          <div className="text-green-400 font-bold text-xs truncate">{app["Status"]}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <a 
          href={app["URL"]} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Program <ExternalLink size={12} className="ml-1" />
        </a>
        <button 
          onClick={onSelect}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
