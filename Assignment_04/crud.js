$(document).ready(function () {
  const API_URL = "https://jsonplaceholder.typicode.com/posts";
  const $loading = $("#loading");
  const $table = $("#postsTable");
  const $form = $("#postForm");
  const $saveBtn = $("#saveBtn");
  const $cancelBtn = $("#cancelBtn");

  // Local storage key for your custom posts
  const LOCAL_KEY = "myPosts";

  function showLoading(show) {
    show ? $loading.show() : $loading.hide();
  }

  // Get local posts
  function getLocalPosts() {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  }

  // Save local posts
  function setLocalPosts(posts) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(posts));
  }

  // Render posts in table
  function renderPosts(posts) {
    $table.empty();
    posts.forEach((post) => {
      $table.append(`
        <tr>
          <td>${post.id}</td>
          <td>${post.title}</td>
          <td>${post.body}</td>
          <td>
            <button class="btn btn-sm editBtn" data-id="${post.id}">Edit</button>
            <button class="btn btn-sm deleteBtn" data-id="${post.id}">Delete</button>
          </td>
        </tr>
      `);
    });
  }

  // Fetch API posts + merge with local posts
  function fetchPosts() {
    showLoading(true);
    $.get(API_URL)
      .done(function (apiPosts) {
        const localPosts = getLocalPosts();
        // Merge API posts (first 10) with local posts
        const allPosts = [...apiPosts.slice(0, 10), ...localPosts];
        renderPosts(allPosts);
      })
      .fail(() => alert("Error fetching posts"))
      .always(() => showLoading(false));
  }

  fetchPosts();

  // Create / Update
  $form.on("submit", function (e) {
    e.preventDefault();
    const id = $("#postId").val();
    const postData = {
      title: $("#title").val(),
      body: $("#body").val(),
      userId: 1,
    };

    let localPosts = getLocalPosts();

    if (id) {
      // Update local post if exists
      localPosts = localPosts.map((post) =>
        post.id == id ? { ...post, ...postData } : post
      );
      setLocalPosts(localPosts);
      alert("✅ Post updated!");
    } else {
      // Add new post to local storage
      const newId =
        localPosts.length > 0
          ? Math.max(...localPosts.map((p) => p.id)) + 1
          : 101; // start after API posts
      localPosts.push({ id: newId, ...postData });
      setLocalPosts(localPosts);
      alert("✅ Post added!");
    }

    $form[0].reset();
    $("#postId").val("");
    $saveBtn.text("Add Post");
    $cancelBtn.hide();
    fetchPosts();
  });

  // Edit (prefill form)
  $table.on("click", ".editBtn", function () {
    const id = $(this).data("id");
    const localPosts = getLocalPosts();
    const allPosts = [...localPosts];
    const post = allPosts.find((p) => p.id == id);

    if (post) {
      $("#postId").val(post.id);
      $("#title").val(post.title);
      $("#body").val(post.body);
      $saveBtn.text("Update Post");
      $cancelBtn.show();
    } else {
      alert("⚠️ Cannot edit API posts.");
    }
  });

  // Cancel editing
  $cancelBtn.on("click", function () {
    $form[0].reset();
    $("#postId").val("");
    $saveBtn.text("Add Post");
    $cancelBtn.hide();
  });

  // Delete
  $table.on("click", ".deleteBtn", function () {
    const id = $(this).data("id");
    let localPosts = getLocalPosts();
    if (localPosts.some((p) => p.id == id)) {
      if (confirm("Are you sure you want to delete this post?")) {
        localPosts = localPosts.filter((p) => p.id != id);
        setLocalPosts(localPosts);
        alert("🗑️ Post deleted!");
        fetchPosts();
      }
    } else {
      alert("⚠️ Cannot delete API posts.");
    }
  });
});
