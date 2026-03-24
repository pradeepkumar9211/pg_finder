import { Link } from 'react-router-dom';

const PGCard = ({ pg }) => {
  console.log(pg)
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4">

      {/* Image */}
      <div className="w-full h-44 bg-gray-100 rounded-lg overflow-hidden mb-3">
        {pg.images && pg.images.length > 0 ? (
          <img
            src={`http://localhost:5000/${pg.images[0]}`}
            alt={pg.pg_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <h3 className="font-semibold text-gray-800 text-base mb-1">{pg.pg_name}</h3>

      <p className="text-gray-500 text-sm mb-1">
        {pg.address}, {pg.city} — {pg.pincode}
      </p>

      <p className="text-gray-500 text-sm mb-3">
        Room type: <span className="capitalize">{pg.room_type}</span>
      </p>

      <div className="flex items-center justify-between">
        <span className="text-blue-600 font-semibold text-sm">
          ₹{pg.rent} / month
        </span>
        <Link
          to={`/pg/${pg.pg_id}`}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>

    </div>
  );
};

export default PGCard;