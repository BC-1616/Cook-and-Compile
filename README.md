#  _Cook & Compile_

## Description

_Cook & Compile_ is a web and mobile application designed to help users manage store recipes create meal plans easily, and effectively. Our goal is to help the user in creating and sticking to meal plans in a world where you can have almost any food that can be thought of delivered to your door.

With _Cook & Compile_, you can save money, eat healthier, and enjoy cooking more than ever before!

## Features 

These are the features of our app broken down on a page-to-page level

### /Home

Export User Data
- All of the data stored in your `user` collection in our database will be put into a JSON file and downloaded onto your machine.

### /IngredientPage

Preferences
- You can input any ingredient you want more of in your meals. This will contribute to your recipes 'score', a metric used when utilizing our auto-generation feature.

Allergies
- You can input any ingredient you are allergic to in this section. Any recipes that include these ingredients will be flagged in the `/Recipes` page and you can easily view them on that page.

### /Recipes

Recipe Display
- All of your recipes will be displayed in a grid on this page. The recipes will appear as a button with a cover image. When you click inside the recipe buttons, you can view more detailed information and modify it to your pleasure

Recipe Modification
- This page also serves to modify your recipes, including, creation, deletion, and editing specific fields such as ingredients, ingredient amounts, instructions, the name, and the cover image.

Recipe Search
- The top of the page features a search bar for easy recipe retrieval based on their name.

### /MealPlan

Daily / Weekly meal plan view
- You can view your meal plan either on a day-to-day view or by week with two buttons at the top of the screen. The day plan includes breakfast, lunch, snack, and dinner.

Generate meal plan
- In the day view, you can use the button `Generate Meal Plan` to let _Cook & Compile_ generate your day plan for you. You can also use the smaller buttons in each meal to generate that specific meal alone.

Delete meal plan
- On the day view, you can use the button `Delete Meal Plan` to delete the plan for each meal of that specific day. You can also use the red button next to each meal to delete them individually as well.

Shopping Lists
- On either the day or the week view, you can view what your shopping list would be considering the recipes you have in your meal plan.

## Tech Stack 

This app utilizes the following technologies:
### Frontend
- Ionic React
- NodeJS
- TypeScript

### Backend
- Firebase
- TypeScript
- Golang

### Testing
- Cypress
- Vitest

### Why We Chose Ionic and React
We chose Ionic and React for _Cook & Compile_ to take advantage of cross-platform development, enabling us to maintain a single codebase for Android, iOS, and web applications. Both frameworks offer extensive community support and detailed documentation, making it easier to find solutions and resources. By leveraging familiar web technologies through Ionic and benefiting from React's performance and component-based architecture, our development process becomes faster and more efficient. This approach allows our team to focus on delivering a high-quality user experience across all platforms.

### Why We Chose Firebase
We are also utilizing firebase for its backend services, including database management, authentication, cloud storage, and hosting. Using firebase allows our team to simplify the backend infrastructure so we can focus more on improving our app, while firebase synchronizes data across all devices. 

### Why we chose Golang

Our app features a small backend app that will take care of our user's privacy and handle their data according to GDPR/SOC standards. This app is called _Safely GO_, and more information about it can be found in the subdirectory [here](./capstone/server/README.md).

### Testing Frameworks

For testing, we use Cypress for end-to-end testing and Vitest for unit testing. Cypress allows us to simulate user interactions and verify our app works as it should from the user's perspective. Vitest is useful for isolating functions and components, ensuring correct functionality. Using these frameworks allows our team to catch errors early and maintain code quality and consistency. 

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en)
- [npm](https://nodejs.org/en) (Node Package Manager)
- [Ionic CLI](https://ionicframework.com/docs/cli)
- [Go 1.23^](https://go.dev/doc/install)

### Steps
1. Clone the repository 
2. Navigate to the project directory
3. Install dependencies
 
   ```bash
   npm install
   ```
4. Run the app
   ```bash
    ionic serve 
   ```



