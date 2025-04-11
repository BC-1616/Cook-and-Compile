import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/NavBar.css';
// import icons for navbar
import home from '../ICONS/Home.png';
import ingredients from '../ICONS/Ingredients.png';
import recipes from '../ICONS/Recipes.png';
import modify from '../ICONS/Modify.png';

const appPages = [
  {
    title: 'Home',
    url: '/Home',
    icon: home
  },
  {
    title: 'Ingredients',
    url: '/IngredientPage',
    icon: ingredients
  },
  {
    title: 'Recipes',
    url: '/Recipes',
    icon: recipes
  }
  /*
  {
    title: 'Modify',
    url: '/ModifyRecipes',
    icon: modify
  }*/
];

const CustomNavBar: React.FC = () => {
  const location = useLocation();
    
  if (location.pathname === '/LandingPage') {
    return null;
  }

  return (
    <div className="custom-navbar">
      {appPages.map((appPage, index) => (
        <div
          key={index}
          className={`nav-button ${location.pathname === appPage.url ? 'selected' : ''}`}
          onClick={() => window.location.href = appPage.url}
        >
          {/* added image tag for icons */}
          <img src={appPage.icon} alt={appPage.title} className="nav-icon" />
      </div>
      ))}
    </div>
  );
};

export default CustomNavBar;
