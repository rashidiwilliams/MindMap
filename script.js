// Persistent Data Management
// Save data to backend
async function saveData(section, content) {
  const response = await fetch(
    "https://superlative-croissant-1df1c7.netlify.app//save",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section,
        date: new Date().toLocaleDateString(),
        content,
      }),
    }
  );
  return response.json();
}

// Fetch data from backend
async function loadData() {
  const response = await fetch(
    "https://superlative-croissant-1df1c7.netlify.app//entries"
  );
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".slider-buttons button");
  const contents = document.querySelectorAll(".slider-content");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.getAttribute("data-section");

      // Toggle active class
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      contents.forEach((content) => {
        content.classList.toggle("active", content.id === `${section}Section`);
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    "journal",
    "codingLog",
    "tradingLog",
    "taskList",
    "projects",
  ];
  const data = loadData("dashboardData");

  // Initialize elements for each section
  sections.forEach((section) => {
    const input = document.getElementById(`${section}Input`);
    const addButton = document.getElementById(
      `add${section.charAt(0).toUpperCase() + section.slice(1)}Entry`
    );
    const entries = document.getElementById(`${section}Entries`);

    // Load saved entries
    entries.innerHTML = data[`${section}Entries`] || "";

    // Add entry functionality
    addButton.addEventListener("click", () => {
      const entryLines = input.value
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");
      const entry = `<div>${new Date().toLocaleDateString()}: ${entryLines}</div>`;
      entries.innerHTML += entry;
      input.value = "";
      data[`${section}Entries`] = entries.innerHTML;
      saveData("dashboardData", data);
    });
  });

  const assetInput = document.getElementById("assetsInput");
  const assetValue = document.getElementById("assetsValue");

  const liabilityInput = document.getElementById("liabilityInput");
  const liabilityValue = document.getElementById("liabilityValue");

  const portfolioWorthInput = document.getElementById("portfolioWorthInput");
  const portfolioWorthValue = document.getElementById("portfolioWorthValue");

  const variableChangeInput = document.getElementById("variableChangeInput");
  const variableChangeValue = document.getElementById("variableChangeValue");

  const withdrawalsInput = document.getElementById("withdrawalsInput");
  const withdrawalsValue = document.getElementById("withdrawalsValue");

  const goals = [
    {
      input: document.getElementById("goal1Input"),
      value: document.getElementById("goal1Value"),
      progress: document.getElementById("goal1Progress"),
      max: 1000,
    },
    {
      input: document.getElementById("goal2Input"),
      value: document.getElementById("goal2Value"),
      progress: document.getElementById("goal2Progress"),
      max: 5000,
    },
    {
      input: document.getElementById("goal3Input"),
      value: document.getElementById("goal3Value"),
      progress: document.getElementById("goal3Progress"),
      max: 10000,
    },
  ];

  // Load saved data for widgets and goals
  assetValue.textContent = formatCurrency(data.assetValue || 0);
  liabilityValue.textContent = formatCurrency(data.liabilityValue || 0);
  portfolioWorthValue.textContent = formatCurrency(
    data.portfolioWorthValue || 0
  );
  variableChangeValue.textContent = formatCurrency(
    data.variableChangeValue || 0
  );
  withdrawalsValue.textContent = formatCurrency(data.withdrawalsValue || 0);
  goals.forEach((goal, i) => {
    const savedValue = data[`goal${i + 1}`] || 0;
    goal.value.textContent = `${formatCurrency(savedValue)} / ${formatCurrency(
      goal.max
    )}`;
    goal.progress.value = savedValue;
  });

  // Update widget values
  const updateWidget = (input, displayKey, displayElement) => {
    input.addEventListener("input", () => {
      const value = parseFloat(input.value) || 0;
      displayElement.textContent = formatCurrency(value);
      data[displayKey] = value;
      saveData("dashboardData", data);
    });
  };

  updateWidget(assetInput, "assetValue", assetValue);
  updateWidget(liabilityInput, "liabilityValue", liabilityValue);
  updateWidget(portfolioWorthInput, "portfolioWorthValue", portfolioWorthValue);
  updateWidget(variableChangeInput, "variableChangeValue", variableChangeValue);
  updateWidget(withdrawalsInput, "withdrawalsValue", withdrawalsValue);

  // Update goal progress
  goals.forEach((goal, i) => {
    goal.input.addEventListener("input", () => {
      const value = parseFloat(goal.input.value) || 0;
      goal.value.textContent = `${formatCurrency(value)} / ${formatCurrency(
        goal.max
      )}`;
      goal.progress.value = value;
      data[`goal${i + 1}`] = value;
      saveData("dashboardData", data);
    });
  });

  // Google Sheets button
  document.getElementById("openSheet").addEventListener("click", () => {
    window.open("https://docs.google.com/spreadsheets", "_blank");
  });

  // Helper function to format currency
  function formatCurrency(value) {
    return `$${value.toLocaleString()}`;
  }
});
