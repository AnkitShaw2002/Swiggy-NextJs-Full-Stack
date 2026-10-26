// features/typescript/navbar.type.ts
import { LucideIcon } from "lucide-react";
import { AppNotification } from "@/features/typescript/notification.type";

export type UserRole = "user" | "restaurant_owner" | "admin";

export interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
}

export interface NavLinkItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: number;
}

export interface NavCartItem {
  foodName: string;
  quantity: number;
  price: number;
  image?: string;
  isVeg?: boolean;
}

export interface NavbarChildProps {
  user: NavUser | null;
  links: NavLinkItem[];
  onLogout: () => void;
  onMockLogin?: (role: UserRole) => void;
  cartItems?: NavCartItem[];
  cartTotal?: number;
  onFetchCart?: () => void;
  notifications?: AppNotification[];
  unreadCount?: number;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
}

