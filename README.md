# 🎓 StudySquad

StudySquad to nowoczesna aplikacja internetowa stworzona z myślą o studentach. Ułatwia organizację nauki, tworzenie grup badawczych oraz współdzielenie materiałów edukacyjnych. 

Projekt został zbudowany z naciskiem na wydajność i szybkość działania, wykorzystując nowoczesny ekosystem biblioteki React oraz infrastrukturę chmurową Firebase.

## 🛠️ Technologie (Tech Stack)

*   **Frontend:** React 18, Vite (jako bundler)
*   **Routing:** React Router v6
*   **Backend & Baza Danych:** Firebase (Firestore)
*   **Magazyn Plików:** Firebase Cloud Storage (przechowywanie materiałów)
*   **Autoryzacja:** Firebase Authentication
*   **Hosting:** Firebase Hosting

## 🚀 Główne funkcjonalności

*   **Zarządzanie Użytkownikami:** Rejestracja i logowanie studentów.
*   **Grupy Naukowe:** Możliwość tworzenia nowych grup, wyszukiwania istniejących i dołączania do nich.
*   **Współdzielenie Materiałów:** Wgrywanie i pobieranie plików (notatek, prezentacji) wewnątrz grup dzięki Firebase Storage.
*   **Aktualizacje na żywo:** Błyskawiczna synchronizacja danych między użytkownikami dzięki Firestore.

## 📁 Struktura Projektu

Główny kod aplikacji znajduje się w katalogu `src/`:

*   `assets/` - pliki statyczne (ikony, obrazki, grafiki).
*   `components/` - komponenty interfejsu (np. przyciski, karty grup, paski nawigacji).
*   `constants/` - globalne stałe, konfiguracje i linki.
*   `hooks/` - własne hooki (Custom Hooks), np. `useLocalStorage` do zarządzania pamięcią przeglądarki lub hooki do autoryzacji Firebase.
*   `utils/` - funkcje pomocnicze (np. formatowanie dat, parsowanie danych).
*   `App.jsx` - główny komponent aplikacji zawierający konfigurację ścieżek (routingu).
*   `main.jsx` - punkt wejścia aplikacji, podpinający Reacta do drzewa DOM.

Pliki w głównym katalogu (takie jak `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`) odpowiadają za konfigurację środowiska chmurowego, zabezpieczenia bazy danych oraz reguły dostępu do plików.

## Dostęp do aplikacji 🌐

[link](https://studysquad-bdb91.web.app/)
