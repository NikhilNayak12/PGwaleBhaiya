import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@data': path.resolve(__dirname, './src/data')
      }
    },

    // Build configuration
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for third-party libraries
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // UI libraries
            ui: ['lucide-react', 'framer-motion'],
            // API utilities
            api: ['axios']
          },
          
          // Asset file naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            let extType = info[info.length - 1]
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images'
            } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
              extType = 'fonts'
            }
            
            return `${extType}/[name]-[hash][extname]`
          },
          
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js'
        }
      },
      
      // Bundle size warnings
      chunkSizeWarningLimit: 600
    },

    // Development server configuration
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5001/pg-walebhaiya/us-central1',
          changeOrigin: true,
          secure: false
        }
      }
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true
    },

    // Environment variables
    envPrefix: 'VITE_',
    
    // Performance optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'lucide-react'
      ]
    },

    // CSS configuration
    css: {
      modules: {
        localsConvention: 'camelCaseOnly'
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },

    // Production optimizations
    ...(isProduction && {
      esbuild: {
        drop: ['console', 'debugger'],
        legalComments: 'none'
      }
    })
  }
})
