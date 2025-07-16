import 'normalize.css';

import 'element-plus/theme-chalk/src/reset.scss';
import 'element-plus/theme-chalk/src/index.scss';
import './styles/css-vars.scss';
import './styles/app.scss';

import 'uno.css';

import VPDemo from './components/vp-demo.vue';
import ApiTyping from './components/globals/vp-api-typing.vue';
import ApiFunctionType from './components/globals/vp-api-function.vue';
import ApiBooleanType from './components/globals/vp-api-bool.vue';
import ApiStringType from './components/globals/vp-api-string.vue';
import ApiNumberType from './components/globals/vp-api-number.vue';
import ApiRefType from './components/globals/vp-api-ref.vue';
import ApiEnumType from './components/globals/vp-api-enum.vue';

import type { Component } from 'vue';

export const globals: [string, Component][] = [
  ['Demo', VPDemo],
  ['ApiTyping', ApiTyping],
  ['FunctionType', ApiFunctionType],
  ['BooleanType', ApiBooleanType],
  ['StringType', ApiStringType],
  ['NumberType', ApiNumberType],
  ['RefType', ApiRefType],
  ['EnumType', ApiEnumType],
];
