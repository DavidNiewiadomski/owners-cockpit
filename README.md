
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c590e3e6-e6c7-4d88-bddd-3e106c2d4cfe

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c590e3e6-e6c7-4d88-bddd-3e106c2d4cfe) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Three.js Integration

The landing page uses React Three Fiber for 3D particle effects and animations.

### Dependencies

The following packages are required for the 3D background:
- `@react-three/fiber@^8.18.0` - React renderer for Three.js
- `@react-three/drei@^9.122.0` - Helper components for React Three Fiber  
- `three@^0.160.0` - Three.js library

### Customizing the Hero Background

To replace or modify the particle background in `src/components/ParticleHero.tsx`:

1. **Change particle count**: Modify the `count` prop in the `<Stars>` component
2. **Adjust animation speed**: Change the rotation speed in `AnimatedStars` component
3. **Replace with custom geometry**: Modify the `InteractiveBackground` component
4. **Add new effects**: Use additional drei components like `<Sparkles>` or `<Cloud>`

### Performance Notes

- The particle system is optimized for 60fps on modern devices
- Particle count automatically scales based on screen size
- Use `Canvas` frameloop controls for better performance on lower-end devices

### Fallback for Unsupported Devices

If Three.js is not supported, the component gracefully falls back to the gradient background without particles.

## Landing Page Features

### CTA Navigation
- **Get Started**: Routes to `/app` (project selector)
- **Learn More**: Smooth scrolls to features section
- **Down Arrow**: Triggers same smooth scroll behavior

### Accessibility
- All buttons meet 44px minimum touch target size
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Responsive design tested down to 375px width

### Testing

Run the test suite:
```bash
# Unit tests
npm run test

# E2E tests  
npm run cypress:open

# Visual regression tests
npm run test:visual
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c590e3e6-e6c7-4d88-bddd-3e106c2d4cfe) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
