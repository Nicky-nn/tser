import './App.css';
import { Provider } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import MatxTheme from './app/base/components/Template/MatxTheme/MatxTheme';
import { AuthProvider } from './app/base/contexts/JWTAuthContext';
import { SettingsProvider } from './app/base/contexts/SettingsContext';
import { appRoutes } from './app/routes/routes';
import { store } from './app/store/store';

function App() {
  const content = useRoutes(appRoutes);
  return (
    <Provider store={store}>
      <SettingsProvider>
        <MatxTheme>
          <AuthProvider>{content}</AuthProvider>
        </MatxTheme>
      </SettingsProvider>
    </Provider>
  );
}

export default App;
