const html = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const mobileThemeToggle = document.querySelector("#mobileThemeToggle");
const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mobileMenu = document.querySelector("#mobileMenu");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

function applyTheme(theme) {
  html.classList.toggle("dark", theme === "dark");
  localStorage.setItem("apriprogram-theme", theme);
}

function toggleTheme() {
  const nextTheme = html.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
}

const savedTheme = localStorage.getItem("apriprogram-theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (preferredDark ? "dark" : "light"));

themeToggle?.addEventListener("click", toggleTheme);
mobileThemeToggle?.addEventListener("click", toggleTheme);

mobileMenuButton?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

document.querySelectorAll("[data-nav-link]").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu?.classList.add("hidden");
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isActive = item.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("active");
      faq.querySelector("button").setAttribute("aria-expanded", "false");
    });

    if (!isActive) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector("button[type='submit']");
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  submitButton.disabled = true;
  submitButton.textContent = "Mengirim...";
  formStatus.textContent = "";
  formStatus.className = "text-sm";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Pesan gagal dikirim.");
    }

    contactForm.reset();
    formStatus.textContent = result.message;
    formStatus.classList.add("text-emerald-600", "dark:text-emerald-400");
  } catch (error) {
    formStatus.textContent = error.message;
    formStatus.classList.add("text-red-600", "dark:text-red-400");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Kirim Pesan";
  }
});
