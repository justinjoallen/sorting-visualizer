let array = [];
const barsContainer = document.getElementById("bars-container");
const speedInput = document.getElementById("speed");
const sizeInput = document.getElementById("size");
const algorithmSelect = document.getElementById("algorithm");

function generateArray(size = sizeInput.value) {
  array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 300) + 20);
  }
  renderBars(array);
}

function renderBars(arr, highlighted = [], sorted = []) {
  barsContainer.innerHTML = "";
  arr.forEach((value, idx) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    if (highlighted.includes(idx)) bar.classList.add("compare");
    if (sorted.includes(idx)) bar.classList.add("sorted");
    barsContainer.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
  let arr = array.slice();
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      renderBars(arr, [j, j + 1]);
      await sleep(speedInput.value);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  renderBars(arr, [], arr.map((_, i) => i));
}

async function selectionSort() {
  let arr = array.slice();
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      renderBars(arr, [minIdx, j]);
      await sleep(speedInput.value);
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  renderBars(arr, [], arr.map((_, i) => i));
}

async function insertionSort() {
  let arr = array.slice();
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      renderBars(arr, [j, j + 1]);
      await sleep(speedInput.value);
    }
    arr[j + 1] = key;
  }
  renderBars(arr, [], arr.map((_, i) => i));
}

async function mergeSort(arr = array.slice(), start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(arr, start, mid);
  await mergeSort(arr, mid + 1, end);
  await merge(arr, start, mid, end);
  if (start === 0 && end === arr.length - 1) {
    renderBars(arr, [], arr.map((_, i) => i));
  }
}

async function merge(arr, start, mid, end) {
  let left = arr.slice(start, mid + 1);
  let right = arr.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  while (i < left.length && j < right.length) {
    renderBars(arr, [k]);
    await sleep(speedInput.value);
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}

async function quickSort(arr = array.slice(), low = 0, high = array.length - 1) {
  if (low < high) {
    let pi = await partition(arr, low, high);
    await quickSort(arr, low, pi - 1);
    await quickSort(arr, pi + 1, high);
  }
  if (low === 0 && high === arr.length - 1) {
    renderBars(arr, [], arr.map((_, i) => i));
  }
}

async function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    renderBars(arr, [j, high]);
    await sleep(speedInput.value);
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

async function startSort() {
  const algo = algorithmSelect.value;
  if (algo === "bubble") await bubbleSort();
  if (algo === "selection") await selectionSort();
  if (algo === "insertion") await insertionSort();
  if (algo === "merge") await mergeSort();
  if (algo === "quick") await quickSort();
}

sizeInput.addEventListener("input", () => generateArray(sizeInput.value));
generateArray();

