import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
								modules: ['@sidebase/nuxt-auth', '@nuxt/ui', '@nuxt/image'],
								css: ['~/css/main.css'],

								runtimeConfig: {
																public: {
																								api: {
																																baseUrl: 'http://localhost:7100/api',
																								},
																},
								},

								auth: {
																isEnabled: true,
																baseURL: 'http://localhost:3000/api/auth',
																provider: {
																								type: 'local',
																								endpoints: {
																																signIn: { path: '/login', method: 'post' },
																																signUp: { path: '/register', method: 'post' },
																																signOut: { path: '/logout', method: 'post' },

																																getSession: { path: '/session', method: 'get' },
																								},
																								token: {
																																signInResponseTokenPointer: '/jsonWebToken',
																																type: 'Bearer',
																																cookieName: 'auth.token',
																																headerName: 'Authorization',
																																maxAgeInSeconds: 3600, // 1h
																								},
																								refresh: {
																																isEnabled: true,
																																endpoint: { path: '/refresh', method: 'post' },
																																refreshOnlyToken: false,
																																token: {
																																								signInResponseRefreshTokenPointer: '/refreshToken',
																																								refreshResponseTokenPointer: '/token',
																																								refreshRequestTokenPointer: '/refreshToken',
																																								cookieName: 'auth.refresh',
																																								maxAgeInSeconds: 86400, // 24h
																																},
																								},
																},
								},
});