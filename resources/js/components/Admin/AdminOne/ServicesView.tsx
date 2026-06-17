import React, { useState, useMemo } from 'react';
import { ServiceTwo } from '@/types';
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

interface ServicesViewProps {
    services: ServiceTwo[];
    onAddService: (
        newService: Omit<ServiceTwo, 'id' | 'createdAt' | 'bookingsCount'>,
    ) => void;
    onUpdateService: (updatedService: ServiceTwo) => void;
    onDeleteService: (id: string) => void;
    searchQuery: string;
}

export default function ServicesView({
    services,
    onAddService,
    onUpdateService,
    onDeleteService,
    searchQuery,
}: ServicesViewProps) {
    // Tabs for Quick Filters
    const [activeFilter, setActiveFilter] = useState<
        'All' | 'Consulting' | 'Styling' | 'Workshops'
    >('All');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // EXACTLY 3 rows to match design aesthetics on page 1!

    // Drawer for Create / Edit
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [editingServiceId, setEditingServiceId] = useState<string | null>(
        null,
    );

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Consulting',
        duration: 60,
        price: 150,
        imageUrl: 'https://picsum.photos/seed/default/300/300',
        status: 'Active' as 'Active' | 'Inactive',
    });

    // Modal for Delete Confirmation
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<ServiceTwo | null>(
        null,
    );

    // Modal for Viewing Detail
    const [viewingService, setViewingService] = useState<ServiceTwo | null>(
        null,
    );

    // Categories helper to match filter
    const doesCategoryMatch = (serviceCategory: string, filter: string) => {
        if (filter === 'All') return true;
        if (filter === 'Consulting')
            return serviceCategory.toLowerCase() === 'consulting';
        if (filter === 'Styling') {
            return (
                serviceCategory.toLowerCase() === 'styling' ||
                serviceCategory.toLowerCase() === 'personal branding'
            );
        }
        if (filter === 'Workshops') {
            return (
                serviceCategory.toLowerCase() === 'workshops' ||
                serviceCategory.toLowerCase() === 'design'
            );
        }
        return false;
    };

    // Filtered Services List
    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const matchesSearch =
                service.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                service.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                service.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory = doesCategoryMatch(
                service.category,
                activeFilter,
            );

            return matchesSearch && matchesCategory;
        });
    }, [services, searchQuery, activeFilter]);

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

    // Handle Create click
    const handleOpenCreate = () => {
        setDrawerMode('create');
        setEditingServiceId(null);
        setFormData({
            name: '',
            description: '',
            category: 'Consulting',
            duration: 60,
            price: 150,
            imageUrl: 'https://picsum.photos/seed/default/300/300',
            status: 'Active',
        });
        setIsDrawerOpen(true);
    };

    // Handle Edit click
    const handleOpenEdit = (service: ServiceTwo) => {
        setDrawerMode('edit');
        setEditingServiceId(service.id);
        setFormData({
            name: service.name,
            description: service.description,
            category:
                service.category === 'Personal Branding'
                    ? 'Styling'
                    : service.category === 'Design'
                      ? 'Workshops'
                      : service.category,
            duration: service.duration,
            price: service.price,
            imageUrl: service.imageUrl,
            status: service.status,
        });
        setIsDrawerOpen(true);
    };

    // Handle Form Submit
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        if (drawerMode === 'create') {
            onAddService({
                name: formData.name,
                description: formData.description,
                category: formData.category,
                duration: Number(formData.duration),
                price: Number(formData.price),
                imageUrl: formData.imageUrl,
                status: formData.status,
            });
        } else if (drawerMode === 'edit' && editingServiceId) {
            const original = services.find((s) => s.id === editingServiceId);
            if (original) {
                onUpdateService({
                    ...original,
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    duration: Number(formData.duration),
                    price: Number(formData.price),
                    imageUrl: formData.imageUrl,
                    status: formData.status,
                });
            }
        }
        setIsDrawerOpen(false);
    };

    // Toggle active/inactive instantly in row click
    const handleToggleStatus = (service: ServiceTwo) => {
        onUpdateService({
            ...service,
            status: service.status === 'Active' ? 'Inactive' : 'Active',
        });
    };

    // Handle Delete Confirmation
    const triggerDelete = (service: ServiceTwo) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (serviceToDelete) {
            onDeleteService(serviceToDelete.id);
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Catalog Title Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h2 className="font-sans text-3xl font-bold tracking-tight text-on-background">
                        Service Catalog
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant md:text-base">
                        Configure and manage your professional service
                        offerings.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="hover:bg-opacity-90 flex cursor-pointer items-center gap-2 self-start rounded-full bg-primary px-5 py-3 font-semibold text-on-primary shadow-lg transition-all duration-200 active:scale-95"
                >
                    <PlusCircleIcon />
                    <span>Create Service</span>
                </button>
            </div>

            {/* Tabs / Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {(['All', 'Consulting', 'Styling', 'Workshops'] as const).map(
                    (filter) => (
                        <button
                            key={filter}
                            onClick={() => {
                                setActiveFilter(filter);
                                setCurrentPage(1);
                            }}
                            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-medium tracking-wide whitespace-nowrap transition-colors ${
                                activeFilter === filter
                                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                                    : 'text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                            {filter === 'All' ? 'All Services' : filter}
                        </button>
                    ),
                )}
            </div>

            {/* Data Table Wrapper */}
            <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
                <div className="overflow-x-auto">
                    {filteredServices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-3 p-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-outline">
                                <Search size={22} />
                            </div>
                            <div>
                                <p className="font-semibold text-on-surface">
                                    No services found
                                </p>
                                <p className="mt-1 text-xs text-outline">
                                    Try adjusting your filters or search query.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full min-w-[700px] border-collapse text-left">
                            <thead className="border-b border-outline-variant bg-surface-container-low">
                                <tr>
                                    <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase">
                                        Service Name
                                    </th>
                                    <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase">
                                        Category
                                    </th>
                                    <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase">
                                        Duration
                                    </th>
                                    <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase">
                                        Price
                                    </th>
                                    <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase">
                                        Status
                                    </th>
                                    <th className="p-4 text-xs font-semibold tracking-wider text-outline uppercase">
                                        Bookings
                                    </th>
                                    <th className="p-4 text-right text-xs font-semibold tracking-wider text-outline uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {paginatedServices.map((service) => (
                                    <tr
                                        key={service.id}
                                        className="group transition-colors hover:bg-surface-container-low"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-secondary-container">
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={service.imageUrl}
                                                        alt={service.name}
                                                        referrerPolicy="no-referrer"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-on-surface">
                                                        {service.name}
                                                    </p>
                                                    <p className="text-[11px] text-outline">
                                                        Created{' '}
                                                        {service.createdAt}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-on-surface-variant">
                                            {service.category}
                                        </td>
                                        <td className="p-4 text-sm text-on-surface-variant">
                                            {service.duration} Mins
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-on-surface">
                                            ${service.price.toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        service.status ===
                                                        'Active'
                                                    }
                                                    onChange={() =>
                                                        handleToggleStatus(
                                                            service,
                                                        )
                                                    }
                                                    className="peer sr-only"
                                                />
                                                <div className="peer h-6 w-11 rounded-full bg-outline-variant/60 peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                                <span
                                                    className={`ml-3 text-xs font-medium ${service.status === 'Active' ? 'text-on-surface-variant' : 'text-outline'}`}
                                                >
                                                    {service.status}
                                                </span>
                                            </label>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-on-surface-variant">
                                            {service.bookingsCount.toLocaleString()}
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
                                                    className="cursor-pointer rounded-lg p-2 text-outline transition-all hover:bg-surface-container hover:text-primary"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleOpenEdit(service)
                                                    }
                                                    title="Edit Service"
                                                    className="cursor-pointer rounded-lg p-2 text-outline transition-all hover:bg-surface-container hover:text-primary"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        triggerDelete(service)
                                                    }
                                                    title="Delete Service"
                                                    className="cursor-pointer rounded-lg p-2 text-outline transition-all hover:bg-error-container/20 hover:text-error"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer / Pagination */}
                {filteredServices.length > 0 && (
                    <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low p-4">
                        <p className="text-xs font-medium text-on-surface-variant">
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
                                className="cursor-pointer rounded border border-outline-variant p-1.5 transition-all hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
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
                                className="cursor-pointer rounded border border-outline-variant p-1.5 transition-all hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
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
                            className="fixed top-0 right-0 z-[100] flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-outline-variant bg-surface p-6">
                                <div>
                                    <h3 className="text-lg font-bold text-on-surface">
                                        {drawerMode === 'create'
                                            ? 'Create New Service'
                                            : 'Edit Service'}
                                    </h3>
                                    <p className="mt-1 text-xs text-outline">
                                        {drawerMode === 'create'
                                            ? 'Fill in the details to add a service to your catalog.'
                                            : 'Update the details for this offering.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="cursor-pointer rounded-full p-2 text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
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
                                        <label className="text-xs font-semibold text-on-surface-variant">
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
                                            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            placeholder="e.g., Executive Styling"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-on-surface-variant">
                                            Description
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            placeholder="Briefly describe what the service includes..."
                                        />
                                    </div>

                                    {/* Row: Category & Duration */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-on-surface-variant">
                                                Category
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        category:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            >
                                                <option value="Consulting">
                                                    Consulting
                                                </option>
                                                <option value="Styling">
                                                    Styling
                                                </option>
                                                <option value="Design">
                                                    Design
                                                </option>
                                                <option value="Workshops">
                                                    Workshops
                                                </option>
                                                <option value="Personal Branding">
                                                    Personal Branding
                                                </option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-on-surface-variant">
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
                                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-on-surface-variant">
                                            Price ($)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-outline">
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
                                                        price: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pr-4 pl-8 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Preselected Image Options to simplify mockup reference */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-on-surface-variant">
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
                                                            imageUrl: item.url,
                                                        })
                                                    }
                                                    className={`relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 ${
                                                        formData.imageUrl ===
                                                        item.url
                                                            ? 'border-primary'
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
                                                    {formData.imageUrl ===
                                                        item.url && (
                                                        <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5 text-on-primary">
                                                            <Check size={8} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status selection in drawer */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-on-surface-variant">
                                            Default Status
                                        </label>
                                        <div className="mt-1 flex gap-4">
                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    checked={
                                                        formData.status ===
                                                        'Active'
                                                    }
                                                    onChange={() =>
                                                        setFormData({
                                                            ...formData,
                                                            status: 'Active',
                                                        })
                                                    }
                                                    className="cursor-pointer text-primary focus:ring-primary"
                                                />
                                                <span>Active</span>
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    checked={
                                                        formData.status ===
                                                        'Inactive'
                                                    }
                                                    onChange={() =>
                                                        setFormData({
                                                            ...formData,
                                                            status: 'Inactive',
                                                        })
                                                    }
                                                    className="cursor-pointer text-primary focus:ring-primary"
                                                />
                                                <span>Inactive</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Drag and drop upload zone representation */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-on-surface-variant">
                                            Image Upload Area
                                        </label>
                                        <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center transition-all duration-200 hover:border-primary">
                                            <Upload
                                                className="mb-2 text-outline transition-colors group-hover:text-primary"
                                                size={28}
                                            />
                                            <p className="text-xs font-semibold text-on-surface">
                                                Click or drag custom files
                                            </p>
                                            <p className="mt-1 text-center text-[10px] tracking-widest text-outline uppercase">
                                                JPG, PNG, WebP up to 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 border-t border-outline-variant bg-surface p-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="flex-1 cursor-pointer rounded-lg border border-outline py-3 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="hover:bg-opacity-90 flex-1 cursor-pointer rounded-lg bg-primary py-3 text-sm font-semibold text-on-primary shadow-md shadow-primary/20 transition-all active:scale-95"
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
                            className="relative z-20 w-full max-w-sm overflow-hidden rounded-2xl bg-surface p-6 shadow-2xl"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-container text-error">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-center text-lg font-bold text-on-surface">
                                Delete Service?
                            </h3>
                            <p className="mt-2 text-center text-sm text-on-surface-variant">
                                This action is permanent. You are about to
                                remove{' '}
                                <span className="font-bold">
                                    "{serviceToDelete?.name}"
                                </span>{' '}
                                and all its associated data from the catalog.
                            </p>
                            <div className="mt-6 flex flex-col gap-2">
                                <button
                                    onClick={confirmDelete}
                                    className="hover:bg-opacity-90 w-full cursor-pointer rounded-xl bg-error py-3 text-sm font-semibold text-on-error shadow-md shadow-error/20 transition-all"
                                >
                                    Delete Permanently
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full cursor-pointer rounded-xl py-3 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container"
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
                            className="relative z-20 flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl"
                        >
                            <div className="relative h-48 overflow-hidden bg-primary-container">
                                <img
                                    src={viewingService.imageUrl}
                                    alt={viewingService.name}
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                <button
                                    onClick={() => setViewingService(null)}
                                    className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/40 p-2 text-white transition-all hover:bg-black/60"
                                >
                                    <X size={16} />
                                </button>
                                <div className="absolute right-4 bottom-4 left-4">
                                    <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-on-primary uppercase">
                                        {viewingService.category}
                                    </span>
                                    <h3 className="mt-1 text-lg font-bold text-white">
                                        {viewingService.name}
                                    </h3>
                                </div>
                            </div>
                            <div className="space-y-4 p-6">
                                <div>
                                    <h4 className="text-xs font-bold tracking-wider text-outline uppercase">
                                        Description
                                    </h4>
                                    <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                                        {viewingService.description ||
                                            'No description provided for this service.'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-y border-outline-variant py-3">
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-outline">
                                            Duration
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-on-surface">
                                            {viewingService.duration} mins
                                        </p>
                                    </div>
                                    <div className="border-x border-outline-variant text-center">
                                        <p className="text-xs font-semibold text-outline">
                                            Price
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-primary">
                                            ${viewingService.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-outline">
                                            Bookings
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-on-surface">
                                            {viewingService.bookingsCount}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-1 text-xs text-outline">
                                    <span>
                                        Created Date: {viewingService.createdAt}
                                    </span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                                            viewingService.status === 'Active'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-rose-100 text-rose-800'
                                        }`}
                                    >
                                        {viewingService.status}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setViewingService(null)}
                                    className="mt-4 w-full cursor-pointer rounded-lg bg-surface-container py-2.5 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container-high"
                                >
                                    Close Detail
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
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
