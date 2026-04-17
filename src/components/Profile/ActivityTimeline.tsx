
import {
  LucideFootprints,
  LucideShoppingBag,
  LucideMapPin,
  LucideHistory,
} from "lucide-react";

export const ActivityTimeline = () => {
  const activities = [
    {
      id: "1",
      title: "Entered Gate Alpha",
      desc: "Verified via Pulse Sync",
      time: "12m ago",
      icon: <LucideMapPin size={16} />,
      color: "bg-emerald-500",
    },
    {
      id: "2",
      title: "Route Complete",
      desc: "Gate Alpha → Sector C4",
      time: "45m ago",
      icon: <LucideFootprints size={16} />,
      color: "bg-primary-container",
    },
    {
      id: "3",
      title: "Merch Purchase",
      desc: "Lions Official Jersey",
      time: "1h ago",
      icon: <LucideShoppingBag size={16} />,
      color: "bg-secondary-container",
    },
  ];

  return (
    <div className="glass-card rounded-[2rem] p-8 border border-white/5 group hover:neon-glow-primary transition-all duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-container/10 text-primary-container">
            <LucideHistory size={20} />
          </div>
          <h3 className="text-xl font-headline font-black text-on-surface uppercase tracking-tight">
            Recent Journey
          </h3>
        </div>
        <button className="text-[10px] font-black text-primary-container uppercase tracking-widest hover:text-white transition-colors">
          Full Log
        </button>
      </div>

      <div className="relative space-y-10 pl-10 border-l border-white/5 ml-4">
        {activities.map((activity, idx) => (
          <div key={activity.id} className="relative group/item">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-surface-container-high border-4 border-surface-container flex items-center justify-center transition-all group-hover/item:scale-110 shadow-lg ${idx === 0 ? "ring-4 ring-primary-container/10" : ""}`}
            >
              <div
                className={`text-on-surface ${idx === 0 ? "text-primary-container" : "text-slate-500"}`}
              >
                {activity.icon}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-headline font-black text-on-surface uppercase tracking-tight">
                  {activity.title}
                </h4>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {activity.time}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                {activity.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Map visualization placeholder */}
      <div className="mt-12 h-32 rounded-3xl bg-surface-container-high/40 border border-white/5 relative overflow-hidden group/map cursor-pointer">
        <div className="absolute inset-0 opacity-20 filter grayscale contrast-200 group-hover:scale-110 transition-transform">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#00f5a0_0%,_transparent_70%)] opacity-30 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] opacity-40">
            View Heatmap Log
          </span>
        </div>
      </div>
    </div>
  );
};
