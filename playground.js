// ─────────────────────────────────────────────
//  SQL Playground — Core Logic
// ─────────────────────────────────────────────

// ═══════════ State ═══════════
let db = null;               // sql.js database instance
let editor = null;           // CodeMirror instance
let activeAssignment = null; // currently active assignment object
let hintIndex = 0;           // how many hints revealed
let progress = loadProgress();

// ═══════════ Initialization ═══════════

document.addEventListener('DOMContentLoaded', async function () {
  initWelcome();
  initEditor();
  initSidebarToggle();
  initUploads();
  renderAssignments();
  await initDatabase();
  handleUrlParams();
  updateProgressDisplay();
});

// ── Database ──
async function initDatabase() {
  try {
    const SQL = await initSqlJs({
      locateFile: function (file) {
        return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + file;
      }
    });
    db = new SQL.Database();
    db.run(BRIGHT_STORE_SCHEMA);
    db.run(BRIGHT_STORE_DATA);
    renderSchemaTree();
    populateViewerSelect();
    setStatus('Database loaded — Bright Store (5 tables)');
  } catch (err) {
    setStatus('Failed to load database. Check your internet connection.');
    document.getElementById('schema-tree').innerHTML =
      '<div class="schema-loading" style="color:var(--rose)">Could not load the SQL engine. Make sure you\'re connected to the internet (the engine downloads once).</div>';
  }
}

function resetDatabase() {
  if (!db) return;
  db.close();
  initSqlJs({
    locateFile: function (file) {
      return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + file;
    }
  }).then(function (SQL) {
    db = new SQL.Database();
    db.run(BRIGHT_STORE_SCHEMA);
    db.run(BRIGHT_STORE_DATA);
    renderSchemaTree();
    populateViewerSelect();
    setStatus('Database reset to default — Bright Store');
    document.getElementById('upload-status').textContent = 'Database reset to default.';
  });
}

// ── Editor ──
function initEditor() {
  var textarea = document.getElementById('sql-editor');
  editor = CodeMirror.fromTextArea(textarea, {
    mode: 'text/x-sql',
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true,
    placeholder: 'Type your SQL here...',
    extraKeys: {
      'Ctrl-Enter': function () { runQuery(); },
      'Cmd-Enter': function () { runQuery(); },
      'Ctrl-Space': 'autocomplete'
    },
    hintOptions: {
      completeSingle: false,
      tables: {
        customers: ['customer_id', 'first_name', 'last_name', 'email', 'city', 'state', 'signup_date'],
        products: ['product_id', 'product_name', 'category', 'price'],
        orders: ['order_id', 'customer_id', 'order_date', 'status'],
        order_items: ['order_item_id', 'order_id', 'product_id', 'quantity', 'unit_price', 'discount'],
        employees: ['employee_id', 'first_name', 'last_name', 'department', 'salary', 'hire_date']
      }
    }
  });
}

function clearEditor() {
  editor.setValue('');
  editor.focus();
}

// ═══════════ Query Execution ═══════════

