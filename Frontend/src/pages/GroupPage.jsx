import { Await, useLoaderData, useOutletContext } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  ChevronRight,
  Crown,
  Plus,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Suspense, useState } from "react";
import Modal from "../components/ui/Modal";
import JoinGroup from "../components/JoinGroup";
import CreateGroup from "../components/CreateGroup";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { apiFetch } from "./../utils/Fetch";
import BackdropLoader from "./../utils/BackdropLoader";
import NothingYet from "../components/ui/NothingYet";

function GroupPage() {
  const { groups } = useLoaderData();
  const { user } = useOutletContext();

  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [joinGroupModal, setJoinGroupModal] = useState(false);

  const createGroupOnSuccess = () => {
    setCreateGroupModal(false);
  };

  const joinGroupOnSuccess = () => {
    setJoinGroupModal(false);
  };

  return (
    <div className="px-4">
      <div className="my-5 flex justify-between">
        <p className="text-foreground text-2xl font-bold md:text-4xl">
          Your Groups
        </p>
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
      <Suspense fallback={<BackdropLoader />}>
        <Await resolve={groups}>
          {(resolvedGroups) =>
            resolvedGroups.length === 0 ? (
              <NothingYet
                heading={"No groups yet"}
                description={"Create or join a group to start splitting bills"}
                icon={Users}
              />
            ) : (
              <div className="space-y-3">
                {resolvedGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/groups/${group.id}`}
                      className="border-border bg-card hover:bg-card/10 flex items-center gap-3 rounded-xl border p-6 transition-colors"
                    >
                      <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                        <Users className="text-primary h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-foreground flex items-center gap-3 truncate text-lg font-medium md:text-xl">
                          {group.name}
                          {group.created_by === user?.id && (
                            <Crown className="size-5 text-yellow-400" />
                          )}
                        </h3>
                        <p className="text-muted-foreground text-xs md:text-base">
                          {group.members_count} member
                          {group.members_count > 1 && "s"}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div
                          className={`flex items-center gap-2 font-medium md:text-lg ${
                            group.balance >= 0
                              ? "text-primary"
                              : group.balance < 0
                                ? "text-destructive"
                                : "text-muted-foreground"
                          }`}
                        >
                          {group.balance >= 0 ? (
                            <TrendingUp className="size-4 md:size-6" />
                          ) : group.balance < 0 ? (
                            <TrendingDown className="size-4 md:size-6" />
                          ) : null}
                          ${Math.abs(group.balance).toFixed(2)}
                        </div>
                        <p className="text-muted-foreground text-sm md:text-base">
                          {group.balance >= 0 ? "you get" : "you owe"}
                        </p>
                      </div>
                      <ChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )
          }
        </Await>
      </Suspense>

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
  return {
    groups: apiFetch("/api/groups", {
      method: "GET",
    }).then((res) => res.json()),
  };
}
