
# LightningNews

LightningNews is a web application that visualizes news articles using a dynamic bar chart. The application displays the number of news articles published hourly from different sources, allowing users to analyze patterns across different hours of the day.

### Features
- **Real-time news updates**: Fetch news from multiple sources with the ability to filter by category.
- **Push notifications**: Receive notifications when new news articles are available.
- **Dark mode toggle**: Switch between light and dark mode for a better reading experience.
- **Search functionality**: Search news by keywords.
- **Filter by news sources**: Select specific news sources for personalized content.
- **News sorting**: Sort news articles by popularity or publication date.
- **Chart visualizations**: View the active hours of news updates with a graphical representation.
- **Top headlines**: Display the top headlines from various categories like technology, sports, etc.

## Getting Started

Follow the steps below to set up and run the project locally on your machine.

### Prerequisites

Before you begin, ensure that you have the following installed:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gozdesimsekk/flalingo_news.git
   ```

2. Navigate to the project directory:
   ```bash
   cd LightningNews
   ```

3. Install the project dependencies:
   ```bash
   npm install
   ```

### Running the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to the following URL:
   ```
   http://localhost:3000
   ```

3. The app should now be running on your local machine.

### Building for Production

To create a production-ready build of the app, run the following command:
   ```bash
   npm run build
   ```

## Technologies Used

The following technologies and libraries were used to build this application:

- **Next.js**: A React framework used for building server-side rendered applications. Next.js was chosen for its optimized performance and built-in routing capabilities.
- **Chart.js**: A popular and powerful JavaScript library for creating charts and data visualizations. It was used to render the bar chart displaying news article data.
- **chartjs-plugin-datalabels**: A plugin for Chart.js that enables data labels to be displayed on the chart, allowing users to quickly view the values of each bar.
- **useState** (React Hook): Used to manage the state of the application, including filtering the data based on selected sources.
- **JavaScript ES6+**: Modern JavaScript features like arrow functions, template literals, and destructuring were used for clean and concise code.
- **npm**: Node Package Manager (npm) is used for managing project dependencies, scripts, and utilities.
- **CSS**: Plain CSS is used for styling the components, ensuring the application is responsive and looks visually appealing.
- **Firebase**: For handling push notifications.

## Architecture and Design Decisions

The application follows a component-based architecture, with the primary component being the `NewsChart` component that renders the bar chart and handles user interaction. The state of the application is managed using React's built-in `useState` hook to allow dynamic filtering based on the selected news source.

### Design Decisions:
- **Responsiveness**: The chart is made responsive using Chart.js’s `responsive` option to adapt to different screen sizes.
- **Data Labeling**: Data labels are displayed on the chart to give users a quick insight into the number of articles for each hour.
- **Dynamic Filtering**: Users can filter the chart data by selecting a source, which updates the chart in real-time.

## Assumptions and Known Limitations

### Assumptions:
- The data provided is in the correct format and includes valid sources and hours.
- All sources are pre-defined and available for filtering.

### Known Limitations:
- **Data Source**: This app assumes the data source provides hourly data that includes a `count` and `sources` field.
- **Performance**: For very large datasets, the application may experience slowdowns due to the rendering of multiple chart elements.
- **API Request Limit**: There is a limit on the number of API requests, and if this limit is exceeded, fetching additional data may fail. This limitation depends on the rate limits set by the API provider.
- **Capacitor.js Mobile App Development**: Attempts to develop the mobile app using Capacitor.js failed because API requests could not be sent successfully. (development branch)
- **Push Notifications**: Firebase Cloud Messaging (FCM) was chosen for push notifications, but it is not performing optimally and does not provide a smooth experience.

## Future Improvements
- Add more filtering options such as date range and type of news.
- Support for real-time data updates using WebSocket or API polling.


