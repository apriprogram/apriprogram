    <%- include('components/ui-scripts') %>

    // Dark mode initialization
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.remove('dark');
    }
    
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          fontFamily: { sans: ['Poppins', 'sans-serif'] },
          colors: {
            brand: { 
              blue: "#3b82f6",     // Primary blue (buttons, toggles)
              dark: "#14151A",     // Main background
              darker: "#0D0E12",   // Sidebar background
              card: "#1C1E26",     // Cards & active states
              border: "#2A2B36",   // Borders
              input: "#14151A"     // Input background
            }
          }
        }
      }
    };
