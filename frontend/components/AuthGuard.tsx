"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // Proteger rutas de administrador: si es vecino, redirigir a su portal
      if (user.rol === "vecino" && !pathname.startsWith("/vecino")) {
        router.replace("/vecino/dashboard");
      }
    } catch {
      router.replace("/login");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
