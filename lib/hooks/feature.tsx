import { CheckCircle2 } from "lucide-react";

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <CheckCircle2 className="mt-1 h-6 w-6 text-white" />

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-white/85">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Feature;