// Random Data Generator — client-side tool for generating realistic fake data
// Uses Math.random() for randomness; all generation happens in the browser

const DATA_CONFIG = {
  // Sample data sets for generation
  FIRST_NAMES_MALE: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
  FIRST_NAMES_FEMALE: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna'],
  LAST_NAMES: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'],
  CITIES: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'Indianapolis', 'San Francisco', 'Seattle', 'Denver', 'Nashville'],
  STATES: [
    { name: 'Alabama', abbr: 'AL' }, { name: 'Alaska', abbr: 'AK' }, { name: 'Arizona', abbr: 'AZ' },
    { name: 'Arkansas', abbr: 'AR' }, { name: 'California', abbr: 'CA' }, { name: 'Colorado', abbr: 'CO' },
    { name: 'Connecticut', abbr: 'CT' }, { name: 'Delaware', abbr: 'DE' }, { name: 'Florida', abbr: 'FL' },
    { name: 'Georgia', abbr: 'GA' }, { name: 'Hawaii', abbr: 'HI' }, { name: 'Idaho', abbr: 'ID' },
    { name: 'Illinois', abbr: 'IL' }, { name: 'Indiana', abbr: 'IN' }, { name: 'Iowa', abbr: 'IA' },
    { name: 'Kansas', abbr: 'KS' }, { name: 'Kentucky', abbr: 'KY' }, { name: 'Louisiana', abbr: 'LA' },
    { name: 'Maine', abbr: 'ME' }, { name: 'Maryland', abbr: 'MD' }, { name: 'Massachusetts', abbr: 'MA' },
    { name: 'Michigan', abbr: 'MI' }, { name: 'Minnesota', abbr: 'MN' }, { name: 'Mississippi', abbr: 'MS' },
    { name: 'Missouri', abbr: 'MO' }, { name: 'Montana', abbr: 'MT' }, { name: 'Nebraska', abbr: 'NE' },
    { name: 'Nevada', abbr: 'NV' }, { name: 'New Hampshire', abbr: 'NH' }, { name: 'New Jersey', abbr: 'NJ' },
    { name: 'New Mexico', abbr: 'NM' }, { name: 'New York', abbr: 'NY' }, { name: 'North Carolina', abbr: 'NC' },
    { name: 'North Dakota', abbr: 'ND' }, { name: 'Ohio', abbr: 'OH' }, { name: 'Oklahoma', abbr: 'OK' },
    { name: 'Oregon', abbr: 'OR' }, { name: 'Pennsylvania', abbr: 'PA' }, { name: 'Rhode Island', abbr: 'RI' },
    { name: 'South Carolina', abbr: 'SC' }, { name: 'South Dakota', abbr: 'SD' }, { name: 'Tennessee', abbr: 'TN' },
    { name: 'Texas', abbr: 'TX' }, { name: 'Utah', abbr: 'UT' }, { name: 'Vermont', abbr: 'VT' },
    { name: 'Virginia', abbr: 'VA' }, { name: 'Washington', abbr: 'WA' }, { name: 'West Virginia', abbr: 'WV' },
    { name: 'Wisconsin', abbr: 'WI' }, { name: 'Wyoming', abbr: 'WY' }
  ],
  EMAIL_DOMAINS: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.com', 'protonmail.com'],
  COMPANIES: ['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems', 'Massive Dynamic', 'Aperture Science', 'Soylent Corp'],
  JOB_TITLES: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'DevOps Engineer', 'Marketing Specialist', 'Sales Representative', 'Project Manager', 'Accountant', 'HR Manager', 'Graphic Designer', 'Content Writer', 'Financial Analyst', 'Network Administrator', 'Quality Assurance Tester'],
  PHONE_PREFIXES: ['212', '310', '415', '617', '312', '713', '404', '206', '305', '702', '512', '602', '480', '704', '913'],
};

// Utility: pick random item from array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Utility: generate random number with leading zeros
function padNumber(num, length = 4) {
  return String(num).padStart(length, '0');
}

// Generate fake first + last name
function generateName(gender = 'any') {
  let firstName;
  if (gender === 'male') {
    firstName = randomItem(DATA_CONFIG.FIRST_NAMES_MALE);
  } else if (gender === 'female') {
    firstName = randomItem(DATA_CONFIG.FIRST_NAMES_FEMALE);
  } else {
    firstName = Math.random() > 0.5 ? randomItem(DATA_CONFIG.FIRST_NAMES_MALE) : randomItem(DATA_CONFIG.FIRST_NAMES_FEMALE);
  }
  const lastName = randomItem(DATA_CONFIG.LAST_NAMES);
  return `${firstName} ${lastName}`;
}

