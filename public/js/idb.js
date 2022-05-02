// db holds the connection status
let db;

//establishes connection to IndexedDB

const request = indexedDB.open("budget_tracker", 1);

// manage version changes
request.onupgradeneeded = function (e) {
  const db = e.target.result;
  // create new budget table
  db.createObjectStore("new_budget", { autoIncrement: true });
};

request.onsuccess = function (e) {
  db = e.target.result;

  if (navigator.onLine) {
    uploadData();
  }
};

request.onerror = function (e) {
  console.log(e.target.errorCode);
};

// saves data for uploading if no connection
function saveRecord(record) {
  const transaction = db.transaction(["new_budget"], "readwrite");

  // access object store
  const budgetObjectStore = transaction.objectStore("new_budget");

  //add record to store
  budgetObjectStore.add(record);
}

function uploadData() {
  const transaction = db.transaction(["new_budget"], "readwrite");

  const budgetObjectStore = transaction.objectStore("new_budget");

  //get all records
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          // open new transaction
          const transaction = db.transaction(["new_budget"], "readwrite");
          // access
          const budgetObjectStore = transaction.objectStore("new_budget");
          // clear all items
          budgetObjectStore.clear();

          console.log("Saved budget data has been submitted");
        })
        .catch((err) => console.log(err));
    }
  };
}

window.addEventListener("online", uploadData);
