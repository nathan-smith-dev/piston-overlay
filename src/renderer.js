import './index.css';

const strokes = {
  3: [
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
  ],
  4: [
    `<div class="power">P</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="intake">I</div>`,
    `<div class="compression">C</div>`,
  ],
  5: [
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
  ],
  6: [
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
  ],
  8: [
    `<div class="power">P</div>`,
    `<div class="power">P</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="exhaust">E</div>`,
    `<div class="intake">I</div>`,
    `<div class="intake">I</div>`,
    `<div class="compression">C</div>`,
    `<div class="compression">C</div>`,
  ],
};

const generateElement = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content;
};

const generatePistonRowHtml = (
  pistonNumber,
  startingStroke,
  pistonCount,
  isSync
) => {
  return `
    <div class="row" style="height:${(1 / pistonCount) * 100}%">
      <div class="cylinder-identifier ${
        isSync ? 'sync-cyl' : ''
      }">${pistonNumber}</div>
      <div class="piston-container">
        <div class="piston">
          ${chooseStroke(startingStroke, pistonCount)}
        </div>
      </div>
    </div>
  `;
};

const generatePistonRows = (numberOfPistons, firingOrder) => {
  let strBuilder = '';
  for (let i = 0; i < numberOfPistons; i++) {
    strBuilder += generatePistonRowHtml(
      firingOrder[i],
      (strokes[numberOfPistons].length / numberOfPistons) * i,
      numberOfPistons,
      i == 0
    );
  }
  return strBuilder;
};

const shiftArray = (arr, target) => {
  const arrCopy = [...arr];
  const sliced = arrCopy.splice(arrCopy.length - target, target);
  return sliced.concat(arrCopy);
};

const shiftArrayBackwards = (arr, target) => {
  const arrCopy = [...arr];
  const sliced = arrCopy.splice(0, target);
  return arrCopy.concat(sliced);
};

const chooseStroke = (index, numberOfPistons) => {
  const shiftedStrokes = shiftArray(strokes[numberOfPistons], index);

  let strBuilder = '';
  for (let i = 0; i < shiftedStrokes.length; i++) {
    strBuilder += shiftedStrokes[i];
  }

  return strBuilder;
};

const generateFiringOrderInput = (defaultValue) => {
  return generateElement(`<input
              class="cyl-input cyl-input-format"
              pattern="\d{1}"
              type="number"
              maxlength="1"
              name="firing-order-1"
              ${defaultValue ? `value="${defaultValue}"` : ''}
            />`);
};

const cylinderCount = document.querySelector('#cylinder-count');
const form = document.querySelector('.cyl-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const row = document.querySelector('.container');
  let child = row.firstElementChild;
  while (child && child.id !== 'cyl-form-container') {
    row.removeChild(child);
    child = row.firstElementChild;
  }

  const cylinderCountNum = +cylinderCount.value;
  const firingOrder = [];
  document
    .querySelectorAll('.cyl-input')
    .forEach((el) => firingOrder.push(+el.value));
  const syncCylinder = document.querySelector('#sync-cyl');
  const shiftedFiringOrder = shiftArrayBackwards(
    firingOrder,
    firingOrder.indexOf(+syncCylinder.value)
  );
  const pistonHtml = generatePistonRows(cylinderCountNum, shiftedFiringOrder);
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

cylinderCount.addEventListener('load', (event) => {
  const firingOrder = document.querySelector('.firing-order-inputs');
  let child = firingOrder.lastElementChild;
  while (child) {
    firingOrder.removeChild(child);
    child = firingOrder.lastElementChild;
  }

  const cylinderCountNum = +cylinderCount.value;
  for (let i = 0; i < cylinderCountNum; i++) {
    // firingOrder.append(generateFiringOrderInput(cylinderCountNum - i));
    firingOrder.append(generateFiringOrderInput());
  }
});

cylinderCount.dispatchEvent(new Event('load'));

const opacitySelector = document.querySelector('#opacity');
opacitySelector.addEventListener('change', (event) => {
  window.electronAPI.setOpacity(opacitySelector.value);
});

const formGroups = document.querySelectorAll('.form-group');
const formHideSelector = document.querySelector('.minimize-btn');
formHideSelector.addEventListener('click', (event) => {
  if (formHideSelector.classList.contains('btn-show')) {
    hideForm();
  } else {
    showForm();
  }
});

const hideForm = () => {
  formGroups.forEach((div) => div.classList.add('hidden'));
  formHideSelector.classList.add('btn-hide');
  formHideSelector.classList.remove('btn-show');
  form.classList.remove('cyl-form-maximized');
  form.classList.add('cyl-form-minimized');
};

const showForm = () => {
  formHideSelector.classList.add('btn-show');
  formGroups.forEach((div) => div.classList.remove('hidden'));
  formHideSelector.classList.remove('btn-hide');
  form.classList.add('cyl-form-maximized');
  form.classList.remove('cyl-form-minimized');
};

window.electronAPI.onWindowResize((value) => {
  const width = value[0];
  if (width < 850) {
    hideForm();
  } else if (width > 850) {
    showForm();
  }
});
