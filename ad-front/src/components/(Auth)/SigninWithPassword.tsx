"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
// import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { login } from "../redux/action/auth/loginAction";
import { setLocalStorageItem } from "@/utils/helperWindows";
import { useAppDispatch } from "../redux/hooks";
import { UserDetailsType } from "@/types/UserDetailsType";


export default function SigninWithPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [data, setData] = useState({
    email:"",
    password:"",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const loginCallback = (userData: UserDetailsType) => {
      setLoading(false);
      console.log({userData})
      if (userData?.token) {
        setLocalStorageItem("token", userData.token);
        setLocalStorageItem("adminData", JSON.stringify(userData));
        router.push("/dashboard");
      }
    };

    dispatch(
      login({
        data: {
          email: data.email,
          password: data.password,
          device_code: "web-admin"
        },
        callback: (data: any) => {
          console.log(data)
          loginCallback(data)
        }
      })
    );
  };

  return (
    <form onSubmit={handleSubmit}>
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
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
