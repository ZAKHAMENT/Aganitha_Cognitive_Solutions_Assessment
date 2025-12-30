// App.jsx
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import PasteForm from './components/PasteForm';
import PasteView from './components/PasteView';

function PastePage() {
  const { id } = useParams();
  return <PasteView pasteId={id} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PasteForm />} />
        <Route path="/p/:id" element={<PastePage />} />
      </Routes>
    </Router>
  );
}
  