import { useEffect, type ReactNode } from "react"
import { useAppStore } from "#/lib/store"
import { useRealtime } from "#/lib/useRealtime"
import { api } from "#/lib/api"
import { AquariumBg } from "#/components/shell/AquariumBg"
import { BootGate } from "#/components/shell/BootGate"
import { FloatingDock } from "#/components/shell/FloatingDock"
import { OnboardingTour } from "#/components/onboarding/OnboardingTour"

export function AppShell({ children }: { children: ReactNode }) {
  const hydrate = useAppStore((s) => s.hydrate)
  useRealtime()

  useEffect(() => {
    hydrate()
    void api.listSupport().then((res) => {
      if (res.ok) useAppStore.setState({ support: res.data.items })
    })
  }, [hydrate])

  return (
    <div className="scanline relative min-h-dvh">
      <AquariumBg />
      <main className="relative z-10 flex min-h-dvh w-full flex-col">
        <div className="mx-auto my-auto w-full max-w-[820px] px-4 py-16">
          {children}
        </div>
      </main>
      <FloatingDock />
      <BootGate />
      <OnboardingTour />
    </div>
  )
}
