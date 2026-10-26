"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../layout/sidebar";


const HIDDEN_ROUTES = ["/", "/auth/signin"];

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const hideLayout = HIDDEN_ROUTES.includes(pathname);

    return (
        <div className="flex min-h-screen">
            {!hideLayout && <Sidebar />}
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}