import { useState } from 'react';
import { Clock, Check, User, CalendarRange, MapPinHouse, CalendarDays, Eye } from 'lucide-react';
import { StaffAvailability, TeamMember, DaySchedule } from '@/types';

interface AvailabilityTabProps {
  staffMembers: TeamMember[];
  availability: StaffAvailability[];
  onSaveAvailability: (staffId: string, updatedSchedule: DaySchedule[]) => void;
}

const HOURS_LIST = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:05 PM', '05:00 PM', '06:00 PM', '07:00 PM'
];

export default function AvailabilityTab({
  staffMembers,
  availability,
  onSaveAvailability,
}: AvailabilityTabProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffMembers[0]?.id || '1');
  const [currentAvailability, setCurrentAvailability] = useState<StaffAvailability | null>(
    availability.find((a) => a.staffId === selectedStaffId) || availability[0] || null
  );

  // When selected staff member changes:
  const handleSelectStaff = (id: string) => {
    setSelectedStaffId(id);
    const foundAvail = availability.find((a) => a.staffId === id);
    if (foundAvail) {
      // Create a deep copy to allow local editing
      setCurrentAvailability(JSON.parse(JSON.stringify(foundAvail)));
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    if (!currentAvailability) return;
    const copy = { ...currentAvailability };
    copy.schedule[dayIndex].active = !copy.schedule[dayIndex].active;
    setCurrentAvailability(copy);
  };

  const handleChangeStart = (dayIndex: number, val: string) => {
    if (!currentAvailability) return;
    const copy = { ...currentAvailability };
    copy.schedule[dayIndex].start = val;
    setCurrentAvailability(copy);
  };

  const handleChangeEnd = (dayIndex: number, val: string) => {
    if (!currentAvailability) return;
    const copy = { ...currentAvailability };
    copy.schedule[dayIndex].end = val;
    setCurrentAvailability(copy);
  };

  const handleSave = () => {
    if (!currentAvailability) return;
    onSaveAvailability(currentAvailability.staffId, currentAvailability.schedule);
  };

  const selectedStaffMember = staffMembers.find((m) => m.id === selectedStaffId);

  return (
    <div className="space-y-6">
      {/* Staff Select Deck */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-md font-bold text-slate-800">Select Teammate to Configure</h3>
          <p className="text-xs text-gray-400 mt-0.5">Define unique operating hours and general weekly schedules for individual handlers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {staffMembers.map((member) => {
            const isActive = selectedStaffId === member.id;
            return (
              <button
                key={member.id}
                onClick={() => handleSelectStaff(member.id)}
                className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isActive
                    ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center border ${
                    isActive ? 'bg-purple-700 text-white border-purple-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {member.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800">{member.name}</h4>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                </div>
                {isActive && (
                  <span className="w-5 h-5 rounded-full bg-purple-700 flex items-center justify-center text-white text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roster Calendar Hours schedule block */}
      {currentAvailability && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-purple-50 rounded-xl text-purple-700">
                <CalendarRange className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-md font-bold text-slate-800">Shift Schedule for {selectedStaffMember?.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Toggle active workdays and define standard start/end hours below.</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-center"
            >
              Apply Shift Hours
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {currentAvailability.schedule.map((day, idx) => (
              <div
                key={day.day}
                className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 transition-colors ${
                  day.active ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                {/* Day title & active toggle */}
                <div className="flex items-center gap-4 w-44 shrink-0">
                  <button
                    onClick={() => handleToggleDay(idx)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      day.active ? 'bg-purple-700' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        day.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <div>
                    <span className="font-semibold text-slate-800 block text-sm">{day.day}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      day.active ? 'text-purple-700' : 'text-gray-400'
                    }`}>
                      {day.active ? 'Operational' : 'Off-Duty'}
                    </span>
                  </div>
                </div>

                {/* Dropdowns */}
                {day.active ? (
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <select
                      value={day.start}
                      onChange={(e) => handleChangeStart(idx, e.target.value)}
                      className="bg-white border border-slate-200 hover:border-slate-300 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none rounded-lg p-2 text-xs"
                    >
                      {HOURS_LIST.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>

                    <span className="text-gray-400 font-semibold mx-1">to</span>

                    <select
                      value={day.end}
                      onChange={(e) => handleChangeEnd(idx, e.target.value)}
                      className="bg-white border border-slate-200 hover:border-slate-300 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 outline-none rounded-lg p-2 text-xs"
                    >
                      {HOURS_LIST.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-gray-400 italic">No bookings scheduled on off-duty days</p>
                )}

                {/* Status Badge */}
                <div className="sm:text-right">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    day.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-gray-400 border border-slate-200'
                  }`}>
                    {day.active ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
