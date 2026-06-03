import type { ExtractPublicPropTypes } from 'vue';

export interface WebViewProps {
  src: string;
  width?: string;
  height?: string;
  border?: string;
  // 其他属性省略，同iframe
}

export type WebViewEmits = {
  (e: 'message', message: MessageEvent): void;
};

export const webViewProps = {
  src: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  border: {
    type: String,
    default: '0'
  }
} as const;

export type webViewInstance = ExtractPublicPropTypes<typeof webViewProps>;
