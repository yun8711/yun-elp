import type { App, Component } from 'vue';
import { fromPairs, isPlainObject } from 'lodash-es';

export type SFCWithInstall<T> = T & {
  install: (app: App) => void;
  setPropsDefaults: (defaults: Record<string, unknown>) => void;
};

type ComponentWithProps = SFCWithInstall<Component> & {
  props?: Record<string, unknown> | string[];
};

const withPropsDefaultsSetter = (target: ComponentWithProps) => {
  const rawProps = target.props;
  const props = Array.isArray(rawProps) ? fromPairs(rawProps.map(key => [key, {}])) : rawProps;

  target.setPropsDefaults = defaults => {
    if (!props) return;

    for (const [key, value] of Object.entries(defaults)) {
      const prop = props[key];
      if (!Object.prototype.hasOwnProperty.call(props, key)) continue;

      if (isPlainObject(prop)) {
        const normalizedProp = prop as Record<string, unknown>;
        props[key] = {
          ...normalizedProp,
          default: value,
        };
        continue;
      }

      props[key] = {
        type: prop,
        default: value,
      };
    }

    target.props = props;
  };
};

/**
 * 为组件添加install方法，实现组件的全局注册
 * @param component Vue组件
 * @param alias 组件别名
 * @returns 添加了install方法的组件
 */
export const withInstall = <T extends Component>(component: T, alias?: string): SFCWithInstall<T> => {
  const componentWithInstall = component as SFCWithInstall<T>;

  componentWithInstall.install = (app: App) => {
    const name = component.name || 'Unknown';
    app.component(name, component);
    if (alias) {
      app.component(alias, component);
    }
  };

  withPropsDefaultsSetter(componentWithInstall as ComponentWithProps);

  return componentWithInstall;
};
