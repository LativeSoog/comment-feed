const getRenderListComment = (comment, index) => {
  return comment.isEdit == true ?
    `<li class="comment">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          <textarea id="edit${index}" class="editText" type="textarea">${comment.text}</textarea>
        </div>
        <div class="comment-text">
        <button class="save-comment" data-button-save=${index}>Cохранить</button>
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.activeClass}" data-button-like="${index}"></button>
        </div>
      </div>
    </li>` :
    `<li class="comment" data-comment-content="${index}">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
        </div>
        <div class="comment-text">
        <button class="edit-comment" data-button-edit=${index}>Редактировать</button>
        <button class="delete-comment" data-button-delete=${comment.id}>Удалить</button>
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button class="like-button ${comment.activeClass}" data-button-like="${index}"></button>
        </div>
      </div>
    </li>`
}

export { getRenderListComment }