/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
    X,
    Mail,
    MapPin,
    Award,
    User as UserIcon,
    Sparkles,
} from 'lucide-react';
import { User } from '@/types';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSave: (updated: User) => void;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    user,
    onSave,
}: EditProfileModalProps) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [status, setStatus] = useState(user.status);
    const [avatarUrl, setAvatarUrl] = useState(user.avatar_url);

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setEmail(user.email);
            setStatus(user.status);
            setAvatarUrl(user.avatar_url);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;
        onSave({
            ...user,
            name,
            email,
            status,
            avatarUrl,
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
            id="edit_profile_backdrop"
        >
            <div
                className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl border border-[#ccc3d8]/40 bg-white shadow-2xl duration-200"
                onClick={(e) => e.stopPropagation()}
                id="edit_profile_dialog"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#ccc3d8]/30 bg-[#fef7ff] px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#630ed4]" />
                        <h3 className="text-lg font-semibold text-[#25005a]">
                            Edit Profile
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-full p-1 text-[#4a4455]/70 transition-colors hover:bg-[#e8dfee]/50 hover:text-[#630ed4]"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    {/* Avatar simulation preview */}
                    <div className="flex items-center gap-4 border-b border-[#f3ebfa] py-2">
                        <img
                            src={avatarUrl}
                            alt="Avatar Previews"
                            className={`h-16 w-16 rounded-full border-2 ${status === 'active' ? 'border-emerald-500' : 'border-neutral-300'} object-cover shadow-sm`}
                        />
                        <div className="flex-grow">
                            <label className="mb-1 block text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                                Avatar Image URL
                            </label>
                            <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="w-full rounded-lg border border-[#ccc3d8] bg-neutral-50 px-3 py-1.5 font-mono text-xs focus:border-[#630ed4] focus:ring-1 focus:ring-[#630ed4]"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                            <UserIcon className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-[#ccc3d8] bg-white px-4 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                            <Mail className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-[#ccc3d8] bg-white px-4 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                                <Award className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                                Member Tier
                            </label>
                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value as
                                            | 'active'
                                            | 'inactive'
                                            | 'suspended'
                                            | 'deleted',
                                    )
                                }
                                className="w-full rounded-xl border border-[#ccc3d8] bg-white px-3 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                                <option value="deleted">Deleted</option>
                            </select>
                        </div>

                        {/* <div>
                            <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                                <MapPin className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                                City / Location
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full rounded-xl border border-[#ccc3d8] bg-white px-3 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                                placeholder="Chicago, IL"
                            />
                        </div> */}
                    </div>


                    {/* Footer buttons */}
                    <div className="flex justify-end gap-3 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-xl border border-[#ccc3d8] px-4 py-2 text-sm font-semibold text-[#4a4455] transition-all hover:bg-[#e8dfee]/30 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer rounded-xl bg-[#630ed4] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7c3aed] active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