// Generate fake address
function generateAddress() {
  const streetNum = Math.floor(Math.random() * 9999) + 1;
  const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Cedar Ln', 'Maple Dr', 'Washington St', 'Park Ave', 'Lakeview Dr', 'Hillside Ave'];
  const street = `${streetNum} ${randomItem(streets)}`;
  const city = randomItem(DATA_CONFIG.CITIES);
  const state = randomItem(DATA_CONFIG.STATES);
  const zip = padNumber(Math.floor(Math.random() * 90000) + 10000, 5);
  return { street, city, state: state.name, abbr: state.abbr, zip };
}

// Generate fake email
function generateEmail(firstName, lastName) {
  const domains = DATA_CONFIG.EMAIL_DOMAINS;
  const domain = randomItem(domains);
  const separator = Math.random() > 0.5 ? '.' : '';
  const num = Math.floor(Math.random() * 999) + 1;
  return `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${num}@${domain}`;
}

// Generate fake phone number (US format)
function generatePhone() {
  const prefix = randomItem(DATA_CONFIG.PHONE_PREFIXES);
  const exchange = padNumber(Math.floor(Math.random() * 900) + 100, 3);
  const line = padNumber(Math.floor(Math.random() * 9000) + 1000, 4);
  return `(${prefix}) ${exchange}-${line}`;
}

// Generate fake company info
function generateCompany() {
  return {
    name: randomItem(DATA_CONFIG.COMPANIES),
    title: randomItem(DATA_CONFIG.JOB_TITLES)
  };
}

// Generate Luhn-valid fake credit card number (16 digits)
function generateCreditCard() {
  // Start with common card prefixes
  const prefix = Math.random() > 0.5 ? '4' : '5'; // Visa or Mastercard
  let number = prefix;
  for (let i = 1; i < 15; i++) {
    number += String(Math.floor(Math.random() * 10));
  }

  // Calculate Luhn check digit
  let sum = 0;
  let isDouble = true;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);
    if (isDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isDouble = !isDouble;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  number += String(checkDigit);

  // Format as groups of 4
  return `${number.slice(0, 4)} ${number.slice(4, 8)} ${number.slice(8, 12)} ${number.slice(12)}`;
}

// Generate fake SSN (random but formatted correctly)
function generateSSN() {
  const area = padNumber(Math.floor(Math.random() * 900) + 1, 3);
  const group = padNumber(Math.floor(Math.random() * 99) + 1, 2);
  const serial = padNumber(Math.floor(Math.random() * 9999) + 1, 4);
  return `${area}-${group}-${serial}`;
}

// Generate fake date of birth (between 18 and 90 years ago)
function generateDOB() {
  const year = Math.floor(Math.random() * (2026 - 1935)) + 1935;
  const month = padNumber(Math.floor(Math.random() * 12) + 1, 2);
  const day = padNumber(Math.floor(Math.random() * 28) + 1, 2); // Safe for all months
  return `${year}-${month}-${day}`;
}

