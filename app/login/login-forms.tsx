'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

import { login, signup, signInWithMagicLink } from './actions'
import { Button } from '@/components/ui/button'
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
