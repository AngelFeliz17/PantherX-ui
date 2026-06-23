"use client";

import { useParams, useRouter } from "next/navigation";
import { use, useState } from "react";
import { AlertTriangle, ArrowLeft, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { report } from "@/lib/api/report";

type Props = {
    params: Promise<{ id: string }>;
}

interface Message {
  message: string;
  status: number;
}

export default function ReportPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);

  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<Message>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) return;

    try {
      setLoading(true);
      const result = await report(id, reason);
      setTimeout(() => {
        router.back();
      }, 5000)
      setMessage(result);
    } catch (error: any) {
        setMessage(error.response?.data ?? "Something went wrong" );
        setTimeout(() => {
            router.back();
        }, 5000)
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg border-border/60 shadow-lg">
        <CardHeader className="space-y-4">
          <Button
            variant="ghost"
            className="w-fit px-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <Flag className="h-6 w-6" />
            </div>

            <div>
              <CardTitle className="text-2xl">Report Listing</CardTitle>
              <p className="text-sm text-muted-foreground">
                Help keep PantherX safe by describing why you are reporting this listing.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              Reports are reviewed by moderators. False reports may result in restrictions on your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Example: This listing contains prohibited items, spam, scams, or inappropriate content."
                className="focus-visible:ring-1"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={6}
                maxLength={500}
              />
              <p className="text-right text-xs text-muted-foreground">
                {reason.length}/500
              </p>
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
                    {message?.message}
                  </p>
                </div>
              )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !reason.trim()}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}