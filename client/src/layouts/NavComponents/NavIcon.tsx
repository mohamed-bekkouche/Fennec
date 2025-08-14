import type { ReactNode } from "react";
import type React from "react";

interface INavIconProps {
  icon: React.ReactNode;
  action?: () => void;
  styles?: string;
  children?: ReactNode;
}

export const NavIcon = ({ icon, action, styles, children }: INavIconProps) => {
  return (
    <div onClick={action} className={`navIcon ${styles} relative`}>
      {icon}
      {children}
    </div>
  );
};
