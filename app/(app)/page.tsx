import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import data from "@/messages"

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section>
        <h1 className="text-center mb-8 font-bold md:mb-12">
          Drove into the world of anonymous Conversations
        </h1>
        <p>Explore Mystic Talk - Where your identity remains a secret.</p>
      </section>
      <Carousel className="w-full max-w-xs mt-24 bg-slate-100 text-center">
        <CarouselContent>
          {data.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-xl">{item.title}</h3>
                      <p className="mt-2">{item.content}</p>
                      <span className="mt-4 block text-sm text-gray-500">{item.received}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}
