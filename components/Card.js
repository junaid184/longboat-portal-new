import Image from 'next/image';
import Link from 'next/link';

// Card Component
export default function Card({ title, icon, url, count }) {
  return (
    <Link
      href={url}
      className="flex justify-between items-center h-36 rounded-2xl p-5 my-1 bg-gray-50 border-2 border-gray-100 w-[290px] newWidth1 mx-1 mt-4 transform transition-transform duration-300 hover:scale-110 hover:border-gray-400 shadow-md"
    >
      {/* Icon Section */}
      <Image
        src={icon}
        alt="SideBar Image"
        style={{ verticalAlign: 'middle', borderStyle: 'none' }}
        width={40} height={40}
      />
      
      {/* Title Section */}
      <div className="text-[#2F2F2F] font-bold text-2xl max-w-[150px] break-words">
        {title}
      </div>
      
      {/* Count Section */}
      <div className="flex justify-center items-center text-gray-950">
        <span className="text-3xl font-bold">{count}</span>
      </div>
    </Link>
  );
}
