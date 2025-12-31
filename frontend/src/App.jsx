import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewToggle from './components/ViewToggle';
import ApplicationTable from './components/ApplicationTable';
import ApplicationCard from './components/ApplicationCard';
import AddProgramModal from './components/AddProgramModal';
import ProgramDetailModal from './components/ProgramDetailModal';
import { Plus, Search, Filter, Star } from 'lucide-react';

function App() {
  const [view, setView] = useState('table');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/programs');
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Make sure the backend is running and Google Sheets is configured.");
      setLoading(false);
      // Mock data for demonstration if API fails
      setApplications([
        {
          "School Name": "Stanford University",
          "Program Title": "M.Sc. Computer Science",
          "URL": "https://cs.stanford.edu",
          "Location": "Stanford, USA",
          "Fit Score": 9,
          "Calculated Rank": 88.5,
          "Application Deadline": "2026-01-15",
          "Tuition Cost": 55000,
          "Status": "Researching"
        },
        {
          "School Name": "ETH Zurich",
          "Program Title": "Master in Computer Science",
          "URL": "https://inf.ethz.ch",
          "Location": "Zurich, Switzerland",
          "Fit Score": 10,
          "Calculated Rank": 92.1,
          "Application Deadline": "2025-12-15",
          "Tuition Cost": 1500,
          "Status": "To Apply"
        }
      ]);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app["School Name"]?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app["Program Title"]?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app["Location"]?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "All" || app["Status"] === filterStatus;
    
    const matchesStarred = !showStarredOnly || (app["Is Favorite"] === true || app["Is Favorite"] === "TRUE");
    
    return matchesSearch && matchesStatus && matchesStarred;
  });

  return (
    <div className="min-h-screen bg-[#05070a] md:py-8 md:px-4">
      <div className="max-w-[1700px] mx-auto bg-[#0b0e14] min-h-screen md:min-h-[90vh] rounded-none md:rounded-[3rem] shadow-2xl border-none md:border md:border-gray-800/50 overflow-hidden">
        <header className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Master's <span className="text-blue-500">Tracker</span>
            </h1>
            <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-lg">Find a school My Man, you'll need a Masters.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search schools, programs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl md:rounded-2xl py-2.5 md:py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64 lg:w-80 transition-all text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-900 border border-gray-800 rounded-xl md:rounded-2xl py-2.5 md:py-3 pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full appearance-none text-white cursor-pointer"
                >
                  <option>All</option>
                  <option>Researching</option>
                  <option>To Apply</option>
                  <option>In Progress</option>
                  <option>Submitted</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </div>

              <button 
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl border transition-all ${
                  showStarredOnly 
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' 
                    : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
                }`}
                title="Show Starred Only"
              >
                <Star size={20} fill={showStarredOnly ? "currentColor" : "none"} />
              </button>
              
              <div className="hidden sm:block">
                <ViewToggle view={view} setView={setView} />
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-sm font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={18} className="mr-2" /> <span className="whitespace-nowrap">Add Program</span>
            </button>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 md:px-6 pb-10 md:pb-20">
          {/* Mobile View Toggle (only visible on small screens) */}
          <div className="sm:hidden mb-6">
            <ViewToggle view={view} setView={setView} />
          </div>

          {isModalOpen && (
            <AddProgramModal 
              onClose={() => setIsModalOpen(false)} 
              onSuccess={() => {
                setIsModalOpen(false);
                fetchApplications();
              }} 
            />
          )}
          {selectedProgram && (
            <ProgramDetailModal 
              program={selectedProgram}
              onClose={() => setSelectedProgram(null)}
              onSuccess={() => {
                setSelectedProgram(null);
                fetchApplications();
              }}
            />
          )}
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl mb-8 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/30 rounded-[2rem] border border-dashed border-gray-800">
                  <Search size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500">No programs found matching your criteria.</p>
                </div>
              ) : (
                <>
                  {view === 'table' ? (
                    <div className="hidden md:block">
                      <ApplicationTable 
                        applications={filteredApplications} 
                        onSelect={(app) => setSelectedProgram(app)}
                      />
                    </div>
                  ) : null}
                  
                  <div className={`${view === 'table' ? 'md:hidden' : ''} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`}>
                    {filteredApplications.map((app, idx) => (
                      <ApplicationCard 
                        key={idx} 
                        app={app} 
                        onSelect={() => setSelectedProgram(app)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
