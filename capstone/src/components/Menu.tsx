import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { pizzaOutline, pizzaSharp, homeOutline,flaskOutline, addCircleOutline, addCircleSharp, archiveOutline, archiveSharp, bookmarkOutline, cutOutline, cutSharp, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import '../Styles/Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/Home',
    iosIcon: homeOutline,
    mdIcon: homeOutline
  },
  {
    title: 'Ingredients',
    url: '/IngredientPage',
    iosIcon: pizzaOutline,
    mdIcon: pizzaOutline
  },
  {
    title: 'Recipes',
    url: '/Recipes',
    iosIcon: flaskOutline,
    mdIcon: flaskOutline 
  },
  {
    title: 'Create Recipes', // New entry for Recipe Creation Page
    url: '/CreateRecipes',
    iosIcon: addCircleOutline, // Choose an appropriate icon
    mdIcon: addCircleSharp
  },
  {
    title: 'Recipe Modifier', // New entry for Recipe Viewer Page
    url: '/RecipeModifier',
    iosIcon: cutOutline, // Choose an appropriate icon
    mdIcon: cutSharp
  }
];


const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Inbox</IonListHeader>
          <IonNote>hi@ionicframework.com</IonNote>
          {appPages.map((appPage, index) => (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem
                className={location.pathname === appPage.url ? 'selected' : ''}
                routerLink={appPage.url}
                routerDirection="none"
                lines="none"
                detail={false}
              >
                <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
