import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
