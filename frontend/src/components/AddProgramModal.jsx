import React, { useState } from 'react';
import axios from 'axios';
import { X, Star } from 'lucide-react';

function AddProgramModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    school_name: "",
    program_title: "",
    url: "",
    location: "",
    contact_email: "",
    fit_score: 5,
    pros: "",
    cons: "",
    curriculum_focus: "",
    application_deadline: "",
    tuition_cost: 0,
    application_fee: 0,
    funding_scholarships: "",
    duration: "",
    gre_gmat_required: "Optional",
    letters_of_rec_qty: 0,
    english_test: "",
    sop_essay_done: false,
    status: "Researching",
    portal_login: "",
    decision_date: "",
    is_favorite: false
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/programs', formData);
      onSuccess();
    } catch (err) {
      console.error("Error saving program:", err);
      alert("Failed to save program. Check console for details.");
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

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 md:p-4">
      <div className="bg-[#0d1117] border-none md:border md:border-gray-800 rounded-none md:rounded-[2rem] w-full max-w-4xl h-full md:max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-800 sticky top-0 bg-[#161b22] z-10">
          <h2 className="text-xl md:text-2xl font-bold text-white">Add New Program</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          {/* A. Identity */}
          <section>
            <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-6">A. Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">School Name*</label>
                <input name="school_name" value={formData.school_name} onChange={handleChange} required className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Program Title*</label>
                <input name="program_title" value={formData.program_title} onChange={handleChange} required className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">URL</label>
                <input name="url" value={formData.url} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Contact Email</label>
                <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* B. Fit & Ranking */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest">B. Fit & Ranking</h3>
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_favorite: !prev.is_favorite }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  formData.is_favorite 
                    ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' 
                    : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
                }`}
              >
                <Star size={18} fill={formData.is_favorite ? "currentColor" : "none"} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {formData.is_favorite ? "Starred" : "Star this Program"}
                </span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">My Fit Score (1-10)</label>
                <input type="number" name="fit_score" min="1" max="10" value={formData.fit_score} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Curriculum Focus</label>
                <input name="curriculum_focus" value={formData.curriculum_focus} onChange={handleChange} placeholder="Research, Practical, etc." className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pros</label>
                <textarea name="pros" value={formData.pros} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none h-24 transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Cons</label>
                <textarea name="cons" value={formData.cons} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none h-24 transition-all" />
              </div>
            </div>
          </section>

          {/* C. Logistics & Cost */}
          <section>
            <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-6">C. Logistics & Cost</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Deadline</label>
                <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tuition Cost (Total)</label>
                <input type="number" name="tuition_cost" value={formData.tuition_cost} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">App Fee</label>
                <input type="number" name="application_fee" value={formData.application_fee} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Duration</label>
                <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 2 years" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Funding/Scholarships</label>
                <input name="funding_scholarships" value={formData.funding_scholarships} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* D. Requirements */}
          <section>
            <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-6">D. Requirements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">GRE/GMAT</label>
                <select name="gre_gmat_required" value={formData.gre_gmat_required} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all">
                  <option>Yes</option>
                  <option>No</option>
                  <option>Optional</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Letters of Rec (Qty)</label>
                <input type="number" name="letters_of_rec_qty" value={formData.letters_of_rec_qty} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">English Test</label>
                <input name="english_test" value={formData.english_test} onChange={handleChange} placeholder="TOEFL/IELTS score" className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="flex items-center space-x-3 p-2">
                <input type="checkbox" name="sop_essay_done" checked={formData.sop_essay_done} onChange={handleChange} className="w-5 h-5 bg-gray-900 border-gray-800 rounded-lg text-blue-600 transition-all" />
                <label className="text-sm text-gray-300 font-medium">SOP/Essay Done</label>
              </div>
            </div>
          </section>

          {/* E. Status */}
          <section>
            <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-6">E. Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all">
                  <option>Researching</option>
                  <option>To Apply</option>
                  <option>In Progress</option>
                  <option>Submitted</option>
                  <option>Interview</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Portal Login</label>
                <input name="portal_login" value={formData.portal_login} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Decision Date</label>
                <input type="date" name="decision_date" value={formData.decision_date} onChange={handleChange} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-800 sticky bottom-0 bg-[#0d1117] pb-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              {submitting ? "Saving..." : "Add Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProgramModal;
