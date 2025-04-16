<!-- src/components/YearCalendar.vue -->
<template>
  <div class="vue-calendar__container">
    <div v-if="showYearSelector" class="container__year">
      <span
        v-for="i in 5"
        :key="i"
        class="year__chooser"
        @click="changeYear(i)"
      >
        {{ i + activeYear - 3 }}
      </span>
    </div>
    <div class="container__months">
      <month-calendar
        class="container__month"
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
      <div v-for="i in 5" :key="`empty-${i}`" class="container__month p-0" />
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
  prefixClass: 'calendar--active',
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

const toggleDate = (dateObj: { date: number; month: number; selected: boolean; className?: string }) => {
  const activeDate = dayjs()
    .set('year', props.value)
    .set('month', dateObj.month - 1)
    .set('date', dateObj.date)
    .format('YYYY-MM-DD');

  emit('toggleDate', {
    date: activeDate,
    selected: dateObj.selected,
    className: dateObj.className,
  });

  const newDates = [...props.activeDates];
  const dateEntry = isUsingString.value
    ? activeDate
    : { date: activeDate, className: dateObj.className };
  const dateIndex = newDates.findIndex((i) => (typeof i === 'string' ? i : i.date) === activeDate);

  if (dateIndex === -1) {
    newDates.push(dateEntry);
  } else {
    newDates.splice(dateIndex, 1);
  }

  emit('update:activeDates', newDates);
};

const overDay = (dateObj: { date: number; month: number; selected: boolean; className?: string }) => {
  const activeDate = dayjs()
    .set('year', props.value)
    .set('month', dateObj.month - 1)
    .set('date', dateObj.date)
    .format('YYYY-MM-DD');
  emit('overDay', {
    date: activeDate,
    selected: dateObj.selected,
    className: dateObj.className,
  });
};

const modifiedActiveDates = (dateIndex: number, activeDate: string | ActiveDate) => {
  const newDates = [...props.activeDates];
  if (dateIndex === -1) {
    newDates.push(activeDate);
  } else {
    newDates.splice(dateIndex, 1);
  }
  return newDates;
};

// Validación de activeDates (simplificada, puedes reutilizar la lógica original si es necesaria)
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

// Ejecutar validación al inicio (opcional)
if (props.activeDates.length && !validateActiveDates(props.activeDates)) {
  console.warn('Invalid activeDates provided');
}
</script>

<!-- src/components/YearCalendar.vue -->
<!-- ... Template y Script sin cambios ... -->

<style lang="css" scoped>
.vue-calendar__container {
  border-radius: 2px;
  min-width: 0;
  position: relative;
  text-decoration: none;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  background-color: #f6f6f3;
}

.vue-calendar__container .container__year {
  user-select: none;
  height: 65px;
  background-color: #fff;
  font-size: 24px;
  flex: 100%;
  text-align: center;
  display: flex;
}

.vue-calendar__container .container__year .year__chooser {
  height: 100%;
  flex: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.9);
}

.vue-calendar__container .container__year .year__chooser:hover {
  background-color: rgba(102, 102, 102, 0.1);
}

.vue-calendar__container .container__year .year__chooser:nth-child(4n-3) {
  color: rgba(0, 0, 0, 0.3);
}

.vue-calendar__container .container__year .year__chooser:nth-child(2n) {
  color: rgba(0, 0, 0, 0.6);
}

.vue-calendar__container .container__year .year__chooser:nth-child(3) {
  box-shadow: inset 0px -3px #4792bd;
}

.vue-calendar__container .container__months {
  flex-wrap: wrap;
  display: flex;
  padding: 15px;
}

.vue-calendar__container .container__month {
  padding: 8px;
  flex: 16.66%;
}

@media (max-width: 1300px) {
  .vue-calendar__container .container__month {
    flex: 25%;
  }
}

@media (max-width: 992px) {
  .vue-calendar__container .container__month {
    flex: 33.3%;
  }
}

@media (max-width: 768px) {
  .vue-calendar__container .container__month {
    flex: 50%;
  }
}

@media (max-width: 450px) {
  .vue-calendar__container .container__month {
    flex: 100%;
  }
}

.vue-calendar__container .p-0 {
  padding: 0;
}
</style>