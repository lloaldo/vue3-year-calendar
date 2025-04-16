import { ref } from 'vue';
import dayjs from 'dayjs';
import YearCalendar from './components/YearCalendar.vue';
// Estado reactivo
const lang = ref('es');
const year = ref(2025);
const activeDates = ref([
    { date: '2025-02-13' },
    { date: '2025-02-14', className: 'red' },
    { date: '2025-02-15', className: 'blue' },
    { date: '2025-02-16', className: 'your_customized_classname' },
]);
const activeClass = ref('');
const showYearSelector = ref(true);
// Métodos
const toggleDate = (dateInfo) => {
    const newDates = [...activeDates.value];
    const dateIndex = newDates.findIndex((d) => d.date === dateInfo.date);
    if (dateInfo.selected && dateIndex === -1) {
        const newDate = {
            date: dateInfo.date,
            className: activeClass.value || undefined,
        };
        newDates.push(newDate);
    }
    else if (!dateInfo.selected && dateIndex !== -1) {
        newDates.splice(dateIndex, 1);
    }
    activeDates.value = newDates;
    // console.log('Toggled date:', dateInfo, 'New activeDates:', activeDates.value);
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "app",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.addSatAndSunOfYear) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.removeSatAndSunOfYear) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.lang),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "tw",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "en",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "pt",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "de",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "es",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.activeClass),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "red",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "blue",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "your_customized_classname",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "checkbox",
});
(__VLS_ctx.showYearSelector);
/** @type {[typeof YearCalendar, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(YearCalendar, new YearCalendar({
    ...{ 'onToggleDate': {} },
    modelValue: (__VLS_ctx.year),
    activeDates: (__VLS_ctx.activeDates),
    lang: (__VLS_ctx.lang),
    prefixClass: "your_customized_wrapper_class",
    activeClass: (__VLS_ctx.activeClass),
    showYearSelector: (__VLS_ctx.showYearSelector),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onToggleDate': {} },
    modelValue: (__VLS_ctx.year),
    activeDates: (__VLS_ctx.activeDates),
    lang: (__VLS_ctx.lang),
    prefixClass: "your_customized_wrapper_class",
    activeClass: (__VLS_ctx.activeClass),
    showYearSelector: (__VLS_ctx.showYearSelector),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onToggleDate: (__VLS_ctx.toggleDate)
};
var __VLS_2;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            YearCalendar: YearCalendar,
            lang: lang,
            year: year,
            activeDates: activeDates,
            activeClass: activeClass,
            showYearSelector: showYearSelector,
            toggleDate: toggleDate,
            addSatAndSunOfYear: addSatAndSunOfYear,
            removeSatAndSunOfYear: removeSatAndSunOfYear,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=App.vue.js.map