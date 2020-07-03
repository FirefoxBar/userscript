import * as Styles from './styles';
import { has } from './sites';
import { h, render } from 'preact';
import App from './app';

if (has()) {
  Styles.update();
  
  const el = document.createElement('div');
  document.body.appendChild(el);
  render(h(App, null), el);
}
