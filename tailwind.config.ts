
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			/* Executive Typography System */
			fontFamily: {
				'display': ['var(--font-display)', 'Playfair Display', 'serif'],
				'body': ['var(--font-body)', 'Inter', 'sans-serif'],
				'ui': ['var(--font-ui)', 'Inter', 'sans-serif'],
				'accessible': ['var(--font-accessible)', 'Inter', 'sans-serif'],
			},
			fontSize: {
				// Executive Typography Scale (Golden Ratio: 1.618)
				'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],      // 12px
				'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],    // 14px
				'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],            // 16px
				'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],          // 18px
				'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.025em' }],    // 20px
				'2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],    // 24px
				'3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],  // 30px
				'4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],   // 36px
				'5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],      // 48px
				'6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],   // 60px
				'7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],      // 72px
			},
			fontWeight: {
				'light': '300',
				'normal': '400',
				'medium': '500',
				'semibold': '600',
				'bold': '700',
				'extrabold': '800',
			},
			/* Professional & Accessible Color System */
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				// Professional Executive Palette - Calm and Accessible
				'professional-indigo': {
					50: '#eef2ff',
					100: '#e0e7ff',
					200: '#c7d2fe',
					300: '#a5b4fc',
					400: '#818cf8',
					500: '#6366f1', // Primary indigo
					600: '#4f46e5', // Main primary color
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81',
				},
				'professional-gray': {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563', // Secondary color
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
				},
				'forest-green': {
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669', // Accent color
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
				},
				// Colorblind-Safe Status Colors
				'status': {
					'info': '#3b82f6',      // Blue - universally distinguishable
					'success': '#059669',   // Forest green - safe for colorblind
					'warning': '#f59e0b',   // Amber - safe alternative to orange
					'error': '#dc2626',     // Red - high contrast
				},
				// Warm neutrals for professional feel
				'warm-gray': {
					50: '#fafaf9',
					100: '#f5f5f4',
					200: '#e7e5e4',
					300: '#d6d3d1',
					400: '#a8a29e',
					500: '#78716c',
					600: '#57534e',
					700: '#44403c',
					800: '#292524',
					900: '#1c1917',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			/* Professional Spacing System (8px base unit) */
			spacing: {
				'0.5': '0.125rem',  // 2px
				'1': '0.25rem',     // 4px
				'2': '0.5rem',      // 8px
				'3': '0.75rem',     // 12px
				'4': '1rem',        // 16px
				'5': '1.25rem',     // 20px
				'6': '1.5rem',      // 24px
				'8': '2rem',        // 32px
				'10': '2.5rem',     // 40px
				'12': '3rem',       // 48px
				'16': '4rem',       // 64px
				'20': '5rem',       // 80px
				'24': '6rem',       // 96px
				'32': '8rem',       // 128px
				'40': '10rem',      // 160px
				'48': '12rem',      // 192px
				'56': '14rem',      // 224px
				'64': '16rem',      // 256px
				// Professional specific spacing
				'professional-xs': '0.5rem',   // 8px
				'professional-sm': '1rem',     // 16px
				'professional-md': '1.5rem',   // 24px
				'professional-lg': '2rem',     // 32px
				'professional-xl': '3rem',     // 48px
				'professional-2xl': '4rem',    // 64px
				'professional-3xl': '6rem',    // 96px
			},
			/* Professional Animation System */
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeInProfessional 0.3s ease-out',
				'slide-up': 'slideUpProfessional 0.4s ease-out',
				'pulse-soft': 'pulseProfessional 2s ease-in-out infinite',
				'bounce-soft': 'bounce 2s ease-in-out infinite',
				'theme-transition': 'themeTransition 0.3s ease-in-out',
				'professional-enter': 'fadeInProfessional 0.3s ease-out',
				'professional-slide': 'slideUpProfessional 0.4s ease-out',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
						opacity: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					},
					to: {
						height: '0',
						opacity: '0'
					}
				},
				fadeInProfessional: {
					'0%': {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				slideUpProfessional: {
					'0%': {
						opacity: '0',
						transform: 'translateY(16px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				pulseProfessional: {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.85'
					}
				},
				themeTransition: {
					'0%': {
						opacity: '0.9'
					},
					'100%': {
						opacity: '1'
					}
				}
			},
			/* Professional Shadow System */
			boxShadow: {
				'professional': 'var(--shadow-professional)',
				'elevated': 'var(--shadow-professional-elevated)',
				'premium': 'var(--shadow-professional-premium)',
				'glow-primary': '0 0 20px hsl(var(--primary) / 0.2)',
				'glow-accent': '0 0 20px hsl(var(--accent) / 0.2)',
				'focus-ring': '0 0 0 3px hsl(var(--ring) / 0.2)',
				'professional-soft': '0 1px 3px 0 rgba(79, 70, 229, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
				'professional-medium': '0 4px 6px -1px rgba(79, 70, 229, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
				'professional-large': '0 10px 15px -3px rgba(79, 70, 229, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
			},
			/* Professional Transition System */
			transitionDuration: {
				'smooth': 'var(--transition-smooth)',
				'professional': '200ms',
			},
			transitionTimingFunction: {
				'professional': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			/* Professional Grid System */
			gridTemplateColumns: {
				'professional-2': 'repeat(2, minmax(0, 1fr))',
				'professional-3': 'repeat(3, minmax(0, 1fr))',
				'professional-4': 'repeat(4, minmax(0, 1fr))',
				'professional-auto-fit': 'repeat(auto-fit, minmax(320px, 1fr))',
				'professional-auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
			},
			/* Professional Backdrop Blur */
			backdropBlur: {
				'professional': '8px',
				'professional-sm': '4px',
				'professional-lg': '12px',
			},
			/* Professional Opacity Scale */
			opacity: {
				'2.5': '0.025',
				'7.5': '0.075',
				'15': '0.15',
				'35': '0.35',
				'65': '0.65',
				'85': '0.85',
			},
			/* Professional Z-Index Scale */
			zIndex: {
				'1': '1',
				'2': '2',
				'3': '3',
				'4': '4',
				'5': '5',
				'professional-dropdown': '1000',
				'professional-modal': '2000',
				'professional-toast': '3000',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
