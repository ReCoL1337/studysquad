<div align="center">
  <h1>🎓 StudySquad</h1>
  <p>
    <b>Nowoczesna platforma ułatwiająca studentom i uczniom wspólną naukę, organizację materiałów oraz zarządzanie projektami w grupach.</b>
  </p>
  
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
</div>

---

## 📖 O projekcie

**StudySquad** to aplikacja fullstackowa stworzona w celu integracji środowiska studenckiego. Rozwiązuje problem rozproszonych notatek, braku komunikacji w grupach projektowych i chaosu organizacyjnego. Dzięki intuicyjnemu interfejsowi użytkownicy mogą skupić się na tym, co najważniejsze – na efektywnej nauce.

### ✨ Główne założenia (Features)
* 🤝 **Grupy naukowe:** Tworzenie i dołączanie do dedykowanych zespołów zadaniowych.
* 📁 **Zarządzanie materiałami:** Łatwe współdzielenie plików i notatek.
* 📅 **Organizacja czasu:** Śledzenie terminów oddania projektów i kolokwiów.
* ⚙️ **Skalowalna architektura:** Projekt oparty na solidnych fundamentach i dobrych praktykach Reacta (Custom Hooks, reużywalne komponenty).

---

## 🚀 Technologie

Projekt wykorzystuje nowoczesny stos technologiczny (MERN):

**Frontend:**
* [React 18](https://reactjs.org/) (inicjalizacja przez [Vite](https://vitejs.dev/))
* JavaScript (ES6+)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) (z [Mongoose](https://mongoosejs.com/))

---

## 📂 Struktura folderów (Frontend)

Zastosowano modularną architekturę ułatwiającą rozwój aplikacji:

```text
src/
├── components/   # Reużywalne elementy UI (np. Loader)
├── hooks/        # Własne hooki Reacta (np. useLocalStorage)
├── utils/        # Funkcje pomocnicze i formatujące dane
├── constants/    # Globalne zmienne i konfiguracja (np. routing)
├── App.jsx       # Główny komponent aplikacji
└── main.jsx      # Punkt wejścia (entry point) aplikacji
