import { AdminBooking, ClinicService, Staff, ActivityLog } from '@/types';

export const INITIAL_SERVICES: ClinicService[] = [
    {
        id: 'srv_1',
        name: 'Root Canal Treatment',
        price: 450,
        durationMinutes: 60,
        color: 'primary',
        colorHex: '#630ed4',
    },
    {
        id: 'srv_2',
        name: 'Dental Cleaning & Hygiene',
        price: 120,
        durationMinutes: 45,
        color: 'tertiary',
        colorHex: '#7d3d00',
    },
    {
        id: 'srv_3',
        name: 'Orthodontic Consult',
        price: 150,
        durationMinutes: 30,
        color: 'muted',
        colorHex: '#565e74',
    },
    {
        id: 'srv_4',
        name: 'Pediatric Checkup',
        price: 95,
        durationMinutes: 30,
        color: 'primary',
        colorHex: '#630ed4',
    },
    {
        id: 'srv_5',
        name: 'Dental Implants',
        price: 1200,
        durationMinutes: 90,
        color: 'error',
        colorHex: '#ba1a1a',
    },
];

export const INITIAL_STAFF: Staff[] = [
    {
        id: 'st_1',
        name: 'Alex Rivera',
        role: 'Lead Admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8bsT9yYeaulCPefDEgepD_1aIBrnscFsgKYQ_qbg1mppLuieWuRE8FY0FMLDutmlFBhM1GX1Vwbz-GEUHS_iDxmZ-koPuGFxtzsSUD_iQRfV8Y2zYzVdQq_i957kXghe1UciItei55IbjXa9EzM2eir96nrgbZ-CYidyDg12ubYIlfSDSiMxiO-I9wGYzxCNsYHt5ugRO4PshnXHzAiMaVRITuyEHDN4ULAh0jxJXf0kR2BuENOTLmI6c2nicgXww-aEKHTbQG0M',
        isActive: true,
        onLeave: false,
        colorHex: '#630ed4',
    },
    {
        id: 'st_2',
        name: 'Dr. Elena Vance',
        role: 'Senior Dentist',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
        isActive: true,
        onLeave: false,
        colorHex: '#7d3d00',
    },
    {
        id: 'st_3',
        name: 'Dr. Marcus Brody',
        role: 'Orthodontist Specialist',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
        isActive: true,
        onLeave: false,
        colorHex: '#565e74',
    },
    {
        id: 'st_4',
        name: 'Michael Lin',
        role: 'Dental Assistant',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
        isActive: false,
        onLeave: true,
        colorHex: '#ba1a1a',
    },
    {
        id: 'st_5',
        name: 'Dr. Sarah Jenkins',
        role: 'Pediatric Specialist',
        avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200',
        isActive: true,
        onLeave: false,
        colorHex: '#0891b2',
    },
];

export const INITIAL_BOOKINGS: AdminBooking[] = [
    {
        id: 'b_1',
        clientName: 'Sarah Jenkins',
        clientPhone: '+1 (555) 349-2041',
        clientEmail: 'sarah.j@example.com',
        serviceId: 'srv_1', // Root Canal
        staffId: 'st_2', // Dr Elena Vance
        room: '102',
        date: '2026-06-09',
        time: '09:00 AM',
        status: 'Confirmed',
        notes: 'Patient reports mild swelling in upper left molar.',
        createdTime: Date.now() - 3600000 * 24,
    },
    {
        id: 'b_2',
        clientName: 'Michael Chen',
        clientPhone: '+1 (555) 782-9012',
        clientEmail: 'mchen@example.com',
        serviceId: 'srv_2', // Dental Cleaning
        staffId: 'st_5', // Dr Sarah Jenkins (as Dentist) Or Assistance
        room: '105',
        date: '2026-06-09',
        time: '11:30 AM',
        status: 'In Progress',
        notes: 'Regular 6-month cleaning checkup.',
        createdTime: Date.now() - 3600000 * 48,
    },
    {
        id: 'b_3',
        clientName: 'Emma Wilson',
        clientPhone: '+1 (555) 124-7856',
        clientEmail: 'em.wilson@example.com',
        serviceId: 'srv_3', // Orthodontic Consult
        staffId: 'st_3', // Dr Marcus Brody
        room: '201',
        date: '2026-06-09',
        time: '02:15 PM',
        status: 'Upcoming',
        notes: 'Initial evaluation for clear aligners.',
        createdTime: Date.now() - 3600000 * 5,
    },
    {
        id: 'b_4',
        clientName: "Liam O'Brien",
        clientPhone: '+1 (555) 893-4712',
        clientEmail: 'lobrien@example.com',
        serviceId: 'srv_4', // Pediatric Checkup
        staffId: 'srv_4', // Dr. Sarah Jenkins
        room: '104',
        date: '2026-06-09',
        time: '04:45 PM',
        status: 'Upcoming',
        notes: 'Child routine dental exam and fluoride application.',
        createdTime: Date.now() - 3600000 * 12,
    },
    {
        id: 'b_5',
        clientName: 'Olivia Martinez',
        clientPhone: '+1 (555) 512-8833',
        clientEmail: 'olivia.m@example.com',
        serviceId: 'srv_5', // Dental Implants
        staffId: 'st_2', // Dr. Elena Vance
        room: '102',
        date: '2026-06-10',
        time: '10:00 AM',
        status: 'Confirmed',
        notes: 'Stage 2 implant fixture placement.',
        createdTime: Date.now() - 3600000 * 8,
    },
];

export const INITIAL_LOGS: ActivityLog[] = [
    {
        id: 'log_1',
        type: 'booking_new',
        title: 'New Booking',
        description: 'Sarah Jenkins scheduled a Root Canal.',
        timestamp: '2 minutes ago',
        createdTime: Date.now() - 2 * 60 * 1000,
    },
    {
        id: 'log_2',
        type: 'booking_rescheduled',
        title: 'Rescheduled',
        description: 'Michael Chen moved his 11:30 appointment.',
        timestamp: '45 minutes ago',
        createdTime: Date.now() - 45 * 60 * 1000,
    },
    {
        id: 'log_3',
        type: 'booking_cancelled',
        title: 'Cancelled',
        description: 'David Miller cancelled his dental cleaning.',
        timestamp: '2 hours ago',
        createdTime: Date.now() - 120 * 60 * 1000,
    },
    {
        id: 'log_4',
        type: 'staff_new',
        title: 'New Staff',
        description: 'Dr. Elena Vance added to the system.',
        timestamp: '5 hours ago',
        createdTime: Date.now() - 300 * 60 * 1000,
    },
];

export const ROOMS = ['101', '102', '104', '105', '201', '202'];