// Generate fake IP address (private ranges for safety)
function generateIP() {
  const type = Math.random();
  if (type < 0.4) {
    // 192.168.x.x
    return `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  } else if (type < 0.7) {
    // 10.x.x.x
    return `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  } else {
    // 172.16-31.x.x
    const secondOctet = Math.floor(Math.random() * 16) + 16;
    return `172.${secondOctet}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }
}

// Generate fake URL
function generateURL() {
  const domains = ['example.com', 'test.org', 'demo.net', 'sample.io'];
  const path = `/${randomItem(['about', 'contact', 'blog', 'products', 'services']).toLowerCase()}/${Math.floor(Math.random() * 100)}`;
  return `https://www.${randomItem(domains)}${path}`;
}

// Main generation function
function generateRandomData(options = {}) {
  const { count = 5, categories = ['name', 'address', 'email'] } = options;
  const results = [];

  for (let i = 0; i < count; i++) {
    const record = {};

    if (categories.includes('name')) {
      record.fullName = generateName(options.gender);
      record.firstName = record.fullName.split(' ')[0];
      record.lastName = record.fullName.split(' ').slice(1).join(' ');
    }

    if (categories.includes('address')) {
      const addr = generateAddress();
      Object.assign(record, addr);
    }

    if (categories.includes('email')) {
      if (!record.firstName) record.firstName = 'John';
      if (!record.lastName) record.lastName = 'Doe';
      record.email = generateEmail(record.firstName, record.lastName);
    }

    if (categories.includes('phone')) {
      record.phone = generatePhone();
    }

    if (categories.includes('company')) {
      const company = generateCompany();
      Object.assign(record, company);
    }

    if (categories.includes('creditcard')) {
      record.creditCard = generateCreditCard();
    }

    if (categories.includes('ssn')) {
      record.ssn = generateSSN();
    }

    if (categories.includes('dob')) {
      record.dateOfBirth = generateDOB();
    }

    if (categories.includes('ip')) {
      record.ipAddress = generateIP();
    }

    if (categories.includes('url')) {
      record.url = generateURL();
    }

    results.push(record);
  }

  return results;
}

// Format data as table HTML for display
function formatDataAsTable(data) {
  if (!data || data.length === 0) {
    return '<div class="glass-card" style="padding: 1rem;">No data generated. Select categories and click Generate.</div>';
  }

  const headers = Object.keys(data[0]);
  let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">';

  // Header row
  html += '<thead><tr style="border-bottom: 2px solid rgba(99, 102, 241, 0.3);">';
  headers.forEach(header => {
    html += `<th style="padding: 0.75rem; text-align: left; color: #a5b4fc; font-weight: 600;">${header}</th>`;
  });
  html += '</tr></thead>';

  // Data rows
  html += '<tbody>';
  data.forEach((row, rowIndex) => {
    const bgColor = rowIndex % 2 === 0 ? 'rgba(99, 102, 241, 0.05)' : 'transparent';
    html += `<tr style="background: ${bgColor};">`;
    headers.forEach(header => {
      const value = row[header] || '';
      html += `<td style="padding: 0.6rem; border-bottom: 1px solid rgba(99, 102, 241, 0.1);">${value}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';

  return html;
}

// Copy data to clipboard as formatted text
function copyDataToClipboard(data) {
  if (!data || data.length === 0) return false;

  const headers = Object.keys(data[0]);
  let text = headers.join('\t') + '\n';
  data.forEach(row => {
    text += headers.map(h => row[h] || '').join('\t') + '\n';
  });

  navigator.clipboard.writeText(text).then(() => {
    showStatus('Copied to clipboard!', 'success');
  }).catch(err => {
    showStatus(`Copy failed: ${err.message}`, 'error');
  });

  return true;
}

// Show status message
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('random-data-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card grainy-banner ${type}`;
  statusEl.style.display = 'block';
}

// Initialize the Random Data Generator tool
function initRandomDataGenerator() {
  const generateBtn = document.getElementById('random-data-generate-btn');
  const copyBtn = document.getElementById('random-data-copy-btn');
  const outputArea = document.getElementById('random-data-output');
  const countInput = document.getElementById('random-data-count');

  if (!generateBtn) return;

  // Generate button click handler
  generateBtn.addEventListener('click', () => {
    if (!countInput || !outputArea) return;

    const count = parseInt(countInput.value, 10) || 5;
    const categories = [];
    document.querySelectorAll('#random-data-categories input[type="checkbox"]:checked').forEach(cb => {
      categories.push(cb.value);
    });

    if (categories.length === 0) {
      showStatus('Please select at least one data category.', 'error');
      return;
    }

    const gender = document.getElementById('random-data-gender')?.value || 'any';
    const options = { count, categories, gender };
    const data = generateRandomData(options);
    outputArea.innerHTML = formatDataAsTable(data);
    showStatus(`Generated ${count} record(s)`, 'success');
  });

  // Copy button click handler
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const table = outputArea.querySelector('table');
      if (!table) {
        showStatus('No data to copy.', 'info');
        return;
      }
      // Parse table data for clipboard
      const rows = table.querySelectorAll('tr');
      let text = '';
      rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        const rowData = Array.from(cells).map(cell => cell.textContent);
        text += rowData.join('\t') + '\n';
      });
      navigator.clipboard.writeText(text.trim()).then(() => {
        showStatus('Copied to clipboard!', 'success');
      }).catch(err => {
        showStatus(`Copy failed: ${err.message}`, 'error');
      });
    });
  }

  // Initial status
  showStatus('Select categories and click Generate to create fake data.', 'info');
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initRandomDataGenerator = initRandomDataGenerator;
  window.generateRandomData = generateRandomData;
}
