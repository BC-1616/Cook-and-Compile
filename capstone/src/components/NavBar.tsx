import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/NavBar.css';

// This page is similar to the original Menu but instead of there being an upper left menu button for mobile there is a Navigation bar at the bottom. This will be more user friendly for mobile users. 
const appPages = [
  {
    title: 'Home',
    url: '/Home',
    icon: 'home'
  },
  {
    title: 'Ingredients',
    url: '/IngredientPage',
    icon: 'list'
  },
  {
    title: 'Recipes',
    url: '/Recipes',
    icon: 'restaurant'
  },
  {
    title: 'Create',
    url: '/CreateRecipes',
    icon: 'create'
  },
  {
    title: 'Modify',
    url: '/RecipeModifier',
    icon: 'construct'
  }
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
          <i className={`icon-${appPage.icon}`}></i>
          <span>{appPage.title}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomNavBar;
