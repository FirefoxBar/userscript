import { locals } from './index.css';

export interface Style {
  [x: string]: any;
  name?: string;
  box_bg: string;
  text_color: string;
  font_size: number;
  box_padding: number;
  box_line_height: number;
  font_weight: string;
}

let curStyle: Style = {
  box_bg: GM_getValue('box_bg') || '#ffffff',
  text_color: GM_getValue('text_color') || '#000000',
  font_size: GM_getValue('font_size') || 18,
  box_padding: GM_getValue('box_padding') || 30,
  box_line_height: GM_getValue('box_line_height') || 100,
  font_weight: GM_getValue('font_weight') || 'normal'
};

function getText() {
  const title_font_size = Math.ceil(curStyle.font_size * 1.6);
  let text = `.${locals.rm} .option button {
    color: ${curStyle.text_color};
  }
  .${locals.rm} {
    background-color: ${curStyle.box_bg};
    padding: 15px ${curStyle.box_padding}px;
  }
  .${locals.rm} .option * {
    color: ${curStyle.text_color};
  }
  .${locals.rm} .title {
    font-size: ${title_font_size}px !important;
    border-bottom: 1px solid ${curStyle.text_color};
    color: ${curStyle.text_color} !important;
  }
  .${locals.rm} .content {
    font-size: ${curStyle.font_size}px !important;
    line-height: ${curStyle.box_line_height}%;
    color: ${curStyle.text_color} !important;
    font-weight: ${curStyle.font_weight} !important;
  }
  .${locals.rm} h1,
  .${locals.rm} h2,
  .${locals.rm} h3,
  .${locals.rm} h4,
  .${locals.rm} h5,
  .${locals.rm} h6 {
    font-weight: ${curStyle.font_weight} !important;
  }`;
  //添加h1-h6的字号
  for (let i = 6; i >= 1; i--) {
    text += `.${locals.rm} h${i} { font-size: ${curStyle.font_size + (7 - i) * 2}px; }`;
  }
  return text;
}

let element: HTMLElement | undefined = undefined;
export function update() {
  if (typeof element === 'undefined') {
    element = document.createElement('style');
    document.body.appendChild(element);
  }
  element.innerHTML = getText();
}

export function set(name: string, value: any) {
  GM_setValue(name, value);
  curStyle[name] = value;
  update();
  handlers.forEach(it => it());
}

export function get(name?: string) {
  if (!name) return curStyle;
  return curStyle[name];
}

const handlers: any[] = [];
export function off(handler: any) {
  if (handlers.includes(handler)) {
    handlers.splice(handlers.indexOf(handler), 1);
  }
}
export function on(handler: any) {
  handlers.push(handler);
}

const presets: Style[] = JSON.parse(GM_getValue('preset') || '[]');
export const preset = {
  get: () => {
    return presets;
  },
  add: (name: string, style: Style) => {
    presets.push({
      ...style,
      name
    });
    GM_setValue("preset", JSON.stringify(presets));
    handlers.forEach(it => it());
  },
  use: (index: number) => {
    if (presets[index]) {
      curStyle = presets[index];
      Object.keys(curStyle).forEach(k => {
        GM_getValue(k, curStyle[k]);
      });
      update();
      handlers.forEach(it => it());
    }
  }
}