import { locals } from '../index.css';
import { h } from 'preact';

interface BarProps {
  onEnter: () => void;
  onClose: () => void;
}

const Bar = (props: BarProps) => {
  return (
    <div className={locals.bar}>
      <button onClick={props.onEnter}>进入阅读模式</button>
      <button onClick={props.onClose}>关闭</button>
    </div>
  )
}

export default Bar;