
var param = location.href.split('?')[1];

var no = 0,
    title = '',
    user = '',
    password = '',
    contents = '';

if (param) {
  $('h2').text('게시물 수정');
  loadData(param.split('=')[1]);
  var el = document.querySelectorAll('.bow-new-item');
  for (e of el) {
    e.style.display = 'none';
  }
} else {
  $('h2').text('새 글');
  var el = document.querySelectorAll('.bow-update-item');
  for (e of el) {
    e.style.display = 'none';
  }
}

// 등록버튼 클릭이벤트
$('#add-btn').click((e) => {
  
  title = $("#title").val(),
  user = $('#user').val(),
  password = $('#password').val(),
  contents = $('#contents').val();
  
  if (title.length < 1) {
    alert('제목을 입력하세요.');
    $('#title').focus();
    return false;
    
  } else if (user.length < 1) {
    alert('작성자 명을 입력하세요.');
    $('#user').focus();
    return false;
    
  } else if (password.length < 1) {
    alert('비밀번호를 입력하세요.');
    $('#password').focus();
    return false;
    
  } else if (contents.length < 1 ||
      contents.trim().length == 0) {
    alert('내용을 입력하세요.');
    $('#contents').val('');
    $('#contents').focus();
    return false;
  }
  
  if (title.length > 30) {
    titleLength($('#title'));
    return false;
  }
  
  if (!checkPassword(password)) {
    alert('숫자,영문자,특수문자 조합으로\n중복문자 4개 이하\n6자리 이상 사용해야 합니다');
    setTimeout(function() {
      $("#password").focus();
    }, 10);
    return false;
  }
  
  if (contents.length > 500) {
    contentsLength($('#contents'));
    return false;
  }
  
  $.ajax({
    url:'../../bowtech/app/board/add',
    type: 'post',
    data: "title=" + encodeURIComponent(title) +
    "&user=" + encodeURIComponent(user) +
    "&password=" + encodeURIComponent(password) +
    "&contents=" + encodeURIComponent(contents),
    contentType: "application/x-www-form-urlencoded",
    success: function(data) {
      if (data.status == 'success') {
        location.href = "index.html";
      } else {
        alert('등록 실패!');
      }
    },
    error: function() {
      alert('등록 실패!');
    }
  });

});

// 변경버튼 클릭이벤트
$('#update-btn').click((e) => {
  
  no = $('#no').val(),
  title = $('#title').val(),
  user = $('#user').val(),
  password = $('#password').val(),
  contents = $('#contents').val();
  
  if (title.length < 1) {
    alert('제목을 입력하세요.');
    $('#title').focus();
    return false;
    
  } else if (user.length < 1) {
    alert('작성자 명을 입력하세요.');
    $('#user').focus();
    return false;
    
  } else if (contents.length < 1 ||
      contents.trim().length == 0) {
    alert('내용을 입력하세요.');
    $('#contents').focus();
    return false;
  }
  
  if (title.length > 30) {
    titleLength($('#title'));
    return false;
  }
  
  if (!checkPassword(password)) {
    alert('숫자,영문자,특수문자 조합으로\n중복문자 4개 이하\n6자리 이상 사용해야 합니다');
    setTimeout(function() {
      $("#password").focus();
    }, 10);
    return false;
  }
  
  if (contents.length > 500) {
    contentsLength($('#contents'));
    return false;
  }
  
  if (!confirm('정말 변경하시겠습니까?')) {
    return false;
  }
  
  $.ajax({
    url:'../../bowtech/app/board/update',
    type: 'post',
    data: "no=" + encodeURIComponent(no) +
    "&title=" + encodeURIComponent(title) +
    "&user=" + encodeURIComponent(user) +
    "&password=" + encodeURIComponent(password) +
    "&contents=" + encodeURIComponent(contents),
    contentType: "application/x-www-form-urlencoded",
    success: function(data) {
      if (data.status == 'success') {
        location.href = "view.html?no=" + no;
      } else {
        alert('변경 실패!')
      }
    },
    error: function() {
      alert('변경 실패!');
    }
  });

});

// 취소버튼 클릭이벤트
$("#cancel-btn").click((e) => {
  window.history.back();
});

// getJson 방식 데이터 로딩 함수 정의
function loadData(no) {
  
  $.getJSON('../../bowtech/app/board/detail?no=' + no, 
      function(obj) {
        
        var board = obj.board;
        
        $('#no').val(board.no);
        $('#title').val(board.title);
        $('#user').val(board.user);
        $('#contents').val(board.contents);
        
        $('.count-num').html(board.contents.length);
        
      }); // getJSON()
  
} // loadData()


// 제목
// blur 이벤트
$('#title').blur(function() {
  if ($(this).val().startsWith(' ')) {
    alert('제목은 공백으로 시작할 수 없습니다.');
    $(this).val($(this).val().trim()).focus();
  }
  if ($(this).val().endsWith(' ')) {
    $(this).val($(this).val().trim());
  }
  titleLength($(this));
});
// keyup 이벤트
$('#title').keyup(function() {
  titleLength($(this));
});
// 글자 수 제한 함수
function titleLength(obj) {
  if (obj.val().length > 30) {
    alert('제목은 30자까지 입력할 수 있습니다.');
    title = obj.val(obj.val().substring(0,30));
    obj.focus();
  }
}

// 작성자
// blur 이벤트
$('#user').blur(function() {
  var userExp = /^[가-힣|a-z|A-Z|0-9|\*]+$/;
                
  if ($(this).val().length > 0) {
    if (!userExp.test($(this).val())) {
      alert('한글, 영어, 숫자만 입력이 가능합니다.');
      $(this).val('').focus();
    }
  }
});
// keyup 이벤트
$('#user').keyup(function() {
  if ($(this).val().length > $(this).attr('maxlength')) {
    userLength($(this));
  }
});
// 글자 수 제한 함수
function userLength(obj) {
  alert('작성자 명은 6자까지 입력할 수 있습니다.');
  user = obj.val(obj.val().substring(0,6));
  obj.focus();
}

// 비밀번호
// keyup 이벤트 (한글 입력 안되게 처리)
$("#password").blur(function() {
  if (!checkPassword($(this).val())) {
    alert('숫자,영문자,특수문자 조합으로\n중복문자 4개 이하\n6자리 이상 사용해야 합니다');
    setTimeout(function() {
      $("#password").focus();
    }, 10);
  }
});

// 내용
// blur & keyup 이벤트
$('#contents').blur(function() {
  contentsLength($(this));
}).keyup(function() {
  contentsLength($(this));
});
// 글자 수 제한 함수
function contentsLength(obj) {
  $('.count-num').html(obj.val().length);
  if (obj.val().length > 500) {
    alert('내용은 500자까지 입력할 수 있습니다.');
    contents = obj.val(obj.val().substring(0,500));
    $('.count-num').html(500);
    obj.focus();
  }
}

function checkPassword(password){
  
  if (password.length < 1) {
    return true;
  }
  
  if(!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,25}$/.test(password)){
    return false;
  }    
  var checkNumber = password.search(/[0-9]/g);
  var checkEnglish = password.search(/[a-z]/ig);
  if(checkNumber <0 || checkEnglish <0){
    return false;
  }
  if(/(\w)\1\1\1/.test(password)){
    return false;
  }
  return true;
}




