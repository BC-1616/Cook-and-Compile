import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import Push from './components/Push';
import IngredientPage from './components/IngredientList';
import Pull from './components/Pull';
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

/* this was causing an issue with the pages not updating correctly when switching between them. adding the switch fixed it. */
setupIonicReact();
const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Switch>
              <Route path="/" exact={true}>
                <Redirect to="/Home" />
              </Route>
              <Route path="/Home" exact={true}>
                <BlankPage />
              </Route> 
              {/*
              <Route path="/folder/Push" exact={true}>
                <Push />
              </Route>

              <Route path="/folder/Pull" exact={true}>
                <Pull />
              </Route>
              */}
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
