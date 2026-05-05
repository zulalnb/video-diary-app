# Video Diary App

A mobile video journaling application built with React Native and Expo, focused on **performance-aware media handling** and **smooth interactive editing**.

The app allows users to import a video, extract a meaningful 5-second segment, and store it locally with metadata. While the core idea is simple, the main challenge addressed in this project is handling **large video files efficiently on mobile devices**, especially on Android.

---

## 🚀 Overview

The application provides a simple and focused workflow:

1. Select a video from the device
2. Interactively choose a 5-second segment using a custom scrubber
3. Add metadata (title & description)
4. Save and manage entries locally
5. Optionally export or share the processed video

---

## ⚡ Key Focus Areas

### 🎥 Media Handling with Expo SDK

The application leverages Expo’s media-related libraries to handle video workflows efficiently:

- **expo-image-picker**  
  Used to provide a seamless and native-like experience for selecting videos from the device library.

- **expo-video**  
  Powers video playback with a performant native player. It allows fine control over playback behavior, which is essential for implementing custom trimming and preview logic (e.g., looping a selected segment).

- **expo-video-thumbnails**  
  Generates preview images for each video entry. This improves list performance and UX by avoiding heavy video rendering in scrollable views.

- **expo-trim-video**  
  Used after the editing flow to generate the final trimmed video file based on the selected segment.  
  During the editing process, only a **preview of the selected segment** is played; the actual video file is trimmed **on submit** to avoid unnecessary processing.

- **expo-sharing**  
  Enables users to share processed video files directly from the app using the native share sheet.

- **expo-media-library**  
  Allows exporting and saving processed videos to the device gallery when needed.

---

### 🎥 Video Performance & Optimization

Handling large video files caused performance issues on Android during preview. To address this:

- **Conditional video compression** is applied using `react-native-compressor`
- Video playback avoids unnecessary seek operations during scrubbing
- UI updates are minimized to prevent frame drops
- Preview uses a processed video to ensure smoother interaction

---

### 🎚 Custom Scrubber (Reanimated + Gesture Handler)

A fully custom video scrubber was implemented using:

- `react-native-reanimated`
- `react-native-gesture-handler`

Key considerations:

- Smooth dragging without triggering expensive video seek operations on every frame
- Separation between **preview state** and **final selected segment**
- Use of a custom `useThrottle` hook to limit frequent updates during interaction
- Designed to remain responsive even alongside active video playback

---

### ⌨️ Keyboard Handling & Forms

- **react-native-keyboard-controller**  
  Used to provide smooth keyboard-aware scrolling and interaction, especially on screens combining media preview and form inputs.

- Ensures:
  - Inputs remain visible while typing
  - Smooth transitions without layout jumps
  - Better UX compared to default KeyboardAvoidingView behavior

---

### 📝 Form Management & Validation

- **react-hook-form**  
  Handles form state efficiently with minimal re-renders, which is important in screens where video playback is active.

- **zod**  
  Provides schema-based validation with full TypeScript type inference.

- Combined benefits:
  - Type-safe form data
  - Clear validation rules (title & description)
  - Better performance compared to fully controlled inputs

---

### 📦 Local-First Data Layer

- **Expo SQLite + Drizzle ORM** for type-safe local persistence
- Full CRUD operations for video entries
- Clear separation between:
  - database schema (`db/`)
  - validation schema (`validations/`)

---

### ⚙️ State & Preferences

- **Zustand** for lightweight global state management
- **AsyncStorage** for persistence
- Used to manage user preferences such as:
  - Haptic feedback toggle

---

### 📳 User Experience Enhancements

- **Haptic feedback (expo-haptics)** is used to enhance interactions:
  - Long press (multi-select activation)
  - Delete actions (single & bulk)

---

### 🎨 Styling Strategy (NativeWind)

The UI is built using **NativeWind**, bringing a utility-first styling approach to React Native.

- Consistent spacing, colors, and layout across the app
- Faster UI iteration with minimal custom styles
- Components accept `className` for flexible composition
- Styling kept lightweight to avoid unnecessary re-renders during video playback

## 🛠 Installation & Setup

```bash
# Install dependencies (use your preferred package manager)
npm install
# or
yarn install
# or
pnpm install

# Generate the database schema (IMPORTANT: do this before starting development)
npm run generate-schema

# Since the project has already been prebuilt, you can run it directly with:
npm run android
# or
npm run ios

```

## 📁 Project Structure

The project follows a modular structure with clear separation of concerns:

```
src/
├── app/                # Expo Router screens
├── components/         # Reusable UI components (video player, scrubber, inputs)
├── features/           # Feature-based modules (video flow, metadata, etc.)
├── db/                 # Database schema and queries (Drizzle ORM)
├── validations/        # Zod schemas for form validation
├── hooks/              # Custom hooks (e.g., useThrottle)
├── stores/             # Zustand state management
└── utils/              # Helper functions
```

---

## ⚠️ Challenges & Trade-offs

### 📱 Why Video Handling is Hard on Mobile (Especially Android)

Working with video on mobile devices introduces several constraints that are not obvious at first:

- **Memory limitations (Android OOM risk)**  
  Large video files can quickly exhaust available memory, especially when multiple operations (playback, seeking, thumbnail generation) happen simultaneously.

- **Expensive seek operations**  
  Frequent updates to `currentTime` during scrubbing can cause frame drops and janky UI due to decoding overhead.

- **UI thread vs native player sync**  
  Keeping UI interactions (dragging, gestures) in sync with native video playback requires careful coordination to avoid lag or desync.

- **Rendering cost in lists**  
  Displaying multiple videos in scrollable lists is expensive; even paused video components can impact performance.

---

### ⚖️ Trade-offs & Design Decisions

To balance performance and user experience, several trade-offs were made:

- **Throttled interaction instead of real-time seeking**  
  Scrubber updates are throttled using a custom hook to prevent excessive video seek operations.  
  → Improves performance but slightly reduces precision during dragging.

- **Preview based on processed video**  
  Instead of always using the original file, a processed version is used for smoother playback.  
  → Adds a preprocessing step but significantly improves UX.

- **Thumbnail-based list rendering**  
  Video thumbnails are used instead of rendering full video components in lists.  
  → Reduces rendering cost at the expense of losing live previews.

- **Local-first architecture**  
  All data is stored locally using SQLite.  
  → Fast and offline-friendly, but not synchronized across devices.

- **Selective use of native modules**  
  Video compression is handled via a native module (`react-native-compressor`).  
  → Improves performance but introduces limitations in Expo managed environments (requires prebuild).

---

### 🧠 Key Takeaway

The main challenge of this project was not building the UI, but **designing a system that keeps interactions smooth while working with inherently heavy media files**.

Achieving a responsive experience required carefully balancing:

- UI responsiveness
- native video performance
- and data processing constraints
