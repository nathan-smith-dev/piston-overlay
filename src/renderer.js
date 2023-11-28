/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import './index.css';

const generateElement = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
};

const generatePistonRowHtml = (pistonNumber, startingStroke) => {
  return `
    <div class="row">
      <div class="cylinder-identifier">${pistonNumber}</div>
      <div class="piston-container">
        <div class="piston">
          ${chooseStroke(startingStroke)}
        </div>
      </div>
    </div>
  `;
};

const generatePistonRows = (numberOfPistons, firingOrder) => {
  let strBuilder = '';
  for (let i = 0; i < numberOfPistons; i++) {
    strBuilder += generatePistonRowHtml(firingOrder[i], numberOfPistons - i);
  }
  return strBuilder;
};

const shiftArray = (arr, target) => {
  return arr.concat(arr.splice(0, target));
};

const chooseStroke = (index) => {
  const strokes = [
    `<div class="power">P</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="intake">I</div>`,
    `<div class="compression">C</div>`,
  ];
  const shiftedStrokes = shiftArray(strokes, index);

  let strBuilder = '';
  for (let i = 0; i < 4; i++) {
    strBuilder += shiftedStrokes[i];
  }

  return strBuilder;
};

const generateFiringOrderInput = () => {
  return generateElement(`<input
              class="cyl-input"
              pattern="\d{1}"
              type="number"
              maxlength="1"
              name="firing-order-1"
            />`);
};

const cylinderCount = document.querySelector('#cylinder-count');
const form = document.querySelector('#cyl-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const row = document.querySelector('.container');
  let child = row.firstElementChild;
  console.log(child.id);
  while (child && child.id !== 'cyl-form-container') {
    row.removeChild(child);
    child = row.firstElementChild;
  }

  const cylinderCountNum = +cylinderCount.value;
  const firingOrder = [];
  document
    .querySelectorAll('.cyl-input')
    .forEach((el) => firingOrder.push(+el.value));
  const pistonHtml = generatePistonRows(cylinderCountNum, firingOrder);
  const el = generateElement(pistonHtml);
  row.prepend(el);
});

cylinderCount.addEventListener('change', (event) => {
  const firingOrder = document.querySelector('.firing-order-inputs');
  let child = firingOrder.lastElementChild;
  while (child) {
    firingOrder.removeChild(child);
    child = firingOrder.lastElementChild;
  }

  const cylinderCountNum = +cylinderCount.value;
  for (let i = 0; i < cylinderCountNum; i++) {
    firingOrder.append(generateFiringOrderInput());
  }
});

cylinderCount.dispatchEvent(new Event('change'));

const opacitySelector = document.querySelector('#opacity');
opacitySelector.addEventListener('change', (event) => {
  window.electronAPI.setOpacity(opacitySelector.value);
});
