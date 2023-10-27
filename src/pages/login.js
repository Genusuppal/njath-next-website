"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/login.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import Nav from "../components/Navbar/nav";

export default function Login() {
    const [details, setDetails] = useState({ email: "", password: "" });
    const router = useRouter();

    const loginApiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;

    const getLogin = async (router) => {
        const config = {
            withCredentials: true,
        };

        try {
            const response = await axios.get(loginApiUrl, config);

            if (response.status === 200) {
                toast.success(response.data.message);
                router.push("/levels");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        getLogin(router);
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!details.email || !details.password) {
            toast.error("Please fill in both email and password fields");
            return;
        }

        const config = {
            withCredentials: true,
        };

        try {
            const response = await axios.post(loginApiUrl, details, config);

            const cookies = response.headers["set-cookie"];
            if (response.status === 400) {
                toast.error("Login Failed! wrong credentials");
            } else if (response.data.success === false) {
                toast.error(response.data.message);
            } else {
                toast.success("Login Successful!");
                router.push("/levels");
            }
        } catch (error) {
            toast.error("Login Failed! please enter correct password and email");
        }
    };

    return (
        <>
            <Nav className="z-50" userStatus={false}></Nav>
            <ToastContainer autoClose={2000} />

            <Image
                src="/assets/treasure_box.svg"
                className={styles.treasurebox}
                width={900.44}
                height={1000}
                alt=""
				priority={4}
            ></Image>

            <div className={styles.mainContainer}>
                <form className={styles.loginBox} onSubmit={submitHandler}>
                    <div className="head_text">Login</div>

                    <div className="flex flex-col justify-end w-full">
                        <input
                            className="form_input w-full"
                            type="email"
                            placeholder="Email"
                            onChange={(s) => {
                                setDetails({ email: s.target.value, password: details.password });
                            }}
                            required
                        />
                    </div>

                    <div className="flex flex-col justify-end w-full">
                        <input
                            className="form_input"
                            type="password"
                            placeholder="Password"
                            onChange={(s) => {
                                setDetails({ email: details.email, password: s.target.value });
                            }}
                            required
                        />
                        <div className="text-white/90 hover:text-white hover:underline text-sm mt-1.5 self-end font-medium">
                            <Link className="forgot-password-link" href="/forgotPass">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <button type="submit" className="black_btn w-full h-12 rounded-sm text-xl">
                        Login
                    </button>
                    <div className={styles.registerRedir}>
                        <span className="text-white/70 font-medium">
                            Not registered yet?
                            <br />
                        </span>
                        <Link
                            href="/register"
                            className="text-white/90 hover:text-njathgold underline hover:text-njathgold text-sm mt-1.5 self-end font-medium"
                        >
                            Register Now!
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
