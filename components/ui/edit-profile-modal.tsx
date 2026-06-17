"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2 } from "lucide-react";
import { classnames } from "@/styles/input.styles";
import { deleteAccount, update } from "@/lib/api/user";
import { logOut } from "@/lib/api/auth";
import { useUserActions } from "@/context/user-context";

export interface EditProfileModalProps {
  user: { 
    name?: string;
    email?: string;
    bio?: string;
    graduationYear?: string | number;
  } | null;
}

interface Response {
  data: {
    message: string;
    data: EditProfileModalProps;
  };
  status: number;
}

export default function EditProfileModal({ user }: EditProfileModalProps ) {
  const router = useRouter();
  const { refreshUser } = useUserActions();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [graduationYear, setGraduationYear] = useState(
    user?.graduationYear ?? ""
  );

  const [message, setMessage] = useState<Response | null>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setBio(user?.bio ?? "");
    setGraduationYear(user?.graduationYear ?? "");
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await update({
        name,
        email,
        bio,
        graduationYear,
      });
      setMessage(response);
      await refreshUser();
      router.refresh();
    } catch(error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? error.message
        : "Unable to update profile.";

      setMessage({
        data: {
          message,
          data: { user: null },
        },
        status: 500,
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await logOut();
      window.location.replace("/login");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleOpenModal = (open: boolean) => {
    setIsModalOpen(open);
    setMessage(null);
  };
   
  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenModal}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 rounded-full px-4 shadow-sm">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[95vw] sm:max-w-xl rounded-3xl border-0 p-0 overflow-hidden">
        <div className="border-b px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Edit Profile
            </DialogTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your profile information and how other students see you.
            </p>
          </DialogHeader>
        </div>

      {/* Form content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleUpdate}>
            <div className="space-y-5 px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Angel Feliz"
                  className={classnames.input}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@uni.edu"
                  className={classnames.input}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students a little about yourself..."
                  className={classnames.input}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="2027"
                  min={1876}
                  className={classnames.input}
                />
              </div>
              {message && (
                <div
                  className={`rounded-xl p-4 ${
                    message.status === 200
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm first-letter:uppercase ${
                      message.status === 200
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {message?.data?.message}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t px-6 py-5">
              <div className=" flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">
                  Danger Zone
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </div>
              <div className="mt-5 flex justify-end">
                <Button type="submit" className="rounded-xl px-6">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-0 p-0 overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <DialogHeader className="mt-4 text-left">
              <DialogTitle className="text-lg font-semibold">
                Delete your account?
              </DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                This will permanently delete your account, listings, and
                messages. This action{" "}
                <span className="font-medium text-foreground">
                  cannot be undone
                </span>
                .
              </p>
            </DialogHeader>

            <div className="mt-4 space-y-2">
              <Label htmlFor="confirm-delete" className="text-sm">
                Type <span className="font-semibold">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm-delete"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className={classnames.input}
                autoComplete="off"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeleteConfirmText("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-lg"
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                onClick={handleDeleteAccount}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
