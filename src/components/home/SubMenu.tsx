import { Link } from "@tanstack/react-router"
import { useSfx } from "#/lib/sfx"
import { HubGrid } from "#/components/home/HubGrid"
import { HubCard } from "#/components/home/HubCard"

type SubMenuItem = {
  num: string
  title: string
  desc: string
  to: string
  locked?: boolean
}

type SubMenuProps = {
  title: string
  crumb: string
  items: SubMenuItem[]
}

const ACCENTS = ["aqua", "cyan", "gold"] as const

export function SubMenu({ title, crumb, items }: SubMenuProps) {
  const sfx = useSfx()

  return (
    <section className="flex w-full flex-col items-center gap-8 px-4 py-10">
      <div className="flex w-full max-w-3xl flex-col gap-5">
        <Link
          to="/"
          onMouseEnter={() => sfx("tick")}
          onClick={() => sfx("nav")}
          className="pixel-border pixel-press inline-flex w-fit items-center gap-2 bg-paper-2 px-3 py-2 text-ink text-sm no-underline"
          style={{ fontFamily: "var(--font-pixel)" }}
          aria-label="Kembali ke beranda"
        >
          <span aria-hidden="true">{"<"}</span>
          BERANDA
        </Link>

        <header className="flex flex-col gap-2 animate-[pixel-rise_0.4s_ease-out_both]">
          <p className="text-ink-soft text-sm" style={{ fontFamily: "var(--font-pixel)" }}>
            {crumb}
          </p>
          <h1 className="text-aqua text-xl leading-tight" style={{ fontFamily: "var(--font-pixel)" }}>
            {title}
          </h1>
        </header>
      </div>

      <div className="w-full max-w-3xl">
        <HubGrid>
          {items.map((item, index) => (
            <div
              key={item.to}
              className="animate-[pixel-rise_0.4s_ease-out_both]"
              style={{ animationDelay: `${120 + index * 90}ms` }}
            >
              <HubCard
                num={item.num}
                title={item.title}
                desc={item.desc}
                to={item.to}
                locked={item.locked}
                accent={ACCENTS[index % ACCENTS.length]}
              />
            </div>
          ))}
        </HubGrid>
      </div>
    </section>
  )
}
