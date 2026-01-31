"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const images = [
    "/images/Gemini_Generated_Image_2udvdx2udvdx2udv.png",
    "/images/Gemini_Generated_Image_h24w83h24w83h24w.png",
    "/images/Gemini_Generated_Image_fhe73nfhe73nfhe7.png",
    "/images/Gemini_Generated_Image_u5tnpdu5tnpdu5tn.png",
]

// Duplicate images to ensure infinite loop feels smooth even on wide screens
const carouselImages = [...images, ...images]

export function HeroCarousel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="w-full max-w-[1700px] mx-auto"
        >
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 md:-ml-8">
                    {carouselImages.map((src, index) => (
                        <CarouselItem key={`${src}-${index}`} className="pl-4 md:pl-8 basis-3/4 sm:basis-1/2 lg:basis-1/3">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-xl group">
                                <Image
                                    src={src}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    quality={100}
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                                    priority={index < 4}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:flex justify-end gap-2 mt-8 pr-4">
                    <CarouselPrevious className="static translate-y-0 translate-x-0" />
                    <CarouselNext className="static translate-y-0 translate-x-0" />
                </div>
            </Carousel>
        </motion.div>
    )
}
