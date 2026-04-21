let beverageCount = 1;

function updateRemoveButtons() {
    const forms = document.querySelectorAll('.beverage');
    const removeButtons = document.querySelectorAll('.remove-button');

    removeButtons.forEach(btn => {
        btn.disabled = forms.length === 1;
    });
}

function updateBeverageNumbers() {
    const forms = document.querySelectorAll('.beverage');
    forms.forEach((form, index) => {
        form.querySelector('.beverage-count').textContent = `Напиток №${index + 1}`;
    });
}

document.querySelector('.add-button').addEventListener('click', () => {
    beverageCount++;

    const forms = document.querySelectorAll('.beverage');
    const lastForm = forms[forms.length - 1];
    const newForm = lastForm.cloneNode(true);

    newForm.querySelector('.beverage-count').textContent = `Напиток №${beverageCount}`;

    const radioButtons = newForm.querySelectorAll('input[type="radio"]');
    for (const radio of radioButtons) {
        radio.name = `milk${beverageCount}`;
    }

    newForm.querySelector('.wishes-input').value = '';
    newForm.querySelector('.wishes-output').innerHTML = '';

    lastForm.after(newForm);
    updateRemoveButtons();
    updateBeverageNumbers();
});

document.querySelector('.order-form').addEventListener('input', (e) => {
    if (e.target.classList.contains('wishes-input')) {
        const text = e.target.value;
        const regex = /(срочно|быстрее|побыстрее|скорее|поскорее|очень\s+нужно)/gi;
        const formattedText = text.replace(regex, '<b>$&</b>');
        e.target.closest('.beverage').querySelector('.wishes-output').innerHTML = formattedText;
    }
});

document.querySelector('.order-form').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-button')) {
        const forms = document.querySelectorAll('.beverage');
        if (forms.length > 1) {
            e.target.closest('.beverage').remove();
            updateRemoveButtons();
            updateBeverageNumbers();
        }
    }
});

function declineBeverage(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return "напиток";
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return "напитка";
  }
  return "напитков";
}

document.querySelector(".order-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const beverages = document.querySelectorAll(".beverage");
  const count = beverages.length;
  const word = declineBeverage(count);
  document.querySelector(".beverage-count-message").textContent =
    `Вы заказали ${count} ${word}`;

  const tableBody = document.getElementById("order-table-body");
  tableBody.innerHTML = "";

  beverages.forEach((beverage) => {
    const select = beverage.querySelector("select");
    const drinkName = select.options[select.selectedIndex].text;

    const milkRadio = beverage.querySelector('input[type="radio"]:checked');
    const milkName = milkRadio ? milkRadio.nextElementSibling.textContent : "";

    const optionCheckboxes = beverage.querySelectorAll(
      'input[type="checkbox"]:checked',
    );
    const optionsNames = Array.from(optionCheckboxes)
      .map((cb) => cb.nextElementSibling.textContent)
      .join(", ");

    const wishesOutput = beverage.querySelector(".wishes-output").innerHTML;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${drinkName}</td>
      <td>${milkName}</td>
      <td>${optionsNames || "-"}</td>
      <td>${wishesOutput || "-"}</td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById("order-modal").classList.remove("hidden");
});

document
  .getElementById("confirm-order-button")
  .addEventListener("click", () => {
    const timeInput = document.getElementById("order-time");
    const selectedTime = timeInput.value;

    if (!selectedTime) {
      timeInput.style.borderColor = "red";
      alert("Пожалуйста, выберите время заказа");
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (
      hours < currentHours ||
      (hours === currentHours && minutes < currentMinutes)
    ) {
      timeInput.style.borderColor = "red";
      alert(
        "Мы не умеем перемещаться во времени. Выберите время позже, чем текущее",
      );
    } else {
      timeInput.style.borderColor = "";
      document.getElementById("order-modal").classList.add("hidden");
    }
  });

document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("order-modal").classList.add("hidden");
});

updateRemoveButtons();
