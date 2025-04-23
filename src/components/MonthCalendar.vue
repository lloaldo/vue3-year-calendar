<!-- vue3-year-calendar/src/components/MonthCalendar.vue -->
<template>
  <div class="yc-wrapper">
    <div
      class="yc-calendar"
      @mouseup="mouseUp"
      @mouseleave.stop="mouseUp"
    >
      <div class="yc-calendar__title">{{ monthTitle }}</div>
      <div class="yc-calendar__body">
        <div
          v-for="day in 7"
          :key="`title${day}`"
          class="yc-calendar__day yc-day__weektitle"
          :style="{ fontSize: weekTitleFontSizeAdjustLang }"
        >
          {{ showDayTitle(day) }}
        </div>
        <div
          v-for="(dayObj, key) in showDays"
          :key="`day${key}`"
          class="yc-calendar__day"
        >
          <div
            class="yc-day"
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
  activeClass: 'red',
  prefixClass: 'yc-calendar--active',
});

// Emits
const emit = defineEmits<{
  (e: 'toggleDate', value: { date: string; selected: boolean; className: string }): void;
  (e: 'overDay', value: { date: string; selected: boolean; className: string }): void;
}>();

// Estado reactivo
const showDays = ref<DayObj[]>([]);
const isMouseDown = ref(false);

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

  const validClasses = ['red', 'blue', 'your_customized_classname', 'custom-day'];
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
      const className = oDate.className || props.activeClass || 'red';
      fullCol[activeArrayKey].className = validClasses.includes(className) ? className : 'red';
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
  const date = dayjs()
    .set('year', Number(props.year))
    .set('month', Number(props.month) - 1)
    .set('date', Number(dayObj.value))
    .format('YYYY-MM-DD');
  console.log('MonthCalendar toggleDay:', { date, selected: !dayObj.active, className: props.activeClass || 'red' });
  emit('toggleDate', {
    date,
    selected: !dayObj.active,
    className: props.activeClass || 'red',
  });
};

const dragDay = (dayObj: DayObj) => {
  if (isMouseDown.value) toggleDay(dayObj);
  if (dayObj.isOtherMonth || !dayObj.value) return;
  const date = dayjs()
    .set('year', Number(props.year))
    .set('month', Number(props.month) - 1)
    .set('date', Number(dayObj.value))
    .format('YYYY-MM-DD');
  emit('overDay', {
    date,
    selected: !dayObj.active,
    className: props.activeClass || 'red',
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
    'yc-calendar__day--otherMonth': dayObj.isOtherMonth,
    [props.prefixClass]: dayObj.active,
  };
  if (dayObj.active && dayObj.className) {
    classes[dayObj.className] = true;
  }
  console.log('Day classes:', classes);
  return classes;
};

// Watchers
watch([() => props.year, () => props.month, () => props.activeDates], () => {
  initCalendar();
});

// Inicializar
initCalendar();
</script>
<style lang="css" scoped>
/* Los estilos se mueven a dist/vue3-year-calendar.css */
</style>