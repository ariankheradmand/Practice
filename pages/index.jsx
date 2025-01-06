import Link from "next/link";
import "../app/globals.css";


const AdminPage = () => {
  return (
    <div className="flex items-center justify-center gap-2  bg-gray-300 min-h-screen">
        <Link className="bg-slate-400 text-black py-2 px-2 rounded-md" href="/main">Main</Link>
        <Link className="bg-slate-800 text-white py-2 px-2 rounded-md" href="/admin">Admin</Link>
    </div>
  );
};

export default AdminPage;