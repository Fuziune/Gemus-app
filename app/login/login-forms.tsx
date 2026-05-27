'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

import { login, signup, signInWithMagicLink } from './actions'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type View = 'signin' | 'signup' | 'magic-link'

export function LoginForms() {
  const router = useRouter()
  const [view, setView] = useState<View>('signin')
  const searchParams = useSearchParams()

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const handleFacebookSignIn = async () => {
    const supabase = createClient()
    const origin = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in with Facebook:', error)
    }
  }

  const SocialButtons = () => (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative flex items-center justify-center py-2">
        <span className="absolute inset-x-0 h-[1px] bg-border" />
        <span className="relative bg-card px-3 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Or continue with
        </span>
      </div>
      <div className="flex gap-3 w-full">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="h-11 rounded-full border-border bg-background font-sans text-[10px] font-medium uppercase tracking-[0.2em] transition-all hover:bg-muted/50 flex-1 flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              style={{ fill: "#4285F4" }}
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              style={{ fill: "#34A853" }}
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              style={{ fill: "#FBBC05" }}
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              style={{ fill: "#EA4335" }}
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleFacebookSignIn}
          className="h-11 rounded-full border-border bg-background font-sans text-[10px] font-medium uppercase tracking-[0.2em] transition-all hover:bg-muted/50 flex-1 flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              style={{ fill: "#1877F2" }}
            />
          </svg>
          Facebook
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          router.push('/')
        }
      }}
    >
      <DialogContent
        showCloseButton
        className={cn(
          'max-w-md gap-6 rounded-none border-border bg-card p-8 shadow-2xl sm:max-w-md',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
        )}
      >
        <DialogHeader className="gap-3 text-center sm:text-center">
          <p className="font-serif text-xs tracking-[0.25em] text-accent uppercase">
            Gemus
          </p>
          <DialogTitle className="font-serif text-2xl font-normal tracking-wide text-foreground md:text-3xl">
            {view === 'signin'
              ? 'Welcome back'
              : view === 'magic-link'
                ? 'Magic Link Login'
                : 'Create your account'}
          </DialogTitle>
          <DialogDescription className="text-[11px] font-sans uppercase tracking-[0.18em] text-muted-foreground">
            {view === 'signin'
              ? 'Sign in to save finds and manage your profile'
              : view === 'magic-link'
                ? 'Enter your email to receive a secure sign-in link'
                : 'Join to unlock personalized jewelry recommendations'}
          </DialogDescription>
        </DialogHeader>

        {view === 'signin' ? (
          <form className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="signin-email"
                className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-none border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="signin-password"
                className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                placeholder="••••••••"
                className="h-11 rounded-none border-border bg-background"
              />
            </div>
            {searchParams.get('error') ? <p className=" text-xs tracking-[0.25em] text-[#ff3333] ">
            {searchParams.get('error') === 'passwordOrEmail' ? 'Wrong password or email' : 'Magic link expired or invalid'}
          </p>
             : <></> }
            
            <Button
              type="submit"
              formAction={login}
              className="mt-2 h-11 rounded-full font-sans text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Sign in
            </Button>
            <SocialButtons />
            <div className="flex flex-col gap-2">
              <p className="text-center text-[11px] text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="font-medium text-foreground underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
                >
                  Sign up
                </button>
              </p>
              <p className="text-center text-[11px] text-muted-foreground">
                Or{' '}
                <button
                  type="button"
                  onClick={() => setView('magic-link')}
                  className="font-medium text-foreground underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
                >
                  login with magic link instead
                </button>
              </p>
            </div>
          </form>
        ) : view === 'magic-link' ? (
          <form className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="magic-email"
                className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="magic-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-none border-border bg-background"
              />
            </div>
            {searchParams.get('error') && searchParams.get('error') !== 'passwordOrEmail' ? (
              <p className=" text-xs tracking-[0.25em] text-[#ff3333] ">
                Magic link expired or invalid
              </p>
            ) : <></> }
            
            <Button
              type="submit"
              formAction={signInWithMagicLink}
              className="mt-2 h-11 rounded-full font-sans text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Send Magic Link
            </Button>
            <SocialButtons />
            <p className="text-center text-[11px] text-muted-foreground">
              Return to{' '}
              <button
                type="button"
                onClick={() => setView('signin')}
                className="font-medium text-foreground underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
              >
                password login
              </button>
            </p>
          </form>
        ) : (
          <form className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="signup-email"
                className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-none border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="signup-password"
                className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="••••••••"
                className="h-11 rounded-none border-border bg-background"
              />
            </div>
            <Button
              type="submit"
              formAction={signup}
              className="mt-2 h-11 rounded-full font-sans text-[10px] font-medium uppercase tracking-[0.2em]"
            >
              Create account
            </Button>
            <SocialButtons />
            <p className="text-center text-[11px] text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setView('signin')}
                className="font-medium text-foreground underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        <p className="text-center text-[10px] text-muted-foreground/80">
          <Link
            href="/"
            className="font-sans uppercase tracking-[0.2em] transition-colors hover:text-foreground"
          >
            ← Back to home
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  )
}
