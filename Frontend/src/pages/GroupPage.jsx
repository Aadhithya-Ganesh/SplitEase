import { useLoaderData } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  ChevronRight,
  Plus,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import JoinGroup from "../components/JoinGroup";
import CreateGroup from "../components/CreateGroup";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

function GroupPage() {
  const groups = useLoaderData();

  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [joinGroupModal, setJoinGroupModal] = useState(false);

  const createGroupOnSuccess = () => {
    setCreateGroupModal(!createGroupModal);
  };

  const joinGroupOnSuccess = () => {
    setJoinGroupModal(!joinGroupModal);
  };

  return (
    <div className="px-4">
      <div className="my-5 flex justify-between">
        <p className="text-foreground text-2xl font-bold">Your Groups</p>
        <div className="flex gap-5">
          <Button
            onClick={() => setJoinGroupModal(!joinGroupModal)}
            className="text-foreground border-border hover:bg-accent border"
          >
            <UserPlus size={18} />
            <p>Join</p>
          </Button>
          <Button
            onClick={() => setCreateGroupModal(!createGroupModal)}
            className="bg-primary text-primary-foreground"
          >
            <Plus size={18} />
            <p>New Group</p>
          </Button>
        </div>
      </div>
      {/* Suspense here */}
      {groups.length === 0 ? (
        <div className="py-12 text-center">
          <Users className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
          <h3 className="mb-1 text-lg font-medium">No groups yet</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Create a group to start splitting bills
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/groups/${group.id}`}
                className="border-border bg-card hover:bg-card/10 flex items-center gap-3 rounded-xl border p-4 transition-colors"
              >
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-foreground truncate font-medium">
                    {group.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {group.members.length} members
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      group.outstandingBalance > 0
                        ? "text-primary"
                        : group.outstandingBalance < 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {group.outstandingBalance > 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : group.outstandingBalance < 0 ? (
                      <TrendingDown className="h-3.5 w-3.5" />
                    ) : null}
                    ${Math.abs(group.outstandingBalance).toFixed(2)}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {group.outstandingBalance >= 0 ? "you get" : "you owe"}
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
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
    </div>
  );
}

export default GroupPage;

export async function loader() {
  // Group list here
  const mockMembers = [
    { id: "1", name: "You", email: "you@example.com" },
    { id: "2", name: "Alex Johnson", email: "alex@example.com" },
    { id: "3", name: "Sarah Miller", email: "sarah@example.com" },
    { id: "4", name: "Mike Chen", email: "mike@example.com" },
  ];

  const initialGroups = [
    {
      id: "1",
      name: "Weekend Trip",
      members: mockMembers.slice(0, 3),
      createdAt: new Date("2024-01-15"),
      totalExpenses: 450.0,
      outstandingBalance: 75.5,
    },
    {
      id: "2",
      name: "Roommates",
      members: mockMembers,
      createdAt: new Date("2024-02-01"),
      totalExpenses: 1250.0,
      outstandingBalance: -42.25,
    },
    {
      id: "3",
      name: "Office Lunch",
      members: mockMembers.slice(0, 2),
      createdAt: new Date("2024-02-20"),
      totalExpenses: 89.5,
      outstandingBalance: 12.0,
    },
  ];

  return initialGroups;
}
