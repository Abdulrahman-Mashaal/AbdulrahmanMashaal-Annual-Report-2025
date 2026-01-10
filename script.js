document.addEventListener("DOMContentLoaded", () => {
  // Theme Colors
  const colors = {
    cyan: "#38bdf8",
    purple: "#818cf8",
    text: "#94a3b8",
    card: "rgba(30, 41, 59, 0.7)",
    grid: "rgba(255, 255, 255, 0.1)",
  };

  // Chart Defaults
  if (typeof Chart !== "undefined") {
    Chart.defaults.font.family = "'Space Grotesk', sans-serif";
    Chart.defaults.color = colors.text;
  }

  // Helper to get responsive chart options
  const getChartOptions = (type) => {
    const isMobile = window.innerWidth < 1024;
    const isSmallMobile = window.innerWidth < 576;

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isMobile ? "bottom" : "right",
          labels: {
            padding: isMobile ? 10 : 20,
            boxWidth: isMobile ? 12 : 40,
            font: {
              size: isSmallMobile ? 11 : 13,
              family: "'Space Grotesk', sans-serif",
            },
            color: colors.text,
          },
        },
      },
      layout: {
        padding: {
          bottom: isMobile ? 10 : 0,
          right: isMobile ? 0 : 20,
        },
      },
    };

    if (type === "bar") {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: colors.grid },
            ticks: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: {
              font: {
                size: isSmallMobile ? 10 : 12,
                family: "'Space Grotesk', sans-serif",
              },
              color: colors.text,
              maxRotation: isSmallMobile ? 90 : 45,
              minRotation: isSmallMobile ? 45 : 0,
            },
          },
        },
        plugins: {
          legend: { display: false },
        },
      };
    }

    return commonOptions;
  };

  // Project Distribution Chart
  const projectChartEl = document.getElementById("projectChart");
  let projectChart;
  if (projectChartEl) {
    const projectCtx = projectChartEl.getContext("2d");
    projectChart = new Chart(projectCtx, {
      type: "doughnut",
      data: {
        labels: ["ANMA", "Tamam", "NDF", "ECM", "Altariq", "Others"],
        datasets: [
          {
            data: [29.0, 17.5, 16.1, 11.5, 6.5, 19.4],
            backgroundColor: [
              "#38bdf8", // Cyan
              "#818cf8", // Purple
              "#c084fc", // Violet
              "#22d3ee", // Cyan-light
              "#6366f1", // Indigo
              "#475569", // Slate
            ],
            borderWidth: 0,
          },
        ],
      },
      options: getChartOptions("doughnut"),
    });
  }

  // Work Type Balance Chart
  const typeChartEl = document.getElementById("typeChart");
  let typeChart;
  if (typeChartEl) {
    const typeCtx = typeChartEl.getContext("2d");
    typeChart = new Chart(typeCtx, {
      type: "pie",
      data: {
        labels: [
          "New Features",
          "Bug Fixes",
          "Refactoring",
          "Enhancements",
          "Other",
        ],
        datasets: [
          {
            data: [40.6, 15.7, 12.4, 3.7, 27.6],
            backgroundColor: [
              "#10b981", // Emerald
              "#f43f5e", // Rose
              "#f59e0b", // Amber
              "#3b82f6", // Blue
              "#64748b", // Slate
            ],
            borderWidth: 0,
          },
        ],
      },
      options: getChartOptions("pie"),
    });
  }

  // Engineering Domain Complexity Chart
  const domainChartEl = document.getElementById("domainChart");
  let domainChart;
  if (domainChartEl) {
    const domainCtx = domainChartEl.getContext("2d");
    domainChart = new Chart(domainCtx, {
      type: "bar",
      data: {
        labels: [
          "State & Arch",
          "UI Components",
          "Payment",
          "Auth & Security",
          "Data Mgmt",
          "Performance",
          "Doc Mgmt",
        ],
        datasets: [
          {
            label: "Complexity Level",
            data: [90, 75, 90, 85, 60, 85, 70],
            backgroundColor: colors.purple,
            borderRadius: 4,
          },
        ],
      },
      options: getChartOptions("bar"),
    });
  }

  // Handle Window Resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof Chart !== "undefined") {
        if (projectChartEl && projectChart) {
          projectChart.options = getChartOptions("doughnut");
          projectChart.update();
        }

        if (typeChartEl && typeChart) {
          typeChart.options = getChartOptions("pie");
          typeChart.update();
        }

        if (domainChartEl && domainChart) {
          domainChart.options = getChartOptions("bar");
          domainChart.update();
        }
      }
    }, 200);
  });

  // Intersection Observer for Scroll Animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // If this is a stat card or metric item with a numeric value, animate it
          if (
            entry.target.classList.contains("stat-card") ||
            entry.target.classList.contains("metric-item")
          ) {
            const valueDisplay =
              entry.target.querySelector(".stat-value") ||
              entry.target.querySelector("h4");
            if (valueDisplay) {
              animateCountUp(valueDisplay);
            }
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  // Function to animate count up for any element
  function animateCountUp(element) {
    const targetValueStr = element.innerText;
    const hasSuffix =
      targetValueStr.includes("%") || targetValueStr.includes("+");
    const numericPart = targetValueStr.replace(/[^0-9.]/g, "");

    // Skip if not a number or already animated
    if (!numericPart || element.dataset.animated === "true") return;

    const targetValue = parseFloat(numericPart);
    const suffix = hasSuffix ? targetValueStr.replace(/[0-9.]/g, "") : "";

    let startValue = 0;
    let duration = 2000;
    let decimalPlaces = numericPart.includes(".")
      ? numericPart.split(".")[1].length
      : 0;

    // Mark as animated
    element.dataset.animated = "true";

    let counter = setInterval(function () {
      startValue += targetValue / (duration / 20); // Increment chunk
      if (startValue >= targetValue) {
        startValue = targetValue;
        clearInterval(counter);
      }
      element.innerText = startValue.toFixed(decimalPlaces) + suffix;
    }, 20);
  }

  // Observe all elements that need animations
  document
    .querySelectorAll(
      ".animate-on-scroll, .glass-card, .stat-card, .achievement-card, .metric-item"
    )
    .forEach((el) => {
      observer.observe(el);
    });

  // Typewriter Effect
  const subtitleElement = document.getElementById("hero-subtitle");
  const phrases = ["Problem Solver", "Frontend Engineer", "UI Specialist"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      subtitleElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      subtitleElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before new word
    }

    setTimeout(typeWriter, typeSpeed);
  }

  // Start typewriter
  if (subtitleElement) setTimeout(typeWriter, 1000);

  // Add staggered delay to achievement cards for a cascade effect
  document.querySelectorAll(".achievement-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Add staggered delay to metric items
  document.querySelectorAll(".metric-item").forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });

  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navbar = document.querySelector(".navbar");
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Handle dropdown menus on mobile
  dropdownToggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", (e) => {
      e.preventDefault();

      // Check if we're on mobile view
      if (window.innerWidth <= 768) {
        const parent = toggle.closest(".nav-dropdown");
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";

        // Close all other dropdowns first
        document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
          if (dropdown !== parent) {
            dropdown.classList.remove("active");
            const otherToggle = dropdown.querySelector(".dropdown-toggle");
            if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
          }
        });

        // Toggle current dropdown
        parent.classList.toggle("active");
        toggle.setAttribute("aria-expanded", !isExpanded);
      }
    });
  });

  // Click outside to close menu and dropdowns
  document.addEventListener("click", (e) => {
    // Close Mobile Menu if clicked outside
    if (navMenu && navMenu.classList.contains("active")) {
      const clickedInsideMenu = navMenu.contains(e.target);
      const clickedToggle = navToggle && navToggle.contains(e.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navMenu.classList.remove("active");
        if (navToggle) {
          navToggle.classList.remove("active");
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    }

    // Close Dropdowns if clicked outside
    if (!e.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown.active").forEach((dropdown) => {
        dropdown.classList.remove("active");
        const toggle = dropdown.querySelector(".dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Smooth scroll and active link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          // Close mobile menu
          if (navMenu) navMenu.classList.remove("active");
          if (navToggle) navToggle.classList.remove("active");
        }
      }
    });
  });

  // Navbar scroll effect and active section highlighting
  window.addEventListener("scroll", () => {
    // Add scrolled class to navbar
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Highlight active section in navbar
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navLink) navLink.classList.add("active");
      } else {
        if (navLink) navLink.classList.remove("active");
      }
    });
  });

  // Back to Top Button
  const backToTopBtn = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("is-visible");
    } else {
      backToTopBtn.classList.remove("is-visible");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // File Download Handler
  const downloadButtons = document.querySelectorAll(".download-btn");

  if (downloadButtons.length > 0) {
    downloadButtons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const fileType = this.dataset.type;
        const fileMap = {
          pdf: {
            url: "report.pdf",
            name: "Report.pdf",
          },
          md: {
            url: "report.md",
            name: "Abdulrahman-Mashaal-Report-2025.md",
          },
        };

        const file = fileMap[fileType];
        if (file) {
          const link = document.createElement("a");
          link.href = file.url;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    });
  }
});
