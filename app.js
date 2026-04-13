// LOAD DATA
let bookings = JSON.parse(localStorage.getItem('bookings')) || {};

// SAVE LOCAL
function saveBookings(){
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

// RENDER TABLE STATUS
function renderTables(){

  document.querySelectorAll('.table').forEach(table => {

    const id = table.dataset.id;

    table.classList.remove('booked');

    const oldNumber = table.querySelector('.guest-number');
    if(oldNumber) oldNumber.remove();

    if(bookings[id]){

      table.classList.add('booked');

      const span = document.createElement('span');
      span.className = 'guest-number';
      span.textContent = bookings[id].guests;

      span.style.position = "absolute";
      span.style.bottom = "2px";
      span.style.right = "4px";
      span.style.fontSize = "12px";
      span.style.fontWeight = "bold";
      span.style.background = "white";
      span.style.padding = "2px 5px";
      span.style.borderRadius = "4px";

      table.appendChild(span);
    }

  });

  updateTotalGuests();
}

// TOTAL GUESTS
function updateTotalGuests(){

  let total = 0;

  Object.values(bookings).forEach(b => {
    total += b.guests || 0;
  });

  document.getElementById('total-guests-display').textContent =
    `Tổng số khách: ${total}`;
}


// OPEN FORM
document.querySelectorAll('.table').forEach(table => {

  table.addEventListener('click', () => {

    const id = table.dataset.id;

    document.getElementById('form-table-id').textContent = id;

    const info = bookings[id] || {};

    document.getElementById('name').value = info.name || '';
    document.getElementById('phone').value = info.phone || '';
    document.getElementById('email').value = info.email || '';
    document.getElementById('guests').value = info.guests || 1;

    document.getElementById('booking-form').classList.remove('hidden');

  });

});


// SAVE BOOKING
document.getElementById('save').addEventListener('click', () => {

  const id = document.getElementById('form-table-id').textContent;

  bookings[id] = {

    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    guests: parseInt(document.getElementById('guests').value) || 1

  };

  saveBookings();

  renderTables();

  document.getElementById('booking-form').classList.add('hidden');

});


// DELETE BOOKING
document.getElementById('delete').addEventListener('click', () => {

  const id = document.getElementById('form-table-id').textContent;

  delete bookings[id];

  saveBookings();

  renderTables();

  document.getElementById('booking-form').classList.add('hidden');

});


// CLOSE FORM
document.getElementById('cancel').addEventListener('click', () => {

  document.getElementById('booking-form').classList.add('hidden');

});


// DRAG TABLE
interact('.table').draggable({

  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent'
    })
  ],

  listeners: {

    move(event){

      const target = event.target;

      let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

    },

    end(){

      savePositions();

    }

  }

});


// SAVE TABLE POSITION
function savePositions(){

  const positions = {};

  document.querySelectorAll('.table').forEach(table => {

    const id = table.dataset.id;

    positions[id] = {

      x: table.getAttribute('data-x'),
      y: table.getAttribute('data-y')

    };

  });

  localStorage.setItem('tablePositions', JSON.stringify(positions));

}


// LOAD TABLE POSITION
function loadPositions(){

  const positions =
    JSON.parse(localStorage.getItem('tablePositions')) || {};

  document.querySelectorAll('.table').forEach(table => {

    const id = table.dataset.id;

    if(positions[id]){

      const x = positions[id].x;
      const y = positions[id].y;

      table.style.transform = `translate(${x}px, ${y}px)`;

      table.setAttribute('data-x', x);
      table.setAttribute('data-y', y);

    }

  });

}


// INIT
loadPositions();
renderTables();