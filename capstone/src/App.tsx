import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import IngredientPage from './components/IngredientList';
import BlankPage from './components/BlankPage';
import CreateRecipes from './components/CreateRecipes';
import RecipeModifier from './components/RecipeModifier';
import Recipe from './components/Recipe';
import LandingPage from './components/LandingPage';
import handleAuth from './handles/handleAuth';  // Import the useAuth hook

import React, { useEffect, useState } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './Styles/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const { user } = handleAuth(); // Use the useAuth hook to access the authenticated user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== null) {
      setLoading(false); // Set loading to false once the user is authenticated
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator until user is authenticated
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          {user && <Menu />} {/* Render Menu only if user is logged in */}
          <IonRouterOutlet id="main">
            <Switch>
              <Route path="/" exact={true}>
                <Redirect to={user ? "/Home" : "/LandingPage"} />
              </Route>

              <Route path="/LandingPage" exact={true}>
                <LandingPage />
              </Route>

              <Route path="/Home" exact={true}>
                {user ? <BlankPage /> : <Redirect to="/LandingPage" />} {/* Redirect to LandingPage if not logged in */}
              </Route>

              <Route path="/IngredientPage" exact={true}>
                <IngredientPage />
              </Route>

              <Route path="/Recipes" exact={true}>
                <Recipe />
              </Route>

              <Route path="/CreateRecipes" exact={true}>
                <CreateRecipes />
              </Route>

              <Route path="/RecipeModifier" exact={true}>
                <RecipeModifier />
              </Route>
            </Switch>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
