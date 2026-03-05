"use strict";

const ALGORITHMS = {
  1: { name: "Bubble Sort", method: "BubbleSort" },
  2: { name: "Selection Sort", method: "SelectionSort" },
  3: { name: "Insertion Sort", method: "InsertionSort" },
  4: { name: "Merge Sort", method: "MergeSort" },
  5: { name: "Quick Sort", method: "QuickSort" },
  6: { name: "Heap Sort (Advanced)", method: "HeapSort" },
  7: { name: "Shell Sort (Advanced)", method: "ShellSort" }
};

const updateRunDetails = () => {
  const algoValue = Number(document.querySelector(".algo-menu").value);
  const sizeValue = document.querySelector(".size-menu").value;
  const speedLabel = document.querySelector(".speed-menu").selectedOptions[0].text;

  document.querySelector(".stat-algo").innerText =
    ALGORITHMS[algoValue]?.name || "Not selected";
  document.querySelector(".stat-size").innerText = sizeValue;
  document.querySelector(".stat-speed").innerText = speedLabel;
};

const setControlsDisabled = (disabled) => {
  document.querySelectorAll("select, .start, #random").forEach((node) => {
    if (node.tagName === "SELECT") {
      node.disabled = disabled;
      return;
    }
    node.style.pointerEvents = disabled ? "none" : "auto";
    node.style.opacity = disabled ? "0.6" : "1";
  });
};

const start = async () => {
  const algoValue = Number(document.querySelector(".algo-menu").value);
  let speedValue = Number(document.querySelector(".speed-menu").value);

  if (speedValue === 0) speedValue = 1;

  if (algoValue === 0 || !ALGORITHMS[algoValue]) {
    alert("Please choose an algorithm.");
    return;
  }

  updateRunDetails();
  document.querySelector(".stat-status").innerText = "Sorting...";
  setControlsDisabled(true);

  try {
    const algorithm = new sortAlgorithms(speedValue);
    await algorithm[ALGORITHMS[algoValue].method]();
    document.querySelector(".stat-status").innerText = "Completed";
  } finally {
    setControlsDisabled(false);
  }
};

const RenderScreen = async () => {
  await RenderList();
  updateRunDetails();
  document.querySelector(".stat-status").innerText = "Ready";
};

const RenderList = async () => {
  const sizeValue = Number(document.querySelector(".size-menu").value);
  await clearScreen();

  const list = await randomList(sizeValue);
  const arrayNode = document.querySelector(".array");
  for (const element of list) {
    const node = document.createElement("div");
    node.className = "cell";
    node.setAttribute("value", String(element));
    node.style.height = `${3.8 * element}px`;
    arrayNode.appendChild(node);
  }
};

const randomList = async (length) => {
  const list = [];
  const lowerBound = 1;
  const upperBound = 100;

  for (let counter = 0; counter < length; ++counter) {
    const randomNumber = Math.floor(
      Math.random() * (upperBound - lowerBound + 1) + lowerBound
    );
    list.push(randomNumber);
  }
  return list;
};

const clearScreen = async () => {
  document.querySelector(".array").innerHTML = "";
};

const response = () => {
  const navbar = document.querySelector(".navbar");
  if (navbar.className === "navbar") {
    navbar.className += " responsive";
  } else {
    navbar.className = "navbar";
  }
};

document.querySelector(".icon").addEventListener("click", response);
document.querySelector(".start").addEventListener("click", start);
document.querySelector(".size-menu").addEventListener("change", RenderScreen);
document.querySelector(".algo-menu").addEventListener("change", updateRunDetails);
document.querySelector(".speed-menu").addEventListener("change", updateRunDetails);
window.onload = RenderScreen;
