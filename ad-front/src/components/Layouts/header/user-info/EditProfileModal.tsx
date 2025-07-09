import React, { useState } from "react";
import { useAppDispatch } from "@/components/redux/hooks";
import { updateProfile } from "@/components/redux/action/auth/profileAction";

interface EditProfileModalProps {
  userData: any;
  onClose: () => void;
}

export default function EditProfileModal({ userData, onClose }: EditProfileModalProps) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    dispatch(updateProfile({
      data: {
        id: userData.id,
        name: form.name,
        email: form.email,
        password: form.password || undefined,
      },
      callback: () => {
        onClose();
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 text-black dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 text-black dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 text-black dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-stroke bg-transparent px-3 py-2 text-black dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700 dark:text-gray-300">Show Password</label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-4 py-2 font-medium text-black transition-all hover:shadow-1 dark:border-dark-3 dark:text-white dark:hover:shadow-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-all hover:bg-opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 