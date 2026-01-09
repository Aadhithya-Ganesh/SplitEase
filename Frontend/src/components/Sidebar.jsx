import { motion } from "motion/react";
import Logo from "./Logo";
import { NavLink, useLoaderData, Form } from "react-router-dom";
import { Plus, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import Modal from "./ui/Modal";
import JoinGroup from "./JoinGroup";
import CreateGroup from "./CreateGroup";

function Sidebar({ navlist }) {
  const data = useLoaderData();
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [joinGroupModal, setJoinGroupModal] = useState(false);

  const createGroupOnSuccess = () => {
    setCreateGroupModal(!createGroupModal);
  };

  const joinGroupOnSuccess = () => {
    setJoinGroupModal(!joinGroupModal);
  };

  return (
    <motion.div
      initial={{ x: -350 }}
      animate={{ x: 0 }}
      exit={{ x: -350 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="bg-sidebar-background border-r-border sticky top-0 hidden h-screen flex-col overflow-hidden border md:flex"
    >
      <div className="border-sidebar-border border-b p-5">
        <Logo />
      </div>
      <ul className="px-2 pt-5 text-sm">
        <p className="text-muted-foreground px-2 py-3 font-semibold">
          Navigation
        </p>
        <div className="flex flex-col gap-2">
          {navlist.map((item, index) => {
            return (
              <NavLink
                to={`/${item.page.toLowerCase()}`}
                key={index}
                className={({ isActive }) =>
                  `mx-2 rounded-lg p-2 ${
                    isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                  }`
                }
              >
                <li className="text-sidebar-foreground flex items-center gap-3">
                  <item.icon size={20} />
                  <p className="font-bold">{item.page}</p>
                </li>
              </NavLink>
            );
          })}
        </div>
      </ul>
      <ul className="px-2 py-5 text-sm">
        <div className="flex items-center justify-between px-2">
          <p className="text-muted-foreground px-2 py-3 text-sm font-semibold">
            Groups
          </p>
          <div className="mx-1 flex justify-between gap-2">
            <div
              onClick={() => setJoinGroupModal(!joinGroupModal)}
              className="hover:bg-accent text-sidebar-foreground cursor-pointer rounded-lg p-1"
            >
              <UserPlus size={18} />
            </div>
            <div
              onClick={() => setCreateGroupModal(!createGroupModal)}
              className="hover:bg-accent text-sidebar-foreground cursor-pointer rounded-lg p-1"
            >
              <Plus size={18} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {data.map((item, index) => {
            return (
              <NavLink
                to={`/group/${item.id}`}
                key={index}
                className={({ isActive }) =>
                  `mx-2 rounded-lg p-2 ${
                    isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                  }`
                }
              >
                <li className="text-sidebar-foreground flex justify-between">
                  <div className="flex items-center gap-3">
                    <Users size={18} />
                    <p className="text-sm font-bold">{item.name}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    {item.balance > 0 ? (
                      <TrendingUp className="text-primary" size={18} />
                    ) : (
                      <TrendingDown className="text-destructive" size={18} />
                    )}
                    <p
                      className={`${item.balance > 0 ? "text-primary" : "text-destructive"} font-bold`}
                    >
                      ${item.balance > 0 ? item.balance : item.balance * -1}
                    </p>
                  </div>
                </li>
              </NavLink>
            );
          })}
        </div>
      </ul>
      <Modal
        open={joinGroupModal}
        onClose={() => setJoinGroupModal(false)}
        heading="Join Group"
      >
        <JoinGroup onSuccess={joinGroupOnSuccess} />
      </Modal>
      <Modal
        open={createGroupModal}
        onClose={() => setCreateGroupModal(false)}
        heading="Create Group"
      >
        <CreateGroup onSuccess={createGroupOnSuccess} />
      </Modal>
    </motion.div>
  );
}

export default Sidebar;

export function loader() {
  // Group list here
  const groups = [
    {
      id: 1,
      name: "Weekend Trip",
      balance: 76,
    },
    {
      id: 2,
      name: "Roomates",
      balance: -42,
    },
    {
      id: 3,
      name: "Office lunch",
      balance: 12,
    },
  ];

  return groups;
}
