import { zodResolver } from "@hookform/resolvers/zod"
import { useSetAtom } from "jotai"
import { toast } from "sonner"

import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"

import { cn } from "@/lib/utils"

import { ButtonWithLoading } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { login } from "@/apis/auth"
import logo from "@/assets/images/logo.svg"
import { tokenAtom, userAtom } from "@/atoms"
import { type LoginFormSchema, loginFormSchema } from "@/components/forms/login/schema"

type Props = {
    className?: string
}

export default function LoginForm({ className }: Readonly<Props>) {
    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const navigate = useNavigate()
    const setUser = useSetAtom(userAtom)
    const setToken = useSetAtom(tokenAtom)

    async function onSubmit(values: LoginFormSchema) {
        try {
            const response = await login(values)

            // Set atoms
            setUser(response?.data?.user)
            setToken(response?.data?.token)

            navigate("/")

            toast.success(response?.message)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    return (
        <div className={cn("sm:w-[500px] w-full container", className)}>
            <div className="border rounded-2xl px-5 py-8 border-border">
                <img src={logo} alt="logo" className="size-28 mx-auto block" />
                <h1 className="text-2xl font-semibold text-center mt-5">تسجيل الدخول</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>البريد الإلكتروني</FormLabel>
                                    <FormControl>
                                        <Input placeholder="البريد الإلكتروني" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>كلمة المرور</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="كلمة المرور" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ButtonWithLoading type="submit" size="lg" loading={form?.formState?.isSubmitting}>
                            تسجيل الدخول
                        </ButtonWithLoading>
                    </form>
                </Form>
            </div>
        </div>
    )
}
