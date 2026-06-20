# StapuBox OTP Authentication

A React Native OTP authentication application built as part of the StapuBox Mobile Developer Assignment.

## Features

### Authentication Flow

* Mobile number login
* OTP generation via API
* OTP verification
* Auto-submit on OTP completion
* Invalid OTP handling
* Success screen after verification

### OTP Experience

* 4-digit OTP input
* Automatic focus transition
* Backspace navigation support
* Resend OTP functionality
* 60-second resend cooldown timer

### Form Validation

* Mobile number validation using Zod
* React Hook Form integration
* Error handling and user feedback

### Technical Features

* Expo Router based navigation
* NativeWind for styling
* Axios API client
* Environment-based configuration
* TypeScript support
* Graceful fallback for SMS auto-read

## Tech Stack

* React Native
* Expo
* Expo Router
* TypeScript
* NativeWind
* React Hook Form
* Zod
* Axios

## Project Structure

```text
src
├── app
│   ├── index.tsx
│   ├── verify-otp.tsx
│   ├── success.tsx
│   └── _layout.tsx
├── api
│   ├── client.ts
│   └── auth.api.ts
├── constants
│   └── colors.ts
├── hooks
│   └── useSmsRetriever.ts
└── types
    └── auth.ts
```

## Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE_URL=https://stapubox.com/trial
EXPO_PUBLIC_API_TOKEN=YOUR_API_TOKEN
```

## Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Run Android:

```bash
npx expo run:android
```

## API Endpoints Used

### Send OTP

```http
POST /sendOtp
```

### Verify OTP

```http
POST /verifyOtp
```

### Resend OTP

```http
POST /resendOtp
```

## Assumptions

* OTP length is 4 digits.
* Mobile numbers are validated before API submission.
* OTP is automatically submitted after entering all digits.
* Resend OTP is restricted by a 60-second cooldown timer.

## SMS Auto Read

SMS Retriever integration was explored and implemented with graceful fallback support.

Automatic SMS retrieval depends on:

* Native Android build configuration
* Device compatibility
* Backend SMS format containing the application hash

If SMS auto-read is unavailable, users can manually enter the OTP without impacting the authentication flow.

## Build APK

```bash
eas build --platform android
```

## Future Improvements

* Complete SMS Retriever integration
* Biometric authentication
* Secure token persistence
* Unit and integration tests
* Analytics and monitoring

## Author

Syed Mustafa Ali