function runQuery() {
  if (!db) {
    setStatus('Database not loaded yet. Please wait...');
    return;
  }

  var sql = editor.getValue().trim();
  if (!sql) {
    setStatus('Nothing to run. Type a query first.');
    return;
  }

  var runBtn = document.getElementById('run-btn');
  runBtn.classList.add('running');
  runBtn.innerHTML = '<span class="run-btn-icon">&#9679;</span> Running...';

  var resultsWrap = document.getElementById('results-wrap');
  var startTime = performance.now();

  setTimeout(function () {
    try {
      var results = db.exec(sql);
      var elapsed = (performance.now() - startTime).toFixed(1);

      if (results.length === 0) {
        // Statement ran but returned no rows (INSERT, UPDATE, CREATE, etc.)
        var changes = db.getRowsModified();
        resultsWrap.innerHTML =
          '<div class="result-success"><div class="result-success-title">Query executed</div>' +
          '<div class="result-success-msg">' + (changes > 0 ? changes + ' row(s) affected.' : 'No rows returned.') + ' (' + elapsed + ' ms)</div></div>';
        setStatus('Query executed — ' + elapsed + ' ms');
        // Refresh schema in case tables changed
        renderSchemaTree();
        populateViewerSelect();
      } else {
        var result = results[0];
        renderResultsTable(result, resultsWrap);
        setStatus(result.values.length + ' row(s) returned — ' + elapsed + ' ms');

        // Validate if assignment active
        if (activeAssignment) {
          validateAssignment(result);
        }
      }

      // Save to history
      saveQueryToHistory(sql, true, results.length > 0 ? results[0].values.length : 0);

    } catch (err) {
      var elapsed = (performance.now() - startTime).toFixed(1);
      renderError(err.message, resultsWrap);
      setStatus('Error — ' + elapsed + ' ms');
      saveQueryToHistory(sql, false, 0);
    }

    runBtn.classList.remove('running');
    runBtn.innerHTML = '<span class="run-btn-icon">&#9655;</span> Run Query';
  }, 50);
}

