import { MessageSquare } from "lucide-react";

export default function LoadingScreen({ message = "Preparing your secure conversation..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-5">
        <MessageSquare className="w-6 h-6 stroke-[2.2]" />
      </div>

      <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-2">
        BIS Sahayak
      </h2>

      <p className="text-xs text-neutral-400 font-normal mb-5">
        {message}
      </p>

      {/* Animated 3 Dots */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
      </div>
    </div>
  );
}