'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { JwtPayload } from '@supabase/auth-js'

import Avatar from './avatar'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'

export default function AccountForm({ claims }: { claims: JwtPayload | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profileReady, setProfileReady] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      if (!claims?.sub) {
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', claims.sub)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
      setProfileReady(true)
    }
  }, [claims, supabase])

  useEffect(() => {
    if (!claims?.sub) {
      setLoading(false)
      setProfileReady(true)
      return
    }
    void getProfile()
  }, [claims, getProfile])

  async function updateProfile({
    fullname: fullnameParam,
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      if (!claims?.sub) {
        alert('You must be logged in to update your profile')
        return
      }

      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: claims.sub,
        full_name: fullnameParam,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }
    } catch {
      alert('Error updating profile!')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      setSigningOut(true)
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-secondary/80 via-background to-background"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A1A1A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-28 md:pt-32">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-serif text-xs tracking-[0.25em] text-accent uppercase">Gemus</p>
            <h1 className="font-serif text-3xl font-normal tracking-wide text-foreground md:text-4xl">
              Your profile
            </h1>
            <p className="mt-2 max-w-md text-[11px] font-sans uppercase tracking-[0.18em] text-muted-foreground">
              Manage how you appear across the experience
            </p>
          </div>
          <Link
            href="/"
            className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>

        <div className="border border-border bg-card/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-border bg-secondary/30 px-6 py-4 md:px-8 md:py-5">
            <h2 className="font-serif text-lg tracking-wide text-foreground md:text-xl">Account details</h2>
            <p className="mt-1 text-[10px] font-sans uppercase tracking-[0.16em] text-muted-foreground">
              Photo & contact information
            </p>
          </div>

          <div className="p-6 md:p-8">
            {!claims?.sub ? (
              <p className="text-center text-sm text-muted-foreground">
                You need to be signed in to view this page.
              </p>
            ) : !profileReady ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <Spinner className="size-6 text-accent" />
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground">
                  Loading profile…
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-10 md:flex-row md:gap-12">
                <div className="flex shrink-0 justify-center md:justify-start">
                  <Avatar
                    uid={claims.sub}
                    url={avatar_url}
                    size={160}
                    onUpload={(url) => {
                      setAvatarUrl(url)
                      void updateProfile({
                        fullname,
                        username,
                        website,
                        avatar_url: url,
                      })
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      value={claims.email ?? ''}
                      disabled
                      className="h-11 cursor-not-allowed rounded-none border-border bg-muted/40 text-muted-foreground"
                    />
                    <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/80">
                      Email is tied to your sign-in and cannot be changed here
                    </p>
                  </div>

                  <Separator className="bg-border" />

                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Full name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullname || ''}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Your name"
                      className="h-11 rounded-none border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username || ''}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="h-11 rounded-none border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={website || ''}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://"
                      className="h-11 rounded-none border-border bg-background"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="button"
                      className="h-11 rounded-full px-8 font-sans text-[10px] font-medium uppercase tracking-[0.2em]"
                      onClick={() =>
                        void updateProfile({ fullname, username, website, avatar_url })
                      }
                      disabled={loading || !claims?.sub}
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner className="size-3.5" />
                          Saving…
                        </span>
                      ) : (
                        'Save changes'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-full border-border font-sans text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-secondary"
                      onClick={() => void handleSignOut()}
                      disabled={signingOut}
                    >
                      {signingOut ? 'Signing out…' : 'Sign out'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
