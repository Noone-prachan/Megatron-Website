import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { api } from "../../../lib/api";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Save token
      api.setToken(token);

      // Parse token and save user info to localStorage
      try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(payloadJson);
        if (payload?.id) {
          localStorage.setItem("discord_id", String(payload.id));
        }
        if (payload?.username) {
          localStorage.setItem("discord_username", String(payload.username));
        }
        if (payload?.global_name) {
          localStorage.setItem("discord_global_name", String(payload.global_name));
        }
        if (payload?.avatar) {
          localStorage.setItem("discord_avatar", String(payload.avatar));
        }
      } catch (error) {
        console.error("Failed to parse token:", error);
      }

      // Redirect to home after 1 second
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      // Error - redirect to home
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [searchParams, navigate]);

  const token = searchParams.get("token");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a0b2e] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {token ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Login Successful!</h1>
            <p className="text-gray-400">Redirecting you to the marketplace...</p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Login Failed</h1>
            <p className="text-gray-400">Something went wrong. Redirecting...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}