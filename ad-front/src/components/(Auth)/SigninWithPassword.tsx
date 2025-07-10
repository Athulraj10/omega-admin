"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
// import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { login } from "../redux/action/auth/loginAction";
import { setLocalStorageItem } from "@/utils/helperWindows";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UserDetailsType } from "@/types/UserDetailsType";


export default function SigninWithPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading: authLoading, error: authError } = useAppSelector((state) => state.auth);
  
  const [data, setData] = useState({
    email:"",
    password:"",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Listen for auth state changes
  useEffect(() => {
    if (authError) {
      setLoading(false);
      setErrorMessage(authError);
    }
  }, [authError]);

  // Listen for auth loading state
  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading]);

  // Listen for successful login
  useEffect(() => {
    const authState = useAppSelector((state) => state.auth);
    if (authState.data && authState.data.token && !authState.loading) {
      setLoading(false);
      console.log('✅ Login successful:', authState.data);
      setLocalStorageItem("token", authState.data.token);
      setLocalStorageItem("adminData", JSON.stringify(authState.data));
      router.push("/dashboard");
    }
  }, [authLoading]);

  // Clear error message when user starts typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(""); // Clear error when user types
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    dispatch(
      login({
        data: {
          email: data.email,
          password: data.password,
          device_code: "web-admin"
        }
      })
    );

    // Set a timeout to stop loading if no response
    setTimeout(() => {
      if (loading) {
        setLoading(false);
        setErrorMessage("Request timeout. Please try again.");
      }
    }, 10000); // 10 seconds timeout
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Error Message Display */}
      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 text-sm font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        {/* <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link> */}
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
