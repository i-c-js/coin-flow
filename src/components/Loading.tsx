import { Droplets } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center py-20 text-wave">
      <Droplets className="animate-bounce" size={36} />
    </div>
  );
}
