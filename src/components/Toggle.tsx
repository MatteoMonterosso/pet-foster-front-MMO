import Toggle from 'react-toggle';
import 'react-toggle/style.css'; // Import des styles de react-toggle
import { useTheme } from '../hooks/DarkModeContext';


const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return(
    <Toggle
      checked={isDarkMode}
      icons={{ checked: '🌙' , unchecked: '🔆'}}
      onChange={toggleTheme}  // Déclenche le basculement du thème
      />
  )};
  
  export default ThemeToggle;