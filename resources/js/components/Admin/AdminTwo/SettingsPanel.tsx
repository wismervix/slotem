import React, { useState } from 'react';
import { Settings, Save, ShieldAlert, Sparkles, RefreshCw, User, Bell, Shield, Info, Database } from 'lucide-react';
import { AdminProfileThree } from '@/types';

interface SettingsPanelProps {
  adminProfile: AdminProfileThree;
  onUpdateAdmin: (profile: AdminProfileThree) => void;
  onResetDatabase: () => void;
}

export default function SettingsPanel({
  adminProfile,
  onUpdateAdmin,
  onResetDatabase
}: SettingsPanelProps) {
  const [name, setName] = useState(adminProfile.name);
  const [role, setRole] = useState(adminProfile.role);
  const [avatar, setAvatar] = useState(adminProfile.avatar);
  const [backupsEnabled, setBackupsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateAdmin({
        ...adminProfile,
        name,
        role,
        avatar
      });
      setIsSaving(false);
      setSaveBanner(true);
      setTimeout(() => setSaveBanner(false), 2000);
    }, 450);
  };

  const handleReset = () => {
    if (confirm('Are you absolutely sure you want to reset the Slotem Admin local sandbox database? This resets all user accounts, booked reservations, and availability schedules to original pristine demonstration values.')) {
      onResetDatabase();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title block */}
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Console Settings</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Adjust administrator profile details, modify system parameters, or purge local database storage cache files.
        </p>
      </div>

      {saveBanner && (
        <div className="bg-green-100 border border-green-200 text-green-800 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in">
          <Info className="w-4 h-4 text-green-700" />
          <span>Profile configuration updated successfully. Navigation headers synced active.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Column: Administrator profile details form */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm text-on-surface">Administrator Profile Settings</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs">
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt="Profile preview"
                className="w-16 h-16 rounded-full border border-outline-variant/50 object-cover shadow-sm"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-on-surface">{name || 'Admin Name'}</h4>
                <p className="text-on-surface-variant font-mono">{role || 'Administrator Role'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Profile Avatar URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  placeholder="https://images.unsplash..."
                />
              </div>

              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Full System Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  placeholder="e.g. Admin Alex"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Assigned Admin Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  placeholder="e.g. Super Admin"
                />
              </div>

              <div>
                <label className="block text-outline font-bold uppercase tracking-wider mb-1.5">Official Security Level</label>
                <input
                  type="text"
                  disabled
                  value="System Administrator Tier-4 (SLA Max Partner)"
                  className="w-full px-3 py-2 border border-outline-variant/60 bg-surface-container/30 rounded-lg text-outline-variant select-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-all cursor-pointer shadow-sm disabled:opacity-40"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Column: Core Systems configuration parameters & DB Reset */}
        <div className="space-y-6">
          {/* Core System permissions */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3 mb-2">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm text-on-surface">Configuration Parameters</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">Live Sync Alerts</h4>
                  <p className="text-[10px] text-on-surface-variant">Animate notification bell for system alerts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                    notificationsEnabled ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-150 ease-in-out ${
                      notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">Auto Cache Backups</h4>
                  <p className="text-[10px] text-on-surface-variant">Continuously push changes to browser cache.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBackupsEnabled(!backupsEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                    backupsEnabled ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-150 ease-in-out ${
                      backupsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Purge / Database Reset Console block */}
          <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-red-700 border-b border-outline-variant/60 pb-3">
              <Database className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-sm text-red-700">Storage Maintenance</h3>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              If client data or reservations are cluttered, reset the local storage tables to initial demonstration parameters. This operation is instant and cannot be undone.
            </p>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-red-600" />
              <span>Reset Sandbox Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
