"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Campos de Login
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Campos de Registro (Vecino)
  const [registerData, setRegisterData] = useState({
    nombre: "",
    ci: "",
    telefono: "",
    manzano: "",
    lote: "",
    direccion: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Manejo de inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ci, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Redirigir según el rol del usuario
      if (data.data.user?.rol === "vecino") {
        router.push("/vecino/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  // Manejo de registro de nuevo vecino
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (registerData.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ci: registerData.ci,
          nombre: registerData.nombre,
          telefono: registerData.telefono,
          manzano: registerData.manzano,
          lote: registerData.lote,
          direccion: registerData.direccion,
          password: registerData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la cuenta");
      }

      // Guardar token y datos
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      setSuccess("¡Cuenta creada exitosamente! Redirigiendo a tu portal...");

      setTimeout(() => {
        router.push("/vecino/dashboard");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Error al registrar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-[#f7f9fb] font-sans">
      <header className="w-full max-w-md mb-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#00288e] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            account_balance
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#00288e]">
          Comunidad Gestión
        </h1>
        <p className="text-xs md:text-sm font-semibold text-[#444653] mt-0.5">
          Sistema Oficial de Junta Vecinal OTB · Cochabamba
        </p>
      </header>

      <main className="w-full max-w-md">
        <div className="bg-white border border-[#c4c5d5] shadow-sm rounded-2xl p-6 md:p-8 transition-all">
          {/* Pestañas: Iniciar Sesión / Crear Cuenta */}
          <div className="flex bg-[#f2f4f6] p-1 rounded-xl mb-6 border border-[#c4c5d5]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#00288e] shadow-sm"
                  : "text-[#444653] hover:text-[#00288e]"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-white text-[#00288e] shadow-sm"
                  : "text-[#444653] hover:text-[#00288e]"
              }`}
            >
              Crear Cuenta (Vecino)
            </button>
          </div>

          {/* Banner de error o éxito */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-xs md:text-sm rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                check_circle
              </span>
              <span>{success}</span>
            </div>
          )}

          {/* ── FORMULARIO 1: INICIAR SESIÓN ── */}
          {mode === "login" ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label
                  className="text-xs font-bold text-[#191c1e] block mb-1"
                  htmlFor="ci"
                >
                  Cédula de Identidad (CI)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684]">
                    badge
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-4 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none transition-all"
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

              <div>
                <label
                  className="text-xs font-bold text-[#191c1e] block mb-1"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684]">
                    lock
                  </span>
                  <input
                    className="w-full h-11 pl-10 pr-12 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757684] hover:text-[#00288e] p-1 rounded-md"
                    onClick={togglePassword}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full h-12 bg-[#00288e] text-white font-bold rounded-xl shadow-md hover:bg-[#1e40af] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer text-sm"
                type="submit"
              >
                <span>{loading ? "Verificando..." : "Ingresar"}</span>
                <span className="material-symbols-outlined text-base">
                  login
                </span>
              </button>

              <div className="pt-4 border-t border-[#c4c5d5] text-center">
                <p className="text-xs text-[#444653]">
                  ¿Eres vecino nuevo?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-[#00288e] font-bold hover:underline cursor-pointer"
                  >
                    Crear cuenta aquí
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ── FORMULARIO 2: CREAR CUENTA DE VECINO ── */
            <form className="space-y-3" onSubmit={handleRegister}>
              <div>
                <label className="text-xs font-bold text-[#191c1e] block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez Quispe"
                  value={registerData.nombre}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, nombre: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Cédula (CI) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 7891234"
                    value={registerData.ci}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, ci: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Teléfono / Celular
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 70712345"
                    value={registerData.telefono}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        telefono: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Manzano *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. D-6"
                    value={registerData.manzano}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        manzano: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Lote *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 40"
                    value={registerData.lote}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, lote: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#191c1e] block mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 4 caracteres"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#191c1e] block mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repite la contraseña"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-[#191c1e] text-sm focus:border-[#00288e] focus:bg-white outline-none"
                />
              </div>

              <button
                disabled={loading}
                className="w-full h-11 bg-[#00288e] text-white font-bold rounded-xl shadow-md hover:bg-[#1e40af] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer text-sm"
                type="submit"
              >
                <span>{loading ? "Registrando..." : "Crear mi Cuenta de Vecino"}</span>
                <span className="material-symbols-outlined text-base">
                  how_to_reg
                </span>
              </button>

              <div className="pt-3 border-t border-[#c4c5d5] text-center">
                <p className="text-xs text-[#444653]">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#00288e] font-bold hover:underline cursor-pointer"
                  >
                    Inicia sesión aquí
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="mt-6 text-center">
        <p className="text-xs font-medium text-[#757684]">
          © {new Date().getFullYear()} Comunidad Gestión • OTB Cochabamba, Bolivia
        </p>
      </footer>
    </div>
  );
}
