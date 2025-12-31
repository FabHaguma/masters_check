import React from 'react';
import { ExternalLink, Eye, Star } from 'lucide-react';

const ApplicationTable = ({ applications, onSelect }) => {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-3xl shadow-2xl border border-gray-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-300 uppercase text-xs font-semibold">
            <th className="px-6 py-4">School & Program</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4 text-center">Fit</th>
            <th className="px-6 py-4 text-center">Rank</th>
            <th className="px-6 py-4">Deadline</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {applications.map((app, idx) => (
            <tr key={idx} className="hover:bg-gray-800/50 transition-colors group">
              <td className="px-6 py-4 cursor-pointer" onClick={() => onSelect(app)}>
                <div className="flex items-center gap-3">
                  {(app["Is Favorite"] === true || app["Is Favorite"] === "TRUE") && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{app["School Name"]}</div>
                    <div className="text-sm text-gray-400">{app["Program Title"]}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-300">{app["Location"]}</td>
              <td className="px-6 py-4 text-center">
                <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-medium">
                  {app["Fit Score"]}/10
                </span>
              </td>
              <td className="px-6 py-4 text-center font-mono text-yellow-500 font-bold">{app["Calculated Rank"]}</td>
              <td className="px-6 py-4 text-gray-300 text-sm">{app["Application Deadline"]}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  app["Status"] === 'Accepted' ? 'bg-green-900/30 text-green-400' :
                  app["Status"] === 'Rejected' ? 'bg-red-900/30 text-red-400' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {app["Status"]}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button 
                    onClick={() => onSelect(app)}
                    className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  {app["URL"] && (
                    <a 
                      href={app["URL"]} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all"
                      title="Visit Website"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
