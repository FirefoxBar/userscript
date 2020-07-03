import { h } from 'preact';
import { useState } from 'preact/hooks';
import Bar from './components/bar';
import Rm from './components/rm';

const App = () => {
  const [show, setShow] = useState(false);
  const [bar, setBar] = useState(true);

  return (
    <div>
      {bar && <Bar onEnter={() => setShow(true)} onClose={() => setBar(false)} />}
      <Rm show={show} onExit={() => setShow(false)} />
    </div>
  )
}

export default App;