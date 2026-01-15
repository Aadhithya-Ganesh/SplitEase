import { ThemeToggle } from "../components/ThemeToggle";
import { ArrowRight, Lock, Receipt, Mail, User } from "lucide-react";
import { Form, Link } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { redirect } from "react-router-dom";
import useInput from "../hooks/useInput";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
} from "../utils/FormValidation";
import { toast } from "sonner";

function SignupPage() {
  const {
    value: nameValue,
    handleChange: handleNameChange,
    handleBlur: handleNameBlur,
    error: nameError,
  } = useInput("", validateFullName);

  const {
    value: emailValue,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
    error: emailError,
  } = useInput("", validateEmail);

  const {
    value: passwordValue,
    handleChange: handlePasswordChange,
    handleBlur: handlePasswordBlur,
    error: passwordError,
  } = useInput("", validatePassword);

  const {
    value: confirmPasswordValue,
    handleChange: handleConfirmPasswordChange,
    handleBlur: handleConfirmPasswordBlur,
    error: confirmPasswordError,
  } = useInput("", (value) => validateConfirmPassword(passwordValue, value));

  return (
    <div>
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <div className="bg-background flex min-h-screen items-center justify-center p-5">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="bg-primary m-auto w-fit rounded-xl p-5">
            <Receipt className="text-background" size={30} />
          </div>
          <p className="text-foreground text-center text-3xl font-bold">
            Create account
          </p>
          <p className="text-muted-foreground text-center">
            Start splitting bills with ease
          </p>
          <Form
            method="post"
            className="bg-card border-border flex w-4/5 flex-col gap-6 rounded-lg border px-6 py-8 sm:w-3/4 md:w-2/4 lg:w-2/6"
          >
            <Input
              id="name"
              type="text"
              name="name"
              label="Full Name"
              value={nameValue}
              error={nameError}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              icon={<User />}
              placeholder="John Doe"
            />
            <Input
              id="email"
              type="email"
              name="email"
              value={emailValue}
              error={emailError}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              label="Email"
              icon={<Mail />}
              placeholder="you@example.com"
            />
            <Input
              id="password"
              type="password"
              name="password"
              value={passwordValue}
              error={passwordError}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              label="Password"
              icon={<Lock />}
              placeholder="••••••••"
            />
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPasswordValue}
              error={confirmPasswordError}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              label="Confirm Password"
              icon={<Lock />}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              disabled={
                nameError || emailError || passwordError || confirmPasswordError
              }
              className="bg-primary mt-4 w-full border-none text-white disabled:opacity-50"
            >
              <p>Create Account</p>
              <ArrowRight size={15} />
            </Button>
            <p className="text-muted-foreground text-center font-semibold">
              Already Have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

export async function action({ request }) {
  const data = await request.formData();

  const authData = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
  };

  console.log(authData);

  if (
    validateEmail(authData.email) ||
    validatePassword(authData.password) ||
    validateFullName(authData.name) ||
    validateConfirmPassword(authData.confirmPassword, authData.password)
  ) {
    toast.error("Please fill the form");
    return null;
  }

  toast.success("Signup successfull!");

  return redirect("/login");
}
