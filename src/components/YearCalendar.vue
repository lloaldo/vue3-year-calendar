<!-- vue3-year-calendar/src/components/YearCalendar.vue -->
<template>
  <div class="yc-container">
    <div v-if="showYearSelector" class="yc-year">
      <span
        v-for="i in 5"
        :key="i"
        class="yc-year-chooser"
        @click="changeYear(i)"
      >
        {{ i + activeYear - 3 }}
      </span>
    </div>
    <div class="yc-months">
      <month-calendar
        class="yc-month"
        v-for="n in 12"
        :key="`month-${n}`"
        :year="activeYear"
        :month="n"
        :active-dates="month[n] ?? []"
        :active-class="activeClass"
        :lang="lang"
        :prefix-class="prefixClass"
        @toggle-date="toggleDate"
        @over-day="overDay"
      />
      <div v-for="i in 5" :key="`empty-${i}`" class="yc-month yc-empty" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import MonthCalendar from './MonthCalendar.vue';

// Definición de tipos para las props
interface ActiveDate {
  date: string;
  className?: string;
}

interface Props {
  showYearSelector?: boolean;
  activeDates?: (string | ActiveDate)[];
  value?: string | number;
  lang?: string;
  activeClass?: string;
  prefixClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showYearSelector: true,
  activeDates: () => [],
  value: () => dayjs().year(),
  lang: 'en',
  activeClass: '',
  prefixClass: 'yc-calendar--active',
});

// Emits
const emit = defineEmits<{
  (e: 'input', value: number): void;
  (e: 'update:activeDates', value: (string | ActiveDate)[]): void;
  (e: 'toggleDate', value: { date: string; selected: boolean; className?: string }): void;
  (e: 'overDay', value: { date: string; selected: boolean; className?: string }): void;
}>();

// Estado reactivo
const isUsingString = ref(props.activeDates.length && typeof props.activeDates[0] === 'string');

// Computadas
const activeYear = computed({
  get: () => parseInt(String(props.value)),
  set: (val) => emit('input', val),
});

const month = computed(() => {
  const monthData: { [key: string]: ActiveDate[] } = {};
  props.activeDates.forEach((date) => {
    const oDate: ActiveDate =
      typeof date === 'string'
        ? { date, className: props.activeClass }
        : { date: date.date, className: date.className ?? '' };

    if (dayjs(oDate.date).year() !== props.value) return;
    const m = (dayjs(oDate.date).month() + 1).toString();
    if (!monthData[m]) monthData[m] = [];
    monthData[m].push(oDate);
  });
  return monthData;
});

// Métodos
const changeYear = (idx: number) => {
  activeYear.value = idx + activeYear.value - 3;
};

const toggleDate = (dateObj: { date: string; selected: boolean; className: string }) => {
  emit('toggleDate', {
    date: dateObj.date,
    selected: dateObj.selected,
    className: dateObj.className,
  });

  const newDates = [...props.activeDates];
  const dateEntry = isUsingString.value
    ? dateObj.date
    : { date: dateObj.date, className: dateObj.className };
  const dateIndex = newDates.findIndex((i) => (typeof i === 'string' ? i : i.date) === dateObj.date);

  if (dateObj.selected && dateIndex === -1) {
    newDates.push(dateEntry);
  } else if (!dateObj.selected && dateIndex !== -1) {
    newDates.splice(dateIndex, 1);
  }

  emit('update:activeDates', newDates);
};

const overDay = (dateObj: { date: string; selected: boolean; className: string }) => {
  emit('overDay', {
    date: dateObj.date,
    selected: dateObj.selected,
    className: dateObj.className,
  });
};

// Validación de activeDates
const validateActiveDates = (dates: (string | ActiveDate)[]) => {
  return dates.every((date) => {
    const curDate = typeof date === 'string' ? date : date.date;
    if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(curDate)) return false;
    const [year, month, day] = curDate.split('-').map(Number);
    if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;
    const monthLength = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day > 0 && day <= monthLength[month - 1];
  });
};

// Ejecutar validación al inicio
if (props.activeDates.length && !validateActiveDates(props.activeDates)) {
  console.warn('Invalid activeDates provided');
}
</script>

<style lang="css" scoped>
/* Los estilos se mueven a dist/vue3-year-calendar.css */
</style>