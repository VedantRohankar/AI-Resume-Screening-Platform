import { useState } from "react";
import { registerUser } from "../services/authService.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await registerUser(formData);

      console.log("Registration response:", data);

      setSuccess("Registration successful! Please verify your email.");

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">

          <h1 className="text-3xl font-bold text-center mb-2">
            Create your HireAI account!!
          </h1>

          <p className="text-gray-400 text-center mb-8">
            Start your journey with HireAI
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 font-semibold transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Register;