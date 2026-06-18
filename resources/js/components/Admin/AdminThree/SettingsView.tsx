/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Bell, 
  Lock, 
  Check,
  ShieldCheck,
  Building
} from 'lucide-react';
import { SERVICES_CATALOG } from '@/data/initial-data-four';
import { ServiceDetail } from '@/types';

export default function SettingsView() {
  const [businessName, setBusinessName] = useState('Slotem');
  const [adminEmail, setAdminEmail] = useState('manager@slotem.co');
  const [currency, setCurrency] = useState('USD ($)');
  const [taxRate, setTaxRate] = useState(8.5);
  const [bufferTime, setBufferTime] = useState('15 mins');

  // Interactive local services catalog state
  const [services, setServices] = useState<ServiceDetail[]>(SERVICES_CATALOG);
  
  // States to add new service
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(100);
  const [newServiceDuration, setNewServiceDuration] = useState(60);
  const [newServiceCategory, setNewServiceCategory] = useState('Consulting');

  // Notifications setting checkboxes
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(false);
  const [notifSMS, setNotifSMS] = useState(true);

  // Success alert trigger
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newSrv: ServiceDetail = {
      id: `srv-${Date.now()}`,
      name: newServiceName,
      price: newServicePrice,
      duration: newServiceDuration,
      category: newServiceCategory
    };

    setServices([...services, newSrv]);
    setNewServiceName('');
    setNewServicePrice(100);
    setNewServiceDuration(60);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div id="settings_view" className="space-y-6 animate-in fade-in duration-300 text-left">
      
      {/* Alert badge */}
      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-800 flex items-center justify-between shadow-sm" id="settings_saved_alert">
          <p className="text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 bg-emerald-600 text-white rounded-full p-0.5" />
            <span>Success: All Slotem Admin Suite configurations committed to runtime state!</span>
          </p>
        </div>
      )}

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* General admin customizer inputs */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveAll} className="bg-white border border-[#ccc3d8]/40 rounded-2xl p-6 shadow-sm space-y-5">
            
            <div className="border-b border-[#ccc3d8]/30 pb-4 mb-2 flex justify-between items-center bg-[#fef7ff]/10">
              <div>
                <h3 className="font-semibold text-base text-[#25005a] flex items-center gap-1.5 animate-pulse">
                  <Building className="w-5 h-5 text-[#630ed4]" /> General configurations
                </h3>
                <p className="text-xs text-[#4a4455]/70 mt-0.5">Customize your general Slotem platform profile details.</p>
              </div>

              <button 
                type="submit"
                className="bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5">Business / Hub Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#ccc3d8] rounded-xl text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5">Lead Admin Email</label>
                <input 
                  type="email" 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#ccc3d8] rounded-xl text-sm bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5">Operational Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#ccc3d8] rounded-xl text-sm bg-white focus:ring-[#630ed4] text-gray-700"
                >
                  <option value="USD ($)">USD ($) United States</option>
                  <option value="EUR (€)">EUR (€) Europe</option>
                  <option value="GBP (£)">GBP (£) United Kingdom</option>
                  <option value="CAD ($)">CAD ($) Canada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5">Booking Surcharge (%)</label>
                <input 
                  type="number" 
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 border border-[#ccc3d8] rounded-xl text-sm bg-white"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5">Buffer Space Between Slots</label>
                <select 
                  value={bufferTime} 
                  onChange={(e) => setBufferTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#ccc3d8] rounded-xl text-sm bg-white focus:ring-[#630ed4] text-gray-700"
                >
                  <option value="None">None (Instant back-to-back)</option>
                  <option value="15 mins">15 mins</option>
                  <option value="30 mins">30 mins</option>
                  <option value="1 hour">1 hour buffer</option>
                </select>
              </div>
            </div>

            {/* Notification checkboxes */}
            <div className="pt-4 border-t border-[#ccc3d8]/20 space-y-3">
              <span className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Bell className="w-4 h-4 text-[#630ed4]" /> Notification Integrations
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50/50 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="w-4 h-4 text-[#630ed4] focus:ring-[#630ed4] border-neutral-300 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold block">Email Warnings</span>
                    <span className="text-[10px] text-gray-400">Notifies lead manager</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50/50 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={notifSlack}
                    onChange={(e) => setNotifSlack(e.target.checked)}
                    className="w-4 h-4 text-[#630ed4] focus:ring-[#630ed4] border-neutral-300 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold block">Slack Webhook</span>
                    <span className="text-[10px] text-gray-400">Stream into workspace</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50/50 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={notifSMS}
                    onChange={(e) => setNotifSMS(e.target.checked)}
                    className="w-4 h-4 text-[#630ed4] focus:ring-[#630ed4] border-neutral-300 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold block">SMS Alerts</span>
                    <span className="text-[10px] text-gray-400">Cell phone logs check</span>
                  </div>
                </label>
              </div>
            </div>

          </form>

          {/* Service Listing catalog, add / remove */}
          <div className="bg-white border border-[#ccc3d8]/40 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-[#25005a] mb-2 flex items-center gap-1.5 border-b border-neutral-100 pb-3 uppercase tracking-wider">
              <Briefcase className="w-5 h-5 text-[#630ed4]" /> Corporate Offerings Catalog
            </h3>
            <p className="text-xs text-[#4a4455]/70 pb-4">Adjust default services bookable globally. Adds dynamic selections inside New Booking sheets.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" id="services_catalog_section">
              {services.map((srv) => (
                <div key={srv.id} className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60 flex items-center justify-between text-xs transition-colors hover:bg-white hover:border-[#ccc3d8]/60 shadow-xs">
                  <div>
                    <span className="bg-[#eaddff] text-[#25005a] px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase">
                      {srv.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#1d1a24] mt-1">{srv.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#630ed4]" /> Duration: {srv.duration} mins
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3 shrink-0">
                    <div>
                      <span className="font-extrabold text-sm text-[#630ed4]">${srv.price}</span>
                      <span className="block text-[8px] text-gray-400 uppercase tracking-wide">Base price</span>
                    </div>

                    <button 
                      onClick={() => handleDeleteService(srv.id)}
                      className="p-1 rounded-full text-neutral-300 hover:text-red-600 hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Quick add service floating form (Col span 1) */}
        <div>
          <div className="bg-[#fef7ff]/40 border border-[#ccc3d8]/40 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-[#25005a] mb-2 flex items-center gap-1.5 border-b border-[#ccc3d8]/20 pb-3">
              <Plus className="w-4 h-4 text-[#630ed4]" /> Add New Service
            </h3>
            <p className="text-xs text-[#4a4455]/70 pb-4">Define a new booking item with duration and price to offer customers.</p>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Service Title</label>
                <input 
                  type="text" 
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Executive Retainer Kickoff"
                  className="w-full px-3 py-2 border border-[#ccc3d8] rounded-xl text-xs bg-white text-[#1d1a24]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price Rate ($)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-gray-400 text-xs">$</span>
                  <input 
                    type="number" 
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(parseInt(e.target.value) || 0)}
                    className="w-full pl-6 pr-3 py-1.5 border border-[#ccc3d8] rounded-xl text-xs bg-white text-[#1d1a24]"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration (minutes)</label>
                <select 
                  value={newServiceDuration} 
                  onChange={(e) => setNewServiceDuration(parseInt(e.target.value) || 30)}
                  className="w-full px-2 py-1.5 border border-[#ccc3d8] rounded-xl text-xs bg-white text-gray-700"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour (60m)</option>
                  <option value="90">1.5 hours (90m)</option>
                  <option value="120">2 hours (120m)</option>
                  <option value="180">3 hours workshop (180m)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Silo / Category</label>
                <select 
                  value={newServiceCategory} 
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#ccc3d8] rounded-xl text-xs bg-white text-gray-700"
                >
                  <option value="Advisory">Advisory Silo</option>
                  <option value="Consulting">Consulting Silo</option>
                  <option value="Creative">Creative Silo</option>
                  <option value="Technical">Technical Audit</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-[#630ed4] hover:bg-[#7c3aed] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Append Catalogue Item
              </button>
            </form>
          </div>

          {/* security certificate visual card */}
          <div className="bg-white border border-[#ccc3d8]/40 p-4 rounded-2xl text-xs space-y-2 mt-4 text-[#4a4455]/85 leading-relaxed">
            <span className="font-bold text-[#630ed4] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Secure Admin Control
            </span>
            <p className="text-[11px]">
              Platform endpoints and scheduler logic are covered by TLS 1.3 encryption. Settings committed here apply constraints globally immediately.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
