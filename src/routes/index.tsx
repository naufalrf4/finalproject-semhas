import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { getConfig } from "#/lib/config"
import { useSfx } from "#/lib/sfx"
import { HubGrid } from "#/components/home/HubGrid"
import { HubCard } from "#/components/home/HubCard"

export const Route = createFileRoute("/")({ component: Home })

const STUDENT_NAME = "Naufal R. Firdaus"
const THESIS_TITLE =
  "Implementasi Sistem Pemantauan Kualitas Air Akuarium Ikan Diskus Berbasis Internet of Things dengan Indeks Risiko"

type GroupCard = {
  num: string
  title: string
  desc: string
  to: string
  accent: "aqua" | "cyan" | "gold"
}

const GROUPS: GroupCard[] = [
  {
    num: "01",
    title: "BERKAS",
    desc: "Paparan, makalah, dan laporan proyek akhir.",
    to: "/berkas",
    accent: "aqua",
  },
  {
    num: "02",
    title: "TANYA-JAWAB",
    desc: "Antisipasi forum dan tanya chatbot.",
    to: "/tanya",
    accent: "cyan",
  },
  {
    num: "03",
    title: "INTERAKTIF",
    desc: "Game beri makan diskus dan dukungan.",
    to: "/interaktif",
    accent: "gold",
  },
]

function Home() {
  const sfx = useSfx()
  const [zoomReady, setZoomReady] = useState(false)
  const [zoomLink, setZoomLink] = useState("")

  useEffect(() => {
    const config = getConfig()
    setZoomReady(config.semhasOnline && config.zoomLink.length > 0)
    setZoomLink(config.zoomLink)
  }, [])

  const openZoom = () => {
    if (!zoomReady || !zoomLink) return
    sfx("open")
    window.open(zoomLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="flex w-full flex-col items-center gap-10 px-4">
      <header className="flex w-full max-w-3xl flex-col items-center gap-4 text-center animate-[pixel-rise_0.4s_ease-out_both]">
        <h1
          className="whitespace-nowrap text-aqua text-base sm:text-xl"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          {STUDENT_NAME}
        </h1>
        <p className="max-w-2xl text-ink-soft text-lg leading-snug sm:text-xl">
          {THESIS_TITLE}
        </p>
        <div
          className="mt-1 h-1 w-24 bg-ink"
          aria-hidden="true"
          style={{ imageRendering: "pixelated" }}
        />
      </header>

      <div className="w-full max-w-3xl">
        <HubGrid>
          {GROUPS.map((group, index) => (
            <div
              key={group.to}
              data-tour={group.to.replace("/", "")}
              className="animate-[pixel-rise_0.4s_ease-out_both]"
              style={{ animationDelay: `${120 + index * 100}ms` }}
            >
              <HubCard
                num={group.num}
                title={group.title}
                desc={group.desc}
                to={group.to}
                accent={group.accent}
              />
            </div>
          ))}

          <div
            className="animate-[pixel-rise_0.4s_ease-out_both]"
            style={{ animationDelay: `${120 + GROUPS.length * 100}ms` }}
          >
            <HubCard
              num="04"
              title="ZOOM SEMHAS"
              desc={
                zoomReady
                  ? "Gabung ruang seminar hasil sekarang."
                  : "Belum dibuka. Nantikan jadwal seminar."
              }
              onClick={openZoom}
              locked={!zoomReady}
              accent="gold"
            />
          </div>
        </HubGrid>
      </div>
    </section>
  )
}