function renderResultsTable(result, container) {
  var cols = result.columns;
  var rows = result.values;

  var html = '<div class="results-table-wrap"><table class="results-table"><thead><tr>';
  html += '<th class="row-num-col">#</th>';
  for (var i = 0; i < cols.length; i++) {
    html += '<th>' + escapeHtml(cols[i]) + '</th>';
  }
  html += '</tr></thead><tbody>';

  for (var r = 0; r < rows.length; r++) {
    html += '<tr><td class="row-num">' + (r + 1) + '</td>';
    for (var c = 0; c < rows[r].length; c++) {
      var val = rows[r][c];
      if (val === null) {
        html += '<td class="null-val">NULL</td>';
      } else {
        html += '<td>' + escapeHtml(String(val)) + '</td>';
      }
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function renderError(message, container) {
  var help = getErrorHelp(message);
  container.innerHTML =
    '<div class="result-error">' +
    '<div class="result-error-title">Something went wrong</div>' +
    escapeHtml(message) +
    (help ? '<div class="result-error-help">' + help + '</div>' : '') +
    '</div>';
}

function getErrorHelp(msg) {
  var m = msg.toLowerCase();
  if (m.indexOf('no such column') > -1) {
    var match = msg.match(/no such column:\s*(\S+)/i);
    if (match) {
      return 'The column <strong>' + escapeHtml(match[1]) + '</strong> doesn\'t exist. Check the Schema Explorer on the left for the correct column names. Remember: column names are case-sensitive and use underscores (like <code>first_name</code>) not spaces.';
    }
    return 'Check the Schema Explorer for correct column names. Database names use underscores instead of spaces.';
  }
  if (m.indexOf('no such table') > -1) {
    return 'That table doesn\'t exist. Check the Schema Explorer on the left. Available tables: customers, products, orders, order_items, employees.';
  }
  if (m.indexOf('near') > -1 && m.indexOf('syntax error') > -1) {
    return 'There\'s a typo or missing word in your SQL. Common fixes: make sure you have commas between column names, quotes around text values, and a semicolon at the end.';
  }
  if (m.indexOf('ambiguous column') > -1) {
    return 'This column name exists in more than one table. Use <code>table_name.column_name</code> to specify which one (e.g., <code>customers.customer_id</code>).';
  }
  if (m.indexOf('not an aggregate') > -1 || m.indexOf('must be an aggregate') > -1) {
    return 'When using GROUP BY, every column in SELECT must either be in the GROUP BY list or wrapped in an aggregate function (COUNT, SUM, AVG, MIN, MAX).';
  }
  return null;
}

// ═══════════ Schema Explorer ═══════════

function renderSchemaTree() {
  if (!db) return;

  var tree = document.getElementById('schema-tree');
  var tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");

  if (!tables.length || !tables[0].values.length) {
    tree.innerHTML = '<div class="schema-loading">No tables found.</div>';
    document.getElementById('table-count-badge').textContent = '0 tables';
    return;
  }

  var tableNames = tables[0].values.map(function (r) { return r[0]; });
  document.getElementById('table-count-badge').textContent = tableNames.length + ' tables';

  var html = '';
  for (var t = 0; t < tableNames.length; t++) {
    var tname = tableNames[t];
    var info = db.exec("PRAGMA table_info('" + tname + "');");
    var countResult = db.exec("SELECT COUNT(*) FROM " + tname + ";");
    var rowCount = countResult[0].values[0][0];

    html += '<div class="schema-table" onclick="toggleSchemaTable(this, event)">';
    html += '<div class="schema-table-header">';
    html += '<span class="sidebar-arrow" style="font-size:8px">&#9656;</span> ';
    html += escapeHtml(tname);
    html += '<span class="schema-row-count">' + rowCount + ' rows</span>';
    html += '</div>';
    html += '<div class="schema-table-cols">';

    if (info.length && info[0].values.length) {
      for (var c = 0; c < info[0].values.length; c++) {
        var col = info[0].values[c];
        var colName = col[1];
        var colType = col[2] || 'TEXT';
        var isPK = col[5] === 1;
        var tooltip = getColumnTooltip(tname, colName);

        html += '<div class="schema-col" onclick="insertIntoEditor(\'' + escapeHtml(colName) + '\', event)" title="' + escapeHtml(tooltip) + '">';
        if (isPK) html += '<span class="schema-col-key">PK</span>';
        html += escapeHtml(colName);
        html += '<span class="schema-col-type">' + escapeHtml(colType) + '</span>';
        html += '</div>';
      }
    }
    html += '</div></div>';
  }

  tree.innerHTML = html;
}

function getColumnTooltip(table, col) {
  // Beginner-friendly tooltips explaining naming conventions
  var tips = {
    '_id': 'A unique number identifying each row. The "_id" suffix is a naming convention — it means "identifier".',
    'first_name': 'The person\'s first name. We use underscores (first_name) because database names can\'t have spaces.',
    'last_name': 'The person\'s last name. Same underscore convention as first_name.',
    'email': 'Email address stored as text.',
    'city': 'The city where this person lives.',
    'state': 'The US state abbreviation (e.g., "NY" for New York).',
    'signup_date': 'When this customer signed up. Dates are stored as text in "YYYY-MM-DD" format.',
    'product_name': 'The name of the product. Underscore separates "product" and "name".',
    'category': 'Product category like "Electronics" or "Clothing". Used for grouping.',
    'price': 'The product price in dollars. Stored as a decimal number.',
    'order_date': 'When the order was placed. Format: YYYY-MM-DD.',
    'status': 'Order status: "completed", "pending", or "cancelled".',
    'quantity': 'How many units of this product were ordered.',
    'unit_price': 'Price per unit at the time of order (may differ from current product price).',
    'discount': 'Discount applied as a decimal (0.10 = 10% off).',
    'department': 'Which department this employee works in.',
    'salary': 'Annual salary in dollars.',
    'hire_date': 'When this employee started working. Format: YYYY-MM-DD.'
  };

  // Check specific column name first, then patterns
  if (tips[col]) return tips[col];
  if (col.indexOf('_id') > -1) return tips['_id'];
  return 'Click to insert into editor.';
}

function toggleSchemaTable(el, event) {
  if (event.target.classList.contains('schema-col')) return;
  el.classList.toggle('open');
}

function insertIntoEditor(text, event) {
  event.stopPropagation();
  var cursor = editor.getCursor();
  editor.replaceRange(text, cursor);
  editor.focus();
}

// ═══════════ Assignments ═══════════

function renderAssignments() {
  var panel = document.getElementById('assignments-panel');
  var totalAssignments = 0;
  var completedAssignments = 0;
  var html = '';

  for (var p = 0; p < ASSIGNMENTS.length; p++) {
    var part = ASSIGNMENTS[p];
    var partComplete = 0;

    for (var a = 0; a < part.assignments.length; a++) {
      totalAssignments++;
      if (progress.assignments[part.assignments[a].id] && progress.assignments[part.assignments[a].id].completed) {
        partComplete++;
        completedAssignments++;
      }
    }

    var isOpen = false;
    // Open the first part that isn't fully completed
    if (!isOpen && partComplete < part.assignments.length) {
      isOpen = true;
    }

    html += '<div class="assignment-part' + (isOpen ? ' open' : '') + '" data-part="' + part.part + '">';
    html += '<div class="assignment-part-header" onclick="toggleAssignmentPart(this.parentElement)">';
    html += '<span class="sidebar-arrow" style="font-size:8px">&#9656;</span> ';
    html += 'Part ' + part.part + ': ' + escapeHtml(part.partTitle);
    html += '<span class="assignment-part-progress">';
    for (var d = 0; d < part.assignments.length; d++) {
      var done = progress.assignments[part.assignments[d].id] && progress.assignments[part.assignments[d].id].completed;
      html += '<span class="assignment-part-dot' + (done ? ' done' : '') + '"></span>';
    }
    html += '</span></div>';

    html += '<div class="assignment-list">';

    if (part.conceptsReminder) {
      html += '<div class="concepts-reminder">' + part.conceptsReminder + '</div>';
    }

    for (var a = 0; a < part.assignments.length; a++) {
      var asn = part.assignments[a];
      var isDone = progress.assignments[asn.id] && progress.assignments[asn.id].completed;
      html += '<div class="assignment-item' + (isDone ? ' completed' : '') + '" data-id="' + asn.id + '" onclick="startAssignment(\'' + asn.id + '\')">';
      html += '<span class="assignment-check">' + (isDone ? '&#10003;' : '') + '</span>';
      html += '<span>' + escapeHtml(asn.title) + '</span>';
      html += '</div>';
    }

    html += '</div></div>';
  }

  panel.innerHTML = html;
  document.getElementById('assignment-progress-badge').textContent = completedAssignments + ' / ' + totalAssignments;
}

function toggleAssignmentPart(el) {
  el.classList.toggle('open');
}

function startAssignment(id) {
  // Find the assignment
  var assignment = null;
  for (var p = 0; p < ASSIGNMENTS.length; p++) {
    for (var a = 0; a < ASSIGNMENTS[p].assignments.length; a++) {
      if (ASSIGNMENTS[p].assignments[a].id === id) {
        assignment = ASSIGNMENTS[p].assignments[a];
        break;
      }
    }
    if (assignment) break;
  }
  if (!assignment) return;

  activeAssignment = assignment;
  hintIndex = 0;

  // Update UI
  var bar = document.getElementById('active-assignment');
  bar.style.display = 'flex';
  document.getElementById('active-assignment-badge').textContent = assignment.id;
  document.getElementById('active-assignment-title').textContent = assignment.title;

  // Clear hints
  var hintsArea = document.getElementById('hints-area');
  hintsArea.style.display = 'none';
  hintsArea.innerHTML = '';

  // Show instructions in results area
  var resultsWrap = document.getElementById('results-wrap');
  resultsWrap.innerHTML =
    '<div style="padding:20px">' +
    '<div style="font-size:16px;font-weight:500;font-family:var(--font-display);margin-bottom:8px">' + escapeHtml(assignment.title) + '</div>' +
    '<div style="font-size:13px;color:var(--text-soft);line-height:1.6;margin-bottom:14px">' + assignment.instructions + '</div>' +
    '<div style="font-size:12px;color:var(--green);background:var(--green-bg);padding:10px 14px;border-radius:var(--radius-sm);border-left:3px solid var(--green);line-height:1.5">' +
    '<strong style="font-size:11px;text-transform:uppercase;letter-spacing:.04em;display:block;margin-bottom:3px">Why this matters for a business analyst</strong>' +
    assignment.whyItMatters +
    '</div></div>';

  // Load starter query
  editor.setValue(assignment.starterQuery);
  editor.focus();

  // Restore last attempt if exists
  var saved = progress.assignments[id];
  if (saved && saved.lastQuery && saved.lastQuery !== assignment.starterQuery) {
    editor.setValue(saved.lastQuery);
  }

  // Mark active in sidebar
  document.querySelectorAll('.assignment-item').forEach(function (el) {
    el.classList.remove('active');
  });
  var activeEl = document.querySelector('.assignment-item[data-id="' + id + '"]');
  if (activeEl) activeEl.classList.add('active');

  // Update hint button text
  updateHintButton();
}

function clearActiveAssignment() {
  activeAssignment = null;
  hintIndex = 0;
  document.getElementById('active-assignment').style.display = 'none';
  document.getElementById('hints-area').style.display = 'none';
  document.getElementById('hints-area').innerHTML = '';
  document.querySelectorAll('.assignment-item').forEach(function (el) {
    el.classList.remove('active');
  });
}

function showNextHint() {
  if (!activeAssignment) return;
  if (hintIndex >= activeAssignment.hints.length) return;

  var hintsArea = document.getElementById('hints-area');
  hintsArea.style.display = 'block';

  var hintText = activeAssignment.hints[hintIndex];
  var hintEl = document.createElement('div');
  hintEl.className = 'hint-item';
  // Wrap code-like content in <code> tags
  hintText = hintText.replace(/`([^`]+)`/g, '<code>$1</code>');
  hintEl.innerHTML = '<span>' + hintText + '</span>';
  hintsArea.appendChild(hintEl);

  hintIndex++;
  updateHintButton();
}

function updateHintButton() {
  var btn = document.getElementById('hint-btn');
  if (!activeAssignment) return;
  var remaining = activeAssignment.hints.length - hintIndex;
  if (remaining <= 0) {
    btn.textContent = 'No more hints';
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
  } else if (remaining === 1) {
    btn.textContent = 'Show Answer';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  } else {
    btn.textContent = 'Hint (' + remaining + ' left)';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  }
}

// ═══════════ Validation ═══════════

function validateAssignment(result) {
  if (!activeAssignment) return;

  var v = activeAssignment.validation;
  var userCols = result.columns.map(function (c) { return c.toLowerCase(); });
  var expectedCols = v.expectedColumns.map(function (c) { return c.toLowerCase(); });

  // Check columns
  var colsMatch = expectedCols.every(function (ec) { return userCols.indexOf(ec) > -1; });
  var rowCountMatch = v.expectedRowCount === undefined || result.values.length === v.expectedRowCount;

  var resultsWrap = document.getElementById('results-wrap');

  if (colsMatch && rowCountMatch) {
    // Success!
    markAssignmentComplete(activeAssignment.id);

    // Show results table first, then success message
    renderResultsTable(result, resultsWrap);
    var successDiv = document.createElement('div');
    successDiv.className = 'result-success';
    successDiv.innerHTML =
      '<div class="result-success-title">Correct!</div>' +
      '<div class="result-success-msg">' + activeAssignment.whyItMatters + '</div>';
    resultsWrap.insertBefore(successDiv, resultsWrap.firstChild);

    setStatus('Assignment ' + activeAssignment.id + ' completed!');
  } else if (colsMatch && !rowCountMatch) {
    // Columns right, rows wrong
    renderResultsTable(result, resultsWrap);
    var partialDiv = document.createElement('div');
    partialDiv.className = 'result-partial';
    partialDiv.innerHTML =
      '<strong>Almost there!</strong> You got the right columns, but the number of rows is off. ' +
      'Expected <strong>' + v.expectedRowCount + '</strong> rows, got <strong>' + result.values.length + '</strong>. ' +
      (result.values.length > v.expectedRowCount
        ? 'Try adding or adjusting a WHERE filter.'
        : 'Your filter might be too strict — check your conditions.');
    resultsWrap.insertBefore(partialDiv, resultsWrap.firstChild);
  } else {
    // Columns don't match
    renderResultsTable(result, resultsWrap);
    var partialDiv = document.createElement('div');
    partialDiv.className = 'result-partial';
    var missing = expectedCols.filter(function (ec) { return userCols.indexOf(ec) === -1; });
    partialDiv.innerHTML =
      '<strong>Not quite.</strong> The expected columns are: <code>' + expectedCols.join(', ') + '</code>. ' +
      (missing.length ? 'Missing: <code>' + missing.join(', ') + '</code>. ' : '') +
      'Check the Schema Explorer for the exact column names.';
    resultsWrap.insertBefore(partialDiv, resultsWrap.firstChild);
  }

  // Save last query
  saveAssignmentAttempt(activeAssignment.id, editor.getValue());
}

function markAssignmentComplete(id) {
  if (!progress.assignments[id]) {
    progress.assignments[id] = { completed: false, attempts: 0, lastQuery: null };
  }
  progress.assignments[id].completed = true;
  progress.assignments[id].completedAt = new Date().toISOString();
  saveProgress();
  renderAssignments();
  updateProgressDisplay();

  // Re-activate current assignment since renderAssignments resets active state
  if (activeAssignment) {
    var activeEl = document.querySelector('.assignment-item[data-id="' + activeAssignment.id + '"]');
    if (activeEl) activeEl.classList.add('active');
  }
}

function saveAssignmentAttempt(id, query) {
  if (!progress.assignments[id]) {
    progress.assignments[id] = { completed: false, attempts: 0, lastQuery: null };
  }
  progress.assignments[id].attempts++;
  progress.assignments[id].lastQuery = query;
  saveProgress();
}

// ═══════════ Progress Tracking ═══════════

function loadProgress() {
  try {
    var saved = localStorage.getItem('sql_playground_progress');
    if (saved) {
      var p = JSON.parse(saved);
      if (p.version === 1) return p;
    }
  } catch (e) {}
  return {
    version: 1,
    lessonVisits: {},
    assignments: {},
    queryHistory: [],
    settings: { fontSize: 14, sidebarOpen: true }
  };
}

function saveProgress() {
  try {
    localStorage.setItem('sql_playground_progress', JSON.stringify(progress));
  } catch (e) {}
}

function saveQueryToHistory(sql, success, rowCount) {
  progress.queryHistory.unshift({
    sql: sql.substring(0, 500),
    timestamp: new Date().toISOString(),
    success: success,
    rowCount: rowCount
  });
  if (progress.queryHistory.length > 50) {
    progress.queryHistory = progress.queryHistory.slice(0, 50);
  }
  saveProgress();
}

function calculateProgress() {
  var totalParts = ASSIGNMENTS.length;
  var totalScore = 0;

  for (var p = 0; p < ASSIGNMENTS.length; p++) {
    var part = ASSIGNMENTS[p];
    var partScore = 0;

    // Lesson visit = 50%
    if (progress.lessonVisits[part.part]) {
      partScore += 50;
    }

    // Assignments = 50%
    var completedCount = 0;
    for (var a = 0; a < part.assignments.length; a++) {
      var id = part.assignments[a].id;
      if (progress.assignments[id] && progress.assignments[id].completed) {
        completedCount++;
      }
    }
    if (part.assignments.length > 0) {
      partScore += (completedCount / part.assignments.length) * 50;
    }

    totalScore += partScore;
  }

  return Math.round(totalScore / totalParts);
}

function updateProgressDisplay() {
  var pct = calculateProgress();
  var circumference = 2 * Math.PI * 15.5; // r=15.5
  var offset = circumference - (pct / 100) * circumference;

  document.querySelectorAll('.progress-ring-fill').forEach(function (el) {
    el.style.strokeDashoffset = offset;
  });
  document.querySelectorAll('.progress-label').forEach(function (el) {
    el.textContent = pct + '%';
  });
}

// ═══════════ Upload ═══════════

function initUploads() {
  document.getElementById('csv-upload').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;

    var statusEl = document.getElementById('upload-status');
    statusEl.textContent = 'Reading ' + file.name + '...';

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (!results.data.length) {
          statusEl.textContent = 'File is empty.';
          return;
        }

        var tableName = file.name.replace(/\.csv$/i, '').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        var headers = results.meta.fields;

        // Create table
        var colDefs = headers.map(function (h) {
          return '"' + h.replace(/"/g, '""') + '" TEXT';
        }).join(', ');

        try {
          db.run('DROP TABLE IF EXISTS "' + tableName + '";');
          db.run('CREATE TABLE "' + tableName + '" (' + colDefs + ');');

          // Insert rows
          var stmt = db.prepare('INSERT INTO "' + tableName + '" VALUES (' + headers.map(function () { return '?'; }).join(',') + ')');
          for (var i = 0; i < results.data.length; i++) {
            var row = headers.map(function (h) { return results.data[i][h] || null; });
            stmt.run(row);
          }
          stmt.free();

          renderSchemaTree();
          populateViewerSelect();
          statusEl.textContent = 'Loaded "' + tableName + '" — ' + results.data.length + ' rows, ' + headers.length + ' columns.';
          setStatus('CSV loaded: ' + tableName + ' (' + results.data.length + ' rows)');
        } catch (err) {
          statusEl.textContent = 'Error: ' + err.message;
        }
      },
      error: function (err) {
        statusEl.textContent = 'Error reading file: ' + err.message;
      }
    });

    e.target.value = '';
  });

  document.getElementById('sqlite-upload').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;

    var statusEl = document.getElementById('upload-status');
    statusEl.textContent = 'Loading ' + file.name + '...';

    var reader = new FileReader();
    reader.onload = function (event) {
      try {
        initSqlJs({
          locateFile: function (f) {
            return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + f;
          }
        }).then(function (SQL) {
          var arr = new Uint8Array(event.target.result);
          db = new SQL.Database(arr);
          renderSchemaTree();
          populateViewerSelect();
          statusEl.textContent = 'SQLite database loaded: ' + file.name;
          setStatus('SQLite database loaded');
        });
      } catch (err) {
        statusEl.textContent = 'Error: ' + err.message;
      }
    };
    reader.readAsArrayBuffer(file);

    e.target.value = '';
  });
}

// ═══════════ Database Viewer ═══════════

function populateViewerSelect() {
  if (!db) return;
  var select = document.getElementById('viewer-table-select');
  var tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");

  select.innerHTML = '<option value="">Pick a table...</option>';
  if (tables.length && tables[0].values.length) {
    for (var i = 0; i < tables[0].values.length; i++) {
      var opt = document.createElement('option');
      opt.value = tables[0].values[i][0];
      opt.textContent = tables[0].values[i][0];
      select.appendChild(opt);
    }
  }
}

function browseTable() {
  var table = document.getElementById('viewer-table-select').value;
  var output = document.getElementById('viewer-output');
  if (!table || !db) {
    output.innerHTML = '';
    return;
  }

  try {
    var result = db.exec('SELECT * FROM "' + table + '" LIMIT 50;');
    if (result.length) {
      var html = '<table class="results-table" style="font-size:10px">';
      html += '<thead><tr>';
      for (var c = 0; c < result[0].columns.length; c++) {
        html += '<th>' + escapeHtml(result[0].columns[c]) + '</th>';
      }
      html += '</tr></thead><tbody>';
      for (var r = 0; r < result[0].values.length; r++) {
        html += '<tr>';
        for (var c = 0; c < result[0].values[r].length; c++) {
          var val = result[0].values[r][c];
          html += '<td>' + (val === null ? '<em style="color:var(--text-faint)">NULL</em>' : escapeHtml(String(val))) + '</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      output.innerHTML = html;
    } else {
      output.innerHTML = '<div style="font-size:11px;color:var(--text-faint);padding:8px 0">Table is empty.</div>';
    }
  } catch (err) {
    output.innerHTML = '<div style="font-size:11px;color:var(--rose)">' + escapeHtml(err.message) + '</div>';
  }
}

// ═══════════ Sidebar ═══════════

function initSidebarToggle() {
  var toggle = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('pg-sidebar');

  toggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove('open');
      }
    }
  });
}

function toggleSidebarSection(id) {
  document.getElementById(id).classList.toggle('open');
}

// ═══════════ Mobile Tabs ═══════════

function switchTab(tab) {
  document.querySelectorAll('.pg-tab').forEach(function (t) { t.classList.remove('active'); });
  document.querySelector('.pg-tab[data-tab="' + tab + '"]').classList.add('active');

  var sidebar = document.getElementById('pg-sidebar');
  var editorToolbar = document.querySelector('.editor-toolbar');
  var editorWrap = document.getElementById('editor-wrap');
  var activeBar = document.getElementById('active-assignment');
  var hintsArea = document.getElementById('hints-area');
  var resultsWrap = document.getElementById('results-wrap');

  // Hide everything first
  [editorToolbar, editorWrap, resultsWrap].forEach(function (el) { el.style.display = 'none'; });
  sidebar.classList.remove('open');

  if (tab === 'editor') {
    editorToolbar.style.display = 'flex';
    editorWrap.style.display = 'block';
    activeBar.style.display = activeAssignment ? 'flex' : 'none';
    hintsArea.style.display = hintIndex > 0 ? 'block' : 'none';
    editor.refresh();
  } else if (tab === 'results') {
    resultsWrap.style.display = 'block';
  } else if (tab === 'schema' || tab === 'tasks') {
    sidebar.classList.add('open');
    // Open the relevant section
    if (tab === 'schema') {
      document.getElementById('schema-section').classList.add('open');
      document.getElementById('assignments-section').classList.remove('open');
    } else {
      document.getElementById('assignments-section').classList.add('open');
      document.getElementById('schema-section').classList.remove('open');
    }
  }
}

// ═══════════ Welcome ═══════════

function initWelcome() {
  var shown = localStorage.getItem('sql_playground_welcome_seen');
  if (shown) {
    document.getElementById('welcome-overlay').classList.add('hidden');
  }
}

function dismissWelcome() {
  document.getElementById('welcome-overlay').classList.add('hidden');
  localStorage.setItem('sql_playground_welcome_seen', '1');
  if (editor) editor.focus();
}

// ═══════════ URL Params ═══════════

function handleUrlParams() {
  var params = new URLSearchParams(window.location.search);
  var part = params.get('part');
  if (part) {
    var partNum = parseInt(part);
    // Open that part's assignments
    document.querySelectorAll('.assignment-part').forEach(function (el) {
      if (parseInt(el.dataset.part) === partNum) {
        el.classList.add('open');
      } else {
        el.classList.remove('open');
      }
    });
    // Open sidebar on tablet
    if (window.innerWidth <= 1024) {
      document.getElementById('pg-sidebar').classList.add('open');
    }
    // Open assignments section
    document.getElementById('assignments-section').classList.add('open');
  }
}

// ═══════════ Utilities ═══════════

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setStatus(msg) {
  document.getElementById('status-message').textContent = msg;
}
