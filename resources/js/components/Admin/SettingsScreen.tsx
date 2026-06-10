import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  UserPlus, 
  Save, 
  Info, 
  Clock, 
  User, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { ClinicService, Staff } from '@/types';

interface SettingsScreenProps {
  services: ClinicService[];
  staff: Staff[];
  onUpdateServices: (updated: ClinicService[]) => void;
  onUpdateStaff: (updated: Staff[]) => void;
}

export default function SettingsScreen({
  services,
  staff,
  onUpdateServices,
  onUpdateStaff
}: SettingsScreenProps) {
  // Local state for adding service
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(100);
  const [newServiceDuration, setNewServiceDuration] = useState(45);
  const [newServiceColor, setNewServiceColor] = useState<'primary' | 'tertiary' | 'muted' | 'error'>('primary');

  // Local state for adding staff members
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Senior Dentist');

  // Clinic General metadata settings form
  const [clinicName, setClinicName] = useState('Slotem Medical & Dental Clinic');
  const [clinicPhone, setClinicPhone] = useState('+1 (555) 782-0000');
  const [lunchHour, setLunchHour] = useState('12:00 PM');
  const [isAutoNotify, setIsAutoNotify] = useState(true);

  // Add a Service template
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    let hexColor = '#630ed4';
    if (newServiceColor === 'tertiary') hexColor = '#7d3d00';
    if (newServiceColor === 'muted') hexColor = '#565e74';
    if (newServiceColor === 'error') hexColor = '#ba1a1a';

    const srv: ClinicService = {
      id: `srv_${Date.now()}`,
      name: newServiceName,
      price: newServicePrice,
      durationMinutes: newServiceDuration,
      color: newServiceColor,
      colorHex: hexColor
    };

    onUpdateServices([...services, srv]);
    setNewServiceName('');
    setNewServicePrice(120);
    setNewServiceDuration(45);
  };

  // Remove service template
  const handleDeleteService = (id: string) => {
    onUpdateServices(services.filter(s => s.id !== id));
  };

  // Add staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const member: Staff = {
      id: `st_${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
      isActive: true,
      onLeave: false,
      colorHex: '#0891b2'
    };

    onUpdateStaff([...staff, member]);
    setNewStaffName('');
  };

  // Toggle staff availability / vacation
  const handleToggleStaffStatus = (id: string, field: 'isActive' | 'onLeave') => {
    const nextList = staff.map(st => {
      if (st.id === id) {
        return { ...st, [field]: !st[field] };
      }
      return st;
    });
    onUpdateStaff(nextList);
  };

  return (
    <div className="animate-fade-in text-[#1d1a24] pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#1d1a24] mb-1">Clinic Config System</h2>
        <p className="text-gray-500">Add staff, service items, and designate operational specifications.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* left column: General metadata and Services Offered list */}
        <div className="space-y-8">
          
          {/* General Clinic Configuration */}
          <div className="bg-white border border-[#e8dfee] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1d1a24] mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#630ed4]" />
              Hospital & Clinic Preferences
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full text-sm p-2.5 bg-gray-50 rounded-lg border border-[#e8dfee] text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#630ed4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Clinical Phone No.</label>
                  <input
                    type="text"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                    className="w-full text-sm p-2.5 bg-gray-50 rounded-lg border border-[#e8dfee] text-gray-800 font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Automatic Breaks (Lunch)</label>
                  <input
                    type="text"
                    value={lunchHour}
                    onChange={(e) => setLunchHour(e.target.value)}
                    className="w-full text-sm p-2.5 bg-gray-50 rounded-lg border border-[#e8dfee] text-gray-800 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Patient SMS Notifications</p>
                  <p className="text-xs text-gray-400">Dispatch reminders automatically 24 hours prior to meetings.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isAutoNotify}
                  onChange={(e) => setIsAutoNotify(e.target.checked)}
                  className="w-5 h-5 text-[#630ed4] rounded border-gray-300 focus:ring-[#630ed4] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Service items manager offered list */}
          <div className="bg-white border border-[#e8dfee] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1d1a24] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#630ed4]" />
              Treatments & Pricing
            </h3>

            {/* List Services */}
            <div className="divide-y divide-gray-100 mb-6 max-h-[280px] overflow-y-auto hide-scrollbar">
              {services.map((srv) => (
                <div key={srv.id} className="py-3 flex justify-between items-center pr-2">
                  <div className="flex items-center gap-3">
                    <span 
                      style={{ backgroundColor: srv.colorHex }}
                      className="w-3 h-3 rounded-full shrink-0" 
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-700">{srv.name}</p>
                      <span className="text-xs text-gray-400 font-semibold">{srv.durationMinutes} minutes duration</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-gray-900">${srv.price}</span>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-gray-50 transition-colors"
                      title="Delete Service template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add service form dialog */}
            <form onSubmit={handleAddService} className="border-t border-gray-100 pt-4 space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase">Create Treatment Template</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="e.g. Tooth Extraction"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#630ed4]"
                  required
                />
                
                <input
                  type="number"
                  placeholder="Price Plan ($)"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-gray-50 border rounded-lg focus:outline-none"
                  min={1}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                  className="w-full bg-gray-50 border rounded-lg text-xs py-2 px-3 text-gray-700"
                >
                  <option value={15}>15 mins duration</option>
                  <option value={30}>30 mins duration</option>
                  <option value={45}>45 mins duration</option>
                  <option value={60}>60 mins duration</option>
                  <option value={90}>1.5 Hrs duration</option>
                </select>

                <select
                  value={newServiceColor}
                  onChange={(e) => setNewServiceColor(e.target.value as any)}
                  className="w-full bg-gray-50 border rounded-lg text-xs py-2 px-3 text-gray-700"
                >
                  <option value="primary">Primary Accent (Purple)</option>
                  <option value="tertiary">Gold/Brown Accent</option>
                  <option value="muted">Slate Accent</option>
                  <option value="error">Rose Red Accent</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#630ed4] text-white hover:bg-[#7c3aed] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Add Service Template
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Dentist staff and rooms management list */}
        <div className="space-y-8">
          <div className="bg-white border border-[#e8dfee] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1d1a24] mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#630ed4]" />
              Staff Roster Management
            </h3>

            {/* List staff */}
            <div className="divide-y divide-gray-100 mb-6 max-h-[380px] overflow-y-auto hide-scrollbar">
              {staff.map((member) => (
                <div key={member.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{member.name}</h4>
                      <p className="text-[11px] text-gray-500 font-semibold">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleStaffStatus(member.id, 'isActive')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                        member.isActive 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Inactive'}
                    </button>

                    {/* Vacation check */}
                    <button
                      onClick={() => handleToggleStaffStatus(member.id, 'onLeave')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                        member.onLeave 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {member.onLeave ? 'On Vacation' : 'Ready'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Staff form */}
            <form onSubmit={handleAddStaff} className="border-t border-gray-100 pt-4 space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase">Recruit New Practitioner</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Doctor Name (e.g. Elena Vance)"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 border rounded-lg focus:outline-none"
                  required
                />

                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full bg-gray-50 border rounded-lg text-xs py-2 px-3 text-gray-700"
                >
                  <option value="Senior Dentist">Senior Dentist</option>
                  <option value="Orthodontist Specialist">Orthodontist Specialist</option>
                  <option value="Pediatric Specialist">Pediatric Specialist</option>
                  <option value="Dental Assistant">Dental Assistant</option>
                  <option value="Receptionist">Clinic Receptionist</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Enroll New Practitioner
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
