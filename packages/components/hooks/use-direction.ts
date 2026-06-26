import { computed, inject, type ComputedRef } from 'vue';
import { directionContextKey, type DirectionType } from '../locale/direction';

export function useDirection(): {
  direction: ComputedRef<DirectionType>;
  isRtl: ComputedRef<boolean>;
} {
  const direction = inject(
    directionContextKey,
    computed(() => 'ltr' as DirectionType)
  );

  return {
    direction,
    isRtl: computed(() => direction.value === 'rtl')
  };
}
