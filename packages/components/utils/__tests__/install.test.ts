import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { withInstall } from '../install';

describe('withInstall', () => {
  it('adds default values to object-style props', () => {
    const component = withInstall(
      defineComponent({
        name: 'ObjectPropsComponent',
        props: {
          size: String,
          disabled: {
            type: Boolean
          }
        }
      })
    );

    component.setPropsDefaults({
      size: 'default',
      disabled: true
    });

    expect(component.props?.size).toEqual({
      type: String,
      default: 'default'
    });
    expect(component.props?.disabled).toEqual({
      type: Boolean,
      default: true
    });
  });

  it('adds default values to array-style props', () => {
    const component = withInstall(
      defineComponent({
        name: 'ArrayPropsComponent',
        props: ['label']
      })
    );

    component.setPropsDefaults({
      label: 'hello',
      missing: 'ignored'
    });

    expect(component.props).toEqual({
      label: {
        default: 'hello'
      }
    });
  });
});
