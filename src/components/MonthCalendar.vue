<!-- src/components/MonthCalendar.vue -->
<template>
  <div class="c-wrapper" :style="cssVars">
    <div
      class="calendar"
      @mouseup="mouseUp"
      @mouseleave.stop="mouseUp"
    >
      <div class="calendar__title">{{ monthTitle }}</div>
      <div class="calendar__body">
        <div
          v-for="day in 7"
          :key="`title${day}`"
          class="calendar__day day__weektitle"
          :style="{ fontSize: weekTitleFontSizeAdjustLang }"
        >
          {{ showDayTitle(day) }}
        </div>
        <div
          v-for="(dayObj, key) in showDays"
          :key="`day${key}`"
          class="calendar__day"
        >
          <div
            class="day"
            :class="classList(dayObj)"
            @mouseover="dragDay(dayObj)"
            @mousedown="mouseDown(dayObj)"
          >
            {{ dayObj.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import RemoveCircleIcon from '../assets/baseline-remove_circle-24px.svg';
import RecordItIcon from '../assets/RecordIt.svg';
import WarningIcon from '../assets/round-warning-24px.svg';

// Definición de tipos
interface ActiveDate {
  date: string;
  className?: string;
}

interface DayObj {
  value: number | string;
  active: boolean;
  isOtherMonth: boolean;
  className?: string;
}

interface Props {
  activeDates?: (string | ActiveDate)[];
  month?: string | number;
  year?: string | number;
  lang?: string;
  activeClass?: string;
  prefixClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeDates: () => [],
  month: () => dayjs().month() + 1,
  year: () => dayjs().year(),
  lang: 'en',
  activeClass: '',
  prefixClass: 'calendar--active',
});

// Emits
const emit = defineEmits<{
  (e: 'toggleDate', value: { month: number; date: number; selected: boolean; className: string }): void;
  (e: 'overDay', value: { month: number; date: number; selected: boolean; className: string }): void;
}>();

// Estado reactivo
const showDays = ref<DayObj[]>([]);
const isMouseDown = ref(false);

const cssVars = computed(() => ({
  '--remove-circle-icon': `url(${RemoveCircleIcon})`,
  '--record-it-icon': `url(${RecordItIcon})`,
  '--warning-icon': `url(${WarningIcon})`,
}));

// Computadas
const weekTitleFontSizeAdjustLang = computed(() => {
  const fontSizeMapping: { [key: string]: string } = {
    tw: '16px',
    en: '14px',
    pt: '14px',
    de: '14px',
    es: '14px',
  };
  return fontSizeMapping[props.lang] ?? '14px';
});

const monthTitle = computed(() => {
  const monthMapping: { [key: string]: string[] } = {
    tw: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  };
  return monthMapping[props.lang]?.[Number(props.month) - 1] ?? monthMapping.en[Number(props.month) - 1];
});

// Métodos
const initCalendar = () => {
  if (!props.year || !props.month) {
    showDays.value = [];
    return;
  }

  const activeMonth = dayjs()
    .set('date', 1)
    .set('year', Number(props.year))
    .set('month', Number(props.month) - 1);

  let firstDay = activeMonth.startOf('month').day() - 1;
  if (firstDay < 0) firstDay += 7;
  const lastDate = activeMonth.endOf('month').date();
  const weekRow = firstDay >= 5 ? 6 : 5;
  const WEEK = 7;

  let day = 0;
  const fullCol = Array.from({ length: weekRow * WEEK }, (_, i) => {
    const value = firstDay <= i ? ++day % (lastDate + 1) || 1 : '';
    return {
      value,
      active: false,
      isOtherMonth: firstDay > i || day > lastDate,
      className: '',
    };
  });

  props.activeDates.forEach((date) => {
    const oDate: ActiveDate =
      typeof date === 'string' ? { date, className: props.activeClass } : date;
    const dayjsObj = dayjs(oDate.date);
    if (dayjsObj.year() !== Number(props.year) || dayjsObj.month() + 1 !== Number(props.month)) return;

    const activeDate = dayjsObj.date();
    const row = Math.floor((activeDate - 1) / 7);
    const activeArrayKey = ((activeDate - 1) % 7) + firstDay + 7 * row;
    if (fullCol[activeArrayKey]) {
      fullCol[activeArrayKey].active = true;
      fullCol[activeArrayKey].className = oDate.className || props.activeClass || '';
    }
  });

  showDays.value = fullCol;
};

const showDayTitle = (day: number) => {
  const dayMapping: { [key: string]: string[] } = {
    tw: ['一', '二', '三', '四', '五', '六', '日'],
    en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    pt: ['2ª', '3ª', '4ª', '5ª', '6ª', 'Sa', 'Do'],
    de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  };
  return dayMapping[props.lang]?.[day - 1] ?? dayMapping.en[day - 1];
};

const toggleDay = (dayObj: DayObj) => {
  if (dayObj.isOtherMonth || !dayObj.value) return;
  emit('toggleDate', {
    month: Number(props.month),
    date: Number(dayObj.value),
    selected: !dayObj.active,
    className: props.activeClass,
  });
};

const dragDay = (dayObj: DayObj) => {
  if (isMouseDown.value) toggleDay(dayObj);
  if (dayObj.isOtherMonth || !dayObj.value) return;
  emit('overDay', {
    month: Number(props.month),
    date: Number(dayObj.value),
    selected: !dayObj.active,
    className: props.activeClass,
  });
};

const mouseDown = (dayObj: DayObj) => {
  toggleDay(dayObj);
  isMouseDown.value = true;
};

const mouseUp = () => {
  isMouseDown.value = false;
};

const classList = (dayObj: DayObj) => {
  const classes: Record<string, boolean> = {
    'calendar__day--otherMonth': dayObj.isOtherMonth,
    [props.prefixClass]: dayObj.active, // Usa prefixClass (por ejemplo, 'your_customized_wrapper_class')
  };
  if (dayObj.active && dayObj.className) {
    classes[dayObj.className] = true; // Aplica red, blue, etc.
  }
  // console.log('Day classes:', dayObj, classes); // Depuración
  return classes;
};

// Watchers
watch([() => props.year, () => props.month, () => props.activeDates], () => {
  initCalendar();
});

// Verificar activeDates
watch(() => props.activeDates, (newDates) => {
  console.log('MonthCalendar activeDates:', newDates);
}, { deep: true });

// Inicializar
initCalendar();
</script>

<style lang="css" scoped>
.c-wrapper {
  padding: 10px;
}

.calendar {
  background-color: #fff;
  min-height: 295px;
  text-align: center;
  color: rgba(53, 60, 70, 0.8);
  border-radius: 2px;
  min-width: 0;
  position: relative;
  text-decoration: none;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}

.calendar:hover {
  z-index: 2;
}

@media (min-width: 1024px) {
  .calendar:hover {
    transform: scale(1.15);
    box-shadow: 0 7px 21px 0 rgba(0, 0, 0, 0.1);
  }
}

.calendar .calendar__title {
  font-weight: bold;
  flex: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(196, 196, 196, 0.3);
  font-size: 18px;
  height: 50px;
  margin-bottom: 12px;
}

.calendar .calendar__body {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  padding: 0 20px;
  min-width: 194px;
}

.calendar .calendar__day {
  flex: 14.28%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  height: 31px;
  color: #5db3d4;
}

.calendar .day__weektitle {
  color: rgba(53, 60, 70, 0.8);
}

.calendar .day {
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 5px;
}

.calendar .day::after {
  content: '';
  display: block;
  height: 10px;
  width: 10px;
  position: absolute;
  top: -5px;
  right: -5px;
  border-radius: 50%;
  z-index: 1;
  background-color: transparent;
}

.calendar .day.your_customized_wrapper_class {
  background-color: rgba(255, 186, 186, 0.5);
  color: #bcbcbc;
}

.calendar .day.your_customized_wrapper_class::after {
  background-image: var(--remove-circle-icon);
  background-size: 100% 100%;
}

.calendar .day.your_customized_wrapper_class.red {
  background-color: #a00;
  color: white;
}

.calendar .day.your_customized_wrapper_class.red::after {
  background-image: var(--remove-circle-icon);
  background-size: 100% 100%;
}

.calendar .day.your_customized_wrapper_class.blue {
  background-color: #0000aa;
  color: white;
}

.calendar .day.your_customized_wrapper_class.blue::after {
  background-image: var(--remove-circle-icon);
  background-size: 100% 100%;
}

.calendar .day.your_customized_wrapper_class.your_customized_classname {
  background-color: yellow;
  color: black;
}

.calendar .day.your_customized_wrapper_class.your_customized_classname::after {
  background-image: var(--remove-circle-icon);
  background-size: 100% 100%;
}

.calendar .day.your_customized_wrapper_class.info::after {
  background-image: var(--record-it-icon);
  background-size: 100% 100%;
}

.calendar .day.your_customized_wrapper_class.warning::after {
  background-image: var(--warning-icon);
  background-color: rgba(234, 234, 234, 0.3);
  background-size: 100% 100%;
}

.calendar .day:not(.your_customized_wrapper_class):hover {
  background-color: rgba(102, 102, 102, 0.1);
  border-radius: 5px;
}

.calendar .calendar__day--otherMonth {
  color: #eaeaea;
  cursor: auto;
}
</style>