import React from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiClipboard,
  FiClock,
  FiDollarSign,
  FiEye,
  FiEyeOff,
  FiGrid,
  FiHome,
  FiLoader,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiShield,
  FiUser,
  FiUsers,
  FiVolume2,
  FiX,
} from "react-icons/fi";

const wrapIcon = (Component) => {
  const WrappedIcon = ({ size = 20, className = "", ...props }) => (
    <Component
      size={size}
      className={className}
      aria-hidden="true"
      {...props}
    />
  );

  return WrappedIcon;
};

export const DashboardIcon = wrapIcon(FiGrid);
export const UserIcon = wrapIcon(FiUser);
export const UsersIcon = wrapIcon(FiUsers);
export const ClockIcon = wrapIcon(FiClock);
export const CalendarIcon = wrapIcon(FiCalendar);
export const DollarIcon = wrapIcon(FiDollarSign);
export const MegaphoneIcon = wrapIcon(FiVolume2);
export const BuildingIcon = wrapIcon(FiHome);
export const ClipboardIcon = wrapIcon(FiClipboard);
export const PlusIcon = wrapIcon(FiPlus);
export const LogOutIcon = wrapIcon(FiLogOut);
export const EyeIcon = wrapIcon(FiEye);
export const EyeOffIcon = wrapIcon(FiEyeOff);
export const ShieldIcon = wrapIcon(FiShield);
export const ArrowRightIcon = wrapIcon(FiArrowRight);
export const MenuIcon = wrapIcon(FiMenu);
export const XIcon = wrapIcon(FiX);
export const ChevronLeftIcon = wrapIcon(FiChevronLeft);
export const CheckCircleIcon = wrapIcon(FiCheckCircle);
export const BriefcaseIcon = wrapIcon(FiBriefcase);

export const SpinnerIcon = ({ size = 18, className = "", ...props }) => (
  <FiLoader
    size={size}
    className={`icon-spin ${className}`.trim()}
    aria-hidden="true"
    {...props}
  />
);
