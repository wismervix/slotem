import React, { useState, useMemo } from 'react';
import { Service, ServiceBadge, ServiceIcon } from '@/types';
import {
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Upload,
    X,
    Search,
    Check,
    AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from '@/layouts/Admin/AdminLayout';
import { serviceIcons } from '@/lib/service-icons';
import { usePage } from '@inertiajs/react';
import { formatDateAndTime } from '@/lib/calendar-utils';

export default function ServicesView() {
    const { services } = usePage<{ services: Service[] }>().props;

    // Tabs for Quick Filters
    const [activeFilter, setActiveFilter] = useState<
        'All' | 'Popular' | 'Recommended' | 'Best Value'
    >('All');

    const [activeVariant, setActiveVariant] = useState<
        'All' | 'standard' | 'featured'
    >('All');

    // Global adaptive search string
    const [searchQuery, setSearchQuery] = useState('');


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // EXACTLY 3 rows to match design aesthetics on page 1!

    // Drawer for Create / Edit
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [editingServiceId, setEditingServiceId] = useState<number | null>(
        null,
    );

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'sparkles' as ServiceIcon, // NEW - service icon
        // image: '', // Changed from imageUrl
        price: '0.00', // Changed to string (was number)
        variant: 'standard' as 'standard' | 'featured', // NEW - variant type
        duration: 60,
        active: true, // Changed from status string to boolean
        badges: [] as ServiceBadge[], // NEW - badges array
        image: 'https://picsum.photos/seed/default/300/300',
    });

    // Modal for Delete Confirmation
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(
        null,
    );

    // Modal for Viewing Detail
    const [viewingService, setViewingService] = useState<Service | null>(null);

    // Categories helper to match filter
    const doesBadgeMatch = (
        badges: ServiceBadge[] | null | undefined,
        filter: 'All' | 'Popular' | 'Recommended' | 'Best Value',
    ) => {
        if (filter === 'All') return true;

        if (!badges?.length) return false;

        switch (filter) {
            case 'Popular':
                return badges.includes('popular');

            case 'Recommended':
                return badges.includes('recommended');

            case 'Best Value':
                return badges.includes('best-value');
        }
    };

    const doesVariantMatch = (
        variant: Service['variant'],
        filter: 'All' | 'standard' | 'featured',
    ) => {
        return filter === 'All' || variant === filter;
    };

    // Filtered Services List
    const filteredServices = useMemo(() => {
        const query = searchQuery.toLowerCase();

        return services.filter((service) => {
            const matchesSearch =
                service.name.toLowerCase().includes(query) ||
                (service.description ?? '').toLowerCase().includes(query);

            const matchesBadge = doesBadgeMatch(service.badges, activeFilter);

            const matchesVariant = doesVariantMatch(
                service.variant,
                activeVariant,
            );

            return matchesSearch && matchesBadge && matchesVariant;
        });
    }, [services, searchQuery, activeFilter, activeVariant]);

    // Paginated elements
    const totalPages = Math.max(
        1,
        Math.ceil(filteredServices.length / itemsPerPage),
    );
    const paginatedServices = useMemo(() => {
        // Correct currentPage if bounds changed due to deletions
        const safePage = Math.min(currentPage, totalPages);
        const startIdx = (safePage - 1) * itemsPerPage;
        return filteredServices.slice(startIdx, startIdx + itemsPerPage);
    }, [filteredServices, currentPage, totalPages]);

    // Service Handlers
    const handleAddService = (
        newServiceData: Omit<Service, 'id' | 'createdAt' | 'bookingsCount'>,
    ) => {
        console.log('Add new Service Here!');
    };

    const handleUpdateService = (updatedService: Service) => {
        console.log('Handle Update Service!');
    };

    const handleDeleteService = (id: number) => {
        console.log('Handle Delete Service!');
    };

    // Handle Create click
    const handleOpenCreate = () => {
        setDrawerMode('create');
        setEditingServiceId(null);
        setFormData({
            name: '',
            description: '',
            icon: 'sparkles' as ServiceIcon, // NEW - service icon
            price: '0.00', // Changed to string (was number)
            variant: 'standard' as 'standard' | 'featured', // NEW - variant type
            duration: 60,
            image: 'https://picsum.photos/seed/default/300/300',
            active: true,
            badges: [] as ServiceBadge[],
        });
        setIsDrawerOpen(true);
    };

    // Handle Edit click
    const handleOpenEdit = (service: Service) => {
        setDrawerMode('edit');
        setEditingServiceId(service.id);
        setFormData({
            name: service.name,
            description: service.description || '',
            icon: service.icon as ServiceIcon,
            price: service.price,
            variant: service.variant,
            duration: service.duration,
            image:
                service.image || 'https://picsum.photos/seed/default/300/300',
            active: service.active,
            badges: service.badges as ServiceBadge[],
        });
        console.log('Form Data (Edit info):', formData);
        setIsDrawerOpen(true);
    };

    // Handle Form Submit
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        setIsDrawerOpen(false);
    };

    // Toggle active/inactive instantly in row click
    const handleToggleStatus = (service: Service) => {
        console.log('Toggle Active Status');
    };

    // Handle Delete Confirmation
    const triggerDelete = (service: Service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (serviceToDelete) {
            handleDeleteService(serviceToDelete.id);
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Catalog Title Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="font-sans text-3xl font-bold tracking-tight text-on-background dark:text-white">
                            Service Catalog
                        </h2>
                        <p className="mt-1 text-sm text-on-surface-variant md:text-base dark:text-slate-400">
                            Configure and manage your professional service
                            offerings.
                        </p>
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="hover:bg-opacity-90 flex cursor-pointer items-center gap-2 self-start rounded-full bg-primary px-5 py-3 font-semibold text-on-primary shadow-lg transition-all duration-200 active:scale-95 dark:bg-purple-600 dark:hover:bg-purple-700"
                    >
                        <PlusCircleIcon />
                        <span>Create Service</span>
                    </button>
                </div>

                <div className="flex justify-between gap-3">
                    {/* Tabs / Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {(
                            [
                                'All',
                                'Popular',
                                'Recommended',
                                'Best Value',
                            ] as const
                        ).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setActiveFilter(filter);
                                    setCurrentPage(1);
                                }}
                                className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-medium tracking-wide whitespace-nowrap transition-colors ${
                                    activeFilter === filter
                                        ? 'bg-primary-container text-on-primary-container shadow-sm dark:bg-purple-950/50 dark:text-purple-300'
                                        : 'text-on-surface-variant hover:bg-surface-container dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                            >
                                {filter === 'All' ? 'All Services' : filter}
                            </button>
                        ))}
                    </div>
                    {/* Tabs / Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {(['All', 'standard', 'featured'] as const).map(
                            (filter) => (
                                <button
                                    key={filter}
                                    onClick={() => {
                                        setActiveVariant(filter);
                                        setCurrentPage(1);
                                    }}
                                    className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-medium tracking-wide whitespace-nowrap transition-colors ${
                                        activeVariant === filter
                                            ? 'bg-primary-container text-on-primary-container shadow-sm dark:bg-purple-950/50 dark:text-purple-300'
                                            : 'text-on-surface-variant hover:bg-surface-container dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {filter === 'All' ? 'All Services' : filter}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                {/* Data Table Wrapper */}
                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        {filteredServices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center space-y-3 p-12 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-outline dark:bg-slate-800 dark:text-slate-600">
                                    <Search size={22} />
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface dark:text-white">
                                        No services found
                                    </p>
                                    <p className="mt-1 text-xs text-outline dark:text-slate-500">
                                        Try adjusting your filters or search
                                        query.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full min-w-[700px] border-collapse text-left">
                                <thead className="border-b border-outline-variant bg-surface-container-low dark:border-slate-700 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase dark:text-slate-500">
                                            Service Name
                                        </th>
                                        <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase dark:text-slate-500">
                                            Description
                                        </th>
                                        <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase dark:text-slate-500">
                                            Duration
                                        </th>
                                        <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase dark:text-slate-500">
                                            Price
                                        </th>
                                        <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase dark:text-slate-500">
                                            Status
                                        </th>
                                        <th className="p-4 text-right text-xs font-semibold tracking-wider text-outline uppercase dark:text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant dark:divide-slate-700">
                                    {paginatedServices.map((service) => {
                                        const Icon = serviceIcons[service.icon];
                                        return (
                                            <tr
                                                key={service.id}
                                                className="group transition-colors hover:bg-surface-container-low dark:hover:bg-slate-800/50"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-secondary-container dark:bg-slate-700">
                                                            {service?.image ? (
                                                                <img
                                                                    className="h-full w-full object-cover"
                                                                    src={
                                                                        service.image
                                                                    }
                                                                    alt={
                                                                        service.name
                                                                    }
                                                                    referrerPolicy="no-referrer"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                                                                    <div className="text-center">
                                                                        <svg
                                                                            className="mx-auto mb-2 h-10 w-10"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    1.5
                                                                                }
                                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                                                                            />
                                                                        </svg>
                                                                        {/* <p className="text-sm">
                                                                            No
                                                                            image
                                                                            available
                                                                        </p> */}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 flex items-center gap-2 text-sm font-bold text-on-surface dark:text-white">
                                                                <Icon className="h-5 w-5" />
                                                                <span>
                                                                    {
                                                                        service.name
                                                                    }{' '}
                                                                </span>
                                                            </p>
                                                            <p className="text-[11px] text-outline dark:text-slate-500">
                                                                Created{' '}
                                                                {formatDateAndTime(
                                                                    service.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm font-medium text-on-surface-variant dark:text-slate-400">
                                                    <div
                                                        title={
                                                            service.description ||
                                                            'No description'
                                                        }
                                                        className="max-w-[300px] truncate"
                                                    >
                                                        {service.description ||
                                                            'No description'}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-on-surface-variant dark:text-slate-400">
                                                    {service.duration} Mins
                                                </td>
                                                <td className="p-4 text-sm font-semibold text-on-surface dark:text-white">
                                                    ${service.price}
                                                </td>
                                                <td className="p-4">
                                                    <label className="relative inline-flex cursor-pointer items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                service.active
                                                            }
                                                            onChange={() =>
                                                                handleToggleStatus(
                                                                    service,
                                                                )
                                                            }
                                                            className="peer sr-only"
                                                        />
                                                        <div className="peer h-6 w-11 rounded-full bg-outline-variant/60 peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-700 dark:peer-checked:bg-purple-600"></div>
                                                        <span
                                                            className={`ml-3 text-xs font-medium ${service.active === true ? 'text-on-surface-variant dark:text-slate-300' : 'text-outline dark:text-slate-500'}`}
                                                        >
                                                            {service.active &&
                                                                'Active'}
                                                        </span>
                                                    </label>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() =>
                                                                setViewingService(
                                                                    service,
                                                                )
                                                            }
                                                            title="View Details"
                                                            className="cursor-pointer rounded-lg p-2 text-outline transition-all hover:bg-surface-container hover:text-primary dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleOpenEdit(
                                                                    service,
                                                                )
                                                            }
                                                            title="Edit Service"
                                                            className="cursor-pointer rounded-lg p-2 text-outline transition-all hover:bg-surface-container hover:text-primary dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                triggerDelete(
                                                                    service,
                                                                )
                                                            }
                                                            title="Delete Service"
                                                            className="cursor-pointer rounded-lg p-2 text-outline transition-all hover:bg-error-container/20 hover:text-error dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Footer / Pagination */}
                    {filteredServices.length > 0 && (
                        <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low p-4 dark:border-slate-700 dark:bg-slate-800/50">
                            <p className="text-xs font-medium text-on-surface-variant dark:text-slate-400">
                                Showing{' '}
                                <span className="font-bold">
                                    {Math.min(
                                        filteredServices.length,
                                        (currentPage - 1) * itemsPerPage + 1,
                                    )}
                                    -
                                    {Math.min(
                                        filteredServices.length,
                                        currentPage * itemsPerPage,
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-bold">
                                    {filteredServices.length}
                                </span>{' '}
                                services
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1),
                                        )
                                    }
                                    className="cursor-pointer rounded border border-outline-variant p-1.5 transition-all hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-700"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    className="cursor-pointer rounded border border-outline-variant p-1.5 transition-all hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-700"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Slideout Drawer overlay */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsDrawerOpen(false)}
                                className="fixed inset-0 z-[90] bg-on-background/40 backdrop-blur-[2px]"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{
                                    type: 'spring',
                                    damping: 25,
                                    stiffness: 220,
                                }}
                                className="fixed top-0 right-0 z-[100] flex h-full w-full max-w-md flex-col bg-surface shadow-2xl dark:bg-slate-900"
                            >
                                <div className="flex items-center justify-between border-b border-outline-variant bg-surface p-6 dark:border-slate-700 dark:bg-slate-900">
                                    <div>
                                        <h3 className="text-lg font-bold text-on-surface dark:text-white">
                                            {drawerMode === 'create'
                                                ? 'Create New Service'
                                                : 'Edit Service'}
                                        </h3>
                                        <p className="mt-1 text-xs text-outline dark:text-slate-500">
                                            {drawerMode === 'create'
                                                ? 'Fill in the details to add a service to your catalog.'
                                                : 'Update the details for this offering.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="cursor-pointer rounded-full p-2 text-outline transition-colors hover:bg-surface-container hover:text-on-surface dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleFormSubmit}
                                    className="flex flex-1 flex-col justify-between overflow-hidden"
                                >
                                    <div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto p-6">
                                        {/* Name */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                Service Name
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                                placeholder="e.g., Executive Styling"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                Description
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                                placeholder="Briefly describe what the service includes..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Icon Selection */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                    Service Icon
                                                </label>
                                                <select
                                                    value={formData.icon}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            icon: e.target
                                                                .value as ServiceIcon,
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                                >
                                                    <option value="scissors">
                                                        Scissors
                                                    </option>
                                                    <option value="user-check">
                                                        User Check
                                                    </option>
                                                    <option value="sparkles">
                                                        Sparkles
                                                    </option>
                                                    <option value="paintbrush">
                                                        Paintbrush
                                                    </option>
                                                    <option value="shield-check">
                                                        Shield Check
                                                    </option>
                                                </select>
                                            </div>
                                            {/* Price */}
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                    Price ($)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-outline dark:text-slate-500">
                                                        $
                                                    </span>
                                                    <input
                                                        required
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        value={formData.price}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                price: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row: Category & Duration */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                    Variant
                                                </label>
                                                <select
                                                    value={formData.variant}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            variant: e.target
                                                                .value as
                                                                | 'standard'
                                                                | 'featured',
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                                >
                                                    <option value="standard">
                                                        Standard
                                                    </option>
                                                    <option value="featured">
                                                        Featured
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                    Duration (Mins)
                                                </label>
                                                <input
                                                    required
                                                    type="number"
                                                    min={5}
                                                    max={480}
                                                    value={formData.duration}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            duration: Number(
                                                                e.target.value,
                                                            ),
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Badges Selection */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                Service Badges
                                            </label>
                                            <div className="space-y-2">
                                                {(
                                                    [
                                                        'popular',
                                                        'recommended',
                                                        'best-value',
                                                    ] as const
                                                ).map((badge) => (
                                                    <label
                                                        key={badge}
                                                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/40 p-2.5 transition-all dark:border-slate-700 dark:bg-slate-800/30"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.badges.includes(
                                                                badge,
                                                            )}
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .checked
                                                                ) {
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            badges: [
                                                                                ...formData.badges,
                                                                                badge,
                                                                            ],
                                                                        },
                                                                    );
                                                                } else {
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            badges: formData.badges.filter(
                                                                                (
                                                                                    b,
                                                                                ) =>
                                                                                    b !==
                                                                                    badge,
                                                                            ),
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                            className="cursor-pointer rounded text-primary focus:ring-primary dark:text-purple-500 dark:focus:ring-purple-500"
                                                        />
                                                        <span className="text-sm font-medium text-on-surface capitalize dark:text-white">
                                                            {badge.replace(
                                                                '-',
                                                                ' ',
                                                            )}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Preselected Image Options to simplify mockup reference */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                Service Image Match
                                            </label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[
                                                    {
                                                        name: 'Style',
                                                        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBicmcvzjjNBK-MBSl34LEJ6mAvxKjjn5aOHpSE7YCvSLSjV3T6ZHx-TRTRCVvOw5cg1Cw2QneammzouwtRnsGqMzQMVAImdHQdN_CzsUDylFa2dk1oIEUcG1B13kVK11pq5esGnDYS-DOKuK85139Rf_mlsSm_CD92-S-P07DM_YK0cKTMMFlKHZQijHRNLrUzAX_CoDstAQ3c2PWZj_isW7Y4SbQBqlFdRwryg-9kf-e-ESaAGzB8wGUAQpcjam8LhW48p9UtPzE',
                                                    },
                                                    {
                                                        name: 'Strategy',
                                                        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqqmz0dAZnKIQmuSXoSR5fIone3QDD2Wc1_mh4dT8nneEzrxrXuEHWuF19CwZ-0GjEZUvhCbc0n0KK2LaIfqJHFBdTJWBs-voKhLROT-SQEJxEU4idKebqO50AM1YykU_Jd3aLD_Bz87QfiJhh-HuBK_jBMgmjK59UN1d9EdJeYz6AgI56wyzTI3SviOCOKIOueikZIZZVy1vCspSOpzp0_zo8SsniqcNnV6t5JoBfzJRkDEERWWGMij0FH1t23s1j-bT0KgPP1cE',
                                                    },
                                                    {
                                                        name: 'Portfolio',
                                                        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKlVZlxX-pa15-5M3_4gLEbY6IU2AdJjvsJ3TuUthmLgG2XIs0qBQvuDLi_8EnwzyO48suah5RkXTN78aHRlehiL7avq-JwTN3MnK-VK5H9gACOn_Ptiajgv7eOISX8JAq0k5fK3j2JFk0vJnThjdKaLu_KyNUz1_cwEEzLoGfsI3mwBN_dmp4w0whe_q_D3WvLLaVCYtzKQdrZLEdy4iDDMCsvie1Pt6zvE4HUFWz35gPZ1nxyaxOd_tEr1pMylIaJZ8yQUCL_Ac',
                                                    },
                                                    {
                                                        name: 'Abstract',
                                                        url: 'https://picsum.photos/seed/service/300/300',
                                                    },
                                                ].map((item) => (
                                                    <button
                                                        key={item.name}
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData({
                                                                ...formData,
                                                                image: item.url,
                                                            })
                                                        }
                                                        className={`relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 ${
                                                            formData.image ===
                                                            item.url
                                                                ? 'border-primary dark:border-purple-500'
                                                                : 'border-transparent'
                                                        }`}
                                                    >
                                                        <img
                                                            src={item.url}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold text-white">
                                                            {item.name}
                                                        </div>
                                                        {formData.image ===
                                                            item.url && (
                                                            <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5 text-on-primary dark:bg-purple-600">
                                                                <Check
                                                                    size={8}
                                                                />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status selection in drawer */}
                                        {/* Active/Inactive Status as Toggle */}
                                        <div className="space-y-1">
                                            <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                Status
                                            </label>
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.active}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            active: e.target
                                                                .checked,
                                                        })
                                                    }
                                                    className="peer sr-only"
                                                />
                                                <div className="peer h-6 w-11 rounded-full bg-outline-variant/65 peer-checked:bg-primary after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full dark:bg-slate-700 dark:peer-checked:bg-purple-600 dark:after:border-slate-600"></div>
                                                <span className="ml-3 text-xs font-medium text-on-surface-variant dark:text-slate-400">
                                                    {formData.active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Drag and drop upload zone representation */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">
                                                Image Upload Area
                                            </label>
                                            <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center transition-all duration-200 hover:border-primary dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500">
                                                <Upload
                                                    className="mb-2 text-outline transition-colors group-hover:text-primary dark:text-slate-600 dark:group-hover:text-purple-400"
                                                    size={28}
                                                />
                                                <p className="text-xs font-semibold text-on-surface dark:text-white">
                                                    Click or drag custom files
                                                </p>
                                                <p className="mt-1 text-center text-[10px] tracking-widest text-outline uppercase dark:text-slate-500">
                                                    JPG, PNG, WebP up to 5MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 border-t border-outline-variant bg-surface p-6 dark:border-slate-700 dark:bg-slate-900">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsDrawerOpen(false)
                                            }
                                            className="flex-1 cursor-pointer rounded-lg border border-outline py-3 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="hover:bg-opacity-90 flex-1 cursor-pointer rounded-lg bg-primary py-3 text-sm font-semibold text-on-primary shadow-md shadow-primary/20 transition-all active:scale-95 dark:bg-purple-600 dark:shadow-purple-600/20 dark:hover:bg-purple-700"
                                        >
                                            Save Service
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="absolute inset-0 bg-on-background/40 backdrop-blur-[2px]"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="relative z-20 w-full max-w-sm overflow-hidden rounded-2xl bg-surface p-6 shadow-2xl dark:bg-slate-900"
                            >
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-container text-error dark:bg-red-950/40 dark:text-red-400">
                                    <AlertTriangle size={28} />
                                </div>
                                <h3 className="text-center text-lg font-bold text-on-surface dark:text-white">
                                    Delete Service?
                                </h3>
                                <p className="mt-2 text-center text-sm text-on-surface-variant dark:text-slate-400">
                                    This action is permanent. You are about to
                                    remove{' '}
                                    <span className="font-bold">
                                        "{serviceToDelete?.name}"
                                    </span>{' '}
                                    and all its associated data from the
                                    catalog.
                                </p>
                                <div className="mt-6 flex flex-col gap-2">
                                    <button
                                        onClick={confirmDelete}
                                        className="hover:bg-opacity-90 w-full cursor-pointer rounded-xl bg-error py-3 text-sm font-semibold text-on-error shadow-md shadow-error/20 transition-all dark:bg-red-600 dark:shadow-red-600/20 dark:hover:bg-red-700"
                                    >
                                        Delete Permanently
                                    </button>
                                    <button
                                        onClick={() =>
                                            setIsDeleteModalOpen(false)
                                        }
                                        className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container dark:text-slate-400 dark:hover:bg-slate-800"
                                    >
                                        Keep Service
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Viewing details Modal */}
                <AnimatePresence>
                    {viewingService && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setViewingService(null)}
                                className="absolute inset-0 bg-on-background/40 backdrop-blur-[2px]"
                            />
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative z-20 flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl dark:bg-slate-900"
                            >
                                <div className="relative h-48 overflow-hidden bg-primary-container dark:bg-slate-800">
                                    {viewingService?.image ? (
                                        <img
                                            src={
                                                viewingService.image ||
                                                'https://lh3.googleusercontent.com/aida-public/AB6AXuAS4hUTLFx0E6J98uzd04i3YX6UOkhedlYUCmPnbrvti24Ue_CL6ri6q8vvcD63qahKE-7K_01ONMTOkm7IPXtgdV-TEaq37JuFM-5sjMu1ZaVI1rzD_8U8PNnuBFrixHoY11-QO-v2o22VH5iCzzuqXgzXh8ziXm5jJpj3gYs7mJICzXvnr61i7sCB6Q1do1IsZEgg-ruxOHu7mP4fkgIIXgkTMq0CfMnHZc29JZ51XanpLw0JXNLLrR0XIr2A_YvkkkTl4TVWVbs'
                                            }
                                            alt={viewingService.name}
                                            className="h-full w-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                                            <div className="text-center">
                                                <svg
                                                    className="mx-auto mb-2 h-10 w-10"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                                                    />
                                                </svg>
                                                <p className="text-sm">
                                                    No image available
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                    <button
                                        onClick={() => setViewingService(null)}
                                        className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="absolute right-4 bottom-4 left-4">
                                        <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-on-primary uppercase dark:bg-purple-600">
                                            {viewingService.variant}
                                        </span>
                                        <h3 className="mt-1 text-lg font-bold text-white">
                                            {viewingService.name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="space-y-4 p-6">
                                    <div>
                                        <h4 className="text-xs font-bold tracking-wider text-outline uppercase dark:text-slate-500">
                                            Description
                                        </h4>
                                        <p className="mt-1 text-sm leading-relaxed text-on-surface-variant dark:text-slate-400">
                                            {viewingService.description ||
                                                'No description provided for this service.'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 border-y border-outline-variant py-3 dark:border-slate-700">
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-outline dark:text-slate-500">
                                                Duration
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-on-surface dark:text-white">
                                                {viewingService.duration} mins
                                            </p>
                                        </div>
                                        <div className="border-x border-outline-variant text-center dark:border-slate-700">
                                            <p className="text-xs font-semibold text-outline dark:text-slate-500">
                                                Price
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-primary dark:text-purple-400">
                                                ${viewingService.price}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-outline dark:text-slate-500">
                                                Tags
                                            </p>

                                            {viewingService.badges?.length ? (
                                                <div className="mt-2 flex flex-wrap justify-center gap-1">
                                                    {viewingService.badges.map(
                                                        (badge) => (
                                                            <span
                                                                key={badge}
                                                                className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary capitalize dark:border-purple-500/20 dark:bg-purple-500/15 dark:text-purple-300"
                                                            >
                                                                {badge.replace(
                                                                    '-',
                                                                    ' ',
                                                                )}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-sm text-outline dark:text-slate-500">
                                                    None
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 text-xs text-outline dark:text-slate-500">
                                        <span>
                                            Created Date:{' '}
                                            {formatDateAndTime(
                                                viewingService.created_at,
                                            )}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                                                viewingService.active === true
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                    : 'bg-rose-100 text-rose-800 dark:bg-red-950/40 dark:text-red-400'
                                            }`}
                                        >
                                            {viewingService.active && 'Active'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setViewingService(null)}
                                        className="mt-4 w-full cursor-pointer rounded-lg bg-surface-container py-2.5 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container-high dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                    >
                                        Close Detail
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}

// Utility SVG icon components to bypass Material symbols and remain light & reliable with strict typography
function PlusCircleIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus-circle"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    );
}
