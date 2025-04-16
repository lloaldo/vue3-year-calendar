import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
const props = withDefaults(defineProps(), {
    activeDates: () => [],
    month: () => dayjs().month() + 1,
    year: () => dayjs().year(),
    lang: 'en',
    activeClass: '',
    prefixClass: 'calendar--active',
});
const emit = defineEmits();
// Estado reactivo
const showDays = ref([]);
const isMouseDown = ref(false);
// Computadas
const weekTitleFontSizeAdjustLang = computed(() => {
    const fontSizeMapping = {
        tw: '16px',
        en: '14px',
        pt: '14px',
        de: '14px',
        es: '14px',
    };
    return fontSizeMapping[props.lang] ?? '14px';
});
const monthTitle = computed(() => {
    const monthMapping = {
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
    if (firstDay < 0)
        firstDay += 7;
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
        const oDate = typeof date === 'string' ? { date, className: props.activeClass } : date;
        const dayjsObj = dayjs(oDate.date);
        if (dayjsObj.year() !== Number(props.year) || dayjsObj.month() + 1 !== Number(props.month))
            return;
        const activeDate = dayjsObj.date();
        const row = Math.floor((activeDate - 1) / 7);
        const activeArrayKey = ((activeDate - 1) % 7) + firstDay + 7 * row;
        if (fullCol[activeArrayKey]) {
            fullCol[activeArrayKey].active = true;
            fullCol[activeArrayKey].className = oDate.className ?? props.activeClass;
        }
    });
    showDays.value = fullCol;
};
const showDayTitle = (day) => {
    const dayMapping = {
        tw: ['一', '二', '三', '四', '五', '六', '日'],
        en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        pt: ['2ª', '3ª', '4ª', '5ª', '6ª', 'Sa', 'Do'],
        de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
    };
    return dayMapping[props.lang]?.[day - 1] ?? dayMapping.en[day - 1];
};
const toggleDay = (dayObj) => {
    if (dayObj.isOtherMonth || !dayObj.value)
        return;
    emit('toggleDate', {
        month: Number(props.month),
        date: Number(dayObj.value),
        selected: !dayObj.active,
        className: props.activeClass,
    });
};
const dragDay = (dayObj) => {
    if (isMouseDown.value)
        toggleDay(dayObj);
    if (dayObj.isOtherMonth || !dayObj.value)
        return;
    emit('overDay', {
        month: Number(props.month),
        date: Number(dayObj.value),
        selected: !dayObj.active,
        className: props.activeClass,
    });
};
const mouseDown = (dayObj) => {
    toggleDay(dayObj);
    isMouseDown.value = true;
};
const mouseUp = () => {
    isMouseDown.value = false;
};
const classList = (dayObj) => {
    const classes = {
        'calendar__day--otherMonth': dayObj.isOtherMonth,
        [props.prefixClass]: dayObj.active,
    };
    if (dayObj.active && dayObj.className) {
        classes[dayObj.className] = true;
    }
    return classes;
};
// Watchers
watch([() => props.year, () => props.month, () => props.activeDates], () => {
    initCalendar();
});
// Inicializar
initCalendar();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    activeDates: () => [],
    month: () => dayjs().month() + 1,
    year: () => dayjs().year(),
    lang: 'en',
    activeClass: '',
    prefixClass: 'calendar--active',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar--active']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar--active']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar--active']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar--active']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar--active']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar__day--otherMonth']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "c-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onMouseup: (__VLS_ctx.mouseUp) },
    ...{ onMouseleave: (__VLS_ctx.mouseUp) },
    ...{ class: "calendar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "calendar__title" },
});
(__VLS_ctx.monthTitle);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "calendar__body" },
});
for (const [day] of __VLS_getVForSourceType((7))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (`title${day}`),
        ...{ class: "calendar__day day__weektitle" },
        ...{ style: ({ fontSize: __VLS_ctx.weekTitleFontSizeAdjustLang }) },
    });
    (__VLS_ctx.showDayTitle(day));
}
for (const [dayObj, key] of __VLS_getVForSourceType((__VLS_ctx.showDays))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (`day${key}`),
        ...{ class: "calendar__day" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onMouseover: (...[$event]) => {
                __VLS_ctx.dragDay(dayObj);
            } },
        ...{ onMousedown: (...[$event]) => {
                __VLS_ctx.mouseDown(dayObj);
            } },
        ...{ class: "day" },
        ...{ class: (__VLS_ctx.classList(dayObj)) },
    });
    (dayObj.value);
}
/** @type {__VLS_StyleScopedClasses['c-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar__title']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar__body']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar__day']} */ ;
/** @type {__VLS_StyleScopedClasses['day__weektitle']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar__day']} */ ;
/** @type {__VLS_StyleScopedClasses['day']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            showDays: showDays,
            weekTitleFontSizeAdjustLang: weekTitleFontSizeAdjustLang,
            monthTitle: monthTitle,
            showDayTitle: showDayTitle,
            dragDay: dragDay,
            mouseDown: mouseDown,
            mouseUp: mouseUp,
            classList: classList,
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
//# sourceMappingURL=MonthCalendar.vue.js.map