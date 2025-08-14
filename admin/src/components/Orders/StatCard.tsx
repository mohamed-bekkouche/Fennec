import type { IconType } from "react-icons/lib";

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = "bg-green-500",
}: {
  icon: IconType;
  title: string;
  value: number | string;
  subtitle?: string;
  color: string;
}) => (
  <div className="rounded-sm border bg-off-black p-3 border-warm-gray/20 hover:border-warm-gray/40 transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-3 rounded-sm ${color}`}>
        <Icon className={`text-white`} size={20} />
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && (
          <div className="text-xs text-cold-gray/70">{subtitle}</div>
        )}
      </div>
    </div>
    <div className="text-sm text-cold-gray/70">{title}</div>
  </div>
);

export default StatCard;
