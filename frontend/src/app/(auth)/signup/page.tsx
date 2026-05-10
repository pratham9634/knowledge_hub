"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, BookOpen, Mail, Lock, User } from "lucide-react"
import { signupUser } from "@/services/auth.service"


const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required")
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match"
    }
  )


type SignupFormData = z.infer<typeof signupSchema>


export default function SignupPage() {

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success("Account created successfully")
      router.push("/login")
    },
    onError: (error: any) => {
      toast.error(Array.isArray(error?.response?.data?.detail) ? error.response.data.detail[0].msg : error?.response?.data?.detail || "Signup failed")
    }
  })

  const onSubmit = (data: SignupFormData) => {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4 py-8">

      {/* ── Animated Background ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-chart-2/6 blur-[130px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* ── Grid Pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.95 0.005 270) 1px, transparent 1px), linear-gradient(90deg, oklch(0.95 0.005 270) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Signup Card ── */}
      <div className="relative z-10 w-full max-w-[420px] animate-slide-up">

        {/* ── Brand ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20 shadow-lg shadow-primary/10 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start organizing your knowledge</p>
        </div>

        {/* ── Card ── */}
        <div className="glass rounded-2xl p-8 shadow-xl shadow-black/20">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* NAME */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:border-primary/50 focus:bg-muted/50 transition-all rounded-xl"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-[13px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:border-primary/50 focus:bg-muted/50 transition-all rounded-xl"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[13px] text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:border-primary/50 focus:bg-muted/50 transition-all rounded-xl"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-[13px] text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-muted/30 border-border/60 focus:border-primary/50 focus:bg-muted/50 transition-all rounded-xl"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[13px] text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-xl text-[15px] font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer"
              style={{ background: isPending ? undefined : 'var(--accent-gradient)' }}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

          </form>

          {/* ── Divider ── */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground/60">or</span>
            </div>
          </div>

          {/* LOGIN LINK */}
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
