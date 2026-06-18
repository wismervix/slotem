/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Mail, MapPin, Award, User, Sparkles } from 'lucide-react';
import { CustomerProfile } from '@/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  onSave: (updated: CustomerProfile) => void;
}

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [tier, setTier] = useState(profile.tier);
  const [city, setCity] = useState(profile.city);
  const [active, setActive] = useState(profile.active);
  const [avatar, setAvatar] = useState(profile.avatar);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setEmail(profile.email);
      setTier(profile.tier);
      setCity(profile.city);
      setActive(profile.active);
      setAvatar(profile.avatar);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({
      ...profile,
      name,
      email,
      tier,
      city,
      active,
      avatar
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      id="edit_profile_backdrop"
    >
      <div 
        className="bg-white rounded-2xl border border-[#ccc3d8]/40 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="edit_profile_dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ccc3d8]/30 flex justify-between items-center bg-[#fef7ff]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#630ed4]" />
            <h3 className="font-semibold text-lg text-[#25005a]">Edit Profile</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#4a4455]/70 hover:bg-[#e8dfee]/50 hover:text-[#630ed4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Avatar simulation preview */}
          <div className="flex items-center gap-4 py-2 border-b border-[#f3ebfa]">
            <img 
              src={avatar} 
              alt="Avatar Previews" 
              className={`w-16 h-16 rounded-full border-2 ${active ? 'border-emerald-500' : 'border-neutral-300'} object-cover shadow-sm`}
            />
            <div className="flex-grow">
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1">Avatar Image URL</label>
              <input 
                type="text" 
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#ccc3d8] rounded-lg text-xs font-mono focus:ring-1 focus:ring-[#630ed4] focus:border-[#630ed4] bg-neutral-50"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#630ed4]" /> Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#630ed4]" /> Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#630ed4]" /> Member Tier
              </label>
              <select 
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white"
              >
                <option value="Premium Member">Premium Member</option>
                <option value="Regular Member">Regular Member</option>
                <option value="VIP Client">VIP Client</option>
                <option value="Enterprise Lead">Enterprise Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4a4455] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#630ed4]" /> City / Location
              </label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#ccc3d8] rounded-xl focus:ring-2 focus:ring-[#630ed4]/20 focus:border-[#630ed4] text-sm text-[#1d1a24] bg-white"
                placeholder="Chicago, IL"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[#f3ebfa]">
            <input 
              type="checkbox" 
              id="active_status"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 text-[#630ed4] focus:ring-[#630ed4] border-neutral-300 rounded cursor-pointer"
            />
            <label htmlFor="active_status" className="text-sm font-medium text-[#1d1a24] cursor-pointer selection:bg-transparent">
              Show client as active (Active Status Indicator)
            </label>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-5 justify-end">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-[#ccc3d8] rounded-xl text-sm font-semibold text-[#4a4455] hover:bg-[#e8dfee]/30 active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-[#630ed4] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
