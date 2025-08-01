// Function to delete a user by ID
function deleteUserId(id) {
  window.deleteUserId = id;
}

// Function to handle the deletion of a user from localStorage
function deleteUser() {
  const users = JSON.parse(localStorage.getItem("local_usr"));
  const filteredUsers = users.filter((user) => user.id != window.deleteUserId);
  localStorage.setItem("local_usr", JSON.stringify(filteredUsers));
  window.location.reload();
}

// Function to validate user registration
function userRegistration() {
  let fullname = document.getElementById("Full_Name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("cpassword").value;

  if (
    fullname === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    alert("Please fill all the fields");
    return false;
  } else if (password !== confirmPassword) {
    alert("Passwords do not match");
    return false;
  } else {
    // Checking for existing user and email
    let existingUser = JSON.parse(localStorage.getItem("local_usr")) || [];
    for (let i = 0; i < existingUser.length; i++) {
      const user = existingUser[i];
      if (user.name === fullname) {
        alert("User already exists");
        return false;
      } else if (user.email === email) {
        alert("Email already exists");
        return false;
      }
    }
    // Create a user object
    let reg_usr = {
      id: Date.now(),
      name: fullname,
      email: email,
      password: password,
    };

    // Add new user to the array and store it
    existingUser.push(reg_usr);
    localStorage.setItem("local_usr", JSON.stringify(existingUser));
    return true;
  }
}

// Function to handle to get existing messages from localStorage
function getMessages() {
  return JSON.parse(localStorage.getItem("chatMessages") || "[]");
}

// Function to save messages to localStorage
function saveMessages(messages) {
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Function to render chat messages in the chat body
function renderMessages() {
  const chatBody = document.getElementById("chatBody");
  const messages = getMessages();
  chatBody.innerHTML = "";
  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "chat-message";
    div.innerHTML = `<strong>[${msg.time}] ${msg.user}:</strong> ${msg.text}`;
    chatBody.appendChild(div);
  });
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Function to get the logged-in user's name from sessionStorage
function getLoggedInUser() {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
  return user && user.name ? user.name : "Anonymous";
}

// Function to update user information
function updateUser() {
  const updatedFullname = document.getElementById("Full_Name").value;
  const updatedEmail = document.getElementById("email").value;
  if (updatedFullname === "" || updatedEmail === "") {
    alert("Please fill all the fields");
    return false;
  }
  users = JSON.parse(localStorage.getItem("local_usr"));
  users = users.filter((user) => user.id != user_id);
  users.push({
    id: user_id,
    name: updatedFullname,
    email: updatedEmail,
    password: userInfo.password, // Assuming password remains unchanged
  });
  localStorage.setItem("local_usr", JSON.stringify(users));
  return true;
}

// Function to set the document name to be deleted
function deleteDocumentName(name) {
  window.deleteDocumentName = decodeURIComponent(name);
}

// Function to delete a document by name from localStorage
function deleteDocument() {
  let documents = JSON.parse(localStorage.getItem("local_documents")) || [];
  documents = documents.filter(
    (document) => document.name !== window.deleteDocumentName
  );
  localStorage.setItem("local_documents", JSON.stringify(documents));
  window.location.reload();
}

// Function to handle the upload form submission
function handleUploadFormSubmit(e) {
  e.preventDefault();
  const label = document.getElementById("documentLabel").value;
  const fileInput = document.getElementById("documentFile");
  const file = fileInput.files[0];
  if (!file) return;

  let documents = JSON.parse(localStorage.getItem("local_documents")) || [];
  documents.push({
    label: label,
    name: file.name,
  });
  localStorage.setItem("local_documents", JSON.stringify(documents));
  // Close modal
  var uploadModal = bootstrap.Modal.getInstance(
    document.getElementById("uploadModal")
  );
  uploadModal.hide();
  window.location.reload();
}

// Function to render the user's uploaded documents in the table
function renderUserDocuments() {
  const storedDocuments =
    JSON.parse(localStorage.getItem("local_documents")) || [];
  const table = document.getElementById("userDocumentTable");
  for (let i = 0; i < storedDocuments.length; i++) {
    const document = storedDocuments[i];
    table.insertAdjacentHTML(
      "beforeend",
      `
                <tr>
                  <td>${document.label}</td>
                  <td>${document.name}</td>
                  <td>
                    <a data-bs-toggle="modal" data-bs-target="#editModal" onclick="openEditModal('${encodeURIComponent(
                      document.name
                    )}')" href="#">Edit</a> |
                    <a data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="deleteDocumentName('${encodeURIComponent(
                      document.name
                    )}')" href="#">Delete</a> |
                    <a href="./DocumentShare.html?name=${encodeURIComponent(
                      document.name
                    )}">Share</a>
                  </td>
                </tr>
                `
    );
  }
}

// Function to populate the user select dropdown with all users except the currently logged-in user
function populateUserSelect() {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const currentUser = loggedInUser && loggedInUser.name;
  const UserList = JSON.parse(localStorage.getItem("local_usr")) || [];
  const userSelect = document.getElementById("userSelect");
  UserList.forEach((user) => {
    if (user.name !== currentUser) {
      const option = document.createElement("option");
      option.value = user.name;
      option.textContent = user.name;
      userSelect.appendChild(option);
    }
  });
}

// Function to set the user and document name for deletion in shared documents
function setDeleteUser(user) {
  window.deleteUser = user;
}
// Function to delete a shared document entry for a specific user
function deleteSahredDocument() {
  const sharedDocuments =
    JSON.parse(localStorage.getItem("shared_documents")) || [];
  const updatedDocuments = sharedDocuments.filter(
    (doc) =>
      !(
        doc.suser === window.deleteUser
      )
  );
  localStorage.setItem("shared_documents", JSON.stringify(updatedDocuments));
  refreshUserDocumentTable();
  var modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("deleteModal")
  );
  modal.hide();
}

// Function to refresh the user document table with shared documents
function refreshUserDocumentTable() {
  const sharedDocuments =
    JSON.parse(localStorage.getItem("shared_documents")) || [];
  const table = document.getElementById("userDocumentTable");
  // Remove all rows except the header
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  for (let i = 0; i < sharedDocuments.length; i++) {
    const document = sharedDocuments[i];
    table.insertAdjacentHTML(
      "beforeend",
      `
          <tr>
            <td>${document.suser}</td>
            <td>
            <a data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="setDeleteUser('${document.suser}')" href="#">Remove</a>
            </td>
          </tr>
          `
    );
  }
}

// Function to add a shared document entry for a selected user
function AddShare() {
  const selectedUser = userSelect.value;
  const documentName = decodeURIComponent(
    window.location.href.split("name=")[1]
  );
  const sharedDocuments =
    JSON.parse(localStorage.getItem("shared_documents")) || [];
  sharedDocuments.push({
    sname: documentName,
    slabel: JSON.parse(
      localStorage.getItem("local_documents")
    ).find((doc) => doc.name === documentName).label,
    suser: selectedUser,
    semail: JSON.parse(sessionStorage.getItem("loggedInUser")).email
  });
  localStorage.setItem("shared_documents", JSON.stringify(sharedDocuments));
  refreshUserDocumentTable();
}
