"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ci, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar token y datos del usuario en el navegador
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Redirigir al dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 font-sans">
      <header className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Comunidad Gestión
        </h1>
        <p className="text-sm font-semibold text-slate-600">
          Sistema de Gestión de Juntas Vecinales (OTB)
        </p>
      </header>

      <main className="w-full max-w-md">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 md:p-8 transition-all duration-300 hover:shadow-md">
          <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNrjdbipq1-214yxt7ASu_bQh7eV-RvtwC5DMPl64r09Vc9btaz95OkfEjPX1m16kzGD0wtBJ16R_G36lMtG1Y-YNQCOTovgYVubFRH51QMeNqfqgmSqYbtLyaqHabSinbVZQyAAYp0J7yCFod8LvBI5cNF_3twjSDoyPHV3azEc4HNMLR6UOUTYSyfiEeK9B5hVKNKe4GykGcCcrYfr68jywSHBcPW0PQU1HvcdP4p7xwqVZFN7FM"
              alt="Comunidad en Cochabamba"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              Bienvenido de nuevo
            </h2>
          </div>

          {/* Banner de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Campo CI */}
            <div className="space-y-1">
              <label
                className="text-sm font-semibold text-slate-900 block"
                htmlFor="ci"
              >
                Cédula de Identidad (CI)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  badge
                </span>
                <input
                  className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 transition-all outline-none"
                  id="ci"
                  name="ci"
                  placeholder="Ej. 1234567"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  required
                  type="text"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label
                  className="text-sm font-semibold text-slate-900 block"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <a
                  className="text-xs font-semibold text-blue-700 hover:underline transition-all"
                  href="#"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  lock
                </span>
                <input
                  className="w-full h-12 pl-10 pr-12 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-base focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 transition-all outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-700 p-1 rounded-md transition-colors"
                  onClick={togglePassword}
                  type="button"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Botón de Submit */}
            <button
              disabled={loading}
              className="w-full h-14 bg-blue-800 text-white font-semibold rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              type="submit"
            >
              <span>{loading ? "Verificando..." : "Iniciar Sesión"}</span>
              <span className="material-symbols-outlined">login</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-4">
            <p className="text-center text-sm text-slate-600">
              ¿No tienes acceso?{" "}
              <a className="text-blue-700 font-bold hover:underline" href="#">
                Contactar Administrador
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center">
        <p className="text-sm font-medium text-slate-400">
          © 2026 Comunidad Gestión • Cochabamba, Bolivia
        </p>
      </footer>
    </div>
  );
}
