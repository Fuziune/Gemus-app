'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Loader2Icon } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const next = URL.createObjectURL(data)
        if (cancelled) {
          URL.revokeObjectURL(next)
          return
        }
        objectUrl = next
        setAvatarUrl(next)
      } catch {
        if (!cancelled) {
          setAvatarUrl(null)
        }
      }
    }

    if (url) {
      void downloadImage(url)
    } else {
      setAvatarUrl(null)
    }

    return () => {
      cancelled = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full border-2 border-border bg-secondary/60 shadow-sm',
          'ring-1 ring-accent/20'
        )}
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          <Image
            width={size}
            height={size}
            src={avatarUrl}
            alt="Profile photo"
            className="h-full w-full object-cover"
            style={{ height: size, width: size }}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-linear-to-br from-secondary to-muted"
            aria-hidden
          >
            <span className="font-serif text-3xl font-light text-muted-foreground/50">G</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
            <Loader2Icon className="size-8 animate-spin text-accent" aria-hidden />
          </div>
        )}
      </div>
      <div className="flex w-full max-w-[200px] flex-col items-center gap-1">
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          className="h-9 w-full rounded-full border-border font-sans text-[10px] font-medium uppercase tracking-[0.2em] hover:border-accent/50 hover:bg-secondary/50"
          disabled={uploading || !uid}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : 'Change photo'}
        </Button>
        <p className="text-center text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
          JPG, PNG — max ~10MB
        </p>
      </div>
    </div>
  )
}
