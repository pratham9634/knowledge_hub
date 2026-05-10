import ProtectedRoute
from "@/components/shared/protected-route"

import Sidebar
from "@/components/dashboard/sidebar"


export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <ProtectedRoute>

      <div className="min-h-screen flex bg-background relative">

        {/* ── Subtle Background ── */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[120px]" />
          <div className="absolute bottom-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-chart-2/[0.02] blur-[100px]" />
        </div>

        <Sidebar />

        <div className="flex-1 flex flex-col relative z-10">

          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>

        </div>

      </div>

    </ProtectedRoute>
  )
}