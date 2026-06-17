"use client";

import { useState } from "react";
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
import { classnames } from "@/styles/input.styles";

interface EditProfileModalProps {
  user: {
    name?: string;
    studentEmail?: string;
    bio?: string;
    graduationYear?: string;
  } | null;
}

export default function EditProfileModal({ user }: EditProfileModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.studentEmail ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [graduationYear, setGraduationYear] = useState(
    user?.graduationYear ?? ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: connect to update profile endpoint
    console.log({
      name,
      email,
      bio,
      graduationYear,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 rounded-full px-4 shadow-sm"
        >
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-3xl border-0 p-0 overflow-hidden">
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
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
          </div>

          <div className="border-t px-6 py-5">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <h3 className="text-sm font-semibold text-red-600">
                Delete Account
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This account cannot be restored.
              </p>

              <Button
                type="button"
                variant="destructive"
                className="mt-4 rounded-xl"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure? This account cannot be restored and all your data will be permanently deleted."
                  );

                  if (confirmed) {
                    console.log("Delete account");
                  }
                }}
              >
                Delete Account
              </Button>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="submit" className="rounded-xl px-6">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}