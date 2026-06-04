<template>
  <div 
    @click="openModal"
    class="bg-white dark:bg-[#1E212B] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] cursor-grab active:cursor-grabbing hover:border-blue-400/60 dark:hover:border-blue-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] shadow-sm transition-all duration-200 group relative overflow-hidden"
  >
    <!-- Card Content -->
    <div class="p-4 flex flex-col gap-3">
      
      <!-- Labels -->
      <div class="flex flex-wrap gap-1.5" v-if="card.labels && card.labels.length">
        <span 
          v-for="label in card.labels" 
          :key="label.id" 
          class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
          :class="getLabelBadgeClass(label.color)"
        >
          {{ label.name }}
        </span>
      </div>
      
      <!-- Title -->
      <h3 class="text-[14px] font-semibold text-slate-800 dark:text-slate-100 leading-snug">{{ card.title }}</h3>

      <!-- Checklist progress bar (visible inside card) -->
      <div v-if="card.checklist && card.checklist.length" class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Progress</span>
          <span class="text-[11px] font-bold tabular-nums"
                :class="checklistPercent === 100 ? 'text-emerald-500' : 'text-blue-500'">
            {{ checklistPercent }}%
          </span>
        </div>
        <div class="h-1.5 w-full bg-slate-100 dark:bg-white/[0.07] rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="checklistPercent === 100
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              : 'bg-gradient-to-r from-blue-400 to-blue-600'"
            :style="{ width: `${checklistPercent}%` }"
          ></div>
        </div>
      </div>
      
      <!-- Footer row: metadata + avatar -->
      <div class="flex items-center gap-2">

        <!-- Description icon -->
        <div v-if="card.description" class="text-slate-400 dark:text-slate-500" title="Has description">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        
        <!-- Checklist badge: count · percentage -->
        <div v-if="card.checklist && card.checklist.length"
             class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors"
             :class="checklistPercent === 100
               ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
               : 'bg-slate-100 text-slate-500 dark:bg-white/[0.05] dark:text-slate-400'">
          <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span>{{ completedChecklists }}/{{ card.checklist.length }}</span>
        </div>
        
        <div class="flex-1"></div>
        
        <!-- Priority badge -->
        <div v-if="card.priority === 'High'" 
             class="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          High
        </div>
        <div v-else-if="card.priority === 'Medium'"
             class="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          Med
        </div>
        <div v-else-if="card.priority === 'Low'" 
             class="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
          Low
        </div>
        
        <!-- Avatar -->
        <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center border-2 border-white dark:border-[#1E212B] shadow-sm">
          <span class="text-[9px] font-extrabold text-white">JD</span>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <CardModal v-if="isModalOpen" :card="card" :list-id="listId" @close="isModalOpen = false" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Card } from '../types'
import { getLabelBadgeClass } from '../utils/labelColors'
import CardModal from './CardModal.vue'

const props = defineProps<{
  card: Card
  listId: string
}>()

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const completedChecklists = computed(() =>
  props.card.checklist?.filter(item => item.completed).length ?? 0
)

const checklistPercent = computed(() => {
  const total = props.card.checklist?.length ?? 0
  if (!total) return 0
  return Math.round((completedChecklists.value / total) * 100)
})
</script>
