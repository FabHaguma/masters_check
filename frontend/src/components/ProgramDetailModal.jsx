import React, { useState } from 'react';
import axios from 'axios';
import { X, Edit2, Save, Trash2, ExternalLink, MapPin, Mail, Calendar, DollarSign, Clock, BookOpen, CheckCircle, Info, Star } from 'lucide-react';

function ProgramDetailModal({ program, onClose, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Helper to safely get values from the program object (which has keys with spaces from Google Sheets)
  const getVal = (key, fallback = "") => {
    const val = program[key];
    if (val === undefined || val === null) return fallback;
    return val;
  };

  const [formData, setFormData] = useState({
    school_name: getVal("School Name"),
    program_title: getVal("Program Title"),
    url: getVal("URL"),
    location: getVal("Location"),
    contact_email: getVal("Contact Email"),
    fit_score: parseInt(getVal("Fit Score", 5)),
    pros: getVal("Pros"),
    cons: getVal("Cons"),
    curriculum_focus: getVal("Curriculum Focus"),
    application_deadline: getVal("Application Deadline"),
    tuition_cost: parseFloat(getVal("Tuition Cost", 0)) || 0,
    currency: getVal("Currency", "USD"),
    application_fee: parseFloat(getVal("Application Fee", 0)) || 0,
    funding_scholarships: getVal("Funding/Scholarships"),
    duration: getVal("Duration"),
    gre_gmat_required: getVal("GRE/GMAT Required", "Optional"),
    letters_of_rec_qty: parseInt(getVal("Letters of Rec Qty", 0)),
    english_test: getVal("English Test"),
    sop_essay_done: getVal("SOP/Essay Done") === true || getVal("SOP/Essay Done") === "TRUE",
    status: getVal("Status", "Researching"),
    portal_login: getVal("Portal Login"),
    decision_date: getVal("Decision Date"),
    is_favorite: getVal("Is Favorite") === true || getVal("Is Favorite") === "TRUE"
  });

  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    
    setSubmitting(true);
    try {
      const schoolName = program["School Name"] || program.school_name;
      const programTitle = program["Program Title"] || program.program_title;
      await axios.delete(`/api/programs/${encodeURIComponent(schoolName)}/${encodeURIComponent(programTitle)}`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Failed to delete program.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const schoolName = program["School Name"] || program.school_name;
      const programTitle = program["Program Title"] || program.program_title;
      await axios.put(`/api/programs/${encodeURIComponent(schoolName)}/${encodeURIComponent(programTitle)}`, formData);
      setIsEditing(false);
      onSuccess();
    } catch (err) {
      console.error("Error updating program:", err);
      alert("Failed to update program.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const DetailItem = ({ icon: Icon, label, value, color = "text-gray-400" }) => (
    <div className="flex items-start space-x-3">
      <Icon size={18} className={`${color} mt-0.5`} />
      <div>
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{label}</div>
        <div className="text-sm text-gray-200">{value || "Not specified"}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 md:p-4">
      <div className="bg-[#0d1117] border-none md:border md:border-gray-800 rounded-none md:rounded-[2rem] w-full max-w-6xl h-full md:max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-800 flex justify-between items-start bg-[#161b22]">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {isEditing ? "Edit Program" : (program["School Name"] || program.school_name)}
            </h2>
            {!isEditing && <p className="text-blue-400 font-medium text-sm md:text-base">{program["Program Title"] || program.program_title}</p>}
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button 
                  onClick={async () => {
                    const newFavorite = !formData.is_favorite;
                    setFormData(prev => ({ ...prev, is_favorite: newFavorite }));
                    try {
                      const schoolName = program["School Name"] || program.school_name;
                      const programTitle = program["Program Title"] || program.program_title;
                      await axios.put(`/api/programs/${encodeURIComponent(schoolName)}/${encodeURIComponent(programTitle)}`, {
                        ...formData,
                        is_favorite: newFavorite
                      });
                      onSuccess();
                    } catch (err) {
                      console.error("Error toggling favorite:", err);
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    formData.is_favorite 
                      ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' 
                      : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                  }`}
                  title={formData.is_favorite ? "Unstar" : "Star"}
                >
                  <Star size={18} fill={formData.is_favorite ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={submitting}
                  className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Reuse form sections from AddProgramModal but with formData state */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="space-y-4">
                  <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest">A. Identity</h3>
                  <div className="space-y-3">
                    <input name="school_name" value={formData.school_name} onChange={handleChange} placeholder="School Name" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input name="program_title" value={formData.program_title} onChange={handleChange} placeholder="Program Title" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input name="url" value={formData.url} onChange={handleChange} placeholder="URL" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input name="contact_email" value={formData.contact_email} onChange={handleChange} placeholder="Contact Email" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest">B. Fit & Ranking</h3>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, is_favorite: !prev.is_favorite }))}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                        formData.is_favorite 
                          ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' 
                          : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <Star size={14} fill={formData.is_favorite ? "currentColor" : "none"} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {formData.is_favorite ? "Starred" : "Star"}
                      </span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-500">Fit Score (1-10)</label>
                      <input type="number" name="fit_score" min="1" max="10" value={formData.fit_score} onChange={handleChange} className="w-20 bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    </div>
                    <input name="curriculum_focus" value={formData.curriculum_focus} onChange={handleChange} placeholder="Curriculum Focus" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <textarea name="pros" value={formData.pros} onChange={handleChange} placeholder="Pros" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white h-24" />
                    <textarea name="cons" value={formData.cons} onChange={handleChange} placeholder="Cons" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white h-24" />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest">C. Logistics & Cost</h3>
                  <div className="space-y-3">
                    <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" name="tuition_cost" value={formData.tuition_cost} onChange={handleChange} placeholder="Tuition Cost" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                      <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="AUD">AUD ($)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="CNY">CNY (¥)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                    <input type="number" name="application_fee" value={formData.application_fee} onChange={handleChange} placeholder="App Fee" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input name="funding_scholarships" value={formData.funding_scholarships} onChange={handleChange} placeholder="Funding" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest">D & E. Requirements & Status</h3>
                  <div className="space-y-3">
                    <select name="gre_gmat_required" value={formData.gre_gmat_required} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white">
                      <option>Yes</option>
                      <option>No</option>
                      <option>Optional</option>
                    </select>
                    <input type="number" name="letters_of_rec_qty" value={formData.letters_of_rec_qty} onChange={handleChange} placeholder="Letters Qty" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input name="english_test" value={formData.english_test} onChange={handleChange} placeholder="English Test" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <div className="flex items-center space-x-2 p-2">
                      <input type="checkbox" name="sop_essay_done" checked={formData.sop_essay_done} onChange={handleChange} className="w-4 h-4 rounded border-gray-800 bg-gray-900 text-blue-600" />
                      <label className="text-sm text-gray-300">SOP Done</label>
                    </div>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white">
                      <option>Researching</option>
                      <option>To Apply</option>
                      <option>In Progress</option>
                      <option>Submitted</option>
                      <option>Interview</option>
                      <option>Accepted</option>
                      <option>Rejected</option>
                    </select>
                    <input name="portal_login" value={formData.portal_login} onChange={handleChange} placeholder="Portal Login" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                    <input type="date" name="decision_date" value={formData.decision_date} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white" />
                  </div>
                </section>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-800">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-blue-600/20">
                  {submitting ? "Saving..." : <><Save size={18} className="mr-2" /> Save Changes</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              {/* Left Column: Main Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailItem icon={MapPin} label="Location" value={formData.location} color="text-red-400" />
                  <DetailItem icon={Mail} label="Contact" value={formData.contact_email} color="text-blue-400" />
                  <DetailItem icon={Calendar} label="Deadline" value={formData.application_deadline} color="text-yellow-400" />
                  <DetailItem icon={DollarSign} label="Tuition" value={`${getCurrencySymbol(formData.currency)}${formData.tuition_cost}`} color="text-green-400" />
                  <DetailItem icon={Clock} label="Duration" value={formData.duration} color="text-purple-400" />
                  <DetailItem icon={BookOpen} label="Curriculum" value={formData.curriculum_focus} color="text-indigo-400" />
                </div>

                <div className="space-y-6 pt-6 border-t border-gray-800">
                  <div>
                    <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center">
                      <CheckCircle size={16} className="mr-2" /> Pros
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed bg-green-900/10 p-4 rounded-2xl border border-green-900/20">
                      {formData.pros || "No pros listed yet."}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center">
                      <X size={16} className="mr-2" /> Cons
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed bg-red-900/10 p-4 rounded-2xl border border-red-900/20">
                      {formData.cons || "No cons listed yet."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Status & Requirements */}
              <div className="space-y-8 bg-gray-900/50 p-6 md:p-8 rounded-[2rem] border border-gray-800">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Current Status</div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    formData.status === 'Accepted' ? 'bg-green-900/30 text-green-400' :
                    formData.status === 'Rejected' ? 'bg-red-900/30 text-red-400' :
                    'bg-blue-900/30 text-blue-400'
                  }`}>
                    {formData.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requirements</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">GRE/GMAT</span>
                      <span className="text-gray-200 font-medium">{formData.gre_gmat_required}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Letters of Rec</span>
                      <span className="text-gray-200 font-medium">{formData.letters_of_rec_qty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">English Test</span>
                      <span className="text-gray-200 font-medium">{formData.english_test}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">SOP/Essay</span>
                      <span className={formData.sop_essay_done ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                        {formData.sop_essay_done ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Portal Login</div>
                  <div className="text-sm text-gray-300 font-mono bg-black/30 p-3 rounded-xl border border-gray-800">{formData.portal_login || "None"}</div>
                </div>

                {formData.url && (
                  <a 
                    href={formData.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                  >
                    Visit Program Page <ExternalLink size={16} className="ml-2" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgramDetailModal;
