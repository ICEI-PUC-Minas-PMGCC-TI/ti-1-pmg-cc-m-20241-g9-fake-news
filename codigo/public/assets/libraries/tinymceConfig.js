tinymce.init({
  selector: "textarea#content",
  language: 'pt_BR',
  plugins:
    "autolink charmap emoticons fullscreen help image link lists advlist media preview searchreplace table visualblocks",
  toolbar:
    "undo redo searchreplace | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | help",
  menu: { tools: { title: "Tools", items: "listprops" } },
  setup: function (editor) {
    editor.on('change', function () {
      editor.save(); // Ensure the textarea content is updated
    });
  }
});

// Prevent Bootstrap dialog from blocking focusin
document.addEventListener('focusin', (e) => {
  if (e.target.closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
    e.stopImmediatePropagation();
  }
});