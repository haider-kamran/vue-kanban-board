export const COLOR_MAP: Record<string, { bg: string; text: string; badge: string; dot: string }> = {
  rose:   { bg: 'bg-rose-500',   text: 'text-rose-600 dark:text-rose-300',   badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',   dot: 'bg-rose-500' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-300', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300', dot: 'bg-orange-500' },
  amber:  { bg: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-300',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',  dot: 'bg-amber-500' },
  lime:   { bg: 'bg-lime-500',   text: 'text-lime-600 dark:text-lime-300',    badge: 'bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300',      dot: 'bg-lime-500' },
  emerald:{ bg: 'bg-emerald-500',text: 'text-emerald-600 dark:text-emerald-300', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300', dot: 'bg-emerald-500' },
  teal:   { bg: 'bg-teal-500',   text: 'text-teal-600 dark:text-teal-300',   badge: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',     dot: 'bg-teal-500' },
  cyan:   { bg: 'bg-cyan-500',   text: 'text-cyan-600 dark:text-cyan-300',   badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',     dot: 'bg-cyan-500' },
  sky:    { bg: 'bg-sky-500',    text: 'text-sky-600 dark:text-sky-300',     badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',         dot: 'bg-sky-500' },
  blue:   { bg: 'bg-blue-500',   text: 'text-blue-600 dark:text-blue-300',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',     dot: 'bg-blue-500' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-300', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300', dot: 'bg-indigo-500' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-300', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300', dot: 'bg-violet-500' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-300', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300', dot: 'bg-purple-500' },
  pink:   { bg: 'bg-pink-500',   text: 'text-pink-600 dark:text-pink-300',   badge: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',     dot: 'bg-pink-500' },
  slate:  { bg: 'bg-slate-500',  text: 'text-slate-600 dark:text-slate-300', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300', dot: 'bg-slate-500' },
  zinc:   { bg: 'bg-zinc-500',   text: 'text-zinc-600 dark:text-zinc-300',   badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700/50 dark:text-zinc-300',     dot: 'bg-zinc-500' },
}

export function getLabelBadgeClass(color: string): string {
  return COLOR_MAP[color]?.badge ?? COLOR_MAP['slate'].badge
}

export function getLabelBgClass(color: string): string {
  return COLOR_MAP[color]?.bg ?? COLOR_MAP['slate'].bg
}

export function getLabelDotClass(color: string): string {
  return COLOR_MAP[color]?.dot ?? COLOR_MAP['slate'].dot
}
