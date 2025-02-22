// Reorganized imports
import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// removed unneeded import
import { Route, Redirect } from 'react-router-dom';
import Navbar from './components/NavBar';
import IngredientPage from './components/IngredientList';
// Deleted unneeded pull page 
import BlankPage from './components/BlankPage'
import CreateRecipes from './components/CreateRecipes';
import RecipeModifier from './components/RecipeModifier'; 
import Recipe from './components/Recipe';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './Styles/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet className="content-container">
              <Route path="/" exact={true}>
                <Redirect to="/Home" />
              </Route>
              {/* Simplified Routes */}
              <Route path="/Home" component={BlankPage} exact={true} />
              <Route path="/IngredientPage" component={IngredientPage} exact={true} />
              <Route path="/Recipes" component={Recipe} exact={true} />
              <Route path="/CreateRecipes" component={CreateRecipes} exact={true} />
              <Route path="/RecipeModifier" component={RecipeModifier} exact={true} />
            </IonRouterOutlet>
            <Navbar />
        </IonReactRouter>
    </IonApp>
  );
};

export default App;
