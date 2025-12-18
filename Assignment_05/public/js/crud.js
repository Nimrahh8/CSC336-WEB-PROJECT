// public/js/crud.js - Client-side CRUD operations
$(document).ready(function () {
  const API_URL = "/crud/api/posts";
  const EXTERNAL_API = "https://jsonplaceholder.typicode.com/posts";
  const $loading = $("#loading");
  const $table = $("#postsTable");
  const $form = $("#postForm");
  const $saveBtn = $("#saveBtn");
  const $cancelBtn = $("#cancelBtn");

  function showLoading(show) {
    show ? $loading.show() : $loading.hide();
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

  // Fetch posts from both APIs
  function fetchPosts() {
    showLoading(true);
    
    Promise.all([
      $.get(EXTERNAL_API),
      $.get(API_URL)
    ])
      .then(([externalPosts, localPosts]) => {
        // Merge first 10 external posts with local posts
        const allPosts = [...externalPosts.slice(0, 10), ...localPosts];
        renderPosts(allPosts);
      })
      .catch(() => alert("Error fetching posts"))
      .finally(() => showLoading(false));
  }

  fetchPosts();

  // Create / Update
  $form.on("submit", function (e) {
    e.preventDefault();
    const id = $("#postId").val();
    const postData = {
      title: $("#title").val(),
      body: $("#body").val()
    };

    if (id) {
      // Update existing post
      $.ajax({
        url: `${API_URL}/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(postData),
        success: () => {
          alert("✅ Post updated!");
          $form[0].reset();
          $("#postId").val("");
          $saveBtn.text("Add Post");
          $cancelBtn.hide();
          fetchPosts();
        },
        error: () => alert("Error updating post")
      });
    } else {
      // Create new post
      $.ajax({
        url: API_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(postData),
        success: () => {
          alert("✅ Post added!");
          $form[0].reset();
          fetchPosts();
        },
        error: () => alert("Error creating post")
      });
    }
  });

  // Edit (prefill form)
  $table.on("click", ".editBtn", function () {
    const id = $(this).data("id");
    
    $.get(`${API_URL}/${id}`)
      .done((post) => {
        $("#postId").val(post.id);
        $("#title").val(post.title);
        $("#body").val(post.body);
        $saveBtn.text("Update Post");
        $cancelBtn.show();
        $('html, body').animate({scrollTop: 0}, 300);
      })
      .fail(() => {
        alert("⚠️ Cannot edit external API posts.");
      });
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
    
    if (confirm("Are you sure you want to delete this post?")) {
      $.ajax({
        url: `${API_URL}/${id}`,
        method: "DELETE",
        success: () => {
          alert("🗑️ Post deleted!");
          fetchPosts();
        },
        error: () => {
          alert("⚠️ Cannot delete external API posts.");
        }
      });
    }
  });
});