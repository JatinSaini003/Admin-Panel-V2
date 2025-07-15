import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/useAuth";
import Lottie from "lottie-react";
import RightToLeftLoader from '../../assets/Loader/RightToLeftLoader.json';

// Image Imports
import PeerHubLogo from "../../assets/img/PeerHubLogo.png";
import LoginCircle from "../../assets/img/LoginCircle.png";


/**
 * Login form data type
 */
type LoginFormInputs = {
    email: string;
    password: string;
    rememberMe?: boolean;
};


/**
 * Login component — Authenticates admin using custom useAuth hook
 */
function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>();


    /**
     * On form submit, attempt login via useAuth context
     */
    const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {
        try {
            await login(formData.email, formData.password);
            toast.success("Login successful!");
            setTimeout(() => navigate("/"), 1000);
        } catch (err: any) {
            const errorMessage = err?.networkError
                ? "Network error. Please check your connection."
                : err?.message || "An unknown error occurred.";
            toast.error(`Login failed! ${errorMessage}`);
        }
    };

    return (
        <div className="min-h-screen bg-background-default flex items-center gap-32">

            {/* -------------------- Left Panel -------------------- */}
            <div className="hidden lg:flex flex-col justify-evenly h-[600px] w-[700px] ml-14">
                <div className="text-primary text-3xl font-bold absolute top-10 left-14">
                    <img
                        src={PeerHubLogo}
                        alt="PeerHub Logo"
                        className="h-[28px] w-[127px]"
                    />
                </div>
                <div className="h-[300px] w-[360px] mx-auto">
                    <img
                        src={LoginCircle}
                        alt="LoginCircle Illustration"
                        className="h-full w-full"
                    />
                </div>
                <div className="text-primary text-display italic pl-20">
                    <h1>Welcome back!</h1>
                    <h1>Log in to access your dashboard</h1>
                    <h1>and keep things moving!</h1>
                </div>
            </div>


            {/* -------------------- Right Panel - Login Form -------------------- */}
            <div className="bg-default p-8 shadow-2xl max-w-md rounded-xl">
                <h2 className="text-heading">Login</h2>
                <p className="text-caption text-light mb-4 mt-1">
                    Log in to access your dashboard and keep things moving!
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-6">


                        {/* -------------------- Email -------------------- */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-description-medium text-light mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                {...register("email", { required: "Email is required" })}
                                className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            {errors.email && (
                                <p className="text-caption text-danger mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>


                        {/* -------------------- Password -------------------- */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-description-medium text-light mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...register("password", { required: "Password is required" })}
                                    className="w-full px-3 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-light"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-caption text-danger mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>


                        {/* -------------------- Remember Me -------------------- */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                {...register("rememberMe")}
                                className="h-4 w-4 text-primary focus:ring-primary border-border-muted rounded"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 text-caption text-light"
                            >
                                Remember me
                            </label>
                        </div>


                        {/* -------------------- Submit Button -------------------- */}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-primary text-default py-2 px-4 rounded-md hover:bg-[#E35826] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-1">
                                    <span>Logging in</span>
                                    <span className="w-10 h-10">
                                        <Lottie animationData={RightToLeftLoader} loop />
                                    </span>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
