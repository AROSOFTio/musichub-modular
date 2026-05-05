"use client";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  Disc3,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileWarning,
  Gauge,
  Headphones,
  Home,
  Layers,
  ListMusic,
  LogOut,
  MoreVertical,
  Music,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  TrendingUp,
  UploadCloud,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const purple = "#7C3AED";

const kpis = [
  { title: "Total Songs", value: "1,245", change: "+12.5%", icon: Music, color: "text-violet-600", bg: "bg-violet-100" },
  { title: "Total Users", value: "8,340", change: "+18.7%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Total Plays", value: "2.4M", change: "+22.3%", icon: Radio, color: "text-pink-600", bg: "bg-pink-100" },
  { title: "Downloads", value: "320K", change: "+15.2%", icon: Download, color: "text-orange-600", bg: "bg-orange-100" },
  { title: "Revenue", value: "$3,240", change: "+25.8%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
];

const chartData = [
  { name: "May 18", plays: 12000, downloads: 19000, revenue: 400 },
  { name: "May 25", plays: 28000, downloads: 46000, revenue: 1200 },
  { name: "Jun 01", plays: 42000, downloads: 28000, revenue: 1800 },
  { name: "Jun 08", plays: 38000, downloads: 62000, revenue: 2100 },
  { name: "Jun 15", plays: 52000, downloads: 35000, revenue: 2800 },
  { name: "Jun 18", plays: 65230, downloads: 68000, revenue: 3980 },
];

const songs = [
  ["Lost In The Rhythm", "Ethan Miles", "125K", "12K", "/placeholder-cover.jpg"],
  ["Made For Me", "Muni Long", "98K", "9K", "/placeholder-cover.jpg"],
  ["What Was I Made For?", "Billie Eilish", "86K", "8K", "/placeholder-cover.jpg"],
  ["Love You Anyway", "Luke Combs", "74K", "7K", "/placeholder-cover.jpg"],
  ["Peace Be Still", "Tim Godfrey", "69K", "6K", "/placeholder-cover.jpg"],
];

const artists = [
  ["Ethan Miles", "24 Songs"],
  ["Muni Long", "18 Songs"],
  ["Billie Eilish", "16 Songs"],
  ["Wizkid", "14 Songs"],
  ["Davido", "13 Songs"],
];

const userPie = [
  { name: "Free Users", value: 5120, color: "#7C3AED" },
  { name: "Pro Users", value: 2340, color: "#2563EB" },
  { name: "Artists", value: 650, color: "#F97316" },
  { name: "Admins", value: 230, color: "#10B981" },
];

const navGroups = [
  {
    title: "Main",
    items: [
      [Home, "Dashboard"],
      [Music, "Songs"],
      [Users, "Artists"],
      [Disc3, "Albums"],
      [Layers, "Genres"],
      [TrendingUp, "Trending Control"],
      [Star, "Editor Picks"],
      [SlidersHorizontal, "Remix Control"],
    ],
  },
  {
    title: "Analytics",
    items: [
      [Gauge, "Analytics"],
      [FileWarning, "Reports"],
      [WalletCards, "Revenue"],
      [DollarSign, "Payments"],
    ],
  },
  {
    title: "System",
    items: [
      [Settings, "Settings"],
      [ShieldCheck, "Role & Permissions"],
      [Bell, "Notifications"],
      [LogOut, "Logs"],
    ],
  },
];

export default function MusichubAdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block z-50">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <Headphones size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">
              Music<span className="text-violet-600">hub</span>
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin</p>
          </div>
        </div>

        <nav className="space-y-7">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-xs font-bold uppercase text-slate-400">{group.title}</p>
              <div className="space-y-1">
                {group.items.map(([Icon, label], index) => (
                  <button
                    key={label as string}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                      group.title === "Main" && index === 0
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    {/* @ts-ignore */}
                    <Icon size={18} />
                    {label as string}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
          <div className="h-11 w-11 rounded-full bg-slate-200" />
          <div className="flex-1">
            <p className="text-sm font-bold">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <ChevronDown size={16} />
        </div>
      </aside>

      <main className="pb-24 lg:ml-64 relative z-40">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden">
              <ListMusic />
            </button>

            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none focus:border-violet-500"
                placeholder="Search for songs, artists, albums, users..."
              />
            </div>

            <button className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold md:flex">
              <CalendarDays size={16} />
              May 18 - Jun 18, 2025
              <ChevronDown size={14} />
            </button>

            <button className="relative rounded-2xl border border-slate-200 bg-white p-3">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 pr-4 md:flex">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div>
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <section className="space-y-6 px-4 py-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold">Dashboard</h2>
            <p className="text-sm text-slate-500">Welcome back. Here is what is happening with Musichub.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
            {kpis.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{item.title}</p>
                      <h3 className="text-2xl font-extrabold">{item.value}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-emerald-600">↑ {item.change} from last month</p>
                  <div className="mt-3 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line dataKey="plays" stroke="currentColor" strokeWidth={2} dot={false} className={item.color} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <Card title="Plays Over Time">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="plays" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor={purple} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="plays" stroke={purple} strokeWidth={3} fill="url(#plays)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Downloads vs Streams">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="plays" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="downloads" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Revenue Overview">
              <h3 className="text-3xl font-extrabold">$3,240</h3>
              <p className="mb-3 text-sm font-semibold text-emerald-600">↑ 25.8% from last month</p>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fill="url(#revenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
            <Card title="Latest Songs" action="View All">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs uppercase text-slate-400">
                      <th className="py-3">#</th>
                      <th>Song</th>
                      <th>Artist</th>
                      <th>Plays</th>
                      <th>Downloads</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song, index) => (
                      <tr key={song[0]} className="border-b border-slate-100">
                        <td className="py-4">{index + 1}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500" />
                            <span className="font-bold">{song[0]}</span>
                          </div>
                        </td>
                        <td className="text-slate-500">{song[1]}</td>
                        <td>{song[2]}</td>
                        <td>{song[3]}</td>
                        <td>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            Published
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="rounded-xl bg-slate-100 p-2"><Eye size={16} /></button>
                            <button className="rounded-xl bg-slate-100 p-2"><Edit size={16} /></button>
                            <button className="rounded-xl bg-slate-100 p-2"><MoreVertical size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Top Artists" action="View All">
              <div className="space-y-4">
                {artists.map((artist, index) => (
                  <div key={artist[0]} className="flex items-center gap-3">
                    <span className="w-5 text-sm font-bold text-slate-400">{index + 1}</span>
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
                    <div className="flex-1">
                      <p className="font-bold">{artist[0]}</p>
                    </div>
                    <p className="text-sm text-slate-500">{artist[1]}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <Card title="Users Overview" action="View All">
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={170} height={170}>
                  <PieChart>
                    <Pie data={userPie} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={4}>
                      {userPie.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 text-sm">
                  {userPie.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Subscription Overview" action="View All">
              <h3 className="text-3xl font-extrabold">2,340</h3>
              <p className="text-sm text-slate-500">Pro Subscribers</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="plays" stroke={purple} strokeWidth={3} fill="#EDE9FE" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Recent Activity" action="View All">
              <div className="space-y-4">
                {[
                  ["New song uploaded", "Lost In The Rhythm by Ethan Miles", "2m ago", Music],
                  ["New user registered", "john.doe@gmail.com", "10m ago", Users],
                  ["Payout completed", "$320 paid to Muni Long", "45m ago", DollarSign],
                  ["Song reported", "Made For Me reported by user", "1h ago", FileWarning],
                ].map(([title, desc, time, Icon]) => (
                  <div key={title as string} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                      {/* @ts-ignore */}
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{title as string}</p>
                      <p className="text-sm text-slate-500">{desc as string}</p>
                    </div>
                    <span className="text-xs text-slate-400">{time as string}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-extrabold">{title}</h3>
        {action && <button className="text-sm font-bold text-violet-600">{action}</button>}
      </div>
      {children}
    </div>
  );
}

function MobileBottomNav() {
  const items = [
    [Home, "Dashboard"],
    [Music, "Songs"],
    [Users, "Users"],
    [Gauge, "Analytics"],
    [MoreVertical, "More"],
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white py-2 lg:hidden">
      {items.map(([Icon, label], index) => (
        <button key={label as string} className={`flex flex-col items-center gap-1 text-xs font-semibold ${index === 0 ? "text-violet-600" : "text-slate-500"}`}>
          {/* @ts-ignore */}
          <Icon size={21} />
          {label as string}
        </button>
      ))}
    </div>
  );
}
