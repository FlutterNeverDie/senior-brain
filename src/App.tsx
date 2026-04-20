import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store';
import IntroScreen from './components/IntroScreen';
import Stage1Memory from './components/Stage1Memory';
import Stage2Color from './components/Stage2Color';
import Stage3Change from './components/Stage3Change';
import ResultScreen from './components/ResultScreen';
import './App.css';

export default function App() {
  const appStage = useAppStore((s) => s.appStage);

  return (
    <div className="app-wrapper">
      <AnimatePresence mode="wait">
        {appStage === 'intro' && <IntroScreen key="intro" />}
        {appStage === 'stage1' && <Stage1Memory key="stage1" />}
        {appStage === 'stage2' && <Stage2Color key="stage2" />}
        {appStage === 'stage3' && <Stage3Change key="stage3" />}
        {appStage === 'result' && <ResultScreen key="result" />}
      </AnimatePresence>
    </div>
  );
}
