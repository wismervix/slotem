import React, { useState } from 'react';
import { Upload, Info, HeartHandshake, Shield, UserPlus, Trash2, Edit, Check, Settings, Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import { BusinessProfile, BookingRules, TeamMember } from '@/types';

interface SettingsTabProps {
  businessProfile: BusinessProfile;
  bookingRules: BookingRules;
  teamMembers: TeamMember[];
  onSave: (profile: BusinessProfile, rules: BookingRules) => void;
  onAddTeamMember: (member: Omit<TeamMember, 'id' | 'avatarInitials'>) => void;
  onRemoveTeamMember: (id: string) => void;
  onUpdateTeamMember: (member: TeamMember) => void;
}

export default function SettingsTab({
  businessProfile,
  bookingRules,
  teamMembers,
  onSave,
  onAddTeamMember,
  onRemoveTeamMember,
  onUpdateTeamMember,
}: SettingsTabProps) {
  // Local state for Business Profile Form
  const [profile, setProfile] = useState<BusinessProfile>({ ...businessProfile });
  // Local state for Booking Rules Form
  const [rules, setRules] = useState<BookingRules>({ ...bookingRules });

  // Dialog/Form configurations
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Staff'>('Staff');

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'Admin' | 'Staff'>('Staff');

  // Integrations/Security Modals
  const [activeInfoModal, setActiveInfoModal] = useState<'integrations' | 'security' | null>(null);

  const handleProfileChange = (key: keyof BusinessProfile, value: string) => {
    setProfile(p => ({ ...p, [key]: value }));
  };

  const handleRulesChange = (key: keyof BookingRules, value: any) => {
    setRules(r => ({ ...r, [key]: value }));
  };

  const handleSaveAll = () => {
    onSave(profile, rules);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    onAddTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending Invite',
    });
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  const handleStartEdit = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setEditName(m.name);
    setEditEmail(m.email);
    setEditRole(m.role);
  };

  const handleSaveEdit = (m: TeamMember) => {
    onUpdateTeamMember({
      ...m,
      name: editName,
      email: editEmail,
      role: editRole,
    });
    setEditingMemberId(null);
  };

  // Preset logo helper
  const handleUpdateLogoURL = () => {
    const url = prompt("Enter custom brand logo URL or leave empty:", profile.logoUrl);
    if (url !== null) {
      handleProfileChange('logoUrl', url);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header bar within tab containing Discard / Save changes */}
      <div className="flex justify-end gap-3 pb-2">
        <button
          onClick={() => {
            setProfile({ ...businessProfile });
            setRules({ ...bookingRules });
          }}
          className="px-5 py-2.5 border border-slate-200 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Discard
        </button>
        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-on-primary rounded-xl font-bold text-xs shadow-sm transition-all hover:brightness-110 active:scale-95"
        >
          Save Changes
        </button>
      </div>

      {/* Grid of panels */}
      <div className="grid grid-cols-1 gap-8">
        {/* Section: Business Profile */}
        <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-gray-50 bg-slate-50/50">
            <h3 className="font-bold text-md text-slate-800">Business Profile</h3>
            <p className="text-xs text-gray-400 mt-0.5">Update your public identity and contact information.</p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Logo Handler */}
            <div className="md:col-span-4">
              <div 
                onClick={handleUpdateLogoURL}
                className="relative group cursor-pointer w-full aspect-video md:aspect-square rounded-2xl bg-neutral-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 transition-all hover:border-purple-600 hover:bg-purple-50/25"
              >
                {/* Logo Picture Overlay */}
                {profile.logoUrl && (
                  <img
                    className="absolute inset-0 w-full h-full object-cover opacity-15 rounded-2xl group-hover:opacity-25 transition-opacity"
                    alt="Slotem brand logo background"
                    src={profile.logoUrl}
                  />
                )}
                
                <Upload className="w-8 h-8 text-purple-700 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Upload Logo</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase max-w-[150px] font-semibold">SVG, PNG or JPG (max. 800x400px)</p>
                
                <div className="absolute bottom-2 bg-slate-900/10 text-[9px] text-slate-700 font-bold font-mono px-2 py-0.5 rounded-md hover:bg-purple-700 hover:text-white transition-colors">
                  Change URL
                </div>
              </div>
            </div>

            {/* Profile Inputs */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => handleProfileChange('businessName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={profile.emailAddress}
                      onChange={(e) => handleProfileChange('emailAddress', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={profile.phoneNumber}
                      onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="url"
                    placeholder="https://slotem.design"
                    value={profile.websiteUrl}
                    onChange={(e) => handleProfileChange('websiteUrl', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Booking Rules */}
        <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-gray-50 bg-slate-50/50">
            <h3 className="font-bold text-md text-slate-800">Booking Rules</h3>
            <p className="text-xs text-gray-400 mt-0.5">Control how and when clients can interact with your schedule.</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Minimum Lead Time</label>
                <div className="flex items-center gap-2">
                  <select
                    value={rules.minimumLeadTime}
                    onChange={(e) => handleRulesChange('minimumLeadTime', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:ring-1 focus:ring-purple-600 outline-none"
                  >
                    <option value="12 Hours">12 Hours</option>
                    <option value="24 Hours">24 Hours</option>
                    <option value="48 Hours">48 Hours</option>
                    <option value="1 Week">1 Week</option>
                  </select>
                  <span className="text-gray-400 transition-colors hover:text-purple-700 cursor-help" title="Minimum time before a booking starts">
                    <Info className="w-4.5 h-4.5" />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Booking Window</label>
                <div className="flex items-center gap-2">
                  <select
                    value={rules.bookingWindow}
                    onChange={(e) => handleRulesChange('bookingWindow', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:ring-1 focus:ring-purple-600 outline-none"
                  >
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                  <span className="text-gray-400 transition-colors hover:text-purple-700 cursor-help" title="How far in advance clients can book">
                    <Info className="w-4.5 h-4.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Cancellation block container */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-purple-50 rounded-xl text-purple-700">
                    <HeartHandshake className="w-5 h-5 text-purple-700" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Cancellation Policy</h4>
                    <p className="text-xs text-slate-400">Apply a standard fee for late cancellations.</p>
                  </div>
                </div>

                {/* Custom toggle slider */}
                <button
                  onClick={() => handleRulesChange('cancellationPolicyEnabled', !rules.cancellationPolicyEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    rules.cancellationPolicyEnabled ? 'bg-purple-700' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                      rules.cancellationPolicyEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {rules.cancellationPolicyEnabled && (
                <div className="pt-2">
                  <textarea
                    rows={3}
                    value={rules.cancellationPolicyText}
                    onChange={(e) => handleRulesChange('cancellationPolicyText', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section: Team Management */}
        <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-gray-50 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div>
              <h3 className="font-bold text-md text-slate-800">Team Management</h3>
              <p className="text-xs text-gray-400 mt-0.5">Add staff members and define their access levels.</p>
            </div>
            
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-purple-600 text-purple-700 hover:bg-purple-50 font-bold text-xs rounded-xl transition-all font-sans shrink-0 self-start sm:self-center"
            >
              <UserPlus className="w-4 h-4 text-purple-700" />
              Invite Member
            </button>
          </div>

          {/* Inline invite fields */}
          {isInviteOpen && (
            <form onSubmit={handleInviteSubmit} className="p-6 border-b border-purple-50 bg-purple-50/10 space-y-4">
              <div className="flex items-center gap-1 text-purple-700">
                <UserPlus className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Configure New Invitation</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  required
                  type="text"
                  placeholder="Full Name (e.g. Sarah White)"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="bg-white border border-slate-200 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none rounded-xl p-2.5 text-xs text-slate-800"
                />
                <input
                  required
                  type="email"
                  placeholder="Email (e.g. sarah@slotem.design)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-white border border-slate-200 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none rounded-xl p-2.5 text-xs text-slate-800"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'Admin' | 'Staff')}
                  className="bg-white border border-slate-200 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none rounded-xl p-2.5 text-xs text-slate-800"
                >
                  <option value="Staff">Staff role</option>
                  <option value="Admin">Admin role</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-sm transition-all"
                >
                  Send Invite Token
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      {editingMemberId === member.id ? (
                        <div className="flex flex-col gap-1.5">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-white border border-slate-200 rounded-md p-1.5 text-xs"
                          />
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="bg-white border border-slate-200 rounded-md p-1.5 text-xs font-mono"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {member.avatarInitials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{member.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{member.email}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingMemberId === member.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as 'Admin' | 'Staff')}
                          className="bg-white border border-slate-200 rounded-md p-1.5 text-xs"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Staff">Staff</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          member.role === 'Admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <span className="font-medium text-slate-600">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {editingMemberId === member.id ? (
                          <button
                            onClick={() => handleSaveEdit(member)}
                            className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(member)}
                            className="p-1.5 bg-slate-50 text-gray-500 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveTeamMember(member.id)}
                          className="p-1.5 bg-slate-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Advanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Integrations */}
          <div
            onClick={() => setActiveInfoModal('integrations')}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs hover:border-purple-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-purple-50 rounded-xl text-purple-700">
                  <HeartHandshake className="w-5 h-5 text-purple-700" />
                </span>
                <span className="text-xs text-purple-700 font-bold flex items-center gap-0.5 group-hover:translate-x-1 duration-200">
                  Configure <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <h4 className="font-bold text-md text-slate-800 mb-1">Integrations</h4>
              <p className="text-xs text-gray-400">Connect with Google Calendar, Zoom, and payment gateways.</p>
            </div>
          </div>

          {/* Card 2: Security & Privacy */}
          <div
            onClick={() => setActiveInfoModal('security')}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs hover:border-purple-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 bg-purple-50 rounded-xl text-purple-700">
                  <Shield className="w-5 h-5 text-purple-700" />
                </span>
                <span className="text-xs text-purple-700 font-bold flex items-center gap-0.5 group-hover:translate-x-1 duration-200">
                  Configure <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <h4 className="font-bold text-md text-slate-800 mb-1">Security & Privacy</h4>
              <p className="text-xs text-gray-400">Manage 2FA, data exports, and client privacy settings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced configuration modal alerts */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setActiveInfoModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl z-10 border border-gray-100">
            <h4 className="text-lg font-bold text-slate-800 mb-2">
              {activeInfoModal === 'integrations' ? 'Integrations Hub' : 'Security Enforcement'}
            </h4>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              {activeInfoModal === 'integrations'
                ? 'Hook Slotem up with OAuth 2.0 credentials to synchronize with external schedulers like Google Workspace Calendar and Zoom Rooms. Also handles stripe invoice gateways directly. Run dev mode keys inside .env.example to start!'
                : 'Enforce two-factor passcode authentication (2FA) for team members, configure privacy logs, and export database tables globally. Contact Slotem enterprise security admin at etangdgm001@gmail.com for bulk permissions.'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-4 py-2 bg-slate-900 font-bold text-xs text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
