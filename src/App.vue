<!-- src/App.vue -->
<template>
  <div id="app">
    <button @click="addSatAndSunOfYear">Add weekend</button>
    <button @click="removeSatAndSunOfYear">Remove weekend</button>
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
      v-model="year"
      v-model:active-dates="activeDates"
      @toggle-date="toggleDate"
      :lang="lang"
      prefix-class="your_customized_wrapper_class"
      :active-class="activeClass"
      :show-year-selector="showYearSelector"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import YearCalendar from './components/YearCalendar.vue';

interface ActiveDate {
  date: string;
  className?: string;
}

// Estado reactivo
const lang = ref('es');
const year = ref(2025);
const activeDates = ref<ActiveDate[]>([
  { date: '2025-02-13' },
  { date: '2025-02-14', className: 'red' },
  { date: '2025-02-15', className: 'blue' },
  { date: '2025-02-16', className: 'your_customized_classname' },
]);
const activeClass = ref('');
const showYearSelector = ref(true);

// Métodos
const toggleDate = (dateInfo: { date: string; selected: boolean; className?: string }) => {
  const newDates = [...activeDates.value];
  const dateIndex = newDates.findIndex((d) => d.date === dateInfo.date);

  if (dateInfo.selected && dateIndex === -1) {
    const newDate: ActiveDate = {
      date: dateInfo.date,
      className: activeClass.value || undefined,
    };
    newDates.push(newDate);
  } else if (!dateInfo.selected && dateIndex !== -1) {
    newDates.splice(dateIndex, 1);
  }

  activeDates.value = newDates;
  console.log('Toggled date:', dateInfo, 'New activeDates:', activeDates.value);
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  padding: 60px;
  background-color: #eaeaea;
}

.your_customized_wrapper_class {
  background-color: #0aa;
  color: white;
}

.your_customized_wrapper_class.red {
  background-color: #a00;
  color: white;
}

.your_customized_wrapper_class.red::after {
  background-image: url('/assets/baseline-remove_circle-24px.svg');
  background-size: 100% 100%;
}

.your_customized_wrapper_class.blue {
  background-color: #0000aa;
  color: white;
}

.your_customized_wrapper_class.your_customized_classname {
  background-color: yellow;
  color: black;
}
</style>