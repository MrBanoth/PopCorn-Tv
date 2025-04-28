# PopcornTV

A Netflix-inspired streaming platform built with Next.js and TypeScript. Browse movies from different categories, watch trailers, and save your favorites to your personal list.

## Project Context

This project was developed as a semester project at IIIT MANIPUR.

**Student Information:**
- **Name:** BANOTH SANDEEP NAIK
- **Roll No:** 220103001
- **Semester:** 6th
- **Institution:** IIIT MANIPUR

## Features

- **Browse Movies**: Explore movies from various categories
- **Search Functionality**: Find movies by title or description
- **Movie Details**: View detailed information about movies, including cast, director, and related recommendations
- **User Authentication**: Sign up and sign in to access premium features
- **My List**: Save favorite movies to your personal list (requires authentication)
- **Video Playback**: Watch movie trailers (requires authentication)
- **Responsive Design**: Enjoy a seamless experience on any device

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons
- [React Hook Form](https://react-hook-form.com/) - Form validation
- Local Storage - For authentication and "My List" functionality

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.8.0 or higher)
- npm or [pnpm](https://pnpm.io/) (recommended) or [yarn](https://yarnpkg.com/)

## Installation


Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

## Running the Development Server

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
popcorntv/
├── app/                # Next.js app directory (routes)
│   ├── auth/           # Authentication pages
│   ├── browse/         # Browse movies page
│   ├── movie/          # Movie details pages
│   └── profile/        # User profile page
├── components/         # Reusable components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and APIs
│   └── contentful.ts   # Mock content API
├── public/             # Static assets
└── styles/             # Global styles
```

## Authentication

The application uses browser local storage for authentication in this demo version.

To sign up:
1. Click "Sign Up" on the homepage
2. Fill in the required fields
3. Submit the form

To sign in:
1. Click "Sign In" on the homepage
2. Enter your credentials
3. Submit the form

Once authenticated, you can:
- Add movies to your list
- Watch movie trailers
- Access your profile

## Development Notes

### Mock Data

This project uses a mock implementation of the Contentful API with preset movie data for demonstration purposes. In a production environment, you would connect to a real content delivery API.

### Adding New Movies

To add new mock movies, edit the `lib/contentful.ts` file and update the `mockMovies` array.

## Building for Production

To create a production build:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
pnpm start
# or
yarn start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Unsplash](https://unsplash.com/) - For placeholder images
- [YouTube](https://www.youtube.com/) - For movie trailers
- [Netflix](https://www.netflix.com/) - For design inspiration 