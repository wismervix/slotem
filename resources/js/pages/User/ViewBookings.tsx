import GuestLayout from "@/layouts/Guest/GuestLayout";
import type { Booking } from "@/types";

type ViewBookingsProps = {
  bookings: Booking[]
};

const ViewBookings = ({ bookings }: ViewBookingsProps) => {
  return (
      <GuestLayout>
          <main className="mx-auto max-w-5xl px-6 pt-32">
              <h1 className="mb-8 text-3xl font-bold">Your Bookings</h1>

              <div className="space-y-4">
                  {bookings.map((booking: any) => (
                      <div key={booking.id} className="rounded-xl border p-6">
                          <h2 className="font-semibold">
                              {booking.service.name}
                          </h2>

                          <p>{booking.date}</p>
                          <p>{booking.start_time}</p>
                          <p>Status: {booking.status}</p>
                      </div>
                  ))}
              </div>
          </main>
      </GuestLayout>
  );
};

export default ViewBookings;