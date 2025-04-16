import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
export default defineConfig({
    server: {
        host: '0.0.0.0',
        hmr: {
            overlay: true,
            host: 'localhost',
        },
    },
    plugins: [
        vue(),
        dts({ insertTypesEntry: true }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Vue3YearCalendar',
            fileName: 'vue3-year-calendar',
        },
        rollupOptions: {
            external: ['vue', 'dayjs'],
            output: {
                globals: {
                    vue: 'Vue',
                    dayjs: 'dayjs',
                },
            },
        },
        sourcemap: false,
    },
    css: {
        devSourcemap: false, // Evita .map en desarrollo
    },
});
//# sourceMappingURL=vite.config.js.map