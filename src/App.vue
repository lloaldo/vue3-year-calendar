<template>
  <div id="app">
    <h2>Year Selected: {{ year }}</h2>
    <button @click="addSatAndSunOfYear">Add weekend</button>
    <button @click="removeSatAndSunOfYear">Remove weekend</button>
    <button @click="toggleDarkMode">Dark Mode</button>
    <select v-model="lang">
      <option value="tw">繁體中文</option>
      <option value="en">English</option>
      <option value="pt">Português</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
    </select>

    <select v-model="activeClass">
      <option value="">(none)</option>
      <option value="red">red</option>
      <option value="blue">blue</option>
      <option value="your_customized_classname">your_customized_classname</option>
    </select>

    <label>
      Show years selector?
      <input type="checkbox" v-model="showYearSelector">
    </label>

    <year-calendar
      :modelValue="year"
      v-model:active-dates="activeDates"
      @toggle-date="toggleDate"
      :lang="lang"
      prefix-class="your_customized_wrapper_class"
      :active-class="activeClass"
      :show-year-selector="showYearSelector"
      :darkmode="darkmode"
      @update:modelValue="year = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import YearCalendar from './components/YearCalendar.vue';

interface ActiveDate {
  date: string;
  className?: string;
}

// Estado reactivo
const lang = ref('es');
const year = ref(2024); // Cambiado a 2024
const activeDates = ref<ActiveDate[]>([
  { date: '2024-02-13' },
  { date: '2024-02-14', className: 'red' },
  { date: '2024-02-15', className: 'blue' },
  { date: '2024-02-16', className: 'your_customized_classname' },
]);
const activeClass = ref('');
const showYearSelector = ref(true);
const darkmode = ref(false);

// Observar cambios en el año para actualizar fechas activas
watch(year, (newYear) => {
  activeDates.value = [
    { date: `${newYear}-02-13` },
    { date: `${newYear}-02-14`, className: 'red' },
    { date: `${newYear}-02-15`, className: 'blue' },
    { date: `${newYear}-02-16`, className: 'your_customized_classname' },
  ];
});

// Métodos
const toggleDate = (dateInfo: { date: string; selected: boolean; className?: string }) => {
  const newDates = [...activeDates.value];
  const dateIndex = newDates.findIndex((d) => d.date === dateInfo.date);

  if (dateInfo.selected && dateIndex === -1) {
    const newDate: ActiveDate = {
      date: dateInfo.date,
      className: dateInfo.className || activeClass.value || undefined,
    };
    newDates.push(newDate);
  } else if (!dateInfo.selected && dateIndex !== -1) {
    newDates.splice(dateIndex, 1);
  }

  activeDates.value = newDates;
};

const toggleDarkMode = () => {
  darkmode.value = !darkmode.value;
};

const addSatAndSunOfYear = () => {
  let theDate = dayjs(`${year.value}-01-01`);
  const newDates = [...activeDates.value];

  while (theDate.diff(theDate.endOf('year'), 'day') !== 0) {
    if (theDate.day() === 6 || theDate.day() === 0) {
      const dateStr = theDate.format('YYYY-MM-DD');
      if (!newDates.some((d) => d.date === dateStr)) {
        newDates.push({
          date: dateStr,
          className: activeClass.value || undefined,
        });
      }
    }
    theDate = theDate.add(1, 'day');
  }

  activeDates.value = newDates
    .filter((item, pos, self) => self.findIndex((d) => d.date === item.date) === pos)
    .sort((a, b) => a.date.localeCompare(b.date));
};

const removeSatAndSunOfYear = () => {
  activeDates.value = activeDates.value.filter((date) => {
    const dateStr = typeof date === 'string' ? date : date.date;
    const dateObj = dayjs(dateStr);
    return !(dateObj.year() === year.value && (dateObj.day() === 6 || dateObj.day() === 0));
  });
};
</script>

<style lang="css" scoped>
#app {
  padding: 60px;
  background-color: #eaeaea;
}
h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}
</style>