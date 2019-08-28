
 var title = $("#title").val(),
     user = $('#user').val(),
     password = $('#password').val(),
     contents = $('#contents').val();

$('#add-btn').click((e) => {
  e.preventDefault();
  
  $.ajax({
    url:'../../app/board/add',
    type: 'post',
    dataType: 'text',
    data: "title=" + encodeURIComponent(title) +
    "&user=" + encodeURIComponent(user) +
    "&password=" + encodeURIComponent(password) +
    "&contents=" + encodeURIComponent(contents),
    contentType: "application/x-www-form-urlencoded",
    success: function() {
      alert('등록 성공!');
    },
    error: function() {
      alert('등록 실패!');
    }
  });

}




// document.querySelector('#delete-btn').onclick = () => {
//   var xhr = new XMLHttpRequest()
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState != 4 || xhr.status != 200)
//       return;
    
//     var data = JSON.parse(xhr.responseText);
    
//     if (data.status == 'success') {
//       location.href = "index.html"
        
//     } else {
//       alert('삭제 실패입니다!\n' + data.message)
//     }
//   };
//   var no = document.querySelector('#no').value;
//   xhr.open('GET', '../../app/json/board/delete?no=' + no, true)
//   xhr.send();
// };

// document.querySelector('#update-btn').onclick = () => {
//   var xhr = new XMLHttpRequest()
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState != 4 || xhr.status != 200)
//       return;
    
//     var data = JSON.parse(xhr.responseText);
    
//     if (data.status == 'success') {
//       location.href = "index.html"
        
//     } else {
//       alert('변경 실패입니다!\n' + data.message)
//     }
//   };
//   xhr.open('POST', '../../app/json/board/update', true)
//   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
//   var no = document.querySelector('#no').value;
//   var contents = document.querySelector('#contents').value;
  
//   var qs = 'contents=' + encodeURIComponent(contents) +
//     '&no=' + no;
  
//   xhr.send(qs);
// };

// function loadData(no) {
//   var xhr = new XMLHttpRequest()
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState != 4 || xhr.status != 200)
//       return;
    
//     var data = JSON.parse(xhr.responseText);
//     console.log(data);
//     document.querySelector('#no').value = data.no;
//     document.querySelector('#contents').value = data.contents;
//     document.querySelector('#createdDate').value = data.createdDate;
//     document.querySelector('#viewCount').value = data.viewCount;
//   };
//   xhr.open('GET', '../../app/json/board/detail?no=' + no, true)
//   xhr.send()
// }







