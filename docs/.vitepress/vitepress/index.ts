import 'normalize.css';

import 'element-plus/theme-chalk/src/reset.scss';
import 'element-plus/theme-chalk/src/index.scss';
import './styles/css-vars.scss';
import './styles/app.scss';

import 'uno.css';

import VPDemo from './components/vp-demo.vue';

import type { Component } from 'vue';

export const globals: [string, Component][] = [['Demo', VPDemo]];
