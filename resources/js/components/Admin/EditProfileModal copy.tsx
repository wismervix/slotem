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
    Camera,
    Phone,
} from 'lucide-react';
import { User, UserStatus } from '@/types';
import { useForm } from '@inertiajs/react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    user,
}: EditProfileModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        status: user.status as UserStatus,
        password: '',
        avatar_url: null as File | null,
        _method: 'put',
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar_url ?? null,
    );

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setData('avatar_url', file);

        const preview = URL.createObjectURL(file);

        setAvatarPreview(preview);
    };

    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // console.log('Form data: ', data);

        post(route('user.profile.update'), {
            forceFormData: true,

            onSuccess: () => {
                reset('password');
            },
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
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <label
                                htmlFor="avatar-upload"
                                className="cursor-pointer"
                            >
                                <img
                                    alt="Profile Avatar"
                                    src={
                                        avatarPreview ||
                                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAtVMphqG2HwCuaIrB4haHvMou6Onk-SPAyRxnDFm8WRuq5ME7KiRi3ytevgPfpkRRZxe3mLlpXSqnh9oU4L5XJ5RMFEEpCKN3lEgkhwQWqWkkKdMVdVL3Uf_r9PlEFISYU42RXZcT5Lr6mtqWSigRmtKqX02fCAUKnvCKti8ZhZcxgwbiiM1PTSM4mWNlfir_Otm85KpkRTyM9DVdxSvd--rCJ6wupTHptzEDMQXTMx_2wzbxGFT4-RPZ0GD8QrUSBc9vhh62tHE8'
                                    }
                                    className="h-24 w-24 rounded-full border-4 border-primary-container object-cover shadow-md"
                                />
                                <div className="absolute right-0 bottom-0 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110">
                                    <Camera size={16} />
                                </div>
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        {errors.avatar_url && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.avatar_url}
                            </p>
                        )}
                        <p className="mt-2 text-[10px] text-on-surface-variant dark:text-slate-500">
                            Click the camera to upload a new avatar
                        </p>
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                            <UserIcon className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-[#ccc3d8] bg-white px-4 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                            <Mail className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border border-[#ccc3d8] bg-white px-4 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                            <Phone className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="w-full rounded-xl border border-[#ccc3d8] bg-white px-4 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                            required
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-1 text-xs font-semibold tracking-wider text-[#4a4455] uppercase">
                            <Award className="h-3.5 w-3.5 text-[#630ed4]" />{' '}
                            Operational Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) =>
                                setData('status', e.target.value as UserStatus)
                            }
                            className="w-full rounded-xl border border-[#ccc3d8] bg-white px-3 py-2.5 text-sm text-[#1d1a24] focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/20"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="deleted">Deleted</option>
                        </select>
                    </div>

                    {/* <div className="grid grid-cols-2 gap-4">
                        <div>
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
                        </div>
                    </div> */}

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
                            disabled={processing}
                            type="submit"
                            className="cursor-pointer rounded-xl bg-[#630ed4] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7c3aed] active:scale-95"
                        >
                            {processing ? '💾 Saving...' : '💾 Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
