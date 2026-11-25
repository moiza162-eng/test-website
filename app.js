const categories = ['All dishes', 'Starters', 'Soups', 'Mains', 'Noodles & Rice', 'Sides', 'Desserts', 'Drinks', 'Kids'];
const dishes = [
  {name:'Vegetable Spring Rolls', category:'Starters', price:5.50, diet:'Vegan', description:'Crispy rolls filled with seasonal vegetables.'},
  {name:'Chicken Teriyaki', category:'Mains', price:12.95, description:'Grilled chicken in a sweet teriyaki sauce, served with steamed rice and broccoli. Finished with sesame seeds and spring onions.', allergens:'Sesame, wheat, soy.'},
  {name:'Tofu Pad Thai', category:'Noodles & Rice', price:11.50, diet:'Vegan', description:'Stir-fried rice noodles with tofu, beansprouts and peanuts.', allergens:'Peanuts, soy.'},
  {name:'Vegetable Gyoza', category:'Starters', price:6.25, diet:'Vegetarian', description:'Steamed dumplings filled with vegetables and shiitake.'},
  {name:'Mango Sticky Rice', category:'Desserts', price:6.50, diet:'Vegan', description:'Sweet coconut sticky rice with ripe mango.'},
  {name:'Thai Green Vegetable Curry', category:'Mains', price:11.95, diet:'Vegan', description:'Seasonal vegetables in a fragrant green curry.'},
  {name:'Vegetable Fried Rice', category:'Noodles & Rice', price:8.95, diet:'Vegan', description:'Wok-fried rice with seasonal vegetables and spring onions.'}
];

const currency = new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP'});
const categoryList = document.querySelector('#categories');
const dishList = document.querySelector('#dishes');
const search = document.querySelector('#search');
const sort = document.querySelector('#sort');
const filters = [...document.querySelectorAll('fieldset input')];
const clear = document.querySelector('#clear');
const dialog = document.querySelector('#dish-dialog');
let category = categories[0];

for (const name of categories) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = name;
  button.setAttribute('aria-pressed', String(name === category));
  button.addEventListener('click', () => {
    category = name;
    for (const item of categoryList.children) {
      item.setAttribute('aria-pressed', String(item === button));
    }
    render();
  });
  categoryList.append(button);
}

function render() {
  const diets = filters.filter(input => input.checked).map(input => input.value);
  const query = search.value.trim().toLowerCase();
  const matching = dishes.filter(dish => (
    (category === categories[0] || dish.category === category) &&
    (!diets.length || diets.includes(dish.diet)) &&
    `${dish.name} ${dish.category} ${dish.description}`.toLowerCase().includes(query)
  ));
  if (sort.value === 'low') matching.sort((first, second) => first.price - second.price);
  if (sort.value === 'high') matching.sort((first, second) => second.price - first.price);
  clear.hidden = !diets.length;
  document.querySelector('#count').textContent = matching.length
    ? `Showing ${matching.length} ${matching.length === 1 ? 'dish' : 'dishes'}`
    : 'No dishes match this selection.';
  dishList.replaceChildren(...matching.map(dish => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'dish';
    button.innerHTML = `<strong>${dish.name}</strong><span>${dish.description}</span>
      <span class="price">${currency.format(dish.price)}</span>
      ${dish.diet ? `<span class="tag">${dish.diet}</span>` : ''}`;
    button.addEventListener('click', () => showDish(dish));
    return button;
  }));
}

function showDish(dish) {
  document.querySelector('#dish-detail').innerHTML = `<p class="eyebrow">${dish.category}</p>
    <h2 id="dish-title">${dish.name}</h2><p class="price">${currency.format(dish.price)}</p>
    <p>${dish.description}</p>${dish.diet ? `<p class="tag">${dish.diet}</p>` : ''}
    <h3>Allergens</h3>${dish.allergens ? `<p>${dish.allergens}</p>` : ''}
    <p>Allergen details are illustrative. Ask staff about ingredients and cross-contact before ordering.</p>`;
  dialog.showModal();
}

document.querySelector('#search-form').addEventListener('submit', event => event.preventDefault());
search.addEventListener('input', () => {
  if (category !== categories[0]) categoryList.firstElementChild.click();
  else render();
});
sort.addEventListener('change', render);
for (const filter of filters) filter.addEventListener('change', render);
clear.addEventListener('click', () => {
  for (const filter of filters) filter.checked = false;
  filters[0].focus();
  render();
});

const booking = document.querySelector('#booking');
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
booking.elements.date.min = localDate;
booking.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(booking);
  const date = new Date(`${fields.get('date')}T${fields.get('time')}`);
  const time = new Intl.DateTimeFormat('en-GB', {dateStyle:'long', timeStyle:'short'}).format(date);
  const guests = fields.get('guests');
  document.querySelector('#booking-status').textContent =
    `Preview only · ${guests} ${guests === '1' ? 'guest' : 'guests'} on ${time}. No reservation was made.`;
});
render();
