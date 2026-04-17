
import {
  LucideWatch,
  LucideSmartphone,
  LucideGlasses,
  LucidePlus,
  LucideQrCode,
  LucideWifi,
} from "lucide-react";

export const ConnectedDevices = () => {
  const devices = [
    {
      id: "1",
      name: "Galaxy Watch 6",
      type: "watch",
      status: "connected",
      battery: 84,
    },
    {
      id: "2",
      name: "Ray-Ban Meta",
      type: "glasses",
      status: "connected",
      battery: 12,
    },
    {
      id: "3",
      name: "Pulse Band v2",
      type: "band",
      status: "disconnected",
      battery: 0,
    },
  ];

  return (
    <div className="glass-card rounded-[2rem] p-8 border border-white/5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-container/10 text-primary-container">
            <LucideWifi size={20} />
          </div>
          <h3 className="text-xl font-headline font-black text-on-surface uppercase tracking-tight">
            My Devices
          </h3>
        </div>
        <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
          Pair New
        </button>
      </div>

      <div className="space-y-4 flex-grow">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              device.status === "connected"
                ? "bg-white/5 border-white/10 hover:border-primary-container/30"
                : "bg-surface-container-low/20 border-white/5 opacity-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-slate-400">
                {device.type === "watch" ? (
                  <LucideWatch size={24} />
                ) : device.type === "glasses" ? (
                  <LucideGlasses size={24} />
                ) : (
                  <LucideSmartphone size={24} />
                )}
              </div>
              <div>
                <h4 className="text-sm font-headline font-bold text-on-surface uppercase tracking-tight">
                  {device.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${device.status === "connected" ? "bg-primary-container animate-pulse" : "bg-slate-600"}`}
                  />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {device.status}
                  </span>
                </div>
              </div>
            </div>

            {device.status === "connected" && (
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-headline font-black text-on-surface">
                  {device.battery}%
                </p>
                <div className="w-10 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-primary-container"
                    style={{ width: `${device.battery}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        <DeviceAction icon={<LucidePlus size={16} />} label="Add Node" />
        <DeviceAction icon={<LucideQrCode size={16} />} label="Scan QR" />
      </div>
    </div>
  );
};

const DeviceAction = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="py-3 px-4 rounded-xl border-2 border-dashed border-white/10 text-slate-500 hover:text-white hover:border-white/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
    {icon}
    {label}
  </button>
);
