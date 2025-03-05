import { IonApp, IonRouterOutlet, setupIonicReact, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import IngredientPage from './components/IngredientList';
import BlankPage from './components/BlankPage';
import CreateRecipes from './components/CreateRecipes';
import RecipeModifier from './components/RecipeModifier';
import Recipe from './components/Recipe';
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import handleAuth from './handles/handleAuth';
import { UserProvider } from './components/UserContext'; // Import UserProvider
import React from 'react';

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
  const { user } = handleAuth(); // Assuming handleAuth properly sets user and loading states


  return (
    <IonApp>
      {/* Wrap everything in UserProvider so that user data is accessible globally */}
      <UserProvider>
        <>
          {console.log('Rendering App component')}
        </>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <IonRouterOutlet id="main">
              <Switch>
                {/* Always redirect to LandingPage if no user is authenticated */}
                <Route path="/" exact={true}>
                  <Redirect to={user ? "/Home" : "/LandingPage"} />
                </Route>

                {/* LandingPage route */}
                <Route path="/LandingPage" exact={true}>
                  <LandingPage />
                </Route>

                {/* Home route */}
                <Route path="/Home" exact={true}>
                  <BlankPage /> {/* Render the BlankPage if user is authenticated */}
                </Route>

                {/* Other routes */}
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

            {<NavBar />}
          </IonSplitPane>
        </IonReactRouter>
      </UserProvider>
    </IonApp>
  );
};

export default App;
