
var param = location.href.split('?')[1],
    board_no = param.split('=')[1],
    passwordSwitch = 0;

// 목록 버튼 클릭이벤트
$("#back-btn").click((e) => {
  window.history.back();
});

// 업데이트 버튼 클릭 이벤트
$('#update-btn').click((e) => {
  e.preventDefault();
  $('#passwordModal').modal('show');
  passwordSwitch = 1; // 업데이트
});

// 삭제 버튼 클릭 이벤트
$('#delete-btn').click(() => {
  $('#passwordModal').modal('show');
  passwordSwitch = 2; // 삭제
});

// 데이터 로딩 함수 호출
loadData(board_no);

// getJson 방식 데이터 로딩 함수 정의
function loadData(no) {
  
  $.getJSON('../../bowtech/app/board/detail?no=' + no, 
      function(obj) {
        
        if (obj.status == 'fail') {
          alert('오류 발생!');
          window.history.back();
        }
        
        var board = obj.board;
        
        var date = board.createdDate.substring(0,10),
            time = board.createdDate.substring(11,19);
        
        $('#board-title').val(board.title);
        $('#board-user').val(board.user);
        $('#board-viewCount').val(board.viewCount);
        $('#board-createdDate').val(date + ' ' + time);
        $('#board-contents').val(board.contents);
        
      }); // getJSON()
  
} // loadData()


// password 입력 후 확인 버튼
$('#confirm-btn').click(() => {
  passwordConfirm($(this));
});

// modal 닫힐 때 내용 삭제 열릴 때 포커스
$('#passwordModal').on('hidden.bs.modal', () => {
  $('#password').val('');
  
}).on('shown.bs.modal', () => {
  $('#password').focus();
});

// 삭제 함수
function boardDelete() {
  $.getJSON('../../bowtech/app/board/delete?no=' + board_no, 
      function(obj) {
    
    if (obj.status == 'success') {
      alert('삭제 되었습니다.');
      window.location.href = '.';
    } else {
      alert('삭제 실패!');
    }
  }); // getJSON()
}

// 비밀번호 엔터 이벤트
$("#password").keydown(function(key) {
  if (key.which == 13) {
    passwordConfirm($(this));
  }
});

function passwordConfirm(obj) {
  
  var password = $('#password').val();
  
  if (password.length == 0 || password == undefined) {
    alert('비밀번호를 입력하세요!');
    $('#password').focus();
    return false;
  }
  
  $.ajax({
    async: true,
    type : 'POST',
    data : {no : board_no, password : password},
    url : "../../bowtech/app/board/passwordcheck",
    success : function(data) {
      if (!data.result){
        alert('비밀번호가 틀렸습니다!');
        $('#password').focus();
        return false;
      }
      
      if (passwordSwitch == 1) {
        passwordSwitch = 0;
        window.location.href = 'form.html?no=' + board_no;
        
      } else if (passwordSwitch == 2) {
        if (!confirm('정말 삭제 하시겠습니까?')) {
          return false;
        } else {
          passwordSwitch = 0;
          boardDelete();
        }
      }
    },
    error : function(error) {
      alert('오류 발생!');
      return false;
    }
  });
}


