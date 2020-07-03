import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { locals } from '../index.css';
import { get } from '../sites';
import * as Styles from '../styles';

interface RmProps {
  show: boolean;
  onExit: () => void;
}

const Rm = (props: RmProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (props.show && title === "") {
      const article = get();
      setTitle(article.title);
      setContent(article.content)
    }
  });

  useEffect(() => {
    const doForceUpdate = () => forceUpdate(x => x + 1);
    Styles.on(doForceUpdate);
    return () => {
      Styles.off(doForceUpdate);
    }
  }, []);

  const currentFontWeight = Styles.get('font_weight');

  const handleSave = () => {
    const name = window.prompt('请输入预设名称');
    if (name) {
      Styles.preset.add(name, {
        ...Styles.get()
      });
    }
  }

  return (
    <div className={locals.rm} style={{
      display: props.show ? 'block' : 'none'
    }}>
      <div className={locals.option}>
        <button onClick={() => Styles.set('font_size', Styles.get('font_size') + 1)}>增大字体</button>
        <button onClick={() => Styles.set('font_size', Styles.get('font_size') - 1)}>减小字体</button>
        <button onClick={() => Styles.set('box_padding', Styles.get('box_padding') + 10)}>增大边距</button>
        <button onClick={() => Styles.set('box_padding', Styles.get('box_padding') - 10)}>减小边距</button>
        <button onClick={() => Styles.set('box_line_height', Styles.get('box_line_height') + 25)}>增大行距</button>
        <button onClick={() => Styles.set('box_line_height', Styles.get('box_line_height') - 25)}>减小行距</button>
        <label>
          <span>文字粗细</span>
          <select onChange={e => Styles.set('font_weight', e.target.value)}>
            <option value="lighter" selected={currentFontWeight === "lighter"}>细体</option>
            <option value="normal" selected={currentFontWeight === "normal"}>常规</option>
            <option value="bold" selected={currentFontWeight === "bold"}>粗体</option>
          </select>
        </label>
        <label>
          <span>背景色</span>
          <input type="color" value={Styles.get('box_bg')} onChange={e => Styles.set('box_bg', e.target.value)} />
        </label>
        <label>
          <span>文字颜色</span>
          <input type="color" value={Styles.get('text_color')} onChange={e => Styles.set('text_color', e.target.value)} />
        </label>
        <label>
          <span>预设</span>
          <select onChange={e => Styles.preset.use(parseInt(e.target.value))}>
            {
              Styles.preset.get().map((it, idx) => {
                return (
                  <option value={idx} selected={false}>{it.name}</option>
                )
              })
            }
          </select>
        </label>
        <button onClick={handleSave}>保存为预设</button>
        <button onClick={props.onExit}>退出</button>
      </div>
      <div className={locals.title}>{title}</div>
      <div className="content" dangerouslySetInnerHTML={{
        __html: content
      }}></div>
    </div>
  )
}

export default Rm;