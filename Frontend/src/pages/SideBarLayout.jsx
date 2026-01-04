import { Outlet } from "react-router-dom";

function SidebarLayout() {
  return (
    <div>
      <p>Sidebar Layout</p>
      <Outlet />
    </div>
  );
}

export default SidebarLayout;
