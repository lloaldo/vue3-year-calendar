import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import MonthCalendar from './MonthCalendar.vue';
const props = withDefaults(defineProps(), {
    showYearSelector: true,
    activeDates: () => [],
    value: () => dayjs().year(),
    lang: 'en',
    activeClass: '',
    prefixClass: 'calendar--active',
});
const emit = defineEmits();
// Estado reactivo
const isUsingString = ref(props.activeDates.length && typeof props.activeDates[0] === 'string');
// Computadas
const activeYear = computed({
    get: () => parseInt(String(props.value)),
    set: (val) => emit('input', val),
});
const month = computed(() => {
    const monthData = {};
    props.activeDates.forEach((date) => {
        const oDate = typeof date === 'string'
            ? { date, className: props.activeClass }
            : { date: date.date, className: date.className ?? '' };
        if (dayjs(oDate.date).year() !== props.value)
            return;
        const m = (dayjs(oDate.date).month() + 1).toString();
        if (!monthData[m])
            monthData[m] = [];
        monthData[m].push(oDate);
    });
    return monthData;
});
// Métodos
const changeYear = (idx) => {
    activeYear.value = idx + activeYear.value - 3;
};
const toggleDate = (dateObj) => {
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
    }
    else {
        newDates.splice(dateIndex, 1);
    }
    emit('update:activeDates', newDates);
};
const overDay = (dateObj) => {
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
const modifiedActiveDates = (dateIndex, activeDate) => {
    const newDates = [...props.activeDates];
    if (dateIndex === -1) {
        newDates.push(activeDate);
    }
    else {
        newDates.splice(dateIndex, 1);
    }
    return newDates;
};
// Validación de activeDates (simplificada, puedes reutilizar la lógica original si es necesaria)
const validateActiveDates = (dates) => {
    return dates.every((date) => {
        const curDate = typeof date === 'string' ? date : date.date;
        if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(curDate))
            return false;
        const [year, month, day] = curDate.split('-').map(Number);
        if (year < 1000 || year > 3000 || month === 0 || month > 12)
            return false;
        const monthLength = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return day > 0 && day <= monthLength[month - 1];
    });
};
// Ejecutar validación al inicio (opcional)
if (props.activeDates.length && !validateActiveDates(props.activeDates)) {
    console.warn('Invalid activeDates provided');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    showYearSelector: true,
    activeDates: () => [],
    value: () => dayjs().year(),
    lang: 'en',
    activeClass: '',
    prefixClass: 'calendar--active',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__year']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__year']} */ ;
/** @type {__VLS_StyleScopedClasses['year__chooser']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__year']} */ ;
/** @type {__VLS_StyleScopedClasses['year__chooser']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__year']} */ ;
/** @type {__VLS_StyleScopedClasses['year__chooser']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__year']} */ ;
/** @type {__VLS_StyleScopedClasses['year__chooser']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__month']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__month']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__month']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__month']} */ ;
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "vue-calendar__container" },
});
if (__VLS_ctx.showYearSelector) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "container__year" },
    });
    for (const [i] of __VLS_getVForSourceType((5))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showYearSelector))
                        return;
                    __VLS_ctx.changeYear(i);
                } },
            key: (i),
            ...{ class: "year__chooser" },
        });
        (i + __VLS_ctx.activeYear - 3);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "container__months" },
});
for (const [n] of __VLS_getVForSourceType((12))) {
    /** @type {[typeof MonthCalendar, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(MonthCalendar, new MonthCalendar({
        ...{ 'onToggleDate': {} },
        ...{ 'onOverDay': {} },
        ...{ class: "container__month" },
        key: (`month-${n}`),
        year: (__VLS_ctx.activeYear),
        month: (n),
        activeDates: (__VLS_ctx.month[n] ?? []),
        activeClass: (__VLS_ctx.activeClass),
        lang: (__VLS_ctx.lang),
        prefixClass: (__VLS_ctx.prefixClass),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onToggleDate': {} },
        ...{ 'onOverDay': {} },
        ...{ class: "container__month" },
        key: (`month-${n}`),
        year: (__VLS_ctx.activeYear),
        month: (n),
        activeDates: (__VLS_ctx.month[n] ?? []),
        activeClass: (__VLS_ctx.activeClass),
        lang: (__VLS_ctx.lang),
        prefixClass: (__VLS_ctx.prefixClass),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
        onToggleDate: (__VLS_ctx.toggleDate)
    };
    const __VLS_7 = {
        onOverDay: (__VLS_ctx.overDay)
    };
    var __VLS_2;
}
for (const [i] of __VLS_getVForSourceType((5))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        key: (`empty-${i}`),
        ...{ class: "container__month p-0" },
    });
}
/** @type {__VLS_StyleScopedClasses['vue-calendar__container']} */ ;
/** @type {__VLS_StyleScopedClasses['container__year']} */ ;
/** @type {__VLS_StyleScopedClasses['year__chooser']} */ ;
/** @type {__VLS_StyleScopedClasses['container__months']} */ ;
/** @type {__VLS_StyleScopedClasses['container__month']} */ ;
/** @type {__VLS_StyleScopedClasses['container__month']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MonthCalendar: MonthCalendar,
            activeYear: activeYear,
            month: month,
            changeYear: changeYear,
            toggleDate: toggleDate,
            overDay: overDay,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=YearCalendar.vue.js.map