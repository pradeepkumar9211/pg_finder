const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const VERIFY_STYLES = {
  not_verified: 'bg-gray-100 text-gray-600',
  verified:     'bg-blue-100 text-blue-700',
};

const BookingCard = ({ booking, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{booking.pg_name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Booking ID: {booking.booking_id}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[booking.status]}`}>
            {booking.status}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${VERIFY_STYLES[booking.verification_status]}`}>
            {booking.verification_status === 'verified' ? 'Verified' : 'Not Verified'}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-1">
        Booked on: {new Date(booking.booking_date).toLocaleDateString()}
      </p>

      {booking.tenant_name && (
        <p className="text-sm text-gray-500 mb-1">
          Tenant: {booking.tenant_name}
        </p>
      )}

      {booking.city && (
        <p className="text-sm text-gray-500 mb-1">
          Location: {booking.city}
        </p>
      )}

      {/* Action buttons passed from parent page */}
      {children && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {children}
        </div>
      )}

    </div>
  );
};

export default BookingCard;