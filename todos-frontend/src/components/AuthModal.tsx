import * as Dialog from "@radix-ui/react-dialog";
import { useAuth } from "../store/AuthContext";
import {
  Box,
  Button,
  Container,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AuthModal: React.FC = () => {
  const { user } = useAuth();
  return (
    <Dialog.Root open={!user}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[350px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Tabs.Root defaultValue="login">
            <Tabs.List className="flex gap-x-1" color="indigo">
              <Tabs.Trigger
                value="login"
                className="text-lg font-medium text-gray-800 flex-1 hover:bg-zinc-300 pb-1 cursor-pointer group"
              >
                <span className="group-hover:bg-zinc-300">Login</span>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className="text-lg font-medium text-gray-800 flex-1 hover:bg-zinc-300 pb-1 cursor-pointer group"
              >
                <span className="group-hover:bg-zinc-300">Register</span>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="login" className="mt-8">
              <LoginForm />
            </Tabs.Content>
            <Tabs.Content value="register" className="mt-8">
              <RegisterForm />
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const { login } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    const toastId = toast.loading("Logging in...");
    try {
      await login(data.email, data.password);
      toast.success("Logged in successfully", { id: toastId });
    } catch (error) {
      toast.error("Invalid email or password", { id: toastId });
    }
  });

  return (
    <Container size="1">
      <form onSubmit={onSubmit}>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-violet12 block"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "This field is required",
            })}
          />
          {errors.email && <Text color="red">{errors.email.message}</Text>}
        </fieldset>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-violet12 block"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <Text color="red">{errors.password.message}</Text>
          )}
        </fieldset>
        <Button className="w-full py-2 rounded-lg" color="blue" mt="0.5rem">
          Login
        </Button>
      </form>
    </Container>
  );
};

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const { register, setValue, getValues, handleSubmit, formState } =
    useForm<RegisterFormData>({});
  const { register: registerUser, login } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    const toastId = toast.loading("Registering...");
    await registerUser(data.email, data.password);
    await login(data.email, data.password);
    toast.success("Registered successfully", { id: toastId });
  });

  return (
    <Container size="3" asChild>
      <form onSubmit={onSubmit}>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-violet12 block"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "This field is required",
            })}
          />
          {formState.errors.email && (
            <Text color="red">{formState.errors.email.message}</Text>
          )}
        </fieldset>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-violet12 block"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {formState.errors.password && (
            <Text color="red">{formState.errors.password.message}</Text>
          )}
        </fieldset>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-violet12 block"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-violet8 outline-none"
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword", {
              required: "This field is required",
              validate: (value, k) =>
                value !== k.password ? "Passwords do not match" : true,
            })}
          />
          {formState.errors.confirmPassword && (
            <Text color="red">{formState.errors.confirmPassword.message}</Text>
          )}
        </fieldset>
        <Button
          type="submit"
          className="w-full py-2 rounded-lg cursor-pointer"
          color="blue"
          mt="0.5rem"
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default AuthModal;
